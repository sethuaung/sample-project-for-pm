// js/suppliers.js
const suppliers = [
  { supplier_id: "S001", supplier_name: "TechSource Myanmar", supplier_email: "info@techsource.com", supplier_tel: "09-123456789", supplier_address: "Yangon" },
  { supplier_id: "S002", supplier_name: "NetLink Co.", supplier_email: "support@netlink.com", supplier_tel: "09-987654321", supplier_address: "Mandalay" },
  { supplier_id: "S003", supplier_name: "CameraWorks", supplier_email: "camera@cw.com", supplier_tel: "09-555123456", supplier_address: "Naypyidaw" },
  { supplier_id: "S004", supplier_name: "OfficeSupplies Ltd.", supplier_email: "office@supplies.com", supplier_tel: "09-444555666", supplier_address: "Yangon" },
  { supplier_id: "S005", supplier_name: "PowerSolutions", supplier_email: "sales@powersol.com", supplier_tel: "09-333444555", supplier_address: "Mandalay" },
  { supplier_id: "S006", supplier_name: "NetworkGear", supplier_email: "gear@network.com", supplier_tel: "09-222333444", supplier_address: "Naypyidaw" }
];

function getSupplierById(id) { return suppliers.find(s => s.supplier_id === id) || null; }
function findSupplierByEmail(email) { return suppliers.find(s => s.supplier_email && s.supplier_email.toLowerCase() === (email || "").toLowerCase()) || null; }

function addSupplier({ supplier_id, supplier_name, supplier_email = "", supplier_tel = "", supplier_address = "" }) {
  if (!supplier_id || !supplier_name) return { ok: false, error: "supplier_id and supplier_name are required" };
  if (getSupplierById(supplier_id)) return { ok: false, error: "supplier_id already exists" };
  if (supplier_email && findSupplierByEmail(supplier_email)) return { ok: false, error: "supplier_email already exists" };
  const newSupplier = { supplier_id, supplier_name, supplier_email, supplier_tel, supplier_address };
  suppliers.push(newSupplier);
  return { ok: true, supplier: newSupplier };
}

function updateSupplier(supplier_id, updates = {}) {
  const idx = suppliers.findIndex(s => s.supplier_id === supplier_id);
  if (idx === -1) return { ok: false, error: "supplier not found" };
  if (updates.supplier_email) {
    const existing = findSupplierByEmail(updates.supplier_email);
    if (existing && existing.supplier_id !== supplier_id) return { ok: false, error: "supplier_email already in use" };
  }
  suppliers[idx] = { ...suppliers[idx], ...updates };
  return { ok: true, supplier: suppliers[idx] };
}

function deleteSupplier(supplier_id) {
  const idx = suppliers.findIndex(s => s.supplier_id === supplier_id);
  if (idx === -1) return { ok: false, error: "supplier not found" };
  const removed = suppliers.splice(idx, 1)[0];
  return { ok: true, supplier: removed };
}

function listSuppliers() { return suppliers.slice(); }

window.suppliers = suppliers;
window.getSupplierById = getSupplierById;
window.findSupplierByEmail = findSupplierByEmail;
window.addSupplier = addSupplier;
window.updateSupplier = updateSupplier;
window.deleteSupplier = deleteSupplier;
window.listSuppliers = listSuppliers;
