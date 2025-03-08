import { getServerSession } from "@/lib/getServerSession";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { redirect } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CreditCard,
  DollarSign,
  LineChart,
  PieChart,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentOrdersTable from "@/components/admin-tables/home/recentOrdersTable";
import AreaChartGraph from "@/components/charts/area-chart";
import PieChartGraph from "@/components/charts/pie-chart";
import LineChartGraph from "@/components/charts/line-chart";
import BarChartGraph from "@/components/charts/bar-chart";

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
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
  const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 25 },
    { name: "Home & Kitchen", value: 20 },
    { name: "Books", value: 10 },
    { name: "Others", value: 10 },
  ];
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
        <div className="space-y-4 mt-4">
          <Tabs defaultValue="revenue" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList className="bg-background">
                <TabsTrigger
                  value="revenue"
                  className="flex items-center gap-2"
                >
                  <LineChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Revenue</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
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
            </div>
            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue & Profit</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <BarChartGraph />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Orders</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <AreaChartGraph />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <LineChartGraph />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <PieChartGraph />
                    <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
                      {categoryData.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
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
          </Tabs>
        </div>
        <div className="w-full overflow-x-hidden flex-1">
          <RecentOrdersTable />
        </div>
      </div>
    </div>
  );
}
