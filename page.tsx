// app/projects/page.tsx
import { db } from "@/lib/db/client";
import Link from "next/link";

export default async function ProjectsPage() {
  const { data: projects } = await db
    .from("projects")
    .select("id, thought_refined, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", padding: 32, fontFamily: "Onest, sans-serif" }}>
      <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900 }}>Мои проекты</h1>
      <div style={{ maxWidth: 560, margin: "24px auto" }}>
        {(projects ?? []).length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
            <p>Пока нет ни одного пути. Начни с мысли</p>
            <Link href="/create" style={{ display: "inline-block", marginTop: 16, padding: "10px 20px", background: "#F5C518", color: "#080808", borderRadius: 4, textDecoration: "none", fontWeight: 700 }}>
              Создать путь
            </Link>
          </div>
        )}
        {(projects ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/projects/${p.id}`}
            style={{ display: "block", padding: 16, marginBottom: 8, background: "#111", color: "#fff", textDecoration: "none", borderRadius: 4 }}
          >
            <div>{p.thought_refined}</div>
            <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{p.status} · {new Date(p.created_at).toLocaleDateString("ru-RU")}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
