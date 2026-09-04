"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Calendar from "../components/Calendar";
import DayPanel from "../components/DayPanel";
import AgendaView from "../components/AgendaView";
import FilterBar from "../components/FilterBar";
import AddEventForm from "../components/AddEventForm";
import ThemeToggle from "../components/ThemeToggle";
import { supabase } from "../lib/supabaseClient";
import { pad, todayKey, buildDayGroups } from "../lib/dateUtils";

const EMPTY_FILTERS = { search: "", university: "", tcasRound: "", tags: [] };

function matchesFilters(ev, filters) {
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const hay = `${ev.title} ${ev.university || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (filters.university && ev.university !== filters.university) return false;
  if (filters.tcasRound && ev.tcas_round !== filters.tcasRound) return false;
  if (filters.tags.length > 0) {
    const evTags = ev.tags || [];
    const hasAll = filters.tags.every((t) => evTags.includes(t));
    if (!hasAll) return false;
  }
  return true;
}

export default function Home() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [view, setView] = useState("calendar"); // "calendar" | "agenda"
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [allEvents, setAllEvents] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  const loadAllEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      setLoadError("โหลดข้อมูลไม่สำเร็จ ตรวจสอบการตั้งค่า Supabase");
      return;
    }
    setLoadError("");
    setAllEvents(data);
  }, []);

  useEffect(() => {
    loadAllEvents();
  }, [loadAllEvents]);

  function goPrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  async function handleFormSubmit(eventData) {
    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update({ ...eventData, updated_at: new Date().toISOString() })
        .eq("id", editingEvent.id);
      if (error) throw error;
      setEditingEvent(null);
    } else {
      const { error } = await supabase.from("events").insert(eventData);
      if (error) throw error;
    }
    await loadAllEvents();
  }

  function handleEditRequest(event) {
    setEditingEvent(event);
  }

  function handleCancelEdit() {
    setEditingEvent(null);
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      setLoadError("ลบไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    if (editingEvent?.id === id) setEditingEvent(null);
    await loadAllEvents();
  }

  const filteredEvents = useMemo(
    () => allEvents.filter((ev) => matchesFilters(ev, filters)),
    [allEvents, filters]
  );

  const knownUniversities = useMemo(() => {
    const set = new Set(allEvents.map((ev) => ev.university).filter(Boolean));
    return Array.from(set).sort();
  }, [allEvents]);

  const knownTags = useMemo(() => {
    const set = new Set();
    for (const ev of allEvents) {
      for (const tag of ev.tags || []) set.add(tag);
    }
    return Array.from(set).sort();
  }, [allEvents]);

  const rangeStart = `${year}-${pad(month + 1)}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const rangeEnd = `${year}-${pad(month + 1)}-${pad(lastDay)}`;

  const eventsByDate = useMemo(
    () => buildDayGroups(filteredEvents, rangeStart, rangeEnd),
    [filteredEvents, rangeStart, rangeEnd]
  );
  const selectedEvents = eventsByDate[selectedDate] || [];

  return (
    <main className="page">
      <header className="masthead">
        <div>
          <p className="masthead__eyebrow">ปฏิทินรวมกำหนดการ</p>
          <h1 className="masthead__title">กำหนดการเข้ามหาวิทยาลัย Dek70 😵‍💫❤️‍🔥</h1>
        </div>
        <ThemeToggle />
      </header>

      <div className="view-toggle">
        <button
          type="button"
          className={view === "calendar" ? "view-toggle__btn--active" : ""}
          onClick={() => setView("calendar")}
        >
          ปฏิทิน
        </button>
        <button
          type="button"
          className={view === "agenda" ? "view-toggle__btn--active" : ""}
          onClick={() => setView("agenda")}
        >
          รายการ
        </button>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        knownUniversities={knownUniversities}
        knownTags={knownTags}
      />

      {loadError && <p className="status-note status-note--error">{loadError}</p>}

      {view === "calendar" ? (
        <>
          <Calendar
            year={year}
            month={month}
            eventsByDate={eventsByDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPrevMonth={goPrevMonth}
            onNextMonth={goNextMonth}
          />
          <DayPanel
            key={selectedDate}
            dateKey={selectedDate}
            events={selectedEvents}
            knownUniversities={knownUniversities}
            editingEvent={editingEvent}
            onEdit={handleEditRequest}
            onCancelEdit={handleCancelEdit}
            onSubmit={handleFormSubmit}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <>
          <AgendaView
            events={filteredEvents}
            onEdit={handleEditRequest}
            onDelete={handleDelete}
          />
          <div className="panel">
            <h2 className="panel__date">
              {editingEvent ? "แก้ไขกำหนดการ" : "เพิ่มกำหนดการใหม่"}
            </h2>
            <AddEventForm
              key={editingEvent ? `edit-${editingEvent.id}` : "add-agenda"}
              defaultDate={todayKey()}
              knownUniversities={knownUniversities}
              initialEvent={editingEvent}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
            />
          </div>
        </>
      )}
    </main>
  );
}
