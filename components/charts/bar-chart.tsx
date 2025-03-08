"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-3))",
  },
  new: {
    label: "New Customers",
    color: "hsl(var(--chart-4))",
  },
  returning: {
    label: "Returning Customers",
    color: "hsl(var(--chart-5))",
  },
};

const revenueData = [
  { month: "Jan", revenue: 4000, profit: 2400, orders: 240 },
  { month: "Feb", revenue: 3000, profit: 1398, orders: 210 },
  { month: "Mar", revenue: 9800, profit: 2800, orders: 290 },
  { month: "Apr", revenue: 3908, profit: 2000, orders: 200 },
  { month: "May", revenue: 4800, profit: 2600, orders: 278 },
  { month: "Jun", revenue: 3800, profit: 2000, orders: 189 },
  { month: "Jul", revenue: 5000, profit: 3000, orders: 239 },
  { month: "Aug", revenue: 4000, profit: 2400, orders: 234 },
  { month: "Sep", revenue: 7000, profit: 4300, orders: 278 },
  { month: "Oct", revenue: 6000, profit: 3700, orders: 256 },
  { month: "Nov", revenue: 8000, profit: 4900, orders: 290 },
  { month: "Dec", revenue: 9000, profit: 5400, orders: 345 },
];

export default function BarChartGraph() {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={revenueData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="orders"
            fill="hsl(var(--chart-3))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
