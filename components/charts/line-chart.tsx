"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
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

const customerData = [
  { month: "Jan", new: 400, returning: 240 },
  { month: "Feb", new: 300, returning: 198 },
  { month: "Mar", new: 500, returning: 300 },
  { month: "Apr", new: 278, returning: 208 },
  { month: "May", new: 189, returning: 306 },
  { month: "Jun", new: 239, returning: 380 },
  { month: "Jul", new: 349, returning: 430 },
  { month: "Aug", new: 278, returning: 510 },
  { month: "Sep", new: 349, returning: 430 },
  { month: "Oct", new: 416, returning: 470 },
  { month: "Nov", new: 490, returning: 500 },
  { month: "Dec", new: 580, returning: 540 },
];

export default function LineChartGraph() {
  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={customerData}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="new"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="returning"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
