import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import AdSlot from "@/components/AdSlot";

const navItems = [
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/add-or-update-a-shop", label: "Add or Update" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  return (
    <header className="border-b border-line bg-white/90 backdrop-blur">
      <div className="bg-ink px-4 py-2 text-center text-xs font-medium text-white">
        This website is intended for adults aged 18+.
      </div>
      <div className="container-shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link className="focus-ring flex items-center gap-3 rounded-lg" href="/" aria-label="TobaccoNearby home">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal text-white">
            <MapPin aria-hidden="true" size={21} />
          </span>
          <span>
            <span className="block text-lg font-bold text-ink">TobaccoNearby</span>
            <span className="block text-xs text-muted">Amsterdam directory</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2">
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
      <div className="container-shell pb-4">
        <AdSlot placement="header" />
      </div>
    </header>
  );
}
