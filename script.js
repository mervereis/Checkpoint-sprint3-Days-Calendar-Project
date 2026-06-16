import { events as specialDaysData } from "./eventData.js";

// touch HTML elements;
const monthAndYearText = document.getElementById("month-year-text");
const todaysDayAndDate = document.getElementById("todays-day-date");
const datesOfMonth = document.getElementById("dates-of-month");
const btnElements = document.querySelectorAll(".pre-next-btn");
const todaysInfoBox = document.querySelector(".today-box");
const monthSelect = document.getElementById("monthsSelection");
const yearSelect = document.getElementById("yearsSelection");
const tooltip = document.getElementById("special-tooltip");

// =========== global variables;
const dateObj = new Date();
let year = dateObj.getFullYear();
let date = dateObj.getDate();
let month = dateObj.getMonth();
let firstDayIndex = new Date(year, month, 1).getDay();

const dayNames = dateObj.toLocaleDateString("en-GB", {
  weekday: "long",
});

// =========== heading texts

todaysDayAndDate.textContent = `${dayNames}, ${date}.${month + 1}.${year}`;

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
  "December",
];

const currentMonth = month;
const currentYear = year;

const monthNameToIndex = (monthName) => {
  return months.findIndex(
    (name) => name.toLowerCase() === monthName.toLowerCase(),
  );
};

const dayNameToIndex = (dayName) => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames.findIndex(
    (name) => name.toLowerCase() === dayName.toLowerCase(),
  );
};

const getOccurrenceIndex = (occurrence) => {
  const mapping = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    last: -1,
  };
  return mapping[occurrence.toLowerCase()] ?? 1;
};

const getSpecialDayForMonth = (specialDay, displayYear, displayMonth) => {
  const specialMonth = monthNameToIndex(specialDay.monthName);
  const weekdayIndex = dayNameToIndex(specialDay.dayName);
  const occurrenceIndex = getOccurrenceIndex(specialDay.occurrence);

  if (specialMonth !== displayMonth) {
    return null;
  }

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  if (occurrenceIndex === -1) {
    // last occurrence
    for (let day = daysInMonth; day > 0; day--) {
      const dateCandidate = new Date(displayYear, displayMonth, day);
      if (dateCandidate.getDay() === weekdayIndex) {
        return day;
      }
    }
    return null;
  }

  let matchCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateCandidate = new Date(displayYear, displayMonth, day);
    if (dateCandidate.getDay() === weekdayIndex) {
      matchCount += 1;
      if (matchCount === occurrenceIndex) {
        return day;
      }
    }
  }

  return null;
};

const getSpecialDaysForDisplayMonth = () => {
  return specialDaysData
    .map((specialDay) => {
      const dayNumber = getSpecialDayForMonth(specialDay, year, month);
      if (dayNumber !== null) {
        return {
          day: dayNumber,
          name: specialDay.name,
          descriptionURL: specialDay.descriptionURL,
        };
      }
      return null;
    })
    .filter(Boolean);
};

const positionTooltip = (event) => {
  const offset = 12;
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;
  const pageWidth = window.innerWidth;
  const pageHeight = window.innerHeight;

  let left = event.pageX + offset;
  let top = event.pageY + offset;

  if (left + tooltipWidth > pageWidth) {
    left = event.pageX - tooltipWidth - offset;
  }
  if (top + tooltipHeight > pageHeight) {
    top = event.pageY - tooltipHeight - offset;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
};

const displayCalendar = () => {
  firstDayIndex = new Date(year, month, 1).getDay();
  datesOfMonth.innerHTML = "";

  for (let i = 0; i < firstDayIndex; i++) {
    datesOfMonth.innerHTML += `<li class="empty"></li>`;
  }

  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  const specialDays = getSpecialDaysForDisplayMonth();
  const specialDayMap = specialDays.reduce((map, item) => {
    map[item.day] = item;
    return map;
  }, {});

  for (let i = 1; i <= lastDateOfMonth; i++) {
    const special = specialDayMap[i];
    const specialClass = special ? " special-day" : "";
    const dataAttributes = special ? `data-name="${special.name}"` : "";
    const icon = special ? ` <span class="special-label">★</span>` : "";
    datesOfMonth.innerHTML += `<li class="date-item${specialClass}" ${dataAttributes}>${i}${icon}</li>`;
  }

  const specialDateElements = document.querySelectorAll(
    ".date-item.special-day",
  );
  specialDateElements.forEach((dayElement) => {
    const name = dayElement.dataset.name;
    const url = dayElement.dataset.url;

    const hoverText = url ? `${name}\n${url}` : name;

    dayElement.addEventListener("mouseenter", (event) => {
      tooltip.textContent = hoverText;
      tooltip.classList.add("visible");
      positionTooltip(event);
    });

    dayElement.addEventListener("mousemove", positionTooltip);
    dayElement.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });

  const currentMonthName = new Date(year, month).toLocaleDateString("en-GB", {
    month: "long",
  });
  monthAndYearText.textContent = `${currentMonthName}, ${year}`;
};

const populateMonthDropdown = () => {
  let options = '<option value="">Month</option>';
  months.forEach((monthName, index) => {
    const isSelected = index === currentMonth ? " selected" : "";
    options += `<option value="${index}"${isSelected}>${monthName}</option>`;
  });
  monthSelect.innerHTML = options;
};

const populateYearDropdown = () => {
  const yearStart = 1900;
  const yearEnd = new Date().getFullYear();
  let options = '<option value="">Year</option>';
  for (let y = yearEnd; y >= yearStart; y--) {
    const selected = y === currentYear ? " selected" : "";
    options += `<option value="${y}"${selected}>${y}</option>`;
  }
  yearSelect.innerHTML = options;
};

// ==================== previous and next btn events;
btnElements.forEach((btn) => {
  btn.addEventListener("click", () => {
    month = btn.id === "previous-btn" ? month - 1 : month + 1;
    if (month < 0) {
      year -= 1;
      month = 11;
    } else if (month > 11) {
      year += 1;
      month = 0;
    }

    yearSelect.value = `${year}`;
    monthSelect.value = `${month}`;

    todaysInfoBox.style.display = "none";
    displayCalendar();
  });
});

monthSelect.addEventListener("change", () => {
  if (monthSelect.value !== "") {
    month = parseInt(monthSelect.value, 10);
    displayCalendar();
  }
});

yearSelect.addEventListener("change", () => {
  const selectedYear = parseInt(yearSelect.value, 10);
  if (!Number.isNaN(selectedYear)) {
    year = selectedYear;
    displayCalendar();
  }
});

populateMonthDropdown();
populateYearDropdown();
window.onload = displayCalendar;
