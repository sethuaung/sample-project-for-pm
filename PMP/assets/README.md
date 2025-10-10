# Project Management Demo — README

A static, modular Project Management demo built with HTML, Tailwind CSS, plain JavaScript, and Chart.js.  
Implements Gantt (interactive drag + resize + keyboard + ARIA), Grid, Card (kanban), Calendar, Team roster, Workload, Budget, Approval workflows, native time tracking, CSV export, and simple demo data (projects, teams, roles, staff, tasks, approvals, timesheets).

This repository is optimized as a local demo bundle so you can open it in a browser or serve it with a tiny static server.

---

## Key features

- Interactive Gantt
  - Drag to move tasks horizontally
  - Drag handles to resize start/end
  - Keyboard controls: ArrowLeft/ArrowRight to move; Alt+ArrowLeft/Alt+ArrowRight to resize end
  - ARIA attributes and focusable bars for accessibility
  - Updates task start/end in the in-memory demo data
- Views
  - Grid (table) view with Project, Assignee, Role, dates, status, hours
  - Card (kanban) view with Todo / In Progress / Done columns
  - Calendar view (month) showing task presence by date
  - Teams roster view showing members, roles, capacity
- Project Team & Roles
  - Demo data contains teams, roles, staff assignments
  - Role-based filtering across Grid and Workload widgets
- Widgets
  - Summary (status distribution)
  - Release tracks (tasks per release)
  - Workload management (user capacity vs assigned hours)
  - Budget creation & monitoring (project budgets vs spent)
  - Custom approval workflows (approve actions)
  - Native time tracking (log timesheets, timesheet list)
- Export
  - CSV export for tasks and timesheets
- Modular code
  - Files split into logical modules (data, views, features, gantt, exports, utils, UI)

---

## Project structure

- index.html — main entry (loads src/main.js as ES module)
- src/
  - main.js — bootstraps UI, state, render flow
  - data.js — seeded demo data (projects, users, roles, teams, staff, tasks, approvals, timeEntries)
  - utils/
    - helpers.js — small helper functions
  - ui/
    - sidebar.js — sidebar, filters, export buttons
    - summary.js — top summary + charts
    - views.js — wires view renderers & widgets
  - views/
    - grid.js
    - card.js
    - calendar.js
    - team.js
  - gantt/
    - gantt.js — render + interactions + keyboard/ARIA
  - features/
    - workload.js
    - budget.js
    - time.js
  - exports/
    - csv-export.js

All files are plain JavaScript modules. Styling uses Tailwind via CDN. Charts use Chart.js CDN.

---

## Quick start

1. Clone or copy the project files into a local directory.
2. Open index.html directly in a modern browser, or run a lightweight static server (recommended for module imports):

- Using Node (http-server)
  - Install (if not available): npm install -g http-server
  - Start: http-server -c-1
  - Open: http://localhost:8080 (default)

- Using npx:
  - npx http-server -c-1
  - Open shown URL

- Using Python 3:
  - python -m http.server 8000
  - Open: http://localhost:8000

3. Use the left sidebar to:
  - Switch menus (Summary, Release, Teams, Workload, Budget, Approval, Time)
  - Switch views (Gantt, Grid, Card, Calendar)
  - Apply project and role filters
  - Export CSV for tasks and timesheets

---

## How to use the main features

- Gantt
  - Click and drag a bar to move the task horizontally (start/end both shift).
  - Drag left or right handle on the bar to resize start or end.
  - Focus a bar (Tab) and use ArrowLeft / ArrowRight to shift the task by one day.
  - Use Alt+ArrowLeft / Alt+ArrowRight to shrink/extend the task end date by one day.
  - After changes, Gantt updates the in-memory DEMO.tasks start/end and re-renders.

- Grid / Card / Calendar
  - Use the view buttons to switch between Grid, Card, and Calendar.
  - Role and Project filters refine what tasks are shown.

- Teams
  - View each team roster with member roles and capacity.

- Workload
  - Shows each user’s assigned hours vs capacity, respects role filter.

- Budget
  - Shows project spending vs budget; demo highlights projects above threshold.

- Time tracking
  - Log time entries via the form in the Time menu; entries are stored in DEMO.timeEntries in memory.
  - Export timesheets as CSV.

- Approval
  - Approve demo approvals via UI buttons; status updates in memory.

---

## Developer notes

- Data persistence: Everything is in-memory (src/data.js). For production, replace data.js with API calls to a backend (REST or GraphQL).
- Gantt implementation: Lightweight pixel-to-day heuristic for the demo. For production-grade features (dependencies, auto-snap, zoom, mobile gestures), consider integrating a dedicated Gantt library (Frappe Gantt, DHTMLX, Bryntum, etc.).
- Accessibility: Gantt bars include ARIA attributes and keyboard handling. Consider adding more ARIA live-region announcements for changes, and explicit focus styling.
- CSV export: Implemented in src/exports/csv-export.js with a simple CSV generator and Blob download.
- Modules: Files use ES module imports; serve over HTTP to avoid CORS/module restrictions when using import statements.

---

## Extension ideas

- Add task editor modal with project/team/role assignment, status, hours, billable flag, budget adjustments.
- Persist changes to a local JSON file or a backend (Node + SQLite or lightweight JSON server).
- Add dependency links, critical path highlighting, and zoomable timeline in Gantt.
- Add unit tests (Jest / Playwright) for UI-critical flows.
- Improve mobile/touch support for Gantt drag/resize and add pinch-to-zoom.
- Add CSV/Excel import to seed tasks and teams.

---

## Troubleshooting

- Blank page or "module" errors: run a static server (python or http-server) instead of opening file:// directly.
- Charts not appearing: ensure Chart.js CDN is reachable and loaded before rendering (index.html includes Chart.js via CDN).
- Large Gantt timeline may shrink bars — px-per-day is clamped for demo reliability; tweak pxPerDay logic in src/gantt/gantt.js.

---

## License
MIT License — feel free to adapt, remix, and use for teaching and prototyping. This demo code is provided as-is for learning, prototyping, and internal demos. Feel free to adapt and reuse. No warranty.

---

## Credits & contact

Built and maintained by Felixent. For feedback, integration requests, or contributions contact: felixent@outlook.com

Contributions welcome: open a PR or issue with a clear change summary and any sample data needed for verification.

---
