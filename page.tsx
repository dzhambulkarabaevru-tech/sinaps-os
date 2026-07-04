// app/projects/[id]/page.tsx
import { db } from "@/lib/db/client";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { data: project } = await db.from("projects").select("*").eq("id", params.id).single();
  const { data: materials } = await db.from("materials").select("*").eq("project_id", params.id);

  if (!project) {
    return <main style={{ padding: 32, color: "#fff", background: "#080808" }}>Проект не найден</main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", padding: 32, fontFamily: "Onest, sans-serif" }}>
      <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900 }}>{project.thought_refined}</h1>
      <div style={{ maxWidth: 720, margin: "24px auto" }}>
        {(materials ?? []).map((m) => (
          <div key={m.id} style={{ marginTop: 16, padding: 16, background: "#111", borderRadius: 4 }}>
            <strong style={{ color: "#F5C518" }}>{m.type}</strong>
            <p style={{ whiteSpace: "pre-wrap" }}>{m.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
