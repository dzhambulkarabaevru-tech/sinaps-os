// app/api/create-path/route.ts
// Единственная точка входа фронтенда в пайплайн M0–M10.
// Стримит прогресс через SSE, чтобы статус-экран честно показывал этапы
// (см. архитектуру v2.1, п.7.4) вместо одного долгого ожидания.

import { runPipeline } from "@/lib/pipeline/orchestrator";
import type { PipelineProgressEvent } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let thought: string;
  try {
    const body = (await req.json()) as { thought?: string };
    thought = body.thought ?? "";
  } catch {
    return new Response(JSON.stringify({ error: "Некорректный JSON в теле запроса" }), { status: 400 });
  }

  if (!thought || thought.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Пустая мысль" }), { status: 400 });
  }
  if (thought.length > 2000) {
    return new Response(JSON.stringify({ error: "Мысль слишком длинная (максимум 2000 символов)" }), { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      const onProgress = (e: PipelineProgressEvent) => send("progress", e);

      try {
        const result = await runPipeline(thought, onProgress);
        send("result", result);
      } catch (err) {
        send("error", { message: (err as Error).message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
