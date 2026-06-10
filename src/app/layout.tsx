import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full antialiased font-sans font-be-vietnam">
      <div className="min-h-full flex flex-col bg-ivory">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        
        {/* Messenger Chat Widget */}
        <a
          href="https://m.me/100095386953075"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0084ff] text-white shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          aria-label="Chat với chúng tôi trên Messenger"
        >
          <MessageCircle size={28} />
        </a>
      </div>
    </div>
  );
}
