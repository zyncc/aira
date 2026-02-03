"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Coupon } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import CreateCouponForm from "./create-coupon-form";

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();

    if (!coupon.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    return <Badge variant="secondary">Active</Badge>;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatValue = (coupon: Coupon) => {
    return coupon.type === "percentage" ? `${coupon.value}%` : `₹ ${coupon.value}`;
  };

  if (coupons.length === 0) {
    return (
      <div className="border-border bg-muted/30 flex items-center justify-center rounded-lg border border-dashed py-12 text-center">
        <div className="space-y-2">
          <p className="text-foreground text-sm font-medium">No coupons yet</p>
          <p className="text-muted-foreground text-xs">
            Create your first coupon to get started
          </p>
          <CreateCouponForm />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-3">
        <div>
          <Input placeholder="Filter by Code" className="max-w-sm min-w-[150px]" />
        </div>
        <CreateCouponForm />
      </div>
      <div className="border-border overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-32 font-semibold">Code</TableHead>
              <TableHead className="font-semibold">Discount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">First order</TableHead>
              <TableHead className="font-semibold">Min Order</TableHead>
              <TableHead className="font-semibold">Usage</TableHead>
              <TableHead className="font-semibold">Starts</TableHead>
              <TableHead className="font-semibold">Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted text-foreground rounded px-2 py-1 font-mono text-sm font-semibold">
                      {coupon.code}
                    </code>
                  </div>
                </TableCell>
                <TableCell className="text-foreground font-semibold">
                  {formatValue(coupon)}
                </TableCell>
                <TableCell>{getStatusBadge(coupon)}</TableCell>
                <TableCell>
                  <Badge variant={coupon.firstOrder ? "secondary" : "destructive"}>
                    {coupon.firstOrder ? "True" : "False"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  ₹ {formatCurrency(coupon.minOrderValue)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                      {coupon.usageCount}/{coupon.usageLimit}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(coupon.startsAt)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(coupon.expiresAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
