const LINKS = [
  ['Video jaringan komputer', 'https://youtu.be/jr_0noNKT_w', 'Video pengenalan jaringan komputer'],
  ['Claude', 'https://claude.ai', 'Asisten AI untuk bertanya dan belajar'],
  ['Canva AI', 'https://www.canva.com', 'Membuat poster dan presentasi tugas'],
  ['Cisco NetAcad', 'https://www.netacad.com', 'Kursus jaringan resmi dari Cisco'],
];

export default function Portal() {
  const url = window.location.href;
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      const el = document.getElementById('cpm');
      if (el) { el.textContent = 'Link disalin!'; setTimeout(() => { el.textContent = 'Web ini jalan di Firefox, Chrome, Edge, Safari, atau browser apa pun.'; }, 2000); }
    });
  };
  return (
    <section id="portal">
      <h2>Portal Browser</h2>
      <div className="card links">
        <p>Masuk ke browser lewat tautan berikut:</p>
        {LINKS.map(([t, u, d]) => (
          <a key={t} href={u} target="_blank" rel="noopener noreferrer" title={d}>{t}</a>
        ))}
        <p>
          <button id="cp" onClick={copy}>Salin link web</button>{' '}
          <small className="mut" id="cpm">Web ini jalan di Firefox, Chrome, Edge, Safari, atau browser apa pun.</small>
        </p>
      </div>
    </section>
  );
}
