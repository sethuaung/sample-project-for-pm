// main.js
// Lightweight SPA routing + rendering for the AMS demo
// Requires: AMS_DATA global, Chart.js

const PAGE = document.getElementById('page');
const templates = {
  dashboard: document.getElementById('dashboard-tpl').content,
  items: document.getElementById('items-tpl').content,
  users: document.getElementById('users-tpl').content,
  locations: document.getElementById('locations-tpl').content,
  suppliers: document.getElementById('suppliers-tpl').content,
  movement: document.getElementById('movement-tpl').content,
  reports: document.getElementById('reports-tpl').content
};

const state = {
  page: '/',
  pageSize: 15,
  pageIndex: 0,
  filters: { location: '', supplier: '', search: '' },
  charts: {}
};

function navigate(path) {
  state.page = path;
  // update nav highlighting
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('data-route') === path) {
      a.classList.add('bg-gray-100', 'font-medium');
    } else {
      a.classList.remove('bg-gray-100', 'font-medium');
    }
  });
  // load page
  renderPage();
}

function renderPage() {
  PAGE.innerHTML = '';
  switch (state.page) {
    case '/items': renderItemsPage(); break;
    case '/users': renderUsersPage(); break;
    case '/locations': renderLocationsPage(); break;
    case '/suppliers': renderSuppliersPage(); break;
    case '/movement': renderMovementPage(); break;
    case '/reports': renderReportsPage(); break;
    default: renderDashboard(); break;
  }
  window.scrollTo(0,0);
}

/* ---------- Dashboard ---------- */
function renderDashboard() {
  PAGE.appendChild(templates.dashboard.cloneNode(true));
  document.getElementById('totalItems').textContent = AMS_DATA.items.length;
  document.getElementById('totalUsers').textContent = AMS_DATA.users.length;
  document.getElementById('totalLocations').textContent = AMS_DATA.locations.length;

  // Category chart
  const catCounts = {};
  AMS_DATA.items.forEach(it => catCounts[it.category] = (catCounts[it.category]||0) + it.qty);
  const labels = Object.keys(catCounts);
  const values = labels.map(l => catCounts[l]);

  const ctxCat = document.getElementById('categoryChart').getContext('2d');
  if (state.charts.category) state.charts.category.destroy();
  state.charts.category = new Chart(ctxCat, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: generateColors(labels.length) }] },
    options: { plugins: { legend: { position: 'bottom' } } }
  });

  // Movements over time (last 30 days)
  const last30 = {};
  AMS_DATA.movements.forEach(mv => {
    last30[mv.date] = (last30[mv.date]||0) + mv.qty;
  });
  const dates = Object.keys(last30).sort();
  const movValues = dates.map(d => last30[d]);

  const ctxMov = document.getElementById('movementChart').getContext('2d');
  if (state.charts.movement) state.charts.movement.destroy();
  state.charts.movement = new Chart(ctxMov, {
    type: 'line',
    data: { labels: dates, datasets: [{ label: 'Moved Qty', data: movValues, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', tension: 0.2 }] },
    options: { scales: { x: { ticks: { maxRotation: 0 } } } }
  });

  // Dashboard filter handlers
  document.getElementById('dashRefresh').addEventListener('click', () => {
    // For demo, just re-render charts (filters not applied to sample data)
    renderDashboard();
  });
}

/* ---------- Items Page ---------- */
function renderItemsPage() {
  PAGE.appendChild(templates.items.cloneNode(true));
  const itemsTable = document.getElementById('itemsTable');
  const info = document.getElementById('itemsInfo');

  // Fill filter options
  const locSel = document.getElementById('filterLocation');
  AMS_DATA.locations.forEach(loc => {
    const opt = document.createElement('option'); opt.value = loc.id; opt.textContent = loc.name; locSel.appendChild(opt);
  });
  const supSel = document.getElementById('filterSupplier');
  AMS_DATA.suppliers.forEach(s => {
    const opt = document.createElement('option'); opt.value = s.id; opt.textContent = s.name; supSel.appendChild(opt);
  });

  // Controls
  document.getElementById('itemSearch').addEventListener('input', e => { state.filters.search = e.target.value; state.pageIndex = 0; refreshItems(); });
  locSel.addEventListener('change', e => { state.filters.location = e.target.value; state.pageIndex = 0; refreshItems(); });
  supSel.addEventListener('change', e => { state.filters.supplier = e.target.value; state.pageIndex = 0; refreshItems(); });
  document.getElementById('clearFilters').addEventListener('click', () => {
    state.filters = { location: '', supplier: '', search: '' };
    document.getElementById('itemSearch').value = '';
    locSel.value = '';
    supSel.value = '';
    refreshItems();
  });

  document.getElementById('prevPage').addEventListener('click', () => { if (state.pageIndex>0) { state.pageIndex--; refreshItems(); }});
  document.getElementById('nextPage').addEventListener('click', () => { state.pageIndex++; refreshItems(); });

  function refreshItems() {
    const all = AMS_DATA.items.filter(it => {
      if (state.filters.location && it.locationId !== state.filters.location) return false;
      if (state.filters.supplier && it.supplierId !== state.filters.supplier) return false;
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        if (!(`${it.id} ${it.name} ${it.category}`.toLowerCase().includes(q))) return false;
      }
      return true;
    });

    // page clamp
    const totalPages = Math.max(1, Math.ceil(all.length / state.pageSize));
    if (state.pageIndex >= totalPages) state.pageIndex = totalPages - 1;
    const start = state.pageIndex * state.pageSize;
    const pageItems = all.slice(start, start + state.pageSize);

    itemsTable.innerHTML = '';
    pageItems.forEach(it => {
      const loc = AMS_DATA.locations.find(l => l.id===it.locationId)?.name || '';
      const sup = AMS_DATA.suppliers.find(s => s.id===it.supplierId)?.name || '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="p-3">${it.id}</td>
        <td class="p-3">${it.name}</td>
        <td class="p-3">${it.category}</td>
        <td class="p-3">${it.qty}</td>
        <td class="p-3">${loc}</td>
        <td class="p-3">${sup}</td>
        <td class="p-3">${it.status}</td>
      `;
      itemsTable.appendChild(tr);
    });

    info.textContent = `Showing ${start+1} - ${start+pageItems.length} of ${all.length} items`;
  }

  refreshItems();
}

/* ---------- Users ---------- */
function renderUsersPage() {
  PAGE.appendChild(templates.users.cloneNode(true));
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = '';
  AMS_DATA.users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="p-3">${u.id}</td><td class="p-3">${u.name}</td><td class="p-3">${u.role}</td><td class="p-3">${u.email}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('addUserBtn').addEventListener('click', () => alert('Add user flow (demo)'));
}

/* ---------- Locations ---------- */
function renderLocationsPage() {
  PAGE.appendChild(templates.locations.cloneNode(true));
  const tbody = document.getElementById('locationsTable');
  tbody.innerHTML = '';
  AMS_DATA.locations.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="p-3">${l.id}</td><td class="p-3">${l.name}</td><td class="p-3">${l.address}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('addLocationBtn').addEventListener('click', () => alert('Add location flow (demo)'));
}

/* ---------- Suppliers ---------- */
function renderSuppliersPage() {
  PAGE.appendChild(templates.suppliers.cloneNode(true));
  const tbody = document.getElementById('suppliersTable');
  tbody.innerHTML = '';
  AMS_DATA.suppliers.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="p-3">${s.id}</td><td class="p-3">${s.name}</td><td class="p-3">${s.contact}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('addSupplierBtn').addEventListener('click', () => alert('Add supplier flow (demo)'));
}

/* ---------- Movement ---------- */
function renderMovementPage() {
  PAGE.appendChild(templates.movement.cloneNode(true));
  const tbody = document.getElementById('movementTable');
  function refreshMoves() {
    const from = document.getElementById('moveFrom').value;
    const to = document.getElementById('moveTo').value;
    let moves = AMS_DATA.movements.slice().sort((a,b)=> b.date.localeCompare(a.date));
    if (from) moves = moves.filter(m => m.date >= from);
    if (to) moves = moves.filter(m => m.date <= to);
    tbody.innerHTML = '';
    moves.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="p-3">${m.date}</td><td class="p-3">${m.itemName} (${m.itemId})</td><td class="p-3">${m.fromLocationName}</td><td class="p-3">${m.toLocationName}</td><td class="p-3">${m.qty}</td><td class="p-3">${m.byUserName}</td>`;
      tbody.appendChild(tr);
    });
  }
  document.getElementById('filterMoves').addEventListener('click', refreshMoves);
  refreshMoves();
}

/* ---------- Reports ---------- */
function renderReportsPage() {
  PAGE.appendChild(templates.reports.cloneNode(true));

  // Quantity by location
  const locCounts = {};
  AMS_DATA.locations.forEach(l => locCounts[l.name] = 0);
  AMS_DATA.items.forEach(it => {
    const locName = AMS_DATA.locations.find(l => l.id===it.locationId)?.name || 'Unknown';
    locCounts[locName] = (locCounts[locName]||0) + it.qty;
  });
  const locLabels = Object.keys(locCounts);
  const locValues = locLabels.map(l => locCounts[l]);

  const ctxLoc = document.getElementById('locationChart').getContext('2d');
  if (state.charts.location) state.charts.location.destroy();
  state.charts.location = new Chart(ctxLoc, {
    type: 'bar',
    data: { labels: locLabels, datasets: [{ label: 'Qty', data: locValues, backgroundColor: generateColors(locLabels.length) }] },
    options: { plugins: { legend: { display: false } } }
  });

  // Top suppliers by item count
  const supCounts = {};
  AMS_DATA.suppliers.forEach(s => supCounts[s.name] = 0);
  AMS_DATA.items.forEach(it => {
    const supName = AMS_DATA.suppliers.find(s => s.id===it.supplierId)?.name || 'Unknown';
    supCounts[supName] = (supCounts[supName]||0) + 1;
  });
  const supLabels = Object.keys(supCounts);
  const supValues = supLabels.map(s => supCounts[s]);

  const ctxSup = document.getElementById('supplierChart').getContext('2d');
  if (state.charts.supplier) state.charts.supplier.destroy();
  state.charts.supplier = new Chart(ctxSup, {
    type: 'pie',
    data: { labels: supLabels, datasets: [{ data: supValues, backgroundColor: generateColors(supLabels.length) }] },
    options: { plugins: { legend: { position: 'bottom' } } }
  });

  document.getElementById('downloadReportCsv').addEventListener('click', () => {
    // example: export location quantities
    const rows = [['Location','Quantity'], ...locLabels.map((l,i)=> [l, locValues[i]])];
    downloadCsv(rows, 'location-quantities.csv');
  });
}

/* ---------- Utilities ---------- */
function generateColors(n) {
  const palette = [
    '#ef4444','#f59e0b','#f97316','#f43f5e','#6366f1','#06b6d4','#10b981','#84cc16','#a78bfa','#fb7185'
  ];
  const out = [];
  for (let i=0;i<n;i++) out.push(palette[i % palette.length]);
  return out;
}

function downloadCsv(rows, filename = 'export.csv') {
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
}

/* ---------- Init / Routing ---------- */

// attach mobile nav
const mobileNav = document.getElementById('mobileNav');
if (mobileNav) mobileNav.addEventListener('change', e => navigate(e.target.value));

// attach sidebar export button
const exportBtn = document.getElementById('exportCsvBtn');
if (exportBtn) exportBtn.addEventListener('click', () => {
  const rows = [['id','name','category','qty','location','supplier','purchaseDate','status']];
  AMS_DATA.items.forEach(it => {
    const loc = AMS_DATA.locations.find(l => l.id===it.locationId)?.name || '';
    const sup = AMS_DATA.suppliers.find(s => s.id===it.supplierId)?.name || '';
    rows.push([it.id,it.name,it.category,it.qty,loc,sup,it.purchaseDate,it.status]);
  });
  downloadCsv(rows,'items-export.csv');
});

// hash-routing
function onHashChange() {
  const hash = location.hash.replace('#','') || '/';
  navigate(hash);
}
window.addEventListener('hashchange', onHashChange);

// initialize nav links
document.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', (e) => {
  // allow hash to trigger routing
}));

// start at current hash
onHashChange();
