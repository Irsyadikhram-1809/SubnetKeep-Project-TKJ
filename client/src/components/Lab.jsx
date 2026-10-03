import { useEffect, useRef, useState } from 'react';

const KNOWN = {
  '192.168.1.1': [1, 4], '192.168.1.23': [0, 1], '127.0.0.1': [0, 1],
  '8.8.8.8': [12, 28], '1.1.1.1': [10, 24], 'google.com': [14, 32],
};
const DNS_MAP = {
  'google.com': '142.250.190.46', 'youtube.com': '142.250.190.78',
  'kemdikbud.go.id': '103.7.4.43',
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function randInt(a, b) { return Math.round(a + Math.random() * (b - a)); }

async function doPing(host, pushLine) {
  const isDom = /[a-z]/i.test(host) && !/^\d/.test(host);
  let ip = host;
  if (isDom) {
    ip = DNS_MAP[host] || null;
    if (!ip) { pushLine(`Ping request could not find host ${host}. Please check the name and try again.`); return; }
  }
  const k = KNOWN[host] || KNOWN[ip];
  pushLine(`\nPinging ${host}${isDom ? ' [' + ip + ']' : ''} with 32 bytes of data:`);
  let ok = 0; const ts = [];
  for (let i = 0; i < 4; i++) {
    await sleep(450);
    if (!k) { pushLine('Request timed out.'); continue; }
    const t = randInt(k[0], k[1]); ok++; ts.push(t);
    pushLine(`Reply from ${ip}: bytes=32 time=${t}ms TTL=${isDom ? 117 : 64}`);
  }
  pushLine(`\nPing statistics for ${ip}:\n    Packets: Sent = 4, Received = ${ok}, Lost = ${4 - ok} (${(4 - ok) * 25}% loss)`);
  if (ok) pushLine(`Approximate round trip: Min=${Math.min(...ts)}ms, Max=${Math.max(...ts)}ms, Avg=${Math.round(ts.reduce((a, b) => a + b, 0) / ts.length)}ms`);
}

/* ---- Terminal simulator ---- */
const IPCFG = `\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n   IPv4 Address. . . . . : 192.168.1.23\n   Subnet Mask . . . . . : 255.255.255.0\n   Default Gateway . . . : 192.168.1.1`;
const IPCFG_ALL = IPCFG + `\n   DNS Servers . . . . . : 8.8.8.8\n                           1.1.1.1\n   Physical Address. . . : 00-1A-2B-3C-4D-5E\n   DHCP Enabled. . . . . : Yes`;
const HELP_TXT = `Perintah yang tersedia:\n  ipconfig          - Info jaringan dasar\n  ipconfig /all     - Info jaringan lengkap\n  ping <ip/domain>  - Ping host\n  nslookup <domain> - Cari alamat IP domain\n  tracert <domain>  - Lacak rute ke host\n  cls               - Bersihkan layar\n  help              - Tampilkan bantuan`;

async function runCmd(raw, pushLine, clearLog) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return;
  if (cmd === 'cls') { clearLog(); return; }
  if (cmd === 'help') { pushLine(HELP_TXT); return; }
  if (cmd === 'ipconfig') { pushLine(IPCFG); return; }
  if (cmd === 'ipconfig /all') { pushLine(IPCFG_ALL); return; }
  if (cmd.startsWith('ping ')) {
    const h = raw.trim().split(' ')[1];
    if (!h) { pushLine('Usage: ping <ip atau domain>'); return; }
    await doPing(h, pushLine);
    return;
  }
  if (cmd.startsWith('nslookup ')) {
    const d = raw.trim().split(' ')[1];
    const ip = DNS_MAP[d];
    if (ip) pushLine(`Server:  dns.google\nAddress: 8.8.8.8\n\nNon-authoritative answer:\nName:    ${d}\nAddress: ${ip}`);
    else pushLine(`Server:  dns.google\nAddress: 8.8.8.8\n\n*** dns.google can't find ${d}: Non-existent domain`);
    return;
  }
  if (cmd.startsWith('tracert ')) {
    const d = raw.trim().split(' ')[1];
    pushLine(`\nTracing route to ${d} over a maximum of 30 hops:\n`);
    const hops = [
      ['192.168.1.1', 1, 2, 1], ['10.10.1.1', 8, 12, 9],
      ['203.0.113.1', 24, 30, 26], ['8.8.8.8', 28, 35, 29],
    ];
    for (let i = 0; i < hops.length; i++) {
      await sleep(400);
      const [ip, a, b, c] = hops[i];
      pushLine(`  ${i + 1}    ${a} ms   ${b} ms   ${c} ms  ${ip}`);
    }
    pushLine('\nTrace complete.');
    return;
  }
  pushLine(`'${raw.trim()}' is not recognized as an internal or external command.\nKetik "help" untuk melihat daftar perintah.`);
}

export default function Lab() {
  const [log, setLog] = useState(['SubnetKeep Terminal v1.0\nKetik "help" untuk bantuan.\nCoba: ping google.com, ipconfig, tracert google.com\n']);
  const [cmd, setCmd] = useState('');
  const [busy, setBusy] = useState(false);
  const [hist, setHist] = useState([]); const [hi, setHi] = useState(-1);
  const [pingHost, setPingHost] = useState('');
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [log]);

  const pushLine = line => setLog(l => [...l, line]);
  const clearLog = () => setLog([]);

  const execCmd = async (c) => {
    if (!c.trim() || busy) return;
    setHist(h => [c, ...h]); setHi(-1); setCmd(''); setBusy(true);
    pushLine(`C:\\> ${c}`);
    await runCmd(c, pushLine, clearLog);
    setBusy(false);
  };

  const onSubmit = e => { e.preventDefault(); execCmd(cmd); };
  const onKey = e => {
    if (e.key === 'ArrowUp' && hist.length) { const i = Math.min(hi + 1, hist.length - 1); setHi(i); setCmd(hist[i]); e.preventDefault(); }
    if (e.key === 'ArrowDown') { const i = hi - 1; setHi(i); setCmd(i >= 0 ? hist[i] : ''); }
  };

  const quickPing = async h => {
    if (busy) return;
    setBusy(true);
    pushLine(`C:\\> ping ${h}`);
    await doPing(h, pushLine);
    setBusy(false);
  };
  const doPingCustom = async () => {
    if (!pingHost.trim() || busy) return;
    await quickPing(pingHost.trim());
    setPingHost('');
  };

  return (
    <section id="lab">
      <h2>Lab Jaringan</h2>
      <div className="card">
        <h3>Informasi jaringan (simulasi)</h3>
        <p>IP: <span className="ip">192.168.1.23</span> · Mask: 255.255.255.0<br />
          Gateway: <span className="ip">192.168.1.1</span> · DNS: <span className="ip">8.8.8.8</span>, <span className="ip">1.1.1.1</span></p>
        <p>Tes ping cepat:</p>
        {['192.168.1.1', '8.8.8.8', '1.1.1.1', 'google.com'].map(h => (
          <button key={h} onClick={() => quickPing(h)} disabled={busy} style={{ marginRight: 6, marginBottom: 6 }}>
            Ping {h}
          </button>
        ))}
        <p>
          <input value={pingHost} onChange={e => setPingHost(e.target.value)} placeholder="IP / domain" style={{ width: '60%', marginRight: 8 }}
            onKeyDown={e => e.key === 'Enter' && doPingCustom()} />
          <button className="btn" onClick={doPingCustom} disabled={busy}>Ping</button>
        </p>
        <p><small className="mut">Browser tidak bisa mengirim ICMP asli, jadi hasil ping ini simulasi untuk latihan.</small></p>
      </div>

      <div className="card">
        <h3>Command Prompt</h3>
        <div className="term" onClick={() => document.getElementById('termcmd')?.focus()}>
          {log.join('\n')}
          <div className="term-input">
            <span>C:\&gt;</span>
            <input id="termcmd" value={cmd} onChange={e => setCmd(e.target.value)}
              onKeyDown={onKey} autoComplete="off" spellCheck={false} disabled={busy} />
          </div>
          <div ref={endRef} />
        </div>
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input value={cmd} onChange={e => setCmd(e.target.value)} onKeyDown={onKey}
            placeholder="Ketik perintah lalu tekan Enter..." autoComplete="off" spellCheck={false}
            disabled={busy} style={{ flex: 1 }} />
          <button className="btn" type="submit" disabled={busy}>Jalankan</button>
        </form>
        <small className="mut">Coba: help, ipconfig, ipconfig /all, ping 192.168.1.1, nslookup google.com, tracert google.com, cls</small>
      </div>
    </section>
  );
}
