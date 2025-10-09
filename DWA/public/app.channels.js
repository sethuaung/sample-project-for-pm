// public/app.channels.js — channels page logic; depends on app.js (providerName, merchantName, csv helpers)
(function(){
  const $ = s => document.querySelector(s);

  function getProvidersFromData(){
    const providers = new Set();
    (window.DEMO.wallets||[]).forEach(w => providers.add(w.provider));
    (window.DEMO.mmqrSamples||[]).forEach(m => providers.add(m.merchantName));
    return Array.from(providers);
  }

  function txChannelLabel(tx){
    // prefer mmqr merchant name for merchant-targeted txs, otherwise providerName of from wallet or to wallet
    if(tx.mmqr) return merchantName(tx.mmqr);
    const from = providerName(tx.from) || null;
    const to = providerName(tx.to) || null;
    return to === 'Merchant-A' || to === 'Merchant-B' ? to : (from || to || tx.from || tx.to);
  }

  function filterTxs(){
    const start = $("#chStart")?.value || null;
    const end = $("#chEnd")?.value || null;
    const all = (window.DEMO.transactions || []).slice();
    if(!start && !end) return all;
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    return all.filter(t => {
      const d = new Date(t.timestamp);
      if(s && d < s) return false;
      if(e){ const eEnd = new Date(e); eEnd.setHours(23,59,59,999); if(d > eEnd) return false; }
      return true;
    });
  }

  function renderProviderTable(filtered){
    const providers = getProvidersFromData();
    const agg = {};
    providers.forEach(p => agg[p] = { count: 0, volume: 0 });
    filtered.forEach(tx => {
      const label = txChannelLabel(tx);
      if(!agg[label]) agg[label] = { count: 0, volume: 0 };
      agg[label].count += 1;
      agg[label].volume += tx.amount || 0;
    });

    const rows = Object.entries(agg).sort((a,b)=> b[1].volume - a[1].volume).map(([provider, v]) => {
      return `<div class="grid grid-cols-3 gap-2 py-2 border-b"><div><strong>${provider}</strong></div><div class="text-right">${v.count} tx</div><div class="text-right">${Number(v.volume).toLocaleString()} MMK</div></div>`;
    }).join('');
    $("#providerTable").innerHTML = `<div class="grid grid-cols-3 gap-2 font-medium py-2 border-b"><div>Provider</div><div class="text-right">Tx Count</div><div class="text-right">Volume</div></div>` + rows;
  }

  function renderChart(filtered){
    const byProvider = {};
    filtered.forEach(tx => {
      const p = txChannelLabel(tx);
      byProvider[p] = (byProvider[p]||0) + (tx.amount||0);
    });
    const labels = Object.keys(byProvider).sort();
    const data = labels.map(l => byProvider[l]);

    const el = document.getElementById('channelsChart');
    if(!el) return;
    const ctx = el.getContext('2d');
    if(window._channelsChart) window._channelsChart.destroy();
    window._channelsChart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Volume MMK', data, backgroundColor: labels.map((l,i)=>['#6366F1','#60A5FA','#F59E0B','#10B981','#EF4444'][i%5]) }] },
      options: { plugins:{ legend:{ display:false } }, scales:{ x:{ ticks:{ maxRotation:45, minRotation:45 } } } }
    });
  }

  function renderTable(filtered){
    $("#chCount").textContent = filtered.length;
    const total = filtered.reduce((s,t)=>s+(t.amount||0),0);
    $("#chVolume").textContent = Number(total).toLocaleString();

    const rows = filtered.slice().sort((a,b)=> b.timestamp.localeCompare(a.timestamp)).map(tx => {
      const channel = txChannelLabel(tx);
      const from = providerName(tx.from);
      const to = tx.mmqr ? merchantName(tx.mmqr) : providerName(tx.to);
      return `<tr class="border-b"><td class="px-3 py-2">${tx.id}</td><td class="px-3 py-2">${new Date(tx.timestamp).toLocaleString()}</td><td class="px-3 py-2">${channel}</td><td class="px-3 py-2">${from}</td><td class="px-3 py-2">${to}</td><td class="px-3 py-2 text-right">${Number(tx.amount).toLocaleString()}</td><td class="px-3 py-2">${tx.status}</td></tr>`;
    }).join('');
    $("#chTableBody").innerHTML = rows;
  }

  function exportChannelsCsv(filtered){
    const rows = ['id,date,channel,from,to,amount,currency,status'];
    filtered.forEach(tx=>{
      const channel = txChannelLabel(tx);
      const from = providerName(tx.from);
      const to = tx.mmqr ? merchantName(tx.mmqr) : providerName(tx.to);
      rows.push([csvEscape(tx.id), csvEscape(new Date(tx.timestamp).toISOString()), csvEscape(channel), csvEscape(from), csvEscape(to), csvEscape(tx.amount), csvEscape(tx.currency), csvEscape(tx.status)].join(','));
    });
    downloadCsv('channels_transactions.csv', rows.join('\n'));
  }

  function applyAndRender(){
    const filtered = filterTxs();
    renderProviderTable(filtered);
    renderChart(filtered);
    renderTable(filtered);
    // store last filtered for export
    window._channels_last = filtered;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initNav();
    // only run on channels.html
    const page = location.pathname.split('/').pop() || 'index.html';
    if(page !== 'channels.html') return;
    if(!window.DEMO || !window.DEMO.transactions) {
      document.addEventListener('DEMO_LOADED', applyAndRender, { once:true });
    } else applyAndRender();

    document.getElementById('chApply')?.addEventListener('click', applyAndRender);
    document.getElementById('chExport')?.addEventListener('click', ()=> exportChannelsCsv(window._channels_last || filterTxs()));
  });
})();
