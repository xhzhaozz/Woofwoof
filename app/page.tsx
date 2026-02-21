"use client"; 

import { useState } from "react";

export default function Page() {
  const [theme, setTheme] = useState("");
  const [plot, setPlot] = useState("");
  const [styleSample, setStyleSample] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ttsLoading, setTtsLoading] = useState<null | "chusheng" | "lixin">(null);

  // 功能一：生成同人文（原样保留）
  async function generate() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          plotPoints: plot.split("，").filter(Boolean),
          wordCount: 800,
          characters: [
            {
              name: "陈楚生",
              personalityCore: "克制、冷静、习惯把情绪藏起来",
              speakingStyle: "话不多，语气平稳，偶尔一针见血",
              behaviorPattern: "更倾向于照顾别人而不是表达自己",
            },
            {
              name: "王栎鑫",
              personalityCore: "外放、敏感、情绪直接",
              speakingStyle: "说话快，情绪起伏明显",
              behaviorPattern: "会主动靠近、试探对方态度",
            },
          ],
          styleSample,
        }),
      });

      const data = await res.json();
      setResult(data.text || "（生成失败，没有返回内容）");
    } catch (e) {
      setError("生成失败，请稍后重试");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>同人文生成｜陈楚生 × 王栎鑫</h2>

      <div style={{ marginTop: 12 }}>
        <label>主题</label>
        <input
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>情节关键词（用中文逗号分隔）</label>
        <input
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>文风参考段落</label>
        <textarea
          value={styleSample}
          onChange={(e) => setStyleSample(e.target.value)}
          rows={6}
          style={{ width: "100%" }}
        />
      </div>

      <button
        onClick={generate}
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? "生成中，请稍等…" : "生成同人文"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <textarea
        value={result}
        readOnly
        rows={25}
        style={{ width: "100%", marginTop: 16 }}
      />

    </main>
  );
}
