import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { areaDefinitions } from "@/data/areas";
import { cityDefinitions } from "@/data/cities";
import { primarySeoLandingPages } from "@/data/seo-pages";
import { getUtrechtAreaDefinition, primaryUtrechtAreaSlugs } from "@/data/utrecht-seo";

const siteLinks = [
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/forum", label: "Community Notes" },
  { href: "/contact", label: "Contact" },
  { href: "/add-or-update-a-shop", label: "Add or Update a Shop" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/disclaimer", label: "Disclaimer" }
];

const footerAmsterdamLinks = primarySeoLandingPages
  .filter((page) => page.language === "en")
  .slice(0, 5)
  .map((page) => ({ href: page.href, label: page.label }));

const footerUtrechtLinks = [
  { href: "/utrecht", label: "Tobacco shops Utrecht" },
  { href: "/tabakswinkel-utrecht", label: "Tabakswinkels in Utrecht" },
  { href: "/sigaretten-kopen-utrecht", label: "Sigaretten kopen in Utrecht" }
];

const footerUtrechtAreaLinks = primaryUtrechtAreaSlugs
  .map((areaSlug) => getUtrechtAreaDefinition(areaSlug))
  .filter((area): area is NonNullable<typeof area> => Boolean(area))
  .map((area) => ({ href: area.href, label: area.label }));

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="container-shell py-8">
        <AdSlot placement="footer" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <p className="text-lg font-bold text-ink">TobaccoNearby</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              A neutral, English-language directory for adults aged 18+ looking for practical location information
              about tobacco shops in supported Dutch cities, including Amsterdam and Utrecht. TobaccoNearby does not
              sell tobacco products and does not encourage tobacco use.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              TobaccoNearby is an informational directory for adults aged 18+. Shop details may change. Please verify
              information before visiting.
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FooterLinkGroup label="Website" links={siteLinks} />
              <FooterLinkGroup
                label="Supported cities"
                links={cityDefinitions.map((city) => ({ href: city.href, label: city.name }))}
              />
              <FooterLinkGroup
                label="Amsterdam pages"
                links={footerAmsterdamLinks}
              />
              <FooterLinkGroup label="Utrecht pages" links={footerUtrechtLinks} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <FooterLinkGroup
                label="Amsterdam areas"
                links={areaDefinitions.map((area) => ({ href: area.href, label: area.label }))}
              />
              <FooterLinkGroup label="Utrecht areas" links={footerUtrechtAreaLinks} />
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-line pt-5 text-xs text-muted">
          © {new Date().getFullYear()} TobaccoNearby. Informational directory only.
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={label} className="text-sm">
      <h2 className="text-xs font-bold uppercase text-ink">{label}</h2>
      <div className="mt-3 grid gap-2">
        {links.map((item) => (
          <Link key={item.href} className="focus-ring rounded-md py-1 text-muted hover:text-ink" href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
