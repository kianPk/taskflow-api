# Changelog

## 1.1.0

- Task `priority`: `low|medium|high` (default `medium`) on create and PATCH
- Optional `dueDate` ISO string
- `GET /api/tasks?status=&priority=` filter across all tasks
- Soft-delete via `DELETE /api/tasks/:id` (`deletedAt`; excluded from lists)
- `npm test` + CI workflow

## 1.0.0

- Projects and tasks REST API
