# Demo Web-based Project for Project Management Student

This archive contains three static demo web apps designed for local testing and quick demos:

- DWA (Digital Wallet App) — path: DWA/public
- AMS (Inventory / Assets Management System) — path: AMS/public
- HRMS (Human Resource Management System) — path: HRMS/public
- Learning Management System (LMS) frontend prototype — path: LMS/
- Others

Quick-run (recommended)
1. Extract the zip.
2. Serve each app folder with a simple HTTP server, for example:
   - DWA: cd DWA/public && python -m http.server 8000
   - AMS: cd AMS/public && python -m http.server 8001
   - HRMS: cd HRMS/public && python -m http.server 8002
3. Or open top-level index.html (if served from a server) to jump to apps.

Notes
- Data is in-memory and resets on page reload.
- Chart.js and Tailwind are loaded from CDN.


## Security & privacy

This project is a frontend demo. Do not store or use real PII or production credentials in js/data.js. For production deployments:
- Use HTTPS
- Implement authentication and RBAC
- Store data server-side with appropriate encryption and logging
- Comply with data protection requirements for your region

---

## License

MIT License — feel free to adapt, remix, and use for teaching and prototyping.

---

## Credits & contact

Built and maintained by Felixent. For feedback, integration requests, or contributions contact: felixent@outlook.com

Contributions welcome: open a PR or issue with a clear change summary and any sample data needed for verification.
