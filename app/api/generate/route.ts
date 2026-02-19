import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  const body = await req.json();

  const prompt = `
主题：${body.theme}
情节：${body.plotPoints.join("、")}

人物设定：
${JSON.stringify(body.characters, null, 2)}

文风参考：
${body.styleSample}

请写一段同人小说，避免OOC，字数约${body.wordCount}字。
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: "你是一名专业中文同人小说作者，避免AI腔。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.85
  });

  return NextResponse.json({
    text: completion.choices[0].message.content
  });
}
