import { NextRequest, NextResponse } from "next/server";

const prompts: Record<string, string> = {
  reply: "Write a professional customer support reply. Be warm, clear and concise.",
  invoice: "Create a clean invoice draft from supplied details. Include line items, subtotal, tax if specified, and total. Do not invent missing details; mark them as [NEEDED].",
  order: "Summarize the order, identify missing information, and list practical next actions. Do not invent facts.",
  report: "Create a concise business report with an executive summary, key observations, risks, and recommended next steps. Use only supplied facts."
};

export async function POST(req: NextRequest) {
  try {
    const { tool, business, input } = await req.json();
    if (!tool || !prompts[tool]) return NextResponse.json({ error: "Choose a valid AI tool." }, { status: 400 });
    if (typeof input !== "string" || !input.trim()) return NextResponse.json({ error: "Please provide business details." }, { status: 400 });
    const key = process.env.AI_API_KEY;
    if (!key) return NextResponse.json({ error: "AI is not configured yet. Add AI_API_KEY to .env.local (see README)." }, { status: 503 });

    const base = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.AI_MODEL || "gpt-4o-mini";
    const upstream = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: "system", content: `You are AutoBiz AI, a careful assistant for small businesses. Business name: ${String(business || "Not provided").slice(0,120)}. ${prompts[tool]} Never claim an action was actually completed. Clearly label drafts and assumptions.` },
          { role: "user", content: input.slice(0, 12000) }
        ]
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return NextResponse.json({ error: data?.error?.message || "AI provider request failed." }, { status: upstream.status });
    const result = data?.choices?.[0]?.message?.content;
    if (!result) return NextResponse.json({ error: "The AI provider returned an empty response." }, { status: 502 });
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Invalid request. Please try again." }, { status: 400 });
  }
}
