"use client";

import { supabase } from "@/lib/supabase";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FormEvent, useEffect, useMemo, useState } from "react";

function safeNext(value: string | null): string {
  if (!value) return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  return value;
}

export default function Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const nextPath = useMemo(
    () => safeNext(searchParams.get("next")),
    [searchParams],
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const res = await supabase.auth.getUser();
      if (cancelled) return;
      if (res.data.user) navigate(nextPath, { replace: true });
    }
    check().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [navigate, nextPath]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      const res = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (res.error) {
        setError(res.error.message);
        setBusy(false);
        return;
      }

      navigate(nextPath, { replace: true });
    } catch (err: any) {
      if (err instanceof TypeError && err?.message?.includes("Failed to fetch")) {
        setError("Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng hoặc cấu hình biến môi trường.");
      } else {
        setError(err?.message || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
      }
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-12 flex items-center justify-center bg-ivory">
      <div className="w-full max-w-md rounded-2xl border border-lav-lt bg-white overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-navy-lt to-blush-lt border-b border-lav-lt">
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-blush">
            FHB — For Her Business
          </div>
          <h1 className="mt-1 font-serif text-3xl text-navy">Đăng nhập</h1>
          <p className="mt-2 text-sm text-mid leading-6">
            Đăng nhập để tiếp tục đăng ký khóa học và lưu tiến độ học tập.
          </p>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-lav-lt bg-ivory px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blush-mid focus:border-blush-mid"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-navy mb-1">
              Mật khẩu
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-lav-lt bg-ivory px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blush-mid focus:border-blush-mid"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-blush-mid bg-blush-lt px-4 py-3 text-sm text-navy">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className={
              "w-full rounded-xl px-4 py-3 text-sm font-semibold transition " +
              (busy
                ? "bg-navy/70 text-white cursor-not-allowed"
                : "bg-navy text-white hover:bg-navy-mid")
            }
          >
            {busy ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-xs text-muted leading-5">
            Chưa có tài khoản?{" "}
            <Link
              to={`/register?next=${encodeURIComponent(nextPath)}`}
              className="text-blush hover:text-navy transition-colors"
            >
              Đăng ký
            </Link>
          </div>

          <div className="text-xs text-muted leading-5">
            Sau khi đăng nhập, hệ thống sẽ chuyển bạn về:{" "}
            <span className="font-medium text-navy">{nextPath}</span>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <Link to="/" className="text-mid hover:text-navy transition-colors">
              Về trang chủ
            </Link>
            <Link
              to={nextPath || "/"}
              className="text-blush hover:text-navy transition-colors"
            >
              Quay lại
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
