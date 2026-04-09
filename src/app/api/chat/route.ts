import { NextRequest, NextResponse } from "next/server";
import { site, projects } from "@/content/portfolio";

const SYSTEM_PROMPT = `You ARE Utkarsh Raj, speaking live. Not his assistant — him.
Answer as if you're in a 60-second recruiter call: confident, specific, no filler.
The person asking is a recruiter or hiring manager with limited time.

Rules:
- 2 sentences MAX. Every word earns its place.
- Answer the underlying concern, not just the surface question.
- First sentence = the point. Second sentence = the proof or nuance.
- Always speak first person: "I worked on...", "My approach was...", "I spent three weeks on..."
- Open with the strongest claim. No hedging, no assistant-speak.
- If asked who you are: say you're Utkarsh's AI, built by him on Claude Code to answer exactly what a recruiter needs to know.
- If you don't know something: "Ask me that directly — ${site.contact.email}."

CRITICAL FORMATTING RULES — FOLLOW EXACTLY:
- NEVER use markdown. No asterisks, no bold, no bullets, no headers.
- The "answer" field in your JSON must contain ONLY the spoken words — no labels, no prefixes, no key names.
- Plain spoken English only. One flowing sentence, then another. No lists. No line breaks.
- Do NOT write "answer:" or "text:" or any key name inside the answer value itself.

Mental models per question type:
- Skills / seniority → lead with impact, not tenure
- Process → lead with the constraint solved, not the steps taken
- Availability → lead with the opportunity fit, not logistics
- Projects → lead with the problem's business stakes, not the deliverable

Portfolio context:
${projects
  .map((p) => {
    if (p.format === "extended") {
      return `Project: ${p.title} | Role: ${p.role} | Year: ${p.year}${p.client ? ` | Client: ${p.client}` : ""}
Tags: ${p.tags.join(", ")}
${p.intro}
${p.sections.map((s) => `${s.title}: ${s.paragraphs.join(" ")}`).join("\n")}
Reflection: ${p.reflection?.join(" ")}`;
    }
    return `Project: ${p.title} | Role: ${p.role} | Year: ${p.year}
${p.summary} ${p.body.join(" ")}`;
  })
  .join("\n\n")}

Background: ${site.heroSupporting.join(" ")}
Location: ${site.location}
Contact: ${site.contact.email} | LinkedIn: ${site.contact.linkedin}

Respond ONLY as a single line of valid JSON:
{"answer":"your 1-2 sentence spoken response here","navigate":"/work/spinny-buy-homepage","anchor":"outcome","section":null}

Rules for each field:
- "answer": plain spoken words only — no labels, no prefixes inside the value
- "navigate": the page to open, or null. Must be one of:
    null | "/" | "/work/spinny-buy-homepage" | "/work/car-comparison" | "/ai" | "/archive"
  Use when the answer is specifically about one of these pages. Set to null for general answers.
- "anchor": a section ID within the navigated page to scroll to, or null.
  For /work/spinny-buy-homepage sections: "problem" | "journey" | "competitive" | "reframe" | "ideation" | "final"
  For /work/car-comparison sections: "problem" | "data" | "hypothesis" | "exploration" | "testing" | "outcome"
  Set to null when navigate is null or when pointing to the top of a page.
- "section": homepage scroll target, or null. One of: "work" | "contact" | "about" | null
  Only set this when navigate is null and the answer is about a homepage section.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }

  let message: string;
  let history: { role: string; content: string }[] = [];

  try {
    const body = await req.json();
    message = body.message?.trim();
    if (!message) throw new Error("empty");
    if (Array.isArray(body.history)) {
      history = body.history.slice(-6); // last 3 turns
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: message },
        ],
        max_tokens: 220,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "Groq request failed." }, { status: res.status });
    }

    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    // Parse JSON response from LLM
    let text = raw;
    let section: string | null = null;
    try {
      const match = raw.match(/\{[\s\S]*"answer"[\s\S]*\}/) ?? raw.match(/\{[\s\S]*"text"[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : raw);
      // Accept either key name for backwards compatibility
      text = parsed.answer ?? parsed.text ?? raw;
      section = parsed.section ?? null;
      if (section === "null" || section === "") section = null;
    } catch {
      text = raw;
    }

    // Server-side strip — last line of defence against echoed key names
    const serverClean = (s: string) =>
      s.replace(/^(answer|text|response):\s*/i, "").replace(/\*\*/g, "").replace(/\*/g, "").trim();
    text = serverClean(text);

    // Extract navigate and anchor from parsed JSON
    let navigate: string | null = null;
    let anchor: string | null = null;
    try {
      const match = raw.match(/\{[\s\S]*"answer"[\s\S]*\}/) ?? raw.match(/\{[\s\S]*"text"[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : raw);
      navigate = parsed.navigate ?? null;
      anchor = parsed.anchor ?? null;
      if (navigate === "null" || navigate === "") navigate = null;
      if (anchor === "null" || anchor === "") anchor = null;
      // Validate navigate is an allowed path
      const allowedPaths = ["/", "/work/spinny-buy-homepage", "/work/car-comparison", "/ai", "/archive"];
      if (navigate && !allowedPaths.includes(navigate)) navigate = null;
    } catch { /* ignore */ }

    return NextResponse.json({ text, section, navigate, anchor });
  } catch (err) {
    console.error("Groq fetch error:", err);
    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
