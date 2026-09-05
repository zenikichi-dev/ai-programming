const STORAGE_KEY = "daily-tasks";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyMessage = document.querySelector("#empty-message");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll(".filter-button");

let tasks = loadTasks();
let currentFilter = "all";

// localStorageからタスクを読み込みます。データがない場合は空の配列を使います。
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  taskList.innerHTML = visibleTasks.map(createTaskMarkup).join("");
  remainingCount.textContent = tasks.filter((task) => !task.completed).length;
  emptyState.hidden = visibleTasks.length > 0;

  if (tasks.length > 0 && visibleTasks.length === 0) {
    emptyTitle.textContent = "このフィルターにタスクはありません";
    emptyMessage.textContent = "別の表示に切り替えて確認してみましょう。";
  } else {
    emptyTitle.textContent = "タスクはまだありません";
    emptyMessage.textContent = "上の入力欄から、今日やることを追加しましょう。";
  }
}

function createTaskMarkup(task) {
  const completedClass = task.completed ? " is-completed" : "";
  const checked = task.completed ? " checked" : "";
  return `
    <li class="task-item${completedClass}" data-id="${task.id}">
      <input class="task-check" type="checkbox"${checked} aria-label="${escapeHtml(task.text)}を完了にする">
      <span class="task-text">${escapeHtml(task.text)}</span>
      <div class="task-actions">
        <button class="icon-button edit" type="button" aria-label="${escapeHtml(task.text)}を編集">✎</button>
        <button class="icon-button delete" type="button" aria-label="${escapeHtml(task.text)}を削除">×</button>
      </div>
    </li>`;
}

function escapeHtml(text) {
  return text.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function addTask(text) {
  tasks.unshift({ id: Date.now().toString(), text, completed: false });
  saveTasks();
  renderTasks();
}

function updateTask(id, updates) {
  tasks = tasks.map((task) => task.id === id ? { ...task, ...updates } : task);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

taskList.addEventListener("change", (event) => {
  if (!event.target.classList.contains("task-check")) return;
  const taskItem = event.target.closest(".task-item");
  updateTask(taskItem.dataset.id, { completed: event.target.checked });
});

taskList.addEventListener("click", (event) => {
  const taskItem = event.target.closest(".task-item");
  if (!taskItem) return;
  const taskId = taskItem.dataset.id;

  if (event.target.classList.contains("delete")) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
  }

  if (event.target.classList.contains("edit")) {
    startEditing(taskItem, taskId);
  }
});

function startEditing(taskItem, taskId) {
  const task = tasks.find((item) => item.id === taskId);
  const textElement = taskItem.querySelector(".task-text");
  const actions = taskItem.querySelector(".task-actions");
  const input = document.createElement("input");
  input.className = "edit-input";
  input.value = task.text;
  input.maxLength = 100;
  textElement.replaceWith(input);
  actions.innerHTML = '<button class="icon-button save" type="button" aria-label="変更を保存">✓</button><button class="icon-button cancel" type="button" aria-label="編集をキャンセル">↩</button>';
  input.focus();

  const finishEditing = (save) => {
    const nextText = input.value.trim();
    if (save && nextText) updateTask(taskId, { text: nextText });
    else renderTasks();
  };
  actions.querySelector(".save").addEventListener("click", () => finishEditing(true));
  actions.querySelector(".cancel").addEventListener("click", () => finishEditing(false));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") finishEditing(true);
    if (event.key === "Escape") finishEditing(false);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

const today = new Date();
document.querySelector("#today-date").innerHTML = `<strong>${today.toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}</strong>${today.toLocaleDateString("ja-JP", { weekday: "long" })}`;
renderTasks();