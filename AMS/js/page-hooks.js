// js/page-hooks.js
// Hooks to make Items and Reports pages react to live data changes
// Requires: js/render.js (which exposes refreshDashboard(), window.felixentDataChanged())
// Include after render.js and after Chart.js on pages that have charts/tables.

(() => {
  const assets = () => Array.isArray(window.assetData) ? window.assetData : [];
  const movements = () => Array.isArray(window.movementLogs) ? window.movementLogs : [];
  const suppliers = () => Array.isArray(window.suppliers) ? window.suppliers : [];

  function renderItemsPage() {
    const tbody = document.getElementById('itemsTbody') || document.getElementById('itemsTableBody') || document.getElementById('itemsListBody');
    if (!tbody) return;
    tbody.innerHTML = assets().map((a, i) => `
      <tr class="border-b">
        <td class="px-4 py-2">${a.id}</td>
        <td class="px-4 py-2">${a.name}</td>
        <td class="px-4 py-2">${a.category}</td>
        <td class="px-4 py-2">${a.location}</td>
        <td class="px-4 py-2 font-semibold">${a.status}</td>
        <td class="px-4 py-2">${a.assignedTo || '-'}</td>
        <td class="px-4 py-2">
          <button class="text-blue-600" onclick="openEditModal(${i})">Edit</button>
          <button class="text-red-600 ml-3" onclick="deleteAsset(${i})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  function renderReportsPage() {
    if (typeof window.drawCategoryChart === 'function') window.drawCategoryChart();
    if (typeof window.drawStatusChart === 'function') window.drawStatusChart();
    const summaryEl = document.getElementById('reportSummary') || document.getElementById('reportsSummary');
    if (summaryEl) {
      const stages = ['New','In Use','Maintenance','Reassigned','Retired'];
      summaryEl.innerHTML = stages.map(s => `<div class="py-1"><strong>${s}</strong>: ${assets().filter(a=>a.status===s).length}</div>`).join('');
    }
  }

  function renderMovementList() {
    const el = document.getElementById('movementContainer') || document.getElementById('movementList') || document.getElementById('recentMovements');
    if (!el) return;
    const rows = movements().slice().sort((a,b) => new Date(b.move_date) - new Date(a.move_date));
    el.innerHTML = rows.map(r => `
      <div class="py-2 border-b">
        <div class="font-semibold">${r.asset_id} • ${r.move_status}</div>
        <div class="text-xs text-gray-500">${r.move_date} — ${r.move_notes || '-'}</div>
        <div class="text-xs text-gray-400">User: ${r.user_id || '-'} • Supplier: ${r.supplier_id || '-'}</div>
      </div>
    `).join('') || '<div class="text-sm text-gray-500">No movement logs</div>';
  }

  function renderSuppliersList() {
    const el = document.getElementById('suppliersContainer') || document.getElementById('suppliersList');
    if (!el) return;
    el.innerHTML = suppliers().map(s => `
      <div class="py-2 border-b">
        <div class="font-semibold">${s.supplier_name} • ${s.supplier_id}</div>
        <div class="text-xs text-gray-500">${s.supplier_email || ''} • ${s.supplier_tel || ''}</div>
        <div class="text-xs text-gray-400">${s.supplier_address || ''}</div>
      </div>
    `).join('');
  }

  function onDataChanged() {
    try {
      renderItemsPage();
      renderReportsPage();
      renderMovementList();
      renderSuppliersList();
      if (typeof window.refreshDashboard === 'function') window.refreshDashboard();
    } catch (e) { console.warn('page-hooks update error', e); }
  }

  window.addEventListener('felixent:data:changed', onDataChanged);
  window.addEventListener('DOMContentLoaded', () => setTimeout(onDataChanged, 80));

  window.felixentPageHooks = { refresh: onDataChanged, renderItemsPage, renderReportsPage };
})();
