// app/api/growth-map/route.ts
import { getGrowthMapStages } from "@/lib/db/queries/context";

export async function GET() {
  const stages = await getGrowthMapStages();
  return Response.json(stages);
}
