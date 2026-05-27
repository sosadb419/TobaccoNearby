import Link from "next/link";
import type { SeoLanguage, SeoRelatedLink } from "@/data/seo-pages";

type RelatedPagesSectionProps = {
  className?: string;
  intro?: string;
  language?: SeoLanguage;
  links: SeoRelatedLink[];
  title?: string;
};

const labels = {
  nl: {
    title: "Andere handige pagina’s",
    intro: "Bekijk een compacte selectie verwante pagina’s met praktische locatie-informatie.",
    showMore: "Meer pagina’s tonen",
    showLess: "Minder tonen"
  },
  en: {
    title: "Related Amsterdam pages",
    intro: "A compact set of related pages with practical location information.",
    showMore: "Show more pages",
    showLess: "Show fewer"
  },
  de: {
    title: "Weitere Amsterdam-Seiten",
    intro: "Eine kompakte Auswahl verwandter Seiten mit praktischen Standortinformationen.",
    showMore: "Mehr Seiten anzeigen",
    showLess: "Weniger anzeigen"
  },
  fr: {
    title: "Pages utiles à Amsterdam",
    intro: "Une sélection compacte de pages associées avec des informations pratiques de localisation.",
    showMore: "Afficher plus de pages",
    showLess: "Afficher moins"
  }
} satisfies Record<
  SeoLanguage,
  {
    title: string;
    intro: string;
    showMore: string;
    showLess: string;
  }
>;

export default function RelatedPagesSection({
  className = "",
  intro,
  language = "en",
  links,
  title
}: RelatedPagesSectionProps) {
  const copy = labels[language];
  const visibleLinks = links.slice(0, 5);
  const hiddenLinks = links.slice(5);

  if (links.length === 0) {
    return null;
  }

  return (
    <section className={`rounded-lg border border-line bg-white p-4 md:p-5 ${className}`}>
      <h2 className="text-base font-bold text-ink md:text-lg">{title ?? copy.title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-muted">{intro ?? copy.intro}</p>
      <LinkGrid links={visibleLinks} />
      {hiddenLinks.length > 0 ? (
        <details className="group mt-3">
          <summary className="focus-ring inline-flex cursor-pointer list-none rounded-lg border border-line bg-paper px-3 py-2 text-sm font-bold text-ink marker:hidden hover:border-teal hover:text-teal">
            <span className="group-open:hidden">{copy.showMore}</span>
            <span className="hidden group-open:inline">{copy.showLess}</span>
          </summary>
          <LinkGrid className="mt-3" links={hiddenLinks} />
        </details>
      ) : null}
    </section>
  );
}

function LinkGrid({ className = "mt-3", links }: { className?: string; links: SeoRelatedLink[] }) {
  return (
    <div className={`grid gap-2 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          className="focus-ring rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted transition hover:border-teal hover:text-teal"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
