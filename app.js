"use strict";

// Всички данни са в един масив. localStorage пази негово JSON копие.
const STORAGE_KEY = "ucheben-ritam.tasks.v1";
const $ = (id) => document.getElementById(id);
const priorityOrder = { high: 0, medium: 1, low: 2 };
let tasks = [];
let editingId = null;
let pendingDeleteId = null;
let deletedTask = null;
let filter = "all";
let storageDamaged = false;
let storageErrorKey = "";
let messageState = null;
let validationShown = false;

// Change text only: keep tasks, filters, drafts, edit IDs and undo state intact.
function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]').content = t("description");
  document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria]").forEach(element => { element.setAttribute("aria-label", t(element.dataset.i18nAria)); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-language]").forEach(button => { button.setAttribute("aria-pressed", String(button.dataset.language === language)); });
  $("subjects").replaceChildren(...translations[language].subjectSuggestions.map(subject => new Option(subject, subject)));
  updateFormLabels();
  if (validationShown) validateForm();
  if (storageErrorKey) $("storage-error").textContent = t(storageErrorKey);
  $("language-error").hidden = !languageStorageFailed;
  $("language-error").textContent = t("languageFailed");
  displayMessage();
  updateDeleteDescription();
  render();
}

function updateFormLabels() {
  $("form-title").textContent = t(editingId ? "editTask" : "newTask");
  $("submit").textContent = t(editingId ? "save" : "add");
}

function updateDeleteDescription() {
  const task = tasks.find(task => task.id === pendingDeleteId);
  if (task) $("delete-description").textContent = t("deleteDescription", { title: task.title });
}

// Own validation messages follow the selected language, not the browser locale.
function validateForm() {
  let firstInvalid = null;
  const errors = [];
  for (const id of ["title", "subject", "due", "priority"]) {
    const field = $(id);
    let error = "";
    if (id === "title" || id === "subject") {
      if (!field.value.trim()) error = t("textRequired", { field: t(id === "title" ? "task" : "subject") });
      else if (field.value.length > field.maxLength) error = t("textTooLong", { field: t(id === "title" ? "task" : "subject"), max: field.maxLength });
    } else if (id === "due" && !validDate(field.value)) error = t("dateRequired");
    else if (id === "priority" && !Object.hasOwn(priorityOrder, field.value)) error = t("priorityRequired");
    field.setCustomValidity(error);
    field.setAttribute("aria-invalid", String(Boolean(error)));
    if (error) { errors.push(error); firstInvalid ||= field; }
  }
  $("form-error").textContent = errors.join(" ");
  $("form-error").hidden = errors.length === 0;
  return firstInvalid;
}

// Локалната дата не използва UTC, за да няма изместване около полунощ.
function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "1900-01-01") return false;
  const date = new Date(`${value}T12:00:00`);
  return !Number.isNaN(date.getTime()) && dateKey(date) === value;
}

function validTask(task) {
  return task && typeof task.id === "string" && task.id.length > 0 &&
    typeof task.title === "string" && task.title.trim().length > 0 && task.title.length <= 100 &&
    typeof task.subject === "string" && task.subject.trim().length > 0 && task.subject.length <= 40 &&
    typeof task.due === "string" && validDate(task.due) &&
    Object.hasOwn(priorityOrder, task.priority) && typeof task.completed === "boolean" &&
    Number.isFinite(task.createdAt);
}

function storageError(key) {
  storageErrorKey = key;
  $("storage-error").textContent = t(key);
  $("storage-error").hidden = false;
}

function loadTasks() {
  let raw;
  try { raw = localStorage.getItem(STORAGE_KEY); }
  catch {
    storageError("storageBlocked");
    return;
  }
  if (raw === null) return;
  try {
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || !saved.every(validTask) || new Set(saved.map(task => task.id)).size !== saved.length) throw new Error("Invalid tasks");
    tasks = saved;
  } catch {
    storageDamaged = true;
    storageError("storageDamaged");
  }
}

function saveTasks() {
  if (storageDamaged) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    storageErrorKey = "";
    $("storage-error").hidden = true;
    return true;
  } catch {
    storageError("storageFailed");
    return false;
  }
}

function announce(key, unsaved = false) {
  messageState = { key, unsaved };
  displayMessage();
}

function displayMessage() {
  $("message").textContent = messageState ? `${t(messageState.key)}${messageState.unsaved ? ` ${t("unsaved")}` : ""}` : "";
}

function finishChange(text, keepUndo = false) {
  const saved = saveTasks();
  if (!keepUndo) { deletedTask = null; $("undo").hidden = true; }
  render();
  announce(text, !saved);
}

function resetForm() {
  editingId = null;
  $("task-form").reset();
  validationShown = false;
  ["title", "subject", "due", "priority"].forEach(id => { $(id).setCustomValidity(""); $(id).removeAttribute("aria-invalid"); });
  $("form-error").hidden = true;
  updateFormLabels();
  $("cancel-edit").hidden = true;
}

function editTask(task) {
  editingId = task.id;
  ["title", "subject", "due", "priority"].forEach(id => { $(id).value = task[id]; });
  validationShown = false;
  ["title", "subject", "due", "priority"].forEach(id => { $(id).setCustomValidity(""); $(id).removeAttribute("aria-invalid"); });
  $("form-error").hidden = true;
  updateFormLabels();
  $("cancel-edit").hidden = false;
  $("title").focus();
}

function dateLabel(task) {
  const today = dateKey();
  const date = new Date(`${task.due}T12:00:00`).toLocaleDateString(language === "bg" ? "bg-BG" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  const status = task.completed ? "done" : task.due === today ? "today" : task.due < today ? "overdue" : "";
  const suffix = status ? ` · ${t(status)}` : "";
  return `${task.subject} · ${date}${suffix}`;
}

function render() {
  const today = dateKey();
  $("active-count").textContent = tasks.filter(task => !task.completed).length;
  $("today-count").textContent = tasks.filter(task => !task.completed && task.due === today).length;
  $("done-count").textContent = tasks.filter(task => task.completed).length;

  // Предметите във филтъра идват от действително добавените задачи.
  const previousSubject = $("subject-filter").value;
  const subjects = [...new Set(tasks.map(task => task.subject))].sort((a, b) => a.localeCompare(b, language));
  $("subject-filter").replaceChildren(new Option(t("allSubjects"), ""), ...subjects.map(subject => new Option(subject, subject)));
  $("subject-filter").value = subjects.includes(previousSubject) ? previousSubject : "";
  const subject = $("subject-filter").value;
  const query = $("search").value.trim().toLocaleLowerCase("bg");
  const visible = tasks.filter(task => {
    const matchesStatus = filter === "all" || (filter === "done" ? task.completed : !task.completed);
    return matchesStatus && (!subject || task.subject === subject) && `${task.title} ${task.subject}`.toLocaleLowerCase("bg").includes(query);
  });
  visible.sort((a, b) => {
    if ($("sort").value === "newest") return b.createdAt - a.createdAt;
    if ($("sort").value === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority] || a.due.localeCompare(b.due);
    return a.due.localeCompare(b.due) || priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  $("task-list").replaceChildren();
  visible.forEach(task => {
    const row = $("task-template").content.firstElementChild.cloneNode(true);
    row.classList.toggle("completed", task.completed);
    // textContent показва въведения текст буквално, без да изпълнява HTML.
    row.querySelector("h3").textContent = task.title;
    const meta = row.querySelector(".task-meta");
    meta.textContent = dateLabel(task);
    meta.classList.toggle("overdue", !task.completed && task.due < today);
    const badge = row.querySelector(".priority");
    badge.textContent = t(task.priority);
    badge.classList.add(task.priority);
    const checkbox = row.querySelector(".task-check");
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", t("completedLabel", { title: task.title }));
    row.dataset.taskId = task.id;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      finishChange(task.completed ? "completed" : "reopened");
      // След прерисуване пазим удобна позиция за управление с клавиатура.
      const nextRow = Array.from($("task-list").children).find(item => item.dataset.taskId === task.id);
      const next = nextRow?.querySelector(".task-check");
      (next || document.querySelector(`[data-filter="${filter}"]`)).focus();
    });
    row.querySelector(".edit").textContent = t("edit");
    row.querySelector(".delete").textContent = t("delete");
    row.querySelector(".edit").setAttribute("aria-label", t("editLabel", { title: task.title }));
    row.querySelector(".edit").addEventListener("click", () => editTask(task));
    row.querySelector(".delete").setAttribute("aria-label", t("deleteLabel", { title: task.title }));
    row.querySelector(".delete").addEventListener("click", () => {
      pendingDeleteId = task.id;
      updateDeleteDescription();
      $("delete-dialog").showModal();
      $("cancel-delete").focus();
    });
    $("task-list").append(row);
  });
  $("empty").hidden = visible.length > 0;
  const noTasks = tasks.length === 0;
  $("empty-title").textContent = t(noTasks ? "emptyTitle" : "noMatches");
  $("empty-text").textContent = t(noTasks ? "emptyText" : "noMatchesText");
  $("examples").hidden = !noTasks;
  $("reset-filters").hidden = noTasks;
  $("result-count").textContent = tasks.length ? t("results", { shown: visible.length, total: tasks.length }) : "";
}

$("task-form").addEventListener("submit", event => {
  event.preventDefault();
  validationShown = true;
  const invalidField = validateForm();
  if (invalidField) { invalidField.focus(); return; }
  const values = { title: $("title").value.trim(), subject: $("subject").value.trim(), due: $("due").value, priority: $("priority").value };
  const editing = tasks.find(task => task.id === editingId);
  if (editing) Object.assign(editing, values);
  else tasks.push({ ...values, id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`, completed: false, createdAt: Date.now() });
  const message = editing ? "edited" : "added";
  resetForm();
  finishChange(message);
  $("title").focus();
});

["title", "subject", "due", "priority"].forEach(id => $(id).addEventListener("input", () => { if (validationShown) validateForm(); }));
$("cancel-edit").addEventListener("click", () => { resetForm(); announce("editCancelled"); });
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  filter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(tab => tab.setAttribute("aria-pressed", String(tab === button)));
  render();
}));
$("search").addEventListener("input", render);
$("subject-filter").addEventListener("change", render);
$("sort").addEventListener("change", render);
function resetFilters() {
  $("search").value = "";
  $("subject-filter").value = "";
  document.querySelector('[data-filter="all"]').click();
}
$("reset-filters").addEventListener("click", resetFilters);
$("cancel-delete").addEventListener("click", () => $("delete-dialog").close());
$("confirm-delete").addEventListener("click", () => {
  deletedTask = tasks.find(task => task.id === pendingDeleteId);
  tasks = tasks.filter(task => task.id !== pendingDeleteId);
  if (editingId === pendingDeleteId) resetForm();
  $("delete-dialog").close();
  $("undo").hidden = !deletedTask;
  finishChange("deleted", true);
  $("undo").focus();
});
$("undo").addEventListener("click", () => {
  if (!deletedTask) return;
  tasks.push(deletedTask);
  finishChange("restored");
  document.querySelector('[data-filter="all"]').focus();
});
$("examples").addEventListener("click", () => {
  if (tasks.length) return;
  const examples = [
    [...translations[language].sampleTasks[0], 0, "high", false],
    [...translations[language].sampleTasks[1], 2, "medium", false],
    [...translations[language].sampleTasks[2], 3, "low", false],
    [...translations[language].sampleTasks[3], 5, "medium", true]
  ];
  tasks = examples.map(([title, subject, days, priority, completed], index) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return { id: `example-${Date.now()}-${index}`, title, subject, due: dateKey(date), priority, completed, createdAt: Date.now() + index };
  });
  resetFilters();
  finishChange("examplesLoaded");
});

document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
  language = button.dataset.language;
  try { localStorage.setItem(LANGUAGE_KEY, language); languageStorageFailed = false; }
  catch { languageStorageFailed = true; }
  applyLanguage();
}));
loadTasks();
applyLanguage();
// При връщане към отворения планер обновяваме „Днес“ и просрочените срокове.
document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
