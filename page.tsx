"use client";
// app/create/page.tsx
// «Создать путь». Единственное поле ввода — мысль. Дальше конвейер M0→M10
// без ручного управления (архитектура, сценарий 3.1; UX — документ 8).

import { useState } from "react";
import { PipelineStatus } from "@/components/PipelineStatus";
import { EditorialResponse } from "@/components/EditorialResponse";
import type { PipelineProgressEvent, PipelineResult } from "@/lib/types";

const MAX_THOUGHT_LENGTH = 2000;

export default function CreatePathPage() {
  const [thought, setThought] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<PipelineProgressEvent | null>(null);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consecutiveRejections, setConsecutiveRejections] = useState(0);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  async function runCreate(thoughtToSubmit: string) {
    setIsRunning(true);
    setResult(null);
    setError(null);

    const response = await fetch("/api/create-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thought: thoughtToSubmit }),
    });

    if (!response.body) {
      setError("network");
      setIsRunning(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let rejectionsThisRun = consecutiveRejections;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const raw of events) {
        const eventMatch = raw.match(/^event: (\w+)/m);
        const dataMatch = raw.match(/^data: (.+)$/m);
        if (!eventMatch || !dataMatch) continue;

        const eventName = eventMatch[1];
        const dataStr = dataMatch[1];
        if (!eventName || dataStr === undefined) continue;
        const data = JSON.parse(dataStr);

        if (eventName === "progress") setProgress(data);
        if (eventName === "result") {
          setResult(data);
          rejectionsThisRun = data.kind === "editorial_response" ? rejectionsThisRun + 1 : 0;
          setConsecutiveRejections(rejectionsThisRun);
        }
        if (eventName === "error") setError("pipeline");
      }
    }

    setIsRunning(false);
  }

  function handleSubmit() {
    void runCreate(thought);
  }

  function handleRetry(newThought: string) {
    setThought(newThought);
    setResult(null);
    if (newThought) void runCreate(newThought);
  }

  function handleCopy(type: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  }

  const isTooLong = thought.length > MAX_THOUGHT_LENGTH;

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", padding: 32, fontFamily: "Onest, sans-serif" }}>
      {!isRunning && !result && !error && (
        <div style={{ maxWidth: 560, margin: "80px auto" }}>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Поделись мыслью…"
            rows={4}
            style={{ width: "100%", background: "#111", color: "#fff", border: "1px solid #333", borderRadius: 4, padding: 16, fontSize: 16 }}
          />
          <div style={{ textAlign: "right", fontSize: 12, color: isTooLong ? "#ff5555" : "#555", marginTop: 4 }}>
            {thought.length} / {MAX_THOUGHT_LENGTH}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!thought.trim() || isTooLong}
            style={{
              marginTop: 8, width: "100%", padding: 16, borderRadius: 4, fontWeight: 700, fontSize: 16, border: "none",
              background: !thought.trim() || isTooLong ? "#333" : "#F5C518",
              color: !thought.trim() || isTooLong ? "#777" : "#080808",
            }}
          >
            Создать
          </button>
        </div>
      )}

      {isRunning && progress && <PipelineStatus progress={progress} />}

      {error && (
        <div style={{ maxWidth: 400, margin: "120px auto", textAlign: "center" }}>
          <p style={{ color: "#fff" }}>Что-то пошло не так, попробуй ещё раз</p>
          <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => { setError(null); void runCreate(thought); }}
              style={{ padding: "10px 20px", background: "#F5C518", color: "#080808", border: "none", borderRadius: 4 }}
            >
              Повторить
            </button>
            <button
              onClick={() => setError(null)}
              style={{ padding: "10px 20px", background: "none", border: "1px solid #555", color: "#aaa", borderRadius: 4 }}
            >
              Изменить мысль
            </button>
          </div>
        </div>
      )}

      {result?.kind === "editorial_response" && (
        <EditorialResponse output={result.output} onRetry={handleRetry} consecutiveRejections={consecutiveRejections} />
      )}

      {result?.kind === "project_created" && (
        <div style={{ maxWidth: 720, margin: "40px auto" }}>
          <h2>Комплект готов</h2>

          {result.materials.map((m, i) => (
            <div key={i} style={{ marginTop: 24, padding: 16, background: "#111", borderRadius: 4, position: "relative" }}>
              <strong style={{ color: "#F5C518" }}>{m.type}</strong>
              <button
                onClick={() => handleCopy(m.type, m.content)}
                style={{ position: "absolute", top: 16, right: 16, background: "none", border: "1px solid #333", color: "#aaa", borderRadius: 4, padding: "4px 10px", fontSize: 12 }}
              >
                {copiedType === m.type ? "Скопировано" : "Скопировать"}
              </button>
              <p style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{m.content}</p>
            </div>
          ))}

          <button
            onClick={() => { setResult(null); setThought(""); setConsecutiveRejections(0); }}
            style={{ marginTop: 24, padding: "12px 24px", background: "none", border: "1px solid #F5C518", color: "#F5C518", borderRadius: 4 }}
          >
            Создать ещё один путь
          </button>
        </div>
      )}
    </main>
  );
}
