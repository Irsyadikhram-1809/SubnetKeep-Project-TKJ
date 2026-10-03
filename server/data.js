export const materi = [
  { id: 'ip', title: 'Alamat IP (IPv4)', body: 'IPv4 terdiri dari 32 bit, ditulis 4 oktet desimal (contoh 192.168.1.10). Setiap perangkat butuh IP unik dalam satu jaringan. Subnet mask (misal 255.255.255.0 atau /24) menentukan bagian network dan host.' },
  { id: 'ping', title: 'Ping', body: 'Ping memakai paket ICMP Echo untuk menguji konektivitas. Hasil "Reply" berarti perangkat tujuan hidup; "Request timed out" berarti tidak ada balasan. TTL dan time (ms) menunjukkan jumlah hop dan latensi.' },
  { id: 'gwdns', title: 'Gateway & DNS', body: 'Gateway adalah pintu keluar menuju jaringan lain (biasanya IP router). DNS menerjemahkan nama domain (google.com) menjadi alamat IP. Tanpa DNS, kita hanya bisa mengakses lewat IP.' },
  { id: 'hw', title: 'Perangkat Keras Jaringan', body: 'Kabel UTP (straight untuk beda perangkat, crossover untuk sejenis; urutan T568B), Switch (menghubungkan perangkat dalam satu LAN berdasar MAC), Router (menghubungkan jaringan berbeda berdasar IP).' },
  { id: 'sw', title: 'Perangkat Lunak Jaringan', body: 'Sistem operasi jaringan (Windows Server, Linux, MikroTik RouterOS), aplikasi diagnosa (ping, ipconfig, tracert, nslookup, Wireshark), dan simulator seperti Cisco Packet Tracer.' },
  { id: 'k3lh', title: 'K3LH', body: 'Saat merakit/membongkar PC: matikan dan cabut daya, gunakan anti-static wrist strap, hindari area basah, pegang komponen di tepinya, rapikan kabel, dan gunakan alat sesuai fungsi.' }
];

export const quiz = [
  { q: 'Berapa jumlah bit pada alamat IPv4?', options: ['16', '32', '64', '128'], answer: 1, explain: 'IPv4 = 32 bit (4 oktet x 8 bit).' },
  { q: 'Perintah untuk menguji konektivitas ke perangkat lain adalah...', options: ['ipconfig', 'ping', 'format', 'shutdown'], answer: 1, explain: 'Ping mengirim ICMP Echo Request.' },
  { q: 'Fungsi DNS adalah...', options: ['Menerjemahkan nama domain ke IP', 'Memberi IP otomatis', 'Menguatkan sinyal', 'Mengenkripsi data'], answer: 0, explain: 'DNS = Domain Name System.' },
  { q: 'Perangkat yang menghubungkan dua jaringan berbeda adalah...', options: ['Hub', 'Switch', 'Router', 'Repeater'], answer: 2, explain: 'Router bekerja di layer 3 berdasar IP.' },
  { q: 'Tindakan awal sebelum membongkar PC adalah...', options: ['Menyalakan PC', 'Mencabut sumber daya listrik', 'Menyiram komponen', 'Melepas RAM saat menyala'], answer: 1, explain: 'Keselamatan: pastikan daya terputus.' }
];

export const troubleshoot = [
  { q: 'PC mendapat IP 169.254.x.x dan tidak bisa internet. Penyebab paling mungkin?', options: ['DHCP server tidak terjangkau', 'Monitor rusak', 'RAM penuh', 'Keyboard error'], answer: 0, explain: 'IP 169.254.x.x adalah APIPA, artinya gagal mendapat IP dari DHCP.' },
  { q: 'ping 8.8.8.8 berhasil, tetapi ping google.com gagal. Yang bermasalah?', options: ['Kabel UTP', 'DNS', 'Switch mati', 'Subnet mask'], answer: 1, explain: 'Konektivitas IP normal, resolusi nama gagal, jadi cek DNS.' },
  { q: 'ping 192.168.1.1 (gateway) Request timed out, lampu link LAN mati. Langkah pertama?', options: ['Install ulang Windows', 'Periksa kabel dan port', 'Ganti DNS', 'Ganti monitor'], answer: 1, explain: 'Mulai dari layer fisik: kabel, konektor, port.' }
];

export const hosts = {
  'google.com': '142.250.190.14', '8.8.8.8': '8.8.8.8',
  '192.168.1.1': '192.168.1.1', '127.0.0.1': '127.0.0.1', 'localhost': '127.0.0.1'
};
