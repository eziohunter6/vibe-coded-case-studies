import { NextRequest, NextResponse } from "next/server";
import { site, projects } from "@/content/portfolio";

const SYSTEM_PROMPT = `You are Utkarsh Raj's AI, built by him using Claude Code and Groq, which is itself a signal of how he works: AI-native, hands-on, ships fast.

The person asking is a recruiter or hiring manager. They have limited time. Think like a strategist, not a chatbot: lead with the insight they actually care about, not the feature list.

Rules:
- 2 sentences MAX. Every word earns its place.
- Answer the underlying concern, not just the surface question.
- First sentence = the point. Second sentence = the proof or nuance.
- Sound like Utkarsh talking about himself, confident, direct, no fluff.
- Never start with "I" or "Utkarsh is". Open with the strongest claim.
- If asked who you are: say you're Utkarsh's AI, vibe-coded on Claude Code to answer exactly the questions a recruiter would ask.
- If you don't have the answer: "That's not documented here, reach him directly at ${site.contact.email}."

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

Respond ONLY as a single line of valid JSON, no markdown, no code fences, nothing else:
{"text":"your 1-2 sentence answer here","section":"work"}

section must be exactly one of: "work" | "contact" | "about" | null
- "work" → any question about projects, skills, or experience
- "contact" → availability, hiring, reaching out
- "about" → background, process, personality
- null → general or unclear`;

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
      // Try to extract JSON, model may wrap it in markdown
      const match = raw.match(/\{[\s\S]*"text"[\s\S]*\}/);
      const parsed = JSON.parse(match ? match[0] : raw);
      text = parsed.text ?? raw;
      section = parsed.section ?? null;
      if (section === "null" || section === "") section = null;
    } catch {
      // LLM returned plain text, use as-is
      text = raw;
    }

    return NextResponse.json({ text, section });
  } catch (err) {
    console.error("Groq fetch error:", err);
    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
