"use client";

import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Orders",
    color: "oklch(var(--chart-3))",
  },
} satisfies ChartConfig;

function transformOrdersToRevenueData(orders: { price: number; createdAt: Date }[]) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenueMap: { [key: string]: { count: number } } = {};

  months.forEach((month) => (revenueMap[month] = { count: 0 }));

  orders.forEach((order) => {
    const month = months[new Date(order.createdAt).getMonth()];
    revenueMap[month].count += 1;
  });

  return months.map((month) => ({
    month,
    count: revenueMap[month].count,
  }));
}

export default function BarChartGraph({
  orders,
}: {
  orders: { price: number; createdAt: Date }[];
}) {
  const revenueData = transformOrdersToRevenueData(orders);
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <XAxis dataKey="month" />
          <YAxis dataKey={"count"} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
