import { useEffect, useState } from 'react';
import { Fire } from './Fire.jsx';

const BOOT_LINES = [
  '> memindai jaringan dungeon...',
  '> gateway 192.168.1.1 ... OK',
  '> DNS 8.8.8.8 ... OK',
  '> api biru menyala. pintu terbuka.',
];

export default function Gate({ onDone }) {
  const [lines, setLines] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const delay = ms => new Promise(r => setTimeout(r, ms));

    (async () => {
      /* Wait for entrance animations to mostly finish before typing */
      await delay(1400);
      for (const line of BOOT_LINES) {
        if (cancelled) return;
        await delay(420);
        if (cancelled) return;
        setLines(prev => [...prev, line]);
      }
      if (!cancelled) {
        await delay(300);
        setShowBtn(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleEnter = () => {
    setOpening(true);
    setTimeout(onDone, 1200);
  };

  /* Logo upload state */
  const [logo, setLogo] = useState(() => {
    try { return localStorage.getItem('smklogo'); } catch { return null; }
  });
  const handleLogo = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try { localStorage.setItem('smklogo', ev.target.result); } catch {}
      setLogo(ev.target.result);
    };
    r.readAsDataURL(f);
  };

  return (
    <div id="gate" className={opening ? 'gate-open' : ''}>
      <div className="door door-l" />
      <div className="door door-r" />

      <div className="gate-box">
        <Fire />

        <div className="glrow">
          <svg className="gl" role="img" aria-label="Logo TKJ 3">
            <use href="#tkj3" />
          </svg>
          <label className="slot" tabIndex={0} title="Klik untuk unggah logo SMKN 6">
            {logo
              ? <img src={logo} alt="Logo SMKN 6 Balikpapan" />
              : <span>Unggah logo SMKN 6</span>}
            <input type="file" accept="image/*" onChange={handleLogo} />
          </label>
        </div>

        <h1 style={{
          fontSize: '1.8rem', fontFamily: 'Cinzel,Georgia,serif',
          color: 'var(--tx)', textShadow: '0 0 18px var(--rune)',
          margin: '0 0 .5em'
        }}>
          SubnetKeep
        </h1>

        <pre id="boot">{lines.join('\n')}</pre>

        {showBtn && (
          <button className="btn" onClick={handleEnter} autoFocus>
            Masuk ke Dungeon
          </button>
        )}
      </div>
    </div>
  );
}
