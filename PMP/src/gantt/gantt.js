// Minimal interactive gantt: render, drag to move, resize right/left, keyboard controls with ARIA
export function renderGantt(area, DEMO, state, onChange) {
  area.innerHTML = '';
  const tasks = state.projectFilter === 'all' ? DEMO.tasks : DEMO.tasks.filter(t => t.project === state.projectFilter);
  if (state.roleFilter && state.roleFilter !== 'all') {
    const usersWithRole = DEMO.staff.filter(s => s.roleId === state.roleFilter).map(s => s.userId);
    tasks = tasks.filter(t => usersWithRole.includes(t.assignee));
  }
  if (!tasks.length) { area.innerHTML = '<div class="text-center py-20 text-gray-500">No tasks</div>'; return; }

  const min = new Date(Math.min(...tasks.map(t => new Date(t.start))));
  min.setDate(min.getDate() - 5);
  const max = new Date(Math.max(...tasks.map(t => new Date(t.end))));
  max.setDate(max.getDate() + 5);
  const totalDays = Math.ceil((max - min) / (1000*60*60*24));
  const pxPerDay = Math.max(8, Math.floor((area.clientWidth || 800) / Math.min(totalDays, 120)));

  // ruler
  const header = document.createElement('div');
  header.className = 'overflow-x-auto';
  const ruler = document.createElement('div');
  ruler.className = 'flex gap-1 mb-3';
  for (let d=0; d<=totalDays; d++) {
    const dt = new Date(min); dt.setDate(min.getDate() + d);
    const lbl = document.createElement('div');
    lbl.className = 'text-xs text-gray-500 text-center';
    lbl.style.width = pxPerDay + 'px';
    lbl.textContent = `${dt.getMonth()+1}/${dt.getDate()}`;
    ruler.appendChild(lbl);
  }
  header.appendChild(ruler);
  area.appendChild(header);

  // rows
  const grid = document.createElement('div');
  grid.className = 'w-full';
  tasks.forEach(t => {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-4 border-b py-2';
    const meta = document.createElement('div');
    meta.className = 'w-48 text-sm';
    meta.innerHTML = `<div class="font-medium">${t.title}</div><div class="text-xs text-gray-500">${t.assignee}</div>`;
    const timeline = document.createElement('div');
    timeline.className = 'flex-1 relative h-12 bg-gray-50 rounded overflow-visible';
    timeline.style.minWidth = (pxPerDay * totalDays) + 'px';

    const startOffset = Math.ceil((new Date(t.start) - min)/(1000*60*60*24));
    const dur = Math.max(1, Math.ceil((new Date(t.end) - new Date(t.start))/(1000*60*60*24)) + 1);

    const bar = document.createElement('div');
    bar.className = 'absolute h-8 rounded flex items-center text-white px-2 cursor-move focus:outline-none';
    bar.style.left = (startOffset * pxPerDay) + 'px';
    bar.style.width = (dur * pxPerDay) + 'px';
    bar.style.background = DEMO.projects.find(p => p.id === t.project)?.color || '#6B7280';
    bar.dataset.taskId = t.id;
    bar.setAttribute('tabindex','0');
    bar.setAttribute('role','slider');
    bar.setAttribute('aria-label', `${t.title} from ${t.start} to ${t.end}`);

    // left handle
    const leftHandle = document.createElement('div');
    leftHandle.className = 'absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize';
    leftHandle.style.background = 'rgba(0,0,0,0.08)';
    leftHandle.dataset.handle = 'left';
    // right handle
    const rightHandle = document.createElement('div');
    rightHandle.className = 'absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize';
    rightHandle.style.background = 'rgba(0,0,0,0.08)';
    rightHandle.dataset.handle = 'right';

    bar.appendChild(leftHandle);
    bar.appendChild(rightHandle);
    bar.innerHTML += `<span class="truncate">${t.title} • ${t.status}</span>`;

    timeline.appendChild(bar);
    row.appendChild(meta);
    row.appendChild(timeline);
    grid.appendChild(row);
  });
  area.appendChild(grid);

  // attach interactions
  initGanttInteractions(DEMO, state, pxPerDay, (taskId, newStart, newEnd) => {
    const task = DEMO.tasks.find(x => x.id === taskId);
    if (task) {
      task.start = newStart;
      task.end = newEnd;
      if (typeof onChange === 'function') onChange({ type: 'gantt:update', task });
    }
    // re-render after update
    renderGantt(area, DEMO, state, onChange);
  });
}

// Interaction handlers and keyboard support
let _gState = { dragging: null, startX:0, originalLeft:0, originalWidth:0, pxPerDay:10, rerender:null };
export function initGanttInteractions(DEMO, state, pxPerDay, commitFn) {
  _gState.pxPerDay = pxPerDay;
  // mouse handlers
  function onMouseDown(e) {
    const bar = e.target.closest('[data-task-id]');
    if (!bar) return;
    const handle = e.target.dataset.handle || 'move';
    _gState.dragging = { bar, handle };
    _gState.startX = e.clientX;
    _gState.originalLeft = parseInt(bar.style.left || 0, 10);
    _gState.originalWidth = parseInt(bar.style.width || 0, 10);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  }
  function onMouseMove(e) {
    if (!_gState.dragging) return;
    const { bar, handle } = _gState.dragging;
    const dx = e.clientX - _gState.startX;
    if (handle === 'left') {
      const newLeft = Math.max(0, _gState.originalLeft + dx);
      const newWidth = Math.max(_gState.pxPerDay, _gState.originalWidth - (newLeft - _gState.originalLeft));
      bar.style.left = newLeft + 'px';
      bar.style.width = newWidth + 'px';
    } else if (handle === 'right') {
      const newWidth = Math.max(_gState.pxPerDay, _gState.originalWidth + dx);
      bar.style.width = newWidth + 'px';
    } else {
      const newLeft = Math.max(0, _gState.originalLeft + dx);
      bar.style.left = newLeft + 'px';
    }
  }
  function onMouseUp() {
    if (!_gState.dragging) return;
    const { bar } = _gState.dragging;
    const taskId = bar.dataset.taskId;
    const timeline = bar.parentElement;
    // approximate min date from tasks visible
    const tasks = state.projectFilter === 'all' ? DEMO.tasks : DEMO.tasks.filter(t => t.project === state.projectFilter);
    const min = new Date(Math.min(...tasks.map(t => new Date(t.start)))); min.setDate(min.getDate()-5);
    const leftPx = parseInt(bar.style.left || 0, 10);
    const widthPx = parseInt(bar.style.width || 0, 10);
    const pxpd = Math.max(6, Math.round(timeline.scrollWidth / Math.max(30, Math.ceil((new Date(Math.max(...tasks.map(t=>new Date(t.end)))) - min)/(1000*60*60*24)))));
    const newStart = new Date(min); newStart.setDate(min.getDate() + Math.round(leftPx / pxpd));
    const newEnd = new Date(newStart); newEnd.setDate(newStart.getDate() + Math.max(0, Math.round(widthPx / pxpd) - 1));
    commitFn(taskId, newStart.toISOString().slice(0,10), newEnd.toISOString().slice(0,10));
    _gState.dragging = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  // keyboard handling for focused bars
  function onKeyDown(e) {
    const active = document.activeElement?.closest ? document.activeElement.closest('[data-task-id]') : null;
    if (!active) return;
    const taskId = active.dataset.taskId;
    const task = DEMO.tasks.find(x => x.id === taskId);
    if (!task) return;
    const timeline = active.parentElement;
    const pxpd = _gState.pxPerDay || Math.max(6, Math.round(timeline.scrollWidth / Math.max(30, 60)));
    if (e.key === 'ArrowLeft' && !e.altKey) {
      const ns = new Date(task.start); ns.setDate(ns.getDate()-1);
      const ne = new Date(task.end); ne.setDate(ne.getDate()-1);
      commitFn(taskId, ns.toISOString().slice(0,10), ne.toISOString().slice(0,10));
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && !e.altKey) {
      const ns = new Date(task.start); ns.setDate(ns.getDate()+1);
      const ne = new Date(task.end); ne.setDate(ne.getDate()+1);
      commitFn(taskId, ns.toISOString().slice(0,10), ne.toISOString().slice(0,10));
      e.preventDefault();
    } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && e.altKey) {
      const ne = new Date(task.end);
      ne.setDate(ne.getDate() + (e.key === 'ArrowRight' ? 1 : -1));
      if (ne >= new Date(task.start)) commitFn(taskId, task.start, ne.toISOString().slice(0,10));
      e.preventDefault();
    }
  }

  document.removeEventListener('mousedown', onMouseDown);
  document.addEventListener('mousedown', onMouseDown);
  document.removeEventListener('keydown', onKeyDown);
  document.addEventListener('keydown', onKeyDown);
}
