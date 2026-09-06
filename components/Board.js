"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AddPostForm from "./AddPostForm";
import BoardPostCard from "./BoardPostCard";

export default function Board() {
  const [posts, setPosts] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const loadPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("board_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setLoadError(
        "โหลดบอร์ดไม่สำเร็จ — ตรวจสอบว่ารัน supabase/board_schema.sql แล้วหรือยัง"
      );
      return;
    }
    setLoadError("");
    setPosts(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handlePostSubmit(postData) {
    const { error } = await supabase.from("board_posts").insert(postData);
    if (error) throw error;
    await loadPosts();
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("board_posts").delete().eq("id", id);
    if (error) {
      setLoadError("ลบไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    await loadPosts();
  }

  return (
    <div className="board">
      <AddPostForm onSubmit={handlePostSubmit} />

      {loadError && <p className="status-note status-note--error">{loadError}</p>}

      {loaded && posts.length === 0 && !loadError && (
        <p className="empty-note">ยังไม่มีใครแชร์อะไรเลย เป็นคนแรกกันไหม 🥹</p>
      )}

      <ul className="board__feed">
        {posts.map((post) => (
          <BoardPostCard key={post.id} post={post} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}
