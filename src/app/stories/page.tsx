"use client";

import StoryPanel from "@/components/StoryPanel";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { Flower2, Palette, Sprout, Wheat } from "lucide-react";

type StoryRow = Record<string, unknown>;

type StoryVm = {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  reactions: { like: number; clap: number };
  coverUrl?: string;
};

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return value;
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
  const id =
    toText(r.id) ||
    toText(r.story_id) ||
    toText(r.slug) ||
    `story-${Math.random().toString(16).slice(2)}`;
  const tag = toText(r.tag) || toText(r.category) || "Câu chuyện";
  const title = toText(r.title) || "Câu chuyện";
  const excerpt =
    toText(r.excerpt) ||
    toText(r.summary) ||
    (toText(r.content).slice(0, 140) ? `${toText(r.content).slice(0, 140)}...` : "") ||
    "Nội dung sẽ được cập nhật.";
  const author =
    toText(r.author) ||
    toText(r.author_name) ||
    toText(r.author_full_name) ||
    toText(r.author_id) ||
    "Ẩn danh";
  const date = formatDateVi(r.created_at || r.date) || "";

  const like =
    toNumber(r.like_count, NaN) ||
    toNumber(r.likes, NaN) ||
    toNumber(r.reaction_like, NaN) ||
    0;
  const clap =
    toNumber(r.clap_count, NaN) ||
    toNumber(r.claps, NaN) ||
    toNumber(r.reaction_clap, NaN) ||
    0;

  const coverUrl =
    toText(r.cover_url) ||
    toText(r.image_url) ||
    toText(r.thumbnail_url) ||
    toText(r.photo_url) ||
    undefined;

  return { id, tag, title, excerpt, author, date, reactions: { like, clap }, coverUrl };
}

function storyVisual(tag: string) {
  const t = tag.toLowerCase();
  if (t.includes("thành") || t.includes("success")) {
    return { icon: <Flower2 className="w-10 h-10" />, gradient: "from-indigo-900 to-fuchsia-700" };
  }
  if (t.includes("chuyển") || t.includes("số") || t.includes("digital")) {
    return { icon: <Wheat className="w-10 h-10" />, gradient: "from-emerald-900 to-teal-800" };
  }
  if (t.includes("thủ") || t.includes("craft")) {
    return { icon: <Palette className="w-10 h-10" />, gradient: "from-fuchsia-900 to-violet-800" };
  }
  return { icon: <Sprout className="w-10 h-10" />, gradient: "from-indigo-900 to-fuchsia-800" };
}

export default function Page() {
  const [stories, setStories] = useState<StoryVm[] | null>(null);

  const fallbackStories = useMemo<StoryVm[]>(
    () => [
      {
        id: "fallback-s1",
        tag: "Thành công",
        title: "Từ gian bếp nhỏ đến cửa hàng online 5 sao tại Hà Nội",
        excerpt:
          "Chị Nguyễn Thị Mai tăng doanh thu 3 lần sau 6 tháng tham gia FHB, học kỹ năng bán hàng đa kênh trực tuyến...",
        author: "Nguyễn Thị Mai",
        date: "12/06/2025",
        reactions: { like: 128, clap: 64 },
      },
      {
        id: "fallback-s2",
        tag: "Chuyển đổi số",
        title: "Nông sản Tây Nguyên lên sàn TMĐT: Hành trình 100 ngày",
        excerpt:
          "Nhóm 20 phụ nữ Ê Đê đưa cà phê đặc sản lên Shopee và TikTok Shop, tạo doanh thu ổn định mỗi tháng...",
        author: "H'Bia Niê",
        date: "05/06/2025",
        reactions: { like: 94, clap: 41 },
      },
      {
        id: "fallback-s3",
        tag: "Thủ công mỹ nghệ",
        title: "Nghề dệt thổ cẩm truyền thống được hồi sinh qua kênh số",
        excerpt:
          "FHB kết nối nghệ nhân Hội An với khách hàng quốc tế qua nền tảng triển lãm số, giữ gìn bản sắc văn hóa...",
        author: "Sùng Thị Mỷ",
        date: "01/06/2025",
        reactions: { like: 211, clap: 88 },
      },
    ],
    [],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await supabase.from("stories").select("*").limit(24);
      if (cancelled) return;
      if (res.error) {
        setStories([]);
        return;
      }
      setStories((res.data ?? []).map((r) => toStoryVm(r as StoryRow)));
    }
    load().catch(() => {
      if (!cancelled) setStories([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = stories && stories.length > 0 ? stories : fallbackStories;

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500">
            Câu chuyện truyền cảm hứng
          </div>
          <h1 className="font-serif text-3xl text-indigo-900">
            Những hành trình đáng nhớ
          </h1>
        </div>
      </div>

      {stories === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-rose-100 bg-white overflow-hidden"
            >
              <div className="aspect-[16/8] bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => {
            const v = storyVisual(s.tag);
            return (
              <StoryPanel
                key={s.id}
                storyId={s.id}
                tag={s.tag}
                title={s.title}
                excerpt={s.excerpt}
                author={s.author}
                date={s.date}
                icon={v.icon}
                gradient={v.gradient}
                reactions={s.reactions}
                coverUrl={s.coverUrl}
                href={`/stories/${s.id}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
