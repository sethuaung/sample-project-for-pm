import { renderReleaseChart as _releaseChart } from './views.js';

export function renderTopSummary(state, DEMO) {
  const el = document.getElementById('top-summary');
  el.innerHTML = '';
  let tasks = DEMO.tasks.slice();
  if (state.projectFilter !== 'all') tasks = tasks.filter(t => t.project === state.projectFilter);
  if (state.roleFilter !== 'all') {
    const usersWithRole = DEMO.staff.filter(s => s.roleId === state.roleFilter).map(s => s.userId);
    tasks = tasks.filter(t => usersWithRole.includes(t.assignee));
  }

  const totalProjects = new Set(tasks.map(t => t.project)).size || DEMO.projects.length;
  const open = tasks.filter(t => t.status !== 'Done').length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const budgetUsed = tasks.reduce((s, t) => s + (t.budgetUsed || 0), 0);

  const items = [
    {label: 'Projects', value: totalProjects},
    {label: 'Open tasks', value: open},
    {label: 'Completed', value: done},
    {label: 'Budget used', value: `$${budgetUsed.toLocaleString()}`}
  ];
  items.forEach(i => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow';
    card.innerHTML = `<div class="text-sm text-gray-500">${i.label}</div><div class="text-lg font-semibold mt-2">${i.value}</div>`;
    el.appendChild(card);
  });

  if (state.currentMenu === 'release') {
    const releaseCard = document.createElement('div');
    releaseCard.className = 'col-span-4 bg-white p-4 rounded shadow mt-4';
    releaseCard.innerHTML = '<canvas id="releaseChart"></canvas>';
    el.appendChild(releaseCard);
    setTimeout(() => _releaseChart(DEMO), 0);
  }
}
