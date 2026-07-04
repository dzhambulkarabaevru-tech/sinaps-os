// app/menu/page.tsx
// Второстепенное меню — Библиотека и Настройки не входят в три главных
// действия архитектуры v2.1, доступны отдельно (см. документ 8, примечание).

import Link from "next/link";

export default function MenuPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", padding: 32, fontFamily: "Onest, sans-serif" }}>
      <Link href="/" style={{ color: "#666", textDecoration: "none" }}>← Назад</Link>
      <div style={{ maxWidth: 320, margin: "60px auto 0", display: "flex", flexDirection: "column", gap: 16 }}>
        <Link href="/library" style={{ padding: 16, background: "#111", border: "1px solid #333", color: "#fff", textDecoration: "none", borderRadius: 4, textAlign: "center" }}>
          Библиотека
        </Link>
        <Link href="/settings" style={{ padding: 16, background: "#111", border: "1px solid #333", color: "#fff", textDecoration: "none", borderRadius: 4, textAlign: "center" }}>
          Настройки
        </Link>
      </div>
    </main>
  );
}
