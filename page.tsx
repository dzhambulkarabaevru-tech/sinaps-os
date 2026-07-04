// app/library/page.tsx
// Просмотр контентной библиотеки (документ 6). Только просмотр в v1 —
// пополнение через тебя напрямую, не через UI-форму (документ 6).

import Link from "next/link";
import fs from "node:fs/promises";
import path from "node:path";

const CATEGORIES: Array<{ key: string; file: string; label: string }> = [
  { key: "observation", file: "observations.json", label: "Наблюдения" },
  { key: "story", file: "stories.json", label: "Истории" },
  { key: "mistake", file: "mistakes.json", label: "Ошибки" },
  { key: "myth", file: "myths.json", label: "Мифы" },
  { key: "situation", file: "situations.json", label: "Ситуации" },
  { key: "dialogue", file: "dialogues.json", label: "Диалоги" },
  { key: "reflection", file: "reflections.json", label: "Размышления" },
];

export default async function LibraryPage() {
  const root = path.join(process.cwd(), "knowledge-base", "content-library");
  const allEntries = await Promise.all(
    CATEGORIES.map(async (c) => {
      const raw = await fs.readFile(path.join(root, c.file), "utf-8").catch(() => "[]");
      return { ...c, entries: JSON.parse(raw) as Array<{ id: string; text: string; themes: string[]; usedCount: number }> };
    })
  );

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", padding: 32, fontFamily: "Onest, sans-serif" }}>
      <Link href="/menu" style={{ color: "#666", textDecoration: "none" }}>← Назад</Link>
      <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, marginTop: 16 }}>Библиотека</h1>
      <div style={{ maxWidth: 720, margin: "24px auto" }}>
        {allEntries.map((cat) => (
          <div key={cat.key} style={{ marginBottom: 32 }}>
            <h3 style={{ color: "#F5C518" }}>{cat.label}</h3>
            {cat.entries.map((e) => (
              <div key={e.id} style={{ padding: 12, background: "#111", borderRadius: 4, marginTop: 8 }}>
                <p>{e.text}</p>
                <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
                  {e.themes.join(", ")} · использовано {e.usedCount} раз
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
