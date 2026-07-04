// app/page.tsx
// Главный экран. Ровно три действия — вся сложность системы скрыта внутри.

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, position: "relative" }}>
      <Link href="/menu" style={{ position: "absolute", top: 24, right: 24, color: "#666", fontSize: 24, textDecoration: "none" }} aria-label="Меню">
        ≡
      </Link>
      <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: 40, letterSpacing: 1 }}>
        СИНАПС OS
      </h1>
      <nav style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
        <Link href="/create" style={buttonStyle}>Создать путь</Link>
        <Link href="/growth-map" style={buttonStyle}>Карта роста</Link>
        <Link href="/projects" style={buttonStyle}>Мои проекты</Link>
      </nav>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  padding: "18px 24px",
  background: "#111",
  border: "1px solid #F5C518",
  color: "#F5C518",
  fontFamily: "Onest, sans-serif",
  fontWeight: 500,
  fontSize: 18,
  borderRadius: 4,
  textDecoration: "none",
};
