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
    openingHours: twentyFourHourSchedule()
  });

  assert.deepEqual(getConfirmedShopOpeningHours(shop), []);
  assert.equal(getOpeningStatus(shop), "unknown");
  assert.equal(getOpeningStatusLabel(shop), "Opening hours not available");
  assert.deepEqual(formatShopOpeningHours(shop), ["Opening hours not available"]);
  assert.deepEqual(getOpeningHoursSpecification(shop), []);
});

test("preserves explicitly confirmed 24-hour gas-station shop hours", () => {
  const shop = createShop({
    place_type: "gas_station",
    openingHours: twentyFourHourSchedule(),
    openingHoursVerifiedForShop: true
  });
  const mondayAtNoonAmsterdam = new Date("2026-11-16T11:00:00Z");

  assert.equal(isOpenNow(shop, mondayAtNoonAmsterdam), true);
  assert.equal(getOpeningStatus(shop, mondayAtNoonAmsterdam), "open");
  assert.equal(getConfirmedShopOpeningHours(shop).length, 1);
});

test("preserves 24-hour schedules for non-gas-station shops", () => {
  const shop = createShop({ openingHours: twentyFourHourSchedule() });
  const mondayAtNoonAmsterdam = new Date("2026-11-16T11:00:00Z");

  assert.equal(isOpenNow(shop, mondayAtNoonAmsterdam), true);
  assert.equal(getOpeningStatusLabel(shop, mondayAtNoonAmsterdam), "Open now");
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

function twentyFourHourSchedule(): OpeningHoursSlot[] {
  return [{ days: allDays, opens: "00:00", closes: "23:59" }];
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
