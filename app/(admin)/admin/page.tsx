import { getServerSession } from "@/lib/getServerSession";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { redirect } from "next/navigation";

import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CreditCard,
  DollarSign,
  Menu,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RecentOrdersTable from "@/components/admin-tables/home/recentOrdersTable";

// Sample data for charts
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

const categoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Home & Kitchen", value: 20 },
  { name: "Books", value: 10 },
  { name: "Others", value: 10 },
];

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

// Colors for pie chart
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Chart config
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

const links = [
  {
    label: "Home",
    href: "/admin",
  },
];

export default async function AdminPage() {
  const session = await getServerSession();
  if (session?.user.role !== "admin") {
    redirect("/");
  }
  {
  }
  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="p-4 pt-0 flex-1 w-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+20.1%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+12.2%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+3.1%</span> from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.24%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">-0.4%</span> from last month
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          {/* <Tabs defaultValue="revenue" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <TabsList>
                        <TabsTrigger
                          value="revenue"
                          className="flex items-center gap-2"
                        >
                          <LineChart className="h-4 w-4" />
                          <span className="hidden sm:inline">Revenue</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="orders"
                          className="flex items-center gap-2"
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span className="hidden sm:inline">Orders</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="customers"
                          className="flex items-center gap-2"
                        >
                          <Users className="h-4 w-4" />
                          <span className="hidden sm:inline">Customers</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="categories"
                          className="flex items-center gap-2"
                        >
                          <PieChart className="h-4 w-4" />
                          <span className="hidden sm:inline">Categories</span>
                        </TabsTrigger>
                      </TabsList>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <span>Export</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                          <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                          <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <TabsContent value="revenue" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Revenue & Profit</CardTitle>
                          <CardDescription>
                            Monthly revenue and profit for the current year
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={chartConfig}
                            className="h-[400px]"
                          >
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
                                  <linearGradient
                                    id="colorRevenue"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="hsl(var(--chart-1))"
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="hsl(var(--chart-1))"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                  <linearGradient
                                    id="colorProfit"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="hsl(var(--chart-2))"
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="hsl(var(--chart-2))"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                />
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
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Monthly Orders</CardTitle>
                          <CardDescription>
                            Number of orders processed each month
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={chartConfig}
                            className="h-[400px]"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={revenueData}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                />
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
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="customers" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Customer Acquisition</CardTitle>
                          <CardDescription>
                            New vs returning customers each month
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={chartConfig}
                            className="h-[400px]"
                          >
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
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                />
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
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Sales by Category</CardTitle>
                          <CardDescription>
                            Distribution of sales across product categories
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            <ChartContainer
                              config={chartConfig}
                              className="h-[300px] w-full md:w-1/2"
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {categoryData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                      />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </ChartContainer>

                            <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
                              {categoryData.map((item, index) => (
                                <div
                                  key={item.name}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        COLORS[index % COLORS.length],
                                    }}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {item.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {item.value}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs> */}
        </div>
        <div className="w-full overflow-x-hidden flex-1">
          <RecentOrdersTable />
        </div>
      </div>
    </div>
  );
}
