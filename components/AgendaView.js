"use client";

import EventCard from "./EventCard";
import { formatThaiDate } from "../lib/dateUtils";

export default function AgendaView({ events, onEdit, onDelete }) {
  if (events.length === 0) {
    return <p className="empty-note">ไม่พบกำหนดการที่ตรงกับตัวกรอง</p>;
  }

  const sorted = [...events].sort((a, b) =>
    a.start_date < b.start_date ? -1 : a.start_date > b.start_date ? 1 : 0
  );

  const groups = [];
  for (const ev of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.dateKey === ev.start_date) {
      last.items.push(ev);
    } else {
      groups.push({ dateKey: ev.start_date, items: [ev] });
    }
  }

  return (
    <div className="agenda">
      {groups.map((group) => (
        <div className="agenda__group" key={group.dateKey}>
          <h3 className="agenda__date">{formatThaiDate(group.dateKey)}</h3>
          <ul className="event-list">
            {group.items.map((ev) => (
              <EventCard key={ev.id} event={ev} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
