import Link from "next/link";
import AdSlot from "@/components/AdSlot";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/forum", label: "Community Notes" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/add-or-update-a-shop", label: "Add or Update a Shop" }
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="container-shell py-8">
        <AdSlot placement="footer" />
        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-lg font-bold text-ink">TobaccoNearby</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              A neutral, English-language directory for adults aged 18+ looking for practical location information
              about tobacco shops in Amsterdam. TobaccoNearby does not sell tobacco products and does not encourage
              tobacco use.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              TobaccoNearby is an informational directory for adults aged 18+. Shop details may change. Please verify
              information before visiting.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-2 text-sm">
            {footerLinks.map((item) => (
              <Link key={item.href} className="focus-ring rounded-md py-1 text-muted hover:text-ink" href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-line pt-5 text-xs text-muted">
          © {new Date().getFullYear()} TobaccoNearby. Informational directory only.
        </div>
      </div>
    </footer>
  );
}
