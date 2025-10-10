export function renderWorkloadWidget(area, DEMO, state) {
  const box = document.createElement('div');
  box.className = 'mt-4 p-4 bg-white rounded shadow';
  const usersList = state.roleFilter && state.roleFilter !== 'all'
    ? DEMO.staff.filter(s => s.roleId === state.roleFilter).map(s => s.userId)
    : DEMO.users.map(u => u.id);

  const workloads = {};
  DEMO.users.forEach(u => { if (usersList.includes(u.id)) workloads[u.id] = { name: u.name, capacity: u.capacity, hours: 0 }; });
  DEMO.tasks.forEach(t => { if (workloads[t.assignee]) workloads[t.assignee].hours += t.hours; });

  let html = '<div class="font-semibold mb-2">Workload Management</div>';
  html += '<div class="space-y-2">';
  Object.values(workloads).forEach(w => {
    const pct = Math.min(100, Math.round((w.hours / w.capacity) * 100));
    html += `<div><div class="flex justify-between text-sm"><div>${w.name}</div><div>${w.hours}h / ${w.capacity}h</div></div>
      <div class="w-full bg-gray-100 h-2 rounded mt-1"><div class="h-2 rounded bg-indigo-600" style="width:${pct}%"></div></div></div>`;
  });
  html += '</div>';
  box.innerHTML = html;
  area.appendChild(box);
}
