# LANGKAH SIAGA — Media Pembelajaran Mitigasi Bencana Interaktif

Aplikasi edukasi interaktif untuk mempelajari mitigasi bencana melalui simulasi berbasis puzzle dan animasi visual.

## Fitur Utama

- **5 Skenario Bencana**: Gempa di Rumah, Gempa di Sekolah, Gempa di Pesisir & Tsunami, Banjir Pemukiman, Kebakaran Gedung
- **Simulasi Interaktif**: Susun blok tindakan mitigasi (Pra-Bencana → Darurat → Pemulihan)
- **Validasi Jawaban**: Cek urutan mitigasi dengan feedback visual
- **Animasi Simulasi**: Visualisasi karakter & efek bencana (gempa, tsunami, banjir, kebakaran)
- **Kuis & Sertifikat**: Uji pengetahuan dan dapatkan sertifikat
- **Panduan Lengkap**: Tutorial dan panduan mitigasi per fase

## Tech Stack

- **React 18** + TypeScript
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first styling
- **TanStack Query** — Data fetching & caching
- **Lucide React** — Icon system
- **Axios** — HTTP client

## Struktur Project

```
src/
├── components/
│   ├── character/       # Character SVG animations
│   ├── mascot/          # Mascot guide component
│   ├── modals/          # Tutorial, Guide, Quiz, Certificate, About modals
│   ├── puzzle/          # PuzzlePalette, CanvasSequence, PuzzleBlock
│   ├── stage/           # SimulationStage (visual simulation)
│   └── ui/              # Button, Dialog, Input, Tabs primitives
├── lib/
│   ├── api.ts           # API wrapper (axios)
│   ├── audio.ts         # Sound engine
│   └── confetti.ts      # Confetti celebration
├── pages/
│   ├── Homepage.tsx     # Landing page (entry point)
│   └── Home.tsx         # Simulator page
├── types/
│   └── scenario.ts      # TypeScript interfaces
├── index.css            # Design system CSS variables + Tailwind
└── main.tsx             # App entry point
```

## Design System

| Token | Value |
|-------|-------|
| `--bg` | `#F0F3FA` |
| `--panel` | `#FFFFFF` |
| `--line` | `#E2E6F0` |
| `--ink` | `#1A1E2E` |
| `--ink-soft` | `#6B7185` |
| `--blue` | `#2F6FED` |
| `--blue-dark` | `#1B4FBE` |
| `--red` | `#E14B4B` |
| `--green` | `#17A868` |
| `--accent` | `#FF8A00` |
| `--shadow` | `0 8px 32px rgba(26,30,46,0.07)` |
| `--r-sm` | `8px` |
| `--r-md` | `14px` |
| `--r-lg` | `22px` |
| `--font-head` | `Outfit` |
| `--font-body` | `Plus Jakarta Sans` |

## Cara Menjalankan

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Buka `http://localhost:5173/`

### Production Build

```bash
npm run build
```

Output di folder `dist/` — siap deploy ke hosting static (Netlify, Vercel, GitHub Pages, dll).

## Alur Aplikasi

```
Homepage (landing)
    ↓ "Mulai Simulasi"
Simulator (Home.tsx)
    ↓ Pilih Skenario
    ↓ Susun Blok Tindakan
    ↓ "Periksa Urutan"
    ↓ "▶ Simulasi" (jika valid)
    ↓ Animasi berjalan
    ↓ Kuis & Sertifikat
```

## Skenario Tersedia

| ID | Title | Scene | Difficulty |
|----|-------|-------|------------|
| `rumah` | Gempa di Rumah | rumah | Pemula |
| `sekolah` | Gempa di Sekolah | sekolah | Menengah |
| `pesisir` | Gempa di Pesisir & Tsunami | pesisir | Lanjutan |
| `banjir` | Banjir Pemukiman | banjir | Menengah |
| `kebakaran` | Kebakaran Gedung | kebakaran | Lanjutan |

## Deployment

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
Tambahkan workflow `.github/workflows/deploy.yml` (lihat dokumentasi di atas).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

## Lisensi

MIT License — Media pembelajaran mitigasi bencana untuk keperluan edukasi.