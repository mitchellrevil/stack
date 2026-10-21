import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartSummary } from "../api/charts";

export function ChannelChart({
  channels,
}: {
  channels: ChartSummary["channels"];
}) {
  return (
    <Card className="min-w-0 shadow-none">
      <CardContent>
        <div className="relative">
          <ChartContainer
            config={{ count: { label: "Share" } }}
            className="mx-auto h-[220px] w-full"
            aria-label="Channel share: web 64%, mobile 24%, assisted 12%"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="name" hideLabel />}
              />
              <Pie
                data={channels}
                dataKey="count"
                nameKey="name"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                strokeWidth={0}
                isAnimationActive={false}
              >
                {channels.map((channel) => (
                  <Cell key={channel.name} fill={channel.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">100%</span>
            <span className="mt-1 text-xs text-muted-foreground">
              all channels
            </span>
          </div>
        </div>
        <div className="mt-3 space-y-3">
          {channels.map((channel) => (
            <div
              key={channel.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <i
                  className="size-2 rounded-full"
                  style={{ background: channel.fill }}
                />
                {channel.name}
              </span>
              <span className="tabular-nums font-medium">{channel.count}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
