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

app.get("/health", (_req, res) => res.json({ ok: true, service: "taskflow-api" }));

app.get("/api/projects", (_req, res) => {
  const list = [...projects.values()].map((p) => ({
    ...p,
    tasks: [...tasks.values()].filter((t) => t.projectId === p.id)
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
  if (!projects.has(req.params.id)) return res.status(404).json({ ok: false, error: "project not found" });
  const title = String(req.body?.title || "").trim();
  if (!title) return res.status(400).json({ ok: false, error: "title required" });
  const id = String(tSeq++);
  const task = {
    id,
    projectId: req.params.id,
    title,
    status: "todo",
    createdAt: new Date().toISOString()
  };
  tasks.set(id, task);
  res.status(201).json({ ok: true, data: task });
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.get(req.params.id);
  if (!task) return res.status(404).json({ ok: false, error: "task not found" });
  const status = req.body?.status;
  if (status && !["todo", "doing", "done"].includes(status)) {
    return res.status(400).json({ ok: false, error: "invalid status" });
  }
  if (typeof req.body?.title === "string") task.title = req.body.title.trim() || task.title;
  if (status) task.status = status;
  tasks.set(task.id, task);
  res.json({ ok: true, data: task });
});

app.listen(PORT, () => console.log(`taskflow-api on :${PORT}`));
