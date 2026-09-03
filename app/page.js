"use client";

import { useEffect, useState, useCallback } from "react";
import Calendar from "../components/Calendar";
import DayPanel from "../components/DayPanel";
import { supabase } from "../lib/supabaseClient";

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function Home() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
  );
  const [eventsByDate, setEventsByDate] = useState({});
  const [loadError, setLoadError] = useState("");

  const loadMonth = useCallback(async (y, m) => {
    const rangeStart = `${y}-${pad(m + 1)}-01`;
    const lastDay = new Date(y, m + 1, 0).getDate();
    const rangeEnd = `${y}-${pad(m + 1)}-${pad(lastDay)}`;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", rangeStart)
      .lte("event_date", rangeEnd)
      .order("created_at", { ascending: true });

    if (error) {
      setLoadError("โหลดข้อมูลไม่สำเร็จ ตรวจสอบการตั้งค่า Supabase");
      return;
    }
    setLoadError("");

    const grouped = {};
    for (const ev of data) {
      const key = ev.event_date;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(ev);
    }
    setEventsByDate(grouped);
  }, []);

  useEffect(() => {
    loadMonth(year, month);
  }, [year, month, loadMonth]);

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

  async function handleAdd(eventData) {
    const { error } = await supabase.from("events").insert({
      event_date: selectedDate,
      ...eventData,
    });
    if (error) throw error;
    await loadMonth(year, month);
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      setLoadError("ลบไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    await loadMonth(year, month);
  }

  const eventCounts = Object.fromEntries(
    Object.entries(eventsByDate).map(([key, list]) => [key, list.length])
  );
  const selectedEvents = eventsByDate[selectedDate] || [];

  return (
    <main className="page">
      <header className="masthead">
        <p className="masthead__eyebrow">ปฏิทินรวมกำหนดการ</p>
        <h1 className="masthead__title">กำหนดการเข้ามหาวิทยาลัย</h1>
      </header>

      {loadError && <p className="status-note status-note--error">{loadError}</p>}

      <Calendar
        year={year}
        month={month}
        eventCounts={eventCounts}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onPrevMonth={goPrevMonth}
        onNextMonth={goNextMonth}
      />

      <DayPanel
        dateKey={selectedDate}
        events={selectedEvents}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
    </main>
  );
}
