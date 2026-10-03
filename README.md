# SubnetKeep

Web edukasi dasar jaringan bertema dungeon/cyberpunk.
Dibuat oleh siswa/siswi kelas 11 TKJ 3, SMKN 6 Balikpapan.

## Stack
- Frontend: React 18 + Vite (`client/`)
- Backend: Node.js + Express (`server/`)

## Menjalankan
```
npm install
npm run install:all
npm run dev
```
Frontend: http://localhost:5173 (proxy `/api` ke server di port 4000).

## Produksi
```
npm run build
npm start      # Express menyajikan client/dist di http://localhost:4000
```

## API
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | /api/materi | Daftar materi |
| POST | /api/command | Simulator terminal (`ping`, `ipconfig`, `nslookup`, `help`, `clear`) |
| GET | /api/quiz, /api/troubleshoot | Soal tanpa kunci jawaban |
| POST | /api/quiz/check, /api/troubleshoot/check | Body `{answers:[0,1,...]}`, dinilai di server |

## Struktur
```
client/src/components/  Loading, Materi, Lab, Quiz, Portal, Knight
server/data.js          Materi, soal, host simulasi
server/index.js         Route Express
```
