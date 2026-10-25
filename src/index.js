import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT || 4100);
app.use(cors());
app.use(express.json());

const projects = new Map();
const tasks = new Map();
let pSeq = 1;
let tSeq = 1;

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["todo", "doing", "done"];

function activeTasks() {
  return [...tasks.values()].filter((t) => !t.deletedAt);
}

function parsePriority(value, fallback = "medium") {
  if (value == null || value === "") return fallback;
  const p = String(value).toLowerCase();
  if (!PRIORITIES.includes(p)) return null;
  return p;
}

function parseDueDate(value) {
  if (value == null || value === "") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined; // invalid
  return d.toISOString();
}

app.get("/health", (_req, res) => res.json({ ok: true, service: "taskflow-api" }));

app.get("/api/projects", (_req, res) => {
  const list = [...projects.values()].map((p) => ({
    ...p,
    tasks: activeTasks().filter((t) => t.projectId === p.id)
  }));
  res.json({ ok: true, data: list });
});

app.post("/api/projects", (req, res) => {
  const title = String(req.body?.title || "").trim();
  if (!title) return res.status(400).json({ ok: false, error: "title required" });
  const id = String(pSeq++);
  const project = { id, title, createdAt: new Date().toISOString() };
  projects.set(id, project);
  res.status(201).json({ ok: true, data: project });
});

app.post("/api/projects/:id/tasks", (req, res) => {
  if (!projects.has(req.params.id)) {
    return res.status(404).json({ ok: false, error: "project not found" });
  }
  const title = String(req.body?.title || "").trim();
  if (!title) return res.status(400).json({ ok: false, error: "title required" });

  const priority = parsePriority(req.body?.priority, "medium");
  if (priority == null) {
    return res.status(400).json({ ok: false, error: "priority must be low|medium|high" });
  }

  const dueDate = parseDueDate(req.body?.dueDate);
  if (dueDate === undefined) {
    return res.status(400).json({ ok: false, error: "dueDate must be ISO string" });
  }

  const id = String(tSeq++);
  const task = {
    id,
    projectId: req.params.id,
    title,
    status: "todo",
    priority,
    dueDate,
    deletedAt: null,
    createdAt: new Date().toISOString()
  };
  tasks.set(id, task);
  res.status(201).json({ ok: true, data: task });
});

app.get("/api/tasks", (req, res) => {
  let list = activeTasks();
  const { status, priority } = req.query;
  if (status) {
    if (!STATUSES.includes(String(status))) {
      return res.status(400).json({ ok: false, error: "invalid status filter" });
    }
    list = list.filter((t) => t.status === status);
  }
  if (priority) {
    if (!PRIORITIES.includes(String(priority))) {
      return res.status(400).json({ ok: false, error: "invalid priority filter" });
    }
    list = list.filter((t) => t.priority === priority);
  }
  res.json({ ok: true, data: list });
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task || task.deletedAt) {
    return res.status(404).json({ ok: false, error: "task not found" });
  }
  const status = req.body?.status;
  if (status && !STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: "invalid status" });
  }
  if (typeof req.body?.title === "string") {
    task.title = req.body.title.trim() || task.title;
  }
  if (status) task.status = status;

  if (req.body?.priority !== undefined) {
    const priority = parsePriority(req.body.priority, null);
    if (priority == null) {
      return res.status(400).json({ ok: false, error: "priority must be low|medium|high" });
    }
    task.priority = priority;
  }

  if (req.body?.dueDate !== undefined) {
    if (req.body.dueDate === null || req.body.dueDate === "") {
      task.dueDate = null;
    } else {
      const dueDate = parseDueDate(req.body.dueDate);
      if (dueDate === undefined) {
        return res.status(400).json({ ok: false, error: "dueDate must be ISO string" });
      }
      task.dueDate = dueDate;
    }
  }

  tasks.set(task.id, task);
  res.json({ ok: true, data: task });
});

app.delete("/api/tasks/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task || task.deletedAt) {
    return res.status(404).json({ ok: false, error: "task not found" });
  }
  task.deletedAt = new Date().toISOString();
  tasks.set(task.id, task);
  res.json({ ok: true, data: task });
});

app.listen(PORT, () => console.log(`taskflow-api on :${PORT}`));
