import { renderGantt } from '../gantt/gantt.js';
import { renderWorkloadWidget } from '../features/workload.js';
import { renderBudgetWidget } from '../features/budget.js';
import { renderApprovalWidget, renderTimeTrackingWidget } from '../features/time.js';
import { renderGrid } from '../views/grid.js';
import { renderCard } from '../views/card.js';
import { renderCalendar } from '../views/calendar.js';
import { renderTeams } from '../views/team.js';
import { getProjectName } from '../utils/helpers.js';

export function renderView(state, DEMO, onAction) {
  const area = document.getElementById('view-area');
  area.innerHTML = '';

  if (state.view === 'gantt') renderGantt(area, DEMO, state, onAction);
  if (state.view === 'grid') renderGrid(area, DEMO, state);
  if (state.view === 'card') renderCard(area, DEMO, state);
  if (state.view === 'calendar') renderCalendar(area, DEMO, state);

  if (state.currentMenu === 'workload') renderWorkloadWidget(area, DEMO, state);
  if (state.currentMenu === 'budget') renderBudgetWidget(area, DEMO);
  if (state.currentMenu === 'approval') renderApprovalWidget(area, DEMO, onAction);
  if (state.currentMenu === 'time') renderTimeTrackingWidget(area, DEMO, onAction);
  if (state.currentMenu === 'teams') renderTeams(area, DEMO, state);
}
