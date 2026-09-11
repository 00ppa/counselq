import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type SearchBarProps = {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
};

export function SearchBar({ query, setQuery, onSearch }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search legal concepts, cases, citations, sections or legal issues..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <Button onClick={onSearch}>
        <Search className="h-4 w-4 mr-1" /> Search
      </Button>
    </div>
  );
}
