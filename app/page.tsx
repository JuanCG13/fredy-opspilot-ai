"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Layers3,
  Play,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

type View = "dashboard" | "run" | "approvals" | "docs" | "settings";
type RunKey = "refund" | "lead" | "policy";

type ApprovalState = "pending" | "approved" | "rejected";

const templates = [
  {
    key: "refund" as RunKey,
    name: "Support Refund Triage",
    type: "RAG + Approval",
    trigger: "Customer asks for refund after 19 days on Pro plan",
    outcome: "Classifies eligibility, retrieves refund policy, drafts response, queues approval.",
  },
  {
    key: "lead" as RunKey,
    name: "Lead Qualification",
    type: "Rules + AI Draft",
    trigger: "Series A SaaS lead wants support and sales ops automation",
    outcome: "Scores fit, explains qualification, proposes next task and email.",
  },
  {
    key: "policy" as RunKey,
    name: "Internal Policy Q&A",
    type: "Grounded Q&A",
    trigger: "What should support do for enterprise onboarding?",
    outcome: "Answers with cited onboarding SOP and escalation snippets.",
  },
];

const docs = [
  {
    title: "Refund Policy v2.1",
    chunks: 32,
    updated: "2h ago",
    excerpt:
      "Full refunds are normally available within 14 days. Pro plan exceptions may be prorated when a verified technical issue affected onboarding or activation.",
  },
  {
    title: "Pricing Tiers 2024",
    chunks: 28,
    updated: "1d ago",
    excerpt:
      "Enterprise plans include dedicated onboarding, account management, custom SLA review, and quarterly success planning.",
  },
  {
    title: "Onboarding SOP",
    chunks: 41,
    updated: "4h ago",
    excerpt:
      "For enterprise onboarding, create an implementation ticket, map CRM fields, schedule kickoff, and assign a technical owner.",
  },
  {
    title: "Support Escalation Policy",
    chunks: 21,
    updated: "3d ago",
    excerpt:
      "L3 engineers must be notified if an incident remains unresolved for more than four business hours or blocks a paid account.",
  },
  {
    title: "Lead Qualification Rules",
    chunks: 37,
    updated: "6h ago",
    excerpt:
      "High-fit leads have urgent workflow pain, 20+ employees, clear owner, current manual process, and budget for implementation.",
  },
];

const initialLogs = [
  { id: "WR-7742", name: "Support Refund Triage", status: "Pending", tokens: "2,140", latency: "4.8s", time: "10:42:11" },
  { id: "WR-7743", name: "Lead Qualification", status: "Success", tokens: "1,760", latency: "3.2s", time: "10:38:09" },
  { id: "WR-7744", name: "Internal Policy Q&A", status: "Success", tokens: "1,118", latency: "2.1s", time: "10:31:44" },
  { id: "WR-7738", name: "Support Escalation", status: "Failed", tokens: "904", latency: "1.7s", time: "09:58:21" },
];

const sources = [
  {
    title: "Refund Policy v2.1",
    cite: "Section 2.1",
    text: "Standard refund window for full refunds is restricted to 14 days after purchase or plan renewal.",
  },
  {
    title: "Refund Policy v2.1",
    cite: "Section 4.3",
    text: "Pro plan requests outside 14 days may be escalated for prorated exception when technical activation issues are documented.",
  },
];

export default function OpsPilotPortfolioDemo() {
  const [view, setView] = useState<View>("dashboard");
  const [activeRun, setActiveRun] = useState<RunKey>("refund");
  const [approval, setApproval] = useState<ApprovalState>("pending");
  const [draft, setDraft] = useState(
    "Hi Alex — thanks for explaining the activation issue. Your request is outside the standard 14-day full-refund window, but based on the Pro plan exception policy we can offer a prorated refund for the unused period. I’ve escalated this for manager approval and will confirm the exact amount once approved."
  );
  const [events, setEvents] = useState([
    "10:42:11 · Webhook intake received",
    "10:42:13 · Retrieved Refund Policy v2.1 snippets",
    "10:42:15 · Classified request as Partial Refund Eligible",
    "10:42:16 · Draft response generated",
    "10:42:17 · Human approval created",
  ]);
  const [running, setRunning] = useState(false);

  const metrics = useMemo(
    () => [
      { label: "Workflow runs", value: "148", trend: "+12 this week", icon: <Workflow size={18} /> },
      { label: "Pending approvals", value: approval === "pending" ? "12" : "11", trend: "Human-in-loop", icon: <ClipboardCheck size={18} /> },
      { label: "Indexed documents", value: "24", trend: "12,402 chunks", icon: <Database size={18} /> },
      { label: "Estimated AI cost", value: "$8.42", trend: "$0.04 avg/run", icon: <Gauge size={18} /> },
    ],
    [approval]
  );

  async function triggerDemo(type: RunKey = activeRun) {
    setRunning(true);
    setActiveRun(type);
    setView("run");
    setEvents(["now · Intake received"]);
    const response = await fetch("/api/intake/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const json = await response.json();
    const stamped = json.events.map((event: string, index: number) => `+${index + 1}s · ${event}`);
    setEvents(stamped);
    setApproval(type === "policy" ? "approved" : "pending");
    if (type === "lead") {
      setDraft(
        "Hi Maya — your team looks like a strong fit for AI workflow automation because you already have repeatable support and sales ops processes. I’d suggest a 30-minute technical discovery focused on intake, routing, approval queues, and CRM handoff points."
      );
    } else if (type === "policy") {
      setDraft(
        "Support should create an enterprise onboarding escalation, confirm CRM field mapping, assign a technical owner, and schedule a kickoff before implementation starts. Sources: Onboarding SOP and Pricing Tiers 2024."
      );
    } else {
      setDraft(
        "Hi Alex — thanks for explaining the activation issue. Your request is outside the standard 14-day full-refund window, but based on the Pro plan exception policy we can offer a prorated refund for the unused period. I’ve escalated this for manager approval and will confirm the exact amount once approved."
      );
    }
    setRunning(false);
  }

  return (
    <>
      <div className="mobile-top">
        <strong>OpsPilot AI</strong>
        <span className="badge ok">Demo mode</span>
      </div>
      <div className="shell">
        <Sidebar view={view} setView={setView} />
        <main className="main">
          <Topbar />
          <Hero onTrigger={() => triggerDemo("refund")} />
          <section className="grid metrics" aria-label="Ops metrics">
            {metrics.map((metric) => (
              <article className="card metric" key={metric.label}>
                <div className="label"><span>{metric.label}</span>{metric.icon}</div>
                <div className="value mono">{metric.value}</div>
                <div className="trend">{metric.trend}</div>
              </article>
            ))}
          </section>

          <div className="tabs section">
            {[
              ["dashboard", "Dashboard"],
              ["run", "Workflow Run Detail"],
              ["approvals", "Approvals"],
              ["docs", "Knowledge Base"],
              ["settings", "Settings / Stack"],
            ].map(([key, label]) => (
              <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key as View)}>{label}</button>
            ))}
          </div>

          {view === "dashboard" && <Dashboard triggerDemo={triggerDemo} running={running} />}
          {view === "run" && (
            <RunDetail
              activeRun={activeRun}
              approval={approval}
              setApproval={setApproval}
              draft={draft}
              setDraft={setDraft}
              events={events}
              triggerDemo={triggerDemo}
              running={running}
            />
          )}
          {view === "approvals" && <Approvals approval={approval} setApproval={setApproval} setView={setView} />}
          {view === "docs" && <KnowledgeBase />}
          {view === "settings" && <SettingsPanel />}

          <footer className="footer">
            <span>Portfolio owner: Fredy Gimenez · AI Workflow Automation Developer</span>
            <span>Built as an honest demo shell: seeded data, mocked external actions, reviewable code.</span>
          </footer>
        </main>
      </div>
    </>
  );
}

function Sidebar({ view, setView }: { view: View; setView: (view: View) => void }) {
  const items: Array<[View, string, React.ReactNode]> = [
    ["dashboard", "Dashboard", <Activity size={18} key="a" />],
    ["run", "Workflow Runs", <GitBranch size={18} key="g" />],
    ["approvals", "Pending Approvals", <ClipboardCheck size={18} key="c" />],
    ["docs", "Knowledge Base", <FileText size={18} key="f" />],
    ["settings", "Settings / AI Provider", <Settings size={18} key="s" />],
  ];
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">OP</div>
        <div>
          <h1>OpsPilot AI</h1>
          <p>Northstar Ops demo workspace</p>
        </div>
      </div>
      <nav className="nav">
        {items.map(([key, label, icon]) => (
          <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>{icon}{label}</button>
        ))}
      </nav>
      <div className="sidebar-card">
        <span className="badge ok"><ShieldCheck size={14} /> Safe demo</span>
        <p><small>No real customer data, no real email sending, and no hidden credentials required to review the workflow.</small></p>
      </div>
      <div className="sidebar-card">
        <small>Stack target: Next.js, TypeScript, FastAPI, SQLModel, vector retrieval, OpenAI-compatible provider abstraction.</small>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <div className="topbar">
      <div>
        <div className="eyebrow">AI Workflow Automation Developer Portfolio</div>
      </div>
      <div className="badges">
        <span className="badge ok"><CheckCircle2 size={14} /> Provider mock online</span>
        <span className="badge"><Code2 size={14} /> Next.js + FastAPI architecture</span>
        <span className="badge warn"><AlertTriangle size={14} /> External sends disabled</span>
      </div>
    </div>
  );
}

function Hero({ onTrigger }: { onTrigger: () => void }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div>
          <div className="eyebrow">Flagship demo · OpsPilot AI</div>
          <h2>Human-approved AI workflows for SaaS operations.</h2>
          <p>
            OpsPilot AI receives business events, retrieves company knowledge, proposes AI-assisted next actions,
            and lets a human approve or edit every external action before execution.
          </p>
          <div className="hero-actions">
            <button className="btn primary" onClick={onTrigger}><Play size={18} /> Trigger refund demo</button>
            <a className="btn" href="#architecture"><Layers3 size={18} /> Architecture</a>
          </div>
        </div>
        <div className="card flowline">
          <h3>Workflow contract</h3>
          {[
            ["Input", "Webhook/form intake with typed payload"],
            ["Retrieve", "RAG over Northstar Ops policies"],
            ["Decide", "Classify, draft, estimate cost"],
            ["Approve", "Human edits, approves, rejects"],
            ["Log", "Run timeline and context trail"],
          ].map(([title, text], index) => (
            <div className="flow-step" key={title}><div className="step-dot mono">{index + 1}</div><div><b>{title}</b><br /><span>{text}</span></div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard({ triggerDemo, running }: { triggerDemo: (key: RunKey) => void; running: boolean }) {
  return (
    <>
      <section className="section">
        <div className="section-head">
          <div><h3>Workflow templates</h3><p>Three market-backed flows that map to AI automation, RAG, internal tools, and SaaS operations jobs.</p></div>
        </div>
        <div className="grid three-col">
          {templates.map((template) => (
            <article className="card template-card" key={template.key}>
              <span className="badge"><Sparkles size={14} /> {template.type}</span>
              <h3 style={{ marginTop: 14 }}>{template.name}</h3>
              <p>{template.outcome}</p>
              <small style={{ color: "var(--muted)" }}>Trigger: {template.trigger}</small>
              <div style={{ marginTop: 16 }}>
                <button className="btn primary" onClick={() => triggerDemo(template.key)} disabled={running}>
                  {running ? <RefreshCw size={16} /> : <Play size={16} />} Run demo
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <RunLog />
      <Architecture />
    </>
  );
}

function RunLog() {
  return (
    <section className="section">
      <div className="section-head"><div><h3>Recent run log</h3><p>Every automation produces a reviewable event trail, context set, output draft, approval decision, and cost estimate.</p></div></div>
      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table">
          <thead><tr><th>Time</th><th>Workflow</th><th>Status</th><th>Tokens</th><th>Latency</th><th>Audit</th></tr></thead>
          <tbody>
            {initialLogs.map((log) => (
              <tr key={log.id}>
                <td className="mono">{log.time}</td>
                <td><b>{log.name}</b><br /><span style={{ color: "var(--muted)" }}>{log.id}</span></td>
                <td><Status status={log.status} /></td>
                <td className="mono">{log.tokens}</td>
                <td className="mono">{log.latency}</td>
                <td><span className="badge"><Search size={14} /> View trail</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Status({ status }: { status: string }) {
  const klass = status.toLowerCase() === "success" ? "success" : status.toLowerCase() === "pending" ? "pending" : status.toLowerCase() === "failed" ? "failed" : "running";
  return <span className={`status ${klass}`}>{status === "Success" ? <CheckCircle2 size={13} /> : status === "Failed" ? <XCircle size={13} /> : <Activity size={13} />}{status}</span>;
}

function RunDetail({ activeRun, approval, setApproval, draft, setDraft, events, triggerDemo, running }: {
  activeRun: RunKey; approval: ApprovalState; setApproval: (state: ApprovalState) => void; draft: string; setDraft: (draft: string) => void; events: string[]; triggerDemo: (key: RunKey) => void; running: boolean;
}) {
  const title = activeRun === "refund" ? "Support Refund Triage" : activeRun === "lead" ? "Lead Qualification" : "Internal Policy Q&A";
  return (
    <section className="section">
      <div className="section-head">
        <div><h3>Workflow Run Detail · {title}</h3><p>Shows original input, retrieved context, AI reasoning summary, draft, approval decision, and final run events.</p></div>
        <div className="badges"><Status status={approval === "pending" ? "Pending" : approval === "approved" ? "Success" : "Failed"} /><span className="badge mono">WR-7742</span></div>
      </div>
      <div className="grid detail-grid">
        <div className="grid">
          <article className="card">
            <h3>Original intake</h3>
            <div className="kv" style={{ marginTop: 12 }}>
              <div className="kv-row"><span>Source</span><b>POST /intake/demo</b></div>
              <div className="kv-row"><span>Company</span><b>Northstar Ops</b></div>
              <div className="kv-row"><span>Scenario</span><b>{activeRun === "refund" ? "Refund after 19 days on Pro plan" : activeRun === "lead" ? "Series A SaaS lead, 35 employees" : "Enterprise onboarding policy question"}</b></div>
              <div className="kv-row"><span>External action</span><b>Disabled until human approval</b></div>
            </div>
          </article>
          <article className="card">
            <h3>Retrieved context</h3>
            {sources.map((source) => (
              <div className="source" key={source.cite}>
                <b>{source.title} · {source.cite}</b>
                <p>{source.text}</p>
              </div>
            ))}
          </article>
          <article className="card">
            <h3>Run events</h3>
            <div className="log" style={{ marginTop: 12 }}>
              {events.map((event) => <div className="log-item" key={event}><time>{event.split(" · ")[0]}</time><span>{event.split(" · ").slice(1).join(" · ") || event}</span></div>)}
            </div>
          </article>
        </div>
        <div className="grid">
          <article className="card">
            <div className="section-head"><div><h3>AI analysis</h3><p>Grounded summary, not a hidden chatbot response.</p></div><span className="badge ok">2,140 tokens · est. $0.04</span></div>
            <div className="grid two-col">
              <div className="source"><b>Classification</b><p>{activeRun === "refund" ? "Partial Refund Eligible" : activeRun === "lead" ? "High Fit · 86/100" : "Enterprise onboarding escalation"}</p></div>
              <div className="source"><b>Reasoning summary</b><p>{activeRun === "refund" ? "Outside the standard 14-day window, but Pro plan allows prorated exception for documented activation issues." : activeRun === "lead" ? "Strong fit: clear team size, urgent operations pain, and defined use case across support and sales ops." : "Enterprise onboarding requires implementation ticket, CRM mapping, owner assignment, and kickoff."}</p></div>
            </div>
          </article>
          <article className="card">
            <h3>Drafted action</h3>
            <p>Edit the generated output before approving. The demo intentionally does not send real emails.</p>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
            <div className="hero-actions">
              <button className="btn" onClick={() => setApproval("pending")}>Edit saved</button>
              <button className="btn success" onClick={() => setApproval("approved")}><CheckCircle2 size={16} /> Approve</button>
              <button className="btn danger" onClick={() => setApproval("rejected")}><XCircle size={16} /> Reject</button>
            </div>
          </article>
          <article className="card">
            <h3>Try another flow</h3>
            <div className="hero-actions">
              {templates.map((template) => <button key={template.key} className="btn" onClick={() => triggerDemo(template.key)} disabled={running}>{template.name} <ArrowRight size={15} /></button>)}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Approvals({ approval, setApproval, setView }: { approval: ApprovalState; setApproval: (state: ApprovalState) => void; setView: (view: View) => void }) {
  const items = [
    ["Refund Response", approval === "pending" ? "Review Required" : approval === "approved" ? "Approved" : "Rejected", "Medium", "Customer refund after 19 days on Pro plan"],
    ["Lead Follow-up", "Drafted", "Low", "Series A SaaS wants AI workflows for support and sales ops"],
    ["Onboarding Escalation", "High Priority", "High", "Enterprise customer needs implementation kickoff"],
  ];
  return (
    <section className="section grid two-col">
      <div>
        <div className="section-head"><div><h3>Pending approvals</h3><p>Human-in-the-loop queue before any external action.</p></div><span className="badge warn">12 queued</span></div>
        <div className="approval-list">
          {items.map(([name, status, risk, text]) => (
            <article className="approval-card" key={name}>
              <div className="approval-top"><div><b>{name}</b><p>{text}</p></div><span className="badge">Risk: {risk}</span></div>
              <div className="hero-actions"><span className="status pending">{status}</span><button className="btn" onClick={() => setView("run")}>Review</button><button className="btn success" onClick={() => setApproval("approved")}>Approve</button></div>
            </article>
          ))}
        </div>
      </div>
      <KnowledgeBase embedded />
    </section>
  );
}

function KnowledgeBase({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={embedded ? "" : "section"}>
      <div className="section-head"><div><h3>Knowledge Base / Documents</h3><p>Seeded company policies that power retrieval and cited answers.</p></div><button className="btn primary"><Upload size={16} /> Upload document</button></div>
      <div className="grid metrics" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <article className="card metric"><div className="label">Documents<FileText size={16}/></div><div className="value mono">24</div><div className="trend">5 seeded for demo</div></article>
        <article className="card metric"><div className="label">Indexed chunks<Database size={16}/></div><div className="value mono">12,402</div><div className="trend">Chunk size 800 chars</div></article>
        <article className="card metric"><div className="label">Retrieval health<Search size={16}/></div><div className="value mono">99.2%</div><div className="trend">Mock vector index online</div></article>
      </div>
      <div className="grid doc-grid" style={{ marginTop: 16 }}>
        {docs.map((doc) => (
          <article className="card doc-card" key={doc.title}>
            <div className="approval-top"><h3>{doc.title}</h3><span className="badge mono">{doc.chunks} chunks</span></div>
            <p>{doc.excerpt}</p>
            <div className="badges"><span className="badge">Last sync {doc.updated}</span><span className="badge"><Search size={13}/> Source preview</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsPanel() {
  return (
    <section className="section grid two-col">
      <article className="card">
        <h3>AI provider settings</h3>
        <p>Portfolio-safe provider abstraction. The public demo uses mock outputs so reviewers can understand the product without private credentials.</p>
        <div className="kv">
          <div className="kv-row"><span>Provider</span><b>OpenAI-compatible abstraction</b></div>
          <div className="kv-row"><span>Embeddings</span><b>Pluggable embeddings adapter</b></div>
          <div className="kv-row"><span>External sends</span><b>Disabled in demo</b></div>
          <div className="kv-row"><span>Vector store</span><b>pgvector / Chroma-ready skeleton</b></div>
        </div>
      </article>
      <article className="card" id="architecture">
        <h3>Why this demo gets freelance signals</h3>
        <p>It demonstrates a real workflow surface: intake, retrieval, decisioning, human approval, status, logs, and deployment. It supports applications for AI automation, FastAPI, RAG, internal tools, and workflow dashboards.</p>
        <div className="hero-actions"><a className="btn" href="/README.md">README concept</a><a className="btn" href="https://github.com/" target="_blank">GitHub-ready</a></div>
      </article>
    </section>
  );
}

function Architecture() {
  return (
    <section className="section" id="architecture">
      <div className="section-head"><div><h3>Architecture slice</h3><p>First release shell designed to evolve into a FastAPI + workflow-engine + RAG backend.</p></div></div>
      <div className="grid three-col">
        {[
          [<Bot key="b" />, "AI workflow orchestration", "Template registry, intake endpoint, provider abstraction, prompt templates, cost/token estimate."],
          [<Database key="d" />, "RAG and documents", "Document upload, chunking, embeddings, retrieval, cited context panel, source snippets."],
          [<ClipboardCheck key="c" />, "Human approval service", "Edit, approve, reject, and audit every proposed external action before execution."],
        ].map(([icon, title, text]) => <article className="card" key={String(title)}><span className="badge">{icon} Technical module</span><h3 style={{ marginTop: 14 }}>{title}</h3><p>{text}</p></article>)}
      </div>
    </section>
  );
}
