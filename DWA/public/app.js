// public/app.js — shared UI logic with CSV export and date-range filters
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function fmt(n){ return Number(n).toLocaleString("en-US"); }
function providerName(id){ const w = (window.DEMO.wallets||[]).find(x=>x.id===id) || {}; return w.provider || id; }
function merchantName(id){ const m = (window.DEMO.mmqrSamples||[]).find(x=>x.id===id) || {}; return m.merchantName || id; }

function csvEscape(v){ if(v===null||v===undefined) return ""; const s = String(v); if(s.includes(",")||s.includes("\"")||s.includes("\n")) return `"${s.replace(/"/g,'""')}"`; return s; }
function downloadCsv(filename, csv){ const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

function filterTxsByDate(txs, start, end){
  if(!start && !end) return txs;
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  return txs.filter(t=>{
    const d = new Date(t.timestamp);
    if(s && d < s) return false;
    if(e){ const eEnd = new Date(e); eEnd.setHours(23,59,59,999); if(d > eEnd) return false; }
    return true;
  });
}

function initNav(){ $$(".nav-link").forEach(link => link.classList.remove("text-indigo-600","font-semibold")); const path = location.pathname.split('/').pop() || 'index.html'; const key = path === '' ? 'index.html' : path; const el = document.querySelector(`a.nav-link[data-page="${key}"]`); if(el) el.classList.add("text-indigo-600","font-semibold"); }

function renderDashboard(){
  const all = window.DEMO.transactions || [];
  const start = $("#dashStart")?.value || null;
  const end = $("#dashEnd")?.value || null;
  const txs = filterTxsByDate(all, start, end);

  const totalTx = txs.length;
  const totalVol = txs.reduce((s,t)=>s+(t.amount||0),0);
  const p2pVol = txs.filter(t=>t.type==='p2p').reduce((s,t)=>s+(t.amount||0),0);
  const p2mVol = txs.filter(t=>t.type==='p2m').reduce((s,t)=>s+(t.amount||0),0);
  $("#kpi-total").textContent = totalTx;
  $("#kpi-volume").textContent = fmt(totalVol) + " MMK";
  $("#kpi-p2p").textContent = fmt(p2pVol) + " MMK";
  $("#kpi-p2m").textContent = fmt(p2mVol) + " MMK";

  const recent = txs.slice().sort((a,b)=> b.timestamp.localeCompare(a.timestamp)).slice(0,8);
  $("#dashTableBody").innerHTML = recent.map(tx=>`<tr class="border-b"><td class="px-3 py-2">${tx.id}</td><td class="px-3 py-2">${new Date(tx.timestamp).toLocaleString()}</td><td class="px-3 py-2">${tx.type.toUpperCase()}</td><td class="px-3 py-2">${providerName(tx.from)}</td><td class="px-3 py-2">${tx.mmqr?merchantName(tx.mmqr):providerName(tx.to)}</td><td class="px-3 py-2 text-right">${fmt(tx.amount)}</td><td class="px-3 py-2">${tx.status}</td></tr>`).join('');

  $("#allTxPreview").innerHTML = (txs.slice().sort((a,b)=> b.timestamp.localeCompare(a.timestamp))).map(tx=>`<tr class="border-b"><td class="px-3 py-2">${tx.id}</td><td class="px-3 py-2">${new Date(tx.timestamp).toLocaleString()}</td><td class="px-3 py-2">${tx.type.toUpperCase()}</td><td class="px-3 py-2">${providerName(tx.from)}</td><td class="px-3 py-2">${tx.mmqr?merchantName(tx.mmqr):providerName(tx.to)}</td><td class="px-3 py-2 text-right">${fmt(tx.amount)}</td><td class="px-3 py-2">${tx.status}</td></tr>`).join('');

  const byHour = {};
  txs.forEach(t=>{ const hr = new Date(t.timestamp).toISOString().slice(0,13)+":00"; byHour[hr] = (byHour[hr]||0)+t.amount; });
  const hours = Object.keys(byHour).sort();
  const volumes = hours.map(h=>byHour[h]);

  const statusCounts = {};
  txs.forEach(t=> statusCounts[t.status] = (statusCounts[t.status]||0)+1);

  const volCtx = document.getElementById("dashVolumes");
  if(volCtx){
    const ctx = volCtx.getContext("2d");
    if(window._dashVolChart) window._dashVolChart.destroy();
    window._dashVolChart = new Chart(ctx, { type:'bar', data:{ labels: hours, datasets:[{ label:'MMK volume', data: volumes, backgroundColor:'#6366F1' }] }, options:{ plugins:{ legend:{ display:false } }, scales:{ x:{ ticks:{ maxRotation:45,minRotation:45 } } } } });
  }

  const statusCtx = document.getElementById("dashStatus");
  if(statusCtx){
    const ctx2 = statusCtx.getContext("2d");
    if(window._dashStatusChart) window._dashStatusChart.destroy();
    window._dashStatusChart = new Chart(ctx2, { type:'doughnut', data:{ labels:Object.keys(statusCounts), datasets:[{ data:Object.values(statusCounts), backgroundColor:['#10B981','#F59E0B','#EF4444'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
  }
}

function renderTransactions(){
  const all = window.DEMO.transactions || [];
  const start = $("#txStart")?.value || null;
  const end = $("#txEnd")?.value || null;
  const txs = filterTxsByDate(all, start, end).slice().sort((a,b)=> b.timestamp.localeCompare(a.timestamp));
  $("#txTableBody").innerHTML = txs.map(tx=>`<tr class="border-b"><td class="px-3 py-2">${tx.id}</td><td class="px-3 py-2">${new Date(tx.timestamp).toLocaleString()}</td><td class="px-3 py-2">${tx.type.toUpperCase()}</td><td class="px-3 py-2">${providerName(tx.from)}</td><td class="px-3 py-2">${tx.mmqr?merchantName(tx.mmqr):providerName(tx.to)}</td><td class="px-3 py-2 text-right">${fmt(tx.amount)}</td><td class="px-3 py-2">${tx.status}</td></tr>`).join('');

  const byHour = {};
  txs.forEach(t=>{ const hr = new Date(t.timestamp).toISOString().slice(0,13)+":00"; byHour[hr] = (byHour[hr]||0) + t.amount; });
  const labels = Object.keys(byHour).sort();
  const data = labels.map(l=>byHour[l]);

  const vctx = document.getElementById("volumesChart");
  if(vctx){
    const ctx = vctx.getContext("2d");
    if(window._txVolChart) window._txVolChart.destroy();
    window._txVolChart = new Chart(ctx, { type:'line', data:{ labels, datasets:[{ label:'Volume', data, borderColor:'#06B6D4', backgroundColor:'rgba(6,182,212,0.1)', fill:true }] }, options:{ plugins:{ legend:{ display:false } } } });
  }

  const statusCounts = txs.reduce((acc,t)=>{ acc[t.status]=(acc[t.status]||0)+1; return acc; },{});
  const sctx = document.getElementById("statusChart");
  if(sctx){
    const ctx2 = sctx.getContext("2d");
    if(window._txStatusChart) window._txStatusChart.destroy();
    window._txStatusChart = new Chart(ctx2, { type:'doughnut', data:{ labels:Object.keys(statusCounts), datasets:[{ data:Object.values(statusCounts), backgroundColor:['#10B981','#F59E0B','#EF4444'] }] }, options:{ plugins:{ legend:{ position:'bottom' } } } });
  }

  const totalCount = txs.length;
  const totalVolume = txs.reduce((s,t)=>s+t.amount,0);
  const p2p = txs.filter(t=>t.type==='p2p').reduce((s,t)=>s+t.amount,0);
  const p2m = txs.filter(t=>t.type==='p2m').reduce((s,t)=>s+t.amount,0);
  $("#summaryReport").innerHTML = `<div class="grid grid-cols-2 gap-4"><div><strong>Total transactions</strong><div class="text-lg mt-1">${totalCount}</div></div><div><strong>Total volume</strong><div class="text-lg mt-1">${fmt(totalVolume)} MMK</div></div><div><strong>P2P</strong><div class="text-sm mt-1">${fmt(p2p)} MMK</div></div><div><strong>P2M</strong><div class="text-sm mt-1">${fmt(p2m)} MMK</div></div></div>`;
}

function renderWallets(){
  const wallets = window.DEMO.wallets || [];
  $("#walletCards").innerHTML = wallets.map(w=>`<div class="p-3 border rounded bg-gray-50"><div class="text-sm font-medium">${w.provider} <span class="text-xs text-gray-500">(${w.id})</span></div><div class="text-xs text-gray-600">Owner: ${w.ownerId ? (window.DEMO.users.find(u=>u.id===w.ownerId)||{}).name : 'Merchant'}</div><div class="mt-2 text-sm">Balance: <strong>${fmt(w.balance)} MMK</strong></div><div class="mt-2 text-xs text-gray-500">Type: ${w.type}</div></div>`).join('');

  const labels = wallets.map(w=>w.provider + " ("+w.id+")");
  const data = wallets.map(w=>w.balance || 0);
  const ctx = document.getElementById("balancesChart");
  if(ctx){
    const c = ctx.getContext("2d");
    if(window._balancesChart) window._balancesChart.destroy();
    window._balancesChart = new Chart(c, { type:'bar', data:{ labels, datasets:[{ label:'Balance', data, backgroundColor:'#60A5FA' }] }, options:{ plugins:{ legend:{ display:false } } } });
  }

  const report = wallets.map(w=>{
    const related = (window.DEMO.transactions||[]).filter(t => t.from===w.id || t.to===w.id);
    const count = related.length;
    const volume = related.reduce((s,t)=>s+t.amount,0);
    return { id:w.id, provider:w.provider, owner: w.ownerId ? (window.DEMO.users.find(u=>u.id===w.ownerId)||{}).name : 'Merchant', count, volume };
  });
  const rows = report.map(r=>`<div class="grid grid-cols-4 gap-2 py-2 border-b text-xs"><div>${r.provider}<div class="text-xs text-gray-500">${r.id}</div></div><div>${r.owner}</div><div class="text-right">${r.count}</div><div class="text-right">${fmt(r.volume)} MMK</div></div>`).join('');
  $("#walletReport").innerHTML = `<div class="grid grid-cols-4 gap-2 font-medium py-2 border-b"><div>Wallet</div><div>Owner</div><div class="text-right">Tx Count</div><div class="text-right">Tx Volume</div></div>` + rows;
}

function exportDashboardCsv(){
  const start = $("#dashStart")?.value || null;
  const end = $("#dashEnd")?.value || null;
  const txs = filterTxsByDate(window.DEMO.transactions || [], start, end).slice().sort((a,b)=> b.timestamp.localeCompare(a.timestamp));
  const rows = ['id,date,type,from,to,amount,currency,status'];
  txs.forEach(tx => {
    const from = providerName(tx.from);
    const to = tx.mmqr ? merchantName(tx.mmqr) : providerName(tx.to);
    rows.push([csvEscape(tx.id), csvEscape(new Date(tx.timestamp).toISOString()), csvEscape(tx.type), csvEscape(from), csvEscape(to), csvEscape(tx.amount), csvEscape(tx.currency), csvEscape(tx.status)].join(','));
  });
  downloadCsv('dashboard_transactions.csv', rows.join('\n'));
}

function exportTransactionsCsv(){
  const start = $("#txStart")?.value || null;
  const end = $("#txEnd")?.value || null;
  const txs = filterTxsByDate(window.DEMO.transactions || [], start, end).slice().sort((a,b)=> b.timestamp.localeCompare(a.timestamp));
  const rows = ['id,date,type,from,to,amount,currency,status'];
  txs.forEach(tx => {
    const from = providerName(tx.from);
    const to = tx.mmqr ? merchantName(tx.mmqr) : providerName(tx.to);
    rows.push([csvEscape(tx.id), csvEscape(new Date(tx.timestamp).toISOString()), csvEscape(tx.type), csvEscape(from), csvEscape(to), csvEscape(tx.amount), csvEscape(tx.currency), csvEscape(tx.status)].join(','));
  });
  downloadCsv('transactions_export.csv', rows.join('\n'));
}

function exportWalletsCsv(){
  const wallets = window.DEMO.wallets || [];
  const rows = ['wallet_id,provider,owner,balance,type,tx_count,tx_volume'];
  wallets.forEach(w=>{
    const owner = w.ownerId ? (window.DEMO.users.find(u=>u.id===w.ownerId)||{}).name : 'Merchant';
    const related = (window.DEMO.transactions||[]).filter(t => t.from===w.id || t.to===w.id);
    const count = related.length;
    const volume = related.reduce((s,t)=>s+t.amount,0);
    rows.push([csvEscape(w.id), csvEscape(w.provider), csvEscape(owner), csvEscape(w.balance), csvEscape(w.type), csvEscape(count), csvEscape(volume)].join(','));
  });
  downloadCsv('wallets_export.csv', rows.join('\n'));
}

function adminApplyWebhook(txId, event){
  const tx = (window.DEMO.transactions || []).find(t=>t.id===txId);
  if(!tx) return { ok:false, error:'not found' };
  if(event === 'payment_captured'){ tx.status = 'settled'; const from = window.DEMO.wallets.find(w=>w.id===tx.from); const to = tx.to ? window.DEMO.wallets.find(w=>w.id===tx.to) : null; if(from) from.balance = Math.max(0, from.balance - tx.amount); if(to) to.balance = (to.balance||0) + tx.amount; }
  else if(event === 'payment_declined'){ tx.status = 'failed'; }
  return { ok:true, tx };
}

document.addEventListener('DOMContentLoaded', ()=>{
  initNav();
  const page = location.pathname.split('/').pop() || 'index.html';
  if(page === '' || page === 'index.html' || page === 'dashboard.html') renderDashboard();
  else if(page === 'transactions.html') renderTransactions();
  else if(page === 'wallets.html') renderWallets();

  const dashApply = document.getElementById('dashApply');
  if(dashApply) dashApply.addEventListener('click', ()=> renderDashboard());
  const txApply = document.getElementById('txApply');
  if(txApply) txApply.addEventListener('click', ()=> renderTransactions());

  const dashExport = document.getElementById('dashExport');
  if(dashExport) dashExport.addEventListener('click', exportDashboardCsv);
  const txExport = document.getElementById('txExport');
  if(txExport) txExport.addEventListener('click', exportTransactionsCsv);
  const walletExport = document.getElementById('walletExport');
  if(walletExport) walletExport.addEventListener('click', exportWalletsCsv);

  const applyBtn = document.getElementById('adminApply');
  if(applyBtn){
    applyBtn.addEventListener('click', ()=>{
      const txId = document.getElementById('adminTxId').value.trim();
      const event = document.getElementById('adminEvent').value;
      const res = adminApplyWebhook(txId, event);
      if(res.ok){ document.getElementById('adminOut').textContent = JSON.stringify(res.tx, null, 2); alert('Applied'); }
      else { document.getElementById('adminOut').textContent = JSON.stringify(res, null, 2); alert('Failed'); }
    });
  }
  const listBtn = document.getElementById('adminList');
  if(listBtn) listBtn.addEventListener('click', ()=> { const pending = (window.DEMO.transactions||[]).filter(t=>t.status==='pending'); document.getElementById('adminOut').textContent = JSON.stringify(pending, null, 2); });
});
