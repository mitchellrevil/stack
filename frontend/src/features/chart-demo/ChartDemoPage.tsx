import { useState } from "react";
import { ArrowDownToLine, CheckCheck, Inbox, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCharts } from "./hooks/useCharts";
import { ActivityCharts } from "./components/ActivityCharts";
import { ChannelChart } from "./components/ChannelChart";
import { ComponentExamples } from "./components/ComponentExamples";

export function ChartDemoPage() {
  const charts = useCharts();
  const [period, setPeriod] = useState("6");

  if (charts.isPending) {
    return <p role="status">Loading the chart library…</p>;
  }

  if (charts.isError) {
    return (
      <div role="alert">
        <p>We could not load the charts. {charts.error.message}</p>
        <Button className="mt-4" onClick={() => void charts.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  // Cards, charts and the export all use the same selected months.
  const activity = charts.data.activity.slice(-Number(period));
  const totalRequests = activity.reduce(
    (total, month) => total + month.requests,
    0,
  );
  const totalCompleted = activity.reduce(
    (total, month) => total + month.completed,
    0,
  );
  const completionRate = totalRequests
    ? Math.round((totalCompleted / totalRequests) * 100)
    : 0;

  const metrics = [
    {
      title: "Total requests",
      value: totalRequests.toLocaleString("en-GB"),
      icon: Inbox,
    },
    {
      title: "Completed",
      value: totalCompleted.toLocaleString("en-GB"),
      icon: CheckCheck,
    },
    {
      title: "Completion rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
    },
  ];

  function downloadData() {
    // These values come from our typed chart contract; no user text is exported.
    const csv = [
      "Month,Requests,Completed",
      ...activity.map(
        (month) => `${month.month},${month.requests},${month.completed}`,
      ),
    ].join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-activity.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <Tabs defaultValue="charts">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="data">Sample data</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={downloadData}>
              <ArrowDownToLine size={16} /> Export sample data
            </Button>
            <label className="flex items-center gap-3 text-xs text-muted-foreground">
              Period
              <select
                aria-label="Period"
                className="rounded-lg border bg-card px-3 py-2 text-sm text-foreground"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                <option value="6">Last 6 months</option>
                <option value="3">Last 3 months</option>
              </select>
            </label>
          </div>
        </div>
        <TabsContent value="charts" className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.title} className="shadow-none">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                    {metric.title}
                    <metric.icon size={17} />
                  </div>
                  <p className="tabular-nums text-3xl font-semibold tracking-tight">
                    {metric.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ActivityCharts activity={activity} />
            <ChannelChart channels={charts.data.channels} />
          </div>
        </TabsContent>
        <TabsContent value="components">
          <ComponentExamples />
        </TabsContent>
        <TabsContent value="data">
          <div className="overflow-auto rounded-xl border bg-card p-6">
            <table
              aria-label="Sample activity"
              className="w-full text-left text-sm"
            >
              <thead>
                <tr className="border-b">
                  {["Month", "Requests", "Completed"].map((label) => (
                    <th className="py-3" key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activity.map((month) => (
                  <tr key={month.month} className="border-b last:border-0">
                    <th scope="row" className="py-3 font-normal">
                      {month.month}
                    </th>
                    <td>{month.requests}</td>
                    <td>{month.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
