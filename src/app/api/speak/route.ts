import { NextRequest, NextResponse } from "next/server";

// ── ElevenLabs ────────────────────────────────────────────────────────────────
// Re-enable by setting ELEVENLABS_API_KEY in .env.local / Vercel env vars.
// Free tier: 10,000 chars/month, resets on billing anniversary.
// Create a new account at elevenlabs.io if quota is exhausted.
const ELEVENLABS_VOICES = [
  { id: "uVZW0wfQfYdBFVa48V9i", label: "Utkarsh (custom)" },
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah (fallback)" },
];

async function tryElevenLabs(
  apiKey: string,
  voiceId: string,
  text: string
): Promise<ArrayBuffer | null> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    }
  );
  if (!res.ok) {
    console.error(`ElevenLabs [${voiceId}] ${res.status}:`, await res.text());
    return null;
  }
  return res.arrayBuffer();
}

export async function POST(req: NextRequest) {
  let text: string;
  try {
    const body = await req.json();
    text = body.text?.trim();
    if (!text) throw new Error("empty");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // ── Try ElevenLabs if key is set ─────────────────────────────────────────
  const elevenKey = process.env.ELEVENLABS_API_KEY;
  if (elevenKey) {
    for (const voice of ELEVENLABS_VOICES) {
      const audio = await tryElevenLabs(elevenKey, voice.id, text);
      if (audio) {
        console.log(`TTS: ElevenLabs ${voice.label}`);
        return new NextResponse(audio, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": String(audio.byteLength),
          },
        });
      }
    }
  }

  // ── No working API — tell client to use browser TTS ──────────────────────
  // VoiceAgent.tsx catches non-ok responses and falls back to
  // window.speechSynthesis (Rishi / Google Indian English / system default).
  return NextResponse.json(
    { error: "No TTS API key configured. Using browser speech synthesis." },
    { status: 503 }
  );
}
