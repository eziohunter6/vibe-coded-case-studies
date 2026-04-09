import { NextRequest, NextResponse } from "next/server";

// ── Voice description for Parler-TTS ──────────────────────────────────────────
// Targets: calm, mid-20s Indian male, natural accent, warm and relaxed delivery.
const VOICE_DESCRIPTION =
  "A calm, warm Indian male voice in his mid-twenties. He speaks softly and clearly with a gentle South Asian accent, measured pace, and a relaxed, reassuring tone. The recording is clean and close-mic'd with no background noise.";

// ── Model priority list ────────────────────────────────────────────────────────
// 1. Parler-TTS mini — conditional voice via natural-language description
// 2. Kokoro-82M — multi-voice model, British male as calm fallback
const MODELS = [
  {
    id: "parler-tts/parler-tts-mini-v1",
    label: "Parler-TTS (Indian male)",
    body: (text: string) =>
      JSON.stringify({
        inputs: text,
        parameters: { description: VOICE_DESCRIPTION },
      }),
  },
  {
    id: "hexgrad/Kokoro-82M",
    label: "Kokoro (British male fallback)",
    body: (text: string) =>
      JSON.stringify({
        inputs: text,
        parameters: { voice: "bm_lewis" },
      }),
  },
];

async function tryModel(
  token: string,
  modelId: string,
  body: string
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const res = await fetch(
    `https://api-inference.huggingface.co/models/${modelId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
      // HF TTS models can take 10–20 s on first request (cold start)
      signal: AbortSignal.timeout(30_000),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`HF [${modelId}] ${res.status}:`, err);
    return null;
  }

  const contentType =
    res.headers.get("content-type") ?? "audio/flac";
  const buffer = await res.arrayBuffer();

  // Sanity-check: HF returns JSON errors even with a 200 in rare cases
  if (buffer.byteLength < 512) {
    console.error(`HF [${modelId}] suspiciously small response (${buffer.byteLength} bytes)`);
    return null;
  }

  return { buffer, contentType };
}

export async function POST(req: NextRequest) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "HF_TOKEN is not configured." },
      { status: 500 }
    );
  }

  let text: string;
  try {
    const body = await req.json();
    text = body.text?.trim();
    if (!text) throw new Error("empty");
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  for (const model of MODELS) {
    const result = await tryModel(token, model.id, model.body(text));
    if (result) {
      console.log(`HF TTS: using ${model.label}`);
      return new NextResponse(result.buffer, {
        headers: {
          "Content-Type": result.contentType,
          "Content-Length": String(result.buffer.byteLength),
        },
      });
    }
  }

  return NextResponse.json(
    { error: "All TTS models failed. Check HF_TOKEN and model availability." },
    { status: 502 }
  );
}
