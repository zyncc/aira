"use client";

import { useState, useTransition } from "react";
import { Package, Search, Settings } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveModal } from "@/components/responsive-modal";
import { ProductsWithQuantity } from "@/lib/types";
import formatCurrency from "@/lib/formatCurrency";
import { updateQuantity } from "@/actions/updateQuantity";
import { toast } from "sonner";

type QuantityUpdate = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  doublexl: number;
};

interface InventoryClientProps {
  productsWithQuantity: ProductsWithQuantity[];
}

export function InventoryClient({
  productsWithQuantity,
}: InventoryClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductsWithQuantity | null>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, QuantityUpdate>>(
    {}
  );

  const filteredProducts = productsWithQuantity.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalStock = (quantity: ProductsWithQuantity["quantity"]) => {
    if (!quantity) return 0;
    return (
      quantity.sm + quantity.md + quantity.lg + quantity.xl + quantity.doublexl
    );
  };

  const getStockStatus = (total: number) => {
    if (total === 0)
      return { label: "Out of Stock", variant: "destructive" as const };
    if (total < 10)
      return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const handleQuantityUpdate = (size: keyof QuantityUpdate, value: string) => {
    if (!selectedProduct) return;
    setQuantities((prev) => ({
      ...prev,
      [selectedProduct.id]: {
        ...prev[selectedProduct.id],
        [size]: Math.max(0, Number.parseInt(value) || 0),
      },
    }));
  };

  const handleUpdateProduct = (product: ProductsWithQuantity) => {
    setSelectedProduct(product);
    if (product.quantity) {
      setQuantities((prev) => ({
        ...prev,
        [product.id]: {
          sm: product.quantity!.sm,
          md: product.quantity!.md,
          lg: product.quantity!.lg,
          xl: product.quantity!.xl,
          doublexl: product.quantity!.doublexl,
        },
      }));
    }
  };

  const handleSaveQuantities = async () => {
    if (!selectedProduct) return;

    const currentQuantities = quantities[selectedProduct.id];
    if (!currentQuantities) return;

    startTransition(async () => {
      try {
        await updateQuantity(currentQuantities, selectedProduct.quantity!.id);

        toast.success("Quantities updated successfully");
        setOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error("Error updating quantities:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  const sizeLabels: Record<keyof QuantityUpdate, string> = {
    sm: "SM",
    md: "MD",
    lg: "LG",
    xl: "XL",
    doublexl: "2XL",
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <header className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
        <main className="w-full">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const totalStock = getTotalStock(product.quantity);
              const stockStatus = getStockStatus(totalStock);

              return (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      placeholder="blur"
                      blurDataURL={product.placeholderImages[0]}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg leading-tight">
                          {product.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {product.category} • {product.color}
                        </CardDescription>
                      </div>
                      <Badge variant={stockStatus.variant} className="ml-2">
                        {stockStatus.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg font-bold">
                            ₹ {formatCurrency(product.salePrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹ {formatCurrency(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">
                          ₹ {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Stock
                      </Label>
                      <div className="grid grid-cols-5 gap-1">
                        {Object.entries(sizeLabels).map(([size, label]) => (
                          <Button
                            key={size}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-medium cursor-default bg-transparent"
                            disabled
                          >
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-muted-foreground">
                                {label}
                              </span>
                              <span className="font-bold">
                                {product.quantity?.[
                                  size as keyof QuantityUpdate
                                ] || 0}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 text-center">
                        Total: {totalStock} units
                      </div>
                    </div>
                    <ResponsiveModal
                      open={open}
                      onOpenChange={setOpen}
                      trigger={
                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => handleUpdateProduct(product)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Update Quantities
                        </Button>
                      }
                      title="Update Product Quantities"
                    >
                      {selectedProduct && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <Label className="text-base font-medium">
                              Size Quantities
                            </Label>
                            {Object.entries(sizeLabels).map(([size, label]) => (
                              <div
                                key={size}
                                className="flex items-center justify-between"
                              >
                                <Label
                                  htmlFor={`${selectedProduct.id}-${size}`}
                                  className="text-sm font-medium"
                                >
                                  {label} Size
                                </Label>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    Current:{" "}
                                    {selectedProduct.quantity?.[
                                      size as keyof QuantityUpdate
                                    ] || 0}
                                  </span>
                                  <Input
                                    id={`${selectedProduct.id}-${size}`}
                                    type="number"
                                    min="0"
                                    value={
                                      quantities[selectedProduct.id]?.[
                                        size as keyof QuantityUpdate
                                      ] ||
                                      selectedProduct.quantity?.[
                                        size as keyof QuantityUpdate
                                      ] ||
                                      0
                                    }
                                    onChange={(e) =>
                                      handleQuantityUpdate(
                                        size as keyof QuantityUpdate,
                                        e.target.value
                                      )
                                    }
                                    className="w-20 h-8"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-4 bg-secondary rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Total Stock:</span>
                              <span className="text-lg font-bold">
                                {quantities[selectedProduct.id]
                                  ? Object.values(
                                      quantities[selectedProduct.id]
                                    ).reduce((a, b) => a + b, 0)
                                  : getTotalStock(
                                      selectedProduct.quantity
                                    )}{" "}
                                units
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => setSelectedProduct(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={handleSaveQuantities}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </ResponsiveModal>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No products available in inventory"}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
