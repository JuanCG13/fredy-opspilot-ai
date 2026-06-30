"use client";

import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CreditCard,
  Database,
  FileText,
  GitBranch,
  Headphones,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Network,
  Play,
  Plus,
  Rocket,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Terminal,
  Upload,
  Workflow,
  Zap,
} from "lucide-react";

type RunKind = "refund" | "lead" | "policy";
type Approval = "pending" | "approved" | "rejected";

const templates = [
  {
    key: "refund" as RunKind,
    tag: "LOGIC",
    icon: "terminal",
    title: "Support Refund Triage",
    text: "Automatic categorization and processing of customer refund requests based on policy and history.",
  },
  {
    key: "lead" as RunKind,
    tag: "EXTRACTOR",
    icon: "query_stats",
    title: "Lead Qualification",
    text: "Extracting intent and firmographics from inbound leads to score sales-fit instantly.",
  },
  {
    key: "policy" as RunKind,
    tag: "RAG",
    icon: "menu_book",
    title: "Internal Policy Q&A",
    text: "Direct retrieval of compliance and onboarding snippets with source citations.",
  },
];

const runRows = [
  ["2023-11-14 10:42:43", "Support Refund Triage", "SUCCESS", "1,249", "1.42s"],
  ["2023-11-14 10:41:15", "Lead Qualification", "RUNNING", "---", "---"],
  ["2023-11-14 10:38:02", "Internal Policy Q&A", "PENDING", "2,841", "0.8s"],
  ["2023-11-14 10:42:13", "Legal Doc Extraction", "FAILED", "0", "12.3s"],
];

const docs = [
  ["Refund Policy v2.1", "14-day window for full refunds; Pro plan prorated exceptions.", "32 chunks"],
  ["Pricing Tiers 2024", "Enterprise onboarding, SLA review, account management.", "28 chunks"],
  ["Onboarding SOP", "CRM mapping, kickoff scheduling, technical owner assignment.", "41 chunks"],
  ["Lead Qualification Rules", "20+ employees, urgent workflow pain and budget signal.", "37 chunks"],
];

export default function OpsPilotAI() {
  const [view, setView] = useState<"dashboard" | "run" | "approvals" | "kb">("dashboard");
  const [active, setActive] = useState<RunKind>("refund");
  const [approval, setApproval] = useState<Approval>("pending");
  const [events, setEvents] = useState<string[]>([
    "Triggered via demo intake",
    "Refund Policy v2.1 fetched",
    "AI reasoning summary created",
    "Draft queued for approval",
  ]);

  async function trigger(kind: RunKind) {
    setActive(kind);
    setView("run");
    setApproval(kind === "policy" ? "approved" : "pending");
    const res = await fetch("/api/intake/demo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: kind }),
    });
    const data = await res.json();
    setEvents(data.events ?? []);
  }

  return (
    <div className="stitch-shell">
      <Sidebar setView={setView} active={view} />
      <main className="stitch-main">
        <Topbar />
        {view === "dashboard" && <Dashboard trigger={trigger} setView={setView} />}
        {view === "run" && <RunDetail active={active} events={events} approval={approval} setApproval={setApproval} />}
        {view === "approvals" && <Approvals setView={setView} setApproval={setApproval} approval={approval} />}
        {view === "kb" && <KnowledgeBase />}
      </main>
    </div>
  );
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const icons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
    deployed_code: Bot,
    dashboard: LayoutDashboard,
    account_tree: GitBranch,
    bolt: Zap,
    analytics: BarChart3,
    fact_check: ListChecks,
    menu_book: BookOpen,
    settings: Settings,
    add: Plus,
    help: HelpCircle,
    contact_support: Headphones,
    chevron_right: ChevronRight,
    search: Search,
    hub: Network,
    dns: Server,
    notifications: Bell,
    expand_more: ChevronDown,
    sync: Workflow,
    verified_user: ShieldCheck,
    data_object: Database,
    payments: CreditCard,
    terminal: Terminal,
    query_stats: LineChart,
    play_arrow: Play,
    rocket_launch: Rocket,
    inbox: Inbox,
    sync_alt: Activity,
    outbox: Send,
    security: Shield,
    upload: Upload,
    description: FileText,
    database: Database,
    monitor_heart: Activity,
  };
  const Cmp = icons[name] ?? CircleDot;
  return <Cmp className={`icon ${className}`} size={20} />;
}

function Sidebar({ setView, active }: { setView: (v: "dashboard" | "run" | "approvals" | "kb") => void; active: string }) {
  const nav = [
    ["dashboard", "Dashboard", "dashboard"],
    ["dashboard", "Templates", "account_tree"],
    ["run", "Trigger Demo", "bolt"],
    ["run", "Workflow Runs", "analytics"],
    ["approvals", "Pending Approvals", "fact_check"],
    ["kb", "Knowledge Base", "menu_book"],
  ] as const;
  return (
    <aside className="op-sidebar">
      <div className="op-brand">
        <div className="op-mark"><Icon name="deployed_code" /></div>
        <div>
          <strong>OpsPilot AI</strong>
          <span>Northstar Ops Demo</span>
        </div>
      </div>
      <nav className="op-nav">
        {nav.map(([key, label, icon]) => (
          <button key={label} className={active === key ? "active" : ""} onClick={() => setView(key)}>
            <Icon name={icon} />
            {label}
          </button>
        ))}
        <button><Icon name="settings" />Settings</button>
      </nav>
      <div className="op-side-bottom">
        <button className="new-workflow"><Icon name="add" /> New Workflow</button>
        <a><Icon name="help" />Documentation</a>
        <a><Icon name="contact_support" />Support</a>
        <div className="admin-chip">
          <img alt="OpsPilot admin avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe-SiuPRW2_DXtkkuW9S60sIa4lAw4OSmnSKutm8pzXjVEKgepbwFV6SGTsGRebsvFp8OvP7nrQYvVN6u2ZJZYgWwRGjRUXYrdDCuFuU2j90YwrIStK4tnvriuB2tykYpfO54mD5HtdfAF63mEH8hl5WfWQVNFybamo983zhIhksSVSPlRDF3jyMJQa_tMxOeBOfGVyijQXS1cpgw7tKi-LKVwBWDCRLea9hZUoeL59zFNPTvK6M9Qn6tI_0GFeKcxBEbNUd7QwAo" />
          <div><b>OpsPilot Admin</b><span>Administrator</span></div>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="op-topbar">
      <div className="crumb"><span>Workspace</span><Icon name="chevron_right" /><b>Northstar Ops Workspace</b></div>
      <label className="op-search"><Icon name="search" /><input placeholder="Search workflow, logs, or templates..." /></label>
      <div className="top-actions">
        <span className="demo-pill"><i /> Demo Mode</span>
        <Icon name="hub" />
        <Icon name="dns" />
        <span className="bell"><Icon name="notifications" /><i /></span>
        <span className="divider" />
        <button>Internal <Icon name="expand_more" /></button>
      </div>
    </header>
  );
}

function Dashboard({ trigger, setView }: { trigger: (kind: RunKind) => void; setView: (v: "dashboard" | "run" | "approvals" | "kb") => void }) {
  return (
    <div className="op-content">
      <section className="kpis">
        <Kpi label="Workflow Runs" icon="sync" value="12,842" meta="+12.4%" bar="cyan" />
        <Kpi label="Pending Approvals" icon="verified_user" value="42" meta="NEEDS ACTION" bar="amber" />
        <Kpi label="Retrieved Docs" icon="data_object" value="854.2k" meta="INDEXED" bar="violet" />
        <Kpi label="Estimated AI Cost" icon="payments" value="$2,412.00" meta="MTD" bar="emerald" />
      </section>

      <section className="middle-grid">
        <div className="templates-panel">
          <div className="section-title"><h2>Active Workflow Templates</h2><button>Browse All</button></div>
          <div className="template-grid">
            {templates.map((tpl) => (
              <article className="template-card" key={tpl.key}>
                <div className="template-head"><span>{tpl.tag}</span><Icon name={tpl.icon} /></div>
                <h3>{tpl.title}</h3>
                <p>{tpl.text}</p>
                <button onClick={() => trigger(tpl.key)}><Icon name="play_arrow" /> Trigger</button>
              </article>
            ))}
          </div>
        </div>
        <aside className="quick-panel">
          <h2>Quick Actions</h2>
          <button className="trigger-event" onClick={() => trigger("refund")}><Icon name="rocket_launch" /> Trigger Demo Event</button>
          <small>Pipeline Visualization</small>
          <div className="pipeline">
            <PipelineStep icon="inbox" label="Input" />
            <PipelineStep icon="sync_alt" label="Mapping" active />
            <PipelineStep icon="outbox" label="Output" />
          </div>
          <div className="sys-log"><span>System Load</span><b>Optimal</b></div>
          <div className="sys-log"><span>Gateway Latency</span><b>28ms</b></div>
          <div className="autorefresh">AUTOREFRESH <i /></div>
        </aside>
      </section>

      <section className="run-log-card">
        <h2>Recent Run Log</h2>
        <table>
          <thead><tr><th>Timestamp</th><th>Workflow Name</th><th>Status</th><th>Tokens Used</th><th>Latency</th><th>Audit</th></tr></thead>
          <tbody>
            {runRows.map(([time, name, status, tokens, latency]) => (
              <tr key={time}>
                <td>{time}</td><td><b>{name}</b></td><td><Status status={status} /></td><td>{tokens}</td><td>{latency}</td><td><Icon name="security" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer><span>Showing 1–4 of 1,284 entries</span><span>PREV&nbsp;&nbsp; 1 &nbsp;&nbsp;NEXT</span></footer>
      </section>

      <section className="portfolio-strip">
        <span>Portfolio owner: <b>Fredy Gimenez</b></span>
        <span>AI Workflow Automation Developer · Next.js · FastAPI · RAG · Human Approval</span>
        <button onClick={() => setView("run")}>Open run detail</button>
      </section>
    </div>
  );
}

function Kpi({ label, icon, value, meta, bar }: { label: string; icon: string; value: string; meta: string; bar: string }) {
  return (
    <article className="kpi-card">
      <div><span>{label}</span><Icon name={icon} className={bar} /></div>
      <strong>{value}</strong><em className={bar}>{meta}</em>
      <div className={`mini-bar ${bar}`}><i /></div>
    </article>
  );
}

function PipelineStep({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return <div className={active ? "pipe active" : "pipe"}><Icon name={icon} /><span>{label}</span></div>;
}

function Status({ status }: { status: string }) {
  return <span className={`status status-${status.toLowerCase()}`}>{status}</span>;
}

function RunDetail({ active, events, approval, setApproval }: { active: RunKind; events: string[]; approval: Approval; setApproval: (a: Approval) => void }) {
  const isLead = active === "lead";
  const isPolicy = active === "policy";
  return (
    <div className="op-content run-screen">
      <div className="run-head">
        <div><span>Workflow Run</span><h1>{isLead ? "Lead Qualification" : isPolicy ? "Internal Policy Q&A" : "Support Refund Triage"}</h1></div>
        <Status status={approval === "pending" ? "PENDING" : approval === "approved" ? "SUCCESS" : "FAILED"} />
      </div>
      <section className="run-grid">
        <article className="detail-card"><h2>Original Intake</h2><pre>{JSON.stringify({ run_id: "WR-7742", source: "POST /intake/demo", scenario: isLead ? "Series A SaaS, 35 employees" : isPolicy ? "Enterprise onboarding question" : "Refund after 19 days on Pro plan", external_actions: "disabled_until_approved" }, null, 2)}</pre></article>
        <article className="detail-card"><h2>Knowledge Retrieval</h2><Source title="Refund Policy v2.1" text="Standard refund window is restricted to 14 days; Pro plan exceptions may be prorated." /><Source title="Lead Qualification Rules" text="High-fit leads show urgent workflow pain, 20+ employees and clear operational owner." /></article>
        <article className="detail-card wide"><h2>AI Analysis</h2><p>{isLead ? "High Fit · 86/100. Clear support/sales ops automation need and buyer-level urgency." : isPolicy ? "Enterprise onboarding requires implementation ticket, CRM mapping and technical owner assignment." : "Partial Refund Eligible. Outside standard window but Pro plan allows manager-level prorated exception."}</p></article>
        <article className="detail-card wide"><h2>Human-in-the-loop decision</h2><textarea defaultValue={isLead ? "Hi Maya — your team looks like a strong fit for AI workflow automation. I suggest a 30-minute discovery around intake, routing and approval queues." : "Hi Alex — your request is outside the standard 14-day window, but based on the Pro plan exception policy we can offer a prorated refund for the unused period."} /><div className="decision-actions"><button>Edit</button><button onClick={() => setApproval("approved")}>Approve</button><button onClick={() => setApproval("rejected")}>Reject</button></div></article>
        <article className="detail-card"><h2>Event Timeline</h2>{events.map((event, i) => <div className="event" key={event}><i>{i + 1}</i>{event}</div>)}</article>
        <article className="detail-card"><h2>Technicals</h2><p className="mono-big">2,140 tokens</p><p>Estimated cost: <b>$0.04</b></p><p>Gateway latency: <b>28ms</b></p></article>
      </section>
    </div>
  );
}

function Source({ title, text }: { title: string; text: string }) {
  return <div className="source-row"><b>{title}</b><p>{text}</p></div>;
}

function Approvals({ setView, setApproval, approval }: { setView: (v: "dashboard" | "run" | "approvals" | "kb") => void; setApproval: (a: Approval) => void; approval: Approval }) {
  return (
    <div className="op-content approvals-layout">
      <section className="queue"><h1>Pending Approvals <span>12</span></h1>{["Refund Response", "Lead Follow-up", "Onboarding Escalation"].map((name, i) => <article key={name}><div><b>{name}</b><p>{i === 0 ? "Review Required" : i === 1 ? "Drafted" : "High Priority"}</p></div><Status status={i === 0 && approval !== "pending" ? (approval === "approved" ? "SUCCESS" : "FAILED") : "PENDING"} /><button onClick={() => setView("run")}>Review</button><button onClick={() => setApproval("approved")}>Approve</button></article>)}</section>
      <KnowledgeBase embedded />
    </div>
  );
}

function KnowledgeBase({ embedded = false }: { embedded?: boolean }) {
  return (
    <section className={embedded ? "kb embedded" : "op-content kb"}>
      <div className="section-title"><h1>Knowledge Base</h1><button><Icon name="upload" /> Upload Document</button></div>
      <div className="kb-stats"><Kpi label="Total Documents" icon="description" value="24" meta="Seeded" bar="cyan" /><Kpi label="Indexed Chunks" icon="database" value="12,402" meta="VECTOR DB" bar="violet" /><Kpi label="Retrieval Health" icon="monitor_heart" value="99.2%" meta="ONLINE" bar="emerald" /></div>
      <div className="doc-grid">{docs.map(([title, text, chunks]) => <article key={title}><b>{title}</b><p>{text}</p><span>{chunks}</span><button>Source Preview</button></article>)}</div>
    </section>
  );
}
