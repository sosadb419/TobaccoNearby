import type { Metadata } from "next";
import type { FAQItem } from "@/components/FAQSection";
import type { SeoAreaSlug } from "@/lib/seo-areas";

export type SeoLanguage = "nl" | "en" | "de" | "fr";
export type SeoIntent = "buy" | "where" | "tobacco";

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

const seoRouteSeeds: SeoRouteSeed[] = [
  {
    language: "nl",
    href: "/amsterdam/sigaretten-kopen",
    label: "Sigaretten kopen Amsterdam",
    areaSlug: "amsterdam",
    areaDisplayName: "Amsterdam",
    intent: "buy",
    translationKey: "buy-amsterdam",
    searchIntentKeywords: ["sigaretten kopen Amsterdam", "tabakswinkel Amsterdam", "tabakszaak Amsterdam"],
    seoTitle: "Sigaretten kopen in Amsterdam | Praktische locatie-informatie",
    metaDescription:
      "Zoek praktische informatie over locaties in Amsterdam waar volwassenen tabakswinkels kunnen vinden, inclusief adressen, openingstijden en route-informatie. Alleen voor volwassenen van 18+.",
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
    seoTitle: "Waar sigaretten kopen in Amsterdam? | TobaccoNearby",
    metaDescription:
      "Bekijk waar volwassenen in Amsterdam praktische informatie kunnen vinden over tabakswinkels, openingstijden, adressen en route-informatie. Alleen bedoeld voor 18+.",
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
          seoTitle: "Sigaretten kopen in Bijlmer | Praktische locatie-informatie",
          metaDescription:
            "Bekijk praktische locatie-informatie voor volwassenen van 18+ over tabakswinkels, kiosken en tankstations rond Bijlmer en Amsterdam Zuidoost, inclusief adressen, openingstijden en routes.",
          h1: "Sigaretten kopen in Bijlmer"
        }
      : {}),
    ...(slug === "north-amsterdam"
      ? {
          seoTitle: "Sigaretten kopen in North Amsterdam | TobaccoNearby",
          metaDescription:
            "Bekijk praktische locatie-informatie voor volwassenen van 18+ over tabakswinkels, kiosken en tankstations in North Amsterdam en Amsterdam Noord, inclusief adressen, openingstijden en routes.",
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
    seoTitle: "Buy Cigarettes in Amsterdam? Practical Location Information | TobaccoNearby",
    metaDescription:
      "Find neutral, practical location information about tobacco shops in Amsterdam, including addresses, opening hours and directions. Adults aged 18+ only.",
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
    seoTitle: "Where to Buy Cigarettes in Amsterdam | Practical Shop Information",
    metaDescription:
      "Find practical information about listed tobacco shops in Amsterdam, including addresses, opening hours, directions and contact details. Adults 18+ only.",
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
          seoTitle: "Where to Buy Cigarettes in North Amsterdam | TobaccoNearby",
          metaDescription:
            "Find neutral practical location information for adults aged 18+ about tobacco shops, kiosks and gas stations in North Amsterdam, including addresses, opening hours and directions.",
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
    seoTitle: "Tobacco Shops in Amsterdam | TobaccoNearby",
    metaDescription:
      "Search listed tobacco shops in Amsterdam with practical information such as addresses, opening hours, directions, place type and contact details. Adults 18+ only.",
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
          seoTitle: "Zigaretten kaufen in Amsterdam Nord | TobaccoNearby",
          metaDescription:
            "Finden Sie neutrale Standortinformationen zu Tabakgeschäften, Kiosken und Tankstellen in Amsterdam Nord, einschließlich Adressen, Öffnungszeiten und Wegbeschreibungen.",
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
          seoTitle: "Acheter des cigarettes à Amsterdam Nord | TobaccoNearby",
          metaDescription:
            "Trouvez des informations pratiques et neutres sur les bureaux de tabac, kiosques et stations-service à Amsterdam Nord, avec adresses, horaires et itinéraires.",
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
  const introCopy = getIntro(seed.language, seed.areaDisplayName);
  const faqItems = getFaqItems(seed.language, seed.areaDisplayName);

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
  if (seed.language === "nl") {
    return seed.intent === "where"
      ? `Waar sigaretten kopen in ${seed.areaDisplayName}? | TobaccoNearby`
      : `Sigaretten kopen in ${seed.areaDisplayName} | Praktische locatie-informatie`;
  }

  if (seed.language === "de") {
    return seed.intent === "tobacco"
      ? `Tabakladen in ${seed.areaDisplayName} | TobaccoNearby`
      : `Zigaretten kaufen in ${seed.areaDisplayName} | TobaccoNearby`;
  }

  if (seed.language === "fr") {
    if (seed.intent === "where") {
      return `Où acheter des cigarettes à ${seed.areaDisplayName} | TobaccoNearby`;
    }

    return seed.intent === "tobacco"
      ? `Bureaux de tabac à ${seed.areaDisplayName} | TobaccoNearby`
      : `Acheter des cigarettes à ${seed.areaDisplayName} | TobaccoNearby`;
  }

  return seed.intent === "tobacco"
    ? `Tobacco Shops in ${seed.areaDisplayName} | TobaccoNearby`
    : `Where to Buy Cigarettes in ${seed.areaDisplayName} | TobaccoNearby`;
}

function getMetaDescription(seed: SeoRouteSeed) {
  if (seed.language === "nl") {
    return `Bekijk praktische locatie-informatie voor volwassenen van 18+ over tabakswinkels, kiosken en tankstations in ${seed.areaDisplayName}, inclusief adressen, openingstijden en route-informatie.`;
  }

  if (seed.language === "de") {
    return `Finden Sie neutrale Standortinformationen zu Tabakgeschäften, Kiosken und Tankstellen in ${seed.areaDisplayName}, einschließlich Adressen, Öffnungszeiten und Wegbeschreibungen.`;
  }

  if (seed.language === "fr") {
    return `Trouvez des informations pratiques et neutres sur les bureaux de tabac, kiosques et stations-service à ${seed.areaDisplayName}, avec adresses, horaires et itinéraires.`;
  }

  return `Find neutral practical location information for adults aged 18+ about tobacco shops, kiosks and gas stations in ${seed.areaDisplayName}, including addresses, opening hours and directions.`;
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

function getIntro(language: SeoLanguage, areaDisplayName: string) {
  if (language === "nl") {
    return `Deze pagina biedt neutrale en praktische locatie-informatie voor volwassenen van 18+ die zoeken naar tabakswinkels, kiosken of tankstations in ${areaDisplayName}. TobaccoNearby verkoopt geen tabaksproducten en moedigt roken niet aan. Controleer altijd openingstijden, contactgegevens en beschikbaarheid voordat je een locatie bezoekt.`;
  }

  if (language === "de") {
    return `Diese Seite bietet neutrale und praktische Standortinformationen für Erwachsene ab 18 Jahren, die nach Tabakgeschäften, Kiosken oder Tankstellen in ${areaDisplayName} suchen. TobaccoNearby verkauft keine Tabakprodukte und fördert das Rauchen nicht. Bitte überprüfen Sie Öffnungszeiten und Details, bevor Sie einen Standort besuchen.`;
  }

  if (language === "fr") {
    return `Cette page fournit des informations pratiques et neutres pour les adultes de 18 ans et plus qui recherchent des bureaux de tabac, kiosques ou stations-service à ${areaDisplayName}. TobaccoNearby ne vend pas de produits du tabac et ne fait pas la promotion du tabagisme. Veuillez vérifier les horaires et les informations avant de vous déplacer.`;
  }

  return `This page provides neutral practical location information for adults aged 18+ looking for listed tobacco shops, kiosks or gas stations in ${areaDisplayName}. TobaccoNearby does not sell tobacco products, process orders or promote smoking. Please verify opening hours and details before visiting.`;
}

function getFaqItems(language: SeoLanguage, areaDisplayName: string): FAQItem[] {
  if (language === "nl") {
    return [
      {
        question: "Verkoopt TobaccoNearby sigaretten?",
        answer:
          "Nee. TobaccoNearby verkoopt geen tabaksproducten en verwerkt geen bestellingen. De website biedt alleen praktische locatie-informatie voor volwassenen van 18+."
      },
      {
        question: `Waar kan ik sigaretten kopen in ${areaDisplayName}?`,
        answer:
          "Volwassenen van 18+ kunnen praktische informatie bekijken over vermelde locaties, zoals adressen, openingstijden en route-informatie. Controleer gegevens altijd voordat je vertrekt."
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

  if (language === "de") {
    return [
      {
        question: "Verkauft TobaccoNearby Zigaretten?",
        answer:
          "Nein. TobaccoNearby verkauft keine Tabakprodukte und nimmt keine Bestellungen an. Die Website bietet nur praktische Standortinformationen für Erwachsene ab 18 Jahren."
      },
      {
        question: `Wo kann ich in ${areaDisplayName} Zigaretten kaufen?`,
        answer:
          "Erwachsene ab 18 Jahren können praktische Informationen zu gelisteten Standorten ansehen, darunter Adressen, Öffnungszeiten und Wegbeschreibungen."
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

  if (language === "fr") {
    return [
      {
        question: "TobaccoNearby vend-il des cigarettes ?",
        answer:
          "Non. TobaccoNearby ne vend pas de produits du tabac et ne traite pas de commandes. Le site fournit uniquement des informations pratiques pour les adultes de 18 ans et plus."
      },
      {
        question: `Où acheter des cigarettes à ${areaDisplayName} ?`,
        answer:
          "Les adultes de 18 ans et plus peuvent consulter des informations pratiques sur les lieux listés, comme les adresses, horaires et itinéraires."
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
      question: `Where can I buy cigarettes in ${areaDisplayName}?`,
      answer:
        "Adults aged 18+ can use TobaccoNearby to find practical information about listed locations, including addresses, opening hours and directions."
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
  const languageLinks: Record<SeoLanguage, SeoRelatedLink[]> = {
    nl: [
      { href: "/amsterdam/sigaretten-kopen", label: "Sigaretten kopen Amsterdam" },
      { href: "/amsterdam/waar-sigaretten-kopen", label: "Waar sigaretten kopen Amsterdam" },
      { href: "/amsterdam/sigaretten-kopen-bijlmer", label: "Sigaretten kopen Bijlmer" },
      { href: "/amsterdam/sigaretten-kopen-noord", label: "Sigaretten kopen Amsterdam Noord" },
      { href: "/amsterdam/sigaretten-kopen-north-amsterdam", label: "Sigaretten kopen North Amsterdam" },
      { href: "/amsterdam/sigaretten-kopen-amsterdam-centraal", label: "Sigaretten kopen Amsterdam Centraal" },
      { href: "/amsterdam/tobacco-shops", label: "Tabakswinkels Amsterdam" }
    ],
    en: [
      { href: "/amsterdam/where-to-buy-cigarettes", label: "Where to buy cigarettes Amsterdam" },
      { href: "/amsterdam/buy-cigarettes", label: "Buy cigarettes Amsterdam" },
      { href: "/amsterdam/where-to-buy-cigarettes-north-amsterdam", label: "Where to buy cigarettes North Amsterdam" },
      { href: "/amsterdam/where-to-buy-cigarettes-bijlmer", label: "Where to buy cigarettes Bijlmer" },
      { href: "/amsterdam/where-to-buy-cigarettes-central-station", label: "Cigarettes near Amsterdam Central Station" },
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
      { href: "/fr/amsterdam/acheter-cigarettes-gare-centrale", label: "Cigarettes près de la gare centrale" },
      { href: "/fr/amsterdam/bureau-de-tabac-amsterdam", label: "Bureau de tabac Amsterdam" }
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

  return [...languageLinks[seed.language], ...areaLinks].filter((link) => link.href !== seed.href);
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
    relatedIntro: "Bekijk ook andere pagina’s met praktische locatie-informatie over Amsterdamse gebieden en zoekvragen.",
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
    relatedIntro: "Browse related neutral location pages for Amsterdam areas and practical search variants.",
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
    relatedIntro: "Weitere neutrale Standortseiten für Amsterdamer Gebiete und Suchvarianten.",
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
    relatedHeading: "Pages associées",
    relatedIntro: "Consultez d’autres pages neutres avec des informations pratiques sur les quartiers et recherches à Amsterdam.",
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
