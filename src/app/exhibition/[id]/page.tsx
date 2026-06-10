"use client";
import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { ArrowLeft, MapPin, MessageCircle, Star, ShoppingCart, Store, CheckCircle2, Image as ImageIcon } from "lucide-react";

const shops = [
  {
    id: 1,
    category: "Thủ công mỹ nghệ",
    name: "Len Sắc Màu Hội An",
    owner: "Nguyễn Thị Lan",
    desc: "Sản phẩm len thủ công cao cấp kết hợp họa tiết dân tộc truyền thống và thiết kế hiện đại. Mỗi sản phẩm đều được đan tay tỉ mỉ với tình yêu và niềm đam mê mãnh liệt dành cho sợi len.",
    location: "Quảng Nam",
    emoji: "🧶",
    gradient: "from-orange-100 to-amber-100",
    bgBanner: "from-orange-400 to-amber-500",
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
    bgBanner: "from-emerald-500 to-green-600",
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
    bgBanner: "from-rose-400 to-pink-500",
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
    bgBanner: "from-blue-500 to-indigo-600",
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
    bgBanner: "from-amber-400 to-yellow-500",
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
    bgBanner: "from-purple-500 to-fuchsia-600",
    imageUrl: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600&auto=format&fit=crop"
  }
];

const productNames: Record<number, string[]> = {
  1: ["Túi xách len họa tiết thổ cẩm", "Mũ len mùa đông ấm áp", "Khăn choàng cổ vintage", "Gấu bông len amigurumi cỡ lớn", "Áo khoác len cardigan mỏng", "Lót ly đan tay bộ 6 cái", "Túi tote đan sợi dệt", "Búp bê thỏ len"],
  2: ["Cà phê hạt Arabica 500g", "Cà phê bột rang xay mộc", "Phin pha cà phê nhôm cao cấp", "Combo quà tặng cà phê Tây Nguyên", "Cà phê Robusta đặc biệt", "Cà phê Honey Process 250g", "Bột cacao nguyên chất", "Hạt điều rang sấy"],
  3: ["Serum hoa hồng Đà Lạt", "Nước hoa hồng hữu cơ", "Kem dưỡng da ban đêm tinh chất trà", "Sữa rửa mặt dịu nhẹ thiên nhiên", "Tinh dầu hoa oải hương", "Mặt nạ đất sét hoa cúc", "Son dưỡng môi sáp ong", "Xịt khoáng thảo mộc"],
  4: ["Bộ ấm chén men rạn cổ", "Lọ hoa gốm vuốt tay trang trí", "Bát tô đắp nổi hoa sen", "Đĩa gốm trang trí họa tiết", "Bộ bát đĩa 12 món dùng cơm", "Cốc sứ uống trà có nắp", "Bình cắm hoa men ngọc", "Ống đựng đũa gốm"],
  5: ["Bánh tráng phơi sương loại 1", "Muối tôm Tây Ninh hảo hạng", "Hành phi thơm ngon giòn rụm", "Bánh tráng me chua cay", "Khô gà lá chanh hũ 300g", "Bánh tráng bơ tỏi", "Khô bò tỏi ớt", "Đậu phộng rang tỏi ớt"],
  6: ["Áo khoác thổ cẩm nam nữ", "Túi đeo chéo dân tộc tinh xảo", "Váy xòe họa tiết H'Mông", "Khăn quấn đầu dệt tay", "Vòng tay may mắn thêu chỉ", "Balo thổ cẩm Sapa đi học", "Ví cầm tay thêu hoa", "Áo dài cách tân họa tiết dân tộc"]
};

const productImages: Record<number, string[]> = {
  1: [
    "https://images.unsplash.com/photo-1628157790342-9907c0800e47?q=80&w=400&auto=format&fit=crop", // Túi xách len họa tiết thổ cẩm
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=400&auto=format&fit=crop", // Mũ len mùa đông ấm áp
    "https://images.unsplash.com/photo-1605368303023-e2e3427ec7f4?q=80&w=400&auto=format&fit=crop", // Khăn choàng cổ vintage
    "https://images.unsplash.com/photo-1615891396860-264669888d3e?q=80&w=400&auto=format&fit=crop", // Gấu bông len amigurumi cỡ lớn
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&auto=format&fit=crop", // Áo khoác len cardigan mỏng
    "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400&auto=format&fit=crop", // Lót ly đan tay bộ 6 cái
    "https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=400&auto=format&fit=crop", // Túi tote đan sợi dệt
    "https://images.unsplash.com/photo-1534068305047-81ec6fcba852?q=80&w=400&auto=format&fit=crop"  // Búp bê thỏ len
  ],
  2: [
    "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop", // Cà phê hạt Arabica 500g
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop", // Cà phê bột rang xay mộc
    "https://images.unsplash.com/photo-1544787219-7f47ccb7fae6?q=80&w=400&auto=format&fit=crop", // Phin pha cà phê nhôm cao cấp
    "https://images.unsplash.com/photo-1606791405792-1004f1718d0c?q=80&w=400&auto=format&fit=crop", // Combo quà tặng cà phê Tây Nguyên
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400&auto=format&fit=crop", // Cà phê Robusta đặc biệt
    "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?q=80&w=400&auto=format&fit=crop", // Cà phê Honey Process 250g
    "https://images.unsplash.com/photo-1548821217-1f4a4340d85b?q=80&w=400&auto=format&fit=crop", // Bột cacao nguyên chất
    "https://images.unsplash.com/photo-1599598425947-330026295ee0?q=80&w=400&auto=format&fit=crop"  // Hạt điều rang sấy
  ]
};

export default function ShopDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id) || 1;
  
  const shop = shops.find(s => s.id === id) || shops[0];

  const products = useMemo(() => {
    const names = productNames[shop.id] || productNames[1];
    const images = productImages[shop.id] || [];
    return names.map((name, index) => ({
      id: `p-${shop.id}-${index}`,
      name: name,
      price: (((index * shop.id * 17) % 40) + 15) * 10000,
      sold: ((index * shop.id * 31) % 500) + 15,
      rating: ((((index + 1) * shop.id * 7) % 10) / 10 + 4).toFixed(1),
      imageUrl: images[index] || `https://picsum.photos/seed/p${shop.id}${index}/400/400`
    }));
  }, [shop.id]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Banner */}
      <div className="h-64 md:h-80 w-full relative bg-slate-200 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-slate-400 z-0" />
        <img src={shop.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => e.currentTarget.style.display = 'none'} />
        <div className="absolute inset-0 bg-black/40 z-20"></div>
        <div className="max-w-6xl mx-auto px-6 pt-6 relative z-30 w-full">
          <Link to="/exhibition" className="inline-flex items-center gap-2 text-white hover:text-white bg-black/30 hover:bg-black/40 backdrop-blur px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/20">
            <ArrowLeft className="h-4 w-4" /> Quay lại Triển lãm
          </Link>
        </div>
      </div>

      {/* Shop Info Card */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 md:-mt-32 relative z-20 mb-12">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-100/30 border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl flex-shrink-0 flex items-center justify-center text-6xl shadow-inner border-4 border-white shadow-sm overflow-hidden relative bg-gray-50`}>
            <span className="z-0 drop-shadow-sm">{shop.emoji}</span>
            <img src={shop.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[10px] font-bold tracking-wider uppercase text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md">{shop.category}</div>
              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md font-medium"><CheckCircle2 className="h-3 w-3" /> Gian hàng uy tín</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-indigo-900 mb-2">{shop.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1.5"><Store className="h-4 w-4 text-rose-400" /> Chủ hộ: <strong className="text-gray-800">{shop.owner}</strong></span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-rose-400" /> {shop.location}</span>
              <span className="flex items-center gap-1.5 text-amber-500"><Star className="h-4 w-4 fill-amber-400" /> 4.9 (1.2k đánh giá)</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-3xl">{shop.desc}</p>
          </div>
          <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0 shrink-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md shadow-rose-500/20">
              <ShoppingCart className="h-5 w-5" /> Theo dõi gian hàng
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 px-6 py-3 rounded-xl font-medium transition-colors">
              <MessageCircle className="h-5 w-5" /> Nhắn tin ngay
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl md:text-3xl text-indigo-900 font-bold">Sản phẩm nổi bật</h2>
          <span className="text-sm text-gray-500">{products.length} sản phẩm</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-rose-100/40 transition-all duration-300 group flex flex-col">
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <ImageIcon className="w-10 h-10 text-gray-300 z-0" />
                <img src={product.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 z-10" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 text-sm leading-snug group-hover:text-rose-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="px-1 border-l border-gray-300 ml-1 pl-2">Đã bán {product.sold}</span>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div className="font-semibold text-rose-500 text-lg">{product.price.toLocaleString("vi-VN")} ₫</div>
                  <button className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-900 hover:bg-indigo-900 hover:text-white transition-colors" title="Thêm vào giỏ">
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}