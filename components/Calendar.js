"use client";

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const MONTH_NAMES = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

function toDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function buildGridDays(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({
      day: daysInPrevMonth - i,
      inCurrentMonth: false,
      year: month === 0 ? year - 1 : year,
      month: month === 0 ? 11 : month - 1,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, inCurrentMonth: true, year, month });
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    const nextDay = last.day + 1;
    cells.push({
      day: nextDay,
      inCurrentMonth: false,
      year: month === 11 ? year + 1 : year,
      month: month === 11 ? 0 : month + 1,
    });
  }

  return cells;
}

export function monthLabel(year, month) {
  return `${MONTH_NAMES[month]} ${year}`;
}

export default function Calendar({
  year,
  month,
  eventCounts,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) {
  const cells = buildGridDays(year, month);
  const todayKey = toDateKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  return (
    <div>
      <div className="month-nav">
        <div className="month-nav__label">{monthLabel(year, month)}</div>
        <div className="month-nav__controls">
          <button type="button" onClick={onPrevMonth} aria-label="เดือนก่อนหน้า">
            ก่อนหน้า
          </button>
          <button type="button" onClick={onNextMonth} aria-label="เดือนถัดไป">
            ถัดไป
          </button>
        </div>
      </div>

      <div className="weekday-row">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="day-grid">
        {cells.map((cell, idx) => {
          const key = toDateKey(cell.year, cell.month, cell.day);
          const count = eventCounts[key] || 0;
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;

          const classNames = ["day-cell"];
          if (!cell.inCurrentMonth) classNames.push("day-cell--muted");
          if (isToday) classNames.push("day-cell--today");
          if (isSelected) classNames.push("day-cell--selected");

          return (
            <button
              key={key + idx}
              type="button"
              className={classNames.join(" ")}
              onClick={() => onSelectDate(key)}
            >
              <span className="day-cell__num">{cell.day}</span>
              {count > 0 && (
                <span className="day-cell__dots">
                  {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                    <span className="dot" key={i} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
