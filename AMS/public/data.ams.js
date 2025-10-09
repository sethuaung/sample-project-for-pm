(function(){
  const categories = [
    { id: "c1", name: "Electronics" },
    { id: "c2", name: "Furniture" },
    { id: "c3", name: "Stationery" },
    { id: "c4", name: "Peripherals" },
    { id: "c5", name: "Consumables" }
  ];

  const locations = [
    { id: "loc1", name: "Warehouse A" },
    { id: "loc2", name: "Office HQ" },
    { id: "loc3", name: "Storefront" },
    { id: "loc4", name: "Field Depot" }
  ];

  const users = [
    { id: "u1", name: "Aye", role: "staff", position: "Field Technician", locationId: "loc4", email: "aye@example.com" },
    { id: "u2", name: "Min", role: "staff", position: "Sales Agent", locationId: "loc3", email: "min@example.com" },
    { id: "u3", name: "Hla", role: "manager", position: "Operations Manager", locationId: "loc2", email: "hla@example.com" },
    { id: "u4", name: "Zaw", role: "staff", position: "Warehouse Clerk", locationId: "loc1", email: "zaw@example.com" },
    { id: "u5", name: "Kyaw", role: "admin", position: "System Admin", locationId: "loc2", email: "kyaw@example.com" }
  ];

  let seed = 42;
  function rand(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }
  function rnd(min,max){ return Math.floor(rand()*(max-min+1))+min; }

  const sampleNames = [
    "POS Terminal","Tablet","Mobile Reader","Printer","Cash Drawer","Receipt Paper","A4 Paper Ream",
    "Office Desk","Office Chair","Router","Switch","Keyboard","Mouse","Barcode Scanner","Label Printer",
    "POS Pack","Battery Pack","Power Adapter","Protective Case","SIM Tray"
  ];

  const assets = [];
  for(let i=1;i<=100;i++){
    const category = pick(categories);
    const location = pick(locations);
    const nameBase = pick(sampleNames);
    const sku = `${category.name.substring(0,3).toUpperCase()}-${String(i).padStart(3,'0')}`;
    const qty = rnd(1,200);
    const unitValue = rnd(1000,5000000);
    const owner = (rand() < 0.6) ? pick(users).id : null;
    const purchasedAt = new Date(Date.now() - rnd(30,1200)*24*3600*1000).toISOString().slice(0,10);
    const condition = ["new","good","fair","poor"][Math.floor(rand()*4)];
    assets.push({
      id: "a" + String(i).padStart(4,'0'),
      sku,
      name: `${nameBase} ${i}`,
      categoryId: category.id,
      locationId: location.id,
      qty,
      unitValue,
      condition,
      purchasedAt,
      notes: owner ? `Allocated to ${owner}` : "",
      assignedTo: owner
    });
  }

  window.AMS = {
    meta: { org: "Felixent", currency: "MMK" },
    categories,
    locations,
    users,
    assets
  };

  document.dispatchEvent(new Event("AMS_LOADED"));
})();
