import { readFileSync, writeFileSync } from "fs";
import { findSpecialDay } from "./calendarUtils.js";

const days = JSON.parse(readFileSync("days.json", "utf-8"));

const START_YEAR = 2020;
const END_YEAR = 2030;

const pad = (n) => String(n).padStart(2, "0");

const formatDate = (y, m, d) => `${y}${pad(m + 1)}${pad(d)}`;

let ical = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//Days Calendar//EN"
];

for (let year = START_YEAR; year <= END_YEAR; year++) {
  for (const event of days) {
    const monthIndex = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ].indexOf(event.monthName.toLowerCase());

    const day = findSpecialDay(event, year, monthIndex);
    if (!day) continue;

    const dtStart = formatDate(year, monthIndex, day);
    const nextDate = new Date(year, monthIndex, day + 1);
    const dtEnd = formatDate(
      nextDate.getFullYear(),
      nextDate.getMonth(),
      nextDate.getDate()
    );

    ical.push("BEGIN:VEVENT");
    ical.push(`DTSTART;VALUE=DATE:${dtStart}`);
    ical.push(`DTEND;VALUE=DATE:${dtEnd}`);
    ical.push(`SUMMARY:${event.name}`);
    ical.push(`UID:${event.name.replace(/\s+/g, "-").toLowerCase()}-${year}@days-calendar`);
    ical.push("END:VEVENT");
  }
}

ical.push("END:VCALENDAR");

writeFileSync("days.ics", ical.join("\r\n") + "\r\n");
console.log("days.ics generated successfully.");
