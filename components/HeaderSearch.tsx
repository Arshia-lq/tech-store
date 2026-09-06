"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch() {
    const value = search.trim();

    if (value) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    } else {
      router.push("/products");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find anything..."
      />
    </form>
  );
}