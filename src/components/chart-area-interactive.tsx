"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

/* ---------------- helpers ---------------- */

const MONTHS = [
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

function getMonthlyOrders(orders: { price: number; createdAt: Date }[]) {
  const map: Record<string, number> = {};
  MONTHS.forEach((m) => (map[m] = 0));

  orders.forEach((o) => {
    const month = MONTHS[new Date(o.createdAt).getMonth()];
    map[month]++;
  });

  return MONTHS.map((month) => ({
    month,
    value: map[month],
  }));
}

function getMonthlyCustomers(customers: { createdAt: Date }[]) {
  const map: Record<string, number> = {};
  MONTHS.forEach((m) => (map[m] = 0));

  customers.forEach((c) => {
    const month = MONTHS[new Date(c.createdAt).getMonth()];
    map[month]++;
  });

  return MONTHS.map((month) => ({
    month,
    value: map[month],
  }));
}

function getMonthlyRevenue(orders: { price: number; createdAt: Date }[]) {
  const map: Record<string, number> = {};
  MONTHS.forEach((m) => (map[m] = 0));

  orders.forEach((order) => {
    const month = MONTHS[new Date(order.createdAt).getMonth()];
    map[month] += order.price;
  });

  return MONTHS.map((month) => ({
    month,
    value: map[month],
  }));
}

/* ---------------- chart config ---------------- */

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

/* ---------------- main component ---------------- */

export function ChartAreaInteractive({
  orders,
  customers,
}: {
  orders: { price: number; createdAt: Date }[];
  customers: { createdAt: Date }[];
}) {
  const [chart, setChart] = React.useState<"Orders" | "Revenue" | "Customers">("Orders");

  const ordersData = getMonthlyOrders(orders);
  const revenueData = getMonthlyRevenue(orders);
  const customersData = getMonthlyCustomers(customers);

  const data =
    chart === "Orders" ? ordersData : chart === "Revenue" ? revenueData : customersData;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Overview</CardTitle>
        <CardDescription>Monthly data overview</CardDescription>
        <CardAction>
          <ButtonGroup className="hidden @[767px]/card:flex">
            <Button variant="outline" onClick={() => setChart("Orders")}>
              Orders
            </Button>
            <Button variant="outline" onClick={() => setChart("Revenue")}>
              Revenue
            </Button>
            <Button variant="outline" onClick={() => setChart("Customers")}>
              Customers
            </Button>
          </ButtonGroup>

          <Select value={chart} onValueChange={(v) => setChart(v as any)}>
            <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />

            <Area
              dataKey="value"
              type="natural"
              fill="url(#fill)"
              stroke="var(--primary)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
