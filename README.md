# Taskflow API

Minimal **project / task** REST API for Vue frontends.

```
POST   /api/projects
GET    /api/projects
POST   /api/projects/:id/tasks
PATCH  /api/tasks/:id   { status: "todo"|"doing"|"done" }
```

In-memory store — swap for Postgres/Mongo when you harden it.

```bash
npm i && npm run dev
```

MIT · [@kianPk](https://github.com/kianPk)
