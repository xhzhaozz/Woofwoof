import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, role } = await req.json();

    // 🎭 角色音色映射
    const voiceMap: Record<string, string> = {
      chusheng: "alloy", // 成熟稳重
      lixin: "verse",    // 清亮少年感
    };

    // 🗣️ 陈楚生：南方口语风格指令
    const stylePromptMap: Record<string, string> = {
      chusheng: `
你是一位成熟、温和的男性角色音。
朗读风格：自然、克制、偏叙事感。
语速中等偏慢，句尾略有停顿。
允许非常轻微的南方口语感（例如语气更柔、不过分卷舌），
但不要使用明显方言词，不要夸张，不要模仿具体真人。
      `,
      lixin: `
你是一位年轻、清亮的男性角色音。
朗读风格：情绪感更强，语速略快，
有少年感和起伏变化，但不浮夸。
      `,
    };

    const voice = voiceMap[role] || "alloy";
    const stylePrompt = stylePromptMap[role] || "";

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: `${stylePrompt}\n\n请朗读以下文本：\n${text}`,
      format: "mp3",
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("TTS failed", { status: 500 });
  }
}
