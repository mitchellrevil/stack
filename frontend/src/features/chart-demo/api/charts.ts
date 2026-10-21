// Feature contracts stay beside the feature. The shared client handles HTTP.
import { z } from "zod";
import type { ApiClient } from "@/api/client";

const chartSummarySchema = z.object({
  activity: z.array(
    z.object({
      month: z.string(),
      requests: z.number(),
      completed: z.number(),
    }),
  ),
  channels: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
      fill: z.string(),
    }),
  ),
});

export type ChartSummary = z.infer<typeof chartSummarySchema>;

export function getCharts(api: ApiClient, signal?: AbortSignal) {
  return api.get("/charts", chartSummarySchema, signal);
}
