"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Heart } from "lucide-react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Thủ công mỹ nghệ", "Nông sản", "Thực phẩm", "Thời trang"];

  const shops = [
    {
      id: 1,
      category: "Thủ công mỹ nghệ",
      name: "Len Sắc Màu Hội An",
      owner: "Nguyễn Thị Lan",
      desc: "Sản phẩm len thủ công cao cấp kết hợp họa tiết dân tộc truyền thống và thiết kế hiện đại.",
      location: "Quảng Nam",
      emoji: "🧶",
      gradient: "from-orange-100 to-amber-100",
      imageUrl: "https://images.unsplash.com/photo-1531685250784-afb348722080?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      category: "Nông sản đặc sản",
      name: "Cà Phê Buôn Ma Thuột",
      owner: "H'Bia Niê",
      desc: "Cà phê Arabica nguyên chất từ vườn nhà, rang mộc theo phương pháp truyền thống Ê Đê.",
      location: "Đắk Lắk",
      emoji: "☕",
      gradient: "from-emerald-100 to-green-100",
      imageUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 3,
      category: "Mỹ phẩm thiên nhiên",
      name: "Vườn Hoa Đà Lạt",
      owner: "Trần Thị Hương",
      desc: "Serum và tinh dầu chiết xuất từ hoa tươi Đà Lạt, thuần tự nhiên không chứa hóa chất độc hại.",
      location: "Lâm Đồng",
      emoji: "🌸",
      gradient: "from-rose-100 to-pink-100",
      imageUrl: "https://images.unsplash.com/photo-1512496015851-a1c848daae54?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 4,
      category: "Gốm sứ truyền thống",
      name: "Gốm Bát Tràng Gia Truyền",
      owner: "Lê Thị Nhung",
      desc: "Gốm men lam 4 đời, nung bằng củi, hoa văn hoàn toàn thủ công, đạt chứng nhận OCOP 5 sao.",
      location: "Hà Nội",
      emoji: "🎋",
      gradient: "from-blue-100 to-indigo-100",
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0e49be848e?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 5,
      category: "Thực phẩm sạch",
      name: "Bánh Tráng Trảng Bàng",
      owner: "Phạm Thị Kiều",
      desc: "Bánh tráng rế truyền thống phơi sương, nguyên liệu sạch từ ruộng lúa gia đình chứng nhận VietGAP.",
      location: "Tây Ninh",
      emoji: "🍜",
      gradient: "from-amber-100 to-yellow-100",
      imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 6,
      category: "Thời trang dân tộc",
      name: "Thổ Cẩm Sapa Xanh",
      owner: "Sùng Thị Mỷ",
      desc: "Vải thổ cẩm H'Mông dệt tay, nhuộm chàm tự nhiên, ứng dụng kỹ thuật truyền lại từ tổ tiên hơn 300 năm.",
      location: "Lào Cai",
      emoji: "👘",
      gradient: "from-purple-100 to-fuchsia-100",
      imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600&auto=format&fit=crop"
    }
  ];

  const filteredShops = shops.filter(
    (s) => (activeCategory === "Tất cả" || s.category.includes(activeCategory)) &&
           (s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="bg-gradient-to-br from-rose-400 to-indigo-500 px-6 py-16 text-center shadow-inner">
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-white/80 mb-3">Triển lãm số FHB</div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4 drop-shadow-md">Gian hàng khởi nghiệp</h1>
        <p className="text-white/90 max-w-xl mx-auto text-sm md:text-base leading-relaxed">Khám phá hàng nghìn sản phẩm độc đáo, mang đậm bản sắc văn hóa từ những người phụ nữ tài năng trên khắp Việt Nam.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center mb-8 -mt-14 relative z-10">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm gian hàng, sản phẩm, chủ hộ..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-rose-300 transition-colors" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${activeCategory === c ? "bg-indigo-900 border-indigo-900 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-2xl border border-rose-100 overflow-hidden hover:shadow-xl hover:shadow-rose-100/40 transition-all duration-300 group">
              <div className={`h-48 flex items-center justify-center text-6xl relative overflow-hidden bg-gradient-to-br ${shop.gradient}`}>
                <span className="z-0 drop-shadow-sm">{shop.emoji}</span>
                {shop.imageUrl && <img src={shop.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-10" onError={(e) => e.currentTarget.style.display = 'none'} />}
                <button className="absolute top-4 right-4 h-10 w-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-transform hover:scale-110 shadow-sm z-20"><Heart className="h-5 w-5 text-rose-500" /></button>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-bold tracking-wider uppercase text-rose-500 mb-2">{shop.category}</div>
                <h3 className="font-serif text-xl font-bold text-indigo-900 mb-1">{shop.name}</h3>
                <div className="text-xs text-gray-500 mb-3">Chủ hộ: <span className="font-medium text-gray-700">{shop.owner}</span></div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-5 leading-relaxed">{shop.desc}</p>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg"><MapPin className="h-3.5 w-3.5 text-rose-400" />{shop.location}</span>
                  <Link to={`/exhibition/${shop.id}`} className="text-xs font-semibold text-white bg-indigo-900 px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors shadow-sm">Xem gian hàng</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}