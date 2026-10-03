

export default function Materi() {
  const items = [
    {
      id: 'ip', title: 'Alamat IP',
      body: 'Identitas perangkat di jaringan. IPv4 = 32 bit, ditulis 4 oktet, contoh 192.168.1.23. Subnet mask (misal 255.255.255.0 atau /24) memisahkan bagian jaringan dan bagian host.',
    },
    {
      id: 'ping', title: 'Ping',
      body: 'Perintah untuk mengecek apakah host bisa dijangkau, memakai paket ICMP. Hasilnya menampilkan waktu balasan (ms) dan paket yang hilang.',
    },
    {
      id: 'gw', title: 'Gateway & DNS',
      body: 'Gateway adalah pintu keluar jaringan lokal (biasanya router). DNS mengubah nama domain, misalnya google.com, menjadi alamat IP.',
    },
    {
      id: 'hw', title: 'Perangkat Keras',
      body: 'NIC (kartu jaringan), kabel UTP + konektor RJ45, switch, router, access point, dan modem. Kabel straight untuk PC ke switch, crossover untuk perangkat sejenis.',
    },
    {
      id: 'sw', title: 'Perangkat Lunak',
      body: 'Sistem operasi (Windows, Linux), driver NIC, tools jaringan (ping, ipconfig, nslookup, tracert), dan aplikasi monitoring seperti Wireshark.',
    },
    {
      id: 'k3', title: 'K3LH',
      body: 'Keselamatan, Kesehatan Kerja, dan Lingkungan Hidup. Matikan & cabut listrik sebelum membongkar, pakai gelang antistatik, rapikan kabel agar tidak membuat tersandung, dan buang limbah elektronik pada tempatnya.',
    },
  ];

  return (
    <section id="materi">
      <h2>Materi</h2>
      <div className="grid">
        {items.map(m => (
          <div key={m.id} className="card">
            <h3>{m.title}</h3>
            <p>{m.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
