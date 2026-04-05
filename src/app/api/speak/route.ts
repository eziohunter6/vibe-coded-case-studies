import { NextRequest, NextResponse } from "next/server";

// Voice priority list — tries each in order until one succeeds
// Utkarsh: custom generated voice on this account
// Sarah: premade fallback confirmed on this account
const VOICE_PRIORITY = [
  { id: "uVZW0wfQfYdBFVa48V9i", label: "Utkarsh" },
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah" },
];

async function trySpeak(
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
    const err = await res.text();
    console.error(`ElevenLabs [${voiceId}] ${res.status}:`, err);
    return null;
  }

  return res.arrayBuffer();
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let text: string;
  try {
    const body = await req.json();
    text = body.text?.trim();
    if (!text) throw new Error("empty");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Try each voice in priority order
  for (const voice of VOICE_PRIORITY) {
    const audio = await trySpeak(apiKey, voice.id, text);
    if (audio) {
      console.log(`ElevenLabs: using voice ${voice.label} (${voice.id})`);
      return new NextResponse(audio, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(audio.byteLength),
        },
      });
    }
  }

  // Both voices failed
  return NextResponse.json(
    { error: "All TTS voices failed. Check ELEVENLABS_API_KEY and voice availability." },
    { status: 502 }
  );
}
