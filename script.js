const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");
const filterButtons = [...document.querySelectorAll(".filter")];
let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem("student-todo-tasks") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}
function saveTasks() {
  localStorage.setItem("student-todo-tasks", JSON.stringify(tasks));
}
function renderTasks() {
  taskList.replaceChildren();
  const visible = tasks.filter(task => currentFilter === "all" ||
    (currentFilter === "active" && !task.completed) ||
    (currentFilter === "completed" && task.completed));
  visible.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.completed ? "active" : "completed"}`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked; saveTasks(); renderTasks();
    });
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    const del = document.createElement("button");
    del.className = "delete"; del.type = "button"; del.textContent = "×";
    del.setAttribute("aria-label", `Delete task: ${task.text}`);
    del.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id); saveTasks(); renderTasks();
    });
    item.append(checkbox, text, del);
    taskList.append(item);
  });
  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
  emptyState.hidden = visible.length > 0;
  emptyState.textContent = tasks.length === 0 ? "✨ Your list is clear. Add your first task!" : "No tasks in this filter. Try another one.";
}
function updateFilters() {
  filterButtons.forEach(button => {
    const selected = button.dataset.filter === currentFilter;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), text, completed:false});
  saveTasks(); input.value = ""; currentFilter = "all"; updateFilters(); renderTasks(); input.focus();
});
filterButtons.forEach(button => button.addEventListener("click", () => {
  currentFilter = button.dataset.filter; updateFilters(); renderTasks();
}));
clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed); saveTasks(); renderTasks();
});
renderTasks();
