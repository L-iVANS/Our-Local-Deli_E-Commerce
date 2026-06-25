"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full lg:max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your favorites..."
          className="
            w-full bg-[#F5F1E9] text-gray-800 placeholder:text-gray-500
            rounded-lg lg:rounded-full py-3 lg:py-2.5 pl-4 lg:pl-5 pr-10 lg:pr-12
            text-[13px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-[#db9a28]/30
            transition-all shadow-inner
          "
        />
        <button 
          type="submit" 
          aria-label="Search"
          className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#db9a28] transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};