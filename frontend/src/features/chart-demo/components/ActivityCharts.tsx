// Recharts draws the graphs; shadcn supplies consistent sizing and tooltips.
// Keep the series and colours here, close to the charts which use them.
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";
import type { ChartSummary } from "../api/charts";

const activityChartConfig = {
  requests: { label: "Requests", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ActivityCharts({
  activity,
}: {
  activity: ChartSummary["activity"];
}) {
  return (
    <>
      <Card className="min-w-0 shadow-none lg:col-span-2">
        <CardContent>
          <ChartContainer
            config={activityChartConfig}
            className="h-[280px] w-full"
            aria-label="Monthly requests and completed requests"
          >
            <AreaChart
              accessibilityLayer
              data={activity}
              margin={{ left: 0, right: 12, top: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="requestsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-requests)"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-requests)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 4" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <YAxis tickLine={false} axisLine={false} width={35} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="var(--color-requests)"
                fill="url(#requestsFill)"
                strokeWidth={2.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="var(--color-completed)"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="5 4"
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
          <div className="mt-5 flex gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <i className="size-2 rounded-full bg-primary" />
              Requests
            </span>
            <span className="flex items-center gap-2">
              <i className="size-2 rounded-full bg-[var(--chart-2)]" />
              Completed
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="min-w-0 shadow-none">
        <CardContent>
          <ChartContainer
            config={activityChartConfig}
            className="h-[240px] w-full"
            aria-label="Monthly request comparison"
          >
            <BarChart accessibilityLayer data={activity}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="requests"
                fill="var(--color-requests)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="completed"
                fill="var(--color-completed)"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
