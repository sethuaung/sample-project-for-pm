// js/movementData.js
let movementLogs = [
  { asset_id: "A001", move_date: "2025-01-05 09:15", move_status: "Acquired", move_notes: "Purchased for Felixent HQ", user_id: "U001", supplier_id: "S001" },
  { asset_id: "A001", move_date: "2025-01-12 10:00", move_status: "Deployed", move_notes: "Assigned to James (Founding Lead)", user_id: "U001", supplier_id: "" },
  { asset_id: "A003", move_date: "2025-02-20 14:30", move_status: "Maintenance", move_notes: "Firmware update and inspection", user_id: "U002", supplier_id: "S002" },
  { asset_id: "A004", move_date: "2025-03-02 11:20", move_status: "Transferred", move_notes: "Moved to Naypyidaw office", user_id: "U003", supplier_id: "" },
  { asset_id: "A006", move_date: "2025-03-15 08:45", move_status: "Deployed", move_notes: "Assigned to Khin Zaw", user_id: "U004", supplier_id: "" },
  { asset_id: "A008", move_date: "2025-04-01 09:00", move_status: "Maintenance", move_notes: "Projector lamp replaced", user_id: "U005", supplier_id: "S003" },
  { asset_id: "A009", move_date: "2025-04-10 13:10", move_status: "Deployed", move_notes: "Tablet issued to Hla Hla Win", user_id: "U006", supplier_id: "" },
  { asset_id: "A010", move_date: "2025-04-20 15:40", move_status: "Reassigned", move_notes: "Reassigned to Ko Ko for field testing", user_id: "U007", supplier_id: "" },
  { asset_id: "A012", move_date: "2025-05-05 10:25", move_status: "Deployed", move_notes: "Installed at Naypyidaw AP cluster", user_id: "U002", supplier_id: "" },
  { asset_id: "A015", move_date: "2025-05-18 16:00", move_status: "Maintenance", move_notes: "Touchscreen calibration and update", user_id: "U005", supplier_id: "" },
  { asset_id: "A020", move_date: "2025-06-02 09:50", move_status: "Acquired", move_notes: "New router for Naypyidaw", user_id: "U008", supplier_id: "S002" },
  { asset_id: "A024", move_date: "2025-06-15 11:30", move_status: "Deployed", move_notes: "Mobile issued to Field Ops", user_id: "U009", supplier_id: "" },
  { asset_id: "A027", move_date: "2025-06-25 14:05", move_status: "Reassigned", move_notes: "Moved to Dev Team bench", user_id: "U010", supplier_id: "" },
  { asset_id: "A031", move_date: "2025-07-08 10:00", move_status: "Maintenance", move_notes: "GPU driver reflash", user_id: "U004", supplier_id: "S001" },
  { asset_id: "A036", move_date: "2025-07-21 09:30", move_status: "Maintenance", move_notes: "EdgeRouter replaced PSU", user_id: "U002", supplier_id: "S002" },
  { asset_id: "A039", move_date: "2025-08-03 12:15", move_status: "Deployed", move_notes: "Tablet issued to Trainer for workshop", user_id: "U006", supplier_id: "" },
  { asset_id: "A044", move_date: "2025-08-11 09:45", move_status: "Deployed", move_notes: "Laptop issued to Finance", user_id: "U011", supplier_id: "" },
  { asset_id: "A047", move_date: "2025-08-22 13:00", move_status: "Reassigned", move_notes: "QA Team assignment for stress tests", user_id: "U012", supplier_id: "" },
  { asset_id: "A048", move_date: "2025-09-01 10:10", move_status: "Acquired", move_notes: "New camera for Content Team", user_id: "U013", supplier_id: "S003" },
  { asset_id: "A050", move_date: "2025-09-10 08:55", move_status: "Deployed", move_notes: "Power bank issued to James", user_id: "U001", supplier_id: "" }
];

function addMovementLog({ asset_id, move_date, move_status, move_notes = "", user_id = "", supplier_id = "" }) {
  const dateStr = move_date || new Date().toISOString().replace("T", " ").slice(0, 19);
  movementLogs.push({ asset_id, move_date: dateStr, move_status, move_notes, user_id, supplier_id });
}

function logStatusChange(asset, oldStatus, newStatus, userId = "", supplierId = "", notes = "") {
  if (!asset || oldStatus === newStatus) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  addMovementLog({
    asset_id: asset.id,
    move_date: ts,
    move_status: newStatus,
    move_notes: notes || `Status changed from ${oldStatus} to ${newStatus}`,
    user_id: userId || "U001",
    supplier_id: supplierId || ""
  });
}

window.movementLogs = movementLogs;
window.addMovementLog = addMovementLog;
window.logStatusChange = logStatusChange;
