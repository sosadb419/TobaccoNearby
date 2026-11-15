import assert from "node:assert/strict";
import test from "node:test";
import { searchShopList } from "@/lib/shop-data";
import type { Shop } from "@/data/shops";

const shops: Shop[] = [
  createShop({
    name: "Shell Muntbergweg",
    slug: "shell-muntbergweg",
    address: "Muntbergweg 20",
    postalCode: "1101 EB",
    neighborhood: "Amstel III",
    city: "Amsterdam",
    area_slug: "zuidoost"
  }),
  createShop({
    name: "Esso Marnixstraat",
    slug: "esso-marnixstraat",
    address: "Marnixstraat 250",
    postalCode: "1016 TL",
    neighborhood: "Jordaan",
    city: "Amsterdam",
    area_slug: "jordaan"
  }),
  createShop({
    name: "Primera Parkwijk",
    slug: "primera-parkwijk",
    address: "Verlengde Houtrakgracht 341",
    postalCode: "3544 EB",
    neighborhood: "Leidsche Rijn",
    city: "Utrecht",
    area_slug: "leidsche-rijn"
  }),
  createShop({
    name: "Primera Overvecht",
    slug: "primera-overvecht",
    address: "Seinedreef 40",
    postalCode: "3562 CS",
    neighborhood: "Overvecht",
    city: "Utrecht",
    area_slug: "overvecht"
  }),
  createShop({
    name: "Café Primera",
    slug: "cafe-primera",
    address: "Voorstraat 10",
    postalCode: "3512 AM",
    neighborhood: "Utrecht Centrum",
    city: "Utrecht",
    area_slug: "centrum"
  }),
  createShop({
    name: "Prim",
    slug: "prim-exact",
    address: "Teststraat 1",
    postalCode: "1012 AA",
    neighborhood: "De Pijp",
    city: "Amsterdam",
    area_slug: "de-pijp"
  })
];

test("matches partial shop names and street names", () => {
  assert.deepEqual(slugsFor("munt"), ["shell-muntbergweg"]);
  assert.deepEqual(slugsFor("muntberg"), ["shell-muntbergweg"]);
  assert.deepEqual(slugsFor("marnix"), ["esso-marnixstraat"]);

  const primeraSlugs = slugsFor("prim");
  assert.equal(primeraSlugs[0], "prim-exact");
  assert.deepEqual(
    new Set(primeraSlugs),
    new Set(["prim-exact", "primera-parkwijk", "primera-overvecht", "cafe-primera"])
  );
});

test("matches partial neighborhood names", () => {
  assert.deepEqual(slugsFor("overv"), ["primera-overvecht"]);
  assert.deepEqual(slugsFor("leidsche"), ["primera-parkwijk"]);
});

test("normalizes case and accents", () => {
  assert.ok(slugsFor("CAFÉ").includes("cafe-primera"));
  assert.ok(slugsFor("cafe").includes("cafe-primera"));
});

test("supports compact partial postal-code searches", () => {
  assert.deepEqual(slugsFor("3544e"), ["primera-parkwijk"]);
  assert.deepEqual(slugsFor("1101"), ["shell-muntbergweg"]);
});

test("ranks exact matches above partial matches", () => {
  const results = searchShopList(shops, "prim");

  assert.equal(results[0]?.slug, "prim-exact");
});

test("does not expand very short queries into prefix matches", () => {
  assert.deepEqual(slugsFor("pr"), []);
  assert.deepEqual(slugsFor("mu"), []);
});

test("preserves supported-city and neighborhood searches", () => {
  assert.deepEqual(
    new Set(slugsFor("Utrecht")),
    new Set(["primera-parkwijk", "primera-overvecht", "cafe-primera"])
  );
  assert.deepEqual(slugsFor("De Pijp"), ["prim-exact"]);
  assert.ok(slugsFor("Bijlmer").includes("shell-muntbergweg"));
});

function slugsFor(query: string) {
  return searchShopList(shops, query).map((shop) => shop.slug);
}

function createShop(
  overrides: Partial<Shop> & Pick<Shop, "name" | "slug" | "address" | "postalCode" | "neighborhood" | "city">
): Shop {
  return {
    ...overrides,
    latitude: overrides.latitude ?? 52.09,
    longitude: overrides.longitude ?? 5.12,
    openingHours: overrides.openingHours ?? [],
    googleMapsLink: overrides.googleMapsLink ?? "https://www.google.com/maps",
    lastUpdated: overrides.lastUpdated ?? "2026-11-14",
    country: overrides.country ?? "Netherlands",
    status: overrides.status ?? "published",
    place_type: overrides.place_type ?? "tobacco_shop"
  };
}
