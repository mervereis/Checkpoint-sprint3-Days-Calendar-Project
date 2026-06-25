import { readFileSync, writeFileSync } from "fs";
import { findSpecialDay } from "./calendarUtils.js";

// Read events from the JSON file
const days = JSON.parse(readFileSync("days.json", "utf-8"));

const START_YEAR = 2020;
const END_YEAR = 2030;

// List of month names
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];

// Add a leading zero
function addZero(number) {
  return String(number).padStart(2, "0");
}

// Format date as YYYYMMDD
function formatDate(year, month, day) {
  return `${year}${addZero(month + 1)}${addZero(day)}`;
}

// Add an event to the calendar
function addEvent(calendar, event, startDate, endDate, year) {
  const eventId =
    event.name.replace(/\s+/g, "-").toLowerCase() +
    "-" +
    year +
    "@days-calendar";

  calendar.push("BEGIN:VEVENT");
  calendar.push(`DTSTART;VALUE=DATE:${startDate}`);
  calendar.push(`DTEND;VALUE=DATE:${endDate}`);
  calendar.push(`SUMMARY:${event.name}`);
  calendar.push(`UID:${eventId}`);
  calendar.push("END:VEVENT");
}

// Calendar header
const calendar = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Days Calendar//EN"
];

// Generate events
for (let year = START_YEAR; year <= END_YEAR; year++) {
  for (const event of days) {
    const month = months.indexOf(event.monthName.toLowerCase());

    const day = findSpecialDay(event, year, month);

    if (!day) {
      continue;
    }

    const startDate = formatDate(year, month, day);

    const nextDay = new Date(year, month, day + 1);

    const endDate = formatDate(
      nextDay.getFullYear(),
      nextDay.getMonth(),
      nextDay.getDate()
    );

    addEvent(calendar, event, startDate, endDate, year);
  }
}

// Calendar footer
calendar.push("END:VCALENDAR");

// Save the file
writeFileSync("days.ics", calendar.join("\r\n") + "\r\n");

console.log("days.ics generated successfully.");
