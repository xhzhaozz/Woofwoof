"use client";

import { useState } from "react";

export default function Page() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme: "重逢后的克制",
        plotPoints: ["久别重逢", "未说出口的情绪"],
        wordCount: 600,
        characters: [
          {
            name: "A",
            personalityCore: "冷静克制、情绪内敛",
            speakingStyle: "短句、少解释",
            behaviorPattern: "用行动代替语言"
          },
          {
            name: "B",
            personalityCore: "温和敏感、情绪外显",
            speakingStyle: "语气委婉，容易停顿",
            behaviorPattern: "反复确认对方态度"
          }
        ],
        styleSample: "他站在门口，没有立刻进来。灯光落在他肩上，像迟疑本身。"
      })
    });

    const data = await res.json();
    setResult(data.text);
    setLoading(false);
  }

  return (
    <main style={{ padding: 20 }}>
      <button onClick={generate}>
        {loading ? "生成中…" : "生成同人文"}
      </button>
      <textarea
        value={result}
        readOnly
        rows={25}
        style={{ width: "100%", marginTop: 12 }}
      />
    </main>
  );
}
