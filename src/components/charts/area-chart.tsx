"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
};

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

  const revenueMap: { [key: string]: { revenue: number; count: number } } = {};
  months.forEach((month) => (revenueMap[month] = { revenue: 0, count: 0 }));
  orders.forEach((order) => {
    const month = months[new Date(order.createdAt).getMonth()];
    revenueMap[month].revenue += order.price;
    revenueMap[month].count += 1;
  });

  return months.map((month) => ({
    month,
    revenue: revenueMap[month].revenue,
  }));
}

export default function AreaChartGraph({
  orders,
}: {
  orders: { price: number; createdAt: Date }[];
}) {
  const revenueData = transformOrdersToRevenueData(orders);
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={revenueData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--chart-1))"
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="hsl(var(--chart-2))"
            fillOpacity={1}
            fill="url(#colorProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
