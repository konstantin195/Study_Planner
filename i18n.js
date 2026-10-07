"use strict";

// Interface text lives here. Tasks written by the user are never translated.
const LANGUAGE_KEY = "ucheben-ritam.language.v1";
const translations = {
  en: {
    pageTitle: "Study Rhythm — task planner", description: "A local study planner with subjects, deadlines and priorities.",
    brand: "Study Rhythm", tagline: "It all starts with one task.", language: "Language",
    heading: "Tasks", subtitle: "Organize your tasks. Make time for yourself.",
    darkMode: "Dark mode", lightMode: "Light mode", themeToggle: "Dark mode", themeFailed: "Your theme choice could not be saved for the next visit.",
    summary: "Summary of all tasks", activeCount: "active", todayCount: "due today", doneCount: "completed",
    taskList: "Task list", searchLabel: "Search tasks or subjects", searchPlaceholder: "Search tasks…",
    statusFilter: "Task status", all: "All", active: "Active", done: "Completed", today: "Today", overdue: "Overdue",
    subjectFilter: "Filter by subject", allSubjects: "All subjects", sort: "Sort tasks",
    sortDate: "By deadline", sortPriority: "By priority", sortNewest: "Newest first",
    emptyTitle: "No tasks yet", emptyText: "Add a task using the form.",
    noMatches: "No matching tasks", noMatchesText: "Try another subject, status or search term.",
    examples: "Load sample tasks", clearFilters: "Clear filters", results: "Showing {shown} of {total} tasks",
    newTask: "New task", editTask: "Edit task", task: "Task", subject: "Subject", deadline: "Deadline", priority: "Priority",
    taskPlaceholder: "e.g. Prepare a presentation…", subjectPlaceholder: "e.g. Computer Science",
    medium: "Medium", high: "High", low: "Low", add: "Add task", save: "Save changes", cancelEdit: "Cancel editing",
    edit: "Edit", delete: "Delete", undo: "Restore", cancel: "Cancel", deleteTitle: "Delete task", confirmDelete: "Delete task",
    deleteDescription: "Delete “{title}”? You can restore it until your next change or page reload.",
    completedLabel: "Completed: {title}", editLabel: "Edit: {title}", deleteLabel: "Delete: {title}",
    localOnly: "Saved only in this browser.", privacy: "No account. No sync. Your study rhythm.",
    added: "Task added.", edited: "Task updated.", completed: "Task completed.", reopened: "Task marked active again.",
    editCancelled: "Editing cancelled.", deleted: "Task deleted.", restored: "Task restored.",
    examplesLoaded: "Loaded 4 sample tasks. You can edit or delete them.", unsaved: "The change was not saved.",
    textRequired: "{field}: enter text, not just spaces.", textTooLong: "{field}: use no more than {max} characters.",
    dateRequired: "Deadline: enter a valid date from 1900 onwards.", priorityRequired: "Choose a valid priority.",
    storageBlocked: "Browser storage is blocked. Changes will last only until you close or reload the page.",
    storageDamaged: "Saved data is damaged and will not be overwritten. New changes will not be saved. For a fresh start, use another browser profile or clear this page’s data in your browser settings.",
    storageFailed: "The change is displayed but not saved. Storage is full or blocked. Copy important tasks before reloading.",
    languageFailed: "Your language choice could not be saved. This session uses your choice; the next visit may start in English.",
    subjectSuggestions: ["Computer Science", "Mathematics", "Bulgarian", "English", "History", "Biology"],
    sampleTasks: [["JavaScript exercises", "Computer Science"], ["Prepare for the test", "Mathematics"], ["Read the short story", "Bulgarian"], ["Presentation about nature", "Biology"]]
  },
  bg: {
    pageTitle: "Учебен ритъм — планер за задачи", description: "Локален планер за учебни задачи с предмети, срокове и приоритети.",
    brand: "Учебен ритъм", tagline: "Всичко започва с една задача.", language: "Език",
    heading: "Задачи", subtitle: "Подреди задачите. Освободи време за себе си.",
    darkMode: "Тъмен режим", lightMode: "Светъл режим", themeToggle: "Тъмен режим", themeFailed: "Избраният режим не можа да се запази за следващото отваряне.",
    summary: "Обобщение на всички задачи", activeCount: "активни", todayCount: "за днес", doneCount: "завършени",
    taskList: "Списък със задачи", searchLabel: "Търси задача или предмет", searchPlaceholder: "Търси задача…",
    statusFilter: "Статус на задачите", all: "Всички", active: "Активни", done: "Завършени", today: "Днес", overdue: "Просрочена",
    subjectFilter: "Филтър по предмет", allSubjects: "Всички предмети", sort: "Подреждане",
    sortDate: "По краен срок", sortPriority: "По приоритет", sortNewest: "Най-нови първо",
    emptyTitle: "Все още няма задачи", emptyText: "Добави задача от формата.",
    noMatches: "Няма съвпадащи задачи", noMatchesText: "Опитай друг предмет, статус или дума за търсене.",
    examples: "Зареди примерни задачи", clearFilters: "Изчисти филтрите", results: "Показани: {shown} от {total} задачи",
    newTask: "Нова задача", editTask: "Редакция на задача", task: "Задача", subject: "Предмет", deadline: "Краен срок", priority: "Приоритет",
    taskPlaceholder: "Напр. Подготви презентация…", subjectPlaceholder: "Напр. Информатика",
    medium: "Среден", high: "Висок", low: "Нисък", add: "Добави задача", save: "Запази промените", cancelEdit: "Откажи редакцията",
    edit: "Редактирай", delete: "Изтрий", undo: "Възстанови", cancel: "Откажи", deleteTitle: "Изтриване на задача", confirmDelete: "Изтрий задачата",
    deleteDescription: "Да изтрия ли „{title}“? Можеш да я възстановиш до следващата промяна или презареждане.",
    completedLabel: "Завършена: {title}", editLabel: "Редактирай: {title}", deleteLabel: "Изтрий: {title}",
    localOnly: "Запазва се само в този браузър.", privacy: "Без акаунт. Без синхронизация. Твоят учебен ритъм.",
    added: "Задачата е добавена.", edited: "Задачата е обновена.", completed: "Задачата е завършена.", reopened: "Задачата отново е активна.",
    editCancelled: "Редакцията е отказана.", deleted: "Задачата е изтрита.", restored: "Задачата е възстановена.",
    examplesLoaded: "Заредени са 4 примерни задачи. Можеш да ги редактираш или изтриеш.", unsaved: "Промяната не е запазена.",
    textRequired: "{field}: въведи текст, а не само интервали.", textTooLong: "{field}: въведи не повече от {max} знака.",
    dateRequired: "Краен срок: въведи валидна дата от 1900 г. нататък.", priorityRequired: "Избери валиден приоритет.",
    storageBlocked: "Браузърът блокира запазването. Промените ще останат само до затваряне или презареждане на страницата.",
    storageDamaged: "Запазените данни са повредени и няма да бъдат презаписани. Новите промени няма да се запазят. За чисто начало използвай друг браузърен профил или изчисти данните на тази страница от настройките на браузъра.",
    storageFailed: "Промяната е показана, но не е запазена. Паметта е пълна или запазването е блокирано. Препиши важните задачи, преди да презаредиш.",
    languageFailed: "Избраният език не можа да се запази. Той важи за тази сесия, но следващото отваряне може да започне на английски.",
    subjectSuggestions: ["Информатика", "Математика", "Български език", "Английски език", "История", "Биология"],
    sampleTasks: [["Упражнения по JavaScript", "Информатика"], ["Подготовка за контролно", "Математика"], ["Прочети разказа", "Български език"], ["Презентация за природата", "Биология"]]
  }
};

// English is the default, regardless of the browser's language.
let language = "en";
let languageStorageFailed = false;
try {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  if (savedLanguage === "en" || savedLanguage === "bg") language = savedLanguage;
} catch { languageStorageFailed = true; }

function t(key, values = {}) {
  return translations[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}
