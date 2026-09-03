"use client";

import { useState } from "react";

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

function formatThaiDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const buddhistYear = y + 543;
  return `${d} ${MONTH_NAMES[m - 1]} ${buddhistYear}`;
}

export default function DayPanel({ dateKey, events, onAdd, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("กรุณาใส่ชื่อกำหนดการ");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim() || null,
        link_url: linkUrl.trim() || null,
      });
      setTitle("");
      setDescription("");
      setLinkUrl("");
    } catch (err) {
      setError("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <h2 className="panel__date">{formatThaiDate(dateKey)}</h2>

      {events.length === 0 ? (
        <p className="empty-note">ยังไม่มีกำหนดการในวันนี้</p>
      ) : (
        <ul className="event-list">
          {events.map((ev) => (
            <li className="event-item" key={ev.id}>
              <div>
                <p className="event-item__title">{ev.title}</p>
                {ev.description && (
                  <p className="event-item__desc">{ev.description}</p>
                )}
                {ev.link_url && (
                  <a
                    className="event-item__link"
                    href={ev.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    เปิดลิงก์เอกสาร
                  </a>
                )}
              </div>
              <button
                type="button"
                className="event-item__delete"
                onClick={() => onDelete(ev.id)}
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label className="form__label">
          ชื่อกำหนดการ
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น วันสุดท้ายของการยื่นสมัคร TCAS รอบ 2"
          />
        </label>

        <label className="form__label">
          รายละเอียด (ถ้ามี)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="รายละเอียดเพิ่มเติม"
          />
        </label>

        <label className="form__label">
          ลิงก์เอกสาร (ถ้ามี)
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
          />
        </label>

        {error && <p className="status-note status-note--error">{error}</p>}

        <button className="form__submit" type="submit" disabled={submitting}>
          {submitting ? "กำลังบันทึก..." : "เพิ่มกำหนดการ"}
        </button>
      </form>
    </div>
  );
}
