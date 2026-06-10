import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-rose-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-6 md:grid-cols-3 text-sm text-gray-600">
        <div>
          <div className="text-indigo-900 font-serif text-lg font-bold">Tuổi trẻ Xuân Đông</div>
          <p className="mt-2 leading-6">
            Cổng thông tin điện tử của Đoàn TNCS Hồ Chí Minh xã Xuân Đông. Xung kích, tình nguyện, sáng tạo và tiên phong chuyển đổi số.
          </p>
        </div>
        <div className="space-y-2">
          <div className="font-medium text-gray-800">Điều hướng</div>
          <nav className="flex flex-col">
            <Link to="/" className="hover:text-indigo-900">Trang chủ</Link>
            <Link to="/courses" className="hover:text-indigo-900">Thư viện số</Link>
            <Link to="/exhibition" className="hover:text-indigo-900">Sản phẩm thanh niên</Link>
            <Link to="/activities" className="hover:text-indigo-900">Hoạt động Đoàn</Link>
            <Link to="/about" className="hover:text-indigo-900">Về chúng tôi</Link>
          </nav>
        </div>
        <div className="space-y-2">
          <div className="font-medium text-gray-800">Liên hệ</div>
          <div className="flex items-center gap-2">
            <MapPin size={16} /> UBND Xã Xuân Đông
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-500" /> Tuổi trẻ cống hiến
          </div>
        </div>
      </div>
      <div className="border-t border-rose-100 py-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Đoàn Thanh niên Xã Xuân Đông
      </div>
    </footer>
  );
}
