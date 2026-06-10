export default function Page() {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-rose-500 mb-3">
          Về chúng tôi
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-indigo-900 mb-6 leading-tight">
          Tuổi trẻ Xuân Đông — Khát vọng cống hiến & Tiên phong chuyển đổi số
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Đoàn TNCS Hồ Chí Minh Xã Xuân Đông là tổ chức chính trị - xã hội của thanh niên tại địa phương, đại diện cho ý chí, nguyện vọng và quyền lợi chính đáng của thế hệ trẻ xã nhà.
        </p>
      </div>

      {/* Content sections */}
      <div className="prose prose-lg max-w-none text-gray-700 space-y-10">
        <section>
          <h2 className="font-serif text-2xl md:text-3xl text-indigo-900 mb-4 border-b border-rose-100 pb-3">1. Tổ công nghệ số cộng đồng</h2>
          <p className="mb-4 leading-relaxed">
            Trong công cuộc cách mạng công nghiệp 4.0, Đoàn xã Xuân Đông đã thành lập các Tổ công nghệ số cộng đồng nòng cốt. Các đoàn viên thanh niên trực tiếp đi từng ngõ, gõ từng nhà để hỗ trợ người dân cài đặt ứng dụng VNeID, thiết lập chữ ký số và hướng dẫn sử dụng <strong>Cổng Dịch vụ công Quốc gia</strong>.
          </p>
          <p className="mb-4 leading-relaxed">
            Thông qua Thư viện số, chúng tôi mong muốn cung cấp các tài liệu trực quan, dễ hiểu nhất giúp bà con có thể tự thao tác các thủ tục hành chính ngay tại nhà, tiết kiệm thời gian và chi phí đi lại.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl md:text-3xl text-indigo-900 mb-4 border-b border-rose-100 pb-3">2. Đồng hành cùng thanh niên lập nghiệp</h2>
          <p className="mb-4 leading-relaxed">
            Tuổi trẻ Xuân Đông luôn sát cánh cùng thanh niên trên con đường lập thân, lập nghiệp. Chúng tôi tổ chức các buổi sinh hoạt chuyên đề, tập huấn kỹ năng nông nghiệp công nghệ cao, hỗ trợ tiếp cận nguồn vốn vay ưu đãi.
          </p>
          <ul className="list-disc pl-6 space-y-3 mt-4 marker:text-rose-400 leading-relaxed text-gray-700">
            <li><strong className="text-indigo-900">Mô hình kinh tế số:</strong> Hỗ trợ thanh niên xây dựng thương hiệu nông sản địa phương, đưa sản phẩm lên các sàn Thương mại điện tử.</li>
            <li><strong className="text-indigo-900">Chia sẻ kinh nghiệm:</strong> Kết nối thanh niên với các chuyên gia, doanh nhân thành đạt để trao đổi kiến thức khởi nghiệp thực chiến.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl md:text-3xl text-indigo-900 mb-4 border-b border-rose-100 pb-3">3. Xung kích vì cộng đồng</h2>
          <p className="mb-4 leading-relaxed">
            Với khẩu hiệu "Đâu cần thanh niên có, đâu khó có thanh niên", các hoạt động tình nguyện như Ngày Chủ nhật xanh, Tiếp sức mùa thi, Mùa hè xanh, hay phong trào Đền ơn đáp nghĩa luôn được các bạn đoàn viên tham gia nhiệt tình.
          </p>
          <p className="leading-relaxed">
            Tuổi trẻ Xuân Đông tự hào góp phần xây dựng một quê hương ngày càng giàu đẹp, văn minh và hiện đại.
          </p>
        </section>
      </div>
    </div>
  );
}
