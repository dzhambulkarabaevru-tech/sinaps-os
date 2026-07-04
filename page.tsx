// app/settings/page.tsx
// Минимальный набор для v1 — не редактируется через UI (документ 8),
// конфигурация через .env. Осознанное упрощение для одного пользователя.

import Link from "next/link";

export default function SettingsPage() {
  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasDb = Boolean(process.env.SUPABASE_URL);

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", padding: 32, fontFamily: "Onest, sans-serif" }}>
      <Link href="/menu" style={{ color: "#666", textDecoration: "none" }}>← Назад</Link>
      <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, marginTop: 16 }}>Настройки</h1>
      <div style={{ maxWidth: 480, margin: "24px auto", display: "flex", flexDirection: "column", gap: 12 }}>
        <StatusRow label="Claude API" ok={hasApiKey} />
        <StatusRow label="База данных" ok={hasDb} />
        <p style={{ color: "#666", fontSize: 13, marginTop: 16 }}>
          Версия: Синапс OS v1. Конфигурация — через .env.local, см. README проекта.
        </p>
      </div>
    </main>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#111", borderRadius: 4 }}>
      <span>{label}</span>
      <span style={{ color: ok ? "#4caf50" : "#ff5555" }}>{ok ? "подключено" : "не настроено"}</span>
    </div>
  );
}
