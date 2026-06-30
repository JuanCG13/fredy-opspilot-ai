from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="OpsPilot AI Backend Skeleton")

class DemoIntake(BaseModel):
    type: str = "refund"

@app.get("/health")
def health():
    return {"ok": True, "service": "opspilot-ai-backend"}

@app.get("/workflow-templates")
def workflow_templates():
    return [
        {"id": "refund", "name": "Support Refund Triage"},
        {"id": "lead", "name": "Lead Qualification"},
        {"id": "policy", "name": "Internal Policy Q&A"},
    ]

@app.post("/intake/demo")
def demo_intake(payload: DemoIntake):
    return {
        "run_id": "WR-7742",
        "workflow": payload.type,
        "events": [
            "intake_received",
            "documents_retrieved",
            "ai_draft_created",
            "approval_queued",
        ],
        "external_action_sent": False,
    }

@app.get("/approvals/pending")
def pending_approvals():
    return [{"id": "APR-102", "run_id": "WR-7742", "status": "pending"}]
