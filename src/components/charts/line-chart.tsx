"use client";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartConfig = {
  new: {
    label: "New",
    color: "hsl(var(--chart-4))",
  },
};

function getMonthlyCustomerData(customers: { createdAt: Date }[]) {
  const monthlyCounts: Record<string, number> = {};

  customers.forEach(({ createdAt }) => {
    const month = new Date(createdAt).toLocaleString("en-US", {
      month: "short",
    });

    if (!monthlyCounts[month]) {
      monthlyCounts[month] = 0;
    }
    monthlyCounts[month]++;
  });

  const monthOrder = [
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

  return monthOrder.map((month) => ({
    month,
    new: monthlyCounts[month] || 0,
  }));
}

export default function LineChartGraph({
  customers,
}: {
  customers: {
    createdAt: Date;
  }[];
}) {
  const customerData = getMonthlyCustomerData(customers);
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
          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="new"
            stroke="hsl(var(--chart-5))"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
