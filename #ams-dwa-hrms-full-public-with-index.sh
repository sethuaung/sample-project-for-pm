#!/usr/bin/env bash
set -euo pipefail
OUT_ZIP="ams-dwa-hrms-full-public-with-index.zip"
TMP="tmp_full_public_with_index"
rm -rf "$TMP" "$OUT_ZIP"
mkdir -p "$TMP/DWA/public" "$TMP/AMS/public" "$TMP/HRMS/public"

# -------- DWA data.js (50 txs) --------
cat > "$TMP/DWA/public/data.js" <<'JS'
(function(){
  const now = new Date();
  function iso(offsetHours){ return new Date(now.getTime() - offsetHours*3600*1000).toISOString(); }
  function rnd(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

  window.DEMO = {
    limits: { p2pPerTx: 1000000, p2pDaily: 5000000, p2mDaily: 10000000 },
    users: [
      { id: "u1", name: "Aye", nrc: "12/ABC(N)12345", kycLevel: "verified" },
      { id: "u2", name: "Min", nrc: null, kycLevel: "basic" },
      { id: "u3", name: "Hla", nrc: "13/XYZ(N)54321", kycLevel: "verified" },
      { id: "u4", name: "Zaw", nrc: "14/DEF(N)67890", kycLevel: "verified" }
    ],
    wallets: [
      { id: "w1", ownerId: "u1", provider: "Wave Money", balance: 1500000, type: "consumer" },
      { id: "w2", ownerId: "u2", provider: "TrueMoney", balance: 500000, type: "consumer" },
      { id: "w3", ownerId: "u3", provider: "KBZPay", balance: 800000, type: "consumer" },
      { id: "m1", ownerId: null, provider: "Merchant-A", balance: 25000000, type: "merchant" },
      { id: "m2", ownerId: null, provider: "Merchant-B", balance: 12000000, type: "merchant" }
    ],
    mmqrSamples: [
      { id: "mm1", merchantName: "Merchant-A", merchantCity: "Yangon", currency: "MMK", amount: 20000, payload: "000201...ABCD" },
      { id: "mm2", merchantName: "Merchant-B", merchantCity: "Mandalay", currency: "MMK", amount: 75000, payload: "000201...EFGH" }
    ],
    transactions: []
  };

  const statuses = ['settled','pending','failed'];
  const fromCandidates = ['w1','w2','w3'];
  const toCandidates = ['w1','w2','w3','m1','m2'];
  for(let i=1;i<=50;i++){
    const from = fromCandidates[rnd(0,fromCandidates.length-1)];
    let to = toCandidates[rnd(0,toCandidates.length-1)];
    if(to === from && Math.random() < 0.6) to = toCandidates[rnd(0,toCandidates.length-1)];
    const amount = Math.round(Math.max(1000, Math.min(300000, Math.abs(rnd(1,300000)))));
    const hourOffset = rnd(0,72);
    const tx = {
      id: `t${String(i).padStart(3,'0')}`,
      from,
      to,
      type: (to.startsWith('m') ? 'p2m' : (Math.random()<0.6 ? 'p2p' : 'p2m')),
      amount,
      currency: "MMK",
      timestamp: iso(hourOffset),
      status: statuses[rnd(0,statuses.length-1)],
      mmqr: (to.startsWith('m') && Math.random()<0.8) ? (Math.random()<0.6 ? 'mm1' : 'mm2') : null
    };
    window.DEMO.transactions.push(tx);
  }

  window.DEMO.transactions.slice(0,10).forEach(tx=>{
    const fromW = window.DEMO.wallets.find(w=>w.id===tx.from);
    const toW = window.DEMO.wallets.find(w=>w.id===tx.to);
    if(tx.status === 'settled'){
      if(fromW) fromW.balance = Math.max(0, fromW.balance - tx.amount);
      if(toW) toW.balance = (toW.balance||0) + tx.amount;
    }
  });

  document.dispatchEvent(new Event("DEMO_LOADED"));
})();
JS

# minimal DWA pages + app (for bundle) ----------
cat > "$TMP/DWA/public/app.js" <<'JS'
/* Minimal merged app.js for DWA demo (dashboard, transactions, wallets, channels, admin) */
const $ = s => document.querySelector(s);
function fmt(n){ return Number(n).toLocaleString("en-US"); }
function initDWA(){
  const page = location.pathname.split('/').pop() || 'index.html';
  if(page===''||page==='index.html'){
    const txs = window.DEMO?.transactions || [];
    document.getElementById('k_tx_count') && (document.getElementById('k_tx_count').textContent = txs.length);
    document.getElementById('k_volume') && (document.getElementById('k_volume').textContent = fmt(txs.reduce((s,t)=>s+(t.amount||0),0)) + " MMK");
    document.getElementById('k_pending') && (document.getElementById('k_pending').textContent = txs.filter(t=>t.status==='pending').length);
    const el = document.getElementById("dashVolumes");
    if(el){
      const labels = txs.slice(0,12).map(t=> new Date(t.timestamp).toLocaleString());
      const data = txs.slice(0,12).map(t=> t.amount);
      if(window._dashChart) window._dashChart.destroy();
      window._dashChart = new Chart(el.getContext('2d'),{ type:'bar', data:{ labels, datasets:[{ label:'Volume', data, backgroundColor:'#6366F1' }] }, options:{ plugins:{ legend:{ display:false } } } });
    }
  }
}
document.addEventListener('DOMContentLoaded', ()=> initDWA());
JS

cat > "$TMP/DWA/public/index.html" <<'HTML'
<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>DWA Dashboard</title><script src="https://cdn.tailwindcss.com"></script><script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script><script defer src="./data.js"></script><script defer src="./app.js"></script></head><body class="bg-gray-50 text-gray-800"><div class="max-w-6xl mx-auto p-6"><header class="flex items-center justify-between mb-6"><div><h1 class="text-2xl font-semibold">DWA Demo</h1><p class="text-sm text-gray-600">Dashboard</p></div></header><section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Transactions</div><div id="k_tx_count" class="text-2xl font-semibold">0</div></div><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Volume</div><div id="k_volume" class="text-2xl font-semibold">0 MMK</div></div><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Pending</div><div id="k_pending" class="text-2xl font-semibold">0</div></div></section><div class="bg-white p-4 rounded shadow"><canvas id="dashVolumes" height="120"></canvas></div></div></body></html>
HTML

# -------- AMS data + minimal app ----------
cat > "$TMP/AMS/public/data.ams.js" <<'JS'
(function(){
  const categories = [{ id: "c1", name: "Electronics" },{ id: "c2", name: "Furniture" },{ id: "c3", name: "Stationery" },{ id: "c4", name: "Peripherals" },{ id: "c5", name: "Consumables" }];
  const locations = [{ id: "loc1", name: "Warehouse A" },{ id: "loc2", name: "Office HQ" },{ id: "loc3", name: "Storefront" },{ id: "loc4", name: "Field Depot" }];
  const users = [{ id: "u1", name: "Aye", role: "staff", position: "Field Technician", locationId: "loc4", email: "aye@example.com" },{ id: "u2", name: "Min", role: "staff", position: "Sales Agent", locationId: "loc3", email: "min@example.com" },{ id: "u3", name: "Hla", role: "manager", position: "Operations Manager", locationId: "loc2", email: "hla@example.com" },{ id: "u4", name: "Zaw", role: "staff", position: "Warehouse Clerk", locationId: "loc1", email: "zaw@example.com" },{ id: "u5", name: "Kyaw", role: "admin", position: "System Admin", locationId: "loc2", email: "kyaw@example.com" }];
  let seed = 42;
  function rand(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }
  function rnd(min,max){ return Math.floor(rand()*(max-min+1))+min; }
  const sampleNames = ["POS Terminal","Tablet","Mobile Reader","Printer","Cash Drawer","Receipt Paper","A4 Paper Ream","Office Desk","Office Chair","Router","Switch","Keyboard","Mouse","Barcode Scanner","Label Printer","POS Pack","Battery Pack","Power Adapter","Protective Case","SIM Tray"];
  const assets = [];
  for(let i=1;i<=100;i++){ const category = pick(categories); const location = pick(locations); const nameBase = pick(sampleNames); const sku = `${category.name.substring(0,3).toUpperCase()}-${String(i).padStart(3,'0')}`; const qty = rnd(1,200); const unitValue = rnd(1000,5000000); const owner = (rand() < 0.6) ? pick(users).id : null; const purchasedAt = new Date(Date.now() - rnd(30,1200)*24*3600*1000).toISOString().slice(0,10); const condition = ["new","good","fair","poor"][Math.floor(rand()*4)]; assets.push({ id: "a" + String(i).padStart(4,'0'), sku, name: `${nameBase} ${i}`, categoryId: category.id, locationId: location.id, qty, unitValue, condition, purchasedAt, notes: owner ? `Allocated to ${owner}` : "", assignedTo: owner }); }
  window.AMS = { meta: { org: "Felixent", currency: "MMK" }, categories, locations, users, assets };
  document.dispatchEvent(new Event("AMS_LOADED"));
})();
JS

cat > "$TMP/AMS/public/app.ams.js" <<'JS'
/* Minimal AMS runtime to populate pages and charts (safe bootstrap) */
const $a = s => document.querySelector(s);
function fmt(n){ return Number(n).toLocaleString("en-US"); }
function renderSummaryKPIs(){ const assets = window.AMS?.assets||[]; const totalItems = assets.reduce((s,a)=>s+(a.qty||0),0); const totalValue = assets.reduce((s,a)=>s+((a.qty||0)*(a.unitValue||0)),0); if($a("#k_total_items")) $a("#k_total_items").textContent = fmt(totalItems); if($a("#k_total_value")) $a("#k_total_value").textContent = fmt(totalValue)+" "+(window.AMS?.meta?.currency||""); }
function initAMS(){ const page = location.pathname.split('/').pop() || 'index.html'; if(page===''||page==='index.html'){ renderSummaryKPIs(); } }
(function bootstrapAMS(){ function boot(){ try{ initAMS(); }catch(e){ console.error(e);} } if(window.AMS && Array.isArray(window.AMS.assets)) boot(); else { document.addEventListener('AMS_LOADED', boot, { once:true }); setTimeout(()=>{ if(window.AMS && Array.isArray(window.AMS.assets)) boot(); },1000); } })();
JS

# minimal AMS pages (index only for root link convenience)
cat > "$TMP/AMS/public/index.html" <<'HTML'
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>AMS Dashboard</title><script src="https://cdn.tailwindcss.com"></script><script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script><script defer src="./data.ams.js"></script><script defer src="./app.ams.js"></script></head><body class="bg-gray-50 text-gray-800"><div class="min-h-screen flex"><main class="flex-1 p-6"><header class="mb-6"><h1 class="text-2xl font-semibold">AMS Dashboard</h1></header><section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Total items</div><div id="k_total_items" class="text-2xl font-semibold">0</div></div><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Total value</div><div id="k_total_value" class="text-2xl font-semibold">0</div></div></section></main></div></body></html>
HTML

# -------- HRMS data + minimal app ----------
cat > "$TMP/HRMS/public/data.hrms.js" <<'JS'
(function(){
  const departments = [{ id: "d1", name: "Operations" },{ id: "d2", name: "Sales" },{ id: "d3", name: "Finance" },{ id: "d4", name: "People" },{ id: "d5", name: "Field" }];
  const roles = [{ id: "r1", name: "Manager" },{ id: "r2", name: "Staff" },{ id: "r3", name: "Technician" },{ id: "r4", name: "Clerk" },{ id: "r5", name: "Executive" }];
  let seed = 12345; function rand(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; } function rnd(min,max){ return Math.floor(rand()*(max-min+1))+min; }
  const first = ["Aye","Min","Hla","Zaw","Kyaw","Su","Myo","Ei","Nandar","Thiri","Tun","Soe","Khin","Win","Lwin"];
  const last = ["Oo","Htet","Kyaw","San","Aung","Lin","Naing","Htun","Thant","Myint"];
  const employees = [];
  for(let i=1;i<=30;i++){ const dept = pick(departments); const role = pick(roles); const fname = pick(first); const lname = pick(last); const id = "e" + String(i).padStart(3,"0"); const hireDaysAgo = rnd(30,1400); const hireDate = new Date(Date.now() - hireDaysAgo*24*3600*1000).toISOString().slice(0,10); const email = `${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`; const locationId = ["loc1","loc2","loc3","loc4"][Math.floor(rand()*4)]; employees.push({ id, firstName: fname, lastName: lname, name: fname + " " + lname, deptId: dept.id, deptName: dept.name, roleId: role.id, roleName: role.name, email, phone: `09${rnd(100000000,999999999)}`, hireDate, status: Math.random()<0.95 ? 'active' : 'inactive', locationId }); }
  const attendance = []; const leaves = [];
  window.HRMS = { meta:{ org:"Felixent" }, departments, roles, employees, attendance, leaves };
  document.dispatchEvent(new Event("HRMS_LOADED"));
})();
JS

cat > "$TMP/HRMS/public/app.hrms.js" <<'JS'
/* minimal HRMS app for bundle */
const $h = s => document.querySelector(s);
function renderHRDashboard(){ if(!$h("#hr_k_employees")) return; const employees = window.HRMS.employees||[]; $h("#hr_k_employees").textContent = employees.filter(e=>e.status==='active').length; $h("#hr_k_depts").textContent = (window.HRMS.departments||[]).length; $h("#hr_k_roles").textContent = (window.HRMS.roles||[]).length; $h("#hr_k_leaves").textContent = (window.HRMS.leaves||[]).filter(l=>l.status==='pending').length; }
function initHR(){ const page = location.pathname.split('/').pop()||'index.html'; if(page===''||page==='index.html') renderHRDashboard(); }
(function bootstrapHR(){ function boot(){ try{ initHR(); }catch(e){console.error(e);} } if(window.HRMS && Array.isArray(window.HRMS.employees)) boot(); else { document.addEventListener('HRMS_LOADED', boot, { once:true }); setTimeout(()=>{ if(window.HRMS && Array.isArray(window.HRMS.employees)) boot(); },800); } })();
JS

cat > "$TMP/HRMS/public/index.html" <<'HTML'
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>HRMS Dashboard</title><script src="https://cdn.tailwindcss.com"></script><script defer src="./data.hrms.js"></script><script defer src="./app.hrms.js"></script></head><body class="bg-gray-50 text-gray-800"><div class="min-h-screen flex"><main class="flex-1 p-6"><header class="mb-6"><h1 class="text-2xl font-semibold">HRMS Dashboard</h1></header><section class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Employees</div><div id="hr_k_employees" class="text-2xl font-semibold">0</div></div><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Departments</div><div id="hr_k_depts" class="text-2xl font-semibold">0</div></div><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Roles</div><div id="hr_k_roles" class="text-2xl font-semibold">0</div></div><div class="bg-white p-4 rounded shadow"><div class="text-xs text-gray-500">Pending Leaves</div><div id="hr_k_leaves" class="text-2xl font-semibold">0</div></div></section></main></div></body></html>
HTML

# Add README files and top-level index.html
cat > "$TMP/README.md" <<'MD'
# ams-dwa-hrms-full-public-with-index

This archive contains three static demo web apps designed for local testing and quick demos:

- DWA (Digital Wallet App) — path: DWA/public
- AMS (Inventory / Assets Management System) — path: AMS/public
- HRMS (Human Resource Management System) — path: HRMS/public

Quick-run (recommended)
1. Extract the zip.
2. Serve each app folder with a simple HTTP server, for example:
   - DWA: cd DWA/public && python -m http.server 8000
   - AMS: cd AMS/public && python -m http.server 8001
   - HRMS: cd HRMS/public && python -m http.server 8002
3. Or open top-level index.html (if served from a server) to jump to apps.

Notes
- Data is in-memory and resets on page reload.
- Chart.js and Tailwind are loaded from CDN.
MD

cat > "$TMP/DWA/README.md" <<'MD'
# DWA (public)

Files
- index.html
- app.js
- data.js

Quick-run
- cd DWA/public && python -m http.server 8000
- Open http://localhost:8000/index.html
MD

cat > "$TMP/AMS/README.md" <<'MD'
# AMS (public)

Files
- index.html
- app.ams.js
- data.ams.js

Quick-run
- cd AMS/public && python -m http.server 8001
- Open http://localhost:8001/index.html
MD

cat > "$TMP/HRMS/README.md" <<'MD'
# HRMS (public)

Files
- index.html
- data.hrms.js
- app.hrms.js

Quick-run
- cd HRMS/public && python -m http.server 8002
- Open http://localhost:8002/index.html
MD

# Top-level index.html for one-click access
cat > "$TMP/index.html" <<'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Demo Suite — AMS · DWA · HRMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800">
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-3xl w-full p-6">
      <header class="mb-6">
        <h1 class="text-3xl font-semibold">Demo Suite</h1>
        <p class="text-sm text-gray-600 mt-1">AMS · DWA · HRMS — local static demos</p>
      </header>

      <div class="grid gap-4">
        <a class="block p-4 bg-white rounded shadow hover:shadow-md" href="./AMS/public/index.html">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-lg font-medium">AMS — Inventory / Assets</div>
              <div class="text-sm text-gray-500">Inventory dashboard, assets, categories, locations, users</div>
            </div>
            <div class="text-indigo-600 font-semibold">Open</div>
          </div>
        </a>

        <a class="block p-4 bg-white rounded shadow hover:shadow-md" href="./DWA/public/index.html">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-lg font-medium">DWA — Digital Wallet App</div>
              <div class="text-sm text-gray-500">Transactions, wallets, channels, admin test tools</div>
            </div>
            <div class="text-indigo-600 font-semibold">Open</div>
          </div>
        </a>

        <a class="block p-4 bg-white rounded shadow hover:shadow-md" href="./HRMS/public/index.html">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-lg font-medium">HRMS — Human Resources</div>
              <div class="text-sm text-gray-500">Employees, attendance, leave, people metrics</div>
            </div>
            <div class="text-indigo-600 font-semibold">Open</div>
          </div>
        </a>
      </div>

      <footer class="mt-6 text-sm text-gray-500">
        Tip: serve each app folder with a local static server (python -m http.server) and open this index for quick navigation.
      </footer>
    </div>
  </div>
</body>
</html>
HTML

# create zip
( cd "$TMP" && zip -r "../$OUT_ZIP" . )
echo "Created $OUT_ZIP"
ls -lh "$OUT_ZIP"
