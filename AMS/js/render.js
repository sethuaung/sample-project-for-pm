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

  function destroyChart(instance) { try { if (instance && typeof instance.destroy === 'function') instance.destroy(); } catch(e) { console.warn(e); } }
  function drawCanvasPlaceholder(canvas, text) { try { const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.font = '14px system-ui, -apple-system, "Segoe UI", Roboto, Arial'; ctx.fillStyle = '#6b7280'; ctx.textAlign = 'center'; ctx.fillText(text, canvas.width/2, canvas.height/2); } catch(e){} }

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
    if (typeof Chart === 'undefined') { console.warn('Chart.js
