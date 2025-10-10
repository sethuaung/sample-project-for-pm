import { getProjectName } from '../utils/helpers.js';

export function renderCalendar(area, DEMO, state) {
  area.innerHTML = '';
  let tasks = DEMO.tasks.slice();
  if (state.projectFilter !== 'all') tasks = tasks.filter(t => t.project === state.projectFilter);
  if (state.roleFilter && state.roleFilter !== 'all') {
    const usersWithRole = DEMO.staff.filter(s => s.roleId === state.roleFilter).map(s => s.userId);
    tasks = tasks.filter(t => usersWithRole.includes(t.assignee));
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month+1, 0);
  const days = last.getDate();

  const calendar = document.createElement('div');
  calendar.className = 'grid grid-cols-7 gap-1';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(h => {
    const hd = document.createElement('div');
    hd.className = 'text-xs font-semibold text-gray-600';
    hd.textContent = h;
    calendar.appendChild(hd);
  });

  for (let i=0;i<first.getDay();i++) calendar.appendChild(document.createElement('div'));

  for (let d=1; d<=days; d++) {
    const cell = document.createElement('div');
    cell.className = 'min-h-[80px] p-2 bg-white rounded';
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    cell.innerHTML = `<div class="text-xs font-medium mb-1">${d}</div>`;
    tasks.filter(t => t.start === dateStr || (new Date(t.start) < new Date(dateStr) && new Date(t.end) >= new Date(dateStr)))
      .forEach(t => {
        const pill = document.createElement('div');
        pill.className = 'text-xs px-2 py-1 mb-1 rounded text-white';
        pill.style.background = DEMO.projects.find(p => p.id === t.project)?.color || '#6B7280';
        pill.textContent = `${t.title} • ${getProjectName(DEMO, t.project)}`;
        cell.appendChild(pill);
      });
    calendar.appendChild(cell);
  }
  area.appendChild(calendar);
}
