import { events as specialDaysData } from "./eventData.js";

/* =========================
   DOM ELEMENTS
========================= */
const todayText = document.getElementById("todays-day-date");
const calendarDays = document.getElementById("dates-of-month");
const buttons = document.querySelectorAll(".pre-next-btn");
const todayBox = document.querySelector(".today-box");
const monthSelect = document.getElementById("monthsSelection");
const yearSelect = document.getElementById("yearsSelection");
const tooltip = document.getElementById("special-tooltip");

/* =========================
   DATE SETUP
========================= */
const now = new Date();

let year = now.getFullYear();
let month = now.getMonth();
let date = now.getDate();

/* =========================
   CONSTANTS
========================= */
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

/* =========================
   TODAY TEXT
========================= */
const todayName = now.toLocaleDateString("en-GB", { weekday: "long" });

todayText.textContent = `${todayName}, ${date}.${month + 1}.${year}`;

/* =========================
   HELPER FUNCTIONS
========================= */

// convert month name → index
const getMonthIndex = (name) =>
  months.findIndex((m) => m.toLowerCase() === name.toLowerCase());

// convert weekday name → index
const getDayIndex = (name) =>
  weekDays.findIndex((d) => d.toLowerCase() === name.toLowerCase());

// convert "first, second, last..." → number
const getOccurrence = (type) => {
  const map = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    last: -1
  };
  return map[type?.toLowerCase()] ?? 1;
};

/* =========================
   SPECIAL DAY LOGIC
========================= */
const findSpecialDay = (event, y, m) => {
  const eventMonth = getMonthIndex(event.monthName);
  if (eventMonth !== m) return null;

  const targetDay = getDayIndex(event.dayName);
  const occ = getOccurrence(event.occurrence);
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  let count = 0;

  // last occurrence
  if (occ === -1) {
    for (let d = daysInMonth; d >= 1; d--) {
      if (new Date(y, m, d).getDay() === targetDay) return d;
    }
    return null;
  }

  // first, second, third...
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(y, m, d).getDay() === targetDay) {
      count++;
      if (count === occ) return d;
    }
  }

  return null;
};

// get all special days for current month
const getSpecialDays = () =>
  specialDaysData
    .map((e) => {
      const day = findSpecialDay(e, year, month);
      if (!day) return null;

      return {
        day,
        name: e.name,
        url: e.descriptionURL
      };
    })
    .filter(Boolean);

/* =========================
   TOOLTIP POSITION
========================= */
const moveTooltip = (e) => {
  const offset = 12;

  let x = e.pageX + offset;
  let y = e.pageY + offset;

  const w = tooltip.offsetWidth;
  const h = tooltip.offsetHeight;

  if (x + w > window.innerWidth) x = e.pageX - w - offset;
  if (y + h > window.innerHeight) y = e.pageY - h - offset;

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
};

/* =========================
   RENDER CALENDAR
========================= */
const renderCalendar = () => {
  calendarDays.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  // empty boxes before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += `<li class="empty"></li>`;
  }

  const specialMap = {};
  getSpecialDays().forEach((item) => {
    specialMap[item.day] = item;
  });

  // days
  for (let d = 1; d <= lastDay; d++) {
    const special = specialMap[d];

    calendarDays.innerHTML += `
      <li class="date-item ${special ? "special-day" : ""}"
          data-name="${special?.name || ""}"
          data-url="${special?.url || ""}">
        ${d} ${special ? "★" : ""}
      </li>
    `;
  }

  // tooltip events
  document.querySelectorAll(".special-day").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const text = el.dataset.url
        ? `${el.dataset.name}\n${el.dataset.url}`
        : el.dataset.name;

      tooltip.textContent = text;
      tooltip.classList.add("visible");
      moveTooltip(e);
    });

    el.addEventListener("mousemove", moveTooltip);

    el.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
};

/* =========================
   DROPDOWNS
========================= */
const fillMonths = () => {
  monthSelect.innerHTML =
    `<option disabled selected>Month</option>` +
    months.map((m, i) => `<option value="${i}">${m}</option>`).join("");

  monthSelect.value = month;
};

const fillYears = () => {
  const start = 0;
  const end = 9999;

  let html = `<option disabled selected>Year</option>`;

  for (let y = end; y >= start; y--) {
    html += `<option value="${y}">${y}</option>`;
  }

  yearSelect.innerHTML = html;
  yearSelect.value = year;
};

/* =========================
   EVENTS
========================= */

// next/prev buttons
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    month += btn.id === "previous-btn" ? -1 : 1;

    if (month < 0) {
      month = 11;
      year--;
    } else if (month > 11) {
      month = 0;
      year++;
    }

    monthSelect.value = month;
    yearSelect.value = year;

    todayBox.style.display = "none";
    renderCalendar();
  });
});

// dropdowns
monthSelect.addEventListener("change", () => {
  month = +monthSelect.value;
  todayBox.style.display = "none";
  renderCalendar();
});

yearSelect.addEventListener("change", () => {
  year = +yearSelect.value;
  todayBox.style.display = "none";
  renderCalendar();
});

/* =========================
   INIT
========================= */
fillMonths();
fillYears();
renderCalendar();
