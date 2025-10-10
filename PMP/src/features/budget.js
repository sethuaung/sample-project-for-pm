export function renderBudgetWidget(area, DEMO) {
  const box = document.createElement('div');
  box.className = 'mt-4 p-4 bg-white rounded shadow';
  let html = '<div class="font-semibold mb-2">Budget creation and monitoring</div>';
  DEMO.projects.forEach(p => {
    const spent = DEMO.tasks.filter(t => t.project === p.id).reduce((s, t) => s + (t.budgetUsed || 0), 0);
    const pct = Math.round((spent / p.budget) * 100);
    html += `<div class="mb-3">
      <div class="flex justify-between text-sm"><div><strong>${p.name}</strong></div><div>$${spent.toLocaleString()} / $${p.budget.toLocaleString()}</div></div>
      <div class="w-full bg-gray-100 h-2 rounded mt-1"><div class="h-2 rounded ${pct>90 ? 'bg-red-500' : 'bg-green-500'}" style="width:${Math.min(100,pct)}%"></div></div>
    </div>`;
  });
  html += `<div class="mt-3 text-sm text-gray-600">Demo: projects exceeding 90% are highlighted</div>`;
  box.innerHTML = html;
  area.appendChild(box);
}
