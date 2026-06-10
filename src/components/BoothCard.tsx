"use client";

import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { Heart, HeartOff, MapPin } from "lucide-react";
import { ReactNode, useState } from "react";

type BoothCardProps = {
  boothId?: string;
  title?: string;
  name?: string;
  owner: string;
  region?: string;
  category: string;
  gradient?: string;
  icon: ReactNode;
  liked?: boolean;
  imageUrl?: string;
  href?: string;
};

export default function BoothCard({
  boothId,
  title,
  name,
  owner,
  region,
  category,
  gradient = "from-rose-50 to-indigo-50",
  icon,
  liked = false,
  imageUrl,
  href,
}: BoothCardProps) {
  const navigate = useNavigate();
  const [isLiked, setLiked] = useState(liked);
  const [busy, setBusy] = useState(false);
  const displayTitle = title ?? name ?? "";
  const displayRegion = region ?? "";

  async function toggleLike() {
    if (busy) return;
    if (!boothId) {
      setLiked((v) => !v);
      return;
    }

    setBusy(true);
    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/exhibition/${boothId}`)}`);
      setBusy(false);
      return;
    }

    if (isLiked) {
      await supabase
        .from("booth_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("booth_id", boothId);
      setLiked(false);
      setBusy(false);
      return;
    }

    await supabase.from("booth_likes").insert({ user_id: user.id, booth_id: boothId });
    setLiked(true);
    setBusy(false);
  }
  return (
    <div className="rounded-xl border border-rose-100 bg-white overflow-hidden shadow-sm hover:shadow transition">
      <div
        className={
          "h-40 flex items-center justify-center text-5xl relative bg-gradient-to-br " +
          gradient
        }
      >
        <button
          type="button"
          onClick={toggleLike}
          disabled={busy}
          className={
            "absolute right-3 top-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow transition " +
            (busy ? "cursor-not-allowed opacity-70" : "text-rose-500 hover:scale-105")
          }
          aria-label="like"
        >
          {isLiked ? <Heart size={18} fill="currentColor" /> : <HeartOff size={18} />}
        </button>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayTitle}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div
          className={
            "absolute inset-0 bg-gradient-to-br opacity-80 " + gradient
          }
        />
        <div className="relative text-gray-700">{icon}</div>
      </div>
      <div className="p-3">
        <div className="text-[10px] font-semibold tracking-wide uppercase text-rose-500">
          {category}
        </div>
        <div className="font-serif text-indigo-900 text-base font-semibold">
          {displayTitle}
        </div>
        <div className="text-xs text-gray-500">Chủ hộ: {owner}</div>
      </div>
      <div className="flex items-center justify-between border-t border-rose-100 p-3 text-xs text-gray-500">
        {displayRegion ? (
          <div className="inline-flex items-center gap-1">
            <MapPin size={14} />
            {displayRegion}
          </div>
        ) : (
          <span />
        )}
        {href ? (
          <Link
            to={href}
            className="inline-flex items-center rounded-md bg-indigo-900 text-white px-3 py-1 text-xs font-medium hover:bg-indigo-800"
          >
            Xem chi tiết
          </Link>
        ) : (
          <button className="inline-flex items-center rounded-md bg-indigo-900 text-white px-3 py-1 text-xs font-medium hover:bg-indigo-800">
            Xem chi tiết
          </button>
        )}
      </div>
    </div>
  );
}
