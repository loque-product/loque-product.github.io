/* Peran 3: Admin & kasir (live). Gabungan dengan indeks di site.js membentuk objek peran lengkap. */
(function () {
const ADMIN_FEATURES = [
  { no: 1, stage: "1. Akses", name: "Login email & password", tags: ["new"],
    desc: `Masuk dengan email dan password yang dibuatkan owner. Tiap admin dan kasir punya akun pribadi.`,
    tech: `Admin dan Kasir adalah satu peran dengan dua nama. Akun pribadi dipakai supaya jejak audit jelas; berbagi akun tidak didukung.` },
  { no: 2, stage: "1. Akses", name: "Login pertama", tags: ["new"], desc: `Saat pertama masuk, password sementara wajib diganti.` },
  { no: 3, stage: "1. Akses", name: "Ganti password", tags: ["new"], desc: `Bisa dilakukan kapan saja setelah login.` },
  { no: 4, stage: "1. Akses", name: "Batas akses", tags: ["new"],
    desc: `Admin dan kasir mengoperasikan booking dan tagihan, dan boleh mengatur jadwal serta harga dan durasi layanan. Nominal dan mode booking fee, akun staf, serta persetujuan void tetap di owner.`,
    tech: `Perubahan jadwal dan harga oleh admin tercatat di log audit dan terlihat oleh owner.` },

  { no: 5, stage: "2. Jadwal toko", name: "Timeline semua barber", tags: ["new"],
    desc: `Kalender harian dengan satu kolom per barber dan satu baris per 30 menit. Booking, walk-in, dan blok waktu terlihat dalam satu layar.` },
  { no: 6, stage: "2. Jadwal toko", name: "Tampilan di HP", tags: ["new"],
    desc: `Di layar kecil, timeline berubah menjadi daftar booking per barber.` },
  { no: 7, stage: "2. Jadwal toko", name: "Notifikasi booking baru", tags: ["new"],
    desc: `Daftar notifikasi dalam aplikasi, dengan penanda belum dibaca. Booking baru muncul di sini.`,
    parked: `Push notification untuk admin dan kasir. Versi pertama hanya notifikasi dalam aplikasi.` },
  { no: 8, stage: "2. Jadwal toko", name: "Jam kerja dan blok barber", tags: ["new"],
    desc: `Admin bisa mengubah jam kerja dan blok waktu semua barber. Tidak bisa disimpan jika menimpa booking: muncul jumlah booking terdampak, dan admin memindahkan atau membatalkannya dulu.` },
  { no: 9, stage: "2. Jadwal toko", name: "Jadwal toko", tags: ["new"],
    desc: `Jam buka, libur, dan tutup mendadak. Aturan toko mengalahkan jam kerja dan blok barber, dan tidak bisa disimpan jika menimpa booking.` },

  { no: 10, stage: "3. Booking", name: "Walk-in", tags: ["new"],
    desc: `Customer yang datang langsung dicatat lewat dua jalur: ketuk slot kosong di timeline (cepat), atau tombol "Walk-in" terpisah. Nama wajib, nomor telepon opsional. Hasilnya booking instan, dan slotnya langsung tidak tersedia.` },
  { no: 11, stage: "3. Booking", name: "Pindah jadwal", tags: ["new"],
    desc: `Lewat form, lalu WhatsApp ke customer dengan pesan yang sudah terisi. Setiap perubahan tercatat di riwayat booking.`,
    parked: `Memindahkan booking dengan drag di timeline.` },
  { no: 12, stage: "3. Booking", name: "Ganti barber", tags: ["new"],
    desc: `Booking bisa dipindah ke barber lain. Harga dan durasi mengikuti barber baru, dan customer diberi tahu lewat WhatsApp.` },
  { no: 13, stage: "3. Booking", name: "Tambah atau ganti layanan", tags: ["new"],
    desc: `Saat kunjungan, layanan bisa ditambah atau diganti dan tagihan ikut bertambah. Jadwal tidak berubah otomatis. Jika bentrok dengan booking berikutnya, muncul peringatan dan admin menggeser booking itu lewat form.`,
    tech: `Tidak ada tombol perpanjang. Frekuensi bentrok dipantau selama pilot.`,
    parked: `Tombol perpanjang durasi.` },
  { no: 14, stage: "3. Booking", name: "Edit data customer", tags: ["new"], desc: `Nama dan nomor telepon di booking bisa diperbaiki admin.` },
  { no: 15, stage: "3. Booking", name: "Batal atas permintaan customer", tags: ["new"],
    desc: `Jika customer meminta batal lewat WhatsApp, admin memilih "Batalkan atas permintaan customer". Status menjadi dibatalkan customer, booking fee hangus, alasan boleh diisi.` },
  { no: 16, stage: "3. Booking", name: "Batal oleh toko", tags: ["new"],
    desc: `Admin membatalkan dengan alasan. Booking masuk ke daftar "Perlu di-refund".` },
  { no: 17, stage: "3. Booking", name: "Daftar perlu di-refund", tags: ["new"],
    desc: `Admin mentransfer booking fee secara manual, lalu menandai "Refund selesai" dengan nomor referensi.`,
    tech: `Refund diproses manual di luar sistem selama pilot.` },

  { no: 18, stage: "4. No-show", name: "Tandai tidak hadir", tags: ["new"],
    desc: `Tombol aktif setelah jam mulai. Jika belum 15 menit, muncul konfirmasi "Belum 15 menit, lanjutkan?". Booking fee hangus.`,
    tech: `Mengabaikan peringatan 15 menit bergantung pada kejujuran admin; tercatat di log audit.` },
  { no: 19, stage: "4. No-show", name: "Hubungi tamu", tags: ["new"],
    desc: `Di menit ke-10 muncul tombol WhatsApp "Hubungi tamu" dengan pesan yang sudah terisi.` },
  { no: 20, stage: "4. No-show", name: "Batalkan penandaan", tags: ["new"],
    desc: `Penandaan tidak hadir bisa di-undo. Penandaan dan undo tercatat.` },

  { no: 21, stage: "5. Tagihan", name: "Buat tagihan", tags: ["new"],
    desc: `Tagihan dibuat dari booking atau walk-in. Admin bisa menambah baris bebas (add-on, minuman, produk). Booking fee mengikuti mode toko: dipotong dari total tagihan, atau dihitung terpisah sehingga harga layanan dibayar penuh di toko.`,
    open: `Aturan jika tagihan lebih kecil dari booking fee (hanya pada mode potongan tagihan).`,
    tech: `Semi-POS. Belum ada stok, shift, hitung kas, atau cetak struk. Tiga mode booking fee: potongan tagihan, biaya tambahan di luar tagihan, atau tanpa fee. Mode diatur owner; tagihan membaca nilai yang tersimpan di booking.` },
  { no: 22, stage: "5. Tagihan", name: "Catat pembayaran", tags: ["new"],
    desc: `Pembayaran sisa dicatat manual (tunai atau cara lain), lalu booking ditandai Selesai. Setelah itu customer bisa memberi ulasan.`,
    tech: `Sisa tagihan dibayar langsung di toko dan dicatat manual, tidak lewat DOKU. Tiap tagihan selesai harus bisa dicocokkan dengan biaya Rp 2.000 per transaksi.` },
  { no: 23, stage: "5. Tagihan", name: "Tanpa diskon", tags: ["new"],
    desc: `Tagihan tidak punya fitur diskon. Harga yang berlaku adalah harga layanan di katalog.` },
  { no: 24, stage: "5. Tagihan", name: "Harga dan durasi layanan", tags: ["new"],
    desc: `Admin bisa mengubah harga dan durasi layanan, termasuk harga khusus per barber. Booking yang sudah dibuat tetap memakai harga saat dibuat.`,
    tech: `Menambah atau menghapus layanan dan add-on tetap di owner. Perubahan harga tercatat di log audit.` },

  { no: 25, stage: "6. Void", name: "Ajukan void", tags: ["new"],
    desc: `Kasir menandai transaksi sebagai void dan mengisi alasan. Boleh kapan saja selama bulan berjalan. Sistem membuat token untuk disetujui owner.`,
    tech: `Token tidak pernah tampil di layar kasir. Jika kasir bisa melihatnya, kasir bisa menyetujui void sendiri.` },
  { no: 26, stage: "6. Void", name: "Masukkan kode persetujuan", tags: ["new"],
    desc: `Owner memberikan kode di luar sistem (WhatsApp atau lisan). Setelah kasir memasukkannya, void berlaku dan biaya Rp 2.000 untuk transaksi itu dibatalkan. Jika owner menolak, kasir melihat "Ditolak" beserta alasannya dan transaksi tetap selesai. Token yang tidak dipakai akan kedaluwarsa.`,
    dflt: `Kode persetujuan sama dengan token. Token kedaluwarsa setelah 24 jam (angka contoh, belum final).` },
  { no: 27, stage: "6. Void", name: "Daftar void owner", tags: ["new"], internal: true,
    desc: `Tidak terlihat oleh kasir. Milik owner: mencatat transaksi yang dimaksud, kasir, alasan, waktu, dan status pemakaian token.` },

  { no: 28, stage: "7. Customer & ringkasan", name: "Cari customer", tags: ["new"], desc: `Cari lewat nama atau nomor telepon.` },
  { no: 29, stage: "7. Customer & ringkasan", name: "Riwayat kunjungan", tags: ["new"], desc: `Kunjungan customer di toko ini saja.` },
  { no: 30, stage: "7. Customer & ringkasan", name: "Ringkasan akhir hari", tags: ["new"],
    desc: `Hanya baca: total tunai dan non-tunai, jumlah booking selesai, tidak hadir, dan void.`,
    parked: `Kas awal dan akhir, serta shift.` },

  { no: 31, stage: "8. Pendukung", name: "Log audit", tags: ["new"], internal: true,
    desc: `Tidak terlihat oleh admin atau kasir. Mencatat siapa dan kapan untuk penandaan tidak hadir dan undo, perubahan booking, pembatalan, refund, pembayaran, dan void.` }
];

Loque.roles.admin = {
  intro: [
    "Admin dan kasir adalah satu peran dengan dua nama, dan menjadi pusat operasional toko sehari-hari. Akunnya dibuat owner, dan tiap orang punya akun pribadi.",
    "Mereka memantau jadwal semua barber, mencatat walk-in, mengatur booking, menagih, lalu menandai kunjungan selesai. Admin juga boleh mengatur jadwal serta harga dan durasi layanan."
  ],
  flow: [
    ["Masuk", "Dengan email dan password dari owner."],
    ["Pantau jadwal", "Timeline semua barber, dan notifikasi booking baru."],
    ["Atur booking dan jadwal", "Walk-in, pindah jadwal, ganti barber, atau batal. Jadwal dan harga juga bisa diatur."],
    ["Tandai tidak hadir", "Setelah jam mulai, dengan tombol WhatsApp di menit ke-10."],
    ["Tagih dan selesaikan", "Catat pembayaran, lalu tandai Selesai."],
    ["Tutup hari", "Lihat ringkasan akhir hari."]
  ],
  rulesSub: "Aturan khusus untuk admin dan kasir.",
  rules: [
    { h: "Akun", p: "Dibuat owner. Satu peran dengan dua nama. Login email dan password, dan password sementara wajib diganti saat login pertama." },
    { h: "Batas pengaturan", p: "Admin dan kasir boleh mengubah jadwal (jam kerja, blok barber, jadwal toko) serta harga dan durasi layanan. Nominal dan mode booking fee tetap diatur owner." },
    { h: "Walk-in", p: "Nama wajib, nomor telepon opsional. Jadi booking instan, dan slot langsung terkunci." },
    { h: "Pindah jadwal", p: "Hanya lewat form, tanpa drag. Setelah itu WhatsApp dengan pesan terisi ke customer. Riwayat perubahan tercatat." },
    { h: "Ganti barber", p: "Harga dan durasi mengikuti barber baru. Customer diberi tahu lewat WhatsApp." },
    { h: "Tambah layanan saat kunjungan", p: "Tagihan bertambah, slot tidak berubah otomatis. Jika bentrok, admin menggeser booking berikutnya lewat form." },
    { h: "Customer minta batal", p: "Dibatalkan sebagai pembatalan oleh customer. Booking fee hangus, alasan opsional." },
    { h: "Toko membatalkan", p: "Wajib mengisi alasan. Booking masuk daftar \"Perlu di-refund\", admin transfer manual, lalu tandai \"Refund selesai\" dengan referensi." },
    { h: "Tidak hadir", p: "Tombol aktif setelah jam mulai. Sebelum 15 menit perlu konfirmasi. Booking fee hangus, dan penandaan bisa di-undo." },
    { h: "Tagihan", p: "Dari booking atau walk-in, ditambah baris bebas. Booking fee dipotong dari total, atau dihitung terpisah, sesuai mode toko. Tanpa diskon." },
    { h: "Harga dan durasi", p: "Admin bisa mengubahnya, termasuk harga per barber. Booking lama tetap memakai harga saat dibuat." },
    { h: "Pembayaran", p: "Customer membayar sisa langsung di toko. Admin mencatatnya manual, lalu menandai booking Selesai. Tidak lewat DOKU." },
    { h: "Void", p: "Boleh kapan saja selama bulan berjalan, dan butuh persetujuan owner. Biaya Rp 2.000 untuk transaksi itu dibatalkan." },
    { h: "Notifikasi", p: "Dalam aplikasi saja, dengan penanda belum dibaca. Tanpa push di versi pertama." },
    { h: "Data customer", p: "Cari lewat nama atau telepon. Riwayat hanya untuk kunjungan di toko ini." }
  ],
  internalRules: [
    { h: "Alur void", p: "Kasir menandai void dan mengisi alasan, sistem membuat token, owner melihat token di daftar void dan memberi kode di luar sistem, kasir memasukkan kode. Keputusan: kode persetujuan sama dengan token." },
    { h: "Risiko 1: token void", p: "Kontrol hanya efektif jika token tidak pernah tampil di layar kasir, hanya di daftar owner. Jika kasir bisa melihatnya, kasir bisa menyetujui void sendiri." },
    { h: "Risiko 2: admin sama dengan kasir", p: "Satu orang mencatat bayar, menyelesaikan booking, dan menandai no-show (yang menentukan siapa menerima fee). Log audit dan undo mengurangi risiko. Bandingkan jumlah void dan no-show per kasir selama pilot." },
    { h: "Risiko 3: override 15 menit", p: "Peringatan sebelum 15 menit bergantung pada kejujuran admin." },
    { h: "Risiko 4: owner jadi hambatan void", p: "Owner pilot bukan kasir, jadi tiap void menunggu owner. Ukur lamanya di dua minggu pertama." },
    { h: "Risiko 5: pembayaran manual", p: "Pastikan tiap tagihan selesai bisa dicocokkan dengan biaya Rp 2.000 per transaksi." },
    { h: "Risiko 6: tanpa perpanjang", p: "Penambahan layanan membuat bentrok jadwal yang digeser manual. Pantau seberapa sering terjadi." },
    { h: "Daftar void owner", p: "Mencatat transaksi yang dimaksud, kasir, alasan, waktu, dan status pemakaian." },
    { h: "Belum diputuskan", p: "Aturan jika tagihan lebih kecil dari booking fee. Pengelolaan tautan barber di sisi admin dan owner." }
  ],
  features: ADMIN_FEATURES
};
})();
