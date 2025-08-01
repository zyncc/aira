import { Prisma } from "@prisma/client";

export type ProductsWithQuantity = Prisma.ProductGetPayload<{
  include: {
    quantity: true;
  };
}>;

export type FullOrdersType = Prisma.orderGetPayload<{
  include: {
    address: true;
    product: true;
    tracking: true;
    user: true;
  };
}>;

export type Products = Prisma.ProductGetPayload<{
  include: {
    quantity: true;
    order: {
      select: {
        id: true;
      };
    };
    reviews: {
      take: 4;
      select: {
        id: true;
      };
    };
  };
}>;

export type ProductsOfflineCartItems = Prisma.ProductGetPayload<{
  select: {
    title: true;
    price: true;
    quantity: true;
    images: true;
  };
}>;

export type FeaturedAndRecentProducts = Prisma.ProductGetPayload<{
  select: {
    id: true;
    title: true;
    price: true;
    images: true;
    placeholderImages: true;
    category: true;
  };
}>;

export type UserWithReviews = Prisma.UserGetPayload<{
  include: { reviews: true };
}>;

export type ReviewWithUser = Prisma.reviewsGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        image: true;
        name: true;
      };
    };
  };
}>;

export type UserWithAddress = Prisma.UserGetPayload<{
  include: { address: true };
}>;

export type orderWithAddressProduct = Prisma.orderGetPayload<{
  include: {
    address: true;
    product: true;
  };
}>;

export type orderWithProduct = Prisma.orderGetPayload<{
  include: {
    product: true;
  };
}>;

export type orderWithUser = Prisma.orderGetPayload<{
  include: {
    user: true;
  };
}>;

export type cartItemWithProduct = Prisma.CartItemsGetPayload<{
  include: { product: { include: { quantity: true } } };
}>;

export type CartWithCartItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            quantity: true;
          };
        };
      };
    };
  };
}>;

export type CartItemsWithProducts = Prisma.CartItemsGetPayload<{
  include: {
    product: {
      include: {
        quantity: true;
      };
    };
  };
}>;
