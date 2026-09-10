import type { AreaSlug } from "@/data/areas";
import type { Coordinates, Shop } from "@/data/shops";

export type CitySlug = "amsterdam" | "utrecht";

export type CityQuickSearch = {
  label: string;
  query: string;
  areaSlug?: AreaSlug;
  aliases?: string[];
};

export type CityDefinition = {
  slug: CitySlug;
  name: string;
  href: string;
  center: Coordinates;
  referencePoint: Coordinates;
  referenceLabel: string;
  aliases: string[];
  coverageAliases?: string[];
  referenceAliases: string[];
  quickSearches: CityQuickSearch[];
};

export const cityDefinitions: CityDefinition[] = [
  {
    slug: "amsterdam",
    name: "Amsterdam",
    href: "/amsterdam/tobacco-shops",
    center: {
      latitude: 52.3676,
      longitude: 4.9041
    },
    referencePoint: {
      latitude: 52.379128,
      longitude: 4.900272
    },
    referenceLabel: "Amsterdam Centraal",
    aliases: [
      "Amsterdam",
      "Amsterdam city",
      "Amsterdam NL"
    ],
    referenceAliases: [
      "Amsterdam Centraal",
      "Amsterdam Central",
      "Amsterdam Central Station",
      "Central Station",
      "Centraal Station",
      "Stationsplein Amsterdam",
      "Prins Hendrikkade",
      "Nieuwezijds Kolk",
      "Damrak",
      "Gare Centrale Amsterdam"
    ],
    quickSearches: [
      {
        label: "Amsterdam Centraal",
        query: "Amsterdam Centraal",
        areaSlug: "central-station",
        aliases: ["Amsterdam Central", "Amsterdam Central Station", "Central Station", "Centraal Station"]
      },
      { label: "Centrum", query: "Centrum", areaSlug: "centrum" },
      { label: "De Pijp", query: "De Pijp", areaSlug: "de-pijp" },
      { label: "Jordaan", query: "Jordaan", areaSlug: "jordaan" },
      { label: "Noord", query: "Noord", areaSlug: "noord" },
      { label: "Zuid", query: "Zuid", areaSlug: "zuid" },
      { label: "Oost", query: "Oost", areaSlug: "oost" },
      { label: "West", query: "West", areaSlug: "west" },
      { label: "Zuidoost", query: "Zuidoost", areaSlug: "zuidoost" }
    ]
  },
  {
    slug: "utrecht",
    name: "Utrecht",
    href: "/utrecht",
    center: {
      latitude: 52.0907,
      longitude: 5.1214
    },
    referencePoint: {
      latitude: 52.089444,
      longitude: 5.110278
    },
    referenceLabel: "Utrecht Centraal",
    aliases: [
      "Utrecht",
      "Utrecht city",
      "Utrecht NL"
    ],
    coverageAliases: ["De Meern", "Vleuten", "Maarssenbroek"],
    referenceAliases: [
      "Utrecht Centraal",
      "Utrecht Central",
      "Utrecht Central Station",
      "Station Utrecht Centraal",
      "Utrecht CS",
      "Stationsplein Utrecht",
      "Jaarbeursplein"
    ],
    quickSearches: [
      {
        label: "Utrecht Centraal",
        query: "Utrecht Centraal",
        aliases: ["Utrecht Central", "Utrecht Central Station", "Station Utrecht Centraal"]
      }
    ]
  }
];

export const citySlugSet = new Set(cityDefinitions.map((city) => city.slug));

export function getCityDefinition(citySlug?: string) {
  const normalized = normalizeCityText(citySlug);

  return cityDefinitions.find(
    (city) =>
      city.slug === normalized ||
      normalizeCityText(city.name) === normalized ||
      city.aliases.some((alias) => normalizeCityText(alias) === normalized)
  );
}

export function getCityDefinitionForShop(shop: Pick<Shop, "address" | "city" | "neighborhood" | "nearbyPublicTransport">) {
  const citySlug = getCitySlugFromShop(shop);

  return citySlug ? cityDefinitions.find((city) => city.slug === citySlug) ?? cityDefinitions[0] : cityDefinitions[0];
}

export function getCitySlugFromShop(
  shop: Pick<Shop, "address" | "city" | "neighborhood" | "nearbyPublicTransport">
): CitySlug | "" {
  const cityValue = normalizeCityText(shop.city);

  if (cityValue) {
    const directCity = cityDefinitions.find(
      (city) =>
        city.slug === cityValue ||
        normalizeCityText(city.name) === cityValue ||
        city.coverageAliases?.some((alias) => normalizeCityText(alias) === cityValue)
    );

    if (directCity) {
      return directCity.slug;
    }
  }

  const searchable = normalizeCityText([shop.city, shop.neighborhood, shop.address, shop.nearbyPublicTransport].join(" "));
  const matchedCity = cityDefinitions.find((city) =>
    [...city.aliases, ...(city.coverageAliases ?? [])].some((alias) => {
      const normalizedAlias = normalizeCityText(alias);

      return normalizedAlias.length >= 5 && searchable.includes(normalizedAlias);
    })
  );

  return matchedCity?.slug ?? "";
}

export function cityMatchesShop(
  shop: Pick<Shop, "address" | "city" | "neighborhood" | "nearbyPublicTransport">,
  citySlug: string
) {
  const city = getCityDefinition(citySlug);

  if (!city) {
    return false;
  }

  const shopCitySlug = getCitySlugFromShop(shop);

  if (shopCitySlug) {
    return shopCitySlug === city.slug;
  }

  const searchable = normalizeCityText([shop.city, shop.neighborhood, shop.address, shop.nearbyPublicTransport].join(" "));

  return [...city.aliases, ...(city.coverageAliases ?? [])].some((alias) => {
    const normalizedAlias = normalizeCityText(alias);

    return normalizedAlias.length >= 5 && searchable.includes(normalizedAlias);
  });
}

export function getSearchCityTargets(value: string) {
  const normalizedValue = normalizeCityText(value);

  if (!normalizedValue) {
    return [];
  }

  return cityDefinitions
    .filter((city) => {
      const aliases = [city.slug, city.name, ...city.aliases, ...(city.coverageAliases ?? [])].map(normalizeCityText);

      return aliases.some((alias) => alias && (normalizedValue === alias || normalizedValue.includes(alias)));
    })
    .map((city) => city.slug);
}

export function getExactCityTarget(value: string) {
  const normalizedValue = normalizeCityText(value);

  return cityDefinitions.find((city) => {
    const aliases = [city.slug, city.name, ...city.aliases, ...(city.coverageAliases ?? [])].map(normalizeCityText);

    return aliases.some((alias) => alias === normalizedValue);
  })?.slug;
}

export function getReferenceCityTargets(value: string) {
  const normalizedValue = normalizeCityText(value);

  if (!normalizedValue) {
    return [];
  }

  return cityDefinitions
    .filter((city) =>
      city.referenceAliases.some((alias) => {
        const normalizedAlias = normalizeCityText(alias);

        return normalizedAlias && (normalizedValue === normalizedAlias || normalizedValue.includes(normalizedAlias));
      })
    )
    .map((city) => city.slug);
}

export function getReferenceAreaTargets(value: string) {
  const normalizedValue = normalizeCityText(value);

  if (!normalizedValue) {
    return [];
  }

  return cityDefinitions.flatMap((city) =>
    city.quickSearches
      .filter((quickSearch) => quickSearch.areaSlug)
      .filter((quickSearch) => {
        const aliases = [quickSearch.label, quickSearch.query, ...(quickSearch.aliases ?? [])].map(normalizeCityText);

        return aliases.some((alias) => {
          const shouldMatchInsideQuery = alias.length >= 5;

          return normalizedValue === alias || (shouldMatchInsideQuery && normalizedValue.includes(alias));
        });
      })
      .map((quickSearch) => quickSearch.areaSlug as AreaSlug)
  );
}

export function getReferencePriorityTerms(value: string) {
  const normalizedValue = normalizeCityText(value);
  const matchingCity = cityDefinitions.find((city) =>
    city.referenceAliases.some((alias) => {
      const normalizedAlias = normalizeCityText(alias);

      return normalizedAlias && (normalizedValue === normalizedAlias || normalizedValue.includes(normalizedAlias));
    })
  );

  return matchingCity?.referenceAliases ?? [];
}

export function getCityReferencePointForShop(shop: Pick<Shop, "address" | "city" | "neighborhood" | "nearbyPublicTransport">) {
  return getCityDefinitionForShop(shop).referencePoint;
}

export function getCityReferenceLabelForShop(shop: Pick<Shop, "address" | "city" | "neighborhood" | "nearbyPublicTransport">) {
  return getCityDefinitionForShop(shop).referenceLabel;
}

export function getDominantCitySlugForShops(shops: Array<Pick<Shop, "address" | "city" | "neighborhood" | "nearbyPublicTransport">>) {
  const counts = new Map<CitySlug, number>();

  shops.forEach((shop) => {
    const slug = getCitySlugFromShop(shop);

    if (slug) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "amsterdam";
}

export function normalizeCityText(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}
