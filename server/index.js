import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { materi, quiz, troubleshoot, hosts } from './data.js';

const app = express();
app.use(cors(), express.json());
const sets = { quiz, troubleshoot };
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

app.get('/api/materi', (_, res) => res.json(materi));

// Terminal simulator
app.post('/api/command', (req, res) => {
  const raw = String(req.body.cmd || '').trim();
  const [cmd, arg] = raw.split(/\s+/);
  const out = [];
  switch ((cmd || '').toLowerCase()) {
    case '': break;
    case 'help': out.push('Perintah: ping <host>, ipconfig, nslookup <host>, help, clear'); break;
    case 'clear': return res.json({ clear: true, lines: [] });
    case 'ipconfig':
      out.push('Konfigurasi IP Windows', '', 'Ethernet adapter Ethernet0:',
        '   IPv4 Address. . . . . : 192.168.1.10',
        '   Subnet Mask . . . . . : 255.255.255.0',
        '   Default Gateway . . . : 192.168.1.1');
      break;
    case 'nslookup': {
      const ip = hosts[(arg || '').toLowerCase()];
      out.push(ip ? `Name: ${arg}\nAddress: ${ip}` : `*** DNS gagal menemukan ${arg || '(kosong)'}`);
      break;
    }
    case 'ping': {
      if (!arg) { out.push('Penggunaan: ping <host>'); break; }
      const ip = hosts[arg.toLowerCase()];
      if (!ip) { out.push(`Ping request could not find host ${arg}. Periksa nama dan coba lagi.`); break; }
      const local = ip.startsWith('192.') || ip.startsWith('127.');
      out.push(`Pinging ${arg} [${ip}] with 32 bytes of data:`);
      const times = [];
      for (let i = 0; i < 4; i++) {
        const t = local ? rnd(1, 3) : rnd(18, 45);
        times.push(t);
        out.push(`Reply from ${ip}: bytes=32 time=${t}ms TTL=${local ? 64 : 117}`);
      }
      out.push('', `Ping statistics for ${ip}:`, '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)',
        `    Min = ${Math.min(...times)}ms, Max = ${Math.max(...times)}ms, Avg = ${Math.round(times.reduce((a, b) => a + b) / 4)}ms`);
      break;
    }
    default: out.push(`'${cmd}' tidak dikenali. Ketik help.`);
  }
  res.json({ lines: out.join('\n').split('\n') });
});

// Quiz + troubleshooting (jawaban dinilai di server)
app.get('/api/:kind(quiz|troubleshoot)', (req, res) =>
  res.json(sets[req.params.kind].map(({ answer, explain, ...rest }) => rest)));

app.post('/api/:kind(quiz|troubleshoot)/check', (req, res) => {
  const items = sets[req.params.kind];
  const answers = req.body.answers || [];
  const results = items.map((it, i) => ({ correct: answers[i] === it.answer, answer: it.answer, explain: it.explain }));
  res.json({ score: results.filter(r => r.correct).length, total: items.length, results });
});

// Serve build produksi
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
app.use(express.static(dist));
app.get('*', (_, res) => res.sendFile(path.join(dist, 'index.html'), e => e && res.status(404).end()));

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL) {
  app.listen(PORT, () => console.log(`SubnetKeep API di http://localhost:${PORT}`));
}

export default app;
