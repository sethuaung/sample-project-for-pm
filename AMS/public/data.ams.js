// data.ams.js — seeded inventory/assets demo
window.AMS = {
  meta: { org: "Felixent", currency: "MMK" },
  categories: [
    { id: "c1", name: "Electronics" },
    { id: "c2", name: "Furniture" },
    { id: "c3", name: "Stationery" }
  ],
  locations: [
    { id: "loc1", name: "Warehouse A" },
    { id: "loc2", name: "Office HQ" },
    { id: "loc3", name: "Storefront" }
  ],
  assets: [
    { id: "a001", sku: "WM-1001", name: "Wave POS Terminal", categoryId: "c1", locationId: "loc3", qty: 12, unitValue: 1500000, condition: "good", purchasedAt: "2024-05-10", notes: "Serials tracked" },
    { id: "a002", sku: "KB-2001", name: "KBZPay Tablet", categoryId: "c1", locationId: "loc1", qty: 8, unitValue: 800000, condition: "good", purchasedAt: "2024-01-12", notes: "" },
    { id: "a003", sku: "FUR-001", name: "Office Desk", categoryId: "c2", locationId: "loc2", qty: 20, unitValue: 120000, condition: "fair", purchasedAt: "2023-11-02", notes: "" },
    { id: "a004", sku: "STAT-01", name: "A4 Paper Ream", categoryId: "c3", locationId: "loc1", qty: 250, unitValue: 6000, condition: "new", purchasedAt: "2025-02-15", notes: "" },
    { id: "a005", sku: "POS-XL", name: "Merchant POS Pack", categoryId: "c1", locationId: "loc3", qty: 4, unitValue: 4500000, condition: "good", purchasedAt: "2024-09-01", notes: "Deployed to top merchants" }
  ]
};
document.dispatchEvent(new Event("AMS_LOADED"));
