"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    FB: any;
  }
}

export default function FacebookEmbed({ url, width = "auto" }: { url: string; width?: string }) {
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
      
      containerRef.current.innerHTML = '';
      
      const fbDiv = document.createElement('div');
      fbDiv.className = 'fb-post w-full';
      fbDiv.setAttribute('data-href', url);
      if (width) fbDiv.setAttribute('data-width', width);
      fbDiv.setAttribute('data-show-text', 'false');
      
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
        const interval = setInterval(() => {
          if (window.FB) {
            clearInterval(interval);
            initFB();
          }
        }, 100);
      }
    } else {
      setTimeout(initFB, 0);
    }
  }, [url, width]);

  return (
    <div ref={containerRef} className="w-full max-w-[500px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex items-center justify-center min-h-[300px]">
      {/* Elements will be injected via JS to prevent React StrictMode errors */}
    </div>
  );
}