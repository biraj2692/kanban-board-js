document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- DOM refs ---------------- */
  const todo = document.querySelector("#todo");
  const progress = document.querySelector("#progress");
  const done = document.querySelector("#done");
  const toggleModalButton = document.querySelector("#toggle-modal");
  const modalTask = document.querySelector(".add-new-task");
  const columns = [todo, progress, done];
  let taskData = {};
  let dragElement = null;

  // welcome modal + username button (make sure id in HTML is #btn-username)
  const modalWelcome = document.querySelector(".welcome");
  const usernameButton = document.querySelector("#btn-username");
  const usernameInput = document.querySelector("#username");

  const navUsername = document.querySelector("#nav-username");

  // On page load, show stored username
  const savedUsername = JSON.parse(localStorage.getItem("username"));
  if (savedUsername && navUsername) {
    navUsername.textContent = `${savedUsername}'s Task Board`;
  }

  /* ------------- helper: Toast + Confetti ------------- */
  function showToast(text, opts = {}) {
    // opts: duration, bgColor (optional)
    Toastify({
      text,
      duration: opts.duration || 2500,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: opts.bgColor || "#333",
        color: "#fff",
        borderRadius: "8px",
        padding: "8px 12px",
      },
    }).showToast();
  }

  function burstConfetti() {
    // small burst
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
    // tiny follow-up burst
    confetti({
      particleCount: 20,
      spread: 90,
      origin: { y: 0.6 },
    });
  }

  /* ------------- utility: safe parse ------------- */
  function safeParseJSON(raw) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return raw;
    }
  }

  /* ------------- First-time login / welcome logic ------------- */
  // If username exists in storage -> don't show welcome (unless you want)
  const storedUsername = safeParseJSON(localStorage.getItem("username"));

  // Show welcome modal only when username is missing.
  if (storedUsername && String(storedUsername).trim().length > 0) {
    // user exists — keep welcome hidden
    if (modalWelcome) modalWelcome.classList.remove("active");
    console.log("Welcome back:", storedUsername);
  } else {
    // Show welcome modal for new users (modal markup should be visible when .active present)
    if (modalWelcome) modalWelcome.classList.add("active");
  }

  // Attach username button handler (only if element exists)
  if (usernameButton) {
    usernameButton.addEventListener("click", () => {
      const username = ((usernameInput && usernameInput.value) || "").trim();
      if (!username) {
        alert("Please enter a valid name");
        return;
      }

      // Save username
      localStorage.setItem("username", JSON.stringify(username));

      // Show Toastify welcome (first time)
      showToast(`Welcome ${username} to TaskPro 🎉`, {
        duration: 3000,
        bgColor: "#0b9444",
      });

      // Hide welcome modal
      if (modalWelcome) modalWelcome.classList.remove("active");
    });
  }

  /* ------------- Tasks from localStorage on load ------------- */
  if (localStorage.getItem("tasks")) {
    const data = safeParseJSON(localStorage.getItem("tasks")) || {};
    for (const col in data) {
      const columnEl = document.querySelector(`#${col}`);
      if (!columnEl) continue;
      data[col].forEach((t) => {
        addTaskElement(
          t.title,
          t.taskDescription,
          columnEl,
          /*showToastOnCreate=*/ false
        );
      });
    }
  } else {
    // no tasks saved - keep welcome visible only when username missing
    if (!storedUsername && modalWelcome) {
      modalWelcome.classList.add("active");
    } else if (modalWelcome) {
      modalWelcome.classList.remove("active");
    }
  }

  /* ------------- Toast function used elsewhere ------------- */
  function toastNotification(username) {
    showToast(`Welcome ${username} to TaskPro`, {
      duration: 2800,
      bgColor: "#0b9444",
    });
  }

  /* ------------- Drag handlers attachment for existing tasks (delegated later) ------------- */
  // We'll attach drag listeners per created element inside addTaskElement

  /* ------------- create task element ------------- */
  function addTaskElement(title, description, col, showToastOnCreate = true) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", true);

    div.innerHTML = `
      <h2 class="task-title">${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
      <button class="delete-btn">Delete</button>
    `;
    col.appendChild(div);

    // dragstart (use dragstart not drag)
    div.addEventListener("dragstart", (e) => {
      dragElement = div;
      try {
        e.dataTransfer.setData("text/plain", "dragging");
      } catch (_) {}
    });

    // delete using per-element listener (can be changed to delegation)
    const deleteButton = div.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => {
      const con = confirm("Do you want to Delete?");
      if (con) {
        div.remove();
        taskCount();
        updateTasksLocalStorage();
        showToast("Task deleted", { bgColor: "#b72b2b" });
      }
    });

    // optional: show toast on creation
    if (showToastOnCreate) {
      showToast("Task created", { bgColor: "#0b73d4" });
    }

    return div;
  }

  /* ------------- utility: escape HTML ------------- */
  function escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ------------- task counts ------------- */
  function taskCount() {
    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");
      if (count) count.textContent = tasks.length;
    });
  }
  taskCount();

  /* ------------- update localStorage ------------- */
  function updateTasksLocalStorage() {
    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      taskData[col.id] = Array.from(tasks).map((t) => {
        return {
          title: t.querySelector("h2").innerText,
          taskDescription: t.querySelector("p").innerText,
        };
      });
    });
    localStorage.setItem("tasks", JSON.stringify(taskData));
  }

  /* ------------- Column drag/drop ------------- */
  function addDragEventsOnColums(column) {
    column.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    column.addEventListener("dragenter", (e) => {
      e.preventDefault();
      column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", () => {
      column.classList.remove("hover-over");
    });

    column.addEventListener("drop", (e) => {
      e.preventDefault();
      // guard
      if (!dragElement) return;

      // detect previous parent
      const prevParent = dragElement.parentElement;
      const prevParentId = prevParent ? prevParent.id : null;

      column.appendChild(dragElement);
      column.classList.remove("hover-over");

      // update counts + storage
      taskCount();
      updateTasksLocalStorage();

      // If moved to done from other column -> toast + confetti
      if (column.id === "done" && prevParentId !== "done") {
        showToast("Task completed!", { bgColor: "#0b9444" });
        // small delay so toast shows with confetti nicely
        setTimeout(() => burstConfetti(), 120);
      } 

      // reset dragElement
      dragElement = null;
    });
  }

  addDragEventsOnColums(todo);
  addDragEventsOnColums(progress);
  addDragEventsOnColums(done);

  /* ------------- modal open/close and add task ------------- */
  const modalBg = document.querySelector(".bg");
  const addNewTaskBtn = document.querySelector("#add-new-task");

  if (toggleModalButton) {
    toggleModalButton.addEventListener("click", () => {
      if (modalTask) modalTask.classList.toggle("active");
    });
  }
  if (modalBg) {
    modalBg.addEventListener("click", () => {
      if (modalTask) modalTask.classList.toggle("active");
    });
  }

  if (addNewTaskBtn) {
    addNewTaskBtn.addEventListener("click", () => {
      const taskTitle = (
        document.querySelector("#task-title").value || ""
      ).trim();
      const taskDescription = (
        document.querySelector("#task-description").value || ""
      ).trim();

      if (!taskTitle) {
        alert("Please add a task title");
        return;
      }

      addTaskElement(
        taskTitle,
        taskDescription,
        todo,
        /*showToastOnCreate=*/ true
      );
      taskCount();
      updateTasksLocalStorage();

      // keep modal closed after adding
      if (modalTask) modalTask.classList.remove("active");

      // clear inputs
      document.querySelector("#task-title").value = "";
      document.querySelector("#task-description").value = "";
    });
  }

  // keyboard: allow enter on username field to submit
  if (usernameInput && usernameButton) {
    usernameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        usernameButton.click();
      }
    });
  }

  /* ------------- initial taskCount + done ------------- */
  taskCount();
});
