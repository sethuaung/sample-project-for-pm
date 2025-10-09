(function(){
  const departments = [
    { id: "d1", name: "Operations" },
    { id: "d2", name: "Sales" },
    { id: "d3", name: "Finance" },
    { id: "d4", name: "People" },
    { id: "d5", name: "Field" }
  ];

  const roles = [
    { id: "r1", name: "Manager" },
    { id: "r2", name: "Staff" },
    { id: "r3", name: "Technician" },
    { id: "r4", name: "Clerk" },
    { id: "r5", name: "Executive" }
  ];

  let seed = 12345;
  function rand(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function pick(arr){ return arr[Math.floor(rand()*arr.length)]; }
  function rnd(min,max){ return Math.floor(rand()*(max-min+1))+min; }

  const first = ["Aye","Min","Hla","Zaw","Kyaw","Su","Myo","Ei","Nandar","Thiri","Tun","Soe","Khin","Win","Lwin"];
  const last = ["Oo","Htet","Kyaw","San","Aung","Lin","Naing","Htun","Thant","Myint"];

  const employees = [];
  for(let i=1;i<=30;i++){
    const dept = pick(departments);
    const role = pick(roles);
    const fname = pick(first);
    const lname = pick(last);
    const id = "e" + String(i).padStart(3,"0");
    const hireDaysAgo = rnd(30,1400);
    const hireDate = new Date(Date.now() - hireDaysAgo*24*3600*1000).toISOString().slice(0,10);
    const email = `${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`;
    const locationId = ["loc1","loc2","loc3","loc4"][Math.floor(rand()*4)];
    employees.push({
      id, firstName: fname, lastName: lname,
      name: fname + " " + lname,
      deptId: dept.id, deptName: dept.name,
      roleId: role.id, roleName: role.name,
      email, phone: `09${rnd(100000000,999999999)}`,
      hireDate, status: Math.random()<0.95 ? 'active' : 'inactive',
      locationId
    });
  }

  const attendance = [];
  const leaves = [];

  window.HRMS = { meta:{ org:"Felixent" }, departments, roles, employees, attendance, leaves };
  document.dispatchEvent(new Event("HRMS_LOADED"));
})();
