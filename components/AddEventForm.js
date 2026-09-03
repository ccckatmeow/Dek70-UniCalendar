"use client";

import { useState } from "react";
import { TCAS_ROUNDS, EVENT_COLORS, DEFAULT_EVENT_COLOR } from "../lib/dateUtils";

function initLinks(ev) {
  if (ev?.links && ev.links.length > 0) {
    return ev.links.map((l) => ({ label: l.label || "", url: l.url || "" }));
  }
  if (ev?.link_url) {
    return [{ label: "", url: ev.link_url }];
  }
  return [{ label: "", url: "" }];
}

export default function AddEventForm({
  defaultDate,
  knownUniversities,
  initialEvent,
  onSubmit,
  onCancel,
}) {
  const isEditing = Boolean(initialEvent);

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(initialEvent?.description || "");
  const [links, setLinks] = useState(() => initLinks(initialEvent));
  const [startDate, setStartDate] = useState(initialEvent?.start_date || defaultDate);
  const [endDate, setEndDate] = useState(initialEvent?.end_date || defaultDate);
  const [startTime, setStartTime] = useState(
    initialEvent?.start_time ? initialEvent.start_time.slice(0, 5) : ""
  );
  const [endTime, setEndTime] = useState(
    initialEvent?.end_time ? initialEvent.end_time.slice(0, 5) : ""
  );
  const [university, setUniversity] = useState(initialEvent?.university || "");
  const [tcasRound, setTcasRound] = useState(initialEvent?.tcas_round || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(initialEvent?.tags || []);
  const [submittedBy, setSubmittedBy] = useState(initialEvent?.submitted_by || "");
  const [color, setColor] = useState(initialEvent?.color || DEFAULT_EVENT_COLOR);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addTagFromInput() {
    const clean = tagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  }

  function handleTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagFromInput();
    }
  }

  function removeTag(tag) {
    setTags(tags.filter((t) => t !== tag));
  }

  function updateLink(idx, field, value) {
    setLinks(links.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  }

  function addLinkRow() {
    setLinks([...links, { label: "", url: "" }]);
  }

  function removeLinkRow(idx) {
    setLinks(links.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("กรุณาใส่ชื่อกำหนดการ");
      return;
    }
    if (!startDate || !endDate) {
      setError("กรุณาใส่วันที่เริ่มและวันที่จบ");
      return;
    }
    if (endDate < startDate) {
      setError("วันที่จบต้องไม่ก่อนวันที่เริ่ม");
      return;
    }
    setSubmitting(true);
    setError("");

    const cleanLinks = links
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.url);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        links: cleanLinks,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime || null,
        end_time: endTime || null,
        university: university.trim() || null,
        tcas_round: tcasRound || null,
        tags,
        submitted_by: submittedBy.trim() || null,
        color,
      });
      if (!isEditing) {
        setTitle("");
        setDescription("");
        setLinks([{ label: "", url: "" }]);
        setStartDate(defaultDate);
        setEndDate(defaultDate);
        setStartTime("");
        setEndTime("");
        setUniversity("");
        setTcasRound("");
        setTags([]);
        setTagInput("");
        setColor(DEFAULT_EVENT_COLOR);
      }
    } catch (err) {
      setError("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
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

      <div className="form__row">
        <label className="form__label">
          วันที่เริ่ม
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              const val = e.target.value;
              setStartDate(val);
              if (endDate < val) setEndDate(val);
            }}
          />
        </label>
        <label className="form__label">
          วันที่จบ
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      <div className="form__row">
        <label className="form__label">
          เวลาเริ่ม (ถ้ามี)
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label className="form__label">
          เวลาสิ้นสุด (ถ้ามี)
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>

      <div className="form__row">
        <label className="form__label">
          มหาวิทยาลัย (ถ้ามี)
          <input
            type="text"
            list="university-options"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="เช่น จุฬาลงกรณ์มหาวิทยาลัย"
          />
          <datalist id="university-options">
            {knownUniversities.map((u) => (
              <option value={u} key={u} />
            ))}
          </datalist>
        </label>
        <label className="form__label">
          TCAS รอบ (ถ้ามี)
          <select value={tcasRound} onChange={(e) => setTcasRound(e.target.value)}>
            <option value="">ไม่ระบุ</option>
            {TCAS_ROUNDS.map((r) => (
              <option value={r} key={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form__label">
        แท็ก (พิมพ์แล้วกด Enter หรือ , เพื่อเพิ่ม)
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTagFromInput}
          placeholder="เช่น วิศวกรรม, ต้องสัมภาษณ์"
        />
      </label>
      {tags.length > 0 && (
        <div className="tag-editor">
          {tags.map((tag) => (
            <span className="chip chip--removable" key={tag}>
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`ลบแท็ก ${tag}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <label className="form__label">
        รายละเอียด (ถ้ามี)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="รายละเอียดเพิ่มเติม"
        />
      </label>

      <div className="form__label">
        ลิงก์ที่เกี่ยวข้อง (ใส่ได้หลายลิงก์)
        {links.map((link, idx) => (
          <div className="link-row" key={idx}>
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(idx, "label", e.target.value)}
              placeholder="ป้ายกำกับ เช่น ระเบียบการ"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateLink(idx, "url", e.target.value)}
              placeholder="https://..."
            />
            {links.length > 1 && (
              <button
                type="button"
                className="link-row__remove"
                onClick={() => removeLinkRow(idx)}
                aria-label="ลบลิงก์นี้"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button type="button" className="link-add-btn" onClick={addLinkRow}>
          + เพิ่มลิงก์
        </button>
      </div>

      <label className="form__label">
        สีของกำหนดการ
        <div className="color-picker">
          {EVENT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`color-swatch ${color === c ? "color-swatch--active" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={`เลือกสี ${c}`}
            />
          ))}
        </div>
      </label>

      <label className="form__label">
        ชื่อผู้บันทึก (ถ้าไม่อยากใส่ก็ข้ามได้)
        <input
          type="text"
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          placeholder="เช่น มิ้น"
        />
      </label>

      {error && <p className="status-note status-note--error">{error}</p>}

      <div className="form__actions">
        <button className="form__submit" type="submit" disabled={submitting}>
          {submitting
            ? "กำลังบันทึก..."
            : isEditing
            ? "บันทึกการแก้ไข"
            : "เพิ่มกำหนดการ"}
        </button>
        {isEditing && onCancel && (
          <button type="button" className="form__cancel" onClick={onCancel}>
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
