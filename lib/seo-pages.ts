import type { Metadata } from "next";
import type { FAQItem } from "@/components/FAQSection";
import type { SeoAreaSlug } from "@/lib/seo-areas";

export type SeoLanguage = "nl" | "en" | "de" | "fr";
export type SeoIntent = "buy" | "where" | "tobacco" | "near-me";

export type SeoRelatedLink = {
  href: string;
  label: string;
};

export type SeoLandingPageDefinition = {
  language: SeoLanguage;
  href: string;
  label: string;
  areaSlug: SeoAreaSlug;
  areaDisplayName: string;
  intent: SeoIntent;
  seoTitle: string;
  metaDescription: string;
  metadataTitle: string;
  metadataDescription: string;
  h1: string;
  introCopy: string;
  intro: string;
  context: string;
  practicalPoints: string[];
  faqItems: FAQItem[];
  faqs: FAQItem[];
  relatedLinks: SeoRelatedLink[];
  searchIntentKeywords: string[];
  listingLimit: number;
  ctaLabel: string;
  translationKey: string;
  isPrimary?: boolean;
};

type SeoRouteSeed = {
  language: SeoLanguage;
  href: string;
  label: string;
  areaSlug: SeoAreaSlug;
  areaDisplayName: string;
  intent: SeoIntent;
  translationKey: string;
  searchIntentKeywords: string[];
  seoTitle?: string;
  metaDescription?: string;
  h1?: string;
  isPrimary?: boolean;
};

const listingLimit = 10;

const dutchAreaRoutes: Array<[string, SeoAreaSlug, string, string]> = [
  ["centrum", "centrum", "Amsterdam Centrum", "Centrum"],
  ["de-pijp", "de-pijp", "De Pijp", "De Pijp"],
  ["jordaan", "jordaan", "Jordaan", "Jordaan"],
  ["de-wallen", "de-wallen", "De Wallen", "De Wallen"],
  ["west", "west", "Amsterdam West", "Amsterdam West"],
  ["nieuw-west", "nieuw-west", "Amsterdam Nieuw-West", "Amsterdam Nieuw-West"],
  ["oost", "oost", "Amsterdam Oost", "Amsterdam Oost"],
  ["noord", "noord", "Amsterdam Noord", "Amsterdam Noord"],
  ["amsterdam-noord", "noord", "Amsterdam Noord", "Amsterdam Noord"],
  ["north-amsterdam", "noord", "North Amsterdam", "North Amsterdam"],
  ["zuid", "zuid", "Amsterdam Zuid", "Amsterdam Zuid"],
  ["zuidoost", "zuidoost", "Amsterdam Zuidoost", "Amsterdam Zuidoost"],
  ["bijlmer", "bijlmer", "Bijlmer", "Bijlmer"],
  ["diemen", "diemen", "Diemen", "Diemen"],
  ["amsterdam-centraal", "central-station", "Amsterdam Centraal", "Amsterdam Centraal"]
];

const englishWhereRoutes: Array<[string, SeoAreaSlug, string, string]> = [
  ["centrum", "centrum", "Amsterdam Centrum", "Centrum"],
  ["de-pijp", "de-pijp", "De Pijp", "De Pijp"],
  ["jordaan", "jordaan", "Jordaan", "Jordaan"],
  ["de-wallen", "de-wallen", "De Wallen", "De Wallen"],
  ["west", "west", "Amsterdam West", "Amsterdam West"],
  ["nieuw-west", "nieuw-west", "Amsterdam Nieuw-West", "Nieuw-West"],
  ["oost", "oost", "Amsterdam Oost", "Amsterdam Oost"],
  ["noord", "noord", "Amsterdam Noord", "Amsterdam Noord"],
  ["north-amsterdam", "noord", "North Amsterdam", "North Amsterdam"],
  ["zuid", "zuid", "Amsterdam Zuid", "Amsterdam Zuid"],
  ["zuidoost", "zuidoost", "Amsterdam Zuidoost", "Amsterdam Zuidoost"],
  ["bijlmer", "bijlmer", "Bijlmer", "Bijlmer"],
  ["diemen", "diemen", "Diemen", "Diemen"],
  ["central-station", "central-station", "Amsterdam Central Station", "Central Station"]
];

const germanAreaRoutes: Array<[string, SeoAreaSlug, string, string]> = [
  ["zentrum", "centrum", "Amsterdam Zentrum", "Amsterdam Zentrum"],
  ["de-pijp", "de-pijp", "De Pijp", "De Pijp"],
  ["jordaan", "jordaan", "Jordaan", "Jordaan"],
  ["de-wallen", "de-wallen", "De Wallen", "De Wallen"],
  ["west", "west", "Amsterdam West", "Amsterdam West"],
  ["neu-west", "nieuw-west", "Amsterdam Neu-West", "Amsterdam Neu-West"],
  ["ost", "oost", "Amsterdam Ost", "Amsterdam Ost"],
  ["nord", "noord", "Amsterdam Nord", "Amsterdam Nord"],
  ["amsterdam-nord", "noord", "Amsterdam Nord", "Amsterdam Nord"],
  ["north-amsterdam", "noord", "North Amsterdam", "North Amsterdam"],
  ["sued", "zuid", "Amsterdam Süd", "Amsterdam Süd"],
  ["suedost", "zuidoost", "Amsterdam Südost", "Amsterdam Südost"],
  ["bijlmer", "bijlmer", "Bijlmer", "Bijlmer"],
  ["diemen", "diemen", "Diemen", "Diemen"],
  ["amsterdam-centraal", "central-station", "Amsterdam Centraal", "Amsterdam Centraal"]
];

const frenchAreaRoutes: Array<[string, SeoAreaSlug, string, string]> = [
  ["centre", "centrum", "Amsterdam Centre", "Amsterdam Centre"],
  ["de-pijp", "de-pijp", "De Pijp", "De Pijp"],
  ["jordaan", "jordaan", "Jordaan", "Jordaan"],
  ["de-wallen", "de-wallen", "De Wallen", "De Wallen"],
  ["ouest", "west", "Amsterdam Ouest", "Amsterdam Ouest"],
  ["nieuw-west", "nieuw-west", "Amsterdam Nieuw-West", "Amsterdam Nieuw-West"],
  ["est", "oost", "Amsterdam Est", "Amsterdam Est"],
  ["nord", "noord", "Amsterdam Nord", "Amsterdam Nord"],
  ["amsterdam-nord", "noord", "Amsterdam Nord", "Amsterdam Nord"],
  ["north-amsterdam", "noord", "North Amsterdam", "North Amsterdam"],
  ["sud", "zuid", "Amsterdam Sud", "Amsterdam Sud"],
  ["sud-est", "zuidoost", "Amsterdam Sud-Est", "Amsterdam Sud-Est"],
  ["bijlmer", "bijlmer", "Bijlmer", "Bijlmer"],
  ["diemen", "diemen", "Diemen", "Diemen"],
  ["gare-centrale", "central-station", "la gare centrale d’Amsterdam", "Gare centrale"]
];

const nearMeSeoRoutes: SeoRouteSeed[] = [
  {
    language: "en",
    href: "/amsterdam/tobacco-shop-near-me",
    label: "Tobacco shop near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-tobacco-shop",
    searchIntentKeywords: ["tobacco shop near me", "tobacco shop near me Amsterdam"],
    seoTitle: "Tobacco Shop Near Me in Amsterdam | Map, Opening Hours & Directions",
    metaDescription:
      "Find practical location information for tobacco shops, kiosks and gas stations near you in Amsterdam, including opening hours, directions and map view. Adults 18+ only.",
    h1: "Tobacco Shop Near Me in Amsterdam",
    isPrimary: true
  },
  {
    language: "en",
    href: "/amsterdam/tabak-shop-near-me",
    label: "Tabak shop near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-tabak-shop",
    searchIntentKeywords: ["tabak shop near me", "tabak shop Amsterdam"],
    seoTitle: "Tabak Shop Near Me in Amsterdam | Map & Directions",
    metaDescription:
      "Find practical location information for tabak shops, kiosks and gas stations near you in Amsterdam, including opening hours, directions and map view. Adults 18+ only.",
    h1: "Tabak Shop Near Me in Amsterdam"
  },
  {
    language: "en",
    href: "/amsterdam/tobacco-store-near-me",
    label: "Tobacco store near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-tobacco-store",
    searchIntentKeywords: ["tobacco store near me", "tobacco store Amsterdam"],
    seoTitle: "Tobacco Store Near Me in Amsterdam | Map, Opening Hours & Directions",
    metaDescription:
      "Find practical location information for tobacco stores, kiosks and gas stations near you in Amsterdam, including opening hours, directions and nearby locations. Adults 18+ only.",
    h1: "Tobacco Store Near Me in Amsterdam"
  },
  {
    language: "en",
    href: "/amsterdam/cigarette-shop-near-me",
    label: "Cigarette shop near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-cigarette-shop",
    searchIntentKeywords: ["cigarette shop near me", "cigarette shop Amsterdam"],
    seoTitle: "Cigarette Shop Near Me in Amsterdam | Map, Opening Hours & Directions",
    metaDescription:
      "Find practical location information for cigarette shop searches in Amsterdam, including nearby listings, opening hours, map view and directions. Adults 18+ only.",
    h1: "Cigarette Shop Near Me in Amsterdam"
  },
  {
    language: "en",
    href: "/amsterdam/cigarettes-near-me",
    label: "Cigarettes near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-cigarettes",
    searchIntentKeywords: ["cigarettes near me", "cigarettes near me Amsterdam"],
    seoTitle: "Cigarettes Near Me in Amsterdam | Map, Opening Hours & Directions",
    metaDescription:
      "Find practical location information for tobacco shops, kiosks and gas stations near you in Amsterdam, including opening hours, directions and map view. Adults 18+ only.",
    h1: "Cigarettes Near Me in Amsterdam"
  },
  {
    language: "en",
    href: "/amsterdam/tabac-near-me",
    label: "Tabac near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-tabac",
    searchIntentKeywords: ["tabac near me", "tabac shop near me", "tabac Amsterdam"],
    seoTitle: "Tabac Near Me in Amsterdam | Map, Opening Hours & Directions",
    metaDescription:
      "Find practical location information for tabac and tobacco shop searches in Amsterdam, including nearby locations, opening hours and directions. Adults 18+ only.",
    h1: "Tabac Near Me in Amsterdam"
  },
  {
    language: "en",
    href: "/amsterdam/buy-cigarettes-near-me",
    label: "Buy cigarettes near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-buy-cigarettes",
    searchIntentKeywords: ["buy cigarettes near me", "buy cigarettes near me Amsterdam"],
    seoTitle: "Buy Cigarettes Near Me in Amsterdam | Map & Directions",
    metaDescription:
      "Find practical location information for tobacco shops, kiosks and gas stations near you in Amsterdam, including opening hours, directions and map view. Adults 18+ only.",
    h1: "Buy Cigarettes Near Me in Amsterdam"
  },
  {
    language: "en",
    href: "/amsterdam/where-to-buy-cigarettes-near-me",
    label: "Where to buy cigarettes near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-where-cigarettes",
    searchIntentKeywords: ["where to buy cigarettes near me", "where to buy cigarettes near me Amsterdam"],
    seoTitle: "Where to Buy Cigarettes Near Me in Amsterdam | Map & Directions",
    metaDescription:
      "Find practical location information for tobacco shops, kiosks and gas stations near you in Amsterdam, including opening hours, directions and nearby locations. Adults 18+ only.",
    h1: "Where to Buy Cigarettes Near Me in Amsterdam"
  },
  {
    language: "nl",
    href: "/amsterdam/sigaretten-kopen-in-de-buurt",
    label: "Sigaretten kopen in de buurt",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-sigaretten-buurt",
    searchIntentKeywords: ["sigaretten kopen in de buurt", "sigaretten kopen in de buurt mijn locatie"],
    seoTitle: "Sigaretten kopen in de buurt | Kaart, Openingstijden & Route",
    metaDescription:
      "Bekijk praktische locatie-informatie voor tabakswinkels, kiosken en tankstations in de buurt in Amsterdam, inclusief openingstijden, routes en kaartweergave. Alleen voor volwassenen van 18+.",
    h1: "Sigaretten kopen in de buurt"
  },
  {
    language: "nl",
    href: "/amsterdam/sigaretten-kopen-near-me",
    label: "Sigaretten kopen near me",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "near-me",
    translationKey: "near-me-sigaretten-near-me",
    searchIntentKeywords: ["sigaretten kopen near me", "sigaretten kopen Amsterdam near me"],
    seoTitle: "Sigaretten kopen near me in Amsterdam | Kaart, Openingstijden & Route",
    metaDescription:
      "Bekijk praktische locatie-informatie voor tabakswinkels, kiosken en tankstations near me in Amsterdam, inclusief openingstijden, routes en kaartweergave. Alleen voor volwassenen van 18+.",
    h1: "Sigaretten kopen near me in Amsterdam"
  }
];

const seoRouteSeeds: SeoRouteSeed[] = [
  ...nearMeSeoRoutes,
  {
    language: "nl",
    href: "/amsterdam/sigaretten-kopen",
    label: "Sigaretten kopen Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "buy",
    translationKey: "buy-amsterdam",
    searchIntentKeywords: ["sigaretten kopen Amsterdam", "tabakswinkel Amsterdam", "tabakszaak Amsterdam"],
    h1: "Sigaretten kopen in Amsterdam",
    isPrimary: true
  },
  {
    language: "nl",
    href: "/amsterdam/waar-sigaretten-kopen",
    label: "Waar sigaretten kopen Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "where",
    translationKey: "where-amsterdam",
    searchIntentKeywords: ["waar sigaretten kopen Amsterdam", "waar kan ik sigaretten kopen"],
    h1: "Waar sigaretten kopen in Amsterdam?",
    isPrimary: true
  },
  ...dutchAreaRoutes.map(([slug, areaSlug, areaDisplayName, label]) => ({
    language: "nl" as const,
    href: `/amsterdam/sigaretten-kopen-${slug}`,
    label: `Sigaretten kopen ${label}`,
    areaSlug,
    areaDisplayName,
    intent: "buy" as const,
    translationKey: `buy-${slug}`,
    searchIntentKeywords: [`sigaretten kopen ${areaDisplayName}`, `tabakswinkel ${areaDisplayName}`],
    isPrimary: slug === "bijlmer" || slug === "north-amsterdam" || slug === "amsterdam-centraal",
    ...(slug === "bijlmer"
      ? {
          h1: "Sigaretten kopen in Bijlmer"
        }
      : {}),
    ...(slug === "north-amsterdam"
      ? {
          h1: "Sigaretten kopen in North Amsterdam"
        }
      : {})
  })),
  {
    language: "en",
    href: "/amsterdam/buy-cigarettes",
    label: "Buy cigarettes Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "buy",
    translationKey: "buy-amsterdam",
    searchIntentKeywords: ["buy cigarettes Amsterdam", "cigarettes Amsterdam"],
    h1: "Buy Cigarettes in Amsterdam?",
    isPrimary: true
  },
  {
    language: "en",
    href: "/amsterdam/where-to-buy-cigarettes",
    label: "Where to buy cigarettes Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "where",
    translationKey: "where-amsterdam",
    searchIntentKeywords: ["where to buy cigarettes Amsterdam", "where to buy cigarettes in Amsterdam"],
    h1: "Where to Buy Cigarettes in Amsterdam",
    isPrimary: true
  },
  ...englishWhereRoutes.map(([slug, areaSlug, areaDisplayName, label]) => ({
    language: "en" as const,
    href: `/amsterdam/where-to-buy-cigarettes-${slug}`,
    label: `Where to buy cigarettes ${label}`,
    areaSlug,
    areaDisplayName,
    intent: "where" as const,
    translationKey: `where-${slug}`,
    searchIntentKeywords: [`where to buy cigarettes ${areaDisplayName}`, `cigarettes ${areaDisplayName}`],
    isPrimary: slug === "north-amsterdam" || slug === "bijlmer" || slug === "central-station",
    ...(slug === "north-amsterdam"
      ? {
          h1: "Where to Buy Cigarettes in North Amsterdam"
        }
      : {})
  })),
  {
    language: "en",
    href: "/amsterdam/tobacco-shops",
    label: "Tobacco shops Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "tobacco",
    translationKey: "tobacco-amsterdam",
    searchIntentKeywords: ["tobacco shop Amsterdam", "tobacco shops near me Amsterdam"],
    h1: "Tobacco Shops in Amsterdam",
    isPrimary: true
  },
  ...[
    ["north-amsterdam", "noord", "North Amsterdam", "North Amsterdam"],
    ["bijlmer", "bijlmer", "Bijlmer", "Bijlmer"],
    ["central-station", "central-station", "Amsterdam Central Station", "Central Station"]
  ].map(([slug, areaSlug, areaDisplayName, label]) => ({
    language: "en" as const,
    href: `/amsterdam/tobacco-shops-${slug}`,
    label: `Tobacco shops ${label}`,
    areaSlug: areaSlug as SeoAreaSlug,
    areaDisplayName,
    intent: "tobacco" as const,
    translationKey: `tobacco-${slug}`,
    searchIntentKeywords: [`tobacco shops ${areaDisplayName}`, `tobacco shop ${areaDisplayName}`],
    isPrimary: true
  })),
  {
    language: "de",
    href: "/de/amsterdam/zigaretten-kaufen",
    label: "Zigaretten kaufen Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "buy",
    translationKey: "buy-amsterdam",
    searchIntentKeywords: ["Zigaretten kaufen Amsterdam", "cigarettes kaufen Amsterdam"],
    isPrimary: true
  },
  ...germanAreaRoutes.map(([slug, areaSlug, areaDisplayName, label]) => ({
    language: "de" as const,
    href: `/de/amsterdam/zigaretten-kaufen-${slug}`,
    label: `Zigaretten kaufen ${label}`,
    areaSlug,
    areaDisplayName,
    intent: "buy" as const,
    translationKey: `buy-${slug}`,
    searchIntentKeywords: [`Zigaretten kaufen ${areaDisplayName}`, `cigarettes kaufen ${areaDisplayName}`],
    isPrimary: slug === "amsterdam-nord" || slug === "bijlmer" || slug === "amsterdam-centraal",
    ...(slug === "amsterdam-nord"
      ? {
          h1: "Zigaretten kaufen in Amsterdam Nord"
        }
      : {})
  })),
  ...[
    ["amsterdam", "amsterdam", "Amsterdam", "Amsterdam"],
    ["amsterdam-nord", "noord", "Amsterdam Nord", "Amsterdam Nord"],
    ["bijlmer", "bijlmer", "Bijlmer", "Bijlmer"]
  ].map(([slug, areaSlug, areaDisplayName, label]) => ({
    language: "de" as const,
    href: `/de/amsterdam/tabakladen-${slug}`,
    label: `Tabakladen ${label}`,
    areaSlug: areaSlug as SeoAreaSlug,
    areaDisplayName,
    intent: "tobacco" as const,
    translationKey: `tobacco-${slug}`,
    searchIntentKeywords: [`Tabakladen ${areaDisplayName}`, `Tabakgeschäft ${areaDisplayName}`],
    isPrimary: true
  })),
  {
    language: "fr",
    href: "/fr/amsterdam/acheter-cigarettes",
    label: "Acheter cigarettes Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "buy",
    translationKey: "buy-amsterdam",
    searchIntentKeywords: ["acheter des cigarettes à Amsterdam", "acheter cigarettes Amsterdam"],
    isPrimary: true
  },
  {
    language: "fr",
    href: "/fr/amsterdam/ou-acheter-cigarettes",
    label: "Où acheter cigarettes Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "where",
    translationKey: "where-amsterdam",
    searchIntentKeywords: ["où acheter des cigarettes à Amsterdam", "ou acheter cigarettes Amsterdam"],
    isPrimary: true
  },
  ...frenchAreaRoutes.map(([slug, areaSlug, areaDisplayName, label]) => ({
    language: "fr" as const,
    href: `/fr/amsterdam/acheter-cigarettes-${slug}`,
    label: `Acheter cigarettes ${label}`,
    areaSlug,
    areaDisplayName,
    intent: "buy" as const,
    translationKey: `buy-${slug}`,
    searchIntentKeywords: [`acheter cigarettes ${areaDisplayName}`, `acheter des cigarettes ${areaDisplayName}`],
    isPrimary: slug === "amsterdam-nord" || slug === "bijlmer" || slug === "gare-centrale",
    ...(slug === "amsterdam-nord"
      ? {
          h1: "Acheter des cigarettes à Amsterdam Nord"
        }
      : {})
  })),
  ...[
    ["amsterdam", "amsterdam", "Amsterdam", "Amsterdam"],
    ["amsterdam-nord", "noord", "Amsterdam Nord", "Amsterdam Nord"],
    ["bijlmer", "bijlmer", "Bijlmer", "Bijlmer"]
  ].map(([slug, areaSlug, areaDisplayName, label]) => ({
    language: "fr" as const,
    href: `/fr/amsterdam/bureau-de-tabac-${slug}`,
    label: `Bureau de tabac ${label}`,
    areaSlug: areaSlug as SeoAreaSlug,
    areaDisplayName,
    intent: "tobacco" as const,
    translationKey: `tobacco-${slug}`,
    searchIntentKeywords: [`bureau de tabac ${areaDisplayName}`, `bureaux de tabac ${areaDisplayName}`],
    isPrimary: true
  }))
];

export function getSeoLandingPage(href: string) {
  return seoLandingPages.find((page) => page.href === href);
}

export function getSeoLandingPagesByPrefix(prefix: string) {
  return seoLandingPages.filter((page) => page.href.startsWith(prefix));
}

export function getSeoPageMetadata(page: SeoLandingPageDefinition): Metadata {
  return {
    title: {
      absolute: page.seoTitle
    },
    description: page.metaDescription,
    alternates: {
      canonical: page.href,
      languages: getSeoHreflangLinks(page)
    }
  };
}

export function getSeoPageUiLabels(language: SeoLanguage) {
  return uiLabels[language];
}

function createSeoLandingPage(seed: SeoRouteSeed): SeoLandingPageDefinition {
  const labels = uiLabels[seed.language];
  const seoTitle = seed.seoTitle ?? getSeoTitle(seed);
  const metaDescription = seed.metaDescription ?? getMetaDescription(seed);
  const h1 = seed.h1 ?? getH1(seed);
  const introCopy = getIntro(seed);
  const faqItems = getFaqItems(seed);

  return {
    ...seed,
    seoTitle,
    metaDescription,
    metadataTitle: seoTitle,
    metadataDescription: metaDescription,
    h1,
    introCopy,
    intro: introCopy,
    context: labels.context(seed.areaDisplayName),
    practicalPoints: labels.practicalPoints,
    faqItems,
    faqs: faqItems,
    relatedLinks: getRelatedLinks(seed),
    listingLimit,
    ctaLabel: labels.ctaLabel
  };
}

function getSeoTitle(seed: SeoRouteSeed) {
  const area = getMetadataAreaDisplayName(seed);

  if (seed.language === "nl") {
    const suffix = seed.areaSlug === "amsterdam" ? "Kaart, Openingstijden & Routes" : "Kaart, Openingstijden & Route";

    return seed.intent === "where"
      ? `Waar sigaretten kopen in ${area} | ${suffix}`
      : `Sigaretten kopen in ${area} | ${suffix}`;
  }

  if (seed.language === "de") {
    const suffix = seed.areaSlug === "amsterdam" ? "Karte & Wegbeschreibung" : "Karte, Öffnungszeiten & Route";

    return seed.intent === "tobacco"
      ? `Tabakladen in ${area} | ${suffix}`
      : `Zigaretten kaufen in ${area} | ${suffix}`;
  }

  if (seed.language === "fr") {
    const suffix = seed.areaSlug === "amsterdam" ? "Carte et itinéraires" : "Carte, horaires et itinéraires";

    if (seed.intent === "where") {
      return `Où acheter des cigarettes à ${area} | ${suffix}`;
    }

    return seed.intent === "tobacco"
      ? `Bureau de tabac à ${area} | ${suffix}`
      : `Acheter des cigarettes à ${area} | ${suffix}`;
  }

  const suffix = seed.areaSlug === "amsterdam" ? "Map & Directions" : "Map, Opening Hours & Directions";

  if (seed.intent === "buy") {
    return `Buy Cigarettes in ${area} | ${suffix}`;
  }

  return seed.intent === "tobacco"
    ? `Tobacco Shops in ${area} | ${suffix}`
    : `Where to Buy Cigarettes in ${area} | ${suffix}`;
}

function getMetaDescription(seed: SeoRouteSeed) {
  const area = getMetadataAreaDisplayName(seed);

  if (seed.language === "nl") {
    if (seed.intent === "where") {
      return `Bekijk waar volwassenen praktische locatie-informatie vinden voor tabakswinkels, kiosken en tankstations in ${area}, met routes en openingstijden. Alleen 18+.`;
    }

    return `Bekijk tabakswinkels, kiosken en tankstations in ${area} met openingstijden, routes en locaties in de buurt. Alleen voor volwassenen van 18+.`;
  }

  if (seed.language === "de") {
    if (seed.intent === "tobacco") {
      return `Sehen Sie Tabakläden, Kioske und Tankstellen in ${area} mit Karte, Öffnungszeiten und Wegbeschreibungen. Nur ab 18 Jahren.`;
    }

    return `Finden Sie praktische Standortinformationen zu Tabakgeschäften, Kiosken und Tankstellen in ${area}, einschließlich Öffnungszeiten und Wegbeschreibungen. Nur ab 18 Jahren.`;
  }

  if (seed.language === "fr") {
    if (seed.intent === "tobacco") {
      return `Consultez les bureaux de tabac, kiosques et stations-service à ${area}, avec carte, horaires et itinéraires. Réservé aux adultes de 18 ans et plus.`;
    }

    return `Trouvez des informations pratiques sur les bureaux de tabac, kiosques et stations-service à ${area}, avec horaires et itinéraires. Réservé aux adultes de 18 ans et plus.`;
  }

  if (seed.intent === "tobacco") {
    return `View tobacco shops, kiosks and gas stations in ${area} with map directions, opening hours and nearby locations. Adults 18+ only.`;
  }

  if (seed.intent === "buy") {
    return `Use the map to find practical location information for tobacco shops, kiosks and gas stations in ${area}, including directions and nearby locations. Adults 18+ only.`;
  }

  return `Find practical location information for tobacco shops, kiosks and gas stations in ${area}, including opening hours, directions and nearby locations. Adults 18+ only.`;
}

function getMetadataAreaDisplayName(seed: SeoRouteSeed) {
  if (
    seed.href.includes("sigaretten-kopen-noord") ||
    seed.href.includes("zigaretten-kaufen-nord") ||
    seed.href.includes("acheter-cigarettes-nord")
  ) {
    return seed.language === "nl" ? "Noord Amsterdam" : "Amsterdam Nord";
  }

  if (seed.href.includes("amsterdam-noord") || seed.href.includes("amsterdam-nord")) {
    return seed.language === "nl" ? "Amsterdam-Noord" : "Amsterdam-Nord";
  }

  return seed.areaDisplayName;
}

function getH1(seed: SeoRouteSeed) {
  if (seed.language === "nl") {
    return seed.intent === "where" ? `Waar sigaretten kopen in ${seed.areaDisplayName}?` : `Sigaretten kopen in ${seed.areaDisplayName}`;
  }

  if (seed.language === "de") {
    return seed.intent === "tobacco" ? `Tabakladen in ${seed.areaDisplayName}` : `Zigaretten kaufen in ${seed.areaDisplayName}`;
  }

  if (seed.language === "fr") {
    if (seed.intent === "where") {
      return `Où acheter des cigarettes à ${seed.areaDisplayName} ?`;
    }

    return seed.intent === "tobacco"
      ? `Bureaux de tabac à ${seed.areaDisplayName}`
      : `Acheter des cigarettes à ${seed.areaDisplayName}`;
  }

  return seed.intent === "tobacco"
    ? `Tobacco Shops in ${seed.areaDisplayName}`
    : `Where to Buy Cigarettes in ${seed.areaDisplayName}`;
}

function getIntro(seed: SeoRouteSeed) {
  const area = seed.areaDisplayName;
  const areaContext = getAreaContext(seed.language, seed.areaSlug, area);
  const compliance = getComplianceSentence(seed.language);

  if (seed.intent === "near-me") {
    if (seed.language === "nl") {
      return `Deze pagina helpt volwassenen van 18+ met praktische locatie-informatie voor tabakswinkels, kiosken en tankstations in de buurt in Amsterdam. Je kunt zoeken per gebied of “Gebruik mijn locatie” gebruiken om locaties in de buurt te bekijken; locatie delen is optioneel en wordt alleen in je browser gebruikt om te sorteren. ${areaContext} ${compliance}`;
    }

    return `This page helps adults aged 18+ find practical location information for tobacco shops, kiosks and gas stations near them in Amsterdam. You can use the map, search by area, or choose “Use my location” to sort nearby listings; location access is optional and only used in your browser for this search. ${areaContext} ${compliance}`;
  }

  if (seed.language === "nl") {
    const opening =
      seed.intent === "where"
        ? `Wil je weten waar je in ${area} praktische informatie over verkooppunten kunt vinden?`
        : `Zoek je praktische informatie over sigaretten kopen in ${area}, zoals locaties van tabakswinkels, kiosken of tankstations?`;

    return `${opening} Op deze pagina vind je adressen, openingstijden waar beschikbaar, route-informatie en een kaartweergave. ${areaContext} ${compliance}`;
  }

  if (seed.language === "de") {
    const opening =
      seed.intent === "tobacco"
        ? `Suchen Sie einen Tabakladen in ${area} oder praktische Informationen zu gelisteten Standorten?`
        : `Neu in Amsterdam oder nur für ein paar Tage in der Stadt und auf der Suche nach Informationen zu Zigaretten kaufen in ${area}?`;

    return `${opening} Diese Seite hilft Erwachsenen ab 18 Jahren, praktische Standortinformationen zu Tabakgeschäften, Kiosken oder Tankstellen zu finden, darunter Adressen, Öffnungszeiten soweit verfügbar, Wegbeschreibungen und eine Kartenansicht. ${areaContext} ${compliance}`;
  }

  if (seed.language === "fr") {
    const opening =
      seed.intent === "where"
        ? `Vous êtes de passage à Amsterdam, expatrié ou simplement peu familier avec les règles locales et vous cherchez où acheter des cigarettes à ${area} ?`
        : `Vous recherchez des informations pratiques pour acheter des cigarettes à ${area} ou trouver un bureau de tabac dans le secteur ?`;

    return `${opening} Cette page aide les adultes de 18 ans et plus à consulter des informations pratiques sur les bureaux de tabac, kiosques ou stations-service, avec adresses, horaires lorsque disponibles, itinéraires et vue carte. ${areaContext} ${compliance}`;
  }

  const opening =
    seed.intent === "tobacco"
      ? `Looking for practical information about tobacco shops in ${area}?`
      : `New to Amsterdam, visiting for a few days, or just not used to the Dutch tobacco sales rules?`;

  return `${opening} This page helps adults aged 18+ who search for where to buy cigarettes in ${area} by showing practical location information for listed tobacco shops, kiosks or gas stations, including addresses, opening hours where available, directions and a map view. ${areaContext} ${compliance}`;
}

function getComplianceSentence(language: SeoLanguage) {
  if (language === "nl") {
    return "TobaccoNearby verkoopt geen tabaksproducten en moedigt roken niet aan. De website biedt alleen praktische locatie-informatie voor volwassenen van 18+.";
  }

  if (language === "de") {
    return "TobaccoNearby verkauft keine Tabakprodukte und fördert das Rauchen nicht. Die Website bietet nur praktische Standortinformationen für Erwachsene ab 18 Jahren.";
  }

  if (language === "fr") {
    return "TobaccoNearby ne vend pas de produits du tabac et ne fait pas la promotion du tabagisme. Le site fournit uniquement des informations pratiques de localisation pour les adultes de 18 ans et plus.";
  }

  return "TobaccoNearby does not sell tobacco products or promote smoking. The website only provides practical location information for adults aged 18+.";
}

function getAreaContext(language: SeoLanguage, areaSlug: SeoAreaSlug, areaDisplayName: string) {
  const contexts: Record<SeoAreaSlug, Record<SeoLanguage, string>> = {
    amsterdam: {
      nl: "Amsterdam bestaat uit veel verschillende buurten, waardoor zoeken per gebied vaak sneller werkt dan alleen zoeken op stadsniveau.",
      en: "Amsterdam is compact but very neighborhood-based, so searching by area can be more useful than searching the whole city.",
      de: "Amsterdam ist kompakt, aber stark in Stadtteile gegliedert; die Suche nach einem bestimmten Viertel ist oft hilfreicher.",
      fr: "Amsterdam est une ville compacte mais très organisée par quartiers, ce qui rend la recherche par zone souvent plus pratique."
    },
    centrum: {
      nl: "Centrum heeft drukke straten, veel openbaarvervoerverbindingen en korte loopafstanden tussen bekende plekken.",
      en: "Centrum has busy central streets, many public transport connections and short walking distances between well-known places.",
      de: "Das Zentrum hat belebte Straßen, viele Verbindungen mit öffentlichen Verkehrsmitteln und kurze Wege zwischen bekannten Orten.",
      fr: "Le centre regroupe des rues fréquentées, de nombreuses connexions de transport public et de courtes distances à pied."
    },
    "de-pijp": {
      nl: "De Pijp is een dicht woon- en winkelgebied rond onder meer de Albert Cuypstraat en het Sarphatipark.",
      en: "De Pijp is a dense residential and commercial area near Albert Cuyp and Sarphatipark.",
      de: "De Pijp ist ein dichtes Wohn- und Geschäftsviertel nahe Albert Cuyp und Sarphatipark.",
      fr: "De Pijp est un quartier résidentiel et commerçant dense près d’Albert Cuyp et de Sarphatipark."
    },
    jordaan: {
      nl: "De Jordaan staat bekend om smalle straten en lokale winkels rond onder meer Westerstraat en Rozengracht.",
      en: "The Jordaan has narrow streets and local shops around areas such as Westerstraat and Rozengracht.",
      de: "Der Jordaan ist geprägt von schmalen Straßen und lokalen Geschäften rund um Westerstraat und Rozengracht.",
      fr: "Le Jordaan se caractérise par ses rues étroites et ses commerces locaux autour de Westerstraat et Rozengracht."
    },
    "de-wallen": {
      nl: "De Wallen ligt centraal en heeft een historisch stratenpatroon met smalle stegen en grachten.",
      en: "De Wallen is centrally located and has a historic street layout with narrow lanes and canals.",
      de: "De Wallen liegt zentral und hat ein historisches Straßennetz mit engen Gassen und Grachten.",
      fr: "De Wallen est situé au centre et possède un tracé historique de rues étroites et de canaux."
    },
    west: {
      nl: "Amsterdam West omvat praktische woon- en winkelgebieden zoals Oud-West, De Baarsjes en Bos en Lommer.",
      en: "Amsterdam West includes practical residential and commercial areas such as Oud-West, De Baarsjes and Bos en Lommer.",
      de: "Amsterdam West umfasst praktische Wohn- und Geschäftsviertel wie Oud-West, De Baarsjes und Bos en Lommer.",
      fr: "Amsterdam Ouest comprend des zones résidentielles et commerçantes comme Oud-West, De Baarsjes et Bos en Lommer."
    },
    "nieuw-west": {
      nl: "Nieuw-West omvat onder meer Osdorp, Slotervaart, Slotermeer, Geuzenveld en gebieden rond Lelylaan.",
      en: "Nieuw-West includes areas such as Osdorp, Slotervaart, Slotermeer, Geuzenveld and Lelylaan.",
      de: "Nieuw-West umfasst unter anderem Osdorp, Slotervaart, Slotermeer, Geuzenveld und Bereiche rund um Lelylaan.",
      fr: "Nieuw-West comprend notamment Osdorp, Slotervaart, Slotermeer, Geuzenveld et le secteur de Lelylaan."
    },
    oost: {
      nl: "Oost loopt van gebieden rond Oosterpark en de Indische Buurt tot Watergraafsmeer en IJburg.",
      en: "Oost stretches from areas around Oosterpark and Indische Buurt to Watergraafsmeer and IJburg.",
      de: "Oost reicht von Bereichen rund um Oosterpark und Indische Buurt bis Watergraafsmeer und IJburg.",
      fr: "Oost s’étend des environs d’Oosterpark et de l’Indische Buurt jusqu’à Watergraafsmeer et IJburg."
    },
    noord: {
      nl: "Amsterdam Noord is bereikbaar met veerboot en metro en omvat gebieden zoals NDSM en Buikslotermeer.",
      en: "North Amsterdam connects to the centre by ferry and metro, with areas such as NDSM and Buikslotermeer.",
      de: "Amsterdam Nord ist per Fähre und Metro angebunden und umfasst Bereiche wie NDSM und Buikslotermeer.",
      fr: "Amsterdam Nord est relié au centre par ferry et métro, avec des secteurs comme NDSM et Buikslotermeer."
    },
    zuid: {
      nl: "Amsterdam Zuid omvat onder meer Museumkwartier, Rivierenbuurt, Buitenveldert en de Zuidas.",
      en: "Amsterdam Zuid includes Museumkwartier, Rivierenbuurt, Buitenveldert and Zuidas.",
      de: "Amsterdam Zuid umfasst unter anderem Museumkwartier, Rivierenbuurt, Buitenveldert und Zuidas.",
      fr: "Amsterdam Zuid comprend notamment Museumkwartier, Rivierenbuurt, Buitenveldert et Zuidas."
    },
    zuidoost: {
      nl: "Zuidoost omvat Bijlmer, Amsterdamse Poort, de ArenA-omgeving en goede metroverbindingen.",
      en: "Zuidoost includes Bijlmer, Amsterdamse Poort, the ArenA area and useful metro connections.",
      de: "Zuidoost umfasst Bijlmer, Amsterdamse Poort, den ArenA-Bereich und gute Metroverbindungen.",
      fr: "Zuidoost comprend Bijlmer, Amsterdamse Poort, le secteur ArenA et de bonnes connexions en métro."
    },
    bijlmer: {
      nl: "Bijlmer is onderdeel van Amsterdam Zuidoost en wordt vaak apart gezocht door bezoekers en bewoners.",
      en: "Bijlmer is part of Amsterdam Zuidoost and is often searched separately by visitors and locals.",
      de: "Bijlmer gehört zu Amsterdam Zuidoost und wird von Besuchern und Einheimischen oft separat gesucht.",
      fr: "Bijlmer fait partie d’Amsterdam Zuidoost et fait souvent l’objet de recherches séparées par les visiteurs et les habitants."
    },
    diemen: {
      nl: "Diemen is een gemeente naast Amsterdam met gebieden zoals Diemen Centrum en Diemen Zuid.",
      en: "Diemen is a municipality next to Amsterdam with areas such as Diemen Centrum and Diemen Zuid.",
      de: "Diemen ist eine Gemeinde neben Amsterdam mit Bereichen wie Diemen Centrum und Diemen Zuid.",
      fr: "Diemen est une commune voisine d’Amsterdam avec des secteurs comme Diemen Centrum et Diemen Zuid."
    },
    "central-station": {
      nl: "Amsterdam Centraal is een belangrijk vervoersknooppunt waar veel bezoekers hun route door de stad beginnen.",
      en: "Amsterdam Central Station is a major transport hub where many visitors start their route through the city.",
      de: "Amsterdam Centraal ist ein wichtiger Verkehrsknotenpunkt, an dem viele Besucher ihre Route durch die Stadt beginnen.",
      fr: "La gare centrale d’Amsterdam est un grand pôle de transport où de nombreux visiteurs commencent leur itinéraire dans la ville."
    }
  };

  return contexts[areaSlug]?.[language] ?? contexts.amsterdam[language].replace("Amsterdam", areaDisplayName);
}

function getFaqItems(seed: SeoRouteSeed): FAQItem[] {
  const areaDisplayName = seed.areaDisplayName;

  if (seed.intent === "near-me") {
    if (seed.language === "nl") {
      return [
        {
          question: "Hoe vind ik een tabakswinkel in de buurt?",
          answer:
            "Gebruik de zoekbalk, kaart of de knop “Gebruik mijn locatie” om praktische locatie-informatie in Amsterdam te bekijken. Controleer details altijd voordat je vertrekt."
        },
        {
          question: "Gebruikt TobaccoNearby mijn exacte locatie?",
          answer:
            "Locatie delen is optioneel. Als je toestemming geeft, wordt je locatie alleen in je browser gebruikt om resultaten op afstand te sorteren."
        },
        {
          question: "Kan ik zoeken zonder mijn locatie te delen?",
          answer:
            "Ja. Je kunt zoeken op buurt, straat, postcode of gebied, zoals Centrum, Noord, Bijlmer of Amsterdam Centraal."
        },
        {
          question: "Zijn openingstijden altijd actueel?",
          answer:
            "Openingstijden kunnen veranderen door feestdagen, tijdelijke sluitingen of lokale wijzigingen. Controleer gegevens altijd voordat je een locatie bezoekt."
        },
        {
          question: "Verkoopt TobaccoNearby sigaretten?",
          answer:
            "Nee. TobaccoNearby verkoopt geen tabaksproducten en verwerkt geen bestellingen. De website biedt alleen praktische locatie-informatie voor volwassenen van 18+."
        }
      ];
    }

    return [
      {
        question: "How can I find a tobacco shop near me in Amsterdam?",
        answer:
          "Use the search bar, map, or “Use my location” button to view practical Amsterdam location information. Please verify details before visiting."
      },
      {
        question: "Does TobaccoNearby use my exact location?",
        answer:
          "Location access is optional. If you allow it, your location is used only in your browser to sort listings by distance."
      },
      {
        question: "Can I search without sharing my location?",
        answer:
          "Yes. You can search by neighborhood, street, postal code or area, including Centrum, Noord, Bijlmer and Amsterdam Central Station."
      },
      {
        question: "Are opening hours always accurate?",
        answer:
          "Opening hours may change due to holidays, temporary closures or local updates. Please verify details before visiting."
      },
      {
        question: "Does TobaccoNearby sell cigarettes?",
        answer:
          "No. TobaccoNearby does not sell tobacco products, process orders or promote smoking. It only provides practical location information for adults aged 18+."
      }
    ];
  }

  if (seed.language === "nl") {
    return [
      {
        question: "Verkoopt TobaccoNearby sigaretten?",
        answer:
          "Nee. TobaccoNearby verkoopt geen tabaksproducten en verwerkt geen bestellingen. De website biedt alleen praktische locatie-informatie voor volwassenen van 18+."
      },
      {
        question: `Waar kan ik sigaretten kopen in ${areaDisplayName}?`,
        answer:
          "Volwassenen van 18+ kunnen op deze pagina praktische locatie-informatie bekijken, zoals adressen, openingstijden waar beschikbaar en route-informatie. Controleer gegevens altijd voordat je vertrekt."
      },
      {
        question: "Kan ik via deze pagina zoeken op buurt?",
        answer:
          "Ja. Je kunt praktische locatie-informatie bekijken per buurt of gebied, zoals Centrum, De Pijp, Bijlmer, Noord of Diemen."
      },
      {
        question: "Zijn openingstijden altijd actueel?",
        answer:
          "Openingstijden kunnen veranderen door feestdagen, tijdelijke sluitingen of wijzigingen bij de locatie. Controleer details altijd voordat je een locatie bezoekt."
      },
      {
        question: "Kan ik route-informatie bekijken?",
        answer:
          "Ja. Vermeldingen kunnen een routeknop bevatten die Google Maps opent waar een route-link beschikbaar is."
      },
      {
        question: "Kan ik een ontbrekende of verkeerde locatie melden?",
        answer:
          "Ja. Je kunt een correctiesuggestie of update indienen. Inzendingen worden beoordeeld voordat informatie wordt aangepast."
      }
    ];
  }

  if (seed.language === "de") {
    return [
      {
        question: "Verkauft TobaccoNearby Zigaretten?",
        answer:
          "Nein. TobaccoNearby verkauft keine Tabakprodukte und nimmt keine Bestellungen an. Die Website bietet nur praktische Standortinformationen für Erwachsene ab 18 Jahren."
      },
      {
        question: `Wo kann ich in ${areaDisplayName} Zigaretten kaufen?`,
        answer:
          "Erwachsene ab 18 Jahren können hier praktische Informationen zu gelisteten Standorten ansehen, darunter Adressen, Öffnungszeiten soweit verfügbar und Wegbeschreibungen."
      },
      {
        question: "Ich bin als Besucher in Amsterdam. Ist diese Seite hilfreich?",
        answer:
          "Ja. Besucher, Touristen und Expats können die Seite nutzen, um sich praktisch nach Gebiet, Straße oder Stadtteil zu orientieren. Bitte prüfen Sie Details vor dem Besuch."
      },
      {
        question: "Sind die Öffnungszeiten immer aktuell?",
        answer:
          "Öffnungszeiten können sich durch Feiertage, vorübergehende Schließungen oder Änderungen vor Ort ändern. Bitte prüfen Sie Details vor dem Besuch."
      },
      {
        question: "Kann ich Wegbeschreibungen anzeigen?",
        answer:
          "Ja. Einträge können einen Routenlink enthalten, der Google Maps öffnet, sofern verfügbar."
      },
      {
        question: "Kann ich fehlende oder falsche Informationen melden?",
        answer:
          "Ja. Sie können eine Korrektur oder Aktualisierung vorschlagen. Einsendungen werden vor einer Veröffentlichung geprüft."
      }
    ];
  }

  if (seed.language === "fr") {
    return [
      {
        question: "TobaccoNearby vend-il des cigarettes ?",
        answer:
          "Non. TobaccoNearby ne vend pas de produits du tabac et ne traite pas de commandes. Le site fournit uniquement des informations pratiques pour les adultes de 18 ans et plus."
      },
      {
        question: `Où acheter des cigarettes à ${areaDisplayName} ?`,
        answer:
          "Les adultes de 18 ans et plus peuvent consulter des informations pratiques sur les lieux listés, comme les adresses, horaires disponibles et itinéraires."
      },
      {
        question: "Je visite Amsterdam. Cette page peut-elle m’aider ?",
        answer:
          "Oui. Les visiteurs, touristes et expatriés peuvent l’utiliser pour se repérer par quartier, rue ou zone. Vérifiez toujours les détails avant de vous déplacer."
      },
      {
        question: "Les horaires sont-ils toujours exacts ?",
        answer:
          "Les horaires peuvent changer en raison des jours fériés, de fermetures temporaires ou de mises à jour locales. Veuillez vérifier les détails avant de vous déplacer."
      },
      {
        question: "Puis-je obtenir un itinéraire ?",
        answer:
          "Oui. Les fiches peuvent inclure un lien d’itinéraire vers Google Maps lorsque cette information est disponible."
      },
      {
        question: "Puis-je signaler une information manquante ou incorrecte ?",
        answer:
          "Oui. Vous pouvez suggérer une correction ou une mise à jour. Les envois sont vérifiés avant publication."
      }
    ];
  }

  return [
    {
      question: "Does TobaccoNearby sell cigarettes?",
      answer:
        "No. TobaccoNearby does not sell tobacco products, process orders or promote smoking. It only provides practical location information for adults aged 18+."
    },
    {
      question: "I’m visiting Amsterdam. Can I use this page to find nearby tobacco shops?",
      answer:
        "Yes. Adults aged 18+ can use this page to find practical location information such as addresses, opening hours where available and directions. Please verify details before visiting."
    },
    {
      question: `Where can I buy cigarettes in ${areaDisplayName}?`,
      answer:
        "Adults aged 18+ can use TobaccoNearby to find practical information about listed locations, including addresses, opening hours where available and directions."
    },
    {
      question: "Are opening hours always accurate?",
      answer:
        "Opening hours may change due to holidays, temporary closures or local updates. Please verify details before visiting."
    },
    {
      question: "Can I get directions to listed locations?",
      answer:
        "Yes. Listings may include a directions link that opens route information in Google Maps where available."
    },
    {
      question: "Can I report a missing or incorrect location?",
      answer:
        "Yes. Use the report or update option to suggest corrections. Submitted updates are reviewed before changes are made."
    }
  ];
}

function getRelatedLinks(seed: SeoRouteSeed): SeoRelatedLink[] {
  if (seed.intent === "near-me") {
    return uniqueRelatedLinks([
      { href: "/search", label: seed.language === "nl" ? "Zoeken op locatie" : "Search Amsterdam listings" },
      { href: "/amsterdam/tobacco-shops", label: seed.language === "nl" ? "Tabakswinkels Amsterdam" : "Tobacco shops Amsterdam" },
      {
        href: "/amsterdam/where-to-buy-cigarettes",
        label: seed.language === "nl" ? "Where to buy cigarettes Amsterdam" : "Where to buy cigarettes Amsterdam"
      },
      { href: "/amsterdam/sigaretten-kopen", label: "Sigaretten kopen Amsterdam" },
      {
        href: "/amsterdam/near-central-station",
        label: seed.language === "nl" ? "Amsterdam Centraal" : "Amsterdam Central Station"
      },
      { href: "/amsterdam/centrum", label: "Amsterdam Centrum" },
      { href: "/amsterdam/zuidoost", label: "Amsterdam Zuidoost" },
      { href: "/amsterdam/noord", label: "Amsterdam Noord" },
      { href: "/amsterdam/tobacco-shop-near-me", label: "Tobacco shop near me" },
      { href: "/amsterdam/cigarettes-near-me", label: "Cigarettes near me" },
      { href: "/amsterdam/sigaretten-kopen-in-de-buurt", label: "Sigaretten kopen in de buurt" }
    ]).filter((link) => link.href !== seed.href);
  }

  const languageLinks: Record<SeoLanguage, SeoRelatedLink[]> = {
    nl: [
      { href: "/amsterdam/sigaretten-kopen", label: "Sigaretten kopen Amsterdam" },
      { href: "/amsterdam/waar-sigaretten-kopen", label: "Waar sigaretten kopen Amsterdam" },
      { href: "/amsterdam/sigaretten-kopen-amsterdam-centraal", label: "Sigaretten kopen Amsterdam Centraal" },
      { href: "/amsterdam/sigaretten-kopen-north-amsterdam", label: "Sigaretten kopen North Amsterdam" },
      { href: "/amsterdam/sigaretten-kopen-bijlmer", label: "Sigaretten kopen Bijlmer" },
      { href: "/amsterdam/sigaretten-kopen-noord", label: "Sigaretten kopen Amsterdam Noord" },
      { href: "/amsterdam/tobacco-shops", label: "Tabakswinkels Amsterdam" }
    ],
    en: [
      { href: "/amsterdam/where-to-buy-cigarettes", label: "Where to buy cigarettes Amsterdam" },
      { href: "/amsterdam/buy-cigarettes", label: "Buy cigarettes Amsterdam" },
      { href: "/amsterdam/where-to-buy-cigarettes-central-station", label: "Cigarettes near Amsterdam Central Station" },
      { href: "/amsterdam/where-to-buy-cigarettes-north-amsterdam", label: "Where to buy cigarettes North Amsterdam" },
      { href: "/amsterdam/where-to-buy-cigarettes-bijlmer", label: "Where to buy cigarettes Bijlmer" },
      { href: "/amsterdam/tobacco-shops", label: "Tobacco shops Amsterdam" }
    ],
    de: [
      { href: "/de/amsterdam/zigaretten-kaufen", label: "Zigaretten kaufen Amsterdam" },
      { href: "/de/amsterdam/zigaretten-kaufen-amsterdam-nord", label: "Zigaretten kaufen Amsterdam Nord" },
      { href: "/de/amsterdam/zigaretten-kaufen-bijlmer", label: "Zigaretten kaufen Bijlmer" },
      { href: "/de/amsterdam/zigaretten-kaufen-amsterdam-centraal", label: "Zigaretten kaufen Amsterdam Centraal" },
      { href: "/de/amsterdam/tabakladen-amsterdam", label: "Tabakladen Amsterdam" }
    ],
    fr: [
      { href: "/fr/amsterdam/acheter-cigarettes", label: "Acheter cigarettes Amsterdam" },
      { href: "/fr/amsterdam/ou-acheter-cigarettes", label: "Où acheter cigarettes Amsterdam" },
      { href: "/fr/amsterdam/acheter-cigarettes-amsterdam-nord", label: "Acheter cigarettes Amsterdam Nord" },
      { href: "/fr/amsterdam/acheter-cigarettes-bijlmer", label: "Acheter cigarettes Bijlmer" },
      { href: "/fr/amsterdam/bureau-de-tabac-amsterdam", label: "Bureau de tabac Amsterdam" },
      { href: "/fr/amsterdam/acheter-cigarettes-gare-centrale", label: "Cigarettes près de la gare centrale" }
    ]
  };

  const areaLinks = [
    { href: "/amsterdam/centrum", label: "Centrum" },
    { href: "/amsterdam/de-pijp", label: "De Pijp" },
    { href: "/amsterdam/jordaan", label: "Jordaan" },
    { href: "/amsterdam/de-wallen", label: "De Wallen" },
    { href: "/amsterdam/noord", label: "Amsterdam Noord" },
    { href: "/amsterdam/zuidoost", label: "Amsterdam Zuidoost" },
    { href: "/amsterdam/diemen", label: "Diemen" },
    { href: "/amsterdam/near-central-station", label: "Amsterdam Central Station" }
  ];

  const orderedLinks =
    seed.areaSlug === "amsterdam"
      ? [...languageLinks[seed.language], ...areaLinks]
      : [...getContextualRelatedLinks(seed), ...languageLinks[seed.language], ...areaLinks];

  return uniqueRelatedLinks(orderedLinks).filter((link) => link.href !== seed.href);
}

function getContextualRelatedLinks(seed: SeoRouteSeed): SeoRelatedLink[] {
  const areaLinkLabels = getAreaLinkLabels(seed.language);
  const generalLink = getGeneralAmsterdamLink(seed.language);
  const generalTobaccoLink = getTobaccoOverviewLink(seed.language);
  const centralStationLink = getSeoAreaLink(seed.language, seed.intent, "central-station");
  const currentSeoLink = getSeoAreaLink(seed.language, seed.intent, seed.areaSlug);
  const currentTobaccoLink = getSeoAreaLink(seed.language, "tobacco", seed.areaSlug);
  const currentAreaLink = getPublicAreaLink(seed.areaSlug, areaLinkLabels);

  if (seed.areaSlug === "bijlmer") {
    return [
      currentSeoLink,
      currentTobaccoLink,
      { href: "/amsterdam/zuidoost", label: areaLinkLabels.zuidoost },
      generalLink,
      generalTobaccoLink,
      centralStationLink
    ].filter(Boolean) as SeoRelatedLink[];
  }

  if (seed.areaSlug === "noord") {
    return [
      currentSeoLink,
      currentTobaccoLink,
      { href: "/amsterdam/noord", label: areaLinkLabels.noord },
      generalLink,
      generalTobaccoLink,
      centralStationLink,
      getSeoAreaLink(seed.language, seed.intent, "bijlmer")
    ].filter(Boolean) as SeoRelatedLink[];
  }

  if (seed.areaSlug === "central-station") {
    return [
      currentSeoLink,
      { href: "/amsterdam/near-central-station", label: areaLinkLabels["central-station"] },
      { href: "/amsterdam/centrum", label: areaLinkLabels.centrum },
      generalLink,
      { href: "/amsterdam/de-wallen", label: areaLinkLabels["de-wallen"] },
      generalTobaccoLink
    ].filter(Boolean) as SeoRelatedLink[];
  }

  return [
    currentSeoLink,
    currentTobaccoLink,
    currentAreaLink,
    generalLink,
    generalTobaccoLink,
    centralStationLink,
    getSeoAreaLink(seed.language, seed.intent, "bijlmer")
  ].filter(Boolean) as SeoRelatedLink[];
}

function getGeneralAmsterdamLink(language: SeoLanguage): SeoRelatedLink {
  if (language === "nl") {
    return { href: "/amsterdam/sigaretten-kopen", label: "Sigaretten kopen Amsterdam" };
  }

  if (language === "de") {
    return { href: "/de/amsterdam/zigaretten-kaufen", label: "Zigaretten kaufen Amsterdam" };
  }

  if (language === "fr") {
    return { href: "/fr/amsterdam/acheter-cigarettes", label: "Acheter cigarettes Amsterdam" };
  }

  return { href: "/amsterdam/where-to-buy-cigarettes", label: "Where to buy cigarettes Amsterdam" };
}

function getTobaccoOverviewLink(language: SeoLanguage): SeoRelatedLink {
  if (language === "de") {
    return { href: "/de/amsterdam/tabakladen-amsterdam", label: "Tabakladen Amsterdam" };
  }

  if (language === "fr") {
    return { href: "/fr/amsterdam/bureau-de-tabac-amsterdam", label: "Bureau de tabac Amsterdam" };
  }

  return { href: "/amsterdam/tobacco-shops", label: language === "nl" ? "Tabakswinkels Amsterdam" : "Tobacco shops Amsterdam" };
}

function getSeoAreaLink(language: SeoLanguage, intent: SeoIntent, areaSlug: SeoAreaSlug): SeoRelatedLink | null {
  const slugByLanguage: Record<SeoLanguage, Partial<Record<SeoAreaSlug, string>>> = {
    nl: {
      amsterdam: "",
      centrum: "centrum",
      "de-pijp": "de-pijp",
      jordaan: "jordaan",
      "de-wallen": "de-wallen",
      west: "west",
      "nieuw-west": "nieuw-west",
      oost: "oost",
      noord: "noord",
      zuid: "zuid",
      zuidoost: "zuidoost",
      bijlmer: "bijlmer",
      diemen: "diemen",
      "central-station": "amsterdam-centraal"
    },
    en: {
      amsterdam: "",
      centrum: "centrum",
      "de-pijp": "de-pijp",
      jordaan: "jordaan",
      "de-wallen": "de-wallen",
      west: "west",
      "nieuw-west": "nieuw-west",
      oost: "oost",
      noord: "north-amsterdam",
      zuid: "zuid",
      zuidoost: "zuidoost",
      bijlmer: "bijlmer",
      diemen: "diemen",
      "central-station": "central-station"
    },
    de: {
      amsterdam: "",
      centrum: "zentrum",
      "de-pijp": "de-pijp",
      jordaan: "jordaan",
      "de-wallen": "de-wallen",
      west: "west",
      "nieuw-west": "neu-west",
      oost: "ost",
      noord: "amsterdam-nord",
      zuid: "sued",
      zuidoost: "suedost",
      bijlmer: "bijlmer",
      diemen: "diemen",
      "central-station": "amsterdam-centraal"
    },
    fr: {
      amsterdam: "",
      centrum: "centre",
      "de-pijp": "de-pijp",
      jordaan: "jordaan",
      "de-wallen": "de-wallen",
      west: "ouest",
      "nieuw-west": "nieuw-west",
      oost: "est",
      noord: "amsterdam-nord",
      zuid: "sud",
      zuidoost: "sud-est",
      bijlmer: "bijlmer",
      diemen: "diemen",
      "central-station": "gare-centrale"
    }
  };
  const slug = slugByLanguage[language][areaSlug];

  if (slug === undefined) {
    return null;
  }

  if (language === "nl") {
    return {
      href: slug ? `/amsterdam/sigaretten-kopen-${slug}` : "/amsterdam/sigaretten-kopen",
      label: slug ? `Sigaretten kopen ${getAreaLinkLabels(language)[areaSlug]}` : "Sigaretten kopen Amsterdam"
    };
  }

  if (language === "de") {
    const usesTobaccoPath = intent === "tobacco" && (areaSlug === "amsterdam" || areaSlug === "noord" || areaSlug === "bijlmer");

    return {
      href: usesTobaccoPath
        ? `/de/amsterdam/tabakladen-${slug || "amsterdam"}`
        : slug
          ? `/de/amsterdam/zigaretten-kaufen-${slug}`
          : "/de/amsterdam/zigaretten-kaufen",
      label: usesTobaccoPath
        ? `Tabakladen ${getAreaLinkLabels(language)[areaSlug]}`
        : `Zigaretten kaufen ${getAreaLinkLabels(language)[areaSlug]}`
    };
  }

  if (language === "fr") {
    const usesTobaccoPath = intent === "tobacco" && (areaSlug === "amsterdam" || areaSlug === "noord" || areaSlug === "bijlmer");

    return {
      href: usesTobaccoPath
        ? `/fr/amsterdam/bureau-de-tabac-${slug || "amsterdam"}`
        : slug
          ? `/fr/amsterdam/acheter-cigarettes-${slug}`
          : "/fr/amsterdam/acheter-cigarettes",
      label: usesTobaccoPath
        ? `Bureau de tabac ${getAreaLinkLabels(language)[areaSlug]}`
        : `Acheter cigarettes ${getAreaLinkLabels(language)[areaSlug]}`
    };
  }

  if (intent === "tobacco" && (areaSlug === "amsterdam" || areaSlug === "noord" || areaSlug === "bijlmer" || areaSlug === "central-station")) {
    return {
      href: slug ? `/amsterdam/tobacco-shops-${slug}` : "/amsterdam/tobacco-shops",
      label: slug ? `Tobacco shops ${getAreaLinkLabels(language)[areaSlug]}` : "Tobacco shops Amsterdam"
    };
  }

  return {
    href: slug ? `/amsterdam/where-to-buy-cigarettes-${slug}` : "/amsterdam/where-to-buy-cigarettes",
    label: slug ? `Where to buy cigarettes ${getAreaLinkLabels(language)[areaSlug]}` : "Where to buy cigarettes Amsterdam"
  };
}

function getPublicAreaLink(areaSlug: SeoAreaSlug, labels: Record<SeoAreaSlug, string>): SeoRelatedLink | null {
  const hrefs: Partial<Record<SeoAreaSlug, string>> = {
    centrum: "/amsterdam/centrum",
    "de-pijp": "/amsterdam/de-pijp",
    jordaan: "/amsterdam/jordaan",
    "de-wallen": "/amsterdam/de-wallen",
    west: "/amsterdam/west",
    "nieuw-west": "/amsterdam/nieuw-west",
    oost: "/amsterdam/oost",
    noord: "/amsterdam/noord",
    zuid: "/amsterdam/zuid",
    zuidoost: "/amsterdam/zuidoost",
    diemen: "/amsterdam/diemen",
    "central-station": "/amsterdam/near-central-station"
  };
  const href = hrefs[areaSlug];

  return href ? { href, label: labels[areaSlug] } : null;
}

function getAreaLinkLabels(language: SeoLanguage): Record<SeoAreaSlug, string> {
  if (language === "de") {
    return {
      amsterdam: "Amsterdam",
      centrum: "Amsterdam Zentrum",
      "de-pijp": "De Pijp",
      jordaan: "Jordaan",
      "de-wallen": "De Wallen",
      west: "Amsterdam West",
      "nieuw-west": "Amsterdam Neu-West",
      oost: "Amsterdam Ost",
      noord: "Amsterdam Nord",
      zuid: "Amsterdam Süd",
      zuidoost: "Amsterdam Südost",
      bijlmer: "Bijlmer",
      diemen: "Diemen",
      "central-station": "Amsterdam Centraal"
    };
  }

  if (language === "fr") {
    return {
      amsterdam: "Amsterdam",
      centrum: "Amsterdam Centre",
      "de-pijp": "De Pijp",
      jordaan: "Jordaan",
      "de-wallen": "De Wallen",
      west: "Amsterdam Ouest",
      "nieuw-west": "Amsterdam Nieuw-West",
      oost: "Amsterdam Est",
      noord: "Amsterdam Nord",
      zuid: "Amsterdam Sud",
      zuidoost: "Amsterdam Sud-Est",
      bijlmer: "Bijlmer",
      diemen: "Diemen",
      "central-station": "Gare centrale"
    };
  }

  if (language === "nl") {
    return {
      amsterdam: "Amsterdam",
      centrum: "Amsterdam Centrum",
      "de-pijp": "De Pijp",
      jordaan: "Jordaan",
      "de-wallen": "De Wallen",
      west: "Amsterdam West",
      "nieuw-west": "Amsterdam Nieuw-West",
      oost: "Amsterdam Oost",
      noord: "Amsterdam Noord",
      zuid: "Amsterdam Zuid",
      zuidoost: "Amsterdam Zuidoost",
      bijlmer: "Bijlmer",
      diemen: "Diemen",
      "central-station": "Amsterdam Centraal"
    };
  }

  return {
    amsterdam: "Amsterdam",
    centrum: "Amsterdam Centrum",
    "de-pijp": "De Pijp",
    jordaan: "Jordaan",
    "de-wallen": "De Wallen",
    west: "Amsterdam West",
    "nieuw-west": "Amsterdam Nieuw-West",
    oost: "Amsterdam Oost",
    noord: "North Amsterdam",
    zuid: "Amsterdam Zuid",
    zuidoost: "Amsterdam Zuidoost",
    bijlmer: "Bijlmer",
    diemen: "Diemen",
    "central-station": "Amsterdam Central Station"
  };
}

function uniqueRelatedLinks(links: SeoRelatedLink[]) {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  });
}

function getSeoHreflangLinks(page: SeoLandingPageDefinition) {
  const links: Record<string, string> = {};
  const relatedPages = seoLandingPages.filter((item) => item.translationKey === page.translationKey);

  relatedPages.forEach((item) => {
    if (!links[item.language]) {
      links[item.language] = item.href;
    }
  });

  const defaultPage = relatedPages.find((item) => item.language === "en") ?? relatedPages[0];

  if (defaultPage) {
    links["x-default"] = defaultPage.href;
  }

  return links;
}

const uiLabels = {
  nl: {
    htmlLang: "nl",
    eyebrow: "Praktische locatie-informatie in Amsterdam",
    adultNotice: "Deze website is bedoeld voor volwassenen van 18+.",
    ctaLabel: "Bekijk alle locaties",
    fullSearchLabel: "Bekijk alle locaties",
    practicalNoteHeading: "Praktische opmerking",
    aboutHeading: "Over deze pagina",
    listingsHeading: "Vermelde locaties",
    listingsIntro: "Er wordt een beperkte selectie gepubliceerde vermeldingen getoond. Gebruik de zoekpagina om alle locaties te bekijken.",
    mapHeading: "Kaart met vermelde locaties",
    mapIntro: "Kaartmarkeringen zijn bij benadering en alleen bedoeld als praktische locatiehulp.",
    relatedHeading: "Gerelateerde pagina’s",
    relatedIntro: "Een korte selectie met praktische gerelateerde pagina’s.",
    faqTitle: "Veelgestelde vragen",
    faqIntro: "Antwoorden zijn neutraal en praktisch. Controleer belangrijke gegevens altijd voordat je vertrekt.",
    noListingsHeading: "Geen gepubliceerde vermeldingen beschikbaar",
    noListingsText: "Gepubliceerde locatie-informatie verschijnt hier wanneer records beschikbaar zijn.",
    context: (area: string) =>
      `Gebruik deze pagina als neutrale gids voor praktische locatie-informatie in ${area}. Vermeldingen kunnen adressen, openingstijden, contactgegevens, toegankelijkheidsinformatie, route-links en kaartinformatie bevatten waar beschikbaar.`,
    practicalPoints: [
      "Locaties, openingstijden en contactgegevens kunnen wijzigen door feestdagen, tijdelijke sluitingen of lokale updates.",
      "TobaccoNearby verkoopt geen tabaksproducten, verwerkt geen bestellingen en toont geen verkoopgerichte informatie.",
      "Gebruik buurt-, straat-, postcode- en gebiedspagina’s om praktische locatie-informatie te verfijnen."
    ],
    disclaimer:
      "Locatiegegevens kunnen wijzigen. Controleer openingstijden, toegankelijkheidsinformatie, contactgegevens en beschikbaarheid voordat je vertrekt."
  },
  en: {
    htmlLang: "en",
    eyebrow: "Amsterdam location information",
    adultNotice: "This website is intended for adults aged 18+.",
    ctaLabel: "View all locations",
    fullSearchLabel: "View all locations",
    practicalNoteHeading: "Practical note",
    aboutHeading: "About this page",
    listingsHeading: "Listed locations",
    listingsIntro: "Showing a limited set of published listings. Use the full search page to browse all Amsterdam listings.",
    mapHeading: "Map of listed locations",
    mapIntro: "Map markers are approximate and provided for practical location reference only.",
    relatedHeading: "Related pages",
    relatedIntro: "A short set of related pages with practical location information.",
    faqTitle: "FAQ",
    faqIntro: "Answers are neutral and practical. Shop details may change, so verify important information before visiting.",
    noListingsHeading: "No published listings available",
    noListingsText: "Published Amsterdam location information will appear here when records are available.",
    context: (area: string) =>
      `Use this page as a neutral guide to practical location information in ${area}. Listings may include addresses, opening hours, contact details, accessibility information, directions and map information where available.`,
    practicalPoints: [
      "Locations, opening hours and contact details can change because of holidays, temporary closures or local updates.",
      "TobaccoNearby does not sell tobacco products, process orders or show sales-focused information.",
      "Use area, street, postal-code and neighborhood pages to narrow practical Amsterdam location information."
    ],
    disclaimer:
      "Shop data may change. Please verify opening hours, accessibility details, contact information and product availability before visiting."
  },
  de: {
    htmlLang: "de",
    eyebrow: "Praktische Standortinformationen in Amsterdam",
    adultNotice: "Diese Website ist für Erwachsene ab 18 Jahren bestimmt.",
    ctaLabel: "Alle Standorte anzeigen",
    fullSearchLabel: "Alle Standorte anzeigen",
    practicalNoteHeading: "Praktischer Hinweis",
    aboutHeading: "Über diese Seite",
    listingsHeading: "Gelistete Standorte",
    listingsIntro: "Es wird eine begrenzte Auswahl veröffentlichter Einträge angezeigt. Nutzen Sie die Suche, um alle Standorte anzuzeigen.",
    mapHeading: "Karte der gelisteten Standorte",
    mapIntro: "Kartenmarkierungen sind ungefähr und dienen nur als praktische Orientierung.",
    relatedHeading: "Verwandte Seiten",
    relatedIntro: "Eine kurze Auswahl verwandter Seiten mit praktischen Standortinformationen.",
    faqTitle: "FAQ",
    faqIntro: "Die Antworten sind neutral und praktisch. Bitte prüfen Sie wichtige Details vor einem Besuch.",
    noListingsHeading: "Keine veröffentlichten Einträge verfügbar",
    noListingsText: "Veröffentlichte Standortinformationen erscheinen hier, sobald Datensätze verfügbar sind.",
    context: (area: string) =>
      `Nutzen Sie diese Seite als neutralen Leitfaden für praktische Standortinformationen in ${area}. Einträge können Adressen, Öffnungszeiten, Kontaktdaten, Hinweise zur Barrierefreiheit, Wegbeschreibungen und Karteninformationen enthalten.`,
    practicalPoints: [
      "Standorte, Öffnungszeiten und Kontaktdaten können sich durch Feiertage, vorübergehende Schließungen oder lokale Änderungen ändern.",
      "TobaccoNearby verkauft keine Tabakprodukte, nimmt keine Bestellungen an und zeigt keine verkaufsorientierten Informationen.",
      "Nutzen Sie Gebiets-, Straßen-, Postleitzahl- und Stadtteilseiten, um praktische Standortinformationen einzugrenzen."
    ],
    disclaimer:
      "Standortdaten können sich ändern. Bitte prüfen Sie Öffnungszeiten, Barrierefreiheit, Kontaktdaten und Verfügbarkeit vor dem Besuch."
  },
  fr: {
    htmlLang: "fr",
    eyebrow: "Informations pratiques à Amsterdam",
    adultNotice: "Ce site est destiné aux adultes de 18 ans et plus.",
    ctaLabel: "Voir tous les lieux",
    fullSearchLabel: "Voir tous les lieux",
    practicalNoteHeading: "Note pratique",
    aboutHeading: "À propos de cette page",
    listingsHeading: "Lieux listés",
    listingsIntro: "Une sélection limitée de fiches publiées est affichée. Utilisez la recherche pour voir tous les lieux.",
    mapHeading: "Carte des lieux listés",
    mapIntro: "Les marqueurs de carte sont approximatifs et fournis comme aide pratique à la localisation.",
    relatedHeading: "Pages liées",
    relatedIntro: "Une courte sélection de pages liées avec des informations pratiques de localisation.",
    faqTitle: "Questions fréquentes",
    faqIntro: "Les réponses sont neutres et pratiques. Vérifiez les informations importantes avant de vous déplacer.",
    noListingsHeading: "Aucune fiche publiée disponible",
    noListingsText: "Les informations publiées apparaîtront ici lorsque des données seront disponibles.",
    context: (area: string) =>
      `Utilisez cette page comme guide neutre d’informations pratiques à ${area}. Les fiches peuvent inclure des adresses, horaires, coordonnées, informations d’accessibilité, itinéraires et données cartographiques lorsque disponibles.`,
    practicalPoints: [
      "Les lieux, horaires et coordonnées peuvent changer en raison des jours fériés, de fermetures temporaires ou de mises à jour locales.",
      "TobaccoNearby ne vend pas de produits du tabac, ne traite pas de commandes et ne présente pas d’informations commerciales.",
      "Utilisez les pages par quartier, rue, code postal ou zone pour affiner les informations pratiques."
    ],
    disclaimer:
      "Les données peuvent changer. Veuillez vérifier les horaires, l’accessibilité, les coordonnées et la disponibilité avant de vous déplacer."
  }
} satisfies Record<
  SeoLanguage,
  {
    htmlLang: string;
    eyebrow: string;
    adultNotice: string;
    ctaLabel: string;
    fullSearchLabel: string;
    practicalNoteHeading: string;
    aboutHeading: string;
    listingsHeading: string;
    listingsIntro: string;
    mapHeading: string;
    mapIntro: string;
    relatedHeading: string;
    relatedIntro: string;
    faqTitle: string;
    faqIntro: string;
    noListingsHeading: string;
    noListingsText: string;
    context: (area: string) => string;
    practicalPoints: string[];
    disclaimer: string;
  }
>;

export const seoLandingPages: SeoLandingPageDefinition[] = seoRouteSeeds.map(createSeoLandingPage);
export const primarySeoLandingPages = seoLandingPages.filter((page) => page.isPrimary);
