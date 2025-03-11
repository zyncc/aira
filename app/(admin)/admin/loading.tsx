import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, Users } from "lucide-react";

const links = [
  {
    label: "Home",
    href: "/admin",
  },
];

export default function Loading() {
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
