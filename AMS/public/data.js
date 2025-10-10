// data.js
// Exposes a global `AMS_DATA` object used by main.js
// Contains: items (100 demo items), users, locations, suppliers, movements

window.AMS_DATA = (function generateDemo() {
  const categories = ['Laptop', 'Monitor', 'Phone', 'Desk', 'Chair', 'Accessory', 'Printer', 'Router'];
  const suppliers = [
    { id: 'sup-1', name: 'TechSource Ltd', contact: 'sup1@techsource.example' },
    { id: 'sup-2', name: 'OfficeSupply Co', contact: 'sup2@officesupply.example' },
    { id: 'sup-3', name: 'GlobalElectronics', contact: 'sup3@globale.example' },
    { id: 'sup-4', name: 'FurnitureWorks', contact: 'sup4@furnworks.example' }
  ];
  const locations = [
    { id: 'loc-1', name: 'HQ - Yangon', address: 'North Dagon Rd, Yangon' },
    { id: 'loc-2', name: 'Branch - Mandalay', address: 'Mandalay Central' },
    { id: 'loc-3', name: 'Branch - Naypyidaw', address: 'Naypyidaw Plaza' },
    { id: 'loc-4', name: 'Remote Warehouse', address: 'Industrial Zone' }
  ];
  const users = [
    { id: 'u-1', name: 'Aye Aye', role: 'Admin', email: 'aye@example.com' },
    { id: 'u-2', name: 'Ko Min', role: 'Operator', email: 'min@example.com' },
    { id: 'u-3', name: 'Su Hla', role: 'Auditor', email: 'su@example.com' }
  ];

  // Helper to random date in last 180 days
  const now = Date.now();
  function randDate(days = 180) {
    const offset = Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
    return new Date(now - offset);
  }

  // Generate 100 items
  const items = [];
  for (let i = 1; i <= 100; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const qty = Math.floor(Math.random() * 20) + 1;
    const status = qty > 0 ? 'In Stock' : 'Out of Stock';
    items.push({
      id: `item-${String(i).padStart(3, '0')}`,
      name: `${cat} Model ${String(100 + i)}`,
      category: cat,
      qty,
      locationId: location.id,
      supplierId: supplier.id,
      purchaseDate: randDate(720).toISOString().slice(0,10),
      status
    });
  }

  // Generate 200 movements referencing random items
  const movements = [];
  for (let m = 0; m < 200; m++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const from = locations[Math.floor(Math.random() * locations.length)];
    let to = locations[Math.floor(Math.random() * locations.length)];
    if (to.id === from.id) {
      to = locations[(locations.indexOf(from) + 1) % locations.length];
    }
    const user = users[Math.floor(Math.random() * users.length)];
    const date = randDate(180);
    const qty = Math.max(1, Math.floor(Math.random() * Math.min(5, item.qty)));
    movements.push({
      id: `mv-${m+1}`,
      date: date.toISOString().slice(0,10),
      itemId: item.id,
      itemName: item.name,
      fromLocationId: from.id,
      fromLocationName: from.name,
      toLocationId: to.id,
      toLocationName: to.name,
      qty,
      byUserId: user.id,
      byUserName: user.name
    });
  }

  return { items, users, locations, suppliers, movements };
})();
