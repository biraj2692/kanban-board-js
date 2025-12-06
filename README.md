# 🗂️ TaskPro – Kanban Board (HTML, CSS & JavaScript)

A clean, modern, and fully interactive **Kanban Board** built using **vanilla JavaScript**, featuring:

- Drag & drop task movement  
- LocalStorage persistence  
- Custom modals  
- First-time user onboarding  
- Toastify notifications  
- Confetti celebration on task completion  
- Smooth UI with complete responsiveness  

This project is designed to help beginners and intermediate developers understand **state management**, **DOM manipulation**, and **drag-and-drop events** without using frameworks.

---

## 🚀 Live Demo  
🔗 *Add your GitHub Pages link here (optional)*  
`https://yourusername.github.io/kanban-board`

---


## ✨ Features

### ✔️ **Task Management**
- Add new tasks with title & description  
- Delete tasks  
- Drag tasks between **To Do → In Progress → Done**  
- Task count updates dynamically  

### ✔️ **Gamification**
- ⭐ Toast notifications on:
  - First-time login
  - Creating a task
  - Moving task to Done  
- 🎉 Confetti when a task is completed  

### ✔️ **User Onboarding**
- First-time welcome modal  
- Username saved in `localStorage`  
- Username shown in the Navbar  

### ✔️ **Persistence**
- All tasks stored in `localStorage`  
- Tasks retain state even after page reload  
- Username saved and restored  

### ✔️ **UI/UX**
- Fully responsive UI  
- Smooth transitions  
- Clean and modern dark theme  

---

## 🧠 How It Works

This Kanban board uses:
- `dragstart`, `dragover`, `drop` events for drag & drop  
- `localStorage` for persistent task storage  
- Toastify for notifications  
- Confetti JS for celebratory effects  
- Custom modals for task creation & onboarding  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|----------|
| **HTML5** | Structure |
| **CSS3** | Styling, layout, responsiveness |
| **JavaScript (ES6)** | Logic, drag & drop, persistence |
| **Toastify JS** | Notifications |
| **Canvas Confetti JS** | Celebration animations |

---

## 📦 Installation

You can run the project locally in 2 ways:

### **Option 1: Download ZIP**
1. Download the repo as ZIP  
2. Extract  
3. Open `index.html` in browser  

### **Option 2: Clone the repo**
```bash
git clone https://github.com/biraj2692/kanban-board-js
cd kanban-board-js
