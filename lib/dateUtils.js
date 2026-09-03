export function pad(n) {
  return String(n).padStart(2, "0");
}

export function toKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(dateKey, delta) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return toKey(dt);
}

export function todayKey() {
  return toKey(new Date());
}

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

export function formatThaiDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y + 543}`;
}

export function formatEventTime(startTime, endTime) {
  const clean = (t) => (t ? t.slice(0, 5) : "");
  const start = clean(startTime);
  const end = clean(endTime);
  if (!start && !end) return null;
  if (start && end) return `เวลา ${start} - ${end} น.`;
  if (start) return `เวลา ${start} น.`;
  return `ถึงเวลา ${end} น.`;
}

export function formatThaiDateRange(startKey, endKey) {
  if (startKey === endKey) return formatThaiDate(startKey);
  const [sy, sm] = startKey.split("-").map(Number);
  const [ey, em, ed] = endKey.split("-").map(Number);
  const [, , sd] = startKey.split("-").map(Number);
  if (sy === ey && sm === em) {
    return `${sd} - ${ed} ${MONTH_NAMES[sm - 1]} ${sy + 543}`;
  }
  return `${formatThaiDate(startKey)} - ${formatThaiDate(endKey)}`;
}

// Groups a flat list of events (each with start_date/end_date) into a
// map of dateKey -> events overlapping that day, clamped to [rangeStart, rangeEnd].
export function buildDayGroups(events, rangeStart, rangeEnd) {
  const grouped = {};
  for (const ev of events) {
    let cursor = ev.start_date > rangeStart ? ev.start_date : rangeStart;
    const stop = ev.end_date < rangeEnd ? ev.end_date : rangeEnd;
    while (cursor <= stop) {
      if (!grouped[cursor]) grouped[cursor] = [];
      grouped[cursor].push(ev);
      cursor = addDays(cursor, 1);
    }
  }
  return grouped;
}

export const TCAS_ROUNDS = [
  "รอบ 1 Portfolio",
  "รอบ 2 โควตา",
  "รอบ 3 Admission",
  "รอบ 4 Direct Admission",
  "อื่นๆ",
];

export const EVENT_COLORS = [
  "#3E6FF0", // ฟ้า (ค่าเริ่มต้น)
  "#12A594", // เขียวเทอร์ควอยส์
  "#F2994A", // ส้ม
  "#9B51E0", // ม่วง
  "#E8548C", // ชมพู
  "#2F9E44", // เขียว
  "#64748B", // เทา
];

export const DEFAULT_EVENT_COLOR = EVENT_COLORS[0];
