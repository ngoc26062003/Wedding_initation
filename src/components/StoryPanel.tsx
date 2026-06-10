"use client";

import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircleHeart, ThumbsUp } from "lucide-react";
import { ReactNode } from "react";
import { useMemo, useState } from "react";

type StoryPanelProps = {
  storyId?: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  icon: ReactNode;
  gradient?: string;
  headerGradient?: string;
  reactions?: { like: number; clap: number };
  likes?: number;
  claps?: number;
  coverUrl?: string;
  href?: string;
};

export default function StoryPanel({
  storyId,
  tag,
  title,
  excerpt,
  author,
  date,
  icon,
  gradient = "from-indigo-900 to-fuchsia-800",
  headerGradient,
  reactions,
  likes,
  claps,
  coverUrl,
  href,
}: StoryPanelProps) {
  const g = headerGradient ?? gradient;
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [myReaction, setMyReaction] = useState<"like" | "clap" | "love" | null>(null);

  const likeCount = useMemo(() => likes ?? reactions?.like ?? 0, [likes, reactions?.like]);
  const clapCount = useMemo(() => claps ?? reactions?.clap ?? 0, [claps, reactions?.clap]);

  async function setReaction(next: "like" | "clap" | "love") {
    if (busy) return;
    if (!storyId) return;
    setBusy(true);

    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(href || `/stories/${storyId}`)}`);
      setBusy(false);
      return;
    }

    if (myReaction === next) {
      await supabase
        .from("story_reactions")
        .delete()
        .eq("user_id", user.id)
        .eq("story_id", storyId);
      setMyReaction(null);
      setBusy(false);
      return;
    }

    await supabase.from("story_reactions").upsert(
      { user_id: user.id, story_id: storyId, reaction: next },
      { onConflict: "user_id,story_id" },
    );
    setMyReaction(next);
    setBusy(false);
  }

  return (
    <div className="rounded-xl border border-rose-100 bg-white overflow-hidden hover:shadow-md transition">
      <div
        className={
          "relative w-full aspect-[16/8] flex items-end p-4 bg-gradient-to-br " +
          g
        }
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            loading="lazy"
          />
        ) : null}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 text-6xl text-white">
          {icon}
        </div>
        <div className="relative z-10 text-white space-y-1">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-white/20 rounded px-2 py-0.5">
            {tag}
          </span>
          <div className="font-serif text-lg leading-snug max-w-[36ch]">{title}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-600 leading-6">{excerpt}</div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div>
            {author} · {date}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-1 rounded-md">
              <Heart className="h-3.5 w-3.5" />
              {likeCount}
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
              <ThumbsUp className="h-3.5 w-3.5" />
              {clapCount}
            </span>
          </div>
        </div>

        {storyId ? (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setReaction("like")}
                className={
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition " +
                  (myReaction === "like"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-rose-100 bg-white text-gray-700 hover:bg-rose-50")
                }
              >
                <Heart className="h-4 w-4" />
                Like
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setReaction("clap")}
                className={
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition " +
                  (myReaction === "clap"
                    ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                    : "border-rose-100 bg-white text-gray-700 hover:bg-rose-50")
                }
              >
                <ThumbsUp className="h-4 w-4" />
                Thả cảm xúc
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setReaction("love")}
                className={
                  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition " +
                  (myReaction === "love"
                    ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800"
                    : "border-rose-100 bg-white text-gray-700 hover:bg-rose-50")
                }
              >
                <MessageCircleHeart className="h-4 w-4" />
                Yêu thích
              </button>
            </div>

            {href ? (
              <Link
                to={href}
                className="inline-flex items-center gap-2 text-xs font-medium text-indigo-900 hover:text-rose-500 transition-colors"
              >
                Đọc tiếp →
              </Link>
            ) : null}
          </div>
        ) : href ? (
          <div className="mt-3">
            <Link
              to={href}
              className="inline-flex items-center gap-2 text-xs font-medium text-indigo-900 hover:text-rose-500 transition-colors"
            >
              Đọc tiếp →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
