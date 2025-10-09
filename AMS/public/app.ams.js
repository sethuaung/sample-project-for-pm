// app.ams.js — simple static AMS logic: list, add, edit, delete, CSV export, charts
// Requires data.ams.js loaded first and Chart.js CDN for charts
const $a = s => document.querySelector(s);
const $$a = s => Array.from(document.querySelectorAll(s));

function fmt(n){ return Number(n).toLocaleString("en-US"); }
function uid(prefix='x'){ return prefix + Math.random().toString(36).slice(2,8); }

function catName(id){ return (window.AMS?.categories||[]).find(c=>c.id===id)?.name || id; }
function locName(id){ return (window.AMS?.locations||[]).find(l=>l.id===id)?.name || id; }

/* render assets table */
function renderAssets(){
  const assets = (window.AMS?.assets || []).slice().sort((a,b)=> a.sku.localeCompare(b.sku));
  const tbody = $a("#assetsBody");
  if(!tbody) return;
  tbody.innerHTML = assets.map(a=>`<tr class="border-b">
    <td class="px-2 py-2 text-xs">${a.sku}</td>
    <td class="px-2 py-2 text-sm">${a.name}</td>
    <td class="px-2 py-2 text-xs">${catName(a.categoryId)}</td>
    <td class="px-2 py-2 text-xs">${locName(a.locationId)}</td>
    <td class="px-2 py-2 text-right text-xs">${a.qty}</td>
    <td class="px-2 py-2 text-right text-xs">${fmt(a.unitValue)}</td>
    <td class="px-2 py-2 text-xs">${a.condition}</td>
    <td class="px-2 py-2 text-xs">${a.purchasedAt}</td>
    <td class="px-2 py-2 text-right text-xs">
      <button data-id="${a.id}" class="editBtn bg-indigo-600 text-white px-2 py-1 rounded text-xs">Edit</button>
      <button data-id="${a.id}" class="delBtn bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
    </td>
  </tr>`).join('');
  // wire edit/delete
  $$(".editBtn").forEach(b=>b.addEventListener("click", e=> openEdit(e.target.getAttribute("data-id"))));
  $$(".delBtn").forEach(b=>b.addEventListener("click", e=> deleteAsset(e.target.getAttribute("data-id"))));
  renderSummary();
}

/* summary KPIs */
function renderSummary(){
  const assets = window.AMS?.assets || [];
  const totalItems = assets.reduce((s,a)=>s + (a.qty||0),0);
  const totalValue = assets.reduce((s,a)=>s + ((a.qty||0)*(a.unitValue||0)),0);
  $a("#k_total_items") && ($a("#k_total_items").textContent = fmt(totalItems));
  $a("#k_total_value") && ($a("#k_total_value").textContent = fmt(totalValue) + " " + (window.AMS?.meta?.currency||""));
}

/* add / edit modal logic (simple inline form) */
function openAdd(){
  const form = $a("#assetForm");
  if(!form) return;
  form.reset();
  $a("#assetId").value = "";
  $a("#assetModalTitle").textContent = "Add Asset";
  $a("#assetModal").classList.remove("hidden");
}
function openEdit(id){
  const asset = (window.AMS?.assets || []).find(x=>x.id===id);
  if(!asset) return alert("Asset not found");
  $a("#assetId").value = asset.id;
  $a("#sku").value = asset.sku;
  $a("#name").value = asset.name;
  $a("#category").value = asset.categoryId;
  $a("#location").value = asset.locationId;
  $a("#qty").value = asset.qty;
  $a("#unitValue").value = asset.unitValue;
  $a("#condition").value = asset.condition;
  $a("#purchasedAt").value = asset.purchasedAt;
  $a("#notes").value = asset.notes || "";
  $a("#assetModalTitle").textContent = "Edit Asset";
  $a("#assetModal").classList.remove("hidden");
}
function closeModal(){ $a("#assetModal").classList.add("hidden"); }

function saveAsset(e){
  e.preventDefault();
  const id = $a("#assetId").value || uid("a");
  const obj = {
    id,
    sku: $a("#sku").value.trim(),
    name: $a("#name").value.trim(),
    categoryId: $a("#category").value,
    locationId: $a("#location").value,
    qty: Number($a("#qty").value || 0),
    unitValue: Number($a("#unitValue").value || 0),
    condition: $a("#condition").value,
    purchasedAt: $a("#purchasedAt").value,
    notes: $a("#notes").value
  };
  const idx = (window.AMS.assets||[]).findIndex(x=>x.id===id);
  if(idx >= 0) window.AMS.assets[idx] = obj; else window.AMS.assets.push(obj);
  closeModal();
  renderAssets();
}

/* delete */
function deleteAsset(id){
  if(!confirm("Delete asset?")) return;
  window.AMS.assets = (window.AMS.assets||[]).filter(a=>a.id!==id);
  renderAssets();
}

/* CSV export for assets list */
function exportAssetsCsv(){
  const rows = ["id,sku,name,category,location,qty,unitValue,condition,purchasedAt,notes"];
  (window.AMS.assets||[]).forEach(a=>{
    rows.push([csvEscape(a.id), csvEscape(a.sku), csvEscape(a.name), csvEscape(catName(a.categoryId)), csvEscape(locName(a.locationId)), csvEscape(a.qty), csvEscape(a.unitValue), csvEscape(a.condition), csvEscape(a.purchasedAt), csvEscape(a.notes)].join(","));
  });
  downloadCsv("ams_assets.csv", rows.join("\n"));
}

/* small helpers (reuse from DWA patterns) */
function csvEscape(v){ if(v===null||v===undefined) return ""; const s = String(v); if(s.includes(",")||s.includes("\"")||s.includes("\n")) return `"${s.replace(/"/g,'""')}"`; return s; }
function downloadCsv(filename, csv){ const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

/* charts: category distribution and location stock */
function renderCharts(){
  const assets = window.AMS?.assets || [];
  const byCat = {};
  const byLoc = {};
  assets.forEach(a=>{
    byCat[a.categoryId] = (byCat[a.categoryId]||0) + (a.qty||0);
    byLoc[a.locationId] = (byLoc[a.locationId]||0) + (a.qty||0);
  });
  const catLabels = Object.keys(byCat).map(k=>catName(k));
  const catData = Object.keys(byCat).map(k=>byCat[k]);
  const locLabels = Object.keys(byLoc).map(k=>locName(k));
  const locData = Object.keys(byLoc).map(k=>byLoc[k]);

  const c1 = document.getElementById("catChart");
  if(c1){
    const ctx = c1.getContext("2d");
    if(window._amsCatChart) window._amsCatChart.destroy();
    window._amsCatChart = new Chart(ctx, { type:'pie', data:{ labels: catLabels, datasets:[{ data: catData, backgroundColor:['#60A5FA','#F59E0B','#10B981'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
  }

  const c2 = document.getElementById("locChart");
  if(c2){
    const ctx2 = c2.getContext("2d");
    if(window._amsLocChart) window._amsLocChart.destroy();
    window._amsLocChart = new Chart(ctx2, { type:'bar', data:{ labels: locLabels, datasets:[{ label:'Qty', data: locData, backgroundColor:'#6366F1' }] }, options:{ plugins:{ legend:{ display:false } } } });
  }
}

/* bootstrap */
document.addEventListener("DOMContentLoaded", ()=>{
  if(!window.AMS || !window.AMS.assets) {
    document.addEventListener("AMS_LOADED", ()=> { initAMS(); }, { once:true });
  } else initAMS();
});

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
}
