"use client";

import { formatThaiDateRange, formatEventTime, todayKey } from "../lib/dateUtils";

function daysUntil(startKey) {
  const today = todayKey();
  const [ty, tm, td] = today.split("-").map(Number);
  const [sy, sm, sd] = startKey.split("-").map(Number);
  const diffMs = new Date(sy, sm - 1, sd) - new Date(ty, tm - 1, td);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function getUrgency(startKey) {
  const days = daysUntil(startKey);
  if (days < 0) return { label: "ผ่านไปแล้ว", tone: "past" };
  if (days === 0) return { label: "วันนี้", tone: "urgent" };
  if (days <= 3) return { label: `อีก ${days} วัน`, tone: "urgent" };
  if (days <= 7) return { label: `อีก ${days} วัน`, tone: "soon" };
  return null;
}

export default function EventCard({ event, onEdit, onDelete }) {
  const urgency = getUrgency(event.start_date);
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

        <p className="event-card__range">
          {formatThaiDateRange(event.start_date, event.end_date)}
        </p>
        {formatEventTime(event.start_time, event.end_time) && (
          <p className="event-card__time">
            {formatEventTime(event.start_time, event.end_time)}
          </p>
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
