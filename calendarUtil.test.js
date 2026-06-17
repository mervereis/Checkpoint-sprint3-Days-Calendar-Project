// Import the logic functions we are testing
import { getOccurrence, findSpecialDay } from "./calendarUtils.js";

// Tests for getOccurrence()
describe("getOccurrence()", () => {
  // Known keywords should return correct numbers
  test("returns correct numeric value for known keywords", () => {
    expect(getOccurrence("first")).toBe(1);
    expect(getOccurrence("second")).toBe(2);
    expect(getOccurrence("third")).toBe(3);
    expect(getOccurrence("fourth")).toBe(4);
    expect(getOccurrence("last")).toBe(-1);
  });

  // Unknown or missing input should default to 1
  test("returns default value 1 for unknown or missing input", () => {
    expect(getOccurrence("unknown")).toBe(1);
    expect(getOccurrence("")).toBe(1);
    expect(getOccurrence(null)).toBe(1);
  });
});

// Tests for findSpecialDay() — this is the non‑trivial function
describe("findSpecialDay()", () => {
  test("finds the third Monday of January 2025", () => {
    const event = {
      monthName: "January",
      dayName: "Monday",
      occurrence: "third"
    };

    const result = findSpecialDay(event, 2025, 0);
    expect(result).toBe(20);
  });

  test("finds the last Friday of March 2024", () => {
    const event = {
      monthName: "March",
      dayName: "Friday",
      occurrence: "last"
    };

    const result = findSpecialDay(event, 2024, 2);
    expect(result).toBe(29);
  });
});
