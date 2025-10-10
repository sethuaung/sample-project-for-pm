import { DEMO } from './data.js';
import { renderSidebar } from './ui/sidebar.js';
import { renderTopSummary } from './ui/summary.js';
import { renderView } from './ui/views.js';
import { initGanttInteractions } from './gantt/gantt.js';

const state = { view: 'gantt', currentMenu: 'summary', projectFilter: 'all', roleFilter: 'all' };

function onMenuChange(menu) {
  state.currentMenu = menu;
  renderTopSummary(state, DEMO);
  renderView(state, DEMO, onAction);
}
function onViewChange(view) {
  state.view = view;
  renderView(state, DEMO, onAction);
}
function onAction(evt) {
  // handle callback events (time logging, approvals, gantt updates)
  renderTopSummary(state, DEMO);
  renderView(state, DEMO, onAction);
}

function init() {
  renderSidebar(state, DEMO, onMenuChange, onViewChange);
  renderTopSummary(state, DEMO);
  renderView(state, DEMO, onAction);
  // gantt interactions are wired by renderGantt via init inside that module
}

document.addEventListener('DOMContentLoaded', init);
