// js/render.js
(() => {
  const CHARTS = { category: null, status: null };
  const getAssets = () => Array.isArray(window.assetData) ? window.assetData : [];
  const getMovements = () => Array.isArray(window.movementLogs) ? window.movementLogs : [];
  const getSuppliers = () => Array.isArray(window.suppliers) ? window.suppliers : [];

  function formatTimestampForFilename() {
    const now = new Date(); const pad = n => String(n).padStart(2,'0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  function destroyChart(instance) {
    try { if (instance && typeof instance.destroy === 'function') instance.destroy(); } catch(e) { console.warn(e); }
  }

  function drawCanvasPlaceholder(canvas, text) {
    try {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.font = '14px system-ui, -apple-system, "Segoe UI", Roboto, Arial';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText(text, canvas.width/2, canvas.height/2);
    } catch(e){}
  }

  function drawCategoryChart() {
    if (typeof Chart === 'undefined') { console.warn('Chart.js not loaded'); return; }
    const canvas = document.getElementById('categoryChart'); if (!canvas) { console.warn('categoryChart canvas missing'); return; }
    const assets = getAssets();
    const counts = assets.reduce((acc,a)=>{ const k = a && a.category ? a.category : 'Unspecified'; acc[k] = (acc[k]||0)+1; return acc; }, {});
    const labels = Object.keys(counts); const values = Object.values(counts);
    destroyChart(CHARTS.category);
    if (!labels.length) { drawCanvasPlaceholder(canvas, 'No category data available'); CHARTS.category = null; return; }
    const palette = ['#3b82f6','#10b981','#f59e0b','#f97316','#6b7280','#8b5cf6','#ef4444','#06b6d4'];
    CHARTS.category = new Chart(canvas.getContext('2d'), {
      type:'bar',
      data:{ labels, datasets:[{ label:'Assets', data:values, backgroundColor: labels.map((_,i)=>palette[i%palette.length]), borderRadius:6 }]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false }}, scales:{ x:{ ticks:{ maxRotation:45 }}, y:{ beginAtZero:true, ticks:{ precision:0 }}}}
    });
  }

  function drawStatusChart() {
    if (typeof Chart === 'undefined') { console.warn('Chart.js not loaded'); return; }
    const canvas = document.getElementById('statusChart'); if (!canvas) { console.warn('statusChart canvas missing'); return; }
    const assets = getAssets();
    const counts = assets.reduce((acc,a)=>{ const k = a && a.status ? a.status : 'Unspecified'; acc[k] = (acc[k]||0)+1; return acc; }, {});
    const labels = Object.keys(counts); const values = Object.values(counts);
    destroyChart(CHARTS.status);
    if (!labels.length) { drawCanvasPlaceholder(canvas, 'No status data available'); CHARTS.status = null; return; }
    const colorMap = { 'New':'#f59e0b','In Use':'#10b981','Maintenance':'#f97316','Reassigned':'#60a5fa','Retired':'#9ca3af' };
    const palette = labels.map(l => colorMap[l] || '#8b5cf6');
    CHARTS.status = new Chart(canvas.getContext('2d'), { type:'doughnut', data:{ labels, datasets:[{ data: values, backgroundColor: palette }]}, options:{ responsive:true, maintainAspectRatio:false } });
  }

  function renderRecentMovements() {
    const container = document.getElementById('recentMovements'); if (!container) return;
    const recent = getMovements().slice().sort((a,b)=>new Date(b.move_date)-new Date(a.move_date)).slice(0,6);
    if (!recent.length) { container.innerHTML = '<div class="text-sm text-gray-500">No recent movements</div>'; return; }
    container.innerHTML = recent.map(r => `
      <div class="py-2 border-b">
        <div class="font-semibold">${r.asset_id} • ${r.move_status}</div>
        <div class="text-xs text-gray-500">${r.move_date} — ${r.move_notes || '-'}</div>
      </div>
    `).join('');
  }

  function renderItemsSnapshot(limit=30) {
    const tbody = document.getElementById('assetTableBody'); if (!tbody) return;
    const rows = getAssets().slice(0,limit);
    tbody.innerHTML = rows.map(a => `
      <tr class="border-b">
        <td class="px-4 py-2">${a.id}</td>
        <td class="px-4 py-2">${a.name}</td>
        <td class="px-4 py-2">${a.category}</td>
        <td class="px-4 py-2">${a.location}</td>
        <td class="px-4 py-2 font-semibold">${a.status}</td>
        <td class="px-4 py-2">${a.assignedTo||'-'}</td>
        <td class="px-4 py-2"><button class="text-blue-600" onclick="openEditModal(${(window.assetData||[]).findIndex(x=>x.id===a.id)})">Edit</button></td>
      </tr>
    `).join('');
  }

  function updateTotals() {
    const assetsCountEl = document.getElementById('totalAssets');
    const suppliersCountEl = document.getElementById('totalSuppliers');
    const movementsCountEl = document.getElementById('totalMovements');
    if (assetsCountEl) assetsCountEl.textContent = getAssets().length;
    if (suppliersCountEl) suppliersCountEl.textContent = getSuppliers().length;
    if (movementsCountEl) movementsCountEl.textContent = getMovements().length;
  }

  function refreshDashboard() {
    if (refreshDashboard._timer) clearTimeout(refreshDashboard._timer);
    refreshDashboard._timer = setTimeout(() => {
      drawCategoryChart();
      drawStatusChart();
      renderRecentMovements();
      renderItemsSnapshot();
      updateTotals();
      window.dispatchEvent(new CustomEvent('felixent:dashboard:refreshed', { detail: { timestamp: new Date().toISOString() } }));
    }, 50);
  }

  window.addEventListener('felixent:data:changed', () => refreshDashboard());

  window.refreshDashboard = refreshDashboard;
  window.drawCategoryChart = drawCategoryChart;
  window.drawStatusChart = drawStatusChart;
  window.renderRecentMovements = renderRecentMovements;
  window.renderItemsSnapshot = renderItemsSnapshot;
  window.updateTotals = updateTotals;

  document.addEventListener('DOMContentLoaded', () => {
    let attempts = 0;
    const tryInit = () => {
      attempts += 1;
      refreshDashboard();
      if (typeof Chart === 'undefined' && attempts < 6) setTimeout(tryInit, 350);
    };
    tryInit();
  });

  window.felixentDataChanged = function() { window.dispatchEvent(new Event('felixent:data:changed')); };

  try {
    if (Array.isArray(window.assetData)) {
      const pushOrig = window.assetData.push.bind(window.assetData);
      window.assetData.push = function(...args) { const res = pushOrig(...args); window.felixentDataChanged(); return res; };
      const spliceOrig = window.assetData.splice.bind(window.assetData);
      window.assetData.splice = function(...args) { const res = spliceOrig(...args); window.felixentDataChanged(); return res; };
    }
    if (Array.isArray(window.movementLogs)) {
      const pushMov = window.movementLogs.push.bind(window.movementLogs);
      window.movementLogs.push = function(...a){ const r = pushMov(...a); window.felixentDataChanged(); return r; };
    }
    if (Array.isArray(window.suppliers)) {
      const pushSup = window.suppliers.push.bind(window.suppliers);
      window.suppliers.push = function(...a){ const r = pushSup(...a); window.felixentDataChanged(); return r; };
    }
  } catch (e) { /* non-fatal */ }

})();
