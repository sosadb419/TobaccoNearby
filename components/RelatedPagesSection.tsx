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
    title: "Gerelateerde pagina’s",
    intro: "Een korte selectie met praktische gerelateerde pagina’s.",
    showMore: "Meer gerelateerde pagina’s tonen",
    showLess: "Minder tonen"
  },
  en: {
    title: "Related pages",
    intro: "A short set of related pages with practical location information.",
    showMore: "Show more related pages",
    showLess: "Show fewer"
  },
  de: {
    title: "Verwandte Seiten",
    intro: "Eine kurze Auswahl verwandter Seiten mit praktischen Standortinformationen.",
    showMore: "Mehr verwandte Seiten anzeigen",
    showLess: "Weniger anzeigen"
  },
  fr: {
    title: "Pages liées",
    intro: "Une courte sélection de pages liées avec des informations pratiques de localisation.",
    showMore: "Afficher plus de pages liées",
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
    <section className={`border-t border-line pt-4 ${className}`}>
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink">{title ?? copy.title}</h2>
      <p className="mt-1 text-sm leading-5 text-muted">{intro ?? copy.intro}</p>
      <LinkGrid links={visibleLinks} />
      {hiddenLinks.length > 0 ? (
        <details className="group mt-2">
          <summary className="focus-ring inline-flex cursor-pointer list-none rounded-md px-1 py-1 text-xs font-bold text-teal marker:hidden hover:text-ink">
            <span className="group-open:hidden">{copy.showMore}</span>
            <span className="hidden group-open:inline">{copy.showLess}</span>
          </summary>
          <LinkGrid className="mt-2" links={hiddenLinks} />
        </details>
      ) : null}
    </section>
  );
}

function LinkGrid({ className = "mt-2", links }: { className?: string; links: SeoRelatedLink[] }) {
  return (
    <div className={`grid gap-1.5 md:grid-cols-2 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          className="focus-ring rounded-md px-2 py-1.5 text-sm font-semibold text-muted transition hover:bg-paper hover:text-teal"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
