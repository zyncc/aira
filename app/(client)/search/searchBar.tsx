"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createSearchURL = (search: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("q", search);
    params.set("page", "1");
    return `${pathname}?${params.toString()}`;
  };
  function handleSearch(formData: FormData) {
    const { search } = Object.fromEntries(formData) as { search: string };
    const redirect = createSearchURL(search);
    router.push(redirect);
  }
  return (
    <form action={handleSearch}>
      <div className="relative mt-4">
        <Input
          type="search"
          name="search"
          placeholder="Search products..."
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </form>
  );
}
