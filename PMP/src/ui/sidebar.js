import { exportTasksCSV, exportTimeCSV } from '../exports/csv-export.js';

export function renderSidebar(state, DEMO, onMenuChange, onViewChange) {
  const root = document.getElementById('sidebar');
  root.innerHTML = `
    <h1 class="text-2xl font-bold mb-4">PM Demo</h1>
    <nav class="space-y-2">
      <button data-view="summary" class="menu-btn w-full text-left px-3 py-2 rounded hover:bg-gray-50">Summary views</button>
      <button data-view="release" class="menu-btn w-full text-left px-3 py-2 rounded hover:bg-gray-50">Release tracks</button>
      <button data-view="approval" class="menu-btn w-full text-left px-3 py-2 rounded hover:bg-gray-50">Custom approval</button>
      <button data-view="workload" class="menu-btn w-full text-left px-3 py-2 rounded hover:bg-gray-50">Workload management</button>
      <button data-view="budget" class="menu-btn w-full text-left px-3 py-2 rounded hover:bg-gray-50">Budget creation</button>
      <button data-view="time" class="menu-btn w-full text-left px-3 py-2 rounded hover:bg-gray-50">Native time tracking</button>
      <button data-view="teams" class="menu-btn w-full text-left px-3 py-2 rounded hover:bg-gray-50">Teams</button>
    </nav>

    <hr class="my-4" />
    <div>
      <h2 class="text-sm font-medium text-gray-600 mb-2">Views</h2>
      <div class="flex gap-2">
        <button data-mode="gantt" class="view-btn px-3 py-1 bg-indigo-600 text-white rounded">Gantt</button>
        <button data-mode="grid" class="view-btn px-3 py-1 bg-gray-200 rounded">Grid</button>
        <button data-mode="card" class="view-btn px-3 py-1 bg-gray-200 rounded">Card</button>
        <button data-mode="calendar" class="view-btn px-3 py-1 bg-gray-200 rounded">Calendar</button>
      </div>
    </div>

    <div class="mt-6">
      <h3 class="text-sm text-gray-500">Filters</h3>
      <select id="filter-project" class="mt-2 w-full border rounded px-2 py-1">
        <option value="all">All projects</option>
        ${DEMO.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
      </select>

      <select id="filter-role" class="mt-2 w-full border rounded px-2 py-1">
        <option value="all">All roles</option>
        ${DEMO.roles.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
      </select>
    </div>

    <div class="mt-6">
      <h3 class="text-sm text-gray-500">Export</h3>
      <div class="flex gap-2 mt-2">
        <button id="export-tasks" class="px-3 py-1 bg-gray-200 rounded text-sm">CSV tasks</button>
        <button id="export-times" class="px-3 py-1 bg-gray-200 rounded text-sm">CSV times</button>
      </div>
    </div>
  `;

  root.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('bg-indigo-50'));
      btn.classList.add('bg-indigo-50');
      onMenuChange(btn.dataset.view);
    });
  });

  root.querySelectorAll('.view-btn').forEach(b => {
    b.addEventListener('click', () => {
      root.querySelectorAll('.view-btn').forEach(x => x.classList.remove('bg-indigo-600','text-white'));
      b.classList.add('bg-indigo-600','text-white');
      onViewChange(b.dataset.mode);
    });
  });

  root.querySelector('#filter-project').addEventListener('change', e => {
    state.projectFilter = e.target.value;
    onMenuChange(state.currentMenu);
  });

  root.querySelector('#filter-role').addEventListener('change', e => {
    state.roleFilter = e.target.value;
    onMenuChange(state.currentMenu);
  });

  root.querySelector('#export-tasks').addEventListener('click', () => exportTasksCSV(DEMO));
  root.querySelector('#export-times').addEventListener('click', () => exportTimeCSV(DEMO));
}
