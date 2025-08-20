"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const createSearchURL = (search: string) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    return `${pathname}?${params.toString()}`;
  };

  useEffect(() => {
    if (debouncedSearchQuery !== initialQuery) {
      setIsLoading(true);
      const redirect = createSearchURL(debouncedSearchQuery);
      router.replace(redirect);

      // Simulate loading state for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [
    debouncedSearchQuery,
    router,
    pathname,
    searchParams,
    initialQuery,
    createSearchURL,
  ]);

  const handleClearSearch = () => {
    setSearchQuery("");
    const redirect = createSearchURL("");
    router.replace(redirect);
  };

  return (
    <div className="relative">
      <div className={`relative rounded-md transition-all duration-300`}>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="h-12 pr-10 pl-10 text-base"
        />
        <Search
          className={`text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-colors`}
        />

        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {isLoading && searchQuery && (
        <div className="absolute top-1/2 right-14 -translate-y-1/2">
          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
        </div>
      )}
    </div>
  );
}
