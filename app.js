const STORE_KEY = "gmk-prototype-campaigns-v1";
const $ = (id) => document.getElementById(id);
let campaigns = loadCampaigns();
let currentUniverse = "fantasy";
let editingCampaignId = null;

const universeNames = {
  fantasy:"THE CHRONICLES OF PUMA",
  starfleet:"STARFLEET COMMAND",
  galaxy:"GALACTIC ADVENTURES"
};
const universeCopy = {
  fantasy:{title:"Your Keep Awaits.",intro:"A quiet place to plan bold adventures, keep your worlds in order, and prepare for the next session.",hero:"Every great adventure<br>starts with a story.",heroText:"Bring your campaigns, characters, session notes and reference tools together in one organized place."},
  starfleet:{title:"Starfleet Command Online.",intro:"Command your vessel, coordinate your crew and explore the final frontier.",hero:"Space. The final frontier.",heroText:"Mission control, crew records, ship operations and stellar navigation — organized in one Starfleet computer interface."},
  galaxy:{title:"The Galaxy Is Yours.",intro:"Keep your operations, allies, rivals and adventures organized across a galaxy of possibilities.",hero:"A galaxy of stories<br>begins here.",heroText:"Bring your characters, starships, factions, mission notes and campaign records together."}
};

function loadCampaigns(){
  try {
    const saved=JSON.parse(localStorage.getItem(STORE_KEY)||"[]");
    if(!Array.isArray(saved)) return [];
    return saved.filter(c=>c&&typeof c==="object"&&c.name).map(c=>({
      id:String(c.id||makeId()),
      name:String(c.name).slice(0,70),
      universe:["fantasy","starfleet","galaxy"].includes(c.universe)?c.universe:"fantasy",
      premise:String(c.premise||"").slice(0,1200),
      status:["active","paused","completed"].includes(c.status)?c.status:"active",
      created:c.created||new Date().toISOString(),
      updated:c.updated||c.created||new Date().toISOString(),
      sessions:Array.isArray(c.sessions)?c.sessions:[],
      characters:Array.isArray(c.characters)?c.characters:[],
      artworks:Array.isArray(c.artworks)?c.artworks:[]
    }));
  } catch { return []; }
}
function makeId(){return (crypto.randomUUID?crypto.randomUUID():`gmk-${Date.now()}-${Math.random().toString(36).slice(2,8)}`)}
function persistCampaigns(){localStorage.setItem(STORE_KEY,JSON.stringify(campaigns))}
function save(){persistCampaigns();render()}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
function setUniverse(universe){
  currentUniverse=universe;
  document.body.dataset.universe=universe;
  const emblemFiles={fantasy:"assets/puma-visual-studio-emblem.png",starfleet:"assets/starfleet-visual-studio-emblem.png",galaxy:"assets/galactic-visual-studio-emblem.png"};
  const emblemAlts={fantasy:"The Chronicles of Puma twenty-sided die emblem",starfleet:"Starfleet Command insignia",galaxy:"Jedi and Sith balance emblem"};
  ["universeBrandEmblem","characterUniverseEmblem","artworkUniverseEmblem","chronicleUniverseEmblem"].forEach(id=>{
    const emblem=$(id);
    if(emblem){emblem.src=emblemFiles[universe]||emblemFiles.fantasy;emblem.alt=emblemAlts[universe]||emblemAlts.fantasy;}
  });
  document.querySelectorAll("[data-universe-choice]").forEach(b=>b.classList.toggle("active",b.dataset.universeChoice===universe));
  $("realmName").textContent=universeNames[universe];
  $("campaignUniverse").value=universe;
  if($("campaignUniverseFilter"))$("campaignUniverseFilter").value=universe;
  const copy=universeCopy[universe];
  $("welcomeTitle").textContent=copy.title;$("welcomeText").textContent=copy.intro;
  $("heroTitle").innerHTML=copy.hero;$("heroText").textContent=copy.heroText;
  const isFleet=universe==="starfleet";
  $("statsEyebrow").textContent=isFleet?"VESSEL STATUS":universe==="galaxy"?"GALACTIC INTELLIGENCE":"YOUR WORKSPACE";
  $("statsTitle").textContent=isFleet?"Command overview":universe==="galaxy"?"Campaign intelligence":"At a glance";
  $("campaignStatLabel").textContent=isFleet?"Active missions":universe==="galaxy"?"Active campaigns":"Campaigns";
  $("characterStatLabel").textContent=isFleet?"Crew complement":universe==="galaxy"?"Jedi, Sith & factions":"Characters & NPCs";
  $("sessionStatLabel").textContent=isFleet?"Mission logs":universe==="galaxy"?"Chronicles":"Session notes";
  $("questStatLabel").textContent=isFleet?"Open assignments":universe==="galaxy"?"Force encounters":"Open quests";
  $("heroTitle").innerHTML=copy.hero;
  render();
  if($("view-archives").classList.contains("active"))renderArchives();
}
function showView(view){
  document.querySelectorAll(".page-view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));
  document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  $("pageName").textContent=({dashboard:"Headquarters",campaigns:"Campaigns",characters:"Characters & NPCs",sessions:"Chronicle Room",library:"Rules Library",tools:"Game Tools",settings:"Settings & Backup",artwork:"Visual Creation Studio",archives:"Library & Archives"})[view]||view;
  if(view==="archives")renderArchives();
  $("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}
function openCampaignDialog(id=null){
  editingCampaignId=id;
  $("campaignForm").reset();
  $("campaignId").value="";
  if(id){
    const c=campaigns.find(x=>x.id===id);if(!c)return;
    $("campaignId").value=c.id;$("campaignName").value=c.name;
    $("campaignUniverse").value=c.universe;$("campaignStatus").value=c.status;
    $("campaignPremise").value=c.premise;
    $("campaignDialogEyebrow").textContent="UPDATE YOUR CHRONICLE";
    $("campaignDialogTitle").textContent="Edit campaign";
    $("saveCampaign").textContent="Save changes";
  }else{
    $("campaignUniverse").value=currentUniverse;$("campaignStatus").value="active";
    $("campaignDialogEyebrow").textContent="A NEW ADVENTURE";
    $("campaignDialogTitle").textContent="Create a campaign";
    $("saveCampaign").textContent="Create campaign";
  }
  $("campaignDialog").showModal();
  $("campaignName").focus();
}
function closeCampaignDialog(){$("campaignDialog").close();editingCampaignId=null}
function submitCampaign(e){
  e.preventDefault();
  const name=$("campaignName").value.trim();
  if(!name){toast("Please enter a campaign name.");$("campaignName").focus();return}
  const now=new Date().toISOString();
  const data={
    name,universe:$("campaignUniverse").value,status:$("campaignStatus").value,
    premise:$("campaignPremise").value.trim(),updated:now
  };
  if(editingCampaignId){
    const index=campaigns.findIndex(c=>c.id===editingCampaignId);
    if(index<0){toast("That campaign could not be found.");closeCampaignDialog();return}
    campaigns[index]={...campaigns[index],...data};
    closeCampaignDialog();save();toast("Campaign updated.");
  }else{
    campaigns.unshift({id:makeId(),...data,created:now,sessions:[],characters:[],artworks:[]});
    closeCampaignDialog();save();showView("campaigns");toast("Your campaign has been created.");
  }
}
function deleteCampaign(id){
  const c=campaigns.find(x=>x.id===id);if(!c)return;
  if(!confirm(`Delete “${c.name}”? This removes the campaign from this browser. Export a backup first if you may need it later.`))return;
  campaigns=campaigns.filter(x=>x.id!==id);save();toast("Campaign deleted.");
}
function statusLabel(status){return ({active:"ACTIVE",paused:"PAUSED",completed:"COMPLETED"})[status]||"ACTIVE"}
function campaignMarkup(c){
  const label=universeNames[c.universe]||"CAMPAIGN";
  const created=new Date(c.created).toLocaleDateString();
  const updated=new Date(c.updated||c.created).toLocaleDateString();
  return `<article class="campaign-card">
    <div class="card-top"><span>${escapeHTML(label)}</span><span class="campaign-status status-${c.status}">${statusLabel(c.status)}</span></div>
    <h3>${escapeHTML(c.name)}</h3>
    <p>${escapeHTML(c.premise||"Your adventure is ready to take shape.")}</p>
    <div class="card-date">CREATED ${escapeHTML(created)} · UPDATED ${escapeHTML(updated)}</div>
    <div class="campaign-actions">
      <button class="secondary-btn campaign-edit" data-edit-campaign="${escapeHTML(c.id)}">Edit</button>
      <button class="secondary-btn" data-open-chronicle="${escapeHTML(c.id)}">Chronicle</button>
      <button class="text-btn campaign-delete" data-delete-campaign="${escapeHTML(c.id)}">Delete</button>
    </div>
  </article>`;
}
function campaignsForCurrentUniverse(){return campaigns.filter(c=>c.universe===currentUniverse);}
function render(){
  const visibleCampaigns=campaignsForCurrentUniverse();
  const count=visibleCampaigns.length;
  if($("characterCampaignSelect"))renderCharacterWorkspace();
  if($("artworkCampaignSelect"))renderArtworkWorkspace();
  $("campaignCount").textContent=count;
  const charTotal=visibleCampaigns.reduce((n,c)=>n+(c.characters||[]).length,0);
  const sessionTotal=visibleCampaigns.reduce((n,c)=>n+(c.sessions||[]).length,0);
  $("characterStatCount").textContent=String(charTotal);$("sessionCount").textContent=String(sessionTotal);$("questCount").textContent="0";
  $("campaignTotal").textContent=count+" campaign"+(count===1?"":"s");
  const recent=$("recentCampaigns");
  if(!count){
    recent.className="empty-state";
    recent.innerHTML='<span class="empty-symbol">⚑</span><strong>Your first campaign is waiting.</strong><p>Create a campaign to start organizing its world, characters and adventures.</p><button class="secondary-btn" id="emptyCreateAgain">Create your first campaign</button>';
    $("emptyCreateAgain").onclick=()=>openCampaignDialog();
  }else{
    recent.className="campaign-grid";
    recent.innerHTML=visibleCampaigns.slice(0,2).map(c=>campaignMarkup(c)).join("");
  }
  const q=($("campaignSearch")?.value||"").trim().toLowerCase();
  const universe=currentUniverse;
  if($("campaignUniverseFilter"))$("campaignUniverseFilter").value=currentUniverse;
  const status=$("campaignStatusFilter")?.value||"all";
  const sort=$("campaignSort")?.value||"newest";
  let filtered=campaigns.filter(c=>(c.name+" "+c.premise+" "+c.universe).toLowerCase().includes(q));
  if(universe!=="all")filtered=filtered.filter(c=>c.universe===universe);
  if(status!=="all")filtered=filtered.filter(c=>c.status===status);
  filtered.sort((a,b)=>sort==="name"?a.name.localeCompare(b.name):sort==="oldest"?new Date(a.created)-new Date(b.created):new Date(b.created)-new Date(a.created));
  $("campaignTotal").textContent=`${filtered.length} of ${count} campaign${count===1?"":"s"}`;
  $("campaignGrid").innerHTML=filtered.length?filtered.map(c=>campaignMarkup(c)).join(""):'<div class="placeholder-panel"><div class="placeholder-icon">✦</div><h2>No campaigns found</h2><p>Try changing your search or filters, or create a new campaign.</p></div>';
}

const ARCHIVE_STORE_KEY="gmk-library-archives-v1";
const PAGES_BASE="https://edwardawilson1983.github.io/game-masters-keep/";
const archiveFolders={fantasy:"Puma",starfleet:"Starfleet",galaxy:"Galactic-Adventures"};
const archiveCategoryFolders={"Characters":"Characters","Images":"Images","Character Sheets":"Character-Sheets","Maps":"Maps","Chronicles":"Chronicles","Session Notes":"Session-Notes","Other":"Other"};
function loadArchiveCatalog(){
  try{return JSON.parse(localStorage.getItem(ARCHIVE_STORE_KEY)||'{"fantasy":[],"starfleet":[],"galaxy":[]}')}
  catch{return {fantasy:[],starfleet:[],galaxy:[]}}
}
let archiveCatalog=loadArchiveCatalog();
function saveArchiveCatalog(){localStorage.setItem(ARCHIVE_STORE_KEY,JSON.stringify(archiveCatalog))}
function currentArchiveItems(){return Array.isArray(archiveCatalog[currentUniverse])?archiveCatalog[currentUniverse]:[]}
function archiveFileUrl(path){
  const clean=String(path||"").trim().replace(/^\/+/,"");
  if(/^https:\/\/(edwardawilson1983\.github\.io|github\.com)\//i.test(clean))return clean;
  return PAGES_BASE+clean.split("/").map(encodeURIComponent).join("/");
}
function archiveEmblem(universe){
  const icons={
    fantasy:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M7 17c9-4 17-2 25 4v31C24 46 16 44 7 48V17Z M57 17c-9-4-17-2-25 4v31c8-6 16-8 25-4V17Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M32 21v31M20 28l4 4 8-10 8 10 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 4l2.3 6.7L41 13l-6.7 2.3L32 22l-2.3-6.7L23 13l6.7-2.3L32 4Z" fill="currentColor"/></svg>',
    starfleet:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="25" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2.5 3"/><path d="M32 12 38 29 55 32 38 35 32 52 26 35 9 32 26 29 32 12Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="32" cy="32" r="4" fill="currentColor"/></svg>',
    galaxy:'<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m32 6 22 13v26L32 58 10 45V19L32 6Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="m32 6 0 26 22-13M32 32 10 19m22 13v26m0-26 22 13M10 45l22-13" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m32 20 3.2 8.8L44 32l-8.8 3.2L32 44l-3.2-8.8L20 32l8.8-3.2L32 20Z" fill="currentColor"/></svg>'
  };
  return icons[universe]||icons.fantasy;
}
function renderArchives(){
  const folder=archiveFolders[currentUniverse]||"Puma";
  $("archiveRealmLabel").textContent=universeNames[currentUniverse];
  const archiveEmblems={fantasy:"assets/puma-visual-studio-emblem.png",starfleet:"assets/starfleet-visual-studio-emblem.png",galaxy:"assets/galactic-visual-studio-emblem.png"};
  const archiveAlts={fantasy:"The Chronicles of Puma emblem",starfleet:"Starfleet Command insignia",galaxy:"Jedi and Sith balance emblem"};
  $("archiveMarkEmblem").src=archiveEmblems[currentUniverse]||archiveEmblems.fantasy;
  $("archiveMarkEmblem").alt=archiveAlts[currentUniverse]||archiveAlts.fantasy;
  ["archiveFolderExample","archiveFolderExample2","archiveFolderExample3","archiveFolderExample4"].forEach((id,i)=>{
    const names=["Characters","Images","Character-Sheets","Maps"];
    $(id).textContent=folder+"/"+names[i]+"/";
  });
  const q=($("archiveSearch").value||"").toLowerCase().trim();
  const category=$("archiveCategoryFilter").value;
  const items=currentArchiveItems().filter(item=>(category==="all"||item.category===category)&&(`${item.title} ${item.path} ${item.description} ${item.category}`).toLowerCase().includes(q));
  $("archiveCount").textContent=items.length+" file"+(items.length===1?"":"s");
  $("archiveItems").innerHTML=items.length?items.map(item=>{
    const url=archiveFileUrl(item.path),isImage=/\.(png|jpe?g|gif|webp|svg)$/i.test(item.path);
    return `<article class="archive-item" data-archive-id="${escapeHTML(item.id)}">
      <div class="archive-item-preview">${isImage?`<img src="${escapeHTML(url)}" alt="${escapeHTML(item.title)}" loading="lazy" onerror="this.parentElement.textContent='▣'">`:"▣"}</div>
      <div class="archive-item-body"><div class="archive-item-meta">${escapeHTML(item.category||"OTHER")}</div><h3>${escapeHTML(item.title)}</h3>${item.description?`<p>${escapeHTML(item.description)}</p>`:""}<p>${escapeHTML(item.path)}</p>
      <div class="archive-item-actions"><a class="primary-btn" href="${escapeHTML(url)}" target="_blank" rel="noopener">Open file ↗</a><button class="text-btn" type="button" data-remove-archive="${escapeHTML(item.id)}">Remove</button></div></div></article>`;
  }).join(""):'<div class="placeholder-panel"><div class="placeholder-icon">▣</div><h2>No files in this view</h2><p>Add a hosted file or adjust your search and category filter.</p></div>';
}
function downloadArchiveCatalog(){
  const payload={app:"Game Master's Keep",type:"archive-catalog",version:1,universe:currentUniverse,files:currentArchiveItems(),exportedAt:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=`${archiveFolders[currentUniverse].toLowerCase()}-archive-catalog.json`;a.click();URL.revokeObjectURL(url);
}
function registerArchiveFile(event){
  event.preventDefault();
  const title=$("archiveTitle").value.trim(),category=$("archiveCategory").value;
  let path=$("archivePath").value.trim().replace(/\\/g,"/");
  const description=$("archiveDescription").value.trim();
  if(!title||!path)return;
  if(path.includes("..")||path.startsWith("http://")||path.startsWith("javascript:")){toast("Enter a safe GitHub Pages file path.");return}
  path=path.replace(/^\/+/,"");
  const folder=archiveFolders[currentUniverse]+"/";
  if(!path.startsWith(folder)){toast(`The path must begin with ${folder}`);return}
  const items=currentArchiveItems();
  if(items.some(x=>x.path.toLowerCase()===path.toLowerCase())){toast("That file path is already in this archive.");return}
  items.unshift({id:makeId(),title,category,path,description,createdAt:new Date().toISOString()});
  archiveCatalog[currentUniverse]=items;saveArchiveCatalog();$("archiveForm").reset();renderArchives();toast("File added to your archive.");
}
function removeArchiveFile(id){
  if(!confirm("Remove this file from the local archive catalog? The file in GitHub will not be deleted."))return;
  archiveCatalog[currentUniverse]=currentArchiveItems().filter(x=>x.id!==id);saveArchiveCatalog();renderArchives();toast("Archive entry removed.");
}
function importArchiveCatalogFile(file){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(data.type!=="archive-catalog"||!Array.isArray(data.files))throw new Error("Invalid archive catalog");
      if(data.universe!==currentUniverse){toast("This catalog belongs to a different universe.");return}
      archiveCatalog[currentUniverse]=data.files.filter(x=>x&&typeof x.title==="string"&&typeof x.path==="string"&&x.path.startsWith(archiveFolders[currentUniverse]+"/"));
      saveArchiveCatalog();renderArchives();toast("Archive catalog imported.");
    }catch{toast("Could not read that archive catalog.")}
    $("importArchiveCatalog").value="";
  };
  reader.readAsText(file);
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}

document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$("archiveForm").addEventListener("submit",registerArchiveFile);
$("archiveSearch").addEventListener("input",renderArchives);
$("archiveCategoryFilter").addEventListener("change",renderArchives);
$("archiveItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove-archive]");if(b)removeArchiveFile(b.dataset.removeArchive)});
$("exportArchiveCatalog").addEventListener("click",downloadArchiveCatalog);
$("importArchiveCatalog").addEventListener("change",e=>importArchiveCatalogFile(e.target.files[0]));

document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
document.querySelectorAll("[data-universe-choice]").forEach(b=>b.addEventListener("click",()=>setUniverse(b.dataset.universeChoice)));
["newCampaignTop","newCampaign","emptyCreate"].forEach(id=>$(id)?.addEventListener("click",()=>openCampaignDialog()));
$("campaignForm").addEventListener("submit",submitCampaign);
$("closeCampaignDialog").addEventListener("click",closeCampaignDialog);
$("cancelCampaign").addEventListener("click",closeCampaignDialog);
["campaignSearch","campaignUniverseFilter","campaignStatusFilter","campaignSort"].forEach(id=>$(id).addEventListener(id==="campaignSearch"?"input":"change",render));
$("campaignGrid").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit-campaign]");
  const del=e.target.closest("[data-delete-campaign]");
  if(edit)openCampaignDialog(edit.dataset.editCampaign);
  if(del)deleteCampaign(del.dataset.deleteCampaign);
  const chron=e.target.closest("[data-open-chronicle]");
  if(chron){showView("sessions");$("sessionCampaignSelect").value=chron.dataset.openChronicle;renderSessionWorkspace();openChronicleDialog();}
});
$("recentCampaigns").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit-campaign]");
  const del=e.target.closest("[data-delete-campaign]");
  if(edit)openCampaignDialog(edit.dataset.editCampaign);
  if(del)deleteCampaign(del.dataset.deleteCampaign);
  const chron=e.target.closest("[data-open-chronicle]");
  if(chron){showView("sessions");$("sessionCampaignSelect").value=chron.dataset.openChronicle;renderSessionWorkspace();openChronicleDialog();}
});
$("rollDice").addEventListener("click",()=>{
  const sides=Number($("diceType").value),count=Math.max(1,Math.min(20,Number($("diceCount").value)||1));
  const rolls=Array.from({length:count},()=>Math.floor(Math.random()*sides)+1);
  $("diceResult").textContent=`${rolls.join(" + ")} = ${rolls.reduce((a,b)=>a+b,0)}`;
});
$("exportData").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify({app:"Game Master's Keep",version:"1.2-character-dossiers",exported:new Date().toISOString(),campaigns},null,2)],{type:"application/json"});
  const a=document.createElement("a");const url=URL.createObjectURL(blob);a.href=url;a.download="game-masters-keep-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Backup exported.");
});
$("importData").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    const data=JSON.parse(await file.text());
    if(!Array.isArray(data.campaigns))throw Error("Invalid backup");
    if(!confirm(`Import ${data.campaigns.length} campaigns? This replaces the campaigns currently stored in this browser.`))return;
    campaigns=data.campaigns.filter(c=>c&&typeof c.name==="string").map(c=>({
      id:String(c.id||makeId()),name:c.name.slice(0,70),
      universe:["fantasy","starfleet","galaxy"].includes(c.universe)?c.universe:"fantasy",
      premise:String(c.premise||"").slice(0,1200),
      status:["active","paused","completed"].includes(c.status)?c.status:"active",
      created:c.created||new Date().toISOString(),updated:c.updated||c.created||new Date().toISOString(),
      sessions:Array.isArray(c.sessions)?c.sessions:[],
      characters:Array.isArray(c.characters)?c.characters:[],
      artworks:Array.isArray(c.artworks)?c.artworks:[]
    }));
    save();toast("Backup imported.");
  }catch{toast("That backup file could not be read.");}
  finally{e.target.value=""}
});
$("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("newCharacter").addEventListener("click",()=>openCharacterDialog());
$("librarySearch").addEventListener("input",()=>{
  const q=$("librarySearch").value.trim();
  $("libraryResults").innerHTML=q?'<div class="library-card"><span class="tag">LIBRARY NOT YET POPULATED</span><h3>No reference entries yet</h3><p>We will add searchable, openly licensed rules and reference entries in the next development milestone.</p></div>':'<div class="library-card"><span class="tag">COMING FIRST RELEASE</span><h3>Searchable reference collection</h3><p>We will add legally usable SRD rules and your own campaign references here. The library will be organized by game system.</p></div>';
});

// Character Dossiers — the foundation for consistent future Chronicle artwork.
let editingCharacterId=null, pendingPortraitData=null, existingPortraitData=null;

function selectedArtworkCampaign(){return campaigns.find(c=>c.id===$("artworkCampaignSelect").value)||null}
function renderArtworkWorkspace(){
  const select=$("artworkCampaignSelect"),previous=select.value;
  const realmCampaigns=campaignsForCurrentUniverse();
  select.innerHTML=realmCampaigns.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)}</option>`).join("");
  if(realmCampaigns.some(c=>c.id===previous))select.value=previous;
  const c=selectedArtworkCampaign();
  $("artworkNoCampaign").hidden=!!c;$("artworkUploadForm").hidden=!c;
  $("artworkGallery").innerHTML="";
  if(!c){$("artworkCount").textContent="0 images";return}
  c.artworks=Array.isArray(c.artworks)?c.artworks:[];
  c.sessions=Array.isArray(c.sessions)?c.sessions:[];
  const charSelect=$("artworkCharacter"),old=charSelect.value;
  charSelect.innerHTML='<option value="">No character association</option>'+(c.characters||[]).map(ch=>`<option value="${escapeHTML(ch.id)}">${escapeHTML(ch.name)}</option>`).join("");
  if((c.characters||[]).some(ch=>ch.id===old))charSelect.value=old;
  const sessionSelect=$("artworkSession"),oldSession=sessionSelect.value;
  sessionSelect.innerHTML='<option value="">No session association</option>'+c.sessions.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(s=>`<option value="${escapeHTML(s.id)}">${escapeHTML(s.date||"Undated")} · ${escapeHTML(s.title||"Untitled session")}</option>`).join("");
  if(c.sessions.some(s=>s.id===oldSession))sessionSelect.value=oldSession;

  const charFilter=$("artworkCharacterFilter"),oldCharFilter=charFilter.value;
  charFilter.innerHTML='<option value="">All characters</option>'+(c.characters||[]).map(ch=>`<option value="${escapeHTML(ch.id)}">${escapeHTML(ch.name)}</option>`).join("");
  if((c.characters||[]).some(ch=>ch.id===oldCharFilter))charFilter.value=oldCharFilter;
  const sessionFilter=$("artworkSessionFilter"),oldSessionFilter=sessionFilter.value;
  sessionFilter.innerHTML='<option value="">All sessions</option>'+c.sessions.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(s=>`<option value="${escapeHTML(s.id)}">${escapeHTML(s.date||"Undated")} · ${escapeHTML(s.title||"Untitled session")}</option>`).join("");
  if(c.sessions.some(s=>s.id===oldSessionFilter))sessionFilter.value=oldSessionFilter;
  applyArtworkFilters();
}
function applyArtworkFilters(){
  const c=selectedArtworkCampaign();if(!c)return;
  const query=$("artworkSearch").value.trim().toLowerCase();
  const type=$("artworkTypeFilter").value;
  const characterId=$("artworkCharacterFilter").value;
  const sessionId=$("artworkSessionFilter").value;
  const filtered=(c.artworks||[]).filter(a=>{
    const matchesQuery=!query||[a.title,a.chapter,a.characterName,a.sessionName,a.type].some(v=>String(v||"").toLowerCase().includes(query));
    const matchesType=!type||a.type===type||(type==="Location"&&a.type==="Location / landscape")||(type==="Scene"&&a.type==="Scene / encounter");
    const matchesCharacter=!characterId||a.characterId===characterId;
    const matchesSession=!sessionId||a.sessionId===sessionId;
    return matchesQuery&&matchesType&&matchesCharacter&&matchesSession;
  });
  $("artworkCount").textContent=`${filtered.length} of ${(c.artworks||[]).length} image${(c.artworks||[]).length===1?"":"s"}`;
  const emptyTitle=(c.artworks||[]).length?"No artwork matches these filters.":"No artwork in this campaign yet.";
  const emptyMessage=(c.artworks||[]).length?"Try clearing a filter or changing your search.":"Upload a portrait, map or illustration to begin building your visual archive.";
  $("artworkGallery").innerHTML=filtered.length?filtered.map(a=>`<article class="artwork-card"><div class="artwork-card-image"><img src="${a.data}" alt="${escapeHTML(a.title)}"></div><div class="artwork-card-body"><span class="eyebrow">${escapeHTML(a.type||"ARTWORK")}</span><h3>${escapeHTML(a.title)}</h3>${a.characterName?`<p>Character: ${escapeHTML(a.characterName)}</p>`:""}${a.sessionName?`<p>Session: ${escapeHTML(a.sessionName)}</p>`:""}${a.chapter?`<p>${escapeHTML(a.chapter)}</p>`:""}<button type="button" class="text-btn" data-delete-artwork="${escapeHTML(a.id)}">Remove artwork</button></div></article>`).join(""):`<div class="artwork-empty"><div class="placeholder-icon">✦</div><strong>${emptyTitle}</strong><p>${emptyMessage}</p></div>`;
}
$("artworkCampaignSelect").addEventListener("change",()=>{
  $("artworkSearch").value="";$("artworkTypeFilter").value="";$("artworkCharacterFilter").value="";$("artworkSessionFilter").value="";
  renderArtworkWorkspace();
});
["artworkSearch","artworkTypeFilter","artworkCharacterFilter","artworkSessionFilter"].forEach(id=>$(id).addEventListener(id==="artworkSearch"?"input":"change",applyArtworkFilters));
$("artworkUploadForm").addEventListener("submit",e=>{
  e.preventDefault();const c=selectedArtworkCampaign();const file=$("artworkFile").files?.[0];
  if(!c||!file)return;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)){toast("Please choose a JPG, PNG or WebP image.");return}
  if(file.size>700*1024){toast("Please choose an image smaller than 700 KB.");return}
  const reader=new FileReader();
  reader.onload=()=>{
    const character=(c.characters||[]).find(ch=>ch.id===$("artworkCharacter").value);
    const session=(c.sessions||[]).find(s=>s.id===$("artworkSession").value);
    c.artworks=Array.isArray(c.artworks)?c.artworks:[];
    c.artworks.push({id:makeId(),title:$("artworkTitle").value.trim(),type:$("artworkType").value,characterId:character?.id||"",characterName:character?.name||"",sessionId:session?.id||"",sessionName:session?.title||"",chapter:$("artworkChapter").value.trim(),data:String(reader.result),created:new Date().toISOString()});
    try{persistCampaigns()}catch(err){c.artworks.pop();toast("Browser storage is full. Remove a large image or export a backup.");return}
    $("artworkUploadForm").reset();renderArtworkWorkspace();toast("Artwork added to campaign gallery.");
  };
  reader.onerror=()=>toast("The image could not be read.");reader.readAsDataURL(file);
});
$("artworkGallery").addEventListener("click",e=>{
  const del=e.target.closest("[data-delete-artwork]");if(!del)return;
  const c=selectedArtworkCampaign();if(!c)return;
  if(!confirm("Remove this artwork from the campaign gallery?"))return;
  c.artworks=(c.artworks||[]).filter(a=>a.id!==del.dataset.deleteArtwork);
  try{persistCampaigns();renderArtworkWorkspace();toast("Artwork removed.")}catch{toast("Could not update the campaign gallery.")}
});

function selectedCharacterCampaign(){return campaigns.find(c=>c.id===$("characterCampaignSelect").value)||null}
function renderCharacterWorkspace(){
  const select=$("characterCampaignSelect");
  const previous=select.value;
  const options=campaignsForCurrentUniverse().slice().sort((a,b)=>a.name.localeCompare(b.name));
  select.innerHTML=options.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)} — ${escapeHTML(universeNames[c.universe])}</option>`).join("");
  if(options.some(c=>c.id===previous))select.value=previous;
  const has=options.length>0;
  $("characterNoCampaign").hidden=has;$("characterList").hidden=!has;
  $("newCharacter").disabled=!has;
  if(has)renderCharacterCards();
  else {$("characterList").innerHTML="";$("characterCount").textContent="0 characters";}
}
function renderCharacterCards(){
  const c=selectedCharacterCampaign();if(!c)return;
  const list=c.characters||[];
  $("characterCount").textContent=list.length+" character"+(list.length===1?"":"s");
  $("characterList").innerHTML=list.length?list.map(ch=>`<article class="character-card">
    <div class="character-card-art">${ch.portrait?`<img src="${ch.portrait}" alt="Portrait of ${escapeHTML(ch.name)}">`:'<div class="character-placeholder">♙<small>PORTRAIT NOT SET</small></div>'}</div>
    <div class="character-card-body"><div class="eyebrow">${escapeHTML(ch.role||"CAMPAIGN CHARACTER")}${ch.species?" · "+escapeHTML(ch.species):""}</div><h3>${escapeHTML(ch.name)}</h3>
    ${ch.appearance?`<p>${escapeHTML(ch.appearance)}</p>`:'<p class="muted">No appearance description recorded yet.</p>'}
    <div class="character-card-actions"><button class="secondary-btn" data-edit-character="${escapeHTML(ch.id)}">Open dossier</button><button class="text-btn" data-delete-character="${escapeHTML(ch.id)}">Delete</button></div></div>
  </article>`).join(""):'<div class="placeholder-panel character-empty"><h3>No characters in this campaign yet</h3><p>Create your first dossier. Its portrait and appearance description can later guide consistent AI-generated illustrations.</p><button class="secondary-btn" id="firstCharacter">＋ Create first character</button></div>';
  const first=$("firstCharacter");if(first)first.addEventListener("click",()=>openCharacterDialog());
}
function openCharacterDialog(id=null){
  const c=selectedCharacterCampaign();
  if(!c){toast("Create a campaign before adding characters.");return}
  editingCharacterId=id;pendingPortraitData=null;existingPortraitData=null;
  $("characterForm").reset();$("characterId").value="";
  $("portraitPreview").hidden=true;$("portraitPreview").innerHTML="";
  const character=id?(c.characters||[]).find(x=>x.id===id):null;
  $("characterDialogTitle").textContent=character?"Edit character dossier":"Create a character";
  $("saveCharacter").textContent=character?"Save dossier changes":"Save character dossier";
  if(character){
    $("characterId").value=character.id;$("characterName").value=character.name||"";
    $("characterRole").value=character.role||"";$("characterSpecies").value=character.species||"";
    $("characterAppearance").value=character.appearance||"";$("characterPersonality").value=character.personality||"";
    $("characterBiography").value=character.biography||"";$("characterEquipment").value=character.equipment||"";
    existingPortraitData=character.portrait||null;
    if(existingPortraitData)showPortraitPreview(existingPortraitData);
  }
  $("characterDialog").showModal();
}
function showPortraitPreview(src){
  $("portraitPreview").hidden=false;
  $("portraitPreview").innerHTML=`<img src="${src}" alt="Character portrait preview"><button type="button" class="text-btn" id="removeCharacterPortrait">Remove portrait</button>`;
  $("removeCharacterPortrait").addEventListener("click",()=>{pendingPortraitData="";existingPortraitData=null;$("portraitPreview").hidden=true;$("portraitPreview").innerHTML="";$("characterPortrait").value=""});
}
$("characterPortrait").addEventListener("change",e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)){toast("Please choose a JPG, PNG or WebP image.");e.target.value="";return}
  if(file.size>700*1024){toast("Please use an image smaller than 700 KB for this local prototype.");e.target.value="";return}
  const reader=new FileReader();
  reader.onload=()=>{pendingPortraitData=String(reader.result);showPortraitPreview(pendingPortraitData)};
  reader.onerror=()=>toast("The image could not be read.");
  reader.readAsDataURL(file);
});
function buildCharacterArtPrompt(){
  const name=$("characterName").value.trim()||"the character";
  const role=$("characterRole").value.trim(), species=$("characterSpecies").value.trim();
  const appearance=$("characterAppearance").value.trim(), equipment=$("characterEquipment").value.trim();
  const personality=$("characterPersonality").value.trim(), biography=$("characterBiography").value.trim();
  const style=$("visualArtStyle").value;
  const extra=$("visualExtraDirection").value.trim();
  const parts=[
    `Create an original character portrait of ${name}.`,
    species?`Species or ancestry: ${species}.`:"",
    role?`Role or class: ${role}.`:"",
    appearance?`Physical appearance and defining visual features: ${appearance}.`:"",
    equipment?`Clothing, armor, weapons and signature items: ${equipment}.`:"",
    personality?`Personality to communicate through expression and bearing: ${personality}.`:"",
    biography?`Relevant background context for visual storytelling: ${biography}.`:"",
    `Art direction: ${style}.`,
    extra?`Additional direction: ${extra}.`:"",
    "Show one clearly recognizable individual. Keep anatomy, hands, face, clothing and equipment coherent and well rendered. Use a strong, readable composition suitable for a character reference portrait. Do not add text, captions, watermarks, logos or extra characters.",
    "Character continuity note: this image is the canonical visual reference for this character. Preserve the same face, age, build, skin tone, hair, distinctive features and signature equipment in future illustrations unless a later story event explicitly changes them."
  ].filter(Boolean);
  $("visualPromptOutput").value=parts.join("\n\n");
}
$("openVisualStudio").addEventListener("click",()=>{
  buildCharacterArtPrompt();
  $("visualStudioDialog").showModal();
});
$("visualArtStyle").addEventListener("change",buildCharacterArtPrompt);
$("refreshVisualPrompt").addEventListener("click",buildCharacterArtPrompt);
$("closeVisualStudio").addEventListener("click",()=>$("visualStudioDialog").close());
$("visualPromptDone").addEventListener("click",()=>$("visualStudioDialog").close());
$("copyVisualPrompt").addEventListener("click",async()=>{
  const value=$("visualPromptOutput").value;
  try{
    if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);
    else {$("visualPromptOutput").select();document.execCommand("copy");}
    toast("Artwork prompt copied.");
  }catch{$("visualPromptOutput").select();toast("Select the prompt and press Ctrl+C to copy.");}
});

$("characterForm").addEventListener("submit",e=>{
  e.preventDefault();const c=selectedCharacterCampaign();if(!c)return;
  const name=$("characterName").value.trim();if(!name){toast("Enter a character name.");return}
  c.characters=Array.isArray(c.characters)?c.characters:[];
  const item={id:editingCharacterId||makeId(),name,role:$("characterRole").value.trim(),species:$("characterSpecies").value.trim(),
    appearance:$("characterAppearance").value.trim(),personality:$("characterPersonality").value.trim(),
    biography:$("characterBiography").value.trim(),equipment:$("characterEquipment").value.trim(),
    portrait:pendingPortraitData!==null?(pendingPortraitData||null):existingPortraitData};
  const index=c.characters.findIndex(x=>x.id===editingCharacterId);
  if(index>=0)c.characters[index]=item;else c.characters.push(item);
  c.updated=new Date().toISOString();
  try{persistCampaigns()}catch(err){toast("Browser storage is full. Remove a large image or export a backup.");return}
  $("characterDialog").close();renderCharacterCards();render();toast(index>=0?"Character dossier updated.":"Character dossier created.");
});
$("characterCampaignSelect").addEventListener("change",renderCharacterCards);
$("newCharacter").addEventListener("click",()=>openCharacterDialog());
$("closeCharacter").addEventListener("click",()=>$("characterDialog").close());
$("cancelCharacter").addEventListener("click",()=>$("characterDialog").close());
$("characterList").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit-character]"),del=e.target.closest("[data-delete-character]");
  if(edit)openCharacterDialog(edit.dataset.editCharacter);
  if(del&&confirm("Delete this character dossier? This will also remove its saved portrait from this campaign.")){
    const c=selectedCharacterCampaign();if(!c)return;
    c.characters=(c.characters||[]).filter(ch=>ch.id!==del.dataset.deleteCharacter);
    persistCampaigns();renderCharacterCards();render();toast("Character dossier deleted.");
  }
});

// Chronicle Room — session records are stored inside their parent campaign.
let editingSessionId=null;
function selectedCampaign(){return campaigns.find(c=>c.id===$("sessionCampaignSelect").value)||null}
function renderSessionWorkspace(){
  const options=campaignsForCurrentUniverse().slice().sort((a,b)=>a.name.localeCompare(b.name));
  $("sessionCampaignSelect").innerHTML=options.map(c=>`<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)} — ${escapeHTML(universeNames[c.universe])}</option>`).join("");
  const has=options.length>0;
  $("sessionNoCampaign").hidden=has;$("sessionEditor").hidden=!has;
  $("openChronicle").disabled=!has;
  if(has)renderSessionRecords();
}
function resetSessionForm(){
  editingSessionId=null;$("sessionForm").reset();$("sessionId").value="";
  $("sessionFormTitle").textContent="Record a session";$("saveSession").textContent="Save session record";
  $("sessionDate").value=new Date().toISOString().slice(0,10);
  if($("sessionArtworkSelect"))Array.from($("sessionArtworkSelect").options).forEach(o=>o.selected=false);
}
function renderSessionRecords(){
  const c=selectedCampaign();if(!c)return;
  const records=(c.sessions||[]).slice().sort((a,b)=>a.date.localeCompare(b.date));
  $("sessionRecordCount").textContent=records.length+" entr"+(records.length===1?"y":"ies");
  $("sessionArtworkSelect").innerHTML=(c.artworks||[]).map(a=>`<option value="${escapeHTML(a.id)}">${escapeHTML(a.title)}${a.characterName?" — "+escapeHTML(a.characterName):""}</option>`).join("");
  $("sessionArtworkSelect").disabled=!(c.artworks||[]).length;
  $("sessionRecords").innerHTML=records.length?records.map(s=>{
    const linked=(c.artworks||[]).filter(a=>(s.artworkIds||[]).includes(a.id)||a.sessionId===s.id);
    return `<article class="session-record">
      <div class="session-record-top"><span>${escapeHTML(new Date(s.date+"T12:00:00").toLocaleDateString())}</span><div class="session-record-actions"><button class="secondary-btn" data-edit-session="${escapeHTML(s.id)}">Edit</button><button class="text-btn" data-delete-session="${escapeHTML(s.id)}">Delete</button></div></div>
      <h4>${escapeHTML(s.title)}</h4><p>${escapeHTML(s.summary)}</p>${s.cast?`<p><strong>Present:</strong> ${escapeHTML(s.cast)}</p>`:""}${s.turningPoint?`<p><strong>Turning points:</strong> ${escapeHTML(s.turningPoint)}</p>`:""}
      ${linked.length?`<div class="session-linked-art">${linked.map(a=>`<figure><img src="${a.data}" alt="${escapeHTML(a.title)}"><figcaption>${escapeHTML(a.title)}</figcaption></figure>`).join("")}</div>`:""}
    </article>`;
  }).join(""):'<div class="placeholder-panel"><h3>No session records yet</h3><p>Record your first game session above. These entries will form the chapters of your finished chronicle.</p></div>';
}
function saveSessionRecord(e){
  e.preventDefault();const c=selectedCampaign();if(!c)return;
  const record={id:editingSessionId||makeId(),title:$("sessionTitle").value.trim(),date:$("sessionDate").value,
    summary:$("sessionSummary").value.trim(),cast:$("sessionCast").value.trim(),turningPoint:$("sessionTurningPoint").value.trim(),
    artworkIds:Array.from($("sessionArtworkSelect").selectedOptions).map(o=>o.value)};
  if(!record.title||!record.date||!record.summary){toast("Please complete the title, date and session summary.");return}
  c.sessions=Array.isArray(c.sessions)?c.sessions:[];
  const index=c.sessions.findIndex(s=>s.id===editingSessionId);
  if(index>=0)c.sessions[index]=record;else c.sessions.push(record);
  c.updated=new Date().toISOString();persistCampaigns();resetSessionForm();renderSessionRecords();render();toast(index>=0?"Session record updated.":"Session record saved.");
}
function buildChronicleText(c,style){
  const sessions=(c.sessions||[]).slice().sort((a,b)=>a.date.localeCompare(b.date));
  const intro=style==="historical"
    ?`This chronicle preserves the recorded history of ${c.name}. It begins with the circumstances that set the events in motion and follows the recorded sessions in the order they occurred.`
    :style==="journal"
    ?`These are the remembered adventures of ${c.name}. What follows is the account kept by those who took part, drawn from the records of each gathering.`
    :`Every great adventure begins somewhere. This is the story of ${c.name} — an account of the events, choices and turning points preserved by its Game Master.`;
  let text=`${c.name.toUpperCase()}\n\n${intro}\n\n`;
  if(c.premise)text+=`PROLOGUE\n\n${c.premise}\n\n`;
  if(!sessions.length)text+="No session records have been added to this campaign yet. Add session records in the Chronicle Room, then return here to assemble the story.\n";
  sessions.forEach((s,i)=>{
    const date=new Date(s.date+"T12:00:00").toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
    const heading=style==="historical"?`RECORD ${i+1} — ${s.title.toUpperCase()}`:style==="journal"?`ENTRY ${i+1} — ${s.title}`:`CHAPTER ${i+1}\n${s.title}`;
    text+=`${heading}\n${date}\n\n${s.summary}\n\n`;
    if(s.cast)text+=`Those present: ${s.cast}.\n\n`;
    if(s.turningPoint)text+=`Turning points and consequences:\n${s.turningPoint}\n\n`;
  });
  if(sessions.length)text+=`EPILOGUE\n\nThe recorded sessions of ${c.name} conclude here. The choices and consequences preserved in these pages remain part of this campaign's history.\n`;
  return text;
}
function openChronicleDialog(){
  const c=selectedCampaign();if(!c){toast("Choose a campaign first.");return}
  $("chronicleTitle").value=c.name;$("chronicleDedication").value="";
  $("chronicleText").value=buildChronicleText(c,$("chronicleStyle").value);
  $("chronicleDialog").showModal();
}
function refreshChronicleText(){const c=selectedCampaign();if(c)$("chronicleText").value=buildChronicleText(c,$("chronicleStyle").value)}
function printChronicle(){
  const c=selectedCampaign();if(!c)return;
  const title=$("chronicleTitle").value.trim()||c.name;
  const dedication=$("chronicleDedication").value.trim();
  const body=$("chronicleText").value;
  const popup=window.open("","_blank");
  if(!popup){toast("Please allow pop-ups for this local app to print your chronicle.");return}
  const safeTitle=escapeHTML(title),safeDedication=escapeHTML(dedication);
  const paragraphs=body.split(/\n{2,}/).map(p=>`<p>${escapeHTML(p).replace(/\n/g,"<br>")}</p>`).join("");
  const sessions=(c.sessions||[]).slice().sort((a,b)=>a.date.localeCompare(b.date));
  const illustrated=sessions.map(s=>{
    const art=(c.artworks||[]).filter(a=>(s.artworkIds||[]).includes(a.id)||a.sessionId===s.id);
    if(!art.length)return "";
    return `<section class="plate-group"><h2>${escapeHTML(s.title)}</h2><div class="plate-grid">${art.map(a=>`<figure><img src="${a.data}" alt="${escapeHTML(a.title)}"><figcaption>${escapeHTML(a.title)}${a.characterName?" · "+escapeHTML(a.characterName):""}</figcaption></figure>`).join("")}</div></section>`;
  }).filter(Boolean).join("");
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title><style>
  @page{size:auto;margin:0.8in}body{font-family:Georgia,'Times New Roman',serif;color:#222;max-width:7in;margin:0 auto;line-height:1.7}
  .cover{min-height:8.5in;display:flex;flex-direction:column;justify-content:center;text-align:center;page-break-after:always;border:double 4px #8a7446;padding:30px;box-sizing:border-box}
  .cover .kicker{letter-spacing:4px;text-transform:uppercase;font:11px Arial;color:#8a7446}.cover h1{font-size:38px;line-height:1.2;margin:30px 0}.cover .dedication{font-style:italic;margin-top:40px}
  article p{white-space:normal;margin:0 0 1.1em}article p:first-child{text-align:center;font-variant:small-caps;letter-spacing:1.5px;font-weight:bold;font-size:20px;margin-top:1.6em}
  article p:nth-child(2){text-align:center;font-style:italic;color:#666;font-size:13px;margin-top:-.8em}
  .illustrations{page-break-before:always}.illustrations>h1{text-align:center;font-size:28px;margin:0 0 1.5em}.plate-group{margin:0 0 2.5em;break-inside:avoid}.plate-group h2{font-size:18px;border-bottom:1px solid #b8aa8b;padding-bottom:7px}.plate-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.plate-grid figure{margin:0;break-inside:avoid}.plate-grid img{width:100%;max-height:3.1in;object-fit:contain;background:#f4f1e9}.plate-grid figcaption{text-align:center;font-size:12px;font-style:italic;margin-top:7px}
  .footer{margin-top:3em;border-top:1px solid #aaa;padding-top:10px;text-align:center;color:#777;font:10px Arial;letter-spacing:2px}
  @media screen{body{padding:30px}.cover{min-height:75vh}}
  </style></head><body><section class="cover"><div class="kicker">${escapeHTML(universeNames[c.universe])}</div><h1>${safeTitle}</h1><div>A Campaign Chronicle</div>${safeDedication?`<div class="dedication">${safeDedication}</div>`:""}</section><article>${paragraphs}</article>${illustrated?`<section class="illustrations"><h1>Illustrated Plates</h1>${illustrated}</section>`:""}<div class="footer">GAME MASTER'S KEEP · CAMPAIGN CHRONICLE</div><script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>`);
  popup.document.close();
}
$("sessionCampaignSelect").addEventListener("change",()=>{resetSessionForm();renderSessionRecords()});
$("sessionForm").addEventListener("submit",saveSessionRecord);
$("cancelSessionEdit").addEventListener("click",resetSessionForm);
$("sessionRecords").addEventListener("click",e=>{
  const c=selectedCampaign();if(!c)return;
  const edit=e.target.closest("[data-edit-session]"),del=e.target.closest("[data-delete-session]");
  if(edit){
    const s=(c.sessions||[]).find(x=>x.id===edit.dataset.editSession);if(!s)return;
    editingSessionId=s.id;$("sessionId").value=s.id;$("sessionTitle").value=s.title;$("sessionDate").value=s.date;
    $("sessionSummary").value=s.summary;$("sessionCast").value=s.cast||"";$("sessionTurningPoint").value=s.turningPoint||"";
    Array.from($("sessionArtworkSelect").options).forEach(o=>o.selected=(s.artworkIds||[]).includes(o.value));
    $("sessionFormTitle").textContent="Edit session record";$("saveSession").textContent="Save changes";
    $("sessionForm").scrollIntoView({behavior:"smooth",block:"start"});
  }
  if(del&&confirm("Delete this session record? It will no longer appear in the campaign chronicle.")){
    c.sessions=(c.sessions||[]).filter(s=>s.id!==del.dataset.deleteSession);persistCampaigns();renderSessionRecords();render();toast("Session record deleted.");
  }
});
$("openChronicle").addEventListener("click",openChronicleDialog);
$("closeChronicle").addEventListener("click",()=>$("chronicleDialog").close());
$("cancelChronicle").addEventListener("click",()=>$("chronicleDialog").close());
$("chronicleStyle").addEventListener("change",refreshChronicleText);
$("printChronicle").addEventListener("click",printChronicle);
renderSessionWorkspace();

renderCharacterWorkspace();
render();
