import { ResponsiveModal } from "@/components/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FullOrderType } from "@/lib/types";
import { formatCurrency, formatSize } from "@/lib/utils";
import { CreditCardIcon, MapPinIcon, PackageIcon } from "lucide-react";
interface OrderCardProps {
  order: FullOrderType;
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
              {order.items.map((item) => (
                <div key={item.id} className="mb-2 border-b pb-2 last:border-b-0">
                  <p className="font-semibold">{item.product.title}</p>
                  <p>
                    Size: <span className="font-medium">{formatSize(item.size)}</span>
                  </p>
                  <p>
                    Quantity: <span className="font-medium">{item.quantity}</span>
                  </p>
                </div>
              ))}
              <Separator />
              <p className="pt-2">
                Total:{" "}
                <span className="font-medium">₹ {formatCurrency(order.totalPrice)}</span>
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
                Razorpay ID: <span className="font-mono text-xs">{order.orderId}</span>
              </p>
              {order.paymentId && (
                <p>
                  Payment ID: <span className="font-mono text-xs">{order.paymentId}</span>
                </p>
              )}
              {order.shippingPrice > 0 && (
                <p>
                  Shipping:{" "}
                  <span className="font-medium">
                    ₹ {formatCurrency(order.shippingPrice)}
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
