/* Peran 2: Barber (live). Gabungan dengan indeks di site.js membentuk objek peran lengkap. */
(function () {
const BARBER_FEATURES = [
  { no: 1, stage: "1. Akses", name: "Login email & password", tags: ["new"],
    desc: `Masuk dengan email dan password yang dibuatkan owner atau admin Loque. Tidak memakai Google.`,
    tech: `Akun dibuat oleh level di atasnya: Admin Loque membuat Owner; Owner membuat Admin, Kasir, dan Barber; Admin membuat Barber; Kasir tidak membuat akun. Tidak ada yang bisa membuat peran di atas levelnya.`,
    dflt: `"Lupa password" lewat email, dengan batas percobaan dan penguncian akun.` },
  { no: 2, stage: "1. Akses", name: "Login pertama", tags: ["new"],
    desc: `Saat pertama masuk, barber wajib mengganti password dan menyetujui Syarat staf.`,
    tech: `Pembuat akun mengatur password sementara, jadi penggantian wajib di login pertama. Waktu persetujuan Syarat dicatat.` },
  { no: 3, stage: "1. Akses", name: "Ganti password", tags: ["new"], desc: `Bisa dilakukan kapan saja setelah login.` },
  { no: 4, stage: "1. Akses", name: "Akses dan keluar", tags: ["new"], desc: `Yang belum login diarahkan ke halaman login. Tombol "Keluar" dengan konfirmasi.` },
  { no: 5, stage: "1. Akses", name: "Ganti peran", tags: ["new"],
    desc: `Satu orang bisa punya lebih dari satu peran, misalnya owner yang juga barber. Tinggal berpindah tampilan. Tampilan barber hanya menampilkan data miliknya sendiri.` },

  { no: 6, stage: "2. Hari ini", name: "Jadwal hari ini", tags: ["new"],
    desc: `Daftar booking milik barber hari ini, urut jam: jam, nama customer, layanan, durasi, status. Jam kosong dan blok waktu ikut terlihat.`,
    dflt: `Booking yang belum dibayar tidak ditampilkan.` },
  { no: 7, stage: "2. Hari ini", name: "Ganti hari", tags: ["new"], desc: `Lihat hari lain lewat strip tanggal.`, dflt: `Strip tanggal untuk melihat besok dan hari-hari berikutnya.` },
  { no: 8, stage: "2. Hari ini", name: "Detail booking", tags: ["new"],
    desc: `Nama dan nomor telepon customer, layanan, harga dan durasi saat booking, sumber booking (online, walk-in, Pesan Lagi), dan tombol WhatsApp. Hanya baca: menyelesaikan booking dan menandai no-show dilakukan admin.`,
    tech: `Nomor telepon hanya untuk menghubungi soal booking. Aturan ini tertulis di Syarat staf; tidak ada pencegahan teknis.` },
  { no: 9, stage: "2. Hari ini", name: "Data selalu segar", tags: ["new"],
    desc: `Halaman memperbarui diri tiap beberapa saat dan bisa ditarik untuk refresh. Tertulis "Diperbarui 14.05". Booking walk-in dari kasir tampil tanpa membuka ulang aplikasi.`,
    tech: `Tanpa push notification di v1, jadi pembaruan otomatis menggantikannya.` },

  { no: 10, stage: "3. Jadwal", name: "Jam kerja", tags: ["new"],
    desc: `Barber mengatur jam kerjanya per hari dalam kelipatan 30 menit, di dalam jam buka toko. Zona waktu mengikuti toko. Owner dan admin bisa mengubah jam kerja semua barber.` },
  { no: 11, stage: "3. Jadwal", name: "Blok waktu", tags: ["new"],
    desc: `Tutup sebagian jam, satu hari penuh, atau rentang tanggal untuk diri sendiri. Owner dan admin bisa melakukan hal yang sama untuk semua barber.`,
    dflt: `Blok bisa diulang tiap minggu (salat Jumat, istirahat, libur mingguan).` },
  { no: 12, stage: "3. Jadwal", name: "Blok di atas booking", tags: ["new"],
    desc: `Jika blok menimpa booking yang sudah ada, muncul "N booking terdampak" dan blok tidak bisa disimpan. Barber meminta admin memindahkan atau membatalkan booking itu dulu.`,
    tech: `Mencegah satu barber berhalangan berubah menjadi banyak pembatalan toko dan refund tanpa sepengetahuan owner.` },
  { no: 13, stage: "3. Jadwal", name: "Aturan toko", tags: ["new"],
    desc: `Libur atau pengaturan jadwal seluruh toko dari owner atau admin muncul di kalender, hanya baca. Aturan toko mengalahkan jam kerja dan blok barber.` },
  { no: 14, stage: "3. Jadwal", name: "Daftar blok", tags: ["new"], desc: `Lihat blok yang akan datang dan hapus dengan konfirmasi.` },

  { no: 15, stage: "4. Profil & portofolio", name: "Profil", tags: ["new"], desc: `Ubah foto profil, cover, bio, dan spesialisasi. Nama dan toko mengikuti akun.` },
  { no: 16, stage: "4. Profil & portofolio", name: "Unggah portofolio", tags: ["new"],
    desc: `Unggah sampai 9 foto dengan keterangan, atur urutan, dan hapus. Tiap unggahan butuh centang persetujuan: "Pelanggan (atau orang tua/wali jika di bawah 18 tahun) setuju fotonya ditampilkan di Loque". Foto langsung tampil.`,
    tech: `Centang dicatat dengan siapa dan kapan. Foto dikompres dengan batas ukuran dan metadata lokasi dihapus. Siapa pun bisa melaporkan foto (C53); admin Loque memutuskan. Ada tips agar foto berfokus pada rambut. Syarat staf menegaskan bahwa barber bertanggung jawab atas persetujuan.` },
  { no: 17, stage: "4. Profil & portofolio", name: "Pratinjau customer", tags: ["new"], desc: `Lihat profil sendiri persis seperti dilihat customer.`, dflt: `Disertakan di v1; fitur pertama yang dipotong jika cakupan perlu dikecilkan.` },

  { no: 18, stage: "5. Tautan saya", name: "Tautan pribadi", tags: ["new"],
    desc: `Tautan siap salin untuk Instagram, TikTok, dan WhatsApp, mis. {{/b/<slug>?ref=ig}}. Dibuka tanpa login.` },
  { no: 19, stage: "5. Tautan saya", name: "Kode QR", tags: ["new"], desc: `QR dari tautan, bisa diunduh untuk dicetak atau diposting.` },
  { no: 20, stage: "5. Tautan saya", name: "Statistik tautan", tags: ["new"],
    desc: `Berapa kali profil dilihat dan berapa booking datang dari tautanmu bulan ini, per kanal.`,
    dflt: `Disertakan di v1; dipotong setelah Pratinjau dan notifikasi offline jika cakupan perlu dikecilkan.` },

  { no: 21, stage: "6. Ulasan", name: "Ulasan saya", tags: ["new"],
    desc: `Daftar ulasan dengan bintang, komentar, tanggal, serta rating rata-rata dan jumlahnya.`,
    parked: `Balasan barber untuk ulasan.` },
  { no: 22, stage: "6. Ulasan", name: "Laporkan ulasan", tags: ["new"],
    desc: `Barber bisa melaporkan ulasan dengan alasan. Tim Loque memeriksa dan memutuskan. Ulasan hanya dihapus jika bukan kunjungan nyata, kasar atau diskriminatif, memuat data pribadi, atau jelas tentang toko lain. Tidak pernah dihapus hanya karena negatif.`,
    dflt: `Status laporan terlihat: Dilaporkan, Ditinjau, Dihapus, Dipertahankan, beserta alasannya.` },

  { no: 23, stage: "7. Notifikasi", name: "Daftar notifikasi", tags: ["new"],
    desc: `Notifikasi dalam aplikasi: booking baru, pembatalan oleh customer, pembatalan oleh toko, jadwal diubah admin, ulasan baru, hasil laporan ulasan atau foto. Ada penanda belum dibaca.`,
    parked: `Web push notification untuk barber.` },

  { no: 24, stage: "8. Akun & privasi", name: "Akun", tags: ["new"], desc: `Nama, email, dan keanggotaan toko (hanya baca).`, dflt: `Barber bisa mengubah email sendiri.` },
  { no: 25, stage: "8. Akun & privasi", name: "Syarat & Privasi", tags: ["new"], desc: `Syarat staf dan halaman privasi: tanggung jawab persetujuan foto, nomor customer hanya untuk urusan booking, dan hak data menurut UU PDP.` },
  { no: 26, stage: "8. Akun & privasi", name: "Tanpa keanggotaan aktif", tags: ["new"],
    desc: `Jika keanggotaan toko dinonaktifkan, barber tetap bisa masuk untuk mengelola profil, portofolio, tautan, dan ulasan. Booking dan data customer tidak terlihat lagi.` },
  { no: 27, stage: "8. Akun & privasi", name: "Hapus akun & data", tags: ["new"],
    desc: `Hapus akun dan data pribadi. Ditolak selama masih ada booking mendatang.` },

  { no: 28, stage: "9. Pendukung", name: "Pemberitahuan offline", tags: ["new"], desc: `Banner muncul saat HP tidak terhubung ke internet.` },
  { no: 29, stage: "9. Pendukung", name: "Halaman 404", tags: ["new"], desc: `Halaman tidak ditemukan, dengan jalan kembali.` },
  { no: 30, stage: "9. Pendukung", name: "Log audit", tags: ["new"], internal: true,
    desc: `Tidak terlihat oleh barber. Mencatat siapa dan kapan untuk login, blok waktu, unggahan portofolio dan centang persetujuan, serta laporan ulasan.` }
];

Loque.roles.barber = {
  intro: [
    "Akun barber dibuat oleh owner atau admin toko, dan masuk dengan email dan password. Profil dan portofolio tetap milik barber, bahkan jika ia pindah toko.",
    "Aplikasi barber dibuat sederhana. Barber cukup membuka jadwal hari ini, mengatur jam kerja, dan merawat portofolionya."
  ],
  flow: [
    ["Masuk", "Dengan email dan password dari owner atau admin."],
    ["Lihat hari ini", "Booking hari ini, urut jam, dengan tombol WhatsApp."],
    ["Atur jadwal", "Jam kerja dan blok waktu untuk diri sendiri."],
    ["Rawat portofolio", "Unggah foto, dengan persetujuan customer."],
    ["Bagikan tautan", "Tautan dan QR untuk Instagram, TikTok, dan WhatsApp."],
    ["Baca ulasan", "Laporkan ulasan yang tidak pantas."]
  ],
  rulesSub: "Aturan khusus untuk barber.",
  rules: [
    { h: "Pembuatan akun", p: "Admin Loque membuat Owner. Owner membuat Admin, Kasir, dan Barber. Admin membuat Barber. Kasir tidak membuat akun." },
    { h: "Login", p: "Email dan password. Password sementara wajib diganti saat login pertama, dan bisa diganti kapan saja." },
    { h: "Profil milik barber", p: "Profil, portofolio, dan ulasan tetap milik barber meski pindah toko. Toko hanya mengatur keanggotaan." },
    { h: "Foto portofolio", p: "Maksimal 9 foto. Tiap foto butuh persetujuan customer, atau orang tua/wali jika di bawah 18 tahun. Foto langsung tampil." },
    { h: "Laporan foto", p: "Siapa saja bisa melaporkan foto. Admin Loque memutuskan, dan barber diberi tahu hasil serta alasannya." },
    { h: "Urutan aturan jadwal", p: "Aturan toko mengalahkan jam kerja barber, dan jam kerja mengalahkan blok waktu." },
    { h: "Blok waktu", p: "Tidak bisa dibuat di atas booking yang sudah ada. Barber meminta admin memindahkannya dulu." },
    { h: "Harga dan durasi", p: "Diatur owner atau admin. Barber hanya melihat." },
    { h: "Menyelesaikan booking", p: "Barber tidak menyelesaikan booking atau menandai no-show. Itu tugas admin." },
    { h: "Nomor customer", p: "Hanya untuk menghubungi soal booking." },
    { h: "Laporan ulasan", p: "Ulasan dihapus hanya jika bukan kunjungan nyata, kasar atau diskriminatif, memuat data pribadi, atau jelas tentang toko lain. Tidak pernah karena negatif." },
    { h: "Notifikasi", p: "Dalam aplikasi saja. Tanpa push di versi pertama." },
    { h: "Keluar dari toko", p: "Portofolio dan ulasan tetap. Akses ke booking dan data customer berakhir." }
  ],
  internalRules: [
    { h: "Struktur data", p: "Barber adalah satu orang dengan keanggotaan di toko dan satu set peran. Satu orang bisa jadi owner, barber, dan kasir sekaligus. Barber solo = orang dengan toko berisi satu orang. Reputasi toko diukur lewat Google Maps, bukan lewat Loque." },
    { h: "Harga dan durasi", p: "Nilai default layanan toko ditambah override per keanggotaan (barber di toko itu), untuk harga dan durasi. Booking menyimpan nilai saat dibuat. Tidak perlu matriks penuh barber × layanan." },
    { h: "Kepemilikan akun", p: "Akun barber dibuat owner, tetapi barber mengganti password sendiri di login pertama. Owner bisa menonaktifkan keanggotaan, tidak bisa menghapus orangnya, portofolionya, atau ulasannya." },
    { h: "Moderasi", p: "Laporan ulasan dan foto diputuskan admin Loque dengan kriteria tertulis. Super Admin Loque jadi titik antre. Batas tanggapan: 48 jam untuk foto yang disembunyikan, 7 hari untuk laporan lain. Bergantung pada satu orang, tanpa cadangan." },
    { h: "Pengaruh Loque ke barber", p: "Ulasan hanya bisa bertambah lewat booking di Loque. Itu dasar alasan barber tetap memakai Loque. Pengaruhnya baru berarti jika customer datang lewat Loque lebih dulu." },
    { h: "Nomor customer", p: "Admin dan barber bisa melihatnya dan bisa menghubungi langsung. Tidak ada pencegahan teknis; syarat staf menjadi dasarnya." },
    { h: "Yang ditunda", p: "Komisi (bagi hasil) dan statistik pendapatan barber, balasan barber untuk ulasan, web push untuk barber, halaman \"layanan dan harga saya\" (hanya baca)." }
  ],
  features: BARBER_FEATURES
};
})();
