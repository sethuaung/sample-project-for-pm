import { getProjectName, getUserName, getRoleName } from '../utils/helpers.js';

export function renderGrid(area, DEMO, state) {
  area.innerHTML = '';
  let tasks = DEMO.tasks.slice();
  if (state.projectFilter !== 'all') tasks = tasks.filter(t => t.project === state.projectFilter);
  if (state.roleFilter && state.roleFilter !== 'all') {
    const usersWithRole = DEMO.staff.filter(s => s.roleId === state.roleFilter).map(s => s.userId);
    tasks = tasks.filter(t => usersWithRole.includes(t.assignee));
  }

  const table = document.createElement('table');
  table.className = 'min-w-full text-sm';
  table.innerHTML = `
    <thead class="bg-gray-50">
      <tr>
        <th class="p-2 text-left">Task</th>
        <th class="p-2 text-left">Project</th>
        <th class="p-2">Assignee</th>
        <th class="p-2">Role</th>
        <th class="p-2">Start</th>
        <th class="p-2">End</th>
        <th class="p-2">Status</th>
        <th class="p-2">Hours</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');
  tasks.forEach(t => {
    const tr = document.createElement('tr');
    tr.className = 'border-b';
    const roleMapping = DEMO.staff.find(s => s.userId === t.assignee);
    const roleName = roleMapping ? getRoleName(DEMO, roleMapping.roleId) : '';
    tr.innerHTML = `
      <td class="p-2">${t.title}</td>
      <td class="p-2">${getProjectName(DEMO, t.project)}</td>
      <td class="p-2 text-center">${getUserName(DEMO, t.assignee)}</td>
      <td class="p-2 text-center">${roleName}</td>
      <td class="p-2 text-center">${t.start}</td>
      <td class="p-2 text-center">${t.end}</td>
      <td class="p-2 text-center">${t.status}</td>
      <td class="p-2 text-right">${t.hours}</td>
    `;
    tbody.appendChild(tr);
  });
  area.appendChild(table);
}
