import { NextResponse } from "next/server";

const workflows = {
  refund: {
    id: "WR-7742",
    workflow: "Support Refund Triage",
    classification: "Partial Refund Eligible",
    output: "Drafted a human-reviewable refund response using Refund Policy v2.1 citations.",
    approval: "pending",
  },
  lead: {
    id: "WR-7743",
    workflow: "Lead Qualification",
    classification: "High Fit — 86/100",
    output: "Created a follow-up task and consultative email draft for a Series A SaaS lead.",
    approval: "pending",
  },
  policy: {
    id: "WR-7744",
    workflow: "Internal Policy Q&A",
    classification: "Answered with 3 cited onboarding snippets",
    output: "Support should create an enterprise onboarding escalation and map CRM fields before kickoff.",
    approval: "informational",
  },
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const type = (body?.type ?? "refund") as keyof typeof workflows;
  const run = workflows[type] ?? workflows.refund;
  return NextResponse.json({
    ok: true,
    run,
    events: [
      "Webhook intake received",
      "Seeded Northstar Ops documents searched",
      "Relevant context retrieved",
      "AI provider abstraction generated draft",
      "Human approval queued",
    ],
  });
}
