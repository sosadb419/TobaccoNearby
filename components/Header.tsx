"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Search } from "lucide-react";
import AdSlot from "@/components/AdSlot";

const navItems = [
  { href: "/search", label: "Search" },
  { href: "/forum", label: "Community Notes" },
  { href: "/about", label: "About" },
  { href: "/add-or-update-a-shop", label: "Add or Update" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  return (
    <header className="border-b border-line bg-white/90 backdrop-blur">
      <div className={`bg-ink px-4 text-center font-medium text-white ${isSearchPage ? "py-1 text-[10px] md:py-2 md:text-xs" : "py-2 text-xs"}`}>
        This website is intended for adults aged 18+.
      </div>
      <div
        className={`container-shell flex gap-3 py-3 md:flex-row md:items-center md:justify-between md:py-4 ${
          isSearchPage ? "flex-row items-center justify-between" : "flex-col md:flex-row"
        }`}
      >
        <Link className="focus-ring flex items-center gap-3 rounded-lg" href="/" aria-label="TobaccoNearby home">
          <span className={`flex items-center justify-center rounded-lg bg-teal text-white ${isSearchPage ? "h-8 w-8 md:h-10 md:w-10" : "h-10 w-10"}`}>
            <MapPin aria-hidden="true" size={isSearchPage ? 18 : 21} />
          </span>
          <span>
            <span className={`block font-bold text-ink ${isSearchPage ? "text-base md:text-lg" : "text-lg"}`}>TobaccoNearby</span>
            <span className={`text-xs text-muted ${isSearchPage ? "hidden md:block" : "block"}`}>Amsterdam directory</span>
          </span>
        </Link>

        {isSearchPage ? (
          <Link
            className="focus-ring inline-flex min-h-9 items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-bold text-ink md:hidden"
            href="/"
          >
            <Home aria-hidden="true" size={15} />
            Home
          </Link>
        ) : null}

        <nav
          aria-label="Main navigation"
          className={`flex flex-wrap items-center gap-2 ${isSearchPage ? "hidden md:flex" : "flex"}`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-paper hover:text-ink"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal"
            href="/search"
          >
            <Search aria-hidden="true" size={16} />
            Find shops
          </Link>
        </nav>
      </div>
      <div className={`container-shell pb-4 ${isSearchPage ? "hidden md:block" : ""}`}>
        <AdSlot placement="header" />
      </div>
    </header>
  );
}
