/* Game Master's Keep — Phase 4.3 opt-in cloud sync.
   Local browser storage remains the working copy. Cloud sync is enabled only
   after an explicit user action and only for the currently signed-in account. */
(() => {
  const $ = (id) => document.getElementById(id);
  const BASE_KEY = 'gmk-phase-4-3-cloud-sync';
  let signedInUser = null;
  let busy = false;
  let rerunRequested = false;
  let timer = null;

  function accountKey() {
    const identity = String(signedInUser?.id || signedInUser?.email || 'unknown');
    return `${BASE_KEY}:${identity}`;
  }
  function enabled() {
    return localStorage.getItem(`${accountKey()}:enabled`) === 'true';
  }
  function setEnabled(value) {
    localStorage.setItem(`${accountKey()}:enabled`, value ? 'true' : 'false');
  }
  function fingerprintsKey() { return `${accountKey()}:fingerprints`; }
  function readFingerprints() {
    try { return JSON.parse(localStorage.getItem(fingerprintsKey()) || '{}'); }
    catch { return {}; }
  }
  function writeFingerprints(value) {
    localStorage.setItem(fingerprintsKey(), JSON.stringify(value));
  }
  function status(message, kind = 'info') {
    const el = $('cloudSyncStatus');
    if (!el) return;
    el.textContent = message;
    el.dataset.kind = kind;
  }
  function buttons() {
    const configured = !!window.GMKCloud?.configured;
    const signedIn = !!signedInUser;
    if ($('cloudCheckButton')) $('cloudCheckButton').disabled = !configured || busy;
    if ($('cloudEnableButton')) {
      $('cloudEnableButton').disabled = !configured || !signedIn || busy;
      $('cloudEnableButton').textContent = enabled() ? 'Pause cloud sync' : 'Enable cloud sync';
    }
    if ($('cloudImportButton')) $('cloudImportButton').disabled = !configured || !signedIn || busy;
    if (!configured) status('Cloud API not configured yet. The database migration is complete, but the Neon Function must be deployed and its URL added to the browser client.', 'warning');
    else if (!signedIn) status('Sign in to check or connect your cloud campaigns.', 'info');
    else if (enabled()) status('Cloud sync is enabled for this signed-in account. Local browser storage remains the working copy.', 'success');
    else status('Cloud API is configured. Cloud sync is currently off; your local campaigns are unchanged.', 'info');
  }
  function setBusy(value) {
    busy = value;
    const configured = !!window.GMKCloud?.configured;
    if ($('cloudCheckButton')) $('cloudCheckButton').disabled = !configured || busy;
    if ($('cloudEnableButton')) {
      $('cloudEnableButton').disabled = !configured || !signedInUser || busy;
      $('cloudEnableButton').textContent = enabled() ? 'Pause cloud sync' : 'Enable cloud sync';
    }
    if ($('cloudImportButton')) $('cloudImportButton').disabled = !configured || !signedInUser || busy;
  }
  function campaigns() {
    const list = window.GMKCampaignBridge?.getCampaigns?.();
    if (!Array.isArray(list)) throw new Error('The campaign workspace is not ready. Refresh the page and try again.');
    return list;
  }
  function stablePayload(campaign) {
    const source = JSON.stringify(window.GMKCloud.payloadForCampaign(campaign));
    let a = 2166136261, b = 2246822519;
    for (let i = 0; i < source.length; i++) {
      const code = source.charCodeAt(i);
      a = Math.imul(a ^ code, 16777619);
      b = Math.imul(b ^ (code + i), 3266489917);
    }
    return `${(a >>> 0).toString(16)}-${(b >>> 0).toString(16)}-${source.length}`;
  }

  async function checkConnection() {
    setBusy(true);
    status('Checking the Neon Function and database…');
    try {
      const result = await window.GMKCloud.health();
      if (result?.status !== 'ok' || result?.database !== 'connected') throw new Error('The API responded, but the database health check did not pass.');
      status('Connected: Neon Function and database are responding.', 'success');
    } catch (error) {
      status(error.message || 'Could not reach the Neon Function.', 'error');
    } finally { setBusy(false); }
  }

  async function syncLocalCampaigns({ firstRun = false } = {}) {
    if (!signedInUser) throw new Error('Sign in before syncing campaigns.');
    if (!window.GMKCloud?.configured) throw new Error('The cloud API URL has not been configured yet.');
    const local = campaigns();
    const remote = await window.GMKCloud.listCampaigns();
    const remoteByLocalId = new Map(remote.map(c => [String(c.id), c]));
    const fingerprints = readFingerprints();
    let changed = 0;

    for (const campaign of local) {
      const localId = String(campaign.id);
      const fingerprint = stablePayload(campaign);
      const remoteCampaign = remoteByLocalId.get(localId);
      if (remoteCampaign && fingerprints[localId] === fingerprint) continue;

      if (remoteCampaign) {
        await window.GMKCloud.updateCampaign(remoteCampaign._cloudId, campaign);
      } else {
        await window.GMKCloud.createCampaign(campaign);
      }
      fingerprints[localId] = fingerprint;
      changed++;
    }
    writeFingerprints(fingerprints);
    return { total: local.length, changed, remoteCount: remote.length, firstRun };
  }

  async function runSync(firstRun = false) {
    if (busy) { rerunRequested = true; return; }
    setBusy(true);
    status(firstRun ? 'Preparing your local campaigns for their first cloud sync…' : 'Saving campaign changes to the cloud…');
    try {
      const result = await syncLocalCampaigns({ firstRun });
      status(result.changed
        ? `${result.changed} campaign${result.changed === 1 ? '' : 's'} synced. ${result.total} local campaign${result.total === 1 ? '' : 's'} checked.`
        : `All ${result.total} local campaign${result.total === 1 ? '' : 's'} are up to date in the cloud.`,
        'success');
    } catch (error) {
      status(error.message || 'Cloud sync failed. Your local changes remain saved in this browser.', 'error');
    } finally {
      setBusy(false);
      if (rerunRequested) {
        rerunRequested = false;
        scheduleSync();
      }
    }
  }

  function scheduleSync() {
    if (!enabled() || !signedInUser) return;
    clearTimeout(timer);
    timer = setTimeout(() => runSync(false), 900);
  }

  async function importCloudOnlyCampaigns() {
    setBusy(true);
    status('Checking for campaigns that exist only in the cloud…');
    try {
      const remote = await window.GMKCloud.listCampaigns();
      const local = campaigns();
      const known = new Set(local.map(c => String(c.id)));
      const additions = remote.filter(c => !known.has(String(c.id)));
      if (!additions.length) {
        status('No cloud-only campaigns were found. Your local campaigns were not changed.', 'success');
        return;
      }
      const merged = [...additions, ...local];
      window.GMKCampaignBridge.replaceCampaigns(merged);
      const fingerprints = readFingerprints();
      for (const campaign of additions) fingerprints[String(campaign.id)] = stablePayload(campaign);
      writeFingerprints(fingerprints);
      status(`${additions.length} cloud campaign${additions.length === 1 ? '' : 's'} added to this browser. Image files are not included in this phase.`, 'success');
    } catch (error) {
      status(error.message || 'Could not import cloud campaigns. Local data remains unchanged.', 'error');
    } finally { setBusy(false); }
  }

  $('cloudCheckButton')?.addEventListener('click', checkConnection);
  $('cloudEnableButton')?.addEventListener('click', async () => {
    if (enabled()) {
      setEnabled(false);
      status('Cloud sync paused. Your local campaigns and existing cloud copies are unchanged.', 'info');
      buttons();
      return;
    }
    setBusy(true);
    status('Uploading your local campaign records. Existing cloud records with matching local IDs will be updated.');
    try {
      const result = await syncLocalCampaigns({ firstRun: true });
      setEnabled(true);
      status(`Cloud sync enabled. ${result.changed} campaign${result.changed === 1 ? '' : 's'} uploaded or updated.`, 'success');
    } catch (error) {
      status(error.message || 'Cloud sync could not be enabled. Local data remains unchanged.', 'error');
    } finally { setBusy(false); }
  });
  $('cloudImportButton')?.addEventListener('click', importCloudOnlyCampaigns);

  document.addEventListener('gmk:authenticated', event => {
    signedInUser = event.detail?.user || null;
    buttons();
    if (enabled() && window.GMKCloud?.configured) scheduleSync();
  });
  document.addEventListener('gmk:signed-out', () => {
    signedInUser = null;
    clearTimeout(timer);
    buttons();
  });
  document.addEventListener('gmk:campaigns-changed', scheduleSync);
  document.addEventListener('gmk:campaign-deleted', async event => {
    if (!enabled() || !signedInUser || !window.GMKCloud?.configured) return;
    const localId = String(event.detail?.id || '');
    if (!localId) return;
    try {
      const remote = await window.GMKCloud.listCampaigns();
      const match = remote.find(c => String(c.id) === localId);
      if (match) await window.GMKCloud.deleteCampaign(match._cloudId);
      const fingerprints = readFingerprints();
      delete fingerprints[localId];
      writeFingerprints(fingerprints);
      status('The deleted campaign was also removed from the cloud.', 'success');
    } catch (error) {
      status(`Campaign deleted locally, but its cloud copy could not be deleted: ${error.message}`, 'error');
    }
  });

  buttons();
})();
