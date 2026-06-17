# TESTING.md – Calendar Application

This document explains how each rubric requirement was tested using both **manual testing** and **Jest unit tests**.

---

## 1. Calendar opens on the current month

We tested by loading the application.

The calendar automatically uses:

- `new Date()` for current year
- `new Date().getMonth()` for current month
- `new Date().getDate()` for current day display

The UI correctly displays today's date in the format:

`weekday, DD.MM.YYYY`

---

## 2. Dynamic calendar rendering (DOM-based)

We verified that the calendar is fully generated using JavaScript DOM manipulation in `renderCalendar()`.

We confirmed:

- All day cells are created dynamically using a loop
- No hardcoded dates exist in HTML
- Calendar updates when month/year changes

---

## 3. Correct monthly grid generation

We tested multiple months (including edge cases like February and 31-day months).

The function correctly calculates:

- `firstDay = new Date(year, month, 1).getDay()`
- `lastDay = new Date(year, month + 1, 0).getDate()`

This ensures correct grid alignment in a 7-column layout.

---

## 4. Correct handling of empty leading days

We tested rendering for multiple months.

The calendar correctly inserts empty `<li class="empty"></li>` elements before the first day of each month using:

```js
for (let i = 0; i < firstDay; i++)
```

This ensures proper alignment of weekday structure.

---

## 5. Special event system works correctly

We tested `findSpecialDay()` and `getSpecialDays()` using real event data.

### ✔ getOccurrence()

We tested:

- "first" → 1
- "second" → 2
- "third" → 3
- "fourth" → 4
- "last" → -1

Edge cases:

- unknown input → 1
- null input → 1

---

### ✔ findSpecialDay()

We tested:

- Third Monday of January 2025 → 20
- Last Friday of March 2024 → 29

The function correctly:

- Matches weekday using `getDay()`
- Supports both nth and last occurrence logic
- Iterates through full month safely

---

## 6. Special days render correctly in UI

We tested rendering inside `renderCalendar()`:

- Special days are added using `.special-day` class
- Data attributes are correctly assigned:
  - `data-name`
  - `data-url`

Examples verified:

- Ada Lovelace Day
- World Lemur Day
- International Binturong Day

---

## 7. Tooltip functionality works correctly

We tested hover interactions on `.special-day` elements.

Verified:

- Tooltip appears on `mouseenter`
- Tooltip follows cursor using `mousemove`
- Tooltip hides on `mouseleave`
- Tooltip position adjusts to avoid screen overflow

Function tested:

```js
moveTooltip(e);
```

---

## 8. Navigation (Previous / Next buttons)

We tested navigation using `.pre-next-btn`.

### Verified behavior:

- Month increases/decreases correctly
- Year rolls over correctly:
  - December → January
  - January → December
- UI does not break at boundaries

State updates correctly:

- `monthSelect.value`
- `yearSelect.value`
- `renderCalendar()` is always called

---

## 9. Month and year dropdown navigation

We tested:

- `fillMonths()` correctly populates all 12 months
- `fillYears()` populates range 0–3000
- Selecting values updates calendar correctly

Dropdowns correctly sync with internal state variables:

- `month`
- `year`

---

## 10. "Today" button functionality

We tested clicking the Today button.

Verified:

- Calendar resets to current system date
- Month/year values update correctly
- Today box becomes visible again
- Today button hides after timeout

---

## 11. Tooltip DOM safety and stability

We tested hover interactions across multiple fast movements.

The tooltip:

- does not crash
- does not duplicate
- stays within viewport bounds

---

## 12. Edge case handling

We tested:

- Month transitions (0 ↔ 11)
- Year increment/decrement
- Large year range (0–3000)
- Months with different lengths (28–31 days)

No invalid states observed such as:

- undefined
- null
- NaN
- broken calendar grid

---

## 13. Accessibility (Lighthouse 100%)

We verified using Chrome DevTools Lighthouse.

Confirmed:

- Buttons have accessible names (`aria-label`)
- Select elements have proper labels
- Semantic HTML structure is preserved
- Keyboard navigation works correctly

Final Accessibility Score: **100**

---

## 14. Unit tests (Jest)

We tested core logic in `calendarUtils.js`.

### ✔ getOccurrence()

Ensures correct mapping of occurrence keywords and safe defaults.

### ✔ findSpecialDay()

Ensures correct calculation of:

- nth weekday of a month
- last weekday of a month
- correct handling of month boundaries

Mock event data was used for deterministic testing.

---

## 15. Overall system robustness

We tested the system under:

- rapid navigation clicks
- extreme month/year selection
- invalid event data
- empty or missing special days

The application remains stable and always renders a valid calendar.

---

## 16. Summary

The application successfully meets all requirements:

- Dynamic DOM-based calendar rendering
- Accurate date alignment
- Functional navigation system
- Special event calculation system
- Tooltip interactivity
- Full accessibility compliance
- Unit-tested core logic functions
