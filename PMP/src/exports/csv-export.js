export function exportTasksCSV(DEMO) {
  const headers = ['id','title','project','assignee','start','end','status','hours','billable','budgetUsed','release'];
  const rows = DEMO.tasks.map(t => ({ id: t.id, title: t.title, project: t.project, assignee: t.assignee, start: t.start, end: t.end, status: t.status, hours: t.hours, billable: t.billable, budgetUsed: t.budgetUsed, release: t.release }));
  downloadCSV('tasks.csv', toCSV(rows, headers));
}
export function exportTimeCSV(DEMO) {
  const headers = ['id','task','user','date','hours'];
  const rows = DEMO.timeEntries.map(te => ({ id: te.id, task: te.task, user: te.user, date: te.date, hours: te.hours }));
  downloadCSV('timesheets.csv', toCSV(rows, headers));
}
function toCSV(rows, headers) {
  const esc = v => `"${String(v||'').replace(/"/g,'""')}"`;
  const out = [headers.map(esc).join(',')];
  rows.forEach(r => out.push(headers.map(h => esc(r[h] === undefined ? '' : r[h])).join(',')));
  return out.join('\n');
}
function downloadCSV(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
