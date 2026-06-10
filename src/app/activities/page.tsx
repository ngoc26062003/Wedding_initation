"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Newspaper, Users, TrendingUp, UsersRound, Store, Award } from "lucide-react";

type EventRow = Record<string, unknown>;

type EventVm = {
  id: string;
  title: string;
  startAt: string;
  location: string;
  mode: string;
  attendees: number;
  description?: string;
};

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function formatDateTimeVi(value: unknown) {
  const raw = toText(value, "");
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleString("vi-VN");
}

function toEventVm(r: EventRow): EventVm {
  const id = toText(r.id) || toText(r.event_id) || `event-${Math.random().toString(16).slice(2)}`;
  const title = toText(r.title) || "Sự kiện";
  const startAt = formatDateTimeVi(r.start_at || r.startAt || r.date) || "";
  const location = toText(r.location) || toText(r.place) || "Online";
  const mode = toText(r.mode) || (location.toLowerCase().includes("zoom") ? "Online" : "Trực tiếp");
  const attendees = toNumber(r.attendees, 0) || toNumber(r.registration_count, 0) || 0;
  const description = toText(r.description) || toText(r.summary) || undefined;
  return { id, title, startAt, location, mode, attendees, description };
}

export default function Page() {
  const [events, setEvents] = useState<EventVm[] | null>(null);

  const fallbackEvents = useMemo<EventVm[]>(
    () => [
      {
        id: "fallback-e1",
        title: "Hội thảo: Phụ nữ khởi nghiệp trong kỷ nguyên AI",
        startAt: "15/07/2025 09:00",
        location: "Zoom Webinar",
        mode: "Online",
        attendees: 450,
      },
      {
        id: "fallback-e2",
        title: "Workshop: Chụp ảnh sản phẩm bằng điện thoại",
        startAt: "22/07/2025 14:00",
        location: "FHB Hub, TP. Hồ Chí Minh",
        mode: "Trực tiếp",
        attendees: 40,
      },
      {
        id: "fallback-e3",
        title: "Demo Day: Triển lãm số FHB mùa 2 — Ra mắt chính thức",
        startAt: "05/08/2025 08:00",
        location: "Hà Nội & Live Stream",
        mode: "Hybrid",
        attendees: 1200,
      },
    ],
    [],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await supabase.from("events").select("*").order("start_at", { ascending: true }).limit(50);
      if (cancelled) return;
      if (res.error) {
        setEvents([]);
        return;
      }
      setEvents((res.data ?? []).map((r) => toEventVm(r as EventRow)));
    }
    load().catch(() => {
      if (!cancelled) setEvents([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = events && events.length > 0 ? events : fallbackEvents;

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500">
          Dữ liệu cập nhật · Q1/2025
        </div>
        <h1 className="font-serif text-3xl text-indigo-900 mt-1">Hoạt động & Phân tích</h1>
        <p className="mt-2 text-gray-600 max-w-prose leading-7">
          Báo cáo kết quả dự án FHB — For Her Business và danh sách các sự kiện sắp diễn ra.
        </p>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-900/20">
          <UsersRound className="h-6 w-6 text-indigo-300 mb-4" />
          <div className="font-serif text-4xl mb-1">3,248</div>
          <div className="text-xs text-indigo-200 uppercase tracking-wider font-medium">Hộ kinh doanh tham gia</div>
          <div className="text-xs text-emerald-400 mt-3 font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3"/> +12% so với năm trước</div>
        </div>
        <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
          <TrendingUp className="h-6 w-6 text-rose-400 mb-4" />
          <div className="font-serif text-4xl text-indigo-900 mb-1">68%</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Tăng thu nhập trung bình</div>
          <div className="text-xs text-emerald-600 mt-3 font-medium">▲ Tăng 8.2 triệu/tháng</div>
        </div>
        <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
          <Store className="h-6 w-6 text-rose-400 mb-4" />
          <div className="font-serif text-4xl text-indigo-900 mb-1">2,100</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Hộ chuyển lên TMĐT</div>
          <div className="text-xs text-indigo-600 mt-3 font-medium">✨ Chiếm 65% tổng số hộ</div>
        </div>
        <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
          <Award className="h-6 w-6 text-rose-400 mb-4" />
          <div className="font-serif text-4xl text-indigo-900 mb-1">480+</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Mentor đồng hành</div>
          <div className="text-xs text-indigo-600 mt-3 font-medium">♥ Tỷ lệ hài lòng 94%</div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="mb-12 bg-white border border-rose-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-rose-50 bg-rose-50/50">
          <h3 className="font-semibold text-indigo-900 text-sm">📋 Bảng tóm tắt số liệu dự án 2024</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] uppercase tracking-wider text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium">Chỉ số</th>
                <th className="px-6 py-4 font-medium">Trước dự án</th>
                <th className="px-6 py-4 font-medium">Sau dự án</th>
                <th className="px-6 py-4 font-medium">Thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50 text-gray-700">
              <tr className="hover:bg-rose-50/30 transition-colors"><td className="px-6 py-4 font-medium">Thu nhập bình quân (triệu/tháng)</td><td className="px-6 py-4">4.8</td><td className="px-6 py-4 font-semibold text-indigo-900">8.1</td><td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-semibold">+68%</span></td></tr>
              <tr className="hover:bg-rose-50/30 transition-colors"><td className="px-6 py-4 font-medium">Tỷ lệ bán hàng online</td><td className="px-6 py-4">18%</td><td className="px-6 py-4 font-semibold text-indigo-900">65%</td><td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-semibold">+47 điểm</span></td></tr>
              <tr className="hover:bg-rose-50/30 transition-colors"><td className="px-6 py-4 font-medium">Chỉ số kỹ năng số (Thang 10)</td><td className="px-6 py-4">2.1</td><td className="px-6 py-4 font-semibold text-indigo-900">7.4</td><td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">+5.3 điểm</span></td></tr>
              <tr className="hover:bg-rose-50/30 transition-colors"><td className="px-6 py-4 font-medium">Số sản phẩm trưng bày (TB/hộ)</td><td className="px-6 py-4">3.2</td><td className="px-6 py-4 font-semibold text-indigo-900">14.7</td><td className="px-6 py-4"><span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold">+360%</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-serif text-2xl text-indigo-900">Sự kiện sắp tới</h2>
      </div>

      {events === null ? (
        <div className="border border-lav-lt rounded-2xl overflow-hidden divide-y divide-lav-lt bg-white">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="p-6">
              <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              <div className="mt-2 h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-lav-lt rounded-2xl overflow-hidden divide-y divide-lav-lt bg-white">
          {items.map((ev) => (
            <div key={ev.id} className="flex items-start gap-6 p-6 hover:bg-ivory transition-colors">
              <div className="w-14 h-14 rounded-xl bg-navy-lt flex flex-col items-center justify-center flex-shrink-0">
                <CalendarDays className="h-5 w-5 text-navy" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-dark">{ev.title}</h4>
                <div className="mt-1 text-xs text-muted flex flex-wrap gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {ev.startAt}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {ev.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {ev.attendees.toLocaleString("vi-VN")} người quan tâm
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Newspaper className="h-3.5 w-3.5" />
                    {ev.mode}
                  </span>
                </div>
                {ev.description ? (
                  <div className="mt-2 text-sm text-gray-600 leading-6">
                    {ev.description}
                  </div>
                ) : null}
              </div>
              <span className="px-4 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap bg-lav-lt text-navy">
                {ev.mode}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
