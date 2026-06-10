"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    FB: any;
  }
}

export default function FacebookPageEmbed({ url, height = "800" }: { url: string; height?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tạo thẻ #fb-root cần thiết cho Facebook SDK nếu nó chưa tồn tại
    if (!document.getElementById("fb-root")) {
      const fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.appendChild(fbRoot);
    }

    const initFB = () => {
      if (!containerRef.current) return;
      
      // Xóa sạch nội dung cũ để tránh React và FB SDK xung đột DOM
      containerRef.current.innerHTML = '';
      
      // Tự động tạo thẻ bằng DOM chuẩn thay vì JSX để React không can thiệp
      const fbDiv = document.createElement('div');
      fbDiv.className = 'fb-page w-full';
      fbDiv.setAttribute('data-href', url);
      fbDiv.setAttribute('data-tabs', 'timeline');
      fbDiv.setAttribute('data-width', '500');
      if (height) fbDiv.setAttribute('data-height', height);
      fbDiv.setAttribute('data-small-header', 'false');
      fbDiv.setAttribute('data-adapt-container-width', 'true');
      fbDiv.setAttribute('data-hide-cover', 'false');
      fbDiv.setAttribute('data-show-facepile', 'true');
      
      containerRef.current.appendChild(fbDiv);

      if (window.FB) {
        window.FB.XFBML.parse(containerRef.current);
      }
    };

    if (typeof window !== "undefined" && !window.FB) {
      if (!document.querySelector('script[src*="connect.facebook.net"]')) {
        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v19.0";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
        script.onload = initFB;
      } else {
        // Nếu script đang tải bởi 1 component khác, chờ tải xong
        const interval = setInterval(() => {
          if (window.FB) {
            clearInterval(interval);
            initFB();
          }
        }, 100);
      }
    } else {
      // Delay 1 tick để đảm bảo React đã mount xong container
      setTimeout(initFB, 0);
    }
  }, [url, height]);

  return (
    <div ref={containerRef} className="w-full bg-white flex items-center justify-center min-h-[300px]">
      {/* Các thẻ sẽ được inject thông qua JavaScript để tránh lỗi */}
    </div>
  );
}