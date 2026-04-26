# pause

> _Berhenti sejenak. Rasakan ini._

**Pause** adalah website single-page bertema Mental Health — sebuah ruang digital yang tenang, dirancang untuk membantu pengguna usia 18–25 tahun berhenti sejenak dari hiruk-pikuk aktivitas sehari-hari.

Dibuat oleh **Vesta**, 2026 — Universitas Pelita Harapan.

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Struktur Project](#struktur-project)
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Cara Menjalankan](#cara-menjalankan)
- [Struktur Halaman](#struktur-halaman)
- [CSS — Design Tokens](#css--design-tokens)
- [JavaScript](#javascript)
- [Aset](#aset)
- [Responsivitas](#responsivitas)
- [Aksesibilitas](#aksesibilitas)

---

## Gambaran Umum

Pause bukan tentang solusi instan atau motivasi berlebihan. Ini adalah ruang sederhana berbasis web tanpa framework, tanpa build tools — hanya HTML, CSS, dan JavaScript murni, dengan desain dark minimal yang meminimalisir distraksi visual.

---

## Struktur Project

```
pause/
├── index.html                  # Entry point — seluruh struktur halaman
└── assets/
    ├── css/
    │   ├── style.css           # Global styles, variabel, komponen
    │   └── animations.css      # Keyframes & efek scroll
    ├── js/
    │   ├── main.js             # Logika utama halaman
    │   └── popup.js            # Sistem popup reflektif
    └── images/
        └── line-art/
            ├── home-bg.svg     # Ilustrasi hero
            ├── about-line.svg  # Ilustrasi section About
            ├── tired.svg       # Ilustrasi kartu Tired
            ├── anxious.svg     # Ilustrasi kartu Anxious
            ├── overthinking.svg# Ilustrasi kartu Overthinking
            ├── popup-circles.svg # Ilustrasi popup
            └── favicon-svg.svg # Favicon
```

---

## Fitur

### Navbar

- Fixed di atas halaman dengan tinggi `70px`
- Saat user scroll lebih dari `40px`, navbar mendapat background blur (`backdrop-filter: blur(12px)`) dan border bawah tipis
- Nav link aktif di-highlight sesuai section yang sedang tampil di viewport menggunakan `IntersectionObserver`

### Hero (Home)

- Judul besar `pause` dengan ukuran responsif hingga `9rem`
- 3 lingkaran konsentris berdenyut (`pulse-ring`) sebagai background dekoratif
- SVG ilustrasi melayang pelan (`float-slow`)
- Scroll cue (teks + garis animasi `scroll-bounce`) sebagai ajakan scroll ke bawah
- Semua elemen hero masuk dengan animasi `hero-enter` bertahap (stagger delay)

### About

- Layout dua kolom: teks + ilustrasi SVG
- **Breathing Exercise (4-4-4)** — menggantikan metadata card sebelumnya:
  - 3 langkah statis: Hirup (4s), Tahan (4s), Hembuskan (4s)
  - Lingkaran animasi interaktif yang membesar saat inhale, diam saat hold, mengecil saat exhale
  - Tombol "coba sekarang" untuk memulai guided breathing, bisa di-stop kapan saja
  - Setelah 3 siklus selesai, muncul popup "everything is fine okay :)" dengan dua pilihan:
    - **"Still not good?"** (kiri) — memulai ulang sesi breathing
    - **"Okay"** (kanan) — menutup popup
- Elemen masuk dengan `fade-in` saat scroll ke viewport

### Feelings

- Grid 3 kartu: **Tired**, **Anxious**, **Overthinking**
- Setiap kartu berisi: ilustrasi SVG, deskripsi, tips praktis, dan kutipan
- **Klik kartu** → muncul popup dengan pesan personal untuk masing-masing perasaan
- Kartu masuk secara berurutan dengan stagger delay (`0ms`, `120ms`, `240ms`)
- Hover effect: `translateY(-4px)` + border lebih terang

### FAQ Accordion

- 3 pertanyaan dengan jawaban yang tersembunyi secara default
- Klik tombol `+` → jawaban muncul dengan transisi smooth (`max-height`)
- Klik lagi atau tekan `Escape` → jawaban tersembunyi kembali
- Ikon `+` berubah menjadi `−` saat terbuka (via `::after` rotation)
- Fully accessible: `aria-expanded`, `aria-controls`, keyboard navigation

### Popup Reflektif

- Muncul otomatis dengan dua kondisi:
  - **Idle ≥ 15 detik** — jika halaman didiamkan tanpa interaksi apapun
  - **Paksa setiap 30 detik** — meskipun user sedang aktif scroll/berinteraksi
- Menampilkan pesan acak dari pool 5 pesan berbahasa Indonesia
- Dapat ditutup dengan: tombol "okay, I'll pause", klik area luar card, atau tekan `Escape`
- Tidak akan stack/tumpuk jika sudah sedang tampil
- Background scroll dikunci saat popup terbuka

### Tombol "Make Everything OK"

- Berada di footer, klik untuk mendapat pesan afirmasi "Everything is OK now"
- Menampilkan loading animation sebelum pesan muncul

### Footer

- Brand `pause`, tagline, dan kredit pembuat

---

## Teknologi

| Teknologi         | Keterangan                                        |
| ----------------- | ------------------------------------------------- |
| HTML5             | Struktur semantik, ARIA attributes                |
| CSS3              | Custom Properties, Grid, Flexbox, Keyframes       |
| JavaScript (ES6+) | Vanilla JS, `strict mode`, `IntersectionObserver` |
| Google Fonts      | Poppins (weight 300, 400, 500 — regular & italic) |

> Tidak ada framework, tidak ada npm, tidak ada build step. Buka langsung di browser.

---

## Cara Menjalankan

Tidak perlu instalasi apapun. Cukup buka file `index.html` di browser modern:

```
Klik dua kali index.html
```

Atau gunakan live server (misalnya ekstensi Live Server di VS Code) untuk pengalaman development yang lebih baik.

> Membutuhkan koneksi internet hanya untuk memuat font dari Google Fonts.

---

## Struktur Halaman

```
<header>  — Navbar fixed
<main>
  ├── #home       — Hero section
  ├── #about      — Tentang Pause + Breathing Exercise
  ├── #feelings   — Kartu perasaan (Tired, Anxious, Overthinking)
  └── #faq        — FAQ accordion
<footer>  — Kredit + Tombol "make everything ok"
<div#popup-overlay>          — Popup reflektif (idle/interval)
<div#breathe-popup-overlay>  — Popup selesai breathing exercise
```

---

## CSS — Design Tokens

Semua nilai desain didefinisikan sebagai CSS Custom Properties di `:root` dalam `style.css`:

### Warna

| Token                  | Nilai                     | Keterangan                    |
| ---------------------- | ------------------------- | ----------------------------- |
| `--color-bg`           | `#0f0f0f`                 | Background utama              |
| `--color-bg-secondary` | `#1a1a1a`                 | Background section alternatif |
| `--color-bg-card`      | `#161616`                 | Background kartu              |
| `--color-text`         | `#e5e5e5`                 | Teks utama                    |
| `--color-text-muted`   | `rgba(229,229,229, 0.45)` | Teks sekunder                 |
| `--color-text-faint`   | `rgba(229,229,229, 0.18)` | Teks sangat redup             |
| `--color-border`       | `rgba(229,229,229, 0.08)` | Border default                |
| `--color-border-hover` | `rgba(229,229,229, 0.18)` | Border hover                  |

### Typography

| Token       | Nilai                       |
| ----------- | --------------------------- |
| `--fs-xs`   | `0.75rem`                   |
| `--fs-sm`   | `0.875rem`                  |
| `--fs-base` | `1rem`                      |
| `--fs-md`   | `1.125rem`                  |
| `--fs-lg`   | `1.5rem`                    |
| `--fs-xl`   | `2rem`                      |
| `--fs-2xl`  | `3rem`                      |
| `--fs-3xl`  | `4.5rem`                    |
| `--fs-hero` | `clamp(4.5rem, 14vw, 9rem)` |

### Spacing

`--space-xs` → `--space-3xl` dari `0.5rem` hingga `10rem`

---

## JavaScript

### `main.js`

Diinisialisasi saat `DOMContentLoaded`. Memanggil 8 fungsi:

| Fungsi                      | Tugas                                                                      |
| --------------------------- | -------------------------------------------------------------------------- |
| `initNavbarScroll()`        | Toggle class `is-scrolled` pada header saat scroll > 40px                  |
| `initSmoothScroll()`        | Intercept klik anchor `href="#..."` untuk smooth scroll                    |
| `initActiveNavLinks()`      | Highlight nav link sesuai section aktif via `IntersectionObserver`         |
| `initFadeInObserver()`      | Tambah class `is-visible` ke `.fade-in` saat masuk viewport                |
| `initFaqAccordion()`        | Handle expand/collapse FAQ dengan keyboard support                         |
| `initFeelingsInteraction()` | Klik kartu perasaan → popup pesan personal per perasaan                    |
| `initOkButton()`            | Tombol "make everything ok" → pesan afirmasi dengan loading                |
| `initBreathingExercise()`   | Guided breathing 4-4-4 (3 siklus) dengan animasi lingkaran + popup selesai |

### `popup.js`

| Konstanta           | Nilai   | Keterangan                         |
| ------------------- | ------- | ---------------------------------- |
| `IDLE_THRESHOLD_MS` | `15000` | Popup muncul setelah 15 detik idle |
| `MAX_INTERVAL_MS`   | `30000` | Popup muncul paksa setiap 30 detik |

Activity tracking: `mousemove`, `scroll`, `keydown`, `click`, `touchstart`

---

## Aset

Seluruh aset visual berbentuk SVG line-art, disimpan di `assets/images/line-art/`:

| File                | Digunakan di                           |
| ------------------- | -------------------------------------- |
| `home-bg.svg`       | Hero section — ilustrasi melayang      |
| `about-line.svg`    | About section — dekorasi samping       |
| `tired.svg`         | Feelings card — Tired                  |
| `anxious.svg`       | Feelings card — Anxious                |
| `overthinking.svg`  | Feelings card — Overthinking & Favicon |
| `popup-circles.svg` | Popup reflektif                        |
| `favicon-svg.svg`   | Favicon tab browser (cadangan)         |

---

## Responsivitas

| Breakpoint         | Perubahan                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `≤ 900px` (Tablet) | About section: single column, ilustrasi disembunyikan. Feelings grid: 1 kolom, max-width 480px. Nav gap dikurangi. |
| `≤ 600px` (Mobile) | Spacing `--space-lg` dikurangi ke `1.5rem`. Padding navbar dan semua section container diperkecil.                 |

---

## Aksesibilitas

- **Skip link** — `#main-content` untuk keyboard user
- **Semantic HTML** — `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<blockquote>`
- **ARIA** — `role`, `aria-label`, `aria-labelledby`, `aria-expanded`, `aria-controls`, `aria-hidden`, `aria-modal`, `aria-live`
- **Keyboard navigation** — FAQ dapat dioperasikan penuh dengan keyboard (`Enter`, `Space`, `Escape`)
- **Focus management** — Popup mengarahkan fokus ke tombol close saat terbuka
- **`prefers-reduced-motion`** — Semua animasi dan transisi dinonaktifkan untuk pengguna yang membutuhkan
