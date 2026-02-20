import { NextResponse } from "next/server"; 
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    // ✅ 放到函数里
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const { text, voice } = await req.json();

    const stylePrompt =
      voice === "陈楚生"
        ? "语气克制、偏南方口语，语速稍慢，情绪内敛。"
        : "语速偏快，情绪起伏明显，说话带点撒娇和试探。";

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: `${stylePrompt}\n\n请朗读以下文本：\n${text}`,
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "tts failed" },
      { status: 500 }
    );
  }
}
