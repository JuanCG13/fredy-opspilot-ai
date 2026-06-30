# Proposal assets — OpsPilot AI

## One-sentence problem statement

SaaS and operations teams want AI-assisted workflows, but they need grounded answers, human approvals, and audit logs before external actions are taken.

## Technical explanation

OpsPilot AI uses a Next.js dashboard and a FastAPI-ready backend architecture for workflow template intake, document retrieval, AI provider abstraction, approval queues, and workflow run logs. The public demo uses seeded data and mock outputs so reviewers can inspect the complete interaction without private API keys.

## Business value explanation

The system reduces repetitive support and sales-ops work while keeping humans in control. It is more practical than a generic chatbot because each run has input, retrieved context, generated output, approval state, and audit history.

## Extension points for clients

- Connect to a CRM, ticketing system, email provider, Slack, or n8n/Make.
- Replace mock provider with OpenAI-compatible LLM.
- Add pgvector/Chroma retrieval.
- Add role permissions and production auth.
- Add workflow scheduling and webhooks.
