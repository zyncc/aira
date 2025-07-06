"use client";

import { useState, useMemo } from "react";
import {
  CalendarIcon,
  Search,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import SidebarInsetWrapper from "@/components/ui/sidebar-inset";
import formatCurrency from "@/lib/formatCurrency";

// Mock data - replace with actual API calls
const mockOrders = [
  {
    id: "ORD-001",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    productId: "prod1",
    productTitle: "Premium Headphones",
    quantity: 2,
    totalAmount: 299.98,
    paymentStatus: true,
    orderStatus: "delivered",
    shippingAddress: "123 Main St, New York, NY 10001",
    trackingId: "TRK-001",
    trackingStatus: "Delivered",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "ORD-002",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    productId: "prod2",
    productTitle: "Wireless Mouse",
    quantity: 1,
    totalAmount: 79.99,
    paymentStatus: false,
    orderStatus: "pending",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    trackingId: "TRK-002",
    trackingStatus: "Processing",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "ORD-003",
    userId: "user3",
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    productId: "prod3",
    productTitle: "Gaming Keyboard",
    quantity: 1,
    totalAmount: 149.99,
    paymentStatus: true,
    orderStatus: "shipped",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    trackingId: "TRK-003",
    trackingStatus: "In Transit",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "ORD-004",
    userId: "user4",
    userName: "Alice Brown",
    userEmail: "alice@example.com",
    productId: "prod4",
    productTitle: "Smartphone Case",
    quantity: 3,
    totalAmount: 89.97,
    paymentStatus: true,
    orderStatus: "processing",
    shippingAddress: "321 Elm St, Houston, TX 77001",
    trackingId: "TRK-004",
    trackingStatus: "Preparing",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "ORD-005",
    userId: "user5",
    userName: "Charlie Wilson",
    userEmail: "charlie@example.com",
    productId: "prod5",
    productTitle: "Bluetooth Speaker",
    quantity: 1,
    totalAmount: 199.99,
    paymentStatus: false,
    orderStatus: "cancelled",
    shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
    trackingId: "TRK-005",
    trackingStatus: "Cancelled",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-26"),
  },
];

type Order = (typeof mockOrders)[0];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        (paymentStatusFilter === "paid" && order.paymentStatus) ||
        (paymentStatusFilter === "unpaid" && !order.paymentStatus);

      const matchesOrderStatus =
        orderStatusFilter === "all" || order.orderStatus === orderStatusFilter;

      const matchesDateRange =
        (!dateFrom || order.createdAt >= dateFrom) &&
        (!dateTo || order.createdAt <= dateTo);

      return (
        matchesSearch &&
        matchesPaymentStatus &&
        matchesOrderStatus &&
        matchesDateRange
      );
    });
  }, [
    orders,
    searchTerm,
    paymentStatusFilter,
    orderStatusFilter,
    dateFrom,
    dateTo,
  ]);

  const togglePaymentStatus = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              paymentStatus: !order.paymentStatus,
              updatedAt: new Date(),
            }
          : order
      )
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, orderStatus: newStatus, updatedAt: new Date() }
          : order
      )
    );
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length
        ? []
        : filteredOrders.map((order) => order.id)
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      processing: { variant: "default" as const, label: "Processing" },
      shipped: { variant: "default" as const, label: "Shipped" },
      delivered: { variant: "default" as const, label: "Delivered" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentBadge = (paid: boolean) => {
    return (
      <Badge variant={paid ? "default" : "destructive"}>
        {paid ? "Paid" : "Unpaid"}
      </Badge>
    );
  };

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const paidOrders = filteredOrders.filter(
    (order) => order.paymentStatus
  ).length;
  const unpaidOrders = filteredOrders.filter(
    (order) => !order.paymentStatus
  ).length;

  const links = [
    {
      label: "Home",
      href: "/admin",
    },
    {
      label: "Orders",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <SidebarInsetWrapper links={links} />
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Orders Management
            </h1>
            <p className="text-muted-foreground">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{formatCurrency(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {paidOrders}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unpaid Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {unpaidOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter orders by various criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select
                  value={paymentStatusFilter}
                  onValueChange={setPaymentStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Order Status</Label>
                <Select
                  value={orderStatusFilter}
                  onValueChange={setOrderStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setPaymentStatusFilter("all");
                    setOrderStatusFilter("all");
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedOrders.length} selected
                  </span>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedOrders.length === filteredOrders.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleSelectOrder(order.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.userEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {order.productTitle}
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        ₹{formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPaymentBadge(order.paymentStatus)}
                          <Switch
                            checked={order.paymentStatus}
                            onCheckedChange={() =>
                              togglePaymentStatus(order.id)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {order.trackingId}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.trackingStatus}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(order.createdAt, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "processing")
                              }
                            >
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "shipped")
                              }
                            >
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "delivered")
                              }
                            >
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                updateOrderStatus(order.id, "cancelled")
                              }
                              className="text-red-600"
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
