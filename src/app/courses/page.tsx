"use client";

import { Link, Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, Star, Play } from "lucide-react";

type CourseVm = {
  id: string;
  title: string;
  tag: string;
  description: string;
  lessonsCount: number;
  duration: string;
  students: number;
  rating: number;
  emoji: string;
  gradient: string;
  imageUrl?: string;
};

export default function Page() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filters = ["Tất cả", "Hướng dẫn", "Lệ phí"];

  const courses = useMemo<CourseVm[]>(
    () => [
      {
        id: "x_-gWKYVAwM",
        tag: "Hướng dẫn",
        title: "Hướng dẫn đăng ký kết hôn trực tuyến MỚI NHẤT 2026",
        description: "Quy trình nộp hồ sơ xin cấp giấy chứng nhận kết hôn trực tuyến trên Cổng DVC.",
        lessonsCount: 1,
        duration: "10 phút",
        students: 104,
        rating: 5.0,
        emoji: "💕",
        gradient: "from-rose-100 to-amber-50",
        imageUrl: "https://i.ytimg.com/vi/x_-gWKYVAwM/hqdefault.jpg"
      },
      {
        id: "7Qfjr-MPZ-8",
        tag: "Hướng dẫn",
        title: "Hướng dẫn đổi giấy phép lái xe ô tô online MỚI NHẤT",
        description: "Hướng dẫn chi tiết cách nộp hồ sơ đổi giấy phép lái xe ô tô trực tuyến nhanh chóng.",
        lessonsCount: 1,
        duration: "8 phút",
        students: 291000,
        rating: 4.8,
        emoji: "🚗",
        gradient: "from-blue-100 to-indigo-100",
        imageUrl: "https://i.ytimg.com/vi/7Qfjr-MPZ-8/hqdefault.jpg"
      },
      {
        id: "JBHfnwni0hI",
        tag: "Lệ phí",
        title: "Hướng cập nhật số tài khoản ngân hàng lên VNeID",
        description: "Cách liên kết tài khoản ngân hàng vào ứng dụng VNeID để nhận các khoản trợ cấp an sinh xã hội.",
        lessonsCount: 1,
        duration: "5 phút",
        students: 56,
        rating: 4.9,
        emoji: "🏦",
        gradient: "from-emerald-100 to-teal-100",
        imageUrl: "https://i.ytimg.com/vi/JBHfnwni0hI/hqdefault.jpg"
      },
      {
        id: "g0yPx1KwfMg",
        tag: "Hướng dẫn",
        title: "Hướng dẫn Đăng ký tạm trú trên Cổng Dịch vụ công năm 2026",
        description: "Thao tác đăng ký tạm trú trực tuyến cho công dân đến nơi ở mới mà không cần ra công an phường/xã.",
        lessonsCount: 1,
        duration: "12 phút",
        students: 6800,
        rating: 4.7,
        emoji: "🏠",
        gradient: "from-orange-100 to-rose-100",
        imageUrl: "https://i.ytimg.com/vi/g0yPx1KwfMg/hqdefault.jpg"
      },
      {
        id: "Ms0oBxQH0ds",
        tag: "Hướng dẫn",
        title: "Hướng dẫn tải app và sử dụng Viettel Money",
        description: "Cách cài đặt và sử dụng các tính năng cơ bản trên ứng dụng Viettel Money.",
        lessonsCount: 1,
        duration: "12 phút",
        students: 8100,
        rating: 4.8,
        emoji: "📱",
        gradient: "from-red-100 to-rose-100",
        imageUrl: "https://i.ytimg.com/vi/Ms0oBxQH0ds/hqdefault.jpg"
      }
    ],
    []
  );

  const filteredCourses = courses.filter((c) => {
    const matchFilter = activeFilter === "Tất cả" || c.tag === activeFilter;
    const matchSearch = (c.title || "").toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Trang đang rỗng, tự động chuyển hướng về trang chủ
  return <Navigate to="/" replace />;

  /* return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500">Thư viện số</div>
        <h1 className="font-serif text-3xl text-indigo-900 mt-2">Video Hướng dẫn Dịch vụ công trực tuyến</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, thủ tục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-rose-100 bg-white text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all"
          />
        </div>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeFilter === f ? "bg-rose-500 border-rose-500 text-white" : "bg-white border-rose-100 text-gray-600 hover:bg-rose-50"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((c) => (
          <Link to={`/courses/${c.id}`} key={c.id} className="group flex flex-col bg-white rounded-2xl border border-rose-100 overflow-hidden hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 hover:-translate-y-1">
            <div className={`h-32 flex items-center justify-center text-5xl relative overflow-hidden bg-gradient-to-br ${c.gradient}`}>
                <span className="z-0 drop-shadow-sm">{c.emoji}</span>
                {c.imageUrl && <img src={c.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10" onError={(e) => e.currentTarget.style.display = 'none'} />}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"><Play className="w-5 h-5 text-white fill-white ml-1" /></div>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="text-[10px] font-semibold text-rose-500 tracking-wider uppercase mb-2">{c.tag}</div>
              <h3 className="font-serif text-lg font-bold text-indigo-900 leading-tight mb-2 group-hover:text-rose-600 transition-colors">{c.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-2 mb-4 flex-1 leading-relaxed">{c.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-medium">{c.lessonsCount} bước</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-medium">{c.duration}</span>
                <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-md text-[10px] font-medium">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-rose-50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-700">{c.rating}</span>
                  <span>({c.students.toLocaleString("vi-VN")})</span>
                </div>
                <span className="text-xs font-semibold text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg group-hover:bg-indigo-900 group-hover:text-white transition-colors">Xem Video</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ); */
}