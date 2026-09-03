"use client";

import {
  formatThaiDateRange,
  formatThaiDateTime,
  formatEventTime,
} from "../lib/dateUtils";

function combineDateTime(dateKey, timeStr, fallbackTime) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const time = timeStr ? timeStr.slice(0, 5) : fallbackTime;
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

function getUrgency(event) {
  const now = new Date();

  // "Passed" is judged against the real end date+time (defaulting to end
  // of day if no end_time was set), not just the calendar date.
  const endDateTime = combineDateTime(event.end_date, event.end_time, "23:59");
  if (now > endDateTime) {
    return { label: "ผ่านไปแล้ว", tone: "past" };
  }

  const startDateTime = combineDateTime(event.start_date, event.start_time, "00:00");
  if (now >= startDateTime) {
    return { label: "กำลังดำเนินอยู่", tone: "urgent" };
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEventDay = new Date(
    startDateTime.getFullYear(),
    startDateTime.getMonth(),
    startDateTime.getDate()
  );
  const dayDiff = Math.round((startOfEventDay - startOfToday) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) return { label: "วันนี้", tone: "urgent" };
  if (dayDiff <= 3) return { label: `อีก ${dayDiff} วัน`, tone: "urgent" };
  if (dayDiff <= 7) return { label: `อีก ${dayDiff} วัน`, tone: "soon" };
  return null;
}

export default function EventCard({ event, onEdit, onDelete }) {
  const urgency = getUrgency(event);
  const toneClass = urgency ? `event-card--${urgency.tone}` : "";
  const links =
    event.links && event.links.length > 0
      ? event.links
      : event.link_url
      ? [{ label: "", url: event.link_url }]
      : [];

  return (
    <li className={`event-card ${toneClass}`}>
      <div className="event-card__main">
        <div className="event-card__heading">
          <span className="event-card__color" style={{ backgroundColor: event.color }} />
          <p className="event-card__title">{event.title}</p>
          {urgency && (
            <span className={`badge badge--${urgency.tone}`}>{urgency.label}</span>
          )}
        </div>

        {event.start_date === event.end_date ? (
          <>
            <p className="event-card__range">
              {formatThaiDateRange(event.start_date, event.end_date)}
            </p>
            {formatEventTime(event.start_time, event.end_time) && (
              <p className="event-card__time">
                {formatEventTime(event.start_time, event.end_time)}
              </p>
            )}
          </>
        ) : (
          <div className="event-card__daterange">
            <p className="event-card__range">
              <span className="event-card__range-label">วันเริ่ม :</span>{" "}
              {formatThaiDateTime(event.start_date, event.start_time)}
            </p>
            <p className="event-card__range">
              <span className="event-card__range-label">วันสุดท้าย :</span>{" "}
              {formatThaiDateTime(event.end_date, event.end_time)}
            </p>
          </div>
        )}
        {event.university && (
          <p className="event-card__university">{event.university}</p>
        )}

        {event.description && (
          <p className="event-card__desc">{event.description}</p>
        )}

        <div className="event-card__tags">
          {event.tcas_round && (
            <span className="chip chip--round">{event.tcas_round}</span>
          )}
          {(event.tags || []).map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        {links.length > 0 && (
          <div className="event-card__links">
            {links.map((l, i) => (
              <a
                key={i}
                className="event-card__link"
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label || (links.length > 1 ? `ลิงก์ ${i + 1}` : "เปิดลิงก์")}
              </a>
            ))}
          </div>
        )}

        {event.submitted_by && (
          <p className="event-card__meta">โดย {event.submitted_by}</p>
        )}
      </div>

      <div className="event-card__actions">
        <button type="button" className="event-card__edit" onClick={() => onEdit(event)}>
          แก้ไข
        </button>
        <button
          type="button"
          className="event-card__delete"
          onClick={() => onDelete(event.id)}
        >
          ลบ
        </button>
      </div>
    </li>
  );
}
