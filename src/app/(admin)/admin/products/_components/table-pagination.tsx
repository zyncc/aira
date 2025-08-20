"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="mt-3 flex items-center justify-end gap-3 px-2 pb-4 whitespace-nowrap">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 rounded-[10px] p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 rounded-[10px] p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
