export function renderTimeTrackingWidget(area, DEMO, onAction) {
  const box = document.createElement('div');
  box.className = 'mt-4 p-4 bg-white rounded shadow';
  let html = '<div class="font-semibold mb-2">Native Time Tracking</div>';
  html += `<div class="mb-2"><form id="timeForm" class="flex gap-2">
    <select id="timeTask" class="border px-2 py-1 text-sm">${DEMO.tasks.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select>
    <select id="timeUser" class="border px-2 py-1 text-sm">${DEMO.users.map(u => `<option value="${u.id}">${u.name}</option>`).join('')}</select>
    <input id="timeDate" type="date" class="border px-2 py-1 text-sm" />
    <input id="timeHours" type="number" min="0" step="0.25" placeholder="hours" class="border px-2 py-1 text-sm" />
    <button class="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Log</button>
  </form></div>`;
  html += '<div id="timeList" class="text-sm"></div>';
  box.innerHTML = html;
  area.appendChild(box);

  const timeForm = box.querySelector('#timeForm');
  const timeList = box.querySelector('#timeList');
  function refreshList() {
    timeList.innerHTML = DEMO.timeEntries.map(te => {
      const task = DEMO.tasks.find(t => t.id === te.task);
      const user = DEMO.users.find(u => u.id === te.user);
      return `<div class="border-b py-1">${te.date} • ${task.title} • ${user.name} • ${te.hours}h</div>`;
    }).join('');
  }
  refreshList();
  timeForm.addEventListener('submit', e => {
    e.preventDefault();
    const newEntry = {
      id: 'TT' + (DEMO.timeEntries.length + 1),
      task: box.querySelector('#timeTask').value,
      user: box.querySelector('#timeUser').value,
      date: box.querySelector('#timeDate').value || new Date().toISOString().slice(0,10),
      hours: Number(box.querySelector('#timeHours').value) || 0
    };
    DEMO.timeEntries.push(newEntry);
    refreshList();
    if (typeof onAction === 'function') onAction({ type: 'timeLogged', entry: newEntry });
  });
}

/* approval widget used in approval menu */
export function renderApprovalWidget(area, DEMO, onAction) {
  const box = document.createElement('div');
  box.className = 'mt-4 p-4 bg-white rounded shadow';
  let html = '<div class="font-semibold mb-2">Custom Approval Workflows</div>';
  DEMO.approvals.forEach(a => {
    const t = DEMO.tasks.find(x => x.id === a.task);
    html += `<div class="border p-3 rounded mb-2"><div class="text-sm font-medium">${t.title}</div>
      <div class="text-xs text-gray-500">Approvers: ${a.approvers.join(', ')}</div>
      <div class="mt-2 text-sm">Status: <strong>${a.status}</strong></div>
      <div class="mt-2"><button data-approve="${a.id}" class="px-2 py-1 bg-indigo-600 text-white rounded text-sm">Approve</button></div>
    </div>`;
  });
  box.innerHTML = html;
  area.appendChild(box);
  box.querySelectorAll('[data-approve]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ap = DEMO.approvals.find(x => x.id === btn.dataset.approve);
      ap.status = 'Approved';
      if (typeof onAction === 'function') onAction({ type: 'approval', approval: ap });
    });
  });
}
