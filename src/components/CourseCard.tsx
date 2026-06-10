"use client";

import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { ReactNode, useState } from "react";

type CourseCardProps = {
  courseId?: string;
  tag: string;
  title: string;
  lessons: number;
  hours: string;
  free?: boolean;
  rating?: string;
  students?: string;
  progress?: number;
  badge?: string;
  headerGradient?: string;
  icon: ReactNode;
  description?: string;
  ctaText?: string;
};

export default function CourseCard({
  courseId,
  tag,
  title,
  lessons,
  hours,
  free = true,
  rating = "★★★★★",
  students = "",
  progress = 0,
  badge,
  headerGradient = "from-indigo-50 to-rose-50",
  icon,
  description,
  ctaText = "Đăng ký",
}: CourseCardProps) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onEnroll() {
    if (busy) return;
    if (!courseId) {
      navigate("/courses");
      return;
    }

    setBusy(true);
    setStatus(null);

    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/courses/${courseId}`)}`);
      setBusy(false);
      return;
    }

    const insertRes = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_id: courseId })
      .select("id")
      .maybeSingle();

    if (insertRes.error) {
      const anyErr = insertRes.error as unknown as { code?: string; message: string };
      if (anyErr.code === "23505") {
        setStatus("Bạn đã đăng ký khóa học này.");
      } else {
        setStatus(anyErr.message || "Không thể đăng ký. Vui lòng thử lại.");
      }
      setBusy(false);
      return;
    }

    setStatus("Đăng ký thành công.");
    setBusy(false);
  }

  return (
    <div className="rounded-xl border border-rose-100 bg-white overflow-hidden hover:shadow-md transition">
      <div
        className={
          "h-24 flex items-center justify-center text-3xl relative bg-gradient-to-br " +
          headerGradient
        }
      >
        {badge ? (
          <span className="absolute left-2 top-2 text-[10px] font-semibold tracking-wide uppercase bg-white/90 text-indigo-900 rounded px-2 py-0.5">
            {badge}
          </span>
        ) : null}
        <div className="text-gray-700">{icon}</div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div className="text-[10px] font-semibold tracking-wide uppercase text-rose-500">
          {tag}
        </div>
        <div className="font-serif text-indigo-900 text-base font-semibold leading-snug">
          {title}
        </div>
        {description ? (
          <div className="text-xs text-gray-600 leading-5">{description}</div>
        ) : null}
        <div className="flex flex-wrap gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            {lessons} bài
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            {hours}
          </span>
          <span
            className={
              "text-[10px] px-2 py-0.5 rounded " +
              (free ? "bg-rose-50 text-rose-700" : "bg-gray-100 text-gray-600")
            }
          >
            {free ? "Miễn phí" : "Trả phí"}
          </span>
        </div>
        <div className="h-1 bg-gray-100 rounded">
          <div
            className="h-full rounded bg-gradient-to-r from-rose-400 to-indigo-400"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
        <div className="mt-auto flex items-center justify-between text-[11px] text-gray-500">
          <span>
            <span className="text-yellow-500">{rating}</span> {students}
          </span>
          <button
            type="button"
            onClick={onEnroll}
            disabled={busy}
            className={
              "inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition " +
              (busy
                ? "bg-indigo-900/70 text-white cursor-not-allowed"
                : "bg-indigo-900 text-white hover:bg-indigo-800")
            }
          >
            {busy ? "Đang xử lý..." : ctaText}
          </button>
        </div>
        {status ? <div className="text-[11px] text-gray-600">{status}</div> : null}
      </div>
    </div>
  );
}
