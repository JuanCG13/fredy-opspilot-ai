# Architecture — OpsPilot AI

## Modules

- `auth`: seeded demo login and future user session support.
- `documents`: upload, list, inspect, delete documents.
- `chunking`: split extracted text into retrievable chunks.
- `retrieval`: embeddings and top-k source retrieval.
- `workflow_templates`: registry for refund triage, lead qualification, policy Q&A.
- `workflow_runs`: execution orchestration and retry support.
- `approvals`: edit, approve, reject proposed actions.
- `run_events`: append-only operational log.
- `ai_provider`: OpenAI-compatible abstraction with mock fallback.
- `costing`: token and cost estimate per run.

## API contract target

Auth:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Documents:

- `POST /documents/upload`
- `GET /documents`
- `GET /documents/{id}`
- `DELETE /documents/{id}`

Workflows:

- `GET /workflow-templates`
- `GET /workflow-runs`
- `GET /workflow-runs/{id}`
- `POST /workflow-runs/{id}/retry`

Intake:

- `POST /intake/{workflow_template_id}`
- `POST /intake/demo`

Approvals:

- `GET /approvals/pending`
- `POST /approvals/{id}/approve`
- `POST /approvals/{id}/reject`
- `POST /approvals/{id}/edit`

Logs:

- `GET /workflow-runs/{id}/events`
- `GET /workflow-runs/{id}/context`
