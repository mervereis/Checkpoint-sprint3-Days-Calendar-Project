import {
  months,
  findSpecialDay
} from "./calendarUtils.js";

const todayText = document.getElementById("todays-day-date");
const calendarDays = document.getElementById("dates-of-month");
const buttons = document.querySelectorAll(".pre-next-btn");
const todayBox = document.querySelector(".today-box");
const monthSelect = document.getElementById("monthsSelection");
const yearSelect = document.getElementById("yearsSelection");
const tooltip = document.getElementById("special-tooltip");
const todayBtn = document.getElementById("today-btn");


const now = new Date();

let year = now.getFullYear();
let month = now.getMonth();
let date = now.getDate();
let specialDaysData = [];


const todayName = now.toLocaleDateString("en-GB", { weekday: "long" });

todayText.textContent = `${todayName}, ${date}.${month + 1}.${year}`;


const getSpecialDays = () =>
  specialDaysData
    .map((e) => {
      const day = findSpecialDay(e, year, month);
      if (!day) return null;

      return {
        day,
        name: e.name,
      };
    })
    .filter(Boolean);


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


const renderCalendar = () => {
  calendarDays.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  
  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += `<li class="empty"></li>`;
  }

  const specialMap = {};
  getSpecialDays().forEach((item) => {
    specialMap[item.day] = item;
  });


  for (let d = 1; d <= lastDay; d++) {
    const special = specialMap[d];

    calendarDays.innerHTML += `
      <li class="date-item ${special ? "special-day" : ""}"
          data-name="${special?.name || ""}">
        ${d} ${special ? "★" : ""}
      </li>
    `;
  }


  document.querySelectorAll(".special-day").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      tooltip.textContent = el.dataset.name;
      tooltip.classList.add("visible");
      moveTooltip(e);
    });

    el.addEventListener("mousemove", moveTooltip);

    el.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  });
};


const fillMonths = () => {
  monthSelect.innerHTML =
    `<option disabled selected>Month</option>` +
    months.map((m, i) => `<option value="${i}">${m}</option>`).join("");

  monthSelect.value = month;
};

const fillYears = () => {
  const start = 0;
  const end = 3000;

  let html = `<option disabled selected>Year</option>`;

  for (let y = end; y >= start; y--) {
    html += `<option value="${y}">${y}</option>`;
  }

  yearSelect.innerHTML = html;
  yearSelect.value = year;
};


const ensureYearOption = (y) => {
  if (!yearSelect.querySelector(`option[value="${y}"]`)) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    if (y > 3000) {
      yearSelect.insertBefore(option, yearSelect.options[1]);
    } else {
      yearSelect.appendChild(option);
    }
  }
};

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

    ensureYearOption(year);
    monthSelect.value = month;
    yearSelect.value = year;

    todayBox.style.display = "none";
    todayBtn.style.display = "block";
    renderCalendar();
  });
});


monthSelect.addEventListener("change", () => {
  month = +monthSelect.value;
  todayBox.style.display = "none";
  todayBtn.style.display = "block";
  renderCalendar();
});

yearSelect.addEventListener("change", () => {
  year = +yearSelect.value;
  todayBox.style.display = "none";
  todayBtn.style.display = "block";
  renderCalendar();
});


todayBtn.addEventListener("click", () => {
  const now = new Date();
  year = now.getFullYear();
  month = now.getMonth();

  monthSelect.value = month;
  yearSelect.value = year;

  todayBox.style.display = "flex";
  renderCalendar();
  setTimeout(() => {
    todayBtn.style.display = "none";
  }, 2000);
});


fetch("days.json")
  .then((res) => res.json())
  .then((data) => {
    specialDaysData = data;
    fillMonths();
    fillYears();
    renderCalendar();
  });
