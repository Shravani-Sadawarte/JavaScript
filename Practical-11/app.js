
import {
  parseDuration,
  formatDuration,
  formatActualTime,
  startClock
} from "./timer.js";

const SCHEDULE_KEY = "classScheduler_schedule_v2";
const HISTORY_KEY = "classScheduler_history_v2";

const $ = id => document.getElementById(id);

function loadData(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let schedule = loadData(SCHEDULE_KEY);
let history = loadData(HISTORY_KEY);

let selectedId = null;
let activeId = null;
let remainingSeconds = 0;
let plannedSeconds = 0;
let elapsedBeforeRun = 0;
let runStartedAt = null;
let sessionStartedAt = null;
let intervalId = null;
let running = false;
let paused = false;
let completedCount = 0;

function saveData() {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function dateTime(timestamp) {
  if (!timestamp) return "—";

  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function timeOnly(timestamp) {
  if (!timestamp) return "—";

  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function elapsedNow() {
  if (!running || runStartedAt === null) {
    return elapsedBeforeRun;
  }

  return elapsedBeforeRun + (Date.now() - runStartedAt) / 1000;
}

function getSelected() {
  return schedule.find(item => item.id === selectedId);
}

function getActive() {
  return schedule.find(item => item.id === activeId);
}

function addMessage(element, message) {
  $(element).textContent = message;
}

// Add many subjects at once.
// Supported lines: Mathematics, 45 or Physics, 1:00:00
$("addBulkBtn").addEventListener("click", () => {
  const lines = $("bulkInput").value.split(/\r?\n/);
  const newClasses = [];
  const errors = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const comma = trimmed.lastIndexOf(",");
    if (comma === -1) {
      errors.push(`Line ${index + 1}: use Subject, duration`);
      return;
    }

    const name = trimmed.slice(0, comma).trim();
    const durationText = trimmed.slice(comma + 1).trim();
    const duration = parseDuration(durationText);

    if (!name || !duration) {
      errors.push(`Line ${index + 1}: invalid subject or duration`);
      return;
    }

    newClasses.push({
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      duration,
      completed: false
    });
  });

  if (newClasses.length === 0) {
    addMessage(
      "bulkMessage",
      errors.length ? errors.join(" | ") : "Enter at least one class first."
    );
    return;
  }

  schedule.push(...newClasses);

  if (!selectedId) selectedId = newClasses[0].id;

  saveData();
  renderSchedule();
  renderStats();

  $("bulkInput").value = "";
  addMessage(
    "bulkMessage",
    `Added ${newClasses.length} class(es).` +
      (errors.length ? ` Skipped: ${errors.join(" | ")}` : "")
  );
});

$("clearInputBtn").addEventListener("click", () => {
  $("bulkInput").value = "";
  addMessage("bulkMessage", "");
});

// Render the upcoming classes.
function renderSchedule() {
  const container = $("scheduleList");
  container.replaceChildren();

  $("queueCount").textContent = `${schedule.length} CLASSES`;

  if (schedule.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-list";
    empty.textContent = "No classes yet. Add your timetable above.";
    container.append(empty);
    return;
  }

  schedule.forEach(item => {
    const row = document.createElement("div");
    row.className = "schedule-item";

    if (item.id === selectedId) row.classList.add("selected");
    if (item.completed) row.classList.add("done");

    const selectButton = document.createElement("button");
    selectButton.className = "subject-select";
    selectButton.type = "button";

    const title = document.createElement("strong");
    title.textContent = `${item.completed ? "✓ " : ""}${item.name}`;

    const subtitle = document.createElement("small");
    subtitle.textContent =
      `${formatDuration(item.duration)} planned` +
      (item.id === activeId ? " · Current session" : "") +
      (item.completed ? " · Completed" : "");

    selectButton.append(title, subtitle);
    selectButton.addEventListener("click", () => selectClass(item.id));

    row.append(selectButton);

    const remove = document.createElement("button");
    remove.className = "remove-class";
    remove.type = "button";
    remove.textContent = "×";
    remove.title = "Remove class";
    remove.setAttribute("aria-label", `Remove ${item.name}`);
    remove.disabled = item.id === activeId;

    remove.addEventListener("click", () => {
      schedule = schedule.filter(entry => entry.id !== item.id);

      if (selectedId === item.id) selectedId = null;

      if (!selectedId && schedule.length) {
        selectedId = schedule[0].id;
      }

      saveData();
      renderSchedule();
      renderStats();
      renderTimer();
    });

    row.append(remove);
    container.append(row);
  });
}

function selectClass(id) {
  if (running || paused) {
    addMessage("bulkMessage", "End the current session before selecting another class.");
    return;
  }

  const item = schedule.find(entry => entry.id === id);
  if (!item) return;

  selectedId = id;
  remainingSeconds = item.duration;
  plannedSeconds = item.duration;
  elapsedBeforeRun = 0;
  activeId = null;
  sessionStartedAt = null;

  $("celebration").hidden = true;
  $("timerStatus").textContent = "Ready when you are";

  renderSchedule();
  renderTimer();
}

function renderTimer() {
  const item = getActive() || getSelected();

  $("currentSubject").textContent = item ? item.name : "Choose a class";
  $("timerDisplay").textContent = formatDuration(remainingSeconds);

  const elapsed = elapsedNow();
  const progress = plannedSeconds > 0
    ? Math.min(100, elapsed / plannedSeconds * 100)
    : 0;

  $("timerProgress").style.width = `${progress}%`;

  $("startBtn").disabled = running || schedule.length === 0 ||
    (!paused && !getSelected());

  $("pauseBtn").disabled = !running;
  $("stopBtn").disabled = !activeId || (!running && !paused);

  if (running) {
    $("timerStatus").textContent = "Session in progress";
  } else if (paused) {
    $("timerStatus").textContent = "Paused";
  }
}

function renderStats() {
  $("totalClasses").textContent = schedule.length;

  const completed = history.filter(item => item.status === "Completed");
  $("completedCount").textContent = completed.length;

  const actualSeconds = history.reduce(
    (sum, item) => sum + item.actualSeconds, 0
  );

  $("totalStudyTime").textContent = formatActualTime(actualSeconds);
}

function startSession() {
  if (running) return;

  // Resume a paused session without resetting its elapsed time.
  if (paused && activeId) {
    running = true;
    paused = false;
    runStartedAt = Date.now();
    $("timerStatus").textContent = "Session in progress";
    intervalId = startClock(tick);
    renderTimer();
    return;
  }

  const item = getSelected();
  if (!item) {
    addMessage("bulkMessage", "Add or select a class first.");
    return;
  }

  if (item.completed) {
    addMessage("bulkMessage", "This class is already completed. Choose another class.");
    return;
  }

  activeId = item.id;
  selectedId = item.id;
  plannedSeconds = item.duration;
  remainingSeconds = item.duration;
  elapsedBeforeRun = 0;
  runStartedAt = Date.now();
  sessionStartedAt = Date.now();
  running = true;
  paused = false;

  $("celebration").hidden = true;
  $("timerStatus").textContent = "Session in progress";

  intervalId = startClock(tick);
  renderSchedule();
  renderTimer();
}

function tick() {
  if (!running) return;

  const elapsed = elapsedNow();
  remainingSeconds = Math.max(0, Math.ceil(plannedSeconds - elapsed));

  renderTimer();

  if (remainingSeconds <= 0) {
    finishSession("Completed", true);
  }
}

function pauseSession() {
  if (!running) return;

  elapsedBeforeRun = elapsedNow();
  runStartedAt = null;
  remainingSeconds = Math.max(
    0, Math.ceil(plannedSeconds - elapsedBeforeRun)
  );

  running = false;
  paused = true;

  clearInterval(intervalId);
  intervalId = null;

  $("timerStatus").textContent = "Paused — take a breath";
  renderTimer();
}

function stopSession() {
  if (!activeId) return;

  const elapsed = elapsedNow();

  if (elapsed <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    running = false;
    paused = false;
    activeId = null;
    runStartedAt = null;
    elapsedBeforeRun = 0;
    sessionStartedAt = null;

    const item = getSelected();
    remainingSeconds = item ? item.duration : 0;
    plannedSeconds = remainingSeconds;

    $("timerStatus").textContent = "Session cancelled";
    renderTimer();
    return;
  }

  finishSession("Stopped early", false);
}

function finishSession(status, wasCompleted) {
  const item = getActive();
  if (!item) return;

  const endTime = Date.now();
  const actualSeconds = Math.max(0, Math.floor(elapsedNow()));

  clearInterval(intervalId);
  intervalId = null;

  history.unshift({
    id: `${endTime}-${Math.random().toString(36).slice(2, 7)}`,
    subject: item.name,
    date: new Date(sessionStartedAt || endTime).toISOString().slice(0, 10),
    startedAt: sessionStartedAt,
    endedAt: endTime,
    plannedSeconds,
    actualSeconds,
    status
  });

  if (wasCompleted) {
    item.completed = true;
    completedCount++;
  }

  running = false;
  paused = false;
  activeId = null;
  runStartedAt = null;
  elapsedBeforeRun = actualSeconds;
  sessionStartedAt = null;

  if (wasCompleted) {
    remainingSeconds = 0;
    $("timerStatus").textContent = "Completed successfully!";
    $("celebrationMessage").textContent =
      `${item.name} lasted ${formatActualTime(actualSeconds)}. Great work!`;
    $("celebration").hidden = false;
    launchFireworks();
  } else {
    remainingSeconds = Math.max(
      0, Math.ceil(plannedSeconds - actualSeconds)
    );
    $("timerStatus").textContent = "Session recorded";
    $("celebration").hidden = true;
  }

  saveData();
  renderSchedule();
  renderHistory();
  renderStats();
  renderTimer();

  if (wasCompleted) {
    // Select the next unfinished class for convenience.
    const next = schedule.find(entry => !entry.completed);
    if (next) {
      selectedId = next.id;
    }
    renderSchedule();
  }
}

$("startBtn").addEventListener("click", startSession);
$("pauseBtn").addEventListener("click", pauseSession);
$("stopBtn").addEventListener("click", stopSession);

$("startNextBtn").addEventListener("click", () => {
  if (running || paused) {
    addMessage("bulkMessage", "Finish the current session first.");
    return;
  }

  const next = schedule.find(item => !item.completed);

  if (!next) {
    addMessage("bulkMessage", "All scheduled classes are completed!");
    return;
  }

  selectClass(next.id);
  startSession();
});

$("clearScheduleBtn").addEventListener("click", () => {
  if (running || paused) {
    addMessage("bulkMessage", "End the active session before clearing the schedule.");
    return;
  }

  if (!confirm("Clear all scheduled classes? Session history will be preserved.")) {
    return;
  }

  schedule = [];
  selectedId = null;
  remainingSeconds = 0;
  plannedSeconds = 0;

  saveData();
  renderSchedule();
  renderStats();
  renderTimer();
});

function renderHistory() {
  const tbody = $("historyList");
  tbody.replaceChildren();

  if (history.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 7;
    cell.textContent = "Your completed and stopped sessions will appear here.";
    row.append(cell);
    tbody.append(row);
  } else {
    history.forEach(item => {
      const row = document.createElement("tr");

      const values = [
        item.subject,
        item.date,
        timeOnly(item.startedAt),
        timeOnly(item.endedAt),
        formatDuration(item.plannedSeconds),
        formatActualTime(item.actualSeconds)
      ];

      values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });

      const statusCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = "status " +
        (item.status === "Completed" ? "completed" : "stopped");
      badge.textContent = item.status;
      statusCell.append(badge);
      row.append(statusCell);

      tbody.append(row);
    });
  }

  $("historyCount").textContent = history.length;

  const total = history.reduce(
    (sum, item) => sum + item.actualSeconds, 0
  );

  $("historyDuration").textContent = formatActualTime(total);
}

$("clearHistoryBtn").addEventListener("click", () => {
  if (history.length === 0) return;

  if (!confirm("Delete all session history? This cannot be undone.")) {
    return;
  }

  history = [];
  saveData();
  renderHistory();
  renderStats();
  addMessage("historyMessage", "Session history cleared.");
});

// Live canvas fireworks for completed sessions.
const canvas = $("fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId = null;
let fireworksUntil = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burst(x, y) {
  const colors = [
    "#ff4d6d", "#ffd166", "#06d6a0",
    "#4cc9f0", "#a78bfa", "#ff8c42", "#ffffff"
  ];

  const count = 75;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 5;

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60 + Math.random() * 35,
      maxLife: 95,
      size: 1.5 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function launchFireworks() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  burst(width * (0.2 + Math.random() * 0.2), height * 0.3);
  burst(width * (0.6 + Math.random() * 0.2), height * 0.25);
  burst(width * 0.5, height * 0.45);

  fireworksUntil = Date.now() + 4500;

  if (animationId === null) {
    animateFireworks();
  }
}

function animateFireworks() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (Date.now() < fireworksUntil && Math.random() < 0.07) {
    burst(
      window.innerWidth * (0.1 + Math.random() * 0.8),
      window.innerHeight * (0.12 + Math.random() * 0.42)
    );
  }

  particles = particles.filter(particle => particle.life > 0);

  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.985;
    particle.vy = particle.vy * 0.985 + 0.035;
    particle.life--;

    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  if (Date.now() < fireworksUntil || particles.length > 0) {
    animationId = requestAnimationFrame(animateFireworks);
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    animationId = null;
  }
}

// Initial page render.
const initial = schedule.find(item => !item.completed) || schedule[0];

if (initial) {
  selectedId = initial.id;
  remainingSeconds = initial.duration;
  plannedSeconds = initial.duration;
}

renderSchedule();
renderHistory();
renderStats();
renderTimer();
