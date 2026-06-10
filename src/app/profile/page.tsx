"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User, MapPin, FileText, Image as ImageIcon, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    province: "",
    bio: "",
    avatar_url: "",
  });

  const provinces = [
    "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", 
    "Quảng Nam", "Đắk Lắk", "Lâm Đồng", "Tây Ninh", "Lào Cai", "Khác"
  ];

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (cancelled) return;
        
        if (user) {
          setUser(user);
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, province, bio, avatar_url")
            .eq("id", user.id)
            .maybeSingle();

          if (!error && data) {
            setFormData({
              full_name: data.full_name || "",
              province: data.province || "",
              bio: data.bio || "",
              avatar_url: data.avatar_url || "",
            });
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id, // Bắt buộc phải có ID để upsert/update đúng user
          full_name: formData.full_name,
          province: formData.province,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra khi cập nhật." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center">
        <h2 className="font-serif text-2xl text-indigo-900 mb-2">Bạn chưa đăng nhập</h2>
        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem và cập nhật hồ sơ cá nhân.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-8">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500 mb-2">Tài khoản</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-indigo-900">Hồ sơ cá nhân</h1>
      </div>

      <div className="bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-100/20 overflow-hidden">
        <div className="p-6 md:p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
              {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0 relative">
                <User className="w-10 h-10 text-indigo-200 z-0" />
                {formData.avatar_url && <img src={formData.avatar_url} alt="" className="absolute inset-0 w-full h-full object-cover z-10" onError={(e) => e.currentTarget.style.display = 'none'} />}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-indigo-900 mb-1 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-rose-400" /> Đường dẫn ảnh đại diện</label>
                <input 
                  type="url" 
                  name="avatar_url" 
                  value={formData.avatar_url} 
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm"
                />
                <p className="text-xs text-gray-500 mt-1.5">Dán đường dẫn ảnh (URL) để thay đổi ảnh đại diện của bạn.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1 flex items-center gap-2"><User className="w-4 h-4 text-rose-400" /> Họ và tên</label>
                <input 
                  type="text" 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleChange}
                  placeholder="Nhập họ tên của bạn" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-400" /> Tỉnh/Thành phố</label>
                <select name="province" value={formData.province} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm bg-white">
                  <option value="">-- Chọn Tỉnh/Thành phố --</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1 flex items-center gap-2"><FileText className="w-4 h-4 text-rose-400" /> Giới thiệu bản thân / Cơ sở kinh doanh</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange}
                placeholder="Chia sẻ một chút về bạn và công việc kinh doanh của bạn..." 
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-sm resize-y"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-rose-50 flex justify-end">
              <button type="submit" disabled={saving} className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-rose-500/30 flex items-center gap-2 disabled:opacity-70">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}