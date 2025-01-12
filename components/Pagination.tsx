"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

export default function SearchPagePaginationComponent({
  noOfProducts,
  productsLength,
}: {
  noOfProducts: number;
  productsLength: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  return (
    <Pagination className="my-5">
      <PaginationContent>
        <PaginationItem className={`${currentPage == 1 && "hidden"}`}>
          <PaginationPrevious href={`?page=1`} />
        </PaginationItem>
        <PaginationItem className={`${currentPage == 1 && "hidden"}`}>
          <PaginationLink href={createPageURL(currentPage - 1)}>
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href={createPageURL(currentPage)}
            className={`${productsLength < 24 && "hidden"}`}
            isActive
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem
          className={`${productsLength < noOfProducts && "hidden"}`}
        >
          <PaginationLink href={createPageURL(currentPage + 1)}>
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem
          className={`${productsLength < noOfProducts && "hidden"}`}
        >
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem
          className={`${productsLength < noOfProducts && "hidden"}`}
        >
          <PaginationNext href={createPageURL(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
