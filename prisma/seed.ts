import { PrismaClient } from "@prisma/client";
import { products } from "./products";

const prisma = new PrismaClient();

async function main() {
  for (let product of products) {
    await prisma.product.create({
      data: product,
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
