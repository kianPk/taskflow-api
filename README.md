# Taskflow API

REST API for **projects & tasks** — backend for [`vue-task-board`](https://github.com/kianPk/vue-task-board).

[![Node](https://img.shields.io/badge/node-express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Board UI](https://img.shields.io/badge/ui-vue--task--board-42b883?style=flat-square&logo=vue.js&logoColor=white)](https://github.com/kianPk/vue-task-board)
[![License: MIT](https://img.shields.io/badge/license-MIT-0f1a22?style=flat-square)](./LICENSE)

## Features

- Projects with nested tasks
- Task priority (`low|medium|high`) and optional `dueDate`
- Filter tasks with `GET /api/tasks?status=&priority=`
- Soft-delete tasks (`deletedAt`)

## Quick start

```bash
npm i && npm run dev
# http://localhost:4100
```

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/projects` | list + nested tasks (excludes soft-deleted) |
| POST | `/api/projects` | `{ "title" }` |
| POST | `/api/projects/:id/tasks` | `{ "title", "priority?", "dueDate?" }` |
| GET | `/api/tasks` | `?status=&priority=` across all tasks |
| PATCH | `/api/tasks/:id` | `{ "status?", "title?", "priority?", "dueDate?" }` |
| DELETE | `/api/tasks/:id` | soft-delete (`deletedAt`) |

Pair with the live board demo: https://kianpk.github.io/vue-task-board/

MIT · [@kianPk](https://github.com/kianPk)
