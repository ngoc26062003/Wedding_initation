"use client";

import { supabase } from "@/lib/supabase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/courses", label: "Thư viện số DVC" },
  { href: "/exhibition", label: "Sản phẩm Thanh niên" },
  { href: "/activities", label: "Hoạt động" },
  { href: "/about", label: "Về chúng tôi" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname || "/";
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getUser()
      .then((res) => {
        if (!mounted) return;
        setSignedIn(Boolean(res.data.user));
      })
      .catch(() => {
        if (!mounted) return;
        setSignedIn(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSignedIn(Boolean(session?.user));
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
  }
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-rose-100">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="text-indigo-900 text-lg tracking-tight font-serif">
          Tuổi trẻ <span className="text-rose-400 font-bold uppercase text-sm ml-1 tracking-wider">Xuân Đông</span>
        </Link>
        <ul className="hidden md:flex items-stretch gap-1">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className={
                    "px-3 text-sm flex items-center border-b-2 " +
                    (active
                      ? "border-rose-300 text-indigo-900 font-medium"
                      : "border-transparent text-gray-600 hover:text-indigo-900")
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-1 rounded-full border border-rose-300 text-rose-500 px-3 py-1.5 text-xs font-medium hover:bg-rose-400 hover:text-white transition"
              >
                <User size={16} />
                Hồ sơ
              </Link>
              <button
                type="button"
                onClick={signOut}
                disabled={busy}
                className={
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition " +
                  (busy
                    ? "bg-indigo-900/70 text-white cursor-not-allowed"
                    : "bg-indigo-900 text-white hover:bg-indigo-800")
                }
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </>
          ) : signedIn === false ? (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 rounded-full border border-rose-300 text-rose-500 px-3 py-1.5 text-xs font-medium hover:bg-rose-400 hover:text-white transition"
              >
                <LogIn size={16} />
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1 rounded-full bg-indigo-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-indigo-800 transition"
              >
                <UserPlus size={16} />
                Đăng ký
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
