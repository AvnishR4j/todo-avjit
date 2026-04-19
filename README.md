<div align="center">

# ✅ Todo Tracker

### Modern Task Management — Powered by Firebase

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

*A beautifully designed, feature-rich todo app with real-time cloud sync, priority management, and smart filtering.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| ☁️ **Real-time Sync** | Tasks sync instantly via Firebase Firestore |
| 🔒 **Anonymous Auth** | Secure, user-specific data via Firebase Authentication |
| 🏷️ **Priority Levels** | Tag tasks as Low, Medium, or High priority |
| 📂 **Categories** | Organize by Personal, Work, Health, Learning, or Other |
| 🔍 **Smart Filters** | Filter by All / Active / Completed status |
| ↕️ **Sort Options** | Sort by Newest, Oldest, Priority, or Name |
| 📊 **Live Stats** | Real-time total tasks, completed count & progress % |
| 🔔 **Toast Notifications** | Instant feedback for every action |
| ✏️ **Inline Edit** | Edit task text directly in the list |
| 🗑️ **Safe Delete** | Confirmation prompt before deleting tasks |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- A Firebase project ([create one here](https://console.firebase.google.com/))

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/AvnishR4j/todo-avjit.git
cd todo-avjit
```

**2. Configure Firebase**

Follow the detailed guide in [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) to:
- Create a Firebase project
- Enable Firestore & Authentication
- Add your config to `firebase-config.js`

**3. Open the app**
```bash
# Simply open index.html in your browser
open index.html
```

> No build tools or package manager required — pure HTML, CSS & JS.

---

## 🗂️ Project Structure

```
todo-avjit/
├── index.html            # Main app UI & layout
├── styles.css            # All styling & responsive design
├── script.js             # Local storage version
├── script-firebase.js    # Firebase-powered version (primary)
├── firebase-config.js    # Firebase project configuration
├── FIREBASE_SETUP.md     # Step-by-step Firebase setup guide
└── .gitignore
```

---

## 🛠️ Tech Stack

- **Frontend** — Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Icons** — Font Awesome
- **Fonts** — Google Fonts (Inter)
- **Backend** — Firebase Firestore (real-time database)
- **Auth** — Firebase Authentication (anonymous sign-in)

---

## 📱 How It Works

1. On load, the app signs you in **anonymously** via Firebase Auth
2. Your tasks are stored in **Firestore** under your unique user ID
3. A **real-time listener** keeps the UI in sync with the database
4. Tasks can be filtered, sorted, edited, completed, or deleted instantly
5. A **stats bar** at the top tracks your progress automatically

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork → Clone → Create branch → Make changes → Open PR
git checkout -b feature/your-feature-name
```

---

<div align="center">

Made with ❤️ by [AvnishR4j](https://github.com/AvnishR4j)

</div>
