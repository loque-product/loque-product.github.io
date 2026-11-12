/* =====================================================================
   DATA UMUM — versi, Tentang Loque, istilah, status booking, indeks peran.
   Detail per peran ada di assets/data/roles/. Bisnis & pilot ada di business.js.

   Untuk menambah peran baru: tambahkan satu baris di ROLES di bawah, lalu buat
   assets/data/roles/<id>.js dan roles/<id>.html (salin dari peran yang ada).
   ===================================================================== */

(function () {

const META = { version: "0.8", updated: "31 Okt 2026" };

/* ---------- Tentang Loque ---------- */
const ABOUT = {
  paras: [
    "Loque membantu pelanggan memesan jadwal potong rambut secara online, dan membantu barber memamerkan hasil kerjanya.",
    "Customer mencari barber, memilih layanan dan jam, lalu membayar booking fee kecil lewat DOKU. Barber dan admin toko melihat booking itu di jadwal mereka. Sisa harga dibayar di toko.",
    "Tiap barber punya profil, portofolio, dan tautan sendiri untuk dibagikan di Instagram atau TikTok. Profil itu milik barber, bukan milik toko.",
    "Saat ini Loque dipilot di satu toko selama dua bulan."
  ],
  flow: [
    ["Cari", "Customer melihat barber, portofolio, dan harga. Tanpa login."],
    ["Pilih dan bayar fee", "Customer memilih layanan, barber, dan jam, lalu membayar booking fee lewat DOKU."],
    ["Barber bersiap", "Booking muncul di jadwal barber dan admin toko."],
    ["Datang dan bayar", "Admin menyiapkan tagihan. Customer membayar sisanya langsung di toko, dicatat manual oleh kasir. Booking fee dipotong atau dihitung terpisah, sesuai pengaturan toko."],
    ["Selesai dan ulas", "Admin menandai booking selesai. Setelah itu customer bisa mengulas barber."]
  ],
  benefits: [
    { h: "Dana langsung ke toko", p: "Booking fee masuk ke akun merchant DOKU milik toko." },
    { h: "Portofolio barber", p: "Tiap barber punya profil, galeri, dan tautan sendiri untuk bio Instagram atau TikTok." },
    { h: "Jadwal rapi", p: "Hanya jam yang muat dengan durasi layanan yang bisa dipilih. Slot ditahan selama pembayaran." },
    { h: "Admin tetap memegang kendali", p: "Memindahkan jadwal, menyelesaikan booking, dan menandai no-show dilakukan admin toko." }
  ],
  readme: [
    { h: "Kode fitur", p: "Huruf di depan nomor menunjukkan peran. C berarti customer, B berarti barber, A berarti admin, O berarti owner, S berarti Super Admin. Contoh: C33 adalah fitur nomor 33 di sisi customer." },
    { h: "Kolom Fungsi", p: "Menjelaskan apa yang terjadi di layar, dengan bahasa sehari-hari." },
    { h: "Bagian Internal", p: "Berisi catatan teknis dan keputusan tim. Tersembunyi sampai tombolnya ditekan, jadi aman untuk presentasi." },
    { h: "Label Segera", p: "Peran yang dokumentasinya belum selesai. Isinya akan ditambahkan satu per satu." }
  ]
};

const GLOSSARY = [
  { t: "Booking", d: "Pesanan jadwal potong rambut. Dibuat customer secara online, atau dicatat admin untuk customer yang datang langsung." },
  { t: "Walk-in", d: "Customer yang datang langsung tanpa booking. Admin mencatatnya sebagai booking instan, jadi slotnya langsung tidak tersedia." },
  { t: "Booking fee", d: "Biaya kecil yang dibayar online saat booking. Default Rp 10.000, diatur tiap toko. Toko memilih cara hitungnya: dipotong dari total tagihan (standar), atau dihitung terpisah dari harga layanan." },
  { t: "Slot", d: "Jam mulai yang bisa dipilih, per 30 menit. Hanya jam yang muat dengan lama layanan yang bisa dipilih." },
  { t: "Hold (slot ditahan)", d: "Slot dikunci selama 15 menit saat customer membayar. Jika belum dibayar setelah itu, slot dilepas lagi." },
  { t: "No-show", d: "Customer tidak datang. Admin menandainya 15 menit setelah jam mulai (masa tunggu atau grace period). Booking fee hangus." },
  { t: "Reschedule", d: "Memindahkan jadwal booking. Hanya admin yang bisa, lalu customer dihubungi lewat WhatsApp." },
  { t: "Refund", d: "Pengembalian booking fee. Terjadi jika toko yang membatalkan." },
  { t: "DOKU", d: "Penyedia pembayaran yang dipakai Loque. Hanya booking fee yang dibayar lewat halaman checkout DOKU. Sisa harga dibayar langsung di toko." },
  { t: "QRIS", d: "Kode QR pembayaran standar Indonesia. Bisa dibayar dari e-wallet atau m-banking." },
  { t: "Merchant", d: "Akun penerima pembayaran. Tiap toko punya merchant DOKU sendiri, jadi uang langsung masuk ke toko." },
  { t: "Quick Rebook (Pesan Lagi)", d: "Memesan ulang dengan layanan, barber, dan data tamu yang sama seperti booking sebelumnya." },
  { t: "Portofolio", d: "Foto hasil potongan barber yang tampil di profilnya." },
  { t: "Peran (role)", d: "Jenis akses sebuah akun, misalnya customer, barber, atau admin. Satu orang bisa punya lebih dari satu peran." },
  { t: "Keanggotaan toko", d: "Hubungan seorang barber atau staf dengan sebuah toko. Barber bisa pindah toko, sedangkan profil dan portofolionya tetap miliknya." },
  { t: "Void", d: "Membatalkan transaksi yang sudah dicatat. Kasir mengajukan dengan alasan, dan baru berlaku setelah owner memberi kode persetujuan. Biaya Rp 2.000 untuk transaksi itu dibatalkan." },
  { t: "PWA", d: "Aplikasi web yang bisa dipasang di layar HP seperti aplikasi biasa, tanpa lewat toko aplikasi." }
];

const STATUSES = [
  { s: "Unpaid", mean: "Booking dibuat, booking fee belum dibayar.", by: "Sistem, saat booking dimulai", sees: `"Menunggu pembayaran". Slot ditahan 15 menit.` },
  { s: "Expired", mean: "Waktu 15 menit habis tanpa pembayaran.", by: "Sistem", sees: "Tidak tampil sebagai booking mendatang. Slot dilepas." },
  { s: "Confirmed", mean: "Booking fee sudah dibayar.", by: "Sistem, setelah DOKU mengonfirmasi", sees: "Booking mendatang." },
  { s: "Completed", mean: "Kunjungan selesai dan tagihan dibayar.", by: "Admin (kasir)", sees: "Tab Selesai. Ulasan terbuka." },
  { s: "Cancelled by customer", mean: "Customer membatalkan sendiri.", by: "Customer", sees: "Tab Dibatalkan. Booking fee hangus." },
  { s: "Cancelled by shop", mean: "Toko membatalkan, atau customer batal setelah jadwal dipindah toko.", by: "Admin", sees: `"Dibatalkan oleh toko" beserta status refund.` },
  { s: "No-show", mean: "Customer tidak datang.", by: "Admin, setelah jam mulai + 15 menit", sees: `"Tidak hadir". Booking fee hangus. Admin bisa membatalkan penandaan ini (undo).` }
];
const STATUS_INTERNAL = [
  { h: "Nama status", p: "Ini label kerja. Samakan dengan enum final saat ditulis." },
  { h: "Status refund", p: "Field terpisah dari status booking: \"Refund diproses\", \"Refund selesai\"." },
  { h: "Refund pilot", p: "Refund atas pembatalan toko diproses manual di luar sistem." },
  { h: "Pembatalan karena jadwal dipindah", p: "Jika customer menolak jadwal baru lewat WhatsApp, admin membatalkannya sebagai \"Cancelled by shop\" dengan alasan. Satu jalur refund, dan alasannya bisa dihitung." }
];

/* Indeks peran: dipakai sidebar, beranda, dan halaman peran. Detail tiap peran ada di assets/data/roles/<id>.js */
const ROLES = [
  { id: "customer", name: "Customer", prefix: "C", status: "live", order: 1,
    who: "Pelanggan barbershop. Mencari barber, melihat portofolio dan harga, lalu memesan jadwal dari HP." },
  { id: "barber", name: "Barber", prefix: "B", status: "live", order: 2,
    who: "Orang yang memotong rambut. Punya profil dan portofolio pribadi, dan bisa bekerja di satu toko atau lebih." },
  { id: "admin", name: "Admin & kasir", prefix: "A", status: "live", order: 3,
    who: "Orang yang menjalankan toko tiap hari: menerima pembayaran, mengatur booking dan jadwal." },
  { id: "owner", name: "Owner & manajer", prefix: "O", status: "live", order: 4,
    who: "Pemilik atau pengelola toko. Melihat laporan dan mengatur toko secara keseluruhan." },
  { id: "superadmin", name: "Super Admin Loque", prefix: "S", status: "live", order: 5,
    who: "Tim Loque. Menyiapkan toko, memoderasi ulasan dan foto, dan menangani tagihan." },
];

Loque.data = Object.assign(Loque.data || {}, { META, ABOUT, GLOSSARY, STATUSES, STATUS_INTERNAL, ROLES });
})();
