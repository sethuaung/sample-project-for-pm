// js/data-simulator.js
// Lightweight data simulator UI and functions for Felixent AMS
// Include this AFTER js/render.js (so window.felixentDataChanged exists)

(() => {
  if (window.felixentSimulator) return;

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let nextAssetId = (() => {
    const max = (window.assetData || []).reduce((m,a) => {
      const n = parseInt((a.id || "").replace(/[^0-9]/g, ''), 10);
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 50);
    return max + 1;
  })();

  function genAsset() {
    const categories = ['Laptop','Printer','Networking','Tablet','Camera','Monitor','Accessory','Desktop'];
    const locations = ['Felixent HQ','Felixent Mandalay','Felixent Naypyidaw'];
    const statuses = ['New','In Use','Maintenance','Reassigned','Retired'];
    const id = `A${String(nextAssetId++).padStart(3,'0')}`;
    return {
      id,
      name: `${rand(['Dell','HP','Lenovo','Asus','Apple','Samsung'])} ${rand(['Model','Series','Pro','X','Lite'])} ${Math.floor(Math.random()*900)+100}`,
      category: rand(categories),
      location: rand(locations),
      status: rand(statuses),
      assignedTo: rand(['James','Khin Zaw','Thandar','Nandar Htun','', 'Dev Team'])
    };
  }

  function addRandomAsset() {
    const a = genAsset();
    if (!Array.isArray(window.assetData)) window.assetData = [];
    window.assetData.push(a);
    if (typeof window.addMovementLog === 'function') {
      addMovementLog({ asset_id: a.id, move_date: new Date().toISOString().slice(0,19).replace('T',' '), move_status: 'Acquired', move_notes: 'Simulator: added asset', user_id: 'SIM', supplier_id: '' });
    }
    triggerUpdate();
    return a;
  }

  function changeRandomStatus() {
    if (!Array.isArray(window.assetData) || !window.assetData.length) return null;
    const idx = Math.floor(Math.random() * window.assetData.length);
    const old = window.assetData[idx];
    const statuses = ['New','In Use','Maintenance','Reassigned','Retired'];
    const next = rand(statuses);
    const prev = old.status;
    old.status = next;
    if (typeof window.logStatusChange === 'function') {
      logStatusChange(old, prev, next, 'SIM', '', 'Simulator status change');
    } else if (typeof window.addMovementLog === 'function') {
      addMovementLog({ asset_id: old.id, move_date: new Date().toISOString().slice(0,19).replace('T',' '), move_status: next, move_notes: 'Simulator: status change', user_id: 'SIM', supplier_id: ''});
    }
    triggerUpdate();
    return old;
  }

  function addRandomMovement() {
    if (!Array.isArray(window.assetData) || !window.assetData.length) return null;
    const a = rand(window.assetData);
    if (typeof window.addMovementLog === 'function') {
      const m = { asset_id: a.id, move_date: new Date().toISOString().slice(0,19).replace('T',' '), move_status: rand(['Deployed','Maintenance','Transferred']), move_notes: 'Simulator movement', user_id: 'SIM', supplier_id: '' };
      addMovementLog(m);
      triggerUpdate();
      return m;
    }
    return null;
  }

  function addRandomSupplier() {
    if (!Array.isArray(window.suppliers)) window.suppliers = [];
    const id = `S${String((window.suppliers.length + 1) + 100).slice(-3)}`;
    const s = { supplier_id: id, supplier_name: `SimSupplier ${id}`, supplier_email: `sim${id}@example.com`, supplier_tel: `09-555${Math.floor(Math.random()*9000+1000)}`, supplier_address: rand(['Yangon','Mandalay','Naypyidaw']) };
    window.suppliers.push(s);
    triggerUpdate();
    return s;
  }

  function triggerUpdate() {
    if (typeof window.felixentDataChanged === 'function') window.felixentDataChanged();
    else window.dispatchEvent(new Event('felixent:data:changed'));
  }

  function createSimulatorUI() {
    if (document.getElementById('felixent-sim-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'felixent-sim-panel';
    panel.innerHTML = `
      <div class="fixed right-4 bottom-4 z-50">
        <button id="felixent-sim-toggle" title="Simulator" class="bg-indigo-600 text-white p-3 rounded-full shadow-lg">⚡</button>
        <div id="felixent-sim-box" class="hidden mt-3 w-72 bg-white border rounded shadow-lg p-3 text-sm">
          <div class="font-semibold mb-2">Data Simulator</div>
          <div class="flex flex-col gap-2">
            <button id="sim-add-asset" class="px-3 py-2 bg-green-600 text-white rounded">Add random asset</button>
            <button id="sim-change-status" class="px-3 py-2 bg-yellow-500 text-white rounded">Change random status</button>
            <button id="sim-add-move" class="px-3 py-2 bg-blue-500 text-white rounded">Add movement log</button>
            <button id="sim-add-supplier" class="px-3 py-2 bg-teal-500 text-white rounded">Add supplier</button>
            <button id="sim-batch" class="px-3 py-2 bg-gray-700 text-white rounded">Batch (5 actions)</button>
            <div id="sim-last" class="text-xs text-gray-500 mt-2">Ready</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    const toggle = document.getElementById('felixent-sim-toggle');
    const box = document.getElementById('felixent-sim-box');
    toggle.addEventListener('click', () => box.classList.toggle('hidden'));

    document.getElementById('sim-add-asset').addEventListener('click', () => {
      const a = addRandomAsset();
      document.getElementById('sim-last').textContent = `Added ${a.id}`;
    });

    document.getElementById('sim-change-status').addEventListener('click', () => {
      const a = changeRandomStatus();
      document.getElementById('sim-last').textContent = a ? `Updated ${a.id} → ${a.status}` : 'No assets';
    });

    document.getElementById('sim-add-move').addEventListener('click', () => {
      const m = addRandomMovement();
      document.getElementById('sim-last').textContent = m ? `Movement ${m.asset_id} ${m.move_status}` : 'No assets';
    });

    document.getElementById('sim-add-supplier').addEventListener('click', () => {
      const s = addRandomSupplier();
      document.getElementById('sim-last').textContent = `Supplier ${s.supplier_id} added`;
    });

    document.getElementById('sim-batch').addEventListener('click', () => {
      const results = [];
      for (let i=0;i<5;i++) {
        const r = Math.random();
        if (r < 0.4) results.push(addRandomAsset()?.id || 'na');
        else if (r < 0.7) results.push(changeRandomStatus()?.id || 'na');
        else results.push(addRandomMovement()?.asset_id || 'na');
      }
      document.getElementById('sim-last').textContent = `Batch: ${results.join(', ')}`;
    });
  }

  window.felixentSimulator = { addRandomAsset, changeRandomStatus, addRandomMovement, addRandomSupplier, createSimulatorUI };
  document.addEventListener('DOMContentLoaded', () => { if (window.enableFelixentSimulator !== false) createSimulatorUI(); });
})();
