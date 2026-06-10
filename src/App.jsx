import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  // State quản lý trạng thái phong bì
  const [envelopeState, setEnvelopeState] = useState({
    opened: false,
    sealBroken: false,
    flapOpen: false,
    cardRise: false,
    overlayHide: false
  });

  // State quản lý form RSVP
  const [rsvpForm, setRsvpForm] = useState({ name: '', phone: '', attend: '', guests: '' });
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // State quản lý đếm ngược thời gian
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Đảm bảo thẻ meta viewport tồn tại để tự động scale trên điện thoại
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }, []);

  useEffect(() => {
    // Ngày giờ tổ chức Tiệc Báo Hỷ: 18:00 04/07/2026
    const targetDate = new Date('2026-07-04T18:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Refs cho animation canvas
  const canvasRef = useRef(null);
  const canvasControls = useRef({
    burstPetals: () => {},
    startPetalRain: () => {}
  });

  // Xử lý mở phong bì
  const openEnvelope = () => {
    if (envelopeState.opened) return;
    setEnvelopeState(prev => ({ ...prev, opened: true, sealBroken: true }));

    setTimeout(() => setEnvelopeState(prev => ({ ...prev, flapOpen: true })), 300);
    setTimeout(() => setEnvelopeState(prev => ({ ...prev, cardRise: true })), 700);
    setTimeout(() => canvasControls.current.burstPetals(120), 900);
    setTimeout(() => {
      setEnvelopeState(prev => ({ ...prev, overlayHide: true }));
      canvasControls.current.startPetalRain();
    }, 2400);
  };

  // Xử lý gửi RSVP
  const submitRSVP = () => {
    if (!rsvpForm.name || !rsvpForm.attend) {
      alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
      return;
    }
    setRsvpSuccess(true);
    setRsvpForm({ name: '', phone: '', attend: '', guests: '' });
    canvasControls.current.burstPetals(60);
    setTimeout(() => setRsvpSuccess(false), 5000);
  };

  // Logic cuộn hiện nội dung (Scroll Reveal)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Logic vẽ hoa rơi trên Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let rafId = null;
    let raining = false;
    let petals = [];
    let frameCount = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const COLORS = [
      'rgba(247,214,224,', 'rgba(242,191,209,', 'rgba(232,160,180,',
      'rgba(200,112,138,', 'rgba(251,232,239,', 'rgba(201,169,110,',
      'rgba(232,213,176,'
    ];

    const randColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

    const drawPetal = (x, y, size, angle, alpha, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.45, size, 0, 0, Math.PI * 2);
      ctx.fillStyle = color + alpha + ')';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.15, 0, 0, size);
      ctx.strokeStyle = color.replace('rgba(', 'rgba(').replace(/[\d.]+(?=,[\d.]+\))/, (m) => Math.max(0, parseFloat(m) - 40)) + (alpha * 0.3) + ')';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    };

    const createPetal = (opts = {}) => ({
      x: opts.x !== undefined ? opts.x : Math.random() * canvas.width,
      y: opts.y !== undefined ? opts.y : -20 - Math.random() * 80,
      size: opts.size || (6 + Math.random() * 14),
      speedX: opts.speedX || (-1.2 + Math.random() * 2.4),
      speedY: opts.speedY || (1.2 + Math.random() * 2.8),
      angle: Math.random() * Math.PI * 2,
      spin: (-0.04 + Math.random() * 0.08),
      alpha: opts.alpha || (0.5 + Math.random() * 0.5),
      color: randColor(),
      sway: Math.random() * Math.PI * 2,
      swaySpd: 0.02 + Math.random() * 0.03,
      swayAmp: 0.5 + Math.random() * 1.5,
    });

    canvasControls.current.burstPetals = (n) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.3;
        const speed = 2 + Math.random() * 7;
        petals.push(createPetal({
          x: cx + (Math.random() - 0.5) * 80,
          y: cy + (Math.random() - 0.5) * 80,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed - 3,
          size: 8 + Math.random() * 16,
          alpha: 0.7 + Math.random() * 0.3,
        }));
      }
      if (!rafId) animatePetals();
    };

    canvasControls.current.startPetalRain = () => { raining = true; };

    const spawnRainPetal = () => petals.push(createPetal());

    const animatePetals = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      if (raining && frameCount % 18 === 0) spawnRainPetal();

      petals = petals.filter(p => {
        p.x += p.speedX + Math.sin(p.sway) * p.swayAmp;
        p.y += p.speedY;
        p.angle += p.spin;
        p.sway += p.swaySpd;
        p.speedY = Math.min(p.speedY + 0.03, 4); 
        if (p.y > canvas.height - 60) p.alpha -= 0.025;

        if (p.alpha > 0.02 && p.y < canvas.height + 30) {
          drawPetal(p.x, p.y, p.size, p.angle, Math.min(p.alpha, 1), p.color);
          return true;
        }
        return false;
      });

      rafId = requestAnimationFrame(animatePetals);
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* CSS Responsive tự động scale cho thiết bị di động */}
      <style>{`
        .scrolling-gallery {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 20px 0 40px 0;
          scrollbar-width: none;
        }
        .scrolling-gallery::-webkit-scrollbar {
          display: none;
        }
        .scrolling-gallery .gallery-cell {
          flex: 0 0 80%;
          max-width: 320px;
          height: 480px;
          scroll-snap-align: center;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }
        .scrolling-gallery img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .seal-heart {
          display: inline-block;
          font-size: 1.5rem;
          line-height: 1;
          animation: heart-pulse 1.5s infinite;
        }
        .hint-pointer {
          display: inline-block;
          font-size: 1.2rem;
          margin-right: 5px;
          animation: finger-bounce 0.8s infinite alternate;
        }
        @keyframes heart-pulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(255,255,255,0.5)); }
          50% { transform: scale(1.4); filter: drop-shadow(0 0 12px rgba(255,255,255,1)) drop-shadow(0 0 15px rgba(255,105,180,0.9)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(255,255,255,0.5)); }
        }
        @keyframes finger-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
        @media (max-width: 768px) {
          .hero-names { font-size: 2.8rem !important; }
          .section-title { font-size: 1.8rem !important; }
          .couple-grid { display: flex !important; flex-direction: column !important; gap: 2rem !important; }
          .event-cards { display: flex !important; flex-direction: column !important; gap: 1.5rem !important; align-items: center; }
          .event-card { width: 100% !important; margin: 0 !important; }
          .event-heart-separator { transform: rotate(90deg); margin: 5px 0 !important; }
          .tl-item { width: 100% !important; padding-left: 45px !important; left: 0 !important; text-align: left !important; }
          .tl-dot { left: 15px !important; }
          .countdown-box { min-width: 60px !important; padding: 10px !important; }
          .countdown-wrapper { gap: 10px !important; }
          .rsvp-card { padding: 20px !important; }
          .rsvp-input { width: 100% !important; box-sizing: border-box; }
          .env-wrap { transform: scale(0.8); }
        }
        @media (max-width: 480px) {
          .hero-names { font-size: 2.2rem !important; }
          .env-wrap { transform: scale(0.65); }
          .scrolling-gallery .gallery-cell { flex: 0 0 85%; height: 420px; }
        }
      `}</style>

      {/* PETAL CANVAS */}
      <canvas id="petal-canvas" ref={canvasRef}></canvas>

      {/* ENVELOPE OVERLAY */}
      <div id="envelope-overlay" className={envelopeState.overlayHide ? 'hide' : ''}>
        <div className="env-wrap" id="env-wrap" onClick={openEnvelope}>
          <div className="env-body"></div>
          <div className={`env-card-peek ${envelopeState.cardRise ? 'rise' : ''}`} id="env-card">
            <div className="peek-names">Văn Đạt<br /><span className="peek-amp">&amp;</span><br />Thùy Linh</div>
            <div className="peek-heart">♥</div>
          </div>
          <div className={`env-flap ${envelopeState.flapOpen ? 'open' : ''}`} id="env-flap"></div>
          <div className={`env-seal ${envelopeState.sealBroken ? 'broken' : ''}`} id="env-seal">
            <span className="seal-heart">💖</span>
          </div>
        </div>
        <p className="env-hint"><span className="hint-pointer">👆</span> Nhấn để mở thiệp cưới</p>
        <button className="env-open-btn" onClick={openEnvelope}>Mở thiệp 🌸</button>
      </div>

      {/* ══ MAIN PAGE ══ */}
      <section className="hero" id="top">
        <div className="hero-petal hp1"></div>
        <div className="hero-petal hp2"></div>
        <div className="hero-petal hp3"></div>
        <div className="hero-petal hp4"></div>
        <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        <div className="hero-inner">
          <p className="hero-label">Trân trọng kính mời</p>
          <div className="hero-divider">
            <div className="hero-divider-line"></div>
            <div className="hero-divider-diamond"></div>
            <div className="hero-divider-line"></div>
          </div>
          <h1 className="hero-names">
            Văn Đạt
            <span className="hero-amp">&amp;</span>
            Thùy Linh
          </h1>
          <p className="hero-date">Ngày 04 • Tháng 07 • Năm 2026</p>
          <div className="hero-scroll">
            <a href="#story">
              <span>Cuộn xuống để xem thêm</span>
              <span className="scroll-arrow">↓</span>
            </a>
          </div>
        </div>
      </section>

      <section className="countdown-section" id="countdown" style={{ padding: '60px 0', backgroundColor: '#fcf9fa' }}>
        <div className="container"><div className="reveal">
          <h2 className="section-title">Đếm ngược đến ngày chung đôi</h2>
          <p className="section-sub">Waiting for the big day</p>
          <div className="gold-line"></div>
          <div className="countdown-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
            {[
              { label: 'Ngày', value: countdown.days },
              { label: 'Giờ', value: countdown.hours },
              { label: 'Phút', value: countdown.minutes },
              { label: 'Giây', value: countdown.seconds }
            ].map((item, idx) => (
              <div key={idx} className="countdown-box" style={{ background: '#fff', border: '1px solid rgba(200, 112, 138, 0.2)', borderRadius: '12px', padding: '15px 10px', minWidth: '75px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#c8708a', fontFamily: 'serif', lineHeight: '1' }}>
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div></div>
      </section>

      <section className="story-section" id="story">
        <div className="container"><div className="reveal">
          <h2 className="section-title">Chuyện tình của chúng tôi</h2>
          <p className="section-sub">Our love story</p>
          <div className="gold-line"></div>
          <div className="story-card">
            <p className="story-text">
              Chúng tôi gặp nhau trong một buổi chiều mưa tháng Ba, tại một quán cà phê nhỏ ở góc phố.
              Một ánh mắt tình cờ, một nụ cười bẽn lẽn, và từ đó cuộc đời chúng tôi đã gắn kết lại với nhau
              theo cách kỳ diệu nhất. Ba năm bên nhau, qua biết bao kỷ niệm đẹp, chúng tôi quyết định
              cùng nhau bước vào một chương mới của cuộc đời — với trái tim rộn ràng và tình yêu trọn vẹn.
            </p>
            <p className="story-signature">Văn Đạt &amp; Thùy Linh</p>
          </div>
        </div></div>
      </section>

      <section className="couple-section" id="couple">
        <div className="container"><div className="reveal">
          <h2 className="section-title">Chú rể &amp; Cô dâu</h2>
          <p className="section-sub">Groom &amp; Bride</p>
          <div className="gold-line"></div>
          <div className="couple-grid">
            <div className="couple-card">
              <div className="couple-avatar" style={{ padding: 0, overflow: 'hidden', border: '4px solid white' }}>
                <img src="./pic/chu-re.jpg" alt="Chú rể Văn Đạt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="couple-name">Trần Văn Đạt</h3>
              <p className="couple-desc"><em>(Út Nam)</em><br />Con trai của<br /><em>Bà Bùi Thị Thu</em></p>
            </div>
            <div className="couple-heart">♥</div>
            <div className="couple-card">
              <div className="couple-avatar" style={{ padding: 0, overflow: 'hidden', border: '4px solid white' }}>
                <img src="./pic/co-dau.jpg" alt="Cô dâu Thùy Linh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="couple-name">Nguyễn Thị Thùy Linh</h3>
              <p className="couple-desc"><em>(Út Nợ)</em><br />Con gái của<br /><em>Ông Nguyễn Xuân Phú &amp; Bà Nguyễn Thị Mộng</em></p>
            </div>
          </div>
        </div></div>
      </section>

      <section className="timeline-section" id="timeline">
        <div className="container"><div className="reveal">
          <h2 className="section-title">Hành trình yêu</h2>
          <p className="section-sub">Our journey together</p>
          <div className="gold-line"></div>
          <div className="timeline-wrapper">
            <div className="timeline">
              <div className="tl-item"><div className="tl-dot"></div><div className="tl-content"><p className="tl-date">Tháng 3, 2022</p><h4 className="tl-title">Lần đầu gặp gỡ</h4><p className="tl-desc">Trong quán cà phê nhỏ, dưới cơn mưa chiều.</p></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div className="tl-content"><p className="tl-date">Tháng 6, 2022</p><h4 className="tl-title">Chính thức hẹn hò</h4><p className="tl-desc">Anh trao em bó hoa hồng đầu tiên.</p></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div className="tl-content"><p className="tl-date">Tháng 1, 2024</p><h4 className="tl-title">Cầu hôn</h4><p className="tl-desc">Dưới ánh đèn lấp lánh, anh quỳ xuống và hỏi: "Em lấy anh nhé?"</p></div></div>
              <div className="tl-item"><div className="tl-dot"></div><div className="tl-content"><p className="tl-date">Tháng 7, 2026</p><h4 className="tl-title">Lễ cưới</h4><p className="tl-desc">Ngày chúng tôi chính thức trở thành một gia đình.</p></div></div>
            </div>
          </div>
        </div></div>
      </section>

      <section className="event-section" id="event">
        <div className="container"><div className="reveal">
          <h2 className="section-title">Thông tin lễ cưới</h2>
          <p className="section-sub">Wedding details</p>
          <div className="gold-line"></div>
          <div className="event-cards">
            <div className="event-card">
              <div className="event-icon">🥂</div><h3 className="event-card-title">Tiệc Báo Hỷ</h3><p><strong>18:00 tối</strong><br />Thứ Bảy, 04/07/2026<br /><br />Trung tâm tiệc cưới <strong>Nguyên Trang</strong><br /><strong>E26, 90 đường Đồng Khởi, Kp 3, phường Trảng Dài, TP. Đồng Nai</strong></p>
              <a href="https://maps.app.goo.gl/VFRdPth5GvY2fzaz5" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#c8708a', color: '#fff', textDecoration: 'none', borderRadius: '25px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>📍 Hướng dẫn di chuyển</a>
            </div>
          </div>
        </div></div>
      </section>

      <section className="gallery-section" id="gallery" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20px', left: '-20px', right: '-20px', bottom: '-20px',
          background: 'url(./pic/2aoboqbtm4g7w5gbcbjxl2nuqndjgi8mociwp0763.jpg) center/cover no-repeat', filter: 'blur(15px)', opacity: 0.15, zIndex: 0
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}><div className="reveal">
          <h2 className="section-title">Kỷ niệm bên nhau</h2>
          <p className="section-sub">Our memories</p>
          <div className="gold-line"></div>
          <div className="scrolling-gallery">
            <div className="gallery-cell">
              <img src="./pic/7.jpg" alt="Ảnh cưới 2" loading="lazy" />
            </div>
            <div className="gallery-cell">
              <img src="./pic/2aoboqbtmbsf19ayophhz9khimz9cz7ai7fz4cd614.jpg" alt="Ảnh cưới 3" loading="lazy" />
            </div>
            <div className="gallery-cell">
              <img src="./pic/2aoboqbtm8h61smwjexbcyzxnpamlffjaiypd8wc9.jpg" alt="Ảnh cưới 4" loading="lazy" />
            </div>
            <div className="gallery-cell">
              <img src="./pic/2.jpg" alt="Ảnh cưới 5" loading="lazy" />
            </div>
            <div className="gallery-cell">
              <img src="./pic/1.jpg" alt="Ảnh cưới 5" loading="lazy" />
            </div>
            <div className="gallery-cell">
              <img src="./pic/3.jpg" alt="Ảnh cưới 5" loading="lazy" />
            </div>
          </div>
        </div></div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="container"><div className="reveal">
          <h2 className="section-title">Xác nhận tham dự</h2>
          <p className="section-sub">RSVP – Please respond by 21/06/2026</p>
          <div className="gold-line"></div>
          <div className="rsvp-card">
            <p className="rsvp-intro">Sự hiện diện của bạn là món quà ý nghĩa nhất đối với chúng tôi.<br />Xin vui lòng xác nhận trước ngày <strong>21/06/2026</strong>.</p>
            <div className="rsvp-form">
              <input className="rsvp-input" type="text" placeholder="Họ và tên của bạn" value={rsvpForm.name} onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})} />
              <input className="rsvp-input" type="text" placeholder="Số điện thoại" value={rsvpForm.phone} onChange={(e) => setRsvpForm({...rsvpForm, phone: e.target.value})} />
              <select className="rsvp-input rsvp-select" value={rsvpForm.attend} onChange={(e) => setRsvpForm({...rsvpForm, attend: e.target.value})}>
                <option value="" disabled>Bạn có tham dự không?</option>
                <option value="yes">Vâng, tôi sẽ tham dự 🎉</option>
                <option value="no">Rất tiếc, tôi không thể đến</option>
                <option value="maybe">Có thể tôi sẽ tham dự</option>
              </select>
              <select className="rsvp-input rsvp-select" value={rsvpForm.guests} onChange={(e) => setRsvpForm({...rsvpForm, guests: e.target.value})}>
                <option value="" disabled>Số lượng người đi cùng</option>
                <option value="1">Chỉ mình tôi</option>
                <option value="2">2 người</option>
                <option value="3">3 người</option>
                <option value="4">4 người trở lên</option>
              </select>
              <button className="rsvp-btn" onClick={submitRSVP}>Gửi xác nhận ✉</button>
              {rsvpSuccess && <div className="rsvp-success" style={{ display: 'block' }}>🌸 Cảm ơn bạn rất nhiều! Chúng tôi rất vui được gặp bạn! 🌸</div>}
            </div>
          </div>
        </div></div>
      </section>

      <footer>
        <p className="footer-names">Văn Đạt &amp; Thùy Linh</p>
        <p className="footer-date">04 · 07 · 2026</p>
        <p className="footer-msg">"Tình yêu không phải là nhìn nhau, mà là cùng nhau nhìn về một hướng."<br />— Antoine de Saint-Exupéry</p>
        <span className="footer-heart">♥</span>
      </footer>
    </>
  );
}