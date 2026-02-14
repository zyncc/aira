import { db } from "@/db/instance";
import { quantity as quantityTable } from "@/db/schema"; // Alias table
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const size = searchParams.get("size");
  const quantity = parseInt(searchParams.get("quantity") || "0");

  // Assuming the client will send productId as well since quantity is tied to product
  const productId = searchParams.get("productId");

  if (!size || isNaN(quantity) || !productId) {
    return Response.json(
      { error: "Invalid size, quantity, or productId" },
      { status: 400 },
    );
  }

  // Validate allowed sizes to prevent accessing arbitrary properties
  const allowedSizes = ["sm", "md", "lg", "xl", "doublexl"];
  if (!allowedSizes.includes(size)) {
    return Response.json({ error: "Invalid size parameter" }, { status: 400 });
  }

  try {
    const inventory = await db.query.quantity.findFirst({
      where: eq(quantityTable.productId, productId),
    });

    if (!inventory) {
      return Response.json({ error: "Product inventory not found" }, { status: 404 });
    }

    const availableStock = inventory[size as keyof typeof inventory];

    if (typeof availableStock !== "number" || availableStock < quantity) {
      return Response.json(
        {
          error: "Insufficient stock available",
          available: false,
          stock: availableStock,
        },
        { status: 400 },
      );
    }

    return Response.json({ available: true, stock: availableStock });
  } catch (error) {
    console.error("Error checking quantity:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
