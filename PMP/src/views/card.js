import { getProjectName, getUserName, getRoleName } from '../utils/helpers.js';

export function renderCard(area, DEMO, state) {
  area.innerHTML = '';
  let tasks = DEMO.tasks.slice();
  if (state.projectFilter !== 'all') tasks = tasks.filter(t => t.project === state.projectFilter);
  if (state.roleFilter && state.roleFilter !== 'all') {
    const usersWithRole = DEMO.staff.filter(s => s.roleId === state.roleFilter).map(s => s.userId);
    tasks = tasks.filter(t => usersWithRole.includes(t.assignee));
  }

  const columns = ['Todo','In Progress','Done'];
  const board = document.createElement('div');
  board.className = 'flex gap-4';
  columns.forEach(col => {
    const colEl = document.createElement('div');
    colEl.className = 'flex-1 bg-gray-50 p-3 rounded';
    colEl.innerHTML = `<h4 class="font-semibold mb-2">${col}</h4>`;
    tasks.filter(t => mapStatus(t.status) === col).forEach(t => {
      const card = document.createElement('div');
      card.className = 'bg-white p-3 rounded shadow mb-3';
      const roleMapping = DEMO.staff.find(s => s.userId === t.assignee);
      const roleName = roleMapping ? getRoleName(DEMO, roleMapping.roleId) : '';
      card.innerHTML = `
        <div class="font-medium">${t.title}</div>
        <div class="text-xs text-gray-500">${getProjectName(DEMO, t.project)}</div>
        <div class="mt-2 text-sm flex justify-between"><div>${getUserName(DEMO, t.assignee)} • ${roleName}</div><div>${t.hours}h</div></div>
      `;
      colEl.appendChild(card);
    });
    board.appendChild(colEl);
  });
  area.appendChild(board);
}

function mapStatus(s) {
  if (s === 'Done') return 'Done';
  if (s === 'In Progress') return 'In Progress';
  return 'Todo';
}
