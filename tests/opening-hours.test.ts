import assert from "node:assert/strict";
import test from "node:test";
import {
  formatShopOpeningHours,
  getConfirmedShopOpeningHours,
  getOpeningHoursSpecification,
  getOpeningStatus,
  getOpeningStatusLabel,
  getTodayOpeningHours,
  isOpenNow,
  type DayName,
  type OpeningHoursSlot,
  type Shop
} from "@/data/shops";
import { generateLocalBusinessJsonLd } from "@/lib/structured-data";

const allDays: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

test("handles an overnight schedule across midnight", () => {
  const shop = createShop({
    openingHours: [{ days: ["Monday"], opens: "22:00", closes: "02:00" }]
  });
  const tuesdayAtOneThirtyAmsterdam = new Date("2026-11-17T00:30:00Z");
  const tuesdayAtThreeAmsterdam = new Date("2026-11-17T02:00:00Z");

  assert.equal(isOpenNow(shop, tuesdayAtOneThirtyAmsterdam), true);
  assert.equal(getOpeningStatus(shop, tuesdayAtOneThirtyAmsterdam), "open");
  assert.equal(getTodayOpeningHours(shop, tuesdayAtOneThirtyAmsterdam), "22:00–02:00");
  assert.equal(isOpenNow(shop, tuesdayAtThreeAmsterdam), false);
});

test("hides ambiguous 24-hour gas-station schedules", () => {
  const shop = createShop({
    place_type: "gas_station",
    openingHours: twentyFourHourSchedule("24:00")
  });

  assert.deepEqual(getConfirmedShopOpeningHours(shop), []);
  assert.equal(getOpeningStatus(shop), "unknown");
  assert.equal(getOpeningStatusLabel(shop), "Shop opening hours not confirmed");
  assert.equal(getTodayOpeningHours(shop), "Shop opening hours not confirmed");
  assert.deepEqual(formatShopOpeningHours(shop), ["Shop opening hours not confirmed"]);
  assert.deepEqual(getOpeningHoursSpecification(shop), []);
  const schema = generateLocalBusinessJsonLd(shop);
  assert.ok(schema);
  assert.equal(Object.hasOwn(schema, "openingHours"), false);
  assert.equal(Object.hasOwn(schema, "openingHoursSpecification"), false);
});

test("preserves explicitly confirmed 24-hour gas-station shop hours", () => {
  const shop = createShop({
    place_type: "gas_station",
    openingHours: twentyFourHourSchedule("24:00"),
    openingHoursVerifiedForShop: true
  });
  const mondayAtNoonAmsterdam = new Date("2026-11-16T11:00:00Z");

  assert.equal(isOpenNow(shop, mondayAtNoonAmsterdam), true);
  assert.equal(getOpeningStatus(shop, mondayAtNoonAmsterdam), "open");
  assert.equal(getConfirmedShopOpeningHours(shop).length, 1);
  assert.equal(getOpeningHoursSpecification(shop)[0]?.closes, "23:59");
  const schema = generateLocalBusinessJsonLd(shop);
  assert.ok(schema);
  assert.equal(
    (schema.openingHoursSpecification as Array<{ closes: string }>)[0]?.closes,
    "23:59"
  );
});

test("uses verified staffed-shop hours when the gas-station forecourt is open 24 hours", () => {
  const shop = createShop({
    place_type: "gas_station",
    openingHours: [{ days: allDays, opens: "06:00", closes: "22:00" }],
    openingHoursVerifiedForShop: true
  });
  const mondayAtNineAmsterdam = new Date("2026-11-16T20:00:00Z");
  const mondayAtElevenAmsterdam = new Date("2026-11-16T22:00:00Z");

  assert.equal(isOpenNow(shop, mondayAtNineAmsterdam), true);
  assert.equal(getOpeningStatusLabel(shop, mondayAtNineAmsterdam), "Open now");
  assert.equal(isOpenNow(shop, mondayAtElevenAmsterdam), false);
  assert.equal(getOpeningStatusLabel(shop, mondayAtElevenAmsterdam), "Closed now");
});

test("preserves 24-hour schedules for non-gas-station shops", () => {
  const shop = createShop({ openingHours: twentyFourHourSchedule() });
  const mondayAtNoonAmsterdam = new Date("2026-11-16T11:00:00Z");

  assert.equal(isOpenNow(shop, mondayAtNoonAmsterdam), true);
  assert.equal(getOpeningStatusLabel(shop, mondayAtNoonAmsterdam), "Open now");
});

test("uses known opening hours for a normal tobacco shop", () => {
  const shop = createShop({
    openingHours: [{ days: allDays, opens: "09:00", closes: "18:00" }]
  });
  const mondayAtNoonAmsterdam = new Date("2026-11-16T11:00:00Z");

  assert.equal(getOpeningStatus(shop, mondayAtNoonAmsterdam), "open");
  assert.deepEqual(formatShopOpeningHours(shop), ["Monday-Sunday: 09:00–18:00"]);
});

test("reports explicitly closed shops as closed", () => {
  const shop = createShop({
    openingHours: [{ days: allDays, opens: "00:00", closes: "00:00", note: "Closed" }]
  });

  assert.equal(isOpenNow(shop), false);
  assert.equal(getOpeningStatus(shop), "closed");
  assert.equal(getOpeningStatusLabel(shop), "Closed now");
  assert.deepEqual(formatShopOpeningHours(shop), ["Monday-Sunday: Closed"]);
});

test("reports missing opening hours as unavailable", () => {
  const shop = createShop({ openingHours: [] });

  assert.equal(isOpenNow(shop), false);
  assert.equal(getOpeningStatus(shop), "unknown");
  assert.equal(getOpeningStatusLabel(shop), "Opening hours not available");
  assert.deepEqual(formatShopOpeningHours(shop), ["Opening hours not available"]);
});

function twentyFourHourSchedule(closes = "23:59"): OpeningHoursSlot[] {
  return [{ days: allDays, opens: "00:00", closes }];
}

function createShop(overrides: Partial<Shop>): Shop {
  return {
    name: "Test location",
    slug: "test-location",
    address: "Teststraat 1",
    postalCode: "1000 AA",
    latitude: 52.37,
    longitude: 4.9,
    neighborhood: "Centrum",
    openingHours: [],
    googleMapsLink: "https://www.google.com/maps",
    lastUpdated: "2026-11-14",
    place_type: "tobacco_shop",
    city: "Amsterdam",
    country: "Netherlands",
    status: "published",
    ...overrides
  };
}
