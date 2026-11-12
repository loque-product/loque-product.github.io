# Loque — Product Requirements Document (PRD)

| | |
|---|---|
| Versi | 1.0 (keputusan final pilot) |
| Tanggal | 31 Okt 2026 |
| Pemilik produk | Pemilik Loque (perorangan) |
| Status | Siap dipakai sebagai acuan build V1 |
| Dokumen turunan | `index.html` v0.4 (dokumentasi presentasi, Customer dan Barber), `loque-admin-kasir.md`, `loque-owner-manajer.md`, `loque-super-admin.md` |

Dokumen ini menggabungkan seluruh keputusan dari awal pembahasan. Jika ada perbedaan dengan dokumen turunan, **PRD ini yang berlaku**. Perubahan terakhir yang menggantikan keputusan sebelumnya dicatat di bagian 18.

---

## 1. Ringkasan

Loque adalah platform booking untuk barbershop. Customer mencari barber, melihat portofolio dan harga, memilih layanan dan jam, lalu membayar **booking fee** lewat DOKU. **Sisa tagihan dibayar manual di toko** dan dicatat kasir. Tiap barber punya profil, portofolio, ulasan, dan tautan sendiri yang bisa dibagikan di Instagram atau TikTok.

Pilot berjalan di satu toko selama dua bulan. Arsitektur dirancang sebagai marketplace (banyak toko, satu barber bisa di banyak toko), tetapi V1 hanya untuk toko pilot.

## 2. Masalah dan tujuan

**Masalah**
- Booking toko berjalan lewat WhatsApp, DM Instagram, dan telepon. Admin menghabiskan waktu menjawab, jadwal sering bentrok, dan customer yang tidak datang (no-show) merugikan barber tanpa kompensasi.
- Barber tidak punya identitas digital sendiri. Reputasi melekat ke toko, bukan ke orangnya.

**Tujuan V1**
1. Customer bisa booking sendiri dari HP tanpa bantuan admin.
2. Mengurangi no-show lewat booking fee.
3. Memberi barber profil, portofolio, dan ulasan yang miliknya sendiri.
4. Memberi toko satu jadwal yang rapi untuk semua barber, termasuk walk-in.
5. Membuktikan bahwa toko mau membayar Rp 2.000 per transaksi (minggu ke-8).

**Bukan tujuan V1** (lihat bagian 17): komisi barber, loyalty, push notification, reschedule mandiri, POS penuh, pembayaran sisa tagihan lewat sistem, banyak toko.

## 3. Konteks pilot

| | |
|---|---|
| Toko | Barber Indra Hair Studio, Kabupaten Bandung |
| Durasi | 2 bulan, didahului baseline 2 minggu |
| Jam buka | Setiap hari 09.00 sampai 21.00 WIB |
| Barber | Indra, Reza, Najib, Irfan, dan tier "By barber" (kemungkinan barber baru, belum dipastikan) |
| Zona waktu | WIB untuk seluruh sistem V1 |
| Customer | Pelanggan toko; sumber utama: walk-in, WhatsApp, Instagram |

Daftar harga toko pilot (acuan pengisian katalog awal):

| Layanan | Indra | Reza | Najib | Irfan | By barber |
|---|---|---|---|---|---|
| Haircut | 100k | 55k | 45k | 45k | 40k |
| Long Trim | 120k | 70k | 60k | 60k | 50k |

Add-on: Trim 5k, razor 20k, shaver 15k, shaving 25k.
Treatments: Perming 300k, Down perm 100k, Rootlift 90k, Cold perm 400k, Hot perm 400k, Creambath 40k, Styling 25k.
Coloring: Basic 80k, Peak A Boo mulai 200k, Hairlight mulai 350k, Fashion color mulai 580k.

## 4. Peran

Lima peran. Satu orang bisa punya lebih dari satu peran (mis. owner yang juga barber), lewat satu akun dengan pemilih peran.

| Peran | Siapa | Login | Akun dibuat oleh |
|---|---|---|---|
| Customer | Pelanggan | Google | Mendaftar sendiri |
| Barber | Pemotong rambut | Email + password | Owner, atau Admin |
| Admin & Kasir | Operasional toko harian (satu peran, dua nama) | Email + password | Owner |
| Owner & Manajer | Pemilik atau pengelola toko (satu peran di V1) | Email + password | Super Admin |
| Super Admin | Tim Loque | Email + password | Seed awal |

Aturan akun staf:
- Pembuat akun menentukan password sementara. Wajib ganti password di login pertama dan wajib menyetujui Syarat staf. Password bisa diganti kapan saja.
- Hierarki: Super Admin membuat Owner; Owner membuat Admin/Kasir dan Barber; Admin membuat Barber; Kasir (yang sama dengan Admin) tidak membuat akun selain Barber. Tidak ada yang bisa membuat peran di atas levelnya.
- Owner bisa reset password staf dan menonaktifkan keanggotaan. Menonaktifkan tidak menghapus orangnya, portofolio, atau ulasan.
- Model data: **orang** ↔ **keanggotaan toko** ↔ **set peran**. Profil, portofolio, dan ulasan barber melekat ke orang, bukan ke toko.
- Reputasi toko diukur lewat Google Maps, bukan lewat Loque.

## 5. Aturan inti produk

### 5.1 Jadwal dan slot
- Slot per **30 menit**. Durasi layanan berupa kelipatan 30 menit, terikat pada **layanan dan barber**.
- Customer hanya bisa memilih jam yang muat dengan total durasi layanan terpilih.
- Kalender menampilkan 45 hari ke depan dengan jumlah tanggal tersedia.
- Jam yang penuh tampil "Tidak tersedia" tanpa alasan.
- Prioritas aturan: **jadwal toko > jam kerja barber > blok barber**.
- Blok waktu tidak bisa disimpan di atas booking yang sudah ada. Sistem menampilkan "N booking terdampak"; booking dipindahkan atau dibatalkan dulu oleh Admin. Berlaku sama untuk jadwal toko.
- Blok bisa berupa sebagian jam, satu hari penuh, atau rentang tanggal, dan bisa berulang mingguan.

### 5.2 Hold slot dan booking
- Slot ditahan **15 menit** selama customer membayar. Sesi pembayaran DOKU kedaluwarsa pada waktu yang sama.
- Satu customer hanya boleh punya **satu hold belum dibayar**. Booking kedua menawarkan "Lanjutkan pembayaran" atau "Batalkan dan buat baru" (batal melepas slot tanpa fee).
- Booking menyimpan snapshot **harga, durasi, dan booking fee** saat dibuat. Perubahan setelahnya tidak memengaruhi booking yang ada.
- Pembayaran yang masuk setelah hold kedaluwarsa ditandai untuk Admin dan ditangani manual selama pilot.

### 5.3 Harga dan durasi
- Harga dan durasi = nilai default layanan toko + **override per keanggotaan** (barber di toko itu). Tidak ada matriks penuh barber × layanan.
- Layanan terfilter menurut gender yang dipilih (Pria atau Wanita). Barber yang tidak melayani gender itu disembunyikan.
- Pilihan eksklusif: "Haircut or Long Trim". Add-on bisa banyak.
- Layanan coloring tampil sebagai "mulai dari" dengan total estimasi.
- Tidak ada "any barber".

### 5.4 Booking fee (bisa dikonfigurasi)

Booking fee **dibayar online lewat DOKU** saat booking dan dapat diatur di sistem: nominal dan skema. Default: **Rp 10.000, skema "Potong tagihan"**. Nominal tetap (bukan persen). Disimpan per booking.

Dua skema yang wajib didukung (ditambah opsi mati):

| Skema | Perlakuan | Contoh (layanan Rp 55.000, fee Rp 10.000) |
|---|---|---|
| **A. Potong tagihan** (default) | Fee menjadi kredit atas total tagihan layanan. Customer membayar sisanya di toko. | Online Rp 10.000, di toko Rp 45.000. Total customer Rp 55.000. |
| **B. Terpisah (biaya tambahan)** | Fee berdiri sendiri di luar tagihan. Tagihan layanan dibayar penuh di toko. | Online Rp 10.000, di toko Rp 55.000. Total customer Rp 65.000. |
| **Mati** | Nominal 0. Tidak ada pembayaran online; booking langsung Confirmed. | Untuk barber solo. |

Aturan:
- Semua teks yang menyebut fee (ringkasan booking, checkout, layar sukses, detail booking, FAQ, Syarat, tagihan kasir) **mengikuti skema booking tersebut**, bukan skema toko saat ini.
- Perubahan nominal atau skema hanya berlaku untuk **booking baru**. Booking lama dan pembayaran yang sedang terbuka tidak berubah.
- Customer batal atau no-show: fee **hangus** di kedua skema. Toko membatalkan: fee **dikembalikan**.
- **Skema A, tagihan lebih kecil dari fee:** kredit dibatasi sebesar total tagihan; tidak ada kembalian. (Default yang dipakai, belum dikonfirmasi. Lihat bagian 19.)
- Skema A menjadi insentif datang (fee hilang jika no-show). Skema B tidak memberi insentif itu karena customer yang tidak datang justru hemat harga layanan; dipertahankan karena diminta sebagai opsi toko.
- Fee bukan deposit dan bukan pendapatan Loque. Dana masuk ke merchant DOKU toko.

### 5.5 Pembayaran
- Booking fee: DOKU hosted checkout, termasuk QRIS yang bisa diunduh. Tiap toko memakai **merchant DOKU sendiri**; Loque tidak memegang dana.
- **Sisa tagihan dibayar manual di toko.** Kasir mencatat metode (tunai atau lainnya) dan menandai Selesai. Tidak ada pembayaran sisa tagihan lewat sistem di V1.
- Refund (hanya pembatalan toko) diproses **manual di luar sistem**; sistem hanya mencatat status refund.
- Customer tidak ditagih biaya tambahan QRIS. (Loque tidak membebankan biaya QRIS ke customer; BI tidak menganjurkannya.)

### 5.6 Status booking

| Status | Arti | Diubah oleh |
|---|---|---|
| Unpaid | Dibuat, fee belum dibayar. Slot ditahan 15 menit. | Sistem |
| Expired | Waktu 15 menit habis. Slot dilepas. | Sistem |
| Confirmed | Fee sudah dibayar. | Sistem (setelah DOKU konfirmasi) |
| Completed | Kunjungan selesai, tagihan dicatat. Ulasan terbuka. | Admin/Kasir |
| Cancelled by customer | Customer membatalkan, atau minta batal lewat WhatsApp. Fee hangus. | Customer atau Admin |
| Cancelled by shop | Toko membatalkan, atau customer menolak jadwal baru dari toko. Fee dikembalikan. | Admin |
| No-show | Customer tidak datang. Fee hangus. | Admin, dapat di-undo |

Status refund adalah field **terpisah**: "Refund diproses", "Refund selesai". Booking no-show tampil di tab Dibatalkan dengan label "Tidak hadir".

### 5.7 Walk-in
- Dicatat Admin atau Kasir sebagai **booking instan**: slot langsung tidak tersedia.
- Nama wajib; nomor telepon opsional. Booking fee tidak berlaku.
- Nomor telepon unik tetapi belum diverifikasi. Kunjungan walk-in dicocokkan ke akun customer lewat nomor telepon dan muncul di riwayatnya setelah ia mendaftar. Risiko orang lain mengklaim nomor diterima di pilot.

### 5.8 Penyelesaian, tagihan, dan void
- **Transaksi** = satu tagihan selesai yang terkait booking atau walk-in, satu per tagihan.
- Tagihan dibuat dari booking atau walk-in; Admin/Kasir menambah baris bebas (add-on, minuman, produk), memperhitungkan booking fee menurut skema booking, mencatat pembayaran manual, lalu menandai Selesai.
- **Void:** kasir menandai transaksi void dengan alasan. Sistem membuat token. Owner melihat token di daftar void dan memberi kode persetujuan di luar sistem (kode = token; token tidak boleh tampil di layar kasir). Kasir memasukkan kode, void berlaku.
- Owner bisa **menolak** void dengan catatan. Token kedaluwarsa jika tidak dipakai (mis. 24 jam). Void di atas batas nominal diberi tanda khusus (angka batas belum ditetapkan). Daftar void bisa difilter per kasir, alasan, dan tanggal.
- Void boleh kapan saja. Void yang disetujui membatalkan biaya Rp 2.000 untuk transaksi itu; jika terjadi setelah periode ditutup, menjadi **kredit** di periode berikutnya.

### 5.9 No-show
- Hanya Admin/Kasir yang bisa menandai. Tombol aktif setelah jam mulai; jika belum 15 menit, muncul konfirmasi "Belum 15 menit, lanjutkan?".
- Di menit ke-10 ada tombol WhatsApp "Hubungi tamu" dengan pesan terisi.
- Bisa di-undo. Penandaan dan undo masuk log audit.
- Aturan **masa tunggu 15 menit** tetap tertulis di Syarat customer.

## 6. Persyaratan: Customer (C)

Login dengan Google. Browsing tanpa login; login diminta saat mulai aksi booking. Layar booking, pembayaran, dan akun dilindungi auth guard.

| ID | Fitur | Persyaratan |
|---|---|---|
| C1 | Login Google | Satu tombol. Di browser in-app (Instagram, TikTok) tampil gerbang "Buka di browser" karena Google memblokir login di sana. Barber dan parameter dibawa lewat URL dan OAuth `state`. |
| C2 | Profil pertama kali | Konfirmasi nama, isi nomor WhatsApp, dengan konfirmasi "Nomor ini benar?". Nomor sengketa ditetapkan ulang Super Admin. |
| C3 | Banner utama | Foto toko, tombol "Booking Baru". |
| C4 | Kartu booking mendatang | Janji berikutnya, status, dan "Bayar di toko: Rp X" (sisa menurut skema booking fee). |
| C5 | Riwayat + Quick Rebook | "Pesan Lagi" mengisi ulang layanan, barber, dan data tamu. |
| C6 | Info toko ringkas | Jam buka hari ini, status buka/tutup, alamat, Maps. |
| C51 | Beranda sebelum login | Banner, info toko, daftar barber tanpa login. Aksi booking diarahkan ke login. |
| C7 | Daftar barber | Cari, filter spesialisasi, foto, rating. Tanpa login. |
| C8 | Profil barber | Bio, spesialisasi, harga, galeri, ulasan. Tanpa login. |
| C9 | Booking dari profil | "Booking dengan [Nama]" memulai booking dengan barber terpilih. |
| C10 | Info Toko | Foto, alamat, Maps, jam, WhatsApp, Instagram, TikTok, galeri. |
| C47 | Tautan barber | `/b/<slug>?ref=ig`. Barber, pilihan awal, dan `ref` dibawa lewat URL dan login Google. Barber dicari di server dari slug; harga tidak diambil dari URL. Barber diganti nama atau nonaktif: redirect atau halaman cadangan. |
| C53 | Laporkan foto portofolio | Tanpa login. Alasan wajib, kontak opsional. "Saya ada di foto ini" atau "Anak saya" langsung menyembunyikan foto sampai selesai diperiksa. Laporan lain: foto tetap tampil sampai diperiksa. Pembatasan laju per perangkat/IP; CAPTCHA bila ada penyalahgunaan. |
| C11 | Jalan masuk booking | Dari "Booking Baru", "Pesan Lagi", atau profil barber. |
| C12 | Langkah 1: Data Tamu | Diri sendiri atau orang lain, gender Pria/Wanita. Dilewati jika toko hanya melayani satu gender. |
| C13 | Langkah 2: Layanan | Multi-layanan dan add-on, rentang harga. |
| C14 | Harga per barber | Harga dan durasi mengikuti barber, dikunci saat booking dibuat. |
| C15 | Harga "Mulai dari" | Coloring: harga awal dan total estimasi. |
| C16 | Langkah 3: Barber | Total harga per barber, badge "Paling hemat" dan "Best Rated". Preview profil. |
| C17 | Jam terdekat | Kartu barber menampilkan jam kosong terdekat. |
| C18 | Langkah 4: Jadwal | Kalender 45 hari. |
| C19 | Slot waktu | Per 30 menit, hanya yang muat dengan durasi. |
| C20 | Langkah 5: Ringkasan & Bayar | Rincian layanan, fee menurut skema, sisa dibayar di toko. Kebijakan batal, no-show, reschedule tampil sebelum bayar. |
| C21 | Booking fee | Sesuai bagian 5.4. |
| C22 | Pembayaran DOKU | Checkout DOKU, QRIS bisa diunduh, hold 15 menit, satu unpaid hold per akun. |
| C23 | Layar sukses | Kode booking, ringkasan, sisa dibayar di toko. |
| C24 | Notifikasi | Daftar dalam aplikasi dengan penanda belum dibaca. Tanpa push di V1. |
| C25 | Tautan notifikasi | Membuka booking atau ulasan; lonceng menunjukkan jumlah baru. |
| C26 | Tab booking | Mendatang, Selesai, Dibatalkan. |
| C27 | Detail booking | Jadwal, barber, layanan, rincian (total, fee, sisa), info toko, tombol WhatsApp ke admin dengan pesan terisi. Tanpa reschedule mandiri. |
| C28 | Google Calendar | Tambahkan satu tombol. |
| C29 | Detail Transaksi | Status, referensi, metode, nominal, waktu pembayaran fee. |
| C30 | Bukti Pembayaran | Unduh PNG bukti pembayaran booking fee. |
| C31 | Lanjutkan pembayaran | Selesaikan pembayaran tertunda selama hold. |
| C32 | Batalkan booking | Customer membatalkan sendiri, peringatan fee hangus. |
| C48 | Dibatalkan oleh toko | Status, alasan, status refund. Slot dilepas, notifikasi dikirim. |
| C49 | Jadwal diubah admin | Notifikasi dalam aplikasi, ditambah WhatsApp dari toko. |
| C52 | Tidak hadir | Status oleh admin; fee hangus; tanpa ajakan ulasan. |
| C33 | Ulas barber | 1 sampai 5 bintang, komentar maks. 300 karakter, terbuka setelah Completed. |
| C34 | Dampak ulasan | Rating langsung tampil di profil barber. |
| C35 | Ulasan Google Maps | Tombol ulas toko di Google Maps. |
| C36 | Ulasan Saya | Semua ulasan yang pernah ditulis. |
| C37 | Edit ulasan | Ditandai "Diedit"; rating barber diperbarui. |
| C38 | Hapus ulasan | Rating dan jumlah ulasan dihitung ulang. |
| C54 | Riwayat walk-in | Kunjungan walk-in dengan nomor customer muncul di riwayat dan bisa diulas. |
| C39 | Profil | Nama, email, telepon. |
| C40 | Bantuan (FAQ) | Termasuk aturan fee dan pembatalan. |
| C41 | Syarat & Ketentuan | Termasuk no-show dan pembatalan. |
| C42 | Privasi & UU PDP | Data, penerima, lama simpan, hak customer, event analytics. |
| C43 | Hapus Akun & Data | Ditolak jika ada booking mendatang. |
| C44 | Akses dan logout | Logout dengan konfirmasi. |
| C46 | Halaman 404 | Jalan kembali ke beranda. |
| C45 | Design system (internal) | Galeri komponen untuk developer. |
| C50 | Funnel tracking (internal) | Event: profil dilihat, booking ditekan, login, layanan, slot, pembayaran dibuka, dibayar, ditinggalkan, beserta `ref`. ID pseudonim, dicantumkan di halaman privasi. |

Semua fitur ulasan customer (C33 sampai C38) masuk MVP.

## 7. Persyaratan: Barber (B)

Login email + password. Aplikasi sederhana: jadwal hari ini, atur jam kerja, rawat portofolio.

| ID | Fitur | Persyaratan |
|---|---|---|
| B1 | Login | Email + password dari pembuat akun. Lupa password lewat email dengan batas percobaan dan penguncian. |
| B2 | Login pertama | Wajib ganti password dan setuju Syarat staf (waktu dicatat). |
| B3 | Ganti password | Kapan saja. |
| B4 | Akses dan keluar | Belum login diarahkan ke login; keluar dengan konfirmasi. |
| B5 | Ganti peran | Pemilih peran untuk orang dengan banyak peran. Tampilan barber hanya data miliknya. |
| B6 | Jadwal hari ini | Booking milik barber, urut jam: jam, customer, layanan, durasi, status. Jam kosong dan blok terlihat. Booking Unpaid tidak tampil. |
| B7 | Ganti hari | Strip tanggal. |
| B8 | Detail booking | Hanya baca: nama, telepon, layanan, harga dan durasi saat booking, sumber, tombol WhatsApp. Nomor hanya untuk urusan booking (Syarat staf). |
| B9 | Data segar | Refresh otomatis berkala dan tarik-untuk-refresh; "Diperbarui 14.05". |
| B10 | Jam kerja | Per hari, kelipatan 30 menit, di dalam jam buka toko. Owner dan Admin bisa mengubah untuk semua barber. |
| B11 | Blok waktu | Sebagian jam, hari penuh, atau rentang tanggal; bisa berulang mingguan. Owner dan Admin bisa untuk semua barber. |
| B12 | Blok di atas booking | Ditolak dengan "N booking terdampak". |
| B13 | Aturan toko | Libur dan jadwal toko terlihat di kalender, hanya baca. |
| B14 | Daftar blok | Lihat dan hapus dengan konfirmasi. |
| B15 | Profil | Foto, cover, bio, spesialisasi. Nama dan toko mengikuti akun. |
| B16 | Unggah portofolio | Maks. **9 foto**, keterangan, urutan, hapus. Tiap unggahan butuh centang persetujuan: "Pelanggan (atau orang tua/wali jika di bawah 18 tahun) setuju fotonya ditampilkan di Loque". Foto langsung tampil. Centang dicatat dengan siapa dan kapan. Foto dikompres dan metadata lokasi dihapus. Ada tips agar foto berfokus pada rambut. |
| B17 | Pratinjau customer | Lihat profil sendiri seperti dilihat customer. (Fitur pertama dipotong jika cakupan dikecilkan.) |
| B18 | Tautan pribadi | Tautan siap salin untuk Instagram, TikTok, WhatsApp. |
| B19 | Kode QR | Unduh QR dari tautan. |
| B20 | Statistik tautan | Profil dilihat dan booking dari tautan bulan ini, per kanal. |
| B21 | Ulasan saya | Daftar ulasan, rata-rata, jumlah. |
| B22 | Laporkan ulasan | Dengan alasan; Super Admin memutuskan; status Dilaporkan, Ditinjau, Dihapus, Dipertahankan terlihat. |
| B23 | Notifikasi | Dalam aplikasi: booking baru, batal oleh customer, batal oleh toko, jadwal diubah, ulasan baru, hasil laporan. |
| B24 | Akun | Nama, email (bisa diubah sendiri), keanggotaan toko (hanya baca). |
| B25 | Syarat & Privasi | Syarat staf, tanggung jawab persetujuan foto, nomor customer hanya untuk booking, hak UU PDP. |
| B26 | Tanpa keanggotaan aktif | Masih bisa kelola profil, portofolio, tautan, ulasan; tidak melihat booking dan data customer. |
| B27 | Hapus akun & data | Ditolak jika ada booking mendatang. |
| B28 | Pemberitahuan offline | Banner saat tidak terhubung. |
| B29 | Halaman 404 | Jalan kembali. |
| B30 | Log audit (internal) | Login, blok, unggahan dan persetujuan, laporan ulasan. Tidak terlihat barber. |

Aturan:
- Barber **tidak** menyelesaikan booking dan tidak menandai no-show.
- Harga, durasi, dan jadwal barber diatur oleh Admin/Owner; barber mengatur jam kerja dan blok untuk dirinya sendiri.
- Kriteria hapus ulasan: bukan kunjungan nyata, kasar atau diskriminatif, memuat data pribadi, jelas tentang toko lain. Tidak pernah karena negatif.

## 8. Persyaratan: Admin & Kasir (A)

Satu peran, dua nama. Tiap orang punya akun pribadi.

| ID | Fitur | Persyaratan |
|---|---|---|
| A1 | Login dan akun | Email + password, ganti password wajib di login pertama. |
| A2 | Timeline | Layar utama: kalender timeline semua barber (kolom per barber, baris per 30 menit). Di HP menjadi daftar per barber. |
| A3 | Notifikasi | Daftar dalam aplikasi dengan penanda belum dibaca; refresh otomatis. Tanpa push. |
| A4 | Detail booking | Customer, layanan, barber, status, fee, riwayat perubahan, tombol WhatsApp. |
| A5 | Walk-in cepat | Tap slot kosong di timeline: barber terisi dari kolom, isi nama (wajib), telepon (opsional), layanan. |
| A6 | Walk-in tombol | Tombol "Walk-in" terpisah dengan form penuh (barber, jam). |
| A7 | Ubah booking (form) | Lewat form, **tanpa drag**: jadwal, barber, layanan (tambah/ganti saat kunjungan), nama dan telepon customer. |
| A8 | Pesan WhatsApp | Setelah pindah jadwal atau ganti barber, buka WhatsApp dengan pesan terisi ke nomor customer. Ganti barber: harga dan durasi mengikuti barber baru; jika lebih mahal, customer menyetujui lewat WhatsApp, jika menolak dibatalkan sebagai "oleh toko" dengan refund. |
| A9 | Bentrok durasi | Jika layanan tambahan membuat slot kelebihan, tagihan bertambah, slot tidak berubah otomatis, sistem memperingatkan bentrok, Admin menggeser booking berikutnya lewat form. Tidak ada tombol perpanjang. |
| A10 | Tagihan | Dari booking atau walk-in; tambah baris bebas; booking fee diperhitungkan menurut skema booking; tagihan Rp 0 dan tagihan hanya berisi minuman/produk tidak ditagih Loque. |
| A11 | Catat pembayaran | **Manual**: pilih metode (tunai atau lainnya), konfirmasi nominal, tandai Selesai. Waktu selesai dicatat sebagai data penyetelan durasi. |
| A12 | No-show | Sesuai 5.9. |
| A13 | Batal atas permintaan customer | Pilihan "Batalkan atas permintaan customer", fee hangus, alasan opsional. |
| A14 | Batal oleh toko | Dengan alasan. Masuk daftar "Perlu di-refund"; Admin transfer manual lalu tandai "Refund selesai" dengan referensi. |
| A15 | Ajukan void | Sesuai 5.8. Admin tidak bisa menyetujui void sendiri. |
| A16 | Kelola jadwal | **Admin bisa mengubah jadwal**: jam buka dan libur toko, jam kerja dan blok semua barber. Tidak bisa disimpan jika menimpa booking (tampil jumlah terdampak). Semua perubahan masuk log audit. |
| A17 | Kelola harga | **Admin bisa mengubah katalog**: layanan, add-on, harga default, override per barber, durasi (kelipatan 30 menit). Booking yang sudah ada tetap memakai snapshot. Semua perubahan harga masuk log audit dan terlihat Owner. |
| A18 | Konfigurasi booking fee | **Admin bisa mengatur** nominal dan skema (Potong tagihan, Terpisah, Mati). Berlaku untuk booking baru. Perubahan masuk log audit. |
| A19 | Buat akun Barber | Dengan password sementara. |
| A20 | Cari customer | Nama atau telepon; riwayat kunjungan di toko ini saja. |
| A21 | Ringkasan hari ini | Hanya baca: total tunai vs lainnya, selesai, no-show, void. Tanpa shift atau hitung kas. |

## 9. Persyaratan: Owner & Manajer (O)

Owner memiliki semua kemampuan Admin ditambah hal di bawah.

| ID | Fitur | Persyaratan |
|---|---|---|
| O1 | Dasbor | Pertama: ringkasan hari dan bulan ini; daftar void menunggu persetujuan; daftar refund belum selesai; tagihan Loque bulan ini. |
| O2 | Daftar void | Token, transaksi, kasir, alasan, waktu, status; setujui lewat kode, tolak dengan catatan, kedaluwarsa, filter, tanda void di atas batas. |
| O3 | Akun staf | Buat Admin/Kasir dan Barber; reset password; nonaktifkan keanggotaan; log audit staf. |
| O4 | Log audit | Void, no-show, perubahan harga, jadwal, booking fee, akses penting. |
| O5 | Laporan | Pendapatan per hari/bulan (tunai vs lainnya), booking per barber (selesai, no-show, batal; bukan komisi), sumber booking (online, walk-in, `ref`), ekspor CSV. |
| O6 | Invoice Loque | Daftar transaksi ditagih per periode dan invoice PDF yang bisa diunduh, lengkap dengan rincian dan kredit. |
| O7 | Profil toko | Foto, alamat, jam, WhatsApp, Instagram, galeri; Super Admin juga punya akses. |
| O8 | Status DOKU | Hanya melihat Terhubung atau Bermasalah. Kredensial tidak tampil. |
| O9 | Multi peran | Pemilih peran jika juga barber atau kasir. |

Catatan: ekspor CSV memuat nomor telepon; perlu pembatasan akses dan pencatatan di log audit.

## 10. Persyaratan: Super Admin (S)

| ID | Fitur | Persyaratan |
|---|---|---|
| S1 | Penyiapan toko | Checklist berurutan: toko, owner, merchant DOKU, katalog dari pricelist, jam, tes pembayaran, buka. Toko tidak tampil publik sebelum selesai. |
| S2 | Kredensial DOKU | Hanya Super Admin yang memasukkan; tidak ditampilkan lagi setelah disimpan. |
| S3 | Antrean foto | Laporan foto portofolio. Foto yang disembunyikan ditangani dalam **48 jam**. |
| S4 | Antrean ulasan | Laporan ulasan dari barber. Batas **7 hari**. |
| S5 | Keputusan moderasi | Alasan wajib; barber diberi tahu hasil dan alasannya; lewat batas, penanda. |
| S6 | Best Rated | Otomatis: rating tertinggi dengan minimum **5 ulasan**; Super Admin dapat menyembunyikan jika ada indikasi manipulasi. |
| S7 | Sengketa nomor | Layar dengan kolom nomor, akun pemilik saat ini, pelapor, bukti (teks/foto), status, keputusan, alasan, riwayat nomor per akun. Penetapan ulang memindahkan walk-in dan ulasan terkait. |
| S8 | Tagihan toko | Daftar transaksi dan tagihan per toko dan bulan, ekspor CSV, invoice PDF otomatis. |
| S9 | Invoice | Nomor berurutan, identitas Loque (perorangan), tanpa PPN, lampiran rincian (tanggal, booking atau walk-in, nominal). Status Dibayar/Belum dibayar ditandai manual. |
| S10 | Log audit | Semua akses data customer dan semua aksi Super Admin tercatat. Akses penuh ke data, tanpa pembatasan lain. |

## 11. Model bisnis dan penagihan

- Loque menagih **toko Rp 2.000 per transaksi selesai** (online maupun walk-in), lewat **invoice PDF bulanan**. Loque tidak memegang dana customer.
- **Ditagih:** tagihan selesai terkait booking atau walk-in dengan total di atas nol.
- **Tidak ditagih:** booking belum dibayar, hold kedaluwarsa, pembatalan, no-show, tagihan Rp 0, tagihan hanya berisi minuman atau produk. Void atau refund setelah selesai membatalkan biayanya.
- **Periode:** tanggal 26 bulan lalu sampai tanggal 25 bulan ini; invoice dibuat saat tutup tanggal 25. Void setelah tutup menjadi kredit di periode berikutnya; invoice lama tidak diubah.
- Pembayaran invoice lewat transfer, status ditandai manual.
- Pajak: Loque perorangan, bukan PKP (batas PKP Rp 4,8 miliar); invoice tanpa PPN. Urusan pajak ditunda; pajak di tagihan toko diatur per toko, default mati. Isi identitas invoice tetap perlu dipastikan sebelum invoice pertama.
- Walk-in tunai bergantung pada kasir yang mencatat. Dianggap urusan SOP toko.
- Booking fee tidak dimaksudkan sebagai pendapatan Loque.

## 12. Notifikasi

- V1 hanya notifikasi **dalam aplikasi** (daftar dengan penanda belum dibaca) untuk Customer, Barber, dan Admin.
- Customer diberi tahu pembatalan atau perubahan jadwal oleh toko lewat notifikasi dan WhatsApp dari toko (tombol dengan pesan terisi).
- Reminder dan push ditunda.

## 13. Privasi dan kepatuhan (UU PDP)

- Halaman privasi: data yang dikumpulkan, penerima, lama penyimpanan, hak customer, event analytics (ID pseudonim).
- Portofolio: persetujuan customer atau orang tua/wali (di bawah 18 tahun) lewat centang saat unggah; panduan, bukan larangan wajah atau anak. Barber bertanggung jawab (Syarat staf).
- Laporan foto tanpa login; "Saya ada di foto ini" atau "Anak saya" langsung menyembunyikan foto.
- Hapus akun dan data untuk customer dan barber; ditolak jika ada booking mendatang.
- Nomor customer hanya untuk urusan booking; tidak ada pencegahan teknis, aturan di Syarat staf.
- Super Admin berakses penuh; seluruh akses tercatat dan perlu dijelaskan di halaman privasi.
- Ekspor CSV memuat data pribadi; akses dibatasi dan dicatat.

## 14. Non-fungsional

- **Platform:** PWA (web yang bisa dipasang di layar HP); mobile-first. Aplikasi staf di tablet/HP/komputer.
- **Zona waktu:** WIB di V1.
- **Pembayaran:** DOKU hosted checkout, QRIS; satu merchant DOKU per toko.
- **Konsistensi:** pencegahan double-booking pada slot; hold dan sesi DOKU sinkron 15 menit; webhook DOKU idempoten.
- **Audit:** log audit untuk void, no-show dan undo, perubahan harga/jadwal/fee, akses data customer, akun.
- **Keamanan:** password staf di-hash; pembatasan percobaan login; kredensial DOKU tidak ditampilkan; upload foto dikompres dan dibersihkan metadatanya.
- **Penelusuran:** funnel tracking dengan `ref`; ID referensi transaksi agar dapat dicocokkan dengan laporan merchant DOKU.
- **Offline:** banner offline; tanpa fungsi offline penuh.

## 15. Metrik keberhasilan pilot

Ambang adalah **placeholder** sampai baseline terkumpul.

| Metrik | Menguji | Aturan sementara |
|---|---|---|
| Konversi pembayaran (dibuka ke dibayar) | Booking fee dan checkout berfungsi | Di bawah ±60%: periksa fee dan UX checkout |
| No-show rate vs baseline toko | Booking membantu barber | Tidak turun: fee tidak bekerja |
| Booking dari customer baru dan tautan `ref` | Loque membawa visibilitas | Mendekati nol: Loque sebatas alat booking |
| Booking ditandai selesai atau no-show di hari yang sama | Ketergantungan pada kasir | Di bawah ±95%: status dan ulasan tak bisa dipercaya |
| Ulasan dihapus karena "bukan kunjungan nyata" | Risiko klaim nomor | Naik: tinjau kode klaim di struk |
| Kesediaan owner membayar (minggu ke-8) | Ada bisnisnya | Ya atau tidak, plus harga |

**Baseline 2 minggu sebelum rilis** (prioritas jika waktu terbatas: nomor 1, 4, 5, 7, 11):
1. Customer per minggu (total; hari kerja vs akhir pekan)
2. Barber aktif, jam kerja, customer per barber per hari
3. Jam ramai vs jam kosong
4. Cara customer datang (walk-in, WhatsApp, DM Instagram, telepon)
5. Tingkat no-show (aturan 15 menit)
6. Biaya satu no-show (rata-rata tiket × seberapa sering jam itu terisi walk-in)
7. Customer repeat vs baru; yang minta barber tertentu
8. Sumber customer baru
9. Rata-rata tiket dan layanan umum
10. Tunai vs QRIS; iPhone vs Android
11. Waktu admin untuk booking per hari
12. Apakah semua transaksi dicatat
13. Harga yang mau dibayar owner
14. Syarat mengambil toko ke-2

Jadwal: baseline 2 minggu, pilot 8 minggu, checkpoint minggu ke-4, go/no-go toko ke-2 di minggu ke-8.

## 16. Risiko utama

1. **Insentif fee.** Skema B tidak memberi insentif datang; Skema A baru efektif jika fee hangus benar-benar dijalankan.
2. **Admin = kasir dan bisa mengubah harga serta jadwal.** Satu orang mencatat bayar, menyelesaikan, menandai no-show, dan mengubah katalog. Kontrol hanya log audit, visibilitas Owner, snapshot harga di booking, dan persetujuan owner untuk void. Pantau perubahan harga, void, dan no-show per akun.
3. **Token void = kode persetujuan.** Efektif hanya jika token tidak pernah tampil di layar kasir.
4. **Owner sebagai penjaga tunggal** void dan refund. Ukur waktu tunggu dua minggu pertama.
5. **Pembayaran sisa manual.** Transaksi tunai bergantung disiplin kasir; kesalahan dicatat memengaruhi tagihan Rp 2.000 dan statistik. Cocokkan tiap transaksi selesai ke tagihan.
6. **Nomor telepon belum diverifikasi.** Klaim oleh orang yang salah, penetapan ulang sepihak oleh Super Admin tanpa pemberitahuan ke pemilik lama.
7. **Super Admin satu orang berakses penuh,** hanya pengaman log; target bernilai tinggi.
8. **Login Google di browser in-app** memutus alur jika gerbang "Buka di browser" gagal; uji di Instagram dan TikTok sebelum rilis.
9. **PWA di iOS** terbatas; baseline menanyakan komposisi iPhone vs Android.
10. **Kebocoran data** lewat nomor telepon dan ekspor CSV.
11. **Ketergantungan pada DOKU:** belum pasti apakah refund QRIS bisa lewat sistem, apakah split atau sub-account tersedia, dan apakah DOKU menerima merchant perorangan.
12. **Cakupan.** Daftar V1 besar untuk satu pengembang dalam pilot dua bulan; fitur yang dipotong pertama: B17 (pratinjau), B20 (statistik tautan), notifikasi offline.

## 17. Di luar cakupan V1 (ditunda)

- Reschedule mandiri oleh customer; tombol perpanjang durasi.
- Reminder, push notification, rebooking nudge.
- Membership dan loyalty.
- Komisi barber dan statistik pendapatan barber; balasan barber untuk ulasan; halaman "layanan dan harga saya".
- Pembayaran sisa tagihan lewat DOKU; refund otomatis.
- Stok, diskon, shift, hitung kas, cetak struk.
- Pembedaan Owner dan Manager; Super Admin tambahan.
- Banyak toko dan pendaftaran toko mandiri; model pendapatan barber solo; batas atau tingkatan biaya untuk volume tinggi.
- Kode klaim di struk (ditinjau jika ulasan palsu meningkat).
- Zona waktu selain WIB.
- Pajak dan badan hukum (diputuskan sebelum toko ke-2, konsultasi pajak sebelum invoice pertama).

## 18. Log keputusan yang menggantikan versi sebelumnya

| Topik | Sebelumnya | Sekarang |
|---|---|---|
| Sisa tagihan | Tunai atau lewat DOKU | **Dibayar manual di toko**, dicatat kasir |
| Pengaturan harga dan jadwal | Hanya Owner/Manager | **Admin juga bisa** mengubah jadwal, harga, dan booking fee |
| Booking fee | Potong tagihan, dengan mode lain sebagai opsi | **Dikonfigurasi di sistem; dua skema wajib didukung** (potong tagihan, terpisah), ditambah mati |
| Invoice Loque | Di luar sistem | **PDF otomatis**, periode 26 sampai 25, void setelah tutup menjadi kredit |
| Token void | Kode terpisah | Kode = token (tersembunyi dari kasir) |
| No-show | Aktif setelah 15 menit | Aktif setelah jam mulai, peringatan di bawah 15 menit |
| Slot | 1 jam di pilot | 30 menit sejak awal |
| Booking fee | Deposit | Biaya di luar tagihan; lalu potong tagihan sebagai default |
| Customer-facing surcharge QRIS | Dipertimbangkan | Dibuang |

## 19. Pertanyaan terbuka

1. **Skema A, tagihan lebih kecil dari fee:** kredit dibatasi sebesar tagihan (default di PRD). Konfirmasi.
2. Siapa yang boleh mengubah **skema dan nominal booking fee**: PRD menetapkan Admin dan Owner. Konfirmasi karena Admin = kasir.
3. Angka **batas nominal void** untuk tanda khusus.
4. **Standar bukti** untuk sengketa nomor telepon; pemilik lama tidak diberi tahu (tidak dipilih).
5. Format **identitas di invoice** (nama, NIK atau NPWP, alamat).
6. **Arti "By barber"** di daftar harga (kemungkinan barber baru) dan **durasi aktual** tiap layanan (kelipatan 30 menit), per barber jika berbeda.
7. Email aktif semua barber toko pilot.
8. Pertanyaan ke Indra dan dua barber: apa yang membuat mereka membuka aplikasi tiap hari.
9. Pertanyaan ke DOKU: split atau sub-account settlement, refund QRIS via sistem, merchant perorangan.
10. Syarat mengambil toko ke-2 dan angka ambang keberhasilan setelah baseline.
11. Pengelolaan tautan barber di sisi Admin dan Owner.
12. Apakah void dan penyelesaian oleh orang yang sama perlu dibatasi lebih lanjut jika pola tidak wajar muncul.
13. Pengendali akses CSV (siapa boleh mengunduh, apakah nomor telepon disamarkan).

## 20. Lampiran

- Tahap customer: Masuk, Beranda, Cari barber dan toko, Booking flow, Pembayaran, Setelah booking, Setelah kunjungan, Akun dan privasi, Pendukung.
- Tahap barber: Akses, Hari ini, Jadwal, Profil dan portofolio, Tautan saya, Ulasan, Notifikasi, Akun dan privasi, Pendukung.
- Kode fitur: C (Customer), B (Barber), A (Admin & Kasir), O (Owner), S (Super Admin). Nomor C dan B mengikuti `index.html` v0.4; A, O, dan S baru di PRD ini.
