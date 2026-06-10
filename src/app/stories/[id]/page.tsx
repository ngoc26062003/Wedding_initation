"use client";

import { supabase } from "@/lib/supabase";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Heart, MessageCircleHeart, ThumbsUp } from "lucide-react";

type StoryRow = Record<string, unknown>;

type StoryVm = {
  id: string;
  tag: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  coverUrl?: string;
  likeCount: number;
  clapCount: number;
};

function toText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function formatDateVi(value: unknown) {
  const raw = toText(value, "");
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("vi-VN");
}

function toStoryVm(r: StoryRow): StoryVm {
  const id = toText(r.id) || toText(r.story_id) || toText(r.slug) || "unknown";
  const tag = toText(r.tag) || toText(r.category) || "Câu chuyện";
  const title = toText(r.title) || "Câu chuyện";
  const content = toText(r.content) || toText(r.body) || toText(r.description) || "";
  const excerpt =
    toText(r.excerpt) ||
    toText(r.summary) ||
    (content.slice(0, 180) ? `${content.slice(0, 180)}...` : "");
  const author =
    toText(r.author) ||
    toText(r.author_name) ||
    toText(r.author_full_name) ||
    toText(r.author_id) ||
    "Ẩn danh";
  const date = formatDateVi(r.created_at || r.date) || "";
  const coverUrl =
    toText(r.cover_url) ||
    toText(r.image_url) ||
    toText(r.thumbnail_url) ||
    toText(r.photo_url) ||
    undefined;
  const likeCount =
    toNumber(r.like_count, NaN) ||
    toNumber(r.likes, NaN) ||
    toNumber(r.reaction_like, NaN) ||
    0;
  const clapCount =
    toNumber(r.clap_count, NaN) ||
    toNumber(r.claps, NaN) ||
    toNumber(r.reaction_clap, NaN) ||
    0;

  return { id, tag, title, content, excerpt, author, date, coverUrl, likeCount, clapCount };
}

export default function Page() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id as string;

  const [story, setStory] = useState<StoryVm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [myReaction, setMyReaction] = useState<"like" | "clap" | "love" | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setError(null);
      setStory(null);

      const res = await supabase.from("stories").select("*").eq("id", id).maybeSingle();
      if (cancelled) return;
      if (res.error) {
        setError(res.error.message);
        return;
      }
      if (!res.data) {
        setError("Không tìm thấy câu chuyện.");
        return;
      }

      setStory(toStoryVm(res.data as StoryRow));

      const userRes = await supabase.auth.getUser();
      const user = userRes.data.user;
      if (!user) return;

      const myRes = await supabase
        .from("story_reactions")
        .select("reaction")
        .eq("user_id", user.id)
        .eq("story_id", id)
        .maybeSingle();

      if (!cancelled && !myRes.error && myRes.data) {
        const r = toText((myRes.data as Record<string, unknown>).reaction);
        if (r === "like" || r === "clap" || r === "love") setMyReaction(r);
      }
    }

    load().catch(() => {
      if (!cancelled) setError("Không thể tải dữ liệu câu chuyện.");
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const paragraphs = useMemo(() => {
    const raw = story?.content?.trim() || story?.excerpt?.trim() || "";
    if (!raw) return [];
    return raw
      .split(/\n{2,}/g)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [story]);

  async function setReaction(next: "like" | "clap" | "love") {
    if (busy || !id) return;
    setBusy(true);

    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/stories/${id}`)}`);

      setBusy(false);
      return;
    }

    if (myReaction === next) {
      await supabase
        .from("story_reactions")
        .delete()
        .eq("user_id", user.id)
        .eq("story_id", id);
      setMyReaction(null);
      setBusy(false);
      return;
    }

    await supabase.from("story_reactions").upsert(
      { user_id: user.id, story_id: id, reaction: next },
      { onConflict: "user_id,story_id" },
    );
    setMyReaction(next);
    setBusy(false);
  }

  if (!story && !error) {
    return (
      <div className="px-6 py-8">
        <div className="h-8 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden">
          <div className="h-72 bg-gray-100 animate-pulse" />
          <div className="p-6 space-y-2">
            <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 w-2/3 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mb-5">
        <Link
          to="/stories"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại câu chuyện
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-100 bg-white p-5 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {story ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <article className="rounded-2xl border border-rose-100 bg-white overflow-hidden">
            {story.coverUrl ? (
              <img src={story.coverUrl} alt={story.title} className="h-80 w-full object-cover" />
            ) : (
              <div className="h-80 w-full bg-gradient-to-br from-indigo-900 to-fuchsia-800" />
            )}
            <div className="p-6">
              <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500">
                {story.tag}
              </div>
              <h1 className="mt-2 font-serif text-3xl text-indigo-900">{story.title}</h1>
              <div className="mt-2 text-sm text-gray-600">
                {story.author} · {story.date}
              </div>

              <div className="mt-5 space-y-4 text-[15px] text-gray-700 leading-7">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                ) : (
                  <p>Nội dung sẽ được cập nhật.</p>
                )}
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden">
              <div className="p-5 border-b border-rose-100 font-semibold text-indigo-900">
                Tương tác
              </div>
              <div className="p-5 space-y-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setReaction("like")}
                  className={
                    "w-full inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition " +
                    (myReaction === "like"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-rose-100 bg-white text-gray-700 hover:bg-rose-50")
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Like
                  </span>
                  <span className="text-gray-500">{story.likeCount}</span>
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setReaction("clap")}
                  className={
                    "w-full inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition " +
                    (myReaction === "clap"
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800"
                      : "border-rose-100 bg-white text-gray-700 hover:bg-rose-50")
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Thả cảm xúc
                  </span>
                  <span className="text-gray-500">{story.clapCount}</span>
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setReaction("love")}
                  className={
                    "w-full inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition " +
                    (myReaction === "love"
                      ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800"
                      : "border-rose-100 bg-white text-gray-700 hover:bg-rose-50")
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircleHeart className="h-4 w-4" />
                    Yêu thích
                  </span>
                  <span className="text-gray-500"> </span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden">
              <div className="p-5 border-b border-rose-100 font-semibold text-indigo-900">
                Gợi ý
              </div>
              <div className="p-5 text-sm text-gray-700 leading-6">
                Bạn có thể lưu cảm xúc cho câu chuyện để theo dõi những nội dung truyền cảm hứng nhất cho hành trình khởi nghiệp.
              </div>
              <div className="px-5 pb-5">
                <Link
                  to="/stories"
                  className="inline-flex items-center rounded-xl bg-indigo-900 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-800 transition"
                >
                  Xem thêm câu chuyện
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
