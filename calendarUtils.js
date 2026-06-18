export const months = [
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

const getMonthIndex = (name) =>
  months.findIndex((m) => m.toLowerCase() === name.toLowerCase());

const getDayIndex = (name) =>
  weekDays.findIndex((d) => d.toLowerCase() === name.toLowerCase());

export const getOccurrence = (type) => {
  const map = { first: 1, second: 2, third: 3, fourth: 4, last: -1 };
  return map[type?.toLowerCase()] ?? 1;
};

// find special day function;
export const findSpecialDay = (event, y, m) => {
  const eventMonth = getMonthIndex(event.monthName);
  if (eventMonth !== m) return null;

  const targetDay = getDayIndex(event.dayName);
  const occ = getOccurrence(event.occurrence);
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  let count = 0;

  if (occ === -1) {
    for (let d = daysInMonth; d >= 1; d--) {
      if (new Date(y, m, d).getDay() === targetDay) return d;
    }
    return null;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(y, m, d).getDay() === targetDay) {
      count++;
      if (count === occ) return d;
    }
  }

  return null;
};
