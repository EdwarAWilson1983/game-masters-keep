/* Game Master's Keep — Phase 4.3 browser API client.
   Configure API_BASE_URL only after the Neon Function has been deployed. */
(() => {
 const API_BASE_URL = 'https://br-wispy-forest-bd3vedg0-gmkapi.compute.c-8.us-east-2.aws.neon.tech/';
  const configured = !API_BASE_URL.includes('YOUR-DEPLOYED-NEON-FUNCTION-URL');

  function stripBinaryAssets(value) {
    if (Array.isArray(value)) return value.map(stripBinaryAssets);
    if (!value || typeof value !== 'object') {
      if (typeof value === 'string' && /^data:image\/[a-z0-9.+-]+;base64,/i.test(value)) return null;
      return value;
    }
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      // Artwork, portraits and map images are deliberately kept in this browser
      // until the private Object Storage upload/download routes are implemented.
      if (typeof item === 'string' && /^data:image\/[a-z0-9.+-]+;base64,/i.test(item)) {
        result[key] = null;
      } else {
        result[key] = stripBinaryAssets(item);
      }
    }
    return result;
  }

  function campaignPayload(campaign) {
    const { id, created, updated, owner_id, ownerId, _cloudId, ...rest } = campaign || {};
    const { name, universe, status, premise, ...workspace } = rest;
    workspace._gmkLocalId = String(id || campaign?._gmkLocalId || '');
    return {
      name,
      universe,
      status,
      premise,
      campaignData: stripBinaryAssets(workspace),
    };
  }

  function normalizeCampaign(campaign) {
    const localId = campaign?._gmkLocalId || campaign?.id;
    const { _gmkLocalId, ...workspace } = campaign || {};
    return {
      ...workspace,
      id: String(localId),
      _gmkLocalId: String(localId),
      _cloudId: campaign?.id,
      sessions: Array.isArray(workspace.sessions) ? workspace.sessions : [],
      characters: Array.isArray(workspace.characters) ? workspace.characters : [],
      combatEncounters: Array.isArray(workspace.combatEncounters) ? workspace.combatEncounters : [],
      artworks: Array.isArray(workspace.artworks) ? workspace.artworks : [],
      npcs: Array.isArray(workspace.npcs) ? workspace.npcs : [],
      customCreatures: Array.isArray(workspace.customCreatures) ? workspace.customCreatures : [],
      savedEncounters: Array.isArray(workspace.savedEncounters) ? workspace.savedEncounters : [],
      customItems: Array.isArray(workspace.customItems) ? workspace.customItems : [],
      adventures: Array.isArray(workspace.adventures) ? workspace.adventures : [],
      places: Array.isArray(workspace.places) ? workspace.places : [],
      factions: Array.isArray(workspace.factions) ? workspace.factions : [],
    };
  }

  async function request(path, options = {}) {
    if (!configured) throw new Error('The Game Master’s Keep cloud API has not been configured yet. Deploy the Neon Function and add its URL to phase-4-3/client/gmk-cloud.js.');
    if (!window.GMKAuth?.getAccessToken) throw new Error('Authentication is not ready. Please sign in again.');
    const token = await window.GMKAuth.getAccessToken();
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}${path}`, {
      ...options,
      headers: {
        authorization: `Bearer ${token}`,
        ...(options.body ? { 'content-type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Cloud request failed (${response.status}).`);
    return payload;
  }

  window.GMKCloud = Object.freeze({
    get configured() { return configured; },
    health: async () => {
      if (!configured) throw new Error('The Game Master’s Keep cloud API URL has not been configured.');
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/health`, { cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Health check failed (${response.status}).`);
      return payload;
    },
    listCampaigns: async () => (await request('/api/campaigns')).campaigns.map(normalizeCampaign),
    createCampaign: async (campaign) => normalizeCampaign((await request('/api/campaigns', {
      method: 'POST', body: JSON.stringify(campaignPayload(campaign)),
    })).campaign),
    updateCampaign: async (id, campaign) => normalizeCampaign((await request(`/api/campaigns/${encodeURIComponent(campaign._cloudId || id)}`, {
      method: 'PUT', body: JSON.stringify(campaignPayload(campaign)),
    })).campaign),
    deleteCampaign: (id) => request(`/api/campaigns/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    payloadForCampaign: campaignPayload,
  });
})();
