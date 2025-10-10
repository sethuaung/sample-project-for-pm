This is a comprehensive `README.md` for the generated Learning Management System (LMS) frontend prototype, detailing the project's purpose, technology stack, data structure, and deployment instructions.

# Felixent LMS (FE Demo) Prototype

A high-fidelity, single-file Learning Management System (LMS) dashboard prototype. This project is designed as a quick, client-side proof-of-concept, demonstrating a fully interactive UI, complete with 200 synthetic data records and dynamic charting, without requiring a backend server.

## 🚀 Project Overview

The **Felixent LMS (FE Demo)** replicates the look and feel of a professional LMS environment. It adheres strictly to a pure frontend stack, making it easy to deploy and review.

### Key Features Implemented

*   **Eight Complete Pages:** Full navigation and layout for Dashboard, Users, Courses, Groups, Branches, Reports, and Account & Settings.
*   **Rebranding:** Custom text applied across the application:
    *   Platform Name: **Felixent LMS**
    *   Demo Title: **FE Demo**
    *   Admin User: **James** (Principal)
    *   Footer Disclaimer: `Demo data generated locally · Not connected to backend | Powered by Felixent.`
*   **Synthetic Data Generation:** Includes 200 unique records for Students, Teachers, Staff, Courses, and Groups, generated dynamically on page load.
*   **Data Visualization:** Interactive charts implemented with Chart.js on the Dashboard and Group pages.
*   **Client-Side Pagination:** The Users page handles the 200 records with fixed 50-per-page pagination entirely using vanilla JavaScript.
*   **Organizational Hierarchy:** The Settings page visualizes the school's structure, confirming James as the School Principal.

## 🛠️ Technology Stack

This prototype is built using a simple, un-opinionated tech stack for maximum accessibility and speed.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Structure** | HTML5 | Provides the core application shell and content structure. |
| **Styling** |([https://tailwindcss.com/](https://tailwindcss.com/)) (CDN) | Utility-first framework for rapid, responsive design and consistent application UI. |
| **Logic** | Vanilla JavaScript | Handles all data generation, rendering logic, DOM manipulation, and dynamic filtering. |
| **Charting** | [Chart.js](https://www.chartjs.org/) (CDN) | Library used for generating responsive and interactive data visualizations. |
| **Data Source** | [Faker.js](https://fakerjs.dev/) (CDN) | Used within the JavaScript to generate all 200 synthetic user, course, and report records in memory. |

## 📦 Installation and Setup

Since this is a single, self-contained HTML file, no build process or server is required.

1.  **Save the Code:** Copy the entire code block provided in the `Felixent LMS Dashboard` immersive response.
2.  **Create File:** Save the content into a new file named `index.html`.
3.  **Launch:** Open `index.html` using any modern web browser (Chrome, Firefox, Edge, Safari).

The application will load instantly, generating the demo data in your browser's memory.

## 🗺️ Application Page Map

The application provides functional navigation across all required administrative views:

| Page | Route | Description & Key Features |
| :--- | :--- | :--- |
| **Home** | `#dashboard` | Main overview with summary statistics (KPIs) and two charts: Users by Role (Doughnut) and Courses by Grade (Bar). |
| **Users** | `#users` | Tabbed interface for Students, Teachers, and Staff. The **Students** tab features 50-per-page client-side pagination and a Students per Grade chart. |
| **Courses** | `#courses` | Simple catalog list displaying courses and their assigned grade levels. |
| **Groups** | `#groups` | Organizes student and teacher groups. Includes charts visualizing group distribution per grade and student load per teacher. |
| **Branches** | `#branches` | Lists all campus locations and teaching rooms, along with detailed facility information for each branch. |
| **Reports** | `#reports` | Presents tabular report data, filterable by **Student Grade** (All Grades, Grade 5-12) and report type (Weekly/Monthly/Annual placeholder). |
| **Account & Settings** | `#settings` | Organizational governance section, featuring a clear **School Organisation Structure** (starting with James as Principal), school regulations, and a location map placeholder. |

## ⚙️ Data Structure Notes

The data is created on initialization within the `<script>` tag of `index.html`.

*   **Total Users:** 200 (170 Students, 20 Teachers, 10 Staff).
*   **Grades:** Data is assigned across Grade 5 through Grade 12.
*   **Customization:** To modify the demo data set, edit the variables and loops inside the `generateDemoData()` function in the JavaScript section.
