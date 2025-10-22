import AreaChartGraph from "@/components/charts/area-chart";
import BarChartGraph from "@/components/charts/bar-chart";
import LineChartGraph from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db/instance";
import { formatCurrency, sleep } from "@/lib/utils";
import { and, desc, eq, gte } from "drizzle-orm";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  IndianRupee,
  LineChart,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Suspense } from "react";
import RecentOrdersTable from "./_components/recent-orders-table";
import { cacheLife } from "next/cache";

const links = [
  {
    label: "Home",
    href: "/",
  },
];

async function calculateRevenueStats(orders: { price: number; createdAt: Date }[]) {
  "use cache";
  cacheLife("seconds");
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthRevenue = orders
    .filter((order) => order.createdAt >= firstDayCurrentMonth)
    .reduce((acc, order) => acc + order.price, 0);

  const previousMonthRevenue = orders
    .filter(
      (order) =>
        order.createdAt >= firstDayPreviousMonth &&
        order.createdAt < firstDayCurrentMonth,
    )
    .reduce((acc, order) => acc + order.price, 0);

  const profitLossPercentage =
    previousMonthRevenue === 0
      ? 0
      : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  return {
    currentMonthRevenue,
    previousMonthRevenue,
    profitLossPercentage: parseFloat(profitLossPercentage.toFixed(1)),
  };
}

async function calculateOrderStats(orders: { createdAt: Date }[]) {
  "use cache";
  cacheLife("seconds");
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthOrders = orders.filter(
    (order) => order.createdAt >= firstDayCurrentMonth,
  ).length;

  const previousMonthOrders = orders.filter(
    (order) =>
      order.createdAt >= firstDayPreviousMonth && order.createdAt < firstDayCurrentMonth,
  ).length;

  const orderChangePercentage =
    previousMonthOrders === 0
      ? 0
      : ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100;

  return {
    currentMonthOrders,
    previousMonthOrders,
    orderChangePercentage: parseFloat(orderChangePercentage.toFixed(1)),
  };
}

async function calculateCustomerStats(users: { createdAt: Date }[]) {
  "use cache";
  cacheLife("seconds");
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthCustomers = users.filter(
    (user) => user.createdAt >= firstDayCurrentMonth,
  ).length;

  const previousMonthCustomers = users.filter(
    (user) =>
      user.createdAt >= firstDayPreviousMonth && user.createdAt < firstDayCurrentMonth,
  ).length;

  const customerChangePercentage =
    previousMonthCustomers === 0
      ? 0
      : ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;

  return {
    currentMonthCustomers,
    previousMonthCustomers,
    customerChangePercentage: parseFloat(customerChangePercentage.toFixed(1)),
  };
}

async function getAllOrders() {
  "use cache";
  cacheLife("seconds");
  return await db.query.order.findMany({
    where: (order) =>
      and(
        eq(order.paymentSuccess, true),
        gte(
          order.createdAt,
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        ),
      ),
    with: {
      user: true,
    },
    orderBy: (order) => desc(order.createdAt),
  });
}

async function getAllCustomers() {
  "use cache";
  cacheLife("seconds");
  return await db.query.user.findMany({
    where: (user) =>
      and(
        eq(user.role, "user"),
        gte(
          user.createdAt,
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        ),
      ),
    columns: {
      createdAt: true,
    },
  });
}

export default async function AdminPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SuspenseWrapper />
    </Suspense>
  );
}

async function SuspenseWrapper() {
  // await sleep(3);
  const [allOrders, allUsers] = await Promise.all([getAllOrders(), getAllCustomers()]);
  const { profitLossPercentage } = await calculateRevenueStats(allOrders);
  const { orderChangePercentage } = await calculateOrderStats(allOrders);
  const { customerChangePercentage } = await calculateCustomerStats(allUsers);
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="w-full flex-1 p-4 pt-0">
        <div className="grid gap-4 whitespace-nowrap md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Revenue
              </CardTitle>
              <IndianRupee className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-2xl font-bold">
                Rs.{" "}
                {formatCurrency(
                  allOrders
                    .filter(
                      (order) =>
                        order.createdAt >=
                        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    )
                    .reduce((acc, order) => acc + order.price, 0),
                )}
              </div>
              <div className="text-muted-foreground flex items-center text-xs">
                {profitLossPercentage > 0 ? (
                  <ArrowUp className={`mr-1 h-4 w-4 text-emerald-500`} />
                ) : (
                  <ArrowDown className={`text-destructive mr-1 h-4 w-4`} />
                )}
                <span
                  className={`${
                    profitLossPercentage > 0 ? "text-emerald-500" : "text-destructive"
                  }`}
                >
                  {profitLossPercentage > 0 ? "+" : "-"}
                  {profitLossPercentage.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Orders
              </CardTitle>
              <ShoppingCart className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-2xl font-bold">
                +{allOrders.length.toLocaleString()}
              </div>
              <div className="text-muted-foreground flex items-center text-xs">
                {orderChangePercentage > 0 ? (
                  <ArrowUp className={`mr-1 h-4 w-4 text-emerald-500`} />
                ) : (
                  <ArrowDown className={`text-destructive mr-1 h-4 w-4`} />
                )}
                <span
                  className={`${
                    orderChangePercentage > 0 ? "text-emerald-500" : "text-destructive"
                  }`}
                >
                  {orderChangePercentage > 0 ? "+" : "-"}
                  {orderChangePercentage.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Customers
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-2xl font-bold">
                +
                {allUsers
                  .filter(
                    (user) =>
                      user.createdAt >=
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  )
                  .length.toLocaleString()}
              </div>
              <div className="text-muted-foreground flex items-center text-xs">
                {customerChangePercentage > 0 ? (
                  <ArrowUp className={`mr-1 h-4 w-4 text-emerald-500`} />
                ) : (
                  <ArrowDown className={`text-destructive mr-1 h-4 w-4`} />
                )}
                <span
                  className={`${
                    customerChangePercentage > 0 ? "text-emerald-500" : "text-destructive"
                  }`}
                >
                  {customerChangePercentage > 0 ? "+" : "-"}
                  {customerChangePercentage.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 space-y-4">
          <Tabs defaultValue="revenue" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="bg-background">
                <TabsTrigger value="revenue" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Revenue</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Customers</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="revenue" className="space-y-4">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Monthly Orders</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <BarChartGraph orders={allOrders} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders" className="space-y-4">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">Revenue</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <AreaChartGraph orders={allOrders} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customers" className="space-y-4">
              <Card className="bg-background">
                <CardHeader>
                  <CardTitle className="text-muted-foreground">
                    Customer Acquisition
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <LineChartGraph customers={allUsers} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full flex-1 overflow-x-hidden">
          <RecentOrdersTable orders={allOrders} />
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="w-full flex-1 p-4 pt-0">
        <div className="text-primary-foreground grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-24" />
                <div className="flex items-center">
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 space-y-4 overflow-x-hidden">
          <Tabs defaultValue="revenue" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger disabled value="revenue" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger disabled value="orders" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Revenue</span>
                </TabsTrigger>
                <TabsTrigger
                  disabled
                  value="customers"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Customers</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-6 w-40" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <div className="aspect-[3/1] min-h-[300px] w-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-4 w-full flex-1 overflow-x-hidden">
          <Card>
            <CardContent className="p-0">
              <div className="border-border flex items-center justify-between border-b p-4">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-9 w-36" />
              </div>
              <div className="border-border grid grid-cols-5 gap-4 border-b p-4 text-sm font-medium">
                <Skeleton className="h-5 w-20 flex-1" />
                <Skeleton className="h-5 w-24 flex-1" />
                <Skeleton className="h-5 w-16 flex-1" />
                <Skeleton className="h-5 w-20 flex-1" />
                <Skeleton className="h-5 w-16 flex-1" />
              </div>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="border-border grid grid-cols-5 gap-4 border-b p-4 text-sm"
                >
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                  <div>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 text-sm">
                <Skeleton className="h-5 w-40" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
