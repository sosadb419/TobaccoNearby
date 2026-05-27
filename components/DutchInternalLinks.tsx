import Link from "next/link";

const dutchInternalLinks = [
  { href: "/amsterdam/waar-sigaretten-kopen", label: "Waar sigaretten kopen in Amsterdam" },
  { href: "/amsterdam/sigaretten-kopen", label: "Sigaretten kopen in Amsterdam" },
  { href: "/amsterdam/tobacco-shops", label: "Tabakswinkels in Amsterdam" },
  { href: "/amsterdam/centrum", label: "Tabakswinkels in Amsterdam Centrum" },
  { href: "/amsterdam/de-pijp", label: "Tabakswinkels in De Pijp" },
  { href: "/amsterdam/jordaan", label: "Tabakswinkels in Jordaan" },
  { href: "/amsterdam/de-wallen", label: "Tabakswinkels bij De Wallen" },
  { href: "/amsterdam/west", label: "Tabakswinkels in Amsterdam West" },
  { href: "/amsterdam/nieuw-west", label: "Tabakswinkels in Amsterdam Nieuw-West" },
  { href: "/amsterdam/oost", label: "Tabakswinkels in Amsterdam Oost" },
  { href: "/amsterdam/noord", label: "Tabakswinkels in Amsterdam Noord" },
  { href: "/amsterdam/zuid", label: "Tabakswinkels in Amsterdam Zuid" },
  { href: "/amsterdam/zuidoost", label: "Tabakswinkels in Amsterdam Zuidoost" },
  { href: "/amsterdam/diemen", label: "Tabakswinkels in Diemen" },
  { href: "/amsterdam/near-central-station", label: "Tabakswinkels bij Amsterdam Centraal" }
];

export default function DutchInternalLinks() {
  return (
    <section className="mt-8 rounded-lg border border-line bg-white p-5" aria-labelledby="dutch-internal-links-heading">
      <h2 id="dutch-internal-links-heading" className="text-lg font-bold text-ink">
        Andere handige pagina's
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Bekijk ook andere pagina's met praktische locatie-informatie over tabakswinkels en verkooppunten in Amsterdam.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {dutchInternalLinks.map((link) => (
          <Link
            key={link.href}
            className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
