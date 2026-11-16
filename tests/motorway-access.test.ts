import assert from "node:assert/strict";
import test from "node:test";
import {
  filterMotorwayOnlyAccess,
  shouldExcludeMotorwayOnlyAccess,
  type Shop
} from "@/data/shops";

const accessible = createShop("accessible", false);
const motorwayOnly = createShop("motorway-only", true);
const unverified = createShop("unverified");

test("excludes only confirmed motorway-only listings by default", () => {
  assert.deepEqual(
    filterMotorwayOnlyAccess([accessible, motorwayOnly, unverified]).map((shop) => shop.slug),
    ["accessible", "unverified"]
  );
});

test("keeps accessible and unverified petrol stations visible", () => {
  assert.equal(filterMotorwayOnlyAccess([accessible]).length, 1);
  assert.equal(filterMotorwayOnlyAccess([unverified]).length, 1);
});

test("can include confirmed motorway-only listings when the filter is disabled", () => {
  assert.deepEqual(
    filterMotorwayOnlyAccess([accessible, motorwayOnly, unverified], false).map((shop) => shop.slug),
    ["accessible", "motorway-only", "unverified"]
  );
});

test("uses the safe exclusion default and persists an explicit opt-out", () => {
  assert.equal(shouldExcludeMotorwayOnlyAccess(), true);
  assert.equal(shouldExcludeMotorwayOnlyAccess("false"), true);
  assert.equal(shouldExcludeMotorwayOnlyAccess("true"), false);
});

function createShop(slug: string, motorwayOnlyAccess?: boolean): Shop {
  return {
    name: slug,
    slug,
    address: "Testweg 1",
    postalCode: "1000 AA",
    latitude: 52.37,
    longitude: 4.9,
    neighborhood: "Test area",
    openingHours: [],
    googleMapsLink: "https://www.google.com/maps",
    lastUpdated: "2026-11-16",
    status: "published",
    place_type: "gas_station",
    city: "Amsterdam",
    country: "Netherlands",
    motorwayOnlyAccess
  };
}
