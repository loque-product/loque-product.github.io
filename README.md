# Dokumentasi Produk Loque

Situs statis untuk GitHub Pages. Tanpa build step: unggah isi folder ini ke akar repo `loque-product.github.io`.

```
index.html              Gerbang: Tentang Loque, manfaat, peran, istilah, status booking
bisnis.html             Bisnis & pilot (khusus tim)
roles/
  customer.html         Satu halaman per peran
  barber.html
  admin.html
  owner.html
  superadmin.html
assets/
  css/style.css         Seluruh gaya
  js/core.js            Tema, sidebar, toggle Internal, navigasi (dipakai semua halaman)
  js/render-home.js     Merender beranda
  js/render-role.js     Merender halaman peran (satu skrip untuk semua peran)
  js/render-business.js Merender halaman bisnis
  data/site.js          Versi, Tentang, istilah, status booking, INDEKS peran
  data/business.js      Data bisnis & pilot
  data/roles/<id>.js    Isi lengkap tiap peran (gambaran, aturan, fitur)
```

## Mengubah isi
- Fitur / aturan sebuah peran: edit `assets/data/roles/<id>.js`.
- Versi dan tanggal pembaruan: `META` di `assets/data/site.js` (tampil di semua halaman).
- Istilah, status booking, teks Tentang: `assets/data/site.js`.

Skema fitur: `{ no, stage, name, desc, tags?, tech?, open?, dflt?, parked?, internal? }`
`desc` untuk pembaca umum. `tech`, `open`, `dflt`, `parked`, `tags` hanya tampil di toggle Internal.
Gunakan `{{kode}}` untuk teks kode inline.

## Menambah peran
1. Tambah satu baris di `ROLES` (`assets/data/site.js`).
2. Salin `assets/data/roles/customer.js` (peran live) atau `admin.js` (peran "segera") ke `<id>.js`, lalu ubah `Loque.roles.<id>`.
3. Salin `roles/customer.html` ke `roles/<id>.html`, ubah `data-role`, judul, dan nama file skrip data.

## Tautan lama
Tautan seperti `/#customer-features` otomatis diarahkan ke `roles/customer.html#customer-features`.
