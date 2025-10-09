AMS (Inventory / Assets Management System) — static demo

Files
- public/index.html    (dashboard)
- public/assets.html   (list + add/edit)
- public/data.ams.js   (seed assets)
- public/app.ams.js    (logic, charts, CSV export)

How to run
- Serve AMS/public folder with a static server:
  - cd AMS/public && python -m http.server 8001
  - Open http://localhost:8001/index.html

Notes
- All data is in-memory in data.ams.js; admin / edits mutate the browser state only.
- Chart.js and Tailwind loaded from CDN. Internet required for those.
- Integrate with DWA by linking in nav if desired.
