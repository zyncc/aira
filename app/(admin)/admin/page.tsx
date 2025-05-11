import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  DollarSign,
  LineChart,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentOrdersTable from "@/components/admin-tables/home/recentOrdersTable";
import AreaChartGraph from "@/components/charts/area-chart";
import LineChartGraph from "@/components/charts/line-chart";
import BarChartGraph from "@/components/charts/bar-chart";
import prisma from "@/lib/prisma";
import formatCurrency from "@/lib/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const links = [
  {
    label: "Home",
    href: "/admin",
  },
];

export const dynamic = "force-dynamic";

function calculateRevenueStats(orders: { price: number; createdAt: Date }[]) {
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const currentMonthRevenue = orders
    .filter((order) => order.createdAt >= firstDayCurrentMonth)
    .reduce((acc, order) => acc + order.price, 0);

  const previousMonthRevenue = orders
    .filter(
      (order) =>
        order.createdAt >= firstDayPreviousMonth &&
        order.createdAt < firstDayCurrentMonth
    )
    .reduce((acc, order) => acc + order.price, 0);

  const profitLossPercentage =
    previousMonthRevenue === 0
      ? 0
      : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
        100;

  return {
    currentMonthRevenue,
    previousMonthRevenue,
    profitLossPercentage: parseFloat(profitLossPercentage.toFixed(1)),
  };
}

function calculateOrderStats(orders: { createdAt: Date }[]) {
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const currentMonthOrders = orders.filter(
    (order) => order.createdAt >= firstDayCurrentMonth
  ).length;

  const previousMonthOrders = orders.filter(
    (order) =>
      order.createdAt >= firstDayPreviousMonth &&
      order.createdAt < firstDayCurrentMonth
  ).length;

  const orderChangePercentage =
    previousMonthOrders === 0
      ? 0
      : ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) *
        100;

  return {
    currentMonthOrders,
    previousMonthOrders,
    orderChangePercentage: parseFloat(orderChangePercentage.toFixed(1)),
  };
}

function calculateCustomerStats(users: { createdAt: Date }[]) {
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const currentMonthCustomers = users.filter(
    (user) => user.createdAt >= firstDayCurrentMonth
  ).length;

  const previousMonthCustomers = users.filter(
    (user) =>
      user.createdAt >= firstDayPreviousMonth &&
      user.createdAt < firstDayCurrentMonth
  ).length;

  const customerChangePercentage =
    previousMonthCustomers === 0
      ? 0
      : ((currentMonthCustomers - previousMonthCustomers) /
          previousMonthCustomers) *
        100;

  return {
    currentMonthCustomers,
    previousMonthCustomers,
    customerChangePercentage: parseFloat(customerChangePercentage.toFixed(1)), // Format to 1 decimal
  };
}

async function getAllOrders() {
  const orders = await prisma.order.findMany({
    where: {
      paymentSuccess: true,
      createdAt: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
}

async function getAllCustomers() {
  return await prisma.user.findMany({
    where: {
      role: "user",
      createdAt: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      },
    },
    select: {
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
  // await new Promise<void>(
  //   (resolve) =>
  //     setTimeout(() => {
  //       resolve();
  //     }, 3000), // Simulates a 3-second delay
  // );
  const [allOrders, allUsers] = await Promise.all([
    getAllOrders(),
    getAllCustomers(),
  ]);
  const { profitLossPercentage } = calculateRevenueStats(allOrders);
  const { orderChangePercentage } = calculateOrderStats(allOrders);
  const { customerChangePercentage } = calculateCustomerStats(allUsers);
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="p-4 pt-0 flex-1 w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-primary-foreground">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rs.{" "}
                {formatCurrency(
                  allOrders
                    .filter(
                      (order) =>
                        order.createdAt >=
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth(),
                          1
                        )
                    )
                    .reduce((acc, order) => acc + order.price, 0)
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {profitLossPercentage > 0 ? (
                  <ArrowUp className={`mr-1 h-4 w-4 text-emerald-500`} />
                ) : (
                  <ArrowDown className={`mr-1 h-4 w-4 text-red-500`} />
                )}
                <span
                  className={`${
                    profitLossPercentage > 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {profitLossPercentage > 0 ? "+" : "-"}
                  {profitLossPercentage.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{allOrders.length.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {orderChangePercentage > 0 ? (
                  <ArrowUp className={`mr-1 h-4 w-4 text-emerald-500`} />
                ) : (
                  <ArrowDown className={`mr-1 h-4 w-4 text-red-500`} />
                )}
                <span
                  className={`${
                    orderChangePercentage > 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {orderChangePercentage > 0 ? "+" : "-"}
                  {orderChangePercentage.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +
                {allUsers
                  .filter(
                    (user) =>
                      user.createdAt >=
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      )
                  )
                  .length.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {customerChangePercentage > 0 ? (
                  <ArrowUp className={`mr-1 h-4 w-4 text-emerald-500`} />
                ) : (
                  <ArrowDown className={`mr-1 h-4 w-4 text-red-500`} />
                )}
                <span
                  className={`${
                    customerChangePercentage > 0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {customerChangePercentage > 0 ? "+" : "-"}
                  {customerChangePercentage.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 mt-4">
          <Tabs defaultValue="revenue" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList className="bg-background">
                <TabsTrigger
                  value="revenue"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Revenue</span>
                </TabsTrigger>
                <TabsTrigger
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
                  <CardTitle>Monthly Orders</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <BarChartGraph orders={allOrders} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <AreaChartGraph orders={allOrders} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <LineChartGraph customers={allUsers} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full overflow-x-hidden flex-1">
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
      <div className="p-4 pt-0 flex-1 w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-primary-foreground">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <div className="flex items-center">
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4 mt-4 overflow-x-hidden">
          <Tabs defaultValue="revenue" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList className="bg-background">
                <TabsTrigger
                  disabled
                  value="revenue"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger
                  disabled
                  value="orders"
                  className="flex items-center gap-2"
                >
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
                  <div className="w-full aspect-[3/1] min-h-[300px]">
                    <Skeleton className="h-full w-full" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-full overflow-x-hidden flex-1 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex justify-between items-center border-b border-border">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-9 w-36" />
              </div>
              <div className="grid grid-cols-5 gap-4 p-4 border-b border-border font-medium text-sm">
                <Skeleton className="h-5 w-20 flex-1" />
                <Skeleton className="h-5 w-24 flex-1" />
                <Skeleton className="h-5 w-16 flex-1" />
                <Skeleton className="h-5 w-20 flex-1" />
                <Skeleton className="h-5 w-16 flex-1" />
              </div>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-4 p-4 border-b border-border text-sm"
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
              <div className="p-4 flex items-center justify-between text-sm">
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
