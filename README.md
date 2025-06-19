# 💻 **Student Progress Management System** — *TLE Eliminators*

A sleek web app to help mentors **track and visualize Codeforces progress** of students.  
Built using *React, Vite, Tailwind CSS, Node.js, and MongoDB*.

---

## ✨ **Features**

- 👥 **Student Management** — Add, edit, delete, and view students.
- 📈 **Rating Trends** — Visual graphs of Codeforces rating changes.
- 🧩 **Problem Analytics** — Bar charts, heatmaps, and difficulty stats.
- ⏱️ **Activity Tracking** — Detect inactivity and send email reminders.
- 🔄 **Daily Data Sync** — Scheduled Codeforces data fetch with cron.

---

## ⚙️ **Quick Setup**

### 🔧 *Backend*

```bash
cd Server
npm install
npm run dev
```
### 🌐 *Frontend*

```bash
cd Client
npm install
npm run dev
```
## 🔌 *API Endpoints*

| **Purpose**         | **Endpoint**                          | **Method** |
|---------------------|----------------------------------------|------------|
| List students       | `/api/students`                        | `GET`      |
| Get student         | `/api/students/:id`                    | `GET`      |
| Create student      | `/api/students`                        | `POST`     |
| Contest history     | `/api/codeforces/contests/:id`         | `GET`      |
| Problem data        | `/api/codeforces/problems/:id`         | `GET`      |
