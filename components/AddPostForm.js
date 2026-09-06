"use client";

import { useState } from "react";
import { PLATFORM_META } from "../lib/platformMeta";

export default function AddPostForm({ onSubmit }) {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [preview, setPreview] = useState(null); // null | "loading" | { platform, title, image, siteName }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function fetchPreview() {
    const clean = url.trim();
    if (!clean) return;
    setPreview("loading");
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(clean)}`);
      const data = await res.json();
      setPreview(data);
    } catch {
      setPreview({ platform: "other", title: null, image: null, siteName: null, ok: false });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const clean = url.trim();
    if (!clean) {
      setError("ใส่ลิงก์ก่อนนะ");
      return;
    }

    let finalPreview = preview;
    if (!finalPreview || finalPreview === "loading") {
      setSubmitting(true);
      try {
        const res = await fetch(`/api/link-preview?url=${encodeURIComponent(clean)}`);
        finalPreview = await res.json();
      } catch {
        finalPreview = { platform: "other", title: null, image: null };
      }
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        url: clean,
        platform: finalPreview?.platform || "other",
        title: finalPreview?.title || null,
        image_url: finalPreview?.image || null,
        description: description.trim() || null,
        submitted_by: submittedBy.trim() || null,
      });
      setUrl("");
      setDescription("");
      setPreview(null);
    } catch {
      setError("โพสต์ไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  const showPreviewCard = preview && preview !== "loading";
  const meta = showPreviewCard ? PLATFORM_META[preview.platform] || PLATFORM_META.other : null;

  return (
    <form className="board__composer" onSubmit={handleSubmit}>
      <label className="form__label">
        แปะลิงก์ตรงนี้ (YouTube, Instagram, TikTok, หรือลิงก์อะไรก็ได้)
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setPreview(null);
          }}
          onBlur={fetchPreview}
          placeholder="https://..."
        />
      </label>

      {preview === "loading" && (
        <p className="board__preview-loading">กำลังโหลดตัวอย่างลิงก์...</p>
      )}

      {showPreviewCard && (
        <div className="board__preview">
          {preview.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.image} alt="" className="board__preview-thumb" />
          )}
          <div className="board__preview-body">
            <span className="board-post__platform-badge">
              {meta.icon} {meta.label}
            </span>
            <p className="board__preview-title">
              {preview.title || "ดูตัวอย่างไม่ได้ แต่โพสต์ลิงก์นี้ได้ตามปกติ"}
            </p>
          </div>
        </div>
      )}

      <label className="form__label">
        คำอธิบายใต้โพสต์ (ถ้ามี)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="บอกเพื่อนหน่อยว่าคลิปนี้เกี่ยวกับอะไร..."
        />
      </label>

      <label className="form__label">
        ชื่อผู้โพสต์ (ถ้าไม่อยากใส่ก็ข้ามได้)
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
          {submitting ? "กำลังโพสต์..." : "แชร์ลงบอร์ด 📌"}
        </button>
      </div>
    </form>
  );
}
