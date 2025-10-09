// app.ams.js — AMS runtime with Charts for Categories, Locations, Users and footer-aware rendering
// Full file replacement recommended. Chart.js and data.ams.js must be loaded beforehand.

const $a = s => document.querySelector(s);
const $$a = s => Array.from(document.querySelectorAll(s));
function fmt(n){ return Number(n).toLocaleString("en-US"); }
function uid(prefix='x'){ return prefix + Math.random().toString(36).slice(2,8); }

function catName(id){ return (window.AMS?.categories||[]).find(c=>c.id===id)?.name || id; }
function locName(id){ return (window.AMS?.locations||[]).find(l=>l.id===id)?.name || id; }
function userById(id){ return (window.AMS?.users||[]).find(u=>u.id===id) || null; }
function userName(id){ const u = userById(id); return u ? u.name : ''; }

/* --- Existing functions (renderSummaryKPIs, renderAssets, renderCategories, renderLocations, renderUsers,
   openAdd, openEdit, saveAsset, deleteAsset, renderAssetsCharts, exportAssetsCsv, initAMSSidebar, initAMS, bootstrap) --
   keep these from your current app.ams.js unchanged. */

/* New: Chart renderers for Categories, Locations, Users pages */

/* Categories: bar chart by number of items and stacked value */
function renderCategoriesCharts(){
  const cats = window.AMS?.categories || [];
  const assets = window.AMS?.assets || [];

  const labels = cats.map(c => c.name);
  const itemCounts = cats.map(c => assets.filter(a => a.categoryId === c.id).reduce((s, a) => s + (a.qty||0), 0));
  const totalValues = cats.map(c => assets.filter(a => a.categoryId === c.id).reduce((s, a) => s + ((a.qty||0)*(a.unitValue||0)), 0));

  const el = $a("#categoriesChart");
  if(!el) return;
  const ctx = el.getContext("2d");
  if(window._catsChart) window._catsChart.destroy();
  window._catsChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [
      { label: 'Items (count)', data: itemCounts, yAxisID:'y-items', backgroundColor:'#60A5FA' },
      { label: 'Total value (MMK)', data: totalValues, yAxisID:'y-value', backgroundColor:'#F59E0B' }
    ]},
    options: {
      interaction: { mode: 'index', intersect: false },
      scales: {
        'y-items': { type: 'linear', position: 'left', title: { display:true, text:'Item count' } },
        'y-value': { type: 'linear', position: 'right', title: { display:true, text:'Value (MMK)' }, grid: { drawOnChartArea: false } }
      },
      plugins: { legend: { position: 'bottom' } }
    }
  });
}

/* Locations: donut chart for distribution and horizontal bar for top locations by value */
function renderLocationsCharts(){
  const locs = window.AMS?.locations || [];
  const assets = window.AMS?.assets || [];

  const labels = locs.map(l => l.name);
  const qtys = locs.map(l => assets.filter(a => a.locationId === l.id).reduce((s,a)=>s+(a.qty||0),0));
  const vals = locs.map(l => assets.filter(a => a.locationId === l.id).reduce((s,a)=>s + ((a.qty||0)*(a.unitValue||0)),0));

  const donutEl = $a("#locationsDonut");
  if(donutEl){
    const ctx = donutEl.getContext("2d");
    if(window._locDonut) window._locDonut.destroy();
    window._locDonut = new Chart(ctx, { type:'doughnut', data:{ labels, datasets:[{ data: qtys, backgroundColor: labels.map((_,i)=>['#6366F1','#60A5FA','#10B981','#F59E0B'][i%4]) }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
  }

  const hbarEl = $a("#locationsHBar");
  if(hbarEl){
    const ctx2 = hbarEl.getContext("2d");
    if(window._locHBar) window._locHBar.destroy();
    window._locHBar = new Chart(ctx2, { type:'bar', data:{ labels, datasets:[{ label:'Total value MMK', data: vals, backgroundColor:'#C084FC' }] }, options:{ indexAxis:'y', plugins:{ legend:{ display:false } } } });
  }
}

/* Users: bubble or bar chart showing assigned items per user and positions breakdown */
function renderUsersCharts(){
  const users = window.AMS?.users || [];
  const assets = window.AMS?.assets || [];

  // assigned count per user (qty)
  const labels = users.map(u => u.name);
  const assignedQty = users.map(u => assets.filter(a => a.assignedTo === u.id).reduce((s,a)=> s + (a.qty||0), 0));
  const assignedValue = users.map(u => assets.filter(a => a.assignedTo === u.id).reduce((s,a)=> s + ((a.qty||0)*(a.unitValue||0)), 0));

  const el = $a("#usersChart");
  if(el){
    const ctx = el.getContext("2d");
    if(window._usersChart) window._usersChart.destroy();
    window._usersChart = new Chart(ctx, {
      type:'bar',
      data:{ labels, datasets:[{ label:'Assigned items (qty)', data: assignedQty, backgroundColor:'#10B981' }, { label:'Assigned value (MMK)', data: assignedValue, backgroundColor:'#EF4444' }] },
      options:{ interaction:{ mode:'index', intersect:false }, plugins:{ legend:{ position:'bottom' } }, scales:{ y:{ beginAtZero:true } } }
    });
  }

  // position breakdown (pie)
  const posMap = {};
  users.forEach(u => { posMap[u.position || 'Staff'] = (posMap[u.position||'Staff']||0) + 1; });
  const posLabels = Object.keys(posMap);
  const posData = posLabels.map(l => posMap[l]);
  const posEl = $a("#usersPosChart");
  if(posEl){
    const ctx2 = posEl.getContext("2d");
    if(window._usersPosChart) window._usersPosChart.destroy();
    window._usersPosChart = new Chart(ctx2, { type:'pie', data:{ labels: posLabels, datasets:[{ data: posData, backgroundColor:['#60A5FA','#F59E0B','#10B981','#C084FC'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
  }
}

/* Integrate charts into initAMS page wiring (call these where page rendering occurs) */
function initAMS(){
  // populate selects and assignedTo etc. (same as before)
  if($a("#category")) $a("#category").innerHTML = (window.AMS.categories||[]).map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  if($a("#location")) $a("#location").innerHTML = (window.AMS.locations||[]).map(l=>`<option value="${l.id}">${l.name}</option>`).join('');
  if($a("#assignedTo")) $a("#assignedTo").innerHTML = `<option value="">—</option>${(window.AMS.users||[]).map(u=>`<option value="${u.id}">${u.name}</option>`).join('')}`;

  $a("#addAsset")?.addEventListener('click', openAdd);
  $a("#assetForm")?.addEventListener('submit', saveAsset);
  $a("#assetCancel")?.addEventListener('click', e=>{ e.preventDefault(); closeModal(); });
  $a("#exportAssets")?.addEventListener('click', exportAssetsCsv);

  $a("#addCategoryBtn")?.addEventListener('click', ()=>{
    const name = ($a("#newCategoryName")?.value||"").trim(); if(!name) return alert('enter name');
    const id = 'c' + (window.AMS.categories.length + 1);
    window.AMS.categories.push({ id, name });
    $a("#newCategoryName").value = "";
    renderCategories(); renderAssets(); renderSummaryKPIs(); renderCategoriesCharts();
  });

  $a("#addLocationBtn")?.addEventListener('click', ()=>{
    const name = ($a("#newLocationName")?.value||"").trim(); if(!name) return alert('enter name');
    const id = 'loc' + (window.AMS.locations.length + 1);
    window.AMS.locations.push({ id, name });
    $a("#newLocationName").value = "";
    renderLocations(); renderAssets(); renderSummaryKPIs(); renderLocationsCharts();
  });

  $a("#addUserBtn")?.addEventListener('click', ()=>{
    const name = ($a("#newUserName")?.value||"").trim(); const email = ($a("#newUserEmail")?.value||"").trim();
    if(!name || !email) return alert('enter name and email');
    const id = 'u' + (window.AMS.users.length + 1);
    window.AMS.users.push({ id, name, role: "staff", position: "Staff", locationId: window.AMS.locations[0]?.id || null, email });
    $a("#newUserName").value = ""; $a("#newUserEmail").value = "";
    renderUsers(); renderAssets(); renderSummaryKPIs(); renderUsersCharts();
  });

  // render per-page
  const page = location.pathname.split('/').pop() || 'index.html';
  if(page === '' || page === 'index.html'){ renderSummaryKPIs(); renderAssetsCharts(); renderCategoriesCharts(); renderLocationsCharts(); renderUsersCharts(); }
  if(page === 'assets.html') renderAssets();
  if(page === 'categories.html'){ renderCategories(); renderCategoriesCharts(); }
  if(page === 'locations.html'){ renderLocations(); renderLocationsCharts(); }
  if(page === 'users.html'){ renderUsers(); renderUsersCharts(); }

  initAMSSidebar();
}

/* Bootstrapping unchanged */
(function bootstrapAMS(){
  function boot(){ try{ initAMS(); }catch(e){ console.error('AMS init error',e); } }
  if(window.AMS && Array.isArray(window.AMS.assets)) boot();
  else {
    document.addEventListener('AMS_LOADED', boot, { once:true });
    setTimeout(()=>{ if(window.AMS && Array.isArray(window.AMS.assets)) boot(); }, 1000);
  }
})();
