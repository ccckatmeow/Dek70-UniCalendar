"use client";

import EventCard from "./EventCard";
import AddEventForm from "./AddEventForm";
import { formatThaiDate } from "../lib/dateUtils";

export default function DayPanel({
  dateKey,
  events,
  knownUniversities,
  editingEvent,
  onEdit,
  onCancelEdit,
  onSubmit,
  onDelete,
}) {
  return (
    <div className="panel">
      <h2 className="panel__date">{formatThaiDate(dateKey)}</h2>

      {events.length === 0 ? (
        <p className="empty-note">ยังไม่มีกำหนดการในวันนี้</p>
      ) : (
        <ul className="event-list">
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}

      <h3 className="panel__subheading">
        {editingEvent ? "แก้ไขกำหนดการ" : "เพิ่มกำหนดการใหม่"}
      </h3>
      <AddEventForm
        key={editingEvent ? `edit-${editingEvent.id}` : `add-${dateKey}`}
        defaultDate={dateKey}
        knownUniversities={knownUniversities}
        initialEvent={editingEvent}
        onSubmit={onSubmit}
        onCancel={onCancelEdit}
      />
    </div>
  );
}
