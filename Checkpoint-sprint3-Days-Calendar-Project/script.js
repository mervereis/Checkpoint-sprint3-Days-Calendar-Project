// touch HTML elements;
const monthAndYearText = document.getElementById("month-year-text");
const todaysDayAndDate = document.getElementById("todays-day-date");
const datesOfMonth = document.getElementById("dates-of-month");
const btnElements = document.querySelectorAll(".pre-next-btn");
const todaysInfoBox = document.querySelector(".today-box");

// =========== global variables;
let dateObj = new Date();
let year = dateObj.getFullYear();
let date = dateObj.getDate();
let month = dateObj.getMonth();
let firstDayIndex = new Date(year, month, 1).getDay();

const dayNames = new Date().toLocaleDateString("en-GB", {
  weekday: "long"
});
const monthNames = new Date().toLocaleDateString("en-GB", {
  month: "short"
});

// =========== heading texts

todaysDayAndDate.textContent = `${dayNames}, ${date}.${month}.${year}`;

// =================== display Calendar;
const displayCalendar = () => {
  // create empty spaces before day ONE;
  datesOfMonth.innerHTML = "";
  for (let i = 0; i < firstDayIndex; i++) {
    datesOfMonth.innerHTML += `<li class="empty"></li>`;
  }

  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= lastDateOfMonth; i++) {
    datesOfMonth.innerHTML += `<li>${i}</li>`;
  }
  const currentMonthName = new Date(year, month).toLocaleDateString("en-GB", {
    month: "long"
  });

  monthAndYearText.textContent = `${currentMonthName}, ${year}`;
};

// ==================== previous and next btn events;
btnElements.forEach((btns) => {
  btns.addEventListener("click", () => {
    month = btns.id === "previous-btn" ? month - 1 : month + 1;
    if (month < 0 || month > 11) {
      date = new Date(year, month, new Date().getDate());
      year = date.getFullYear();
      month = date.getMonth();
    }
    todaysInfoBox.style.display = "none";
    displayCalendar();
  });
});

window.onload = displayCalendar;
