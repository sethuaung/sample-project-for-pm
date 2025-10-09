DWA (Digital Transfer Apps) — Static demo

Location
- public/
  - index.html       (Dashboard)
  - transactions.html
  - wallets.html
  - admin.html
  - data.js          (seeded demo data)
  - app.js           (shared UI logic)

Features added
- CSV export buttons:
  - Dashboard: exports currently visible (filtered) transactions.
  - Transactions: exports filtered transactions.
  - Wallets: exports wallet-level report with tx counts and volumes.
- Date-range filters (start / end):
  - Dashboard and Transactions charts and tables respond to selected date range.

How to run locally
- Recommended: serve the public folder with a static server
  - Python 3: cd AMS/DWA/public && python -m http.server 8000
  - Node: npx http-server AMS/DWA/public
- Open http://localhost:8000/index.html

Notes
- All demo data lives in public/data.js. Exports and admin actions operate in-memory; reload resets to seed.
- Charts require internet to load Chart.js CDN.
