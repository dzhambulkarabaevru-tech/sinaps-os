// app/growth-map/page.tsx
// Зеркало того, что уже собрано в системе — не создание, а навигация
// по экосистеме (см. архитектуру, сценарий 3.2).

import { getGrowthMapStages } from "@/lib/db/queries/context";

export default async function GrowthMapPage() {
  const stages = await getGrowthMapStages();

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", padding: 32, fontFamily: "Onest, sans-serif" }}>
      <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900 }}>Карта роста</h1>
      <ol style={{ maxWidth: 560, margin: "24px auto", padding: 0, listStyle: "none" }}>
        {stages.map((stage) => (
          <li key={stage.id} style={{ padding: 16, marginBottom: 8, background: "#111", borderLeft: "3px solid #F5C518" }}>
            <strong>{stage.order}. {stage.name}</strong>
            {stage.description && <p style={{ color: "#888", marginTop: 4 }}>{stage.description}</p>}
            <p style={{ color: "#555", fontSize: 13, marginTop: 4 }}>Пока нет материалов на этом этапе</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
