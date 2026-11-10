"use client";

import { useState } from "react";
import { Bot, LayoutDashboard, MessageSquareText, FileText, ClipboardList, Sparkles, Send, Menu, ArrowUpRight, CheckCircle2, Zap, ShieldCheck } from "lucide-react";

type Tool = "reply" | "invoice" | "order" | "report";
const tools: {id: Tool; title: string; desc: string; icon: typeof MessageSquareText; prompt: string; placeholder: string}[] = [
  {id:"reply", title:"Customer reply", desc:"Write a helpful, professional response", icon:MessageSquareText, prompt:"Write a professional customer support reply. Be warm, clear and concise.", placeholder:"Paste the customer's message and explain what outcome you want..."},
  {id:"invoice", title:"Invoice draft", desc:"Turn a sale into an invoice draft", icon:FileText, prompt:"Create a clean invoice draft from the supplied details. Include line items, subtotal, tax if specified, and total. Do not invent missing details; mark them as [NEEDED].", placeholder:"Business name, customer, items, quantities, prices, currency, due date..."},
  {id:"order", title:"Order summary", desc:"Organize order details and next actions", icon:ClipboardList, prompt:"Summarize this order, identify missing information, and list practical next actions. Do not invent facts.", placeholder:"Paste order details, customer notes, shipping status..."},
  {id:"report", title:"Business report", desc:"Convert notes into an actionable report", icon:LayoutDashboard, prompt:"Create a concise business report with an executive summary, key observations, risks, and recommended next steps. Use only supplied facts.", placeholder:"Paste sales figures, notes, customer feedback, or weekly updates..."}
];

export default function Home() {
  const [active, setActive] = useState<Tool>("reply");
  const [input, setInput] = useState("");
  const [business, setBusiness] = useState("My business");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selected = tools.find(t => t.id === active)!;

  async function generate() {
    if (!input.trim()) { setError("Add some business details first."); return; }
    setLoading(true); setError(""); setResult("");
    try {
      const response = await fetch("/api/assistant", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({tool:active, business, input})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to generate a result.");
    } finally { setLoading(false); }
  }

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon"><Bot size={22}/></span><span>AutoBiz<span className="brand-ai"> AI</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="nav active"><LayoutDashboard size={18}/> Overview</button>
      <div className="workspace-label tools-label">AI TOOLS</div>
      {tools.map(t => <button key={t.id} className={`nav ${active===t.id ? "selected":""}`} onClick={()=>{setActive(t.id);setResult("");setError("");}}><t.icon size={18}/>{t.title}</button>)}
      <div className="sidebar-bottom"><div className="plan-card"><Sparkles size={17}/><b>Your AI workspace</b><p>One place for everyday business tasks.</p></div><div className="profile"><div className="avatar">F</div><div><b>Business owner</b><small>Free workspace</small></div></div></div>
    </aside>
    <section className="main">
      <header className="topbar"><button className="mobile-menu"><Menu/></button><span className="crumb">Workspace <span>/</span> Overview</span><div className="top-right"><span className="status"><i/> AI workspace</span><div className="avatar">F</div></div></header>
      <div className="content">
        <div className="welcome"><div><div className="eyebrow"><Sparkles size={14}/> YOUR BUSINESS COPILOT</div><h1>Good work starts here.</h1><p>Take care of everyday business tasks with a little help from AI.</p></div><div className="welcome-art"><Bot size={54}/><span className="spark s1">✦</span><span className="spark s2">✧</span></div></div>
        <div className="stats">
          <div className="stat"><span className="stat-icon purple"><Zap size={18}/></span><div><small>AI tools</small><b>04</b><em>Ready to use</em></div></div>
          <div className="stat"><span className="stat-icon green"><CheckCircle2 size={18}/></span><div><small>Workspace</small><b>Active</b><em>Set up and ready</em></div></div>
          <div className="stat"><span className="stat-icon blue"><ShieldCheck size={18}/></span><div><small>Data handling</small><b>Private by default</b><em>Review before sharing</em></div></div>
        </div>
        <div className="section-heading"><div><h2>What would you like to do?</h2><p>Choose a tool to get started.</p></div></div>
        <div className="tool-grid">{tools.map(t=><button key={t.id} className={`tool-card ${active===t.id?"chosen":""}`} onClick={()=>{setActive(t.id);setResult("");setError("");}}><span className="tool-icon"><t.icon size={21}/></span><span className="tool-arrow"><ArrowUpRight size={17}/></span><b>{t.title}</b><p>{t.desc}</p></button>)}</div>
        <div className="work-area">
          <div className="work-title"><div className="work-title-icon"><selected.icon size={20}/></div><div><h2>{selected.title}</h2><p>{selected.desc}</p></div><span className="ai-chip"><Sparkles size={13}/> AI POWERED</span></div>
          <label>BUSINESS / WORKSPACE NAME</label><input className="business-input" value={business} onChange={e=>setBusiness(e.target.value)} placeholder="e.g. FaruShop"/>
          <label>YOUR DETAILS</label><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={selected.placeholder} rows={5}/>
          <div className="form-footer"><span>AI can make mistakes. Check important details before using.</span><button className="generate" onClick={generate} disabled={loading}>{loading?"Working...":"Generate with AI"} <Send size={16}/></button></div>
          {error && <div className="error">{error}</div>}
          {result && <div className="result"><div className="result-head"><b><Sparkles size={16}/> Your AI result</b><button onClick={()=>navigator.clipboard.writeText(result)}>Copy result</button></div><pre>{result}</pre></div>}
        </div>
        <footer>AutoBiz AI <span>·</span> Built to make business simpler.</footer>
      </div>
    </section>
  </main>;
}
