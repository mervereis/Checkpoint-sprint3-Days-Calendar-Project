// touch HTML elements;
const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");
const monthAndYearText = document.getElementById("month-year-text");
const todaysDayAndDate = document.getElementById("todays-day-date");

// global variables;
let date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDay;
