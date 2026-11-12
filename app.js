const STORE_KEY = "gmk-prototype-campaigns-v1";
const $ = (id) => document.getElementById(id);
let campaigns = loadCampaigns();
let currentUniverse = "fantasy";
const universeNames = {fantasy:"THE CHRONICLES OF PUMA",starfleet:"STARFLEET COMMAND",galaxy:"GALACTIC ADVENTURES"};
const universeCopy = {
  fantasy:{title:"Your Keep Awaits.",intro:"A quiet place to plan bold adventures, keep your worlds in order, and prepare for the next session.",hero:"Every great adventure<br>starts with a story.",heroText:"Bring your campaigns, characters, session notes and reference tools together in one organized place."},
  starfleet:{title:"Starfleet Command Online.",intro:"Command your vessel, coordinate your crew and explore the final frontier.",hero:"Space. The final frontier.",heroText:"Mission control, crew records, ship operations and stellar navigation — organized in one Starfleet computer interface."},
  galaxy:{title:"The Galaxy Is Yours.",intro:"Keep your operations, allies, rivals and adventures organized across a galaxy of possibilities.",hero:"A galaxy of stories<br>begins here.",heroText:"Bring your characters, starships, factions, mission notes and campaign records together."}
};
function loadCampaigns(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||"[]")}catch{return []}}
function save(){localStorage.setItem(STORE_KEY,JSON.stringify(campaigns));render()}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400)}
function setUniverse(universe){currentUniverse=universe;document.body.dataset.universe=universe;document.querySelectorAll("[data-universe-choice]").forEach(b=>b.classList.toggle("active",b.dataset.universeChoice===universe));$("realmName").textContent=universeNames[universe];$("campaignUniverse").value=universe;const copy=universeCopy[universe];$("welcomeTitle").textContent=copy.title;$("welcomeText").textContent=copy.intro;$("heroTitle").innerHTML=copy.hero;$("heroText").textContent=copy.heroText;
const isFleet=universe==="starfleet";
$("statsEyebrow").textContent=isFleet?"VESSEL STATUS":universe==="galaxy"?"GALACTIC INTELLIGENCE":"YOUR WORKSPACE";
$("statsTitle").textContent=isFleet?"Command overview":universe==="galaxy"?"Campaign intelligence":"At a glance";
$("campaignStatLabel").textContent=isFleet?"Active missions":universe==="galaxy"?"Active campaigns":"Campaigns";
$("characterStatLabel").textContent=isFleet?"Crew complement":universe==="galaxy"?"Jedi, Sith & factions":"Characters & NPCs";
$("sessionStatLabel").textContent=isFleet?"Mission logs":universe==="galaxy"?"Chronicles":"Session notes";
$("questStatLabel").textContent=isFleet?"Open assignments":universe==="galaxy"?"Force encounters":"Open quests";
$("heroTitle").textContent=isFleet?"Space. The final frontier.":copy.hero.replace(/<br>/g," ");
$("heroTitle").innerHTML=copy.hero;
render() }
function showView(view){document.querySelectorAll(".page-view").forEach(v=>v.classList.toggle("active",v.id==="view-"+view));document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===view));$("pageName").textContent=({dashboard:"Headquarters",campaigns:"Campaigns",characters:"Characters & NPCs",sessions:"Sessions & Quests",library:"Rules Library",tools:"Game Tools",settings:"Settings & Backup"})[view]||view;$("sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
function openCampaignDialog(){ $("campaignForm").reset();$("campaignUniverse").value=currentUniverse;$("campaignDialog").showModal() }
function createCampaign(){const name=$("campaignName").value.trim();if(!name){toast("Please enter a campaign name.");return}campaigns.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,universe:$("campaignUniverse").value,premise:$("campaignPremise").value.trim(),created:new Date().toISOString()});localStorage.setItem(STORE_KEY,JSON.stringify(campaigns));$("campaignDialog").close();render();showView("campaigns");toast("Your campaign has been created.");}
function render(){const count=campaigns.length;$("campaignCount").textContent=count;$("characterCount").textContent="0";$("sessionCount").textContent="0";$("questCount").textContent="0";$("campaignTotal").textContent=count+" campaign"+(count===1?"":"s");const recent=$("recentCampaigns");if(!count){recent.className="empty-state";recent.innerHTML='<span class="empty-symbol">⚑</span><strong>Your first campaign is waiting.</strong><p>Create a campaign to start organizing its world, characters and adventures.</p><button class="secondary-btn" id="emptyCreateAgain">Create your first campaign</button>';$("emptyCreateAgain").onclick=openCampaignDialog}else{recent.className="campaign-grid";recent.innerHTML=campaigns.slice(0,2).map(c=>campaignMarkup(c)).join("")}
const q=($("campaignSearch")?.value||"").toLowerCase();const filtered=campaigns.filter(c=>(c.name+" "+c.premise+" "+c.universe).toLowerCase().includes(q));$("campaignGrid").innerHTML=filtered.length?filtered.map(c=>campaignMarkup(c)).join(""):'<div class="placeholder-panel"><div class="placeholder-icon">✦</div><h2>No campaigns found</h2><p>Create a campaign or try a different search.</p></div>';}
function campaignMarkup(c){const label=universeNames[c.universe]||"CAMPAIGN";return `<article class="campaign-card"><div class="card-top"><span>${label}</span><span>✦</span></div><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.premise||"Your adventure is ready to take shape.")}</p><div class="card-date">CREATED ${new Date(c.created).toLocaleDateString()}</div></article>`}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
document.querySelectorAll("[data-universe-choice]").forEach(b=>b.addEventListener("click",()=>setUniverse(b.dataset.universeChoice)));
["newCampaignTop","newCampaign","emptyCreate"].forEach(id=>$(id)?.addEventListener("click",openCampaignDialog));
$("campaignForm").addEventListener("submit",e=>{e.preventDefault();createCampaign()});
$("saveCampaign").addEventListener("click",e=>{e.preventDefault();createCampaign()});
$("campaignSearch").addEventListener("input",render);
$("rollDice").addEventListener("click",()=>{const sides=Number($("diceType").value),count=Math.max(1,Math.min(20,Number($("diceCount").value)||1));const rolls=Array.from({length:count},()=>Math.floor(Math.random()*sides)+1);$("diceResult").textContent=`${rolls.join(" + ")} = ${rolls.reduce((a,b)=>a+b,0)}`});
$("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({app:"Game Master's Keep",version:"0.6",exported:new Date().toISOString(),campaigns},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="game-masters-keep-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exported.")});
$("importData").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.campaigns))throw Error();campaigns=data.campaigns;save();toast("Backup imported.")}catch{toast("That backup file could not be read.")}e.target.value=""});
$("mobileMenu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("newCharacter").addEventListener("click",()=>toast("Character records are planned for the next build."));
$("librarySearch").addEventListener("input",()=>{const q=$("librarySearch").value.trim();$("libraryResults").innerHTML=q?'<div class="library-card"><span class="tag">LIBRARY NOT YET POPULATED</span><h3>No reference entries yet</h3><p>We will add searchable, openly licensed rules and reference entries in the next development milestone.</p></div>':'<div class="library-card"><span class="tag">COMING FIRST RELEASE</span><h3>Searchable reference collection</h3><p>We will add legally usable SRD rules and your own campaign references here. The library will be organized by game system.</p></div>'});
render();
