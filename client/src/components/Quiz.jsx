import { useState } from 'react';

const sh = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);

const QUIZ_DATA = [
  {
    q: 'Apa kepanjangan dari IP dalam jaringan komputer?',
    opts: ['Internet Protocol', 'Internal Process', 'Interface Port', 'Input Program'],
    ans: 0,
    exp: 'IP adalah singkatan dari Internet Protocol, protokol pengalamatan perangkat di jaringan.',
  },
  {
    q: 'Subnet mask 255.255.255.0 sama dengan notasi CIDR berapa?',
    opts: ['/24', '/16', '/8', '/32'],
    ans: 0,
    exp: '/24 berarti 24 bit pertama digunakan untuk jaringan, tersisa 8 bit untuk host.',
  },
  {
    q: 'Perintah apa yang digunakan untuk mengecek konektivitas ke host lain?',
    opts: ['ping', 'ipconfig', 'nslookup', 'tracert'],
    ans: 0,
    exp: 'ping mengirim paket ICMP ke host tujuan dan menunggu balasan untuk mengukur konektivitas.',
  },
  {
    q: 'Apa fungsi DNS?',
    opts: ['Mengubah nama domain ke IP', 'Mengatur kecepatan jaringan', 'Menghubungkan dua switch', 'Menyimpan file di server'],
    ans: 0,
    exp: 'DNS (Domain Name System) menerjemahkan nama domain seperti google.com menjadi alamat IP.',
  },
  {
    q: 'Kabel UTP jenis straight digunakan untuk menghubungkan?',
    opts: ['PC ke switch', 'Switch ke switch', 'Router ke router', 'PC ke PC'],
    ans: 0,
    exp: 'Kabel straight menghubungkan perangkat berbeda jenis, seperti PC ke switch atau switch ke router.',
  },
];

const TROUBLE_DATA = [
  {
    q: 'PC kamu tidak bisa ping ke gateway 192.168.1.1. Apa langkah pertama yang benar?',
    opts: [
      'Cek kabel UTP dan koneksi fisik NIC',
      'Langsung ganti router',
      'Restart komputer server',
      'Hubungi ISP',
    ],
    ans: 0,
    exp: 'Troubleshooting selalu mulai dari lapisan fisik: pastikan kabel terpasang dengan benar dan lampu NIC menyala.',
  },
  {
    q: 'Kamu bisa ping IP tapi tidak bisa buka website. Apa yang kemungkinan bermasalah?',
    opts: ['Konfigurasi DNS', 'Kabel UTP putus', 'NIC rusak', 'IP address salah'],
    ans: 0,
    exp: 'Jika ping IP berhasil tapi website tidak bisa dibuka, berarti masalah ada di DNS yang tidak bisa resolve nama domain.',
  },
  {
    q: 'Perintah apa yang dipakai untuk melihat IP address di Windows?',
    opts: ['ipconfig', 'ifconfig', 'netstat', 'arp'],
    ans: 0,
    exp: 'Di Windows, perintah ipconfig menampilkan informasi konfigurasi jaringan termasuk IP address.',
  },
];

function QuizSection({ data, title }) {
  const [questions] = useState(() => sh(data).slice(0, Math.min(data.length, 5)).map(q => ({
    ...q, shuffled: sh(q.opts.map((o, i) => ({ text: o, orig: i }))),
  })));
  const [ans, setAns] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const submit = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (ans[i] !== undefined && q.shuffled[ans[i]].orig === q.ans) s++;
    });
    setScore(s);
    setSubmitted(true);
  };
  const reset = () => { setAns({}); setSubmitted(false); setScore(0); };
  const allAnswered = questions.every((_, i) => ans[i] !== undefined);

  return (
    <section id={title === 'Kuis' ? 'kuis' : 'trouble'}>
      <h2>{title}</h2>
      <div id={title === 'Kuis' ? 'qbox' : 'tbox'} className="card">
        {submitted && (
          <div style={{ marginBottom: 16 }}>
            <span className="grade" style={{ font: '800 3rem Cinzel,serif', color: 'var(--torch)', textShadow: '0 0 20px var(--torch)' }}>
              {score}/{questions.length}
            </span>
            <p>{score === questions.length ? '🎉 Sempurna! Kamu kuasai materi ini!' : score >= questions.length / 2 ? '👍 Bagus! Terus berlatih.' : '💪 Pelajari lagi materinya.'}</p>
            <div className="bar"><i style={{ width: `${(score / questions.length) * 100}%` }} /></div>
            <button className="btn" onClick={reset} style={{ marginTop: 8 }}>Ulangi</button>
          </div>
        )}
        {questions.map((q, qi) => {
          const userAns = ans[qi];
          const correct = q.ans; // original index
          return (
            <div key={qi} style={{ marginBottom: 20 }}>
              <p style={{ color: 'var(--cyan)', marginBottom: 6 }}>{qi + 1}. {q.q}</p>
              {q.shuffled.map((opt, oi) => {
                let cls = 'opt';
                if (submitted) {
                  if (opt.orig === correct) cls += ' right';
                  else if (userAns === oi) cls += ' wrong';
                }
                return (
                  <button key={oi} className={cls} disabled={submitted}
                    onClick={() => setAns(a => ({ ...a, [qi]: oi }))}>
                    {userAns === oi && !submitted ? '▶ ' : ''}{opt.text}
                    {submitted && opt.orig === correct ? ' ✓' : ''}
                    {submitted && userAns === oi && opt.orig !== correct ? ' ✗' : ''}
                  </button>
                );
              })}
              {submitted && (
                <p style={{ color: 'var(--torch)', fontSize: '.9rem', marginTop: 4 }}>
                  💡 {q.exp}
                </p>
              )}
            </div>
          );
        })}
        {!submitted && (
          <button className="btn" onClick={submit} disabled={!allAnswered}>
            {allAnswered ? 'Kirim Jawaban' : `Jawab semua soal (${Object.keys(ans).length}/${questions.length})`}
          </button>
        )}
      </div>
    </section>
  );
}

export function Trouble() {
  return <QuizSection data={TROUBLE_DATA} title="Uji Troubleshooting" />;
}

export default function Quiz() {
  return <QuizSection data={QUIZ_DATA} title="Kuis" />;
}
