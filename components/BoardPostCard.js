"use client";

import { PLATFORM_META, formatRelativeTime } from "../lib/platformMeta";

export default function BoardPostCard({ post, onDelete }) {
  const meta = PLATFORM_META[post.platform] || PLATFORM_META.other;

  return (
    <li className="board-post">
      <a href={post.url} target="_blank" rel="noopener noreferrer" className="board-post__link">
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image_url} alt="" className="board-post__thumb" />
        ) : (
          <div className="board-post__thumb board-post__thumb--placeholder">
            <span aria-hidden>{meta.icon}</span>
          </div>
        )}

        <div className="board-post__body">
          <span className="board-post__platform-badge">
            {meta.icon} {meta.label}
          </span>
          <p className="board-post__title">{post.title || post.url}</p>
        </div>
      </a>

      {post.description && <p className="board-post__desc">{post.description}</p>}

      <div className="board-post__footer">
        <span className="board-post__meta">
          {post.submitted_by ? `${post.submitted_by} · ` : ""}
          {formatRelativeTime(post.created_at)}
        </span>
        <button
          type="button"
          className="board-post__delete"
          onClick={() => onDelete(post.id)}
        >
          ลบ
        </button>
      </div>
    </li>
  );
}
