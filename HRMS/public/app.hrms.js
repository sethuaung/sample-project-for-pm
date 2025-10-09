/* Minimal HRMS runtime: render dashboard, employees, attendance, leave */
const $h = s => document.querySelector(s);
const $$h = s => Array.from(document.querySelectorAll(s));

function fmt(n){ return Number(n).toLocaleString("en-US"); }
function uid(prefix='x'){ return prefix + Math.random().toString(36).slice(2,8); }

function empName(id){ return (window.HRMS?.employees||[]).find(e=>e.id===id)?.name || id; }
function deptName(id){ return (window.HRMS?.departments||[]).find(d=>d.id===id)?.name || id; }
function roleName(id){ return (window.HRMS?.roles||[]).find(r=>r.id===id)?.name || id; }

function renderHRDashboard(){
  if(!$h("#hr_k_employees")) return;
  const employees = window.HRMS.employees || [];
  const attendance = window.HRMS.attendance || [];
  const leaves = window.HRMS.leaves || [];
  const activeCount = employees.filter(e=>e.status==='active').length;
  $h("#hr_k_employees").textContent = activeCount;
  $h("#hr_k_depts").textContent = (window.HRMS.departments||[]).length;
  $h("#hr_k_roles").textContent = (window.HRMS.roles||[]).length;
  $h("#hr_k_leaves").textContent = leaves.filter(l=>l.status==='pending').length;

  const byDept = {};
  (window.HRMS.departments||[]).forEach(d=> byDept[d.name]=0);
  employees.forEach(e=> byDept[e.deptName] = (byDept[e.deptName]||0)+1);
  const labels = Object.keys(byDept);
  const data = Object.values(byDept);

  const el = $h("#hr_deptChart");
  if(el){
    const ctx = el.getContext("2d");
    if(window._hrDeptChart) window._hrDeptChart.destroy();
    window._hrDeptChart = new Chart(ctx, { type:'bar', data:{ labels, datasets:[{ label:'Employees', data, backgroundColor:'#60A5FA' }] }, options:{ plugins:{ legend:{ display:false } } }});
  }

  const now = new Date();
  const months = Array.from({length:6}, (_,i)=> {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    return d.toISOString().slice(0,7);
  }).reverse();
  const leaveCounts = months.map(m => leaves.filter(l => l.from && (l.from.startsWith(m) || (l.to && l.to.startsWith(m)))).length);
  const el2 = $h("#hr_leaveChart");
  if(el2){
    const ctx2 = el2.getContext("2d");
    if(window._hrLeaveChart) window._hrLeaveChart.destroy();
    window._hrLeaveChart = new Chart(ctx2, { type:'line', data:{ labels: months, datasets:[{ label:'Leaves', data: leaveCounts, borderColor:'#F59E0B', fill:false }] }, options:{ plugins:{ legend:{ display:false } } }});
  }

  const byEmpLeaves = {};
  leaves.forEach(l => { byEmpLeaves[l.employeeId] = (byEmpLeaves[l.employeeId]||0) + (l.days||1); });
  const top = Object.entries(byEmpLeaves).map(([id,days])=>({ id, days })).sort((a,b)=>b.days-a.days).slice(0,5);
  $h("#hr_topEmployees").innerHTML = top.length ? top.map(t=>`<div class="py-1">${empName(t.id)} — ${t.days} day(s)</div>`).join('') : '<div class="text-sm text-gray-500">No leave records</div>';
}

function renderEmployees(){
  const tbody = $h("#employeesBody"); if(!tbody) return;
  const employees = (window.HRMS.employees||[]).slice().sort((a,b)=> a.name.localeCompare(b.name));
  tbody.innerHTML = employees.map(e=>`<tr class="border-b"><td class="px-2 py-2 text-xs">${e.id}</td><td class="px-2 py-2">${e.name}</td><td class="px-2 py-2 text-xs">${e.email}</td><td class="px-2 py-2 text-xs">${e.roleName||roleName(e.roleId)}</td><td class="px-2 py-2 text-xs">${e.deptName||deptName(e.deptId)}</td><td class="px-2 py-2 text-xs">${e.locationId||''}</td><td class="px-2 py-2 text-xs">${e.hireDate}</td><td class="px-2 py-2 text-xs">${e.status}</td><td class="px-2 py-2 text-right text-xs"><button data-id="${e.id}" class="editEmp bg-indigo-600 text-white px-2 py-1 rounded text-xs">Edit</button></td></tr>`).join('');
  $$(".editEmp").forEach(b=> b.addEventListener('click', e => openEditEmployee(e.currentTarget.dataset.id)));
}

function openAddEmployee(){ const f=$h("#empForm"); if(!f) return; f.reset(); $h("#empId").value=''; $h("#empModal").classList.remove('hidden'); }
function openEditEmployee(id){ const emp=(window.HRMS.employees||[]).find(x=>x.id===id); if(!emp) return alert('not found'); $h("#empId").value=emp.id; $h("#firstName").value=emp.firstName||''; $h("#lastName").value=emp.lastName||''; $h("#email").value=emp.email||''; $h("#role").value=emp.roleId||''; $h("#dept").value=emp.deptId||''; $h("#hireDate").value=emp.hireDate||''; $h("#status").value=emp.status||'active'; $h("#empModal").classList.remove('hidden'); }
function closeEmpModal(){ $h("#empModal")?.classList.add("hidden"); }
function saveEmployee(e){ e.preventDefault(); const id = $h("#empId").value || uid('e'); const obj = { id, firstName:$h("#firstName").value.trim(), lastName:$h("#lastName").value.trim(), name: ($h("#firstName").value.trim()+' '+$h("#lastName").value.trim()).trim(), email:$h("#email").value.trim(), roleId:$h("#role").value, roleName:roleName($h("#role").value), deptId:$h("#dept").value, deptName:deptName($h("#dept").value), hireDate:$h("#hireDate").value, status:$h("#status").value, locationId:$h("#empLocation")?.value||null }; const idx=(window.HRMS.employees||[]).findIndex(x=>x.id===id); if(idx>=0) window.HRMS.employees[idx]=obj; else window.HRMS.employees.push(obj); closeEmpModal(); renderEmployees(); renderHRDashboard(); }

function renderAttendance(date){ date = date || new Date().toISOString().slice(0,10); $h("#attDate").value = date; const employees = window.HRMS.employees || []; const att = window.HRMS.attendance || []; const rows = employees.map(e=>{ const rec = att.find(a=> a.date===date && a.employeeId===e.id); const status = rec ? rec.status : 'absent'; return `<tr class="border-b"><td class="px-2 py-2 text-xs">${e.id}</td><td class="px-2 py-2">${e.name}</td><td class="px-2 py-2"><select data-id="${e.id}" class="attSelect p-1 border rounded text-sm"><option ${status==='present'?'selected':''} value="present">Present</option><option ${status==='remote'?'selected':''} value="remote">Remote</option><option ${status==='absent'?'selected':''} value="absent">Absent</option></select></td></tr>`; }).join(''); $h("#attendanceBody").innerHTML = rows; $$(".attSelect").forEach(s=> s.addEventListener('change', e=> { const empId = e.currentTarget.dataset.id; const val = e.currentTarget.value; const idx = (window.HRMS.attendance||[]).findIndex(a=>a.date===date && a.employeeId===empId); if(idx>=0) window.HRMS.attendance[idx].status = val; else window.HRMS.attendance.push({ date, employeeId: empId, status: val }); })); }

function renderLeaves(){ const tbody = $h("#leavesBody"); if(!tbody) return; const leaves = (window.HRMS.leaves||[]).slice().sort((a,b)=> a.status.localeCompare(b.status)); tbody.innerHTML = leaves.map(l=>`<tr class="border-b"><td class="px-2 py-2 text-xs">${l.id}</td><td class="px-2 py-2">${empName(l.employeeId)}</td><td class="px-2 py-2">${l.from}</td><td class="px-2 py-2">${l.to}</td><td class="px-2 py-2">${l.days}</td><td class="px-2 py-2">${l.reason}</td><td class="px-2 py-2">${l.status}</td><td class="px-2 py-2 text-right"><button data-id="${l.id}" class="approveLeave bg-green-600 text-white px-2 py-1 rounded text-xs">Approve</button> <button data-id="${l.id}" class="rejectLeave bg-red-500 text-white px-2 py-1 rounded text-xs">Reject</button></td></tr>`).join(''); $$(".approveLeave").forEach(b=> b.addEventListener('click', e=> { const id = e.currentTarget.dataset.id; const rec = window.HRMS.leaves.find(x=>x.id===id); if(rec){ rec.status='approved'; renderLeaves(); renderHRDashboard(); }})); $$(".rejectLeave").forEach(b=> b.addEventListener('click', e=> { const id = e.currentTarget.dataset.id; const rec = window.HRMS.leaves.find(x=>x.id===id); if(rec){ rec.status='rejected'; renderLeaves(); renderHRDashboard(); }})); }

function csvEscape(v){ if(v===null||v===undefined) return ""; const s = String(v); if(s.includes(",")||s.includes("\"")||s.includes("\n")) return `"${s.replace(/"/g,'""')}"`; return s; }
function downloadCsv(filename, csv){ const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

function exportEmployeesCsv(){ const rows = ['id,firstName,lastName,email,role,department,hireDate,status,location']; (window.HRMS.employees||[]).forEach(e=> rows.push([csvEscape(e.id), csvEscape(e.firstName), csvEscape(e.lastName), csvEscape(e.email), csvEscape(e.roleName||roleName(e.roleId)), csvEscape(e.deptName||deptName(e.deptId)), csvEscape(e.hireDate), csvEscape(e.status), csvEscape(e.locationId)].join(','))); downloadCsv('hr_employees.csv', rows.join('\n')); }

function initHR(){ if($h("#role")) $h("#role").innerHTML = (window.HRMS.roles||[]).map(r=>`<option value="${r.id}">${r.name}</option>`).join(''); if($h("#dept")) $h("#dept").innerHTML = (window.HRMS.departments||[]).map(d=>`<option value="${d.id}">${d.name}</option>`).join(''); if($h("#empLocation")) $h("#empLocation").innerHTML = `<option value="">—</option><option value="loc1">Warehouse A</option><option value="loc2">Office HQ</option><option value="loc3">Storefront</option><option value="loc4">Field Depot</option>`; $h("#addEmp")?.addEventListener('click', openAddEmployee); $h("#empForm")?.addEventListener('submit', saveEmployee); $h("#empCancel")?.addEventListener('click', e=> { e.preventDefault(); closeEmpModal(); }); $h("#empExport")?.addEventListener('click', exportEmployeesCsv); $h("#attApply")?.addEventListener('click', ()=> renderAttendance($h("#attDate").value)); $h("#attExport")?.addEventListener('click', ()=> { const date = $h("#attDate").value || new Date().toISOString().slice(0,10); const rows = ["date,employeeId,employeeName,status"]; (window.HRMS.attendance||[]).filter(a=>a.date===date).forEach(a=> rows.push([csvEscape(a.date), csvEscape(a.employeeId), csvEscape(empName(a.employeeId)), csvEscape(a.status)].join(','))); downloadCsv(`attendance_${date}.csv`, rows.join('\n')); }); $h("#leaveApply")?.addEventListener('click', ()=>{ const empId = $h("#leaveEmp")?.value; const from = $h("#leaveFrom")?.value; const to = $h("#leaveTo")?.value; const reason = $h("#leaveReason")?.value; if(!empId || !from || !to) return alert('select employee and date range'); const days = ( (new Date(to) - new Date(from))/86400000 ) + 1; const id = 'l' + uid('l'); window.HRMS.leaves.push({ id, employeeId: empId, from, to, days, reason, status: 'pending' }); $h("#leaveReason").value = ""; $h("#leaveTo").value = ""; $h("#leaveFrom").value = ""; renderLeaves(); renderHRDashboard(); }); const page = location.pathname.split('/').pop() || 'index.html'; if(page === '' || page === 'index.html'){ renderHRDashboard(); } if(page === 'employees.html'){ renderEmployees(); } if(page === 'attendance.html'){ renderAttendance(); } if(page === 'leave.html'){ renderLeaves(); } $$(".sidebar-link").forEach(el=> el.classList.remove('bg-indigo-50','text-indigo-700','font-semibold')); const p = location.pathname.split('/').pop() || 'index.html'; const active = document.querySelector(`.sidebar-link[data-page="${p}"]`); if(active) active.classList.add('bg-indigo-50','text-indigo-700','font-semibold'); }

(function bootstrapHR(){ function boot(){ try{ initHR(); } catch(e){ console.error('HR init error', e); } } if(window.HRMS && Array.isArray(window.HRMS.employees)) boot(); else { document.addEventListener('HRMS_LOADED', boot, { once:true }); setTimeout(()=>{ if(window.HRMS && Array.isArray(window.HRMS.employees)) boot(); }, 800); } })();
