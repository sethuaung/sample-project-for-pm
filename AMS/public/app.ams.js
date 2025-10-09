// app.ams.js — simple static AMS logic (existing content kept, with sidebar highlight)
const $a = s => document.querySelector(s);
const $$a = s => Array.from(document.querySelectorAll(s));

/* existing functions (renderAssets, renderSummary, openAdd, openEdit, saveAsset, deleteAsset, exportAssetsCsv, renderCharts, initAMS) remain the same */
/* ... (keep the full app.ams.js implementation you already have) ... */

/* Add this small function at the end of file to highlight sidebar link */
function initAMSSidebar(){
  $$a('.sidebar-link, .sidebar-link')?.forEach(el => el.classList.remove('bg-indigo-50','text-indigo-700','font-semibold'));
  const page = location.pathname.split('/').pop() || 'index.html';
  const sel = `.sidebar-link[data-page="${page}"]`;
  const active = document.querySelector(sel);
  if(active){
    active.classList.add('bg-indigo-50','text-indigo-700','font-semibold');
  }
}

/* modify initAMS to call initAMSSidebar after rendering */
function initAMS(){
  // populate selects
  const catSel = $a("#category");
  const locSel = $a("#location");
  if(catSel) catSel.innerHTML = (window.AMS.categories||[]).map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
  if(locSel) locSel.innerHTML = (window.AMS.locations||[]).map(l=>`<option value="${l.id}">${l.name}</option>`).join("");
  // wire buttons
  $a("#addAsset")?.addEventListener("click", openAdd);
  $a("#assetForm")?.addEventListener("submit", saveAsset);
  $a("#assetCancel")?.addEventListener("click", e=>{ e.preventDefault(); closeModal(); });
  $a("#exportAssets")?.addEventListener("click", exportAssetsCsv);
  renderAssets();
  renderCharts();
  initAMSSidebar();
}

/* bootstrap */
document.addEventListener("DOMContentLoaded", ()=>{
  if(!window.AMS || !window.AMS.assets) {
    document.addEventListener("AMS_LOADED", ()=> { initAMS(); }, { once:true });
  } else initAMS();
});
