import { NextRequest, NextResponse } from "next/server";
import { site, projects } from "@/content/portfolio";

const SYSTEM_PROMPT = `You are a helpful voice assistant on the portfolio website of ${site.name}, a ${site.title} with ${site.yearsExperience} of experience based in ${site.location}.

Answer questions from recruiters, designers, and hiring managers about Utkarsh's work, process, and background. Keep answers concise, they will be read aloud. Aim for 2–4 sentences unless asked for more detail.

Speak confidently as Utkarsh's knowledgeable representative. If you don't know something, say so clearly.

About Utkarsh:
${site.heroSupporting.join(" ")}

Portfolio:
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

Contact: ${site.contact.email} | LinkedIn: ${site.contact.linkedin}`;

export async function POST(_req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  if (!apiKey) {
    return NextResponse.json({ error: "ELEVENLABS_API_KEY not set." }, { status: 500 });
  }
  if (!agentId) {
    return NextResponse.json({ error: "ELEVENLABS_AGENT_ID not set." }, { status: 500 });
  }

  // Get a short-lived signed URL so the API key never reaches the browser
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
    { headers: { "xi-api-key": apiKey } }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("ElevenLabs signed URL error:", err);
    return NextResponse.json({ error: "Failed to get signed URL." }, { status: res.status });
  }

  const { signed_url } = await res.json();

  // Patch the system prompt dynamically
  return NextResponse.json({ signed_url, systemPrompt: SYSTEM_PROMPT });
}
