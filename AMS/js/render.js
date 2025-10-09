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
  function drawCanvasPlaceholder(canvas, text) { try { const ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.font = '14px system-ui, -apple-system, "Segoe
