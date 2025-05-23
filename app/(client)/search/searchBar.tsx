"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

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
  }, [debouncedSearchQuery, router, pathname, searchParams, initialQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    const redirect = createSearchURL("");
    router.replace(redirect);
  };

  return (
    <div className="relative">
      <div className={`relative transition-all duration-300 rounded-md`}>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="pl-10 pr-10 h-12 text-base"
        />
        <Search
          className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors text-muted-foreground`}
        />

        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {isLoading && searchQuery && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-r-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
