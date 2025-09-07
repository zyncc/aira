import { ResponsiveModal } from "@/components/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatSize } from "@/lib/utils";
import { CreditCardIcon, MapPinIcon, PackageIcon } from "lucide-react";

interface Order {
  id: string;
  rzpOrderId: string;
  price: number;
  size: string;
  quantity: number;
  paymentId: string | null;
  paymentSuccess: boolean;
  ttd: Date | null;
  shipmentCost: number | null;
  waybill: string | null;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zipcode: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPaymentStatusBadge = () => {
    if (order.paymentSuccess) {
      return <Badge variant="default">Paid</Badge>;
    }
    return <Badge variant="destructive">Unpaid</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Order #{order.id.slice(-8)}
          </CardTitle>
          {getPaymentStatusBadge()}
        </div>
        <p className="text-muted-foreground text-sm">
          Placed on {formatDate(order.createdAt)}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <PackageIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Order Details</span>
            </div>
            <div className="space-y-1 pl-6 text-sm">
              <p>
                Size: <span className="font-medium">{formatSize(order.size)}</span>
              </p>
              <p>
                Quantity: <span className="font-medium">{order.quantity}</span>
              </p>
              <p>
                Total:{" "}
                <span className="font-medium">₹ {formatCurrency(order.price)}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">Payment Info</span>
            </div>
            <div className="space-y-1 pl-6 text-sm">
              <p>
                Razorpay ID: <span className="font-mono text-xs">{order.rzpOrderId}</span>
              </p>
              {order.paymentId && (
                <p>
                  Payment ID: <span className="font-mono text-xs">{order.paymentId}</span>
                </p>
              )}
              {order.shipmentCost && (
                <p>
                  Shipping:{" "}
                  <span className="font-medium">
                    ₹ {formatCurrency(order.shipmentCost)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="space-y-2 pl-6">
            <div className="flex items-center gap-2">
              <ResponsiveModal
                title="Shipping Address"
                trigger={
                  <Button variant="outline" size="sm" className="h-8 bg-transparent">
                    <MapPinIcon className="mr-1 h-3 w-3" />
                    View Address
                  </Button>
                }
              >
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {order.firstName} {order.lastName || ""}
                  </p>
                  <p>{order.address1}</p>
                  {order.address2 && <p>{order.address2}</p>}
                  <p>
                    {order.city}, {order.state} {order.zipcode}
                  </p>
                </div>
              </ResponsiveModal>
            </div>

            <div className="space-y-1 text-sm">
              {order.waybill ? (
                <p>
                  Waybill: <span className="font-mono text-xs">{order.waybill}</span>
                </p>
              ) : (
                <p className="text-muted-foreground">Waybill not assigned yet</p>
              )}
              {order.ttd && (
                <p>
                  Expected Delivery:{" "}
                  <span className="font-medium">{formatDate(order.ttd)}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
