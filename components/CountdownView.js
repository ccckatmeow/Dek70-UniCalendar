"use client";

import { useMemo } from "react";

// เหมือน logic ใน EventCard.js (แยกไว้ในไฟล์นี้เพื่อไม่ไปยุ่งกับ EventCard เดิม)
function combineDateTime(dateKey, timeStr, fallbackTime) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const time = timeStr ? timeStr.slice(0, 5) : fallbackTime;
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

function daysFromToday(targetDateTime) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    targetDateTime.getFullYear(),
    targetDateTime.getMonth(),
    targetDateTime.getDate()
  );
  return Math.round((startOfTarget - startOfToday) / (1000 * 60 * 60 * 24));
}

// คืนค่าว่า event นี้อยู่สถานะไหน แล้วต้องนับถอยหลังไปหา "วันเริ่ม" หรือ "วันสิ้นสุด"
function getCountdownInfo(event) {
  const now = new Date();
  const start = combineDateTime(event.start_date, event.start_time, "00:00");
  const end = combineDateTime(event.end_date, event.end_time, "23:59");

  if (now > end) {
    return { state: "past" };
  }
  if (now >= start) {
    // กำลังดำเนินอยู่ → นับถอยหลังไปหาวันสิ้นสุดแทน
    return {
      state: "ongoing",
      days: daysFromToday(end),
      targetLabel: "วันสิ้นสุด",
      targetDateKey: event.end_date,
    };
  }
  // ยังไม่ถึง → นับถอยหลังไปหาวันเริ่ม
  return {
    state: "upcoming",
    days: daysFromToday(start),
    targetLabel: "วันเริ่ม",
    targetDateKey: event.start_date,
  };
}

function formatShortThaiDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  return `${d} ${months[m - 1]} ${y + 543}`;
}

function CountdownCard({ event }) {
  const info = getCountdownInfo(event);

  return (
    <div className={`countdown-card countdown-card--${info.state}`}>
      <span className="countdown-card__decor" aria-hidden>
        {info.state === "ongoing" ? "🔥" : info.state === "past" ? "✅" : "⏳"}
      </span>

      {info.state === "past" && (
        <>
          <p className="countdown-card__number countdown-card__number--muted">จบแล้ว</p>
          <p className="countdown-card__title">{event.title}</p>
        </>
      )}

      {info.state !== "past" && (
        <>
          <p className="countdown-card__number">
            {info.days === 0 ? "🎉" : info.days}
          </p>
          <p className="countdown-card__caption">
            {info.days === 0 ? "วันนี้เลย!" : "วันจะถึง"}{" "}
            <span className="countdown-card__caption-sub">
              ({info.targetLabel} · {formatShortThaiDate(info.targetDateKey)})
            </span>
          </p>
          <p className="countdown-card__title">{event.title}</p>
        </>
      )}

      {(event.university || event.tcas_round) && (
        <p className="countdown-card__meta">
          {[event.university, event.tcas_round].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

export default function CountdownView({ events }) {
  const sorted = useMemo(() => {
    // เรียงกำหนดการที่ยังไม่จบไว้ก่อน (ใกล้ที่สุดขึ้นก่อน) แล้วค่อยตามด้วยที่จบไปแล้ว
    return [...events]
      .map((ev) => ({ ev, info: getCountdownInfo(ev) }))
      .sort((a, b) => {
        if (a.info.state === "past" && b.info.state !== "past") return 1;
        if (a.info.state !== "past" && b.info.state === "past") return -1;
        if (a.info.state === "past" && b.info.state === "past") {
          return a.ev.end_date < b.ev.end_date ? 1 : -1;
        }
        return (a.info.days ?? 0) - (b.info.days ?? 0);
      })
      .map(({ ev }) => ev);
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="countdown-view">
        <p className="empty-note">
          ยังไม่มีกำหนดการให้เลือกนับถอยหลัง — ไปเพิ่มกำหนดการในหน้าปฏิทินก่อนนะ 📌
        </p>
      </div>
    );
  }

  return (
    <div className="countdown-view countdown-view--grid">
      {sorted.map((ev) => (
        <CountdownCard key={ev.id} event={ev} />
      ))}
    </div>
  );
}
