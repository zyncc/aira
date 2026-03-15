import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import SidebarInsetWrapper from "@/components/sidebar/sidebar-inset-wrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db/instance";
import { getServerSession } from "@/functions/auth/get-server-session";
import { FullOrderType, User } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { IconTrendingUp } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { DataTable } from "./_components/data-table";

async function calculateRevenueStats(orders: FullOrderType[]) {
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthRevenue = orders
    .filter((order) => order.createdAt >= firstDayCurrentMonth)
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const previousMonthRevenue = orders
    .filter(
      (order) =>
        order.createdAt >= firstDayPreviousMonth &&
        order.createdAt < firstDayCurrentMonth,
    )
    .reduce((acc, order) => acc + order.totalPrice, 0);

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

async function calculateOrderStats(orders: FullOrderType[]) {
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

async function calculateCustomerStats(users: User[]) {
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
  return await db.query.order.findMany({
    with: {
      user: true,
      items: {
        with: {
          product: true,
        },
      },
    },
    where: (order, o) =>
      o.and(
        o.eq(order.paymentSuccess, true),
        o.gte(
          order.createdAt,
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        ),
      ),
    orderBy: (order, o) => o.desc(order.createdAt),
  });
}

async function getAllCustomers() {
  return await db.query.user.findMany({
    where: (user, o) =>
      o.and(
        o.eq(user.role, "user"),
        o.gte(
          user.createdAt,
          new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        ),
      ),
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
  // await sleep(2);
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return redirect(process.env.NEXT_PUBLIC_APP_URL!);
  }
  await connection();
  const [allOrders, allUsers] = await Promise.all([getAllOrders(), getAllCustomers()]);
  const { profitLossPercentage } = await calculateRevenueStats(allOrders);
  const { orderChangePercentage } = await calculateOrderStats(allOrders);
  const { customerChangePercentage } = await calculateCustomerStats(allUsers);
  return (
    <SidebarInsetWrapper title="Dashboard">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              orders={allOrders.length.toLocaleString()}
              customers={allUsers.length}
              revenue={formatCurrency(
                allOrders
                  .filter(
                    (order) =>
                      order.createdAt >=
                      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  )
                  .reduce((acc, order) => acc + order.totalPrice, 0),
              )}
              profitLossPercentage={profitLossPercentage}
              orderChangePercentage={orderChangePercentage}
              customerChangePercentage={customerChangePercentage}
            />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive orders={allOrders} customers={allUsers} />
            </div>
          </div>
          <div className="pb-5">
            <DataTable data={allOrders} />
          </div>
        </div>
      </div>
    </SidebarInsetWrapper>
  );
}

function Loading() {
  return (
    <SidebarInsetWrapper title="Dashboard">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Section Cards Loading State */}
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
              {/* Revenue Card */}
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <Skeleton className="inline-block h-8 w-24" />
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Trending up this month <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">
                    Visitors for the last 6 months
                  </div>
                </CardFooter>
              </Card>

              {/* Customers Card */}
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>New Customers</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <Skeleton className="inline-block h-8 w-16" />
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Up % this period <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">Acquisition needs attention</div>
                </CardFooter>
              </Card>

              {/* Orders Card */}
              <Card className="@container/card">
                <CardHeader>
                  <CardDescription>New Orders</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <Skeleton className="inline-block h-8 w-16" />
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Steady performance increase <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">Meets growth projections</div>
                </CardFooter>
              </Card>
            </div>

            {/* Chart Loading State */}
            <div className="px-4 lg:px-6">
              <Card className="@container/card">
                <CardHeader>
                  <CardTitle>Total Overview</CardTitle>
                  <CardDescription>Monthly data overview</CardDescription>
                </CardHeader>
                <div className="px-2 pt-4 sm:px-6 sm:pt-6">
                  <Skeleton className="h-[250px] w-full rounded-lg" />
                </div>
              </Card>
            </div>
          </div>

          {/* Data Table Loading State */}
          <div className="pb-5">
            <div className="px-6">
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>AWB</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>TTD</TableHead>
                      <TableHead className="text-center">Address</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="mx-auto h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex w-full items-center justify-between gap-8">
                  <div className="flex w-fit items-center justify-center text-sm font-medium">
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInsetWrapper>
  );
}
