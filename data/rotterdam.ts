export type RotterdamAreaSlug = "centrum" | "delfshaven" | "kralingen" | "zuid";

export type RotterdamFaqItem = {
  question: string;
  answer: string;
};

export type RotterdamPageContent = {
  href: string;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  contextHeading: string;
  areaContext: string;
  practicalInfo: string[];
  listingHeading: string;
  listingIntro: string;
  faqs: RotterdamFaqItem[];
};

export type RotterdamAreaDefinition = RotterdamPageContent & {
  slug: RotterdamAreaSlug;
  label: string;
  areaSlugAliases: string[];
  matchTerms: string[];
  postalCodePrefixes: string[];
  minimumListings: number;
  relatedAreaSlugs: RotterdamAreaSlug[];
};

export const rotterdamCityPage: RotterdamPageContent = {
  href: "/rotterdam",
  breadcrumbLabel: "Rotterdam",
  eyebrow: "Rotterdam location directory",
  title: "Tobacco Shops in Rotterdam | Map, Opening Hours & Directions",
  description:
    "View published tobacco shop, kiosk and gas station listings in Rotterdam with addresses, a map, opening hours where confirmed, and directions. Adults 18+ only.",
  h1: "Tobacco Shops in Rotterdam",
  intro:
    "Use this Rotterdam directory to compare published locations by address, postal code, place type and distance. Listings may include dedicated tobacco shops, kiosks, convenience stores and gas stations, but a listing does not confirm current product availability. TobaccoNearby provides neutral location information for adults aged 18+ and does not sell tobacco products or promote smoking.",
  contextHeading: "Finding locations across Rotterdam",
  areaContext:
    "Rotterdam covers a wide area on both sides of the Nieuwe Maas. Searching by district, street or postal code can be more useful than scanning the full city list, especially for locations in Centrum, Delfshaven, Kralingen or Rotterdam Zuid. The search also understands common Dutch location terms such as tabakswinkel and sigarenwinkel when combined with Rotterdam.",
  practicalInfo: [
    "The map uses the published coordinates attached to each listing and fits the visible Rotterdam result set where possible.",
    "Without browser location access, distances use Rotterdam Centraal as the local reference point. Shared coordinates stay in the browser session.",
    "Opening hours are shown only when usable shop-hour information is available. Ambiguous 24-hour petrol-pump schedules are not treated as confirmed shop opening hours."
  ],
  listingHeading: "Published Rotterdam listings",
  listingIntro:
    "These listings are loaded from the published Supabase data. Check the individual detail page for the available address, opening-hours, contact and directions information.",
  faqs: [
    {
      question: "How can I search tobacco shop listings in Rotterdam?",
      answer:
        "Search by Rotterdam, a district name, street or postal code. You can also use the city filter to keep results within Rotterdam."
    },
    {
      question: "Can I search for a tabakswinkel or sigarenwinkel in Rotterdam?",
      answer:
        "Yes. The search recognizes common Dutch location terms combined with Rotterdam, while results continue to use the published place-type classification for each listing."
    },
    {
      question: "Which Rotterdam areas have dedicated pages?",
      answer:
        "Area pages are available only where the published dataset contains enough matching listings for useful local information. Current eligible areas are linked on this page."
    },
    {
      question: "What distance is shown without location access?",
      answer:
        "Rotterdam listings use Rotterdam Centraal as the fallback reference point. If you allow location access, distance sorting uses your current browser location instead."
    },
    {
      question: "Are gas stations always open 24 hours?",
      answer:
        "Fuel pumps and physical shops may have different hours. Ambiguous all-day pump schedules are not presented as confirmed shop opening hours. Verify details before visiting."
    },
    {
      question: "Does a listed gas station necessarily sell cigarettes?",
      answer:
        "No. Place type and location information do not confirm current products or availability. Contact the location directly when that information matters."
    },
    {
      question: "Does TobaccoNearby sell tobacco products?",
      answer:
        "No. TobaccoNearby is a neutral location directory for adults aged 18+ and does not sell products, process orders or promote smoking."
    }
  ]
};

export const rotterdamAreaDefinitions: RotterdamAreaDefinition[] = [
  {
    slug: "centrum",
    label: "Rotterdam Centrum",
    href: "/rotterdam/centrum",
    breadcrumbLabel: "Centrum",
    eyebrow: "Rotterdam area directory",
    title: "Tobacco Shops in Rotterdam Centrum | Map & Directions",
    description:
      "View published tobacco shop and related location listings in Rotterdam Centrum with addresses, opening hours where available, a map and directions. Adults 18+ only.",
    h1: "Tobacco Shops in Rotterdam Centrum",
    intro:
      "This page groups published Rotterdam Centrum listings using the area and postal-code information in the current dataset. The visible records include central addresses around Beursplein, Korte Lijnbaan, Oude Binnenweg, Pannekoekstraat and Mariniersweg. Information is practical and neutral; verify opening hours and availability before visiting.",
    contextHeading: "Rotterdam Centrum listing scope",
    areaContext:
      "The page uses explicit area labels where available and a limited 3011-3012 postal-code fallback. It does not treat every address with a general Rotterdam neighborhood label as a Centrum location.",
    practicalInfo: [
      "Use the full street address and postal code when comparing central listings.",
      "Rotterdam Centraal is the fallback city reference point when browser location is not shared.",
      "Opening hours and contact details can change and should be checked before travelling."
    ],
    listingHeading: "Published listings in Rotterdam Centrum",
    listingIntro:
      "Only published Rotterdam records that match the Centrum area rules are included below.",
    faqs: [
      {
        question: "How are Rotterdam Centrum listings selected?",
        answer:
          "The directory uses explicit area data first and a narrow postal-code fallback for published Rotterdam records when area data is missing."
      },
      {
        question: "Can I search by a central Rotterdam street?",
        answer:
          "Yes. The main search supports shop names, streets, full addresses and postal codes."
      },
      {
        question: "Are opening hours guaranteed?",
        answer:
          "No. Opening hours can change, and unclear hours are shown as unavailable. Verify details before visiting."
      },
      {
        question: "Can I get directions to a listed location?",
        answer:
          "Where address information is available, the Directions link opens an address-based route in Google Maps."
      }
    ],
    areaSlugAliases: ["centrum", "rotterdam-centrum", "rotterdam centrum"],
    matchTerms: ["Rotterdam Centrum", "Centrum Rotterdam"],
    postalCodePrefixes: ["3011", "3012"],
    minimumListings: 3,
    relatedAreaSlugs: ["delfshaven", "kralingen", "zuid"]
  },
  {
    slug: "delfshaven",
    label: "Delfshaven",
    href: "/rotterdam/delfshaven",
    breadcrumbLabel: "Delfshaven",
    eyebrow: "Rotterdam area directory",
    title: "Tobacco Shops in Delfshaven, Rotterdam | Map & Directions",
    description:
      "Find published location listings in Delfshaven, Rotterdam with addresses, opening hours where available, a map and directions. Adults 18+ only.",
    h1: "Tobacco Shops in Delfshaven, Rotterdam",
    intro:
      "This page presents published listings matched to Delfshaven using the current address and postal-code data. The dataset includes locations on streets such as Nieuwe Binnenweg, Vierambachtsstraat, Schiedamseweg and Grote Visserijstraat. TobaccoNearby does not confirm product availability and does not recommend one listing over another.",
    contextHeading: "Delfshaven listing scope",
    areaContext:
      "Where a detailed neighborhood value is missing, this page uses a bounded 3021-3029 postal-code fallback for published Rotterdam records. This keeps the local list separate from unrelated city-wide results.",
    practicalInfo: [
      "Search by street or full postal code to narrow results within Delfshaven.",
      "Map markers use the coordinates stored with the published records.",
      "Verify opening hours, contact information and current availability before visiting."
    ],
    listingHeading: "Published listings in Delfshaven",
    listingIntro: "The list contains only published Rotterdam records matching the Delfshaven area rules.",
    faqs: [
      {
        question: "Can I search around Schiedamseweg or Nieuwe Binnenweg?",
        answer:
          "Yes. Enter the street name or a full address in search to narrow the published Rotterdam listings."
      },
      {
        question: "How are Delfshaven records matched?",
        answer:
          "Explicit area data is preferred. A limited postal-code fallback is used only for published Rotterdam records without detailed area data."
      },
      {
        question: "Does a listing confirm current products?",
        answer:
          "No. TobaccoNearby provides location information only and does not track current inventory."
      },
      {
        question: "Can I report an incorrect Delfshaven listing?",
        answer:
          "Yes. Open the listing detail page and use the correction option. Submitted changes are reviewed before publication."
      }
    ],
    areaSlugAliases: ["delfshaven", "rotterdam-delfshaven", "rotterdam delfshaven"],
    matchTerms: ["Delfshaven", "Rotterdam Delfshaven"],
    postalCodePrefixes: ["3021", "3022", "3023", "3024", "3025", "3026", "3027", "3028", "3029"],
    minimumListings: 3,
    relatedAreaSlugs: ["centrum", "zuid", "kralingen"]
  },
  {
    slug: "kralingen",
    label: "Kralingen",
    href: "/rotterdam/kralingen",
    breadcrumbLabel: "Kralingen",
    eyebrow: "Rotterdam area directory",
    title: "Tobacco Shops in Kralingen, Rotterdam | Map & Directions",
    description:
      "View published shop and related location listings in Kralingen, Rotterdam with addresses, opening hours where available, a map and directions. Adults 18+ only.",
    h1: "Tobacco Shops in Kralingen, Rotterdam",
    intro:
      "This page groups published Kralingen listings from the current Rotterdam dataset. Matching records include addresses around Oudedijk, Vlietlaan, Lusthofstraat, Oostzeedijk and Maasboulevard. The page provides practical location information only and does not confirm stock or recommend products.",
    contextHeading: "Kralingen listing scope",
    areaContext:
      "The local filter uses explicit area data where present and a bounded 3061-3063 postal-code fallback for published Rotterdam records whose neighborhood field is not detailed enough.",
    practicalInfo: [
      "Use a street name or postal code when comparing locations within Kralingen.",
      "The map remains optional and the same listings are available as accessible cards.",
      "Opening hours should be verified before visiting, especially when the source data is incomplete."
    ],
    listingHeading: "Published listings in Kralingen",
    listingIntro: "Only published Rotterdam records matching the Kralingen area rules are shown.",
    faqs: [
      {
        question: "Can I search for a listing on Oudedijk or Lusthofstraat?",
        answer:
          "Yes. Search accepts partial street names, addresses and postal codes."
      },
      {
        question: "Why does the page use postal codes?",
        answer:
          "Some published records have only a general Rotterdam neighborhood value. A narrow postal-code fallback provides a more useful local grouping without changing the source data."
      },
      {
        question: "Are map locations exact?",
        answer:
          "Markers use the published coordinates but are provided for practical orientation. Verify the full address before travelling."
      },
      {
        question: "Does TobaccoNearby recommend a Kralingen location?",
        answer:
          "No. The directory is neutral and does not rank or recommend products or locations."
      }
    ],
    areaSlugAliases: ["kralingen", "rotterdam-kralingen", "rotterdam kralingen"],
    matchTerms: ["Kralingen", "Rotterdam Kralingen"],
    postalCodePrefixes: ["3061", "3062", "3063"],
    minimumListings: 3,
    relatedAreaSlugs: ["centrum", "zuid", "delfshaven"]
  },
  {
    slug: "zuid",
    label: "Rotterdam Zuid",
    href: "/rotterdam/zuid",
    breadcrumbLabel: "Zuid",
    eyebrow: "Rotterdam area directory",
    title: "Tobacco Shops in Rotterdam Zuid | Map & Directions",
    description:
      "View published tobacco shop, kiosk and gas station listings in Rotterdam Zuid with addresses, opening hours where confirmed, a map and directions. Adults 18+ only.",
    h1: "Tobacco Shops in Rotterdam Zuid",
    intro:
      "This page provides a practical view of published listings in Rotterdam Zuid. The current data includes addresses in areas such as Katendrecht, Feijenoord, Vreewijk, Lombardijen, IJsselmonde and Charlois. A listing shows location data only and does not guarantee products or current availability.",
    contextHeading: "Rotterdam Zuid listing scope",
    areaContext:
      "The page prefers explicit Zuid area values and otherwise uses published Rotterdam records in the 307-308 postal-code ranges. This broad district page is intentionally the only Zuid grouping until more detailed neighborhood data supports narrower pages.",
    practicalInfo: [
      "Use a neighborhood, street or complete postal code to narrow the broader Zuid result set.",
      "Gas-station pump hours are not assumed to be physical shop hours when the source data is ambiguous.",
      "Directions use the published address, while browser location is optional for distance sorting."
    ],
    listingHeading: "Published listings in Rotterdam Zuid",
    listingIntro: "The list contains published Rotterdam records matched to the Zuid area rules.",
    faqs: [
      {
        question: "Which listings are included in Rotterdam Zuid?",
        answer:
          "The page uses explicit Zuid area data first and a broad 307-308 postal-code fallback for published Rotterdam records."
      },
      {
        question: "Can I search a specific neighborhood in Zuid?",
        answer:
          "Yes. Use the main search with a neighborhood, street or full postal code to refine the city data."
      },
      {
        question: "Do gas-station hours describe the shop?",
        answer:
          "Not necessarily. Fuel pumps and shops can have different hours, so ambiguous all-day pump schedules are shown as unavailable for the shop."
      },
      {
        question: "Can I sort Rotterdam Zuid listings by distance?",
        answer:
          "Yes. Location access is optional and, when allowed, is used only in the browser session for distance sorting."
      }
    ],
    areaSlugAliases: ["zuid", "rotterdam-zuid", "rotterdam zuid"],
    matchTerms: ["Rotterdam Zuid", "Zuid Rotterdam"],
    postalCodePrefixes: ["307", "308"],
    minimumListings: 3,
    relatedAreaSlugs: ["centrum", "delfshaven", "kralingen"]
  }
];

export function getRotterdamAreaDefinition(areaSlug?: string) {
  const normalized = normalizeRotterdamAreaText(areaSlug);

  return rotterdamAreaDefinitions.find(
    (area) =>
      normalizeRotterdamAreaText(area.slug) === normalized ||
      normalizeRotterdamAreaText(area.label) === normalized ||
      area.areaSlugAliases.some((alias) => normalizeRotterdamAreaText(alias) === normalized)
  );
}

export function getRotterdamAreaSearchTargets(value: string) {
  const normalizedValue = normalizeRotterdamAreaText(value);

  return rotterdamAreaDefinitions.filter((area) =>
    [area.slug, area.label, ...area.areaSlugAliases, ...area.matchTerms]
      .map(normalizeRotterdamAreaText)
      .some((alias) => alias && (normalizedValue === alias || normalizedValue.includes(alias)))
  );
}

export function normalizeRotterdamAreaText(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}
