# Undangan Pernikahan — Abims & Rima

Landing page undangan pernikahan, static site (HTML/CSS/JS murni, tanpa build step).

## Struktur folder

```
.
├── index.html       # markup halaman
├── styles.css        # semua styling
├── script.js          # countdown + galeri
└── images/
    ├── headline.jpg
    ├── gallery-1.jpg ... gallery-5.jpg
```

## Cara jalanin lokal

Buka langsung `index.html` di browser, atau pakai extension **Live Server** di VS Code biar auto-reload tiap kali save.

## Setup GitHub + Vercel (sekali doang)

1. **Push ke GitHub**
   ```bash
   cd wedding-site
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
   (Buat repo kosong dulu di github.com/new, jangan centang "Add README" biar nggak konflik.)

2. **Connect ke Vercel**
   - Buka [vercel.com](https://vercel.com) → login pakai akun GitHub
   - Klik **Add New → Project**
   - Pilih repo yang barusan di-push
   - Framework Preset: pilih **Other** (karena ini static site, bukan Next.js/dsb)
   - Root Directory: biarin default (`.`)
   - Klik **Deploy**

Selesai — Vercel otomatis kasih URL publik (misal `nama-repo.vercel.app`).

## Update setelah itu

Karena udah connect ke GitHub, alurnya jadi:

1. Edit file di VS Code (misal ganti teks di `index.html`, atau ganti foto di `images/`)
2. Commit & push:
   ```bash
   git add .
   git commit -m "update teks lokasi"
   git push
   ```
3. Vercel otomatis re-deploy dalam ~30 detik. Nggak perlu upload manual lagi.

## Ganti/tambah foto

Taruh file baru di folder `images/`, lalu update path-nya di `index.html` (cari tag `<img>` yang relevan — untuk galeri ada 5 slot: `gal-a` sampai `gal-e`).

## Nomor rekening

Ada di `index.html`, cari `id="bankNum"`.
