import { useState, useEffect, useCallback, useMemo } from 'react';
import './styles.css';
import Gate from './components/Gate.jsx';
import { Fire } from './components/Fire.jsx';
import Materi from './components/Materi.jsx';
import Lab from './components/Lab.jsx';
import Quiz, { Trouble } from './components/Quiz.jsx';
import Portal from './components/Portal.jsx';

/* ── SVG Symbols — always in DOM ── */
function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="tkj3" viewBox="0 0 100 100">
        <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="#1b1826" stroke="#3ef0d0" strokeWidth="3"/>
        <polygon points="50,14 81,32 81,68 50,86 19,68 19,32" fill="none" stroke="#2a6bff" strokeWidth="1.5"/>
        <path d="M22 36h10v-8M78 64H68v8" stroke="#8b6cff" strokeWidth="2" fill="none"/>
        <circle cx="32" cy="28" r="2.5" fill="#3ef0d0"/>
        <circle cx="68" cy="72" r="2.5" fill="#3ef0d0"/>
        <text x="50" y="47" textAnchor="middle" fontFamily="Cinzel,Georgia,serif" fontWeight="800" fontSize="20" fill="#e8e4f5">TKJ</text>
        <text x="50" y="72" textAnchor="middle" fontFamily="Cinzel,Georgia,serif" fontWeight="800" fontSize="22" fill="#ffb347">3</text>
      </symbol>
      <symbol id="sis1" viewBox="0 0 60 100">
        <path d="M52 21L57 3" stroke="#2a6bff" strokeWidth="7" strokeOpacity=".35" strokeLinecap="round"/>
        <path d="M52 21L57 3" stroke="#cfe8ff" strokeWidth="3" strokeLinecap="round"/>
        <path d="M46 24l11-7" stroke="#ffb347" strokeWidth="3"/>
        <path d="M40 33L51 22M20 33L11 52" stroke="#f2f2f8" strokeWidth="7" strokeLinecap="round"/>
        <rect x="18" y="28" width="24" height="34" rx="5" fill="#f2f2f8"/>
        <circle cx="24" cy="36" r="2.5" fill="#3ef0d0"/>
        <rect x="19" y="60" width="10" height="30" fill="#4a4f6a"/>
        <rect x="31" y="60" width="10" height="30" fill="#4a4f6a"/>
        <rect x="17" y="88" width="13" height="6" rx="2" fill="#111"/>
        <rect x="30" y="88" width="13" height="6" rx="2" fill="#111"/>
        <circle cx="30" cy="16" r="10" fill="#e8b98f"/>
        <path d="M19 15a11 11 0 0 1 22 0c-5-4-17-4-22 0z" fill="#2b2130"/>
        <circle cx="51" cy="22" r="3.5" fill="#e8b98f"/>
      </symbol>
      <symbol id="sis2" viewBox="0 0 60 100">
        <path d="M52 21L57 3" stroke="#2a6bff" strokeWidth="7" strokeOpacity=".35" strokeLinecap="round"/>
        <path d="M52 21L57 3" stroke="#cfe8ff" strokeWidth="3" strokeLinecap="round"/>
        <path d="M46 24l11-7" stroke="#ffb347" strokeWidth="3"/>
        <path d="M40 33L51 22M20 33L11 52" stroke="#f2f2f8" strokeWidth="7" strokeLinecap="round"/>
        <rect x="18" y="28" width="24" height="32" rx="5" fill="#f2f2f8"/>
        <circle cx="24" cy="36" r="2.5" fill="#ff4d6d"/>
        <path d="M18 58h24l5 24H13z" fill="#4a4f6a"/>
        <rect x="21" y="80" width="6" height="12" fill="#e8b98f"/>
        <rect x="33" y="80" width="6" height="12" fill="#e8b98f"/>
        <rect x="18" y="90" width="11" height="5" rx="2" fill="#111"/>
        <rect x="31" y="90" width="11" height="5" rx="2" fill="#111"/>
        <path d="M18 15a12 12 0 0 1 24 0v24h-5V20H23v19h-5z" fill="#4a2b1e"/>
        <circle cx="30" cy="16" r="10" fill="#e8b98f"/>
        <path d="M19 15a11 11 0 0 1 22 0c-6-5-16-5-22 0z" fill="#4a2b1e"/>
        <circle cx="51" cy="22" r="3.5" fill="#e8b98f"/>
      </symbol>
    </svg>
  );
}

/* ── Floating Particles — network data packets ── */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${8 + Math.random() * 12}s`,
      delay: `${Math.random() * 10}s`,
      drift: `${-40 + Math.random() * 80}px`,
      size: `${2 + Math.random() * 2}px`,
    })), []);

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            '--drift': p.drift,
          }}
        />
      ))}
    </div>
  );
}

/* ── Scanline Overlay ── */
function ScanlineOverlay() {
  return <div className="scanline-overlay" aria-hidden="true" />;
}

/* ── Scroll Reveal Hook ── */
function useScrollReveal(ready) {
  useEffect(() => {
    if (!ready) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Small delay to let DOM mount
    const timer = setTimeout(() => {
      // Reveal sections
      const sections = document.querySelectorAll('section');
      sections.forEach(s => s.classList.add('reveal'));

      // Reveal cards with stagger delay
      const cards = document.querySelectorAll('.grid .card');
      cards.forEach((c, i) => {
        c.classList.add('reveal-card');
        c.style.transitionDelay = `${i * 0.1}s`;
      });

      // Section headings
      const headings = document.querySelectorAll('section h2');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      sections.forEach(s => observer.observe(s));
      cards.forEach(c => observer.observe(c));
      headings.forEach(h => observer.observe(h));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [ready]);
}

/* ── Button Ripple Effect ── */
function useButtonRipple(ready) {
  const handleClick = useCallback((e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [ready, handleClick]);
}


function LogoSlot() {
  const [logo, setLogo] = useState(() => {
    try { return localStorage.getItem('smklogo'); } catch { return null; }
  });
  const handle = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try { localStorage.setItem('smklogo', ev.target.result); } catch {}
      setLogo(ev.target.result);
    };
    r.readAsDataURL(f);
  };
  return (
    <label className="slot-hero" tabIndex={0} title="Klik untuk unggah logo SMKN 6 Balikpapan">
      {logo
        ? <img src={logo} alt="Logo SMKN 6 Balikpapan" />
        : <span>Klik untuk unggah logo SMKN 6 Balikpapan</span>}
      <input type="file" accept="image/*" onChange={handle} />
    </label>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  // Activate scroll-reveal and button ripple when main content is ready
  useScrollReveal(ready);
  useButtonRipple(ready);

  return (
    <>
      {/* Always mounted — SVG symbols must stay in DOM */}
      <SvgDefs />

      {/* Ambient effects — always visible */}
      <Particles />
      <ScanlineOverlay />

      {/* Gate screen */}
      {!ready && <Gate onDone={() => setReady(true)} />}

      {/* Main content — hidden behind gate, revealed after enter */}
      {ready && (
        <>
          {/* Side torches */}
          <div className="sc l" aria-hidden="true"><Fire small /><b /></div>
          <div className="sc r" aria-hidden="true"><Fire small /><b /></div>

          <nav>
            <a href="#materi">Materi</a>
            <a href="#lab">Lab Jaringan</a>
            <a href="#trouble">Troubleshooting</a>
            <a href="#kuis">Kuis</a>
            <a href="#portal">Portal Browser</a>
          </nav>

          <main>
            {/* HERO — with entrance animation class */}
            <div className="hero hero-enter">
              <div className="heroart">
                <svg className="fig" role="img" aria-label="Siswa SMK membawa pedang">
                  <use href="#sis1" />
                </svg>
                <div className="logos-hero">
                  <svg className="logo-lg" role="img" aria-label="Logo TKJ 3">
                    <use href="#tkj3" />
                  </svg>
                  <LogoSlot />
                </div>
                <svg className="fig r" role="img" aria-label="Siswi SMK membawa pedang">
                  <use href="#sis2" />
                </svg>
              </div>
              <h1><span className="glitch" data-t="SubnetKeep">SubnetKeep</span></h1>
              <p className="mut">Benteng belajar jaringan TKJ: kuasai IP, ping, gateway, dan DNS untuk keluar dari dungeon hidup-hidup.</p>
              <p><small>Dibuat oleh siswa/siswi SMK kelas 11 TKJ 3 · SMKN 6 Balikpapan</small></p>
            </div>

            <Materi />
            <Lab />
            <Trouble />
            <Quiz />
            <Portal />

            <footer>
              <small>
                SubnetKeep · Dibuat oleh siswa/siswi SMK kelas 11 TKJ 3, SMKN 6 Balikpapan.<br />
                Taklukkan jaringan, satu ping per langkah.
              </small>
            </footer>
          </main>
        </>
      )}
    </>
  );
}
