import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, role } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text" }, { status: 400 });
    }

    let voice = "alloy";
    let stylePrompt = "";

    if (role === "chusheng") {
      voice = "alloy";
      stylePrompt =
        "语气克制、低沉、偏成熟男性，略带南方口语，不急不缓，有停顿感。";
    }

    if (role === "lixin") {
      voice = "alloy";
      stylePrompt =
        "语速偏快，情绪外放，青年男性，说话更有起伏和感染力。";
    }

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: `${stylePrompt}\n\n请朗读以下文本：\n${text}`,
      // ✅ 不要 format
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
