/* Peran 4: Owner & manajer (live). Gabungan dengan indeks di site.js membentuk objek peran lengkap. */
(function () {
const OWNER_FEATURES = [
  { no: 1, stage: "1. Akses", name: "Login email & password", tags: ["new"],
    desc: `Masuk dengan email dan password yang dibuatkan tim Loque.`,
    tech: `Akun Owner dibuat oleh Loque Admin.`,
    parked: `Pembedaan Owner dan Manajer. Di versi pertama keduanya satu peran, dan dipisah setelah ada toko dengan manajer terpisah.` },
  { no: 2, stage: "1. Akses", name: "Login pertama", tags: ["new"], desc: `Saat pertama masuk, password sementara wajib diganti.` },
  { no: 3, stage: "1. Akses", name: "Ganti password", tags: ["new"], desc: `Bisa dilakukan kapan saja setelah login.` },
  { no: 4, stage: "1. Akses", name: "Ganti peran", tags: ["new"],
    desc: `Satu orang bisa punya lebih dari satu peran, misalnya owner yang juga barber atau kasir. Cukup satu akun, lalu berpindah tampilan lewat pemilih peran. Tampilan barber hanya menampilkan data miliknya sendiri.`,
    tech: `Aksi kasir tetap tercatat atas nama orangnya. Di toko pilot, owner bukan kasir.` },

  { no: 5, stage: "2. Dasbor", name: "Ringkasan hari ini dan bulan ini", tags: ["new"],
    desc: `Jumlah booking, booking selesai, tidak hadir, void, serta total pembayaran tunai dan non-tunai.` },
  { no: 6, stage: "2. Dasbor", name: "Void menunggu persetujuan", tags: ["new"], desc: `Daftar permintaan void dari kasir yang belum diputuskan, tampil di halaman pertama.` },
  { no: 7, stage: "2. Dasbor", name: "Refund belum selesai", tags: ["new"],
    desc: `Booking yang dibatalkan toko dan belum ditandai "Refund selesai", supaya tidak ada customer yang terlewat.` },
  { no: 8, stage: "2. Dasbor", name: "Tagihan Loque bulan ini", tags: ["new"],
    desc: `Jumlah transaksi dikali Rp 2.000, lengkap dengan rinciannya.`,
    tech: `Harus cocok dengan invoice bulanan.` },

  { no: 9, stage: "3. Void", name: "Daftar void", tags: ["new"],
    desc: `Menampilkan token, transaksi, kasir, alasan, waktu, dan status pemakaian.` },
  { no: 10, stage: "3. Void", name: "Setujui dengan kode", tags: ["new"],
    desc: `Owner memberikan kode persetujuan di luar sistem (WhatsApp atau lisan). Void yang disetujui membatalkan biaya Rp 2.000 untuk transaksi itu.`,
    dflt: `Kode persetujuan sama dengan token, jadi token tidak boleh tampil di layar kasir.` },
  { no: 11, stage: "3. Void", name: "Tolak permintaan", tags: ["new"],
    desc: `Owner bisa menolak dengan catatan. Kasir melihat "Ditolak" beserta alasannya, dan transaksi tetap selesai.` },
  { no: 12, stage: "3. Void", name: "Token kedaluwarsa", tags: ["new"],
    desc: `Token yang tidak dipakai akan kedaluwarsa, sehingga permintaan lama tidak menggantung.`,
    dflt: `Kedaluwarsa setelah 24 jam. Angka ini contoh dan belum final.` },
  { no: 13, stage: "3. Void", name: "Filter daftar void", tags: ["new"], desc: `Saring menurut kasir, alasan, dan tanggal.` },
  { no: 14, stage: "3. Void", name: "Tanda void besar", tags: ["new"],
    desc: `Void di atas batas nominal diberi tanda khusus agar mudah diperiksa.`,
    open: `Angka batas nominal. Tanda belum berguna sebelum batas ditetapkan dari data harga toko.` },

  { no: 15, stage: "4. Akun staf", name: "Buat akun staf", tags: ["new"],
    desc: `Buat akun Admin atau Kasir dan Barber dengan password sementara.` },
  { no: 16, stage: "4. Akun staf", name: "Reset password staf", tags: ["new"], desc: `Owner membuat password sementara baru, dan staf wajib menggantinya saat login.` },
  { no: 17, stage: "4. Akun staf", name: "Nonaktifkan keanggotaan", tags: ["new"],
    desc: `Staf yang keluar dinonaktifkan tanpa menghapus portofolio dan ulasan barber.` },
  { no: 18, stage: "4. Akun staf", name: "Log audit staf", tags: ["new"],
    desc: `Riwayat tindakan staf: void, tidak hadir, perubahan harga, dan lainnya.` },

  { no: 19, stage: "5. Pengaturan toko", name: "Katalog layanan", tags: ["new"],
    desc: `Layanan, add-on, harga default, harga khusus per barber, dan durasi. Isi awal disiapkan tim Loque, setelah itu owner mengubah sendiri. Admin juga bisa mengubah harga dan durasi, sedangkan menambah atau menghapus layanan tetap di owner.`,
    tech: `Isi awal dari pricelist Barber Indra oleh Loque Admin.` },
  { no: 20, stage: "5. Pengaturan toko", name: "Booking fee", tags: ["new"],
    desc: `Nominal dan mode. Potongan tagihan: fee dikurangkan dari total, sehingga customer membayar sisanya di toko. Biaya tambahan: fee dihitung terpisah dari harga layanan, yang dibayar penuh di toko. Atau tanpa fee. Perubahan hanya berlaku untuk booking baru.`,
    tech: `Booking lama menyimpan nilai saat dibuat.` },
  { no: 21, stage: "5. Pengaturan toko", name: "Jadwal toko", tags: ["new"],
    desc: `Jam buka, libur, dan tutup mendadak. Tidak bisa disimpan jika menimpa booking: muncul jumlah booking terdampak, dan owner memindahkan atau membatalkannya dulu. Aturan toko mengalahkan jam kerja dan blok barber. Admin juga bisa mengubah jadwal toko.` },
  { no: 22, stage: "5. Pengaturan toko", name: "Jam kerja dan blok barber", tags: ["new"], desc: `Owner dan admin bisa mengubahnya untuk semua barber.` },
  { no: 23, stage: "5. Pengaturan toko", name: "Profil toko", tags: ["new"],
    desc: `Foto, alamat, jam, WhatsApp, Instagram, dan galeri.`,
    tech: `Loque Admin juga punya akses, tetapi utamanya dikelola owner.` },
  { no: 24, stage: "5. Pengaturan toko", name: "Status DOKU merchant", tags: ["new"],
    desc: `Owner melihat apakah akun pembayaran toko Terhubung atau Bermasalah.`,
    tech: `Hanya Loque Admin yang memasukkan kredensial. Tiap toko baru butuh penyiapan manual.` },

  { no: 25, stage: "6. Invoice Loque", name: "Transaksi yang ditagih", tags: ["new"], desc: `Daftar transaksi yang ditagih per periode, dengan rinciannya.` },
  { no: 26, stage: "6. Invoice Loque", name: "Invoice PDF otomatis", tags: ["new"],
    desc: `Sistem membuat invoice saat periode ditutup (tanggal 26 bulan lalu sampai tanggal 25 bulan ini). Owner melihat dan mengunduhnya di dasbor, lengkap dengan lampiran rincian transaksi. Dibayar dengan transfer. Tanpa PPN.`,
    tech: `Loque belum PKP; urusan pajak ditunda. Status Dibayar atau Belum dibayar ditandai manual oleh Super Admin.` },
  { no: 27, stage: "6. Invoice Loque", name: "Kredit void", tags: ["new"],
    desc: `Void setelah tutup tanggal 25 mengurangi tagihan periode berikutnya. Invoice lama tidak diubah. Kredit ditampilkan jelas di dasbor.`,
    tech: `Kredit harus terlihat jelas agar tidak terkesan selisih antara dasbor dan invoice.` },

  { no: 28, stage: "7. Laporan", name: "Pendapatan", tags: ["new"], desc: `Per hari dan per bulan, tunai dan non-tunai.` },
  { no: 29, stage: "7. Laporan", name: "Booking per barber", tags: ["new"],
    desc: `Jumlah selesai, tidak hadir, dan dibatalkan tiap barber. Bukan komisi.` },
  { no: 30, stage: "7. Laporan", name: "Sumber booking", tags: ["new"], desc: `Dari online, walk-in, atau tautan ref.` },
  { no: 31, stage: "7. Laporan", name: "Ekspor CSV", tags: ["new"],
    desc: `Unduh laporan sebagai file CSV.`,
    tech: `CSV memuat nomor telepon customer (data pribadi, UU PDP). Pengunduhan perlu dicatat di log audit.`,
    open: `Siapa yang boleh mengunduh, dan apakah nomor telepon disamarkan.` }
];

Loque.roles.owner = {
  intro: [
    "Owner dan manajer adalah satu peran di versi pertama. Pembedaannya ditunda sampai ada toko dengan manajer terpisah. Akunnya dibuat Super Admin Loque.",
    "Owner mengatur toko secara keseluruhan: akun staf, katalog dan harga, jadwal, serta memutuskan void dan refund. Di toko pilot, owner bukan kasir."
  ],
  flow: [
    ["Masuk", "Dengan email dan password dari tim Loque."],
    ["Lihat dasbor", "Ringkasan hari ini, void menunggu, refund belum selesai."],
    ["Putuskan void", "Setujui dengan kode, atau tolak dengan catatan."],
    ["Atur toko", "Layanan, harga, booking fee, jadwal, dan profil."],
    ["Kelola staf", "Buat akun, reset password, nonaktifkan."],
    ["Cek tagihan dan laporan", "Tagihan Loque bulan ini dan laporan pendapatan."]
  ],
  rulesSub: "Aturan khusus untuk owner dan manajer.",
  rules: [
    { h: "Akun", p: "Dibuat oleh tim Loque. Login email dan password, dan password sementara wajib diganti saat login pertama." },
    { h: "Satu peran", p: "Owner dan manajer satu peran di versi pertama. Pembedaan menyusul jika ada toko dengan manajer terpisah." },
    { h: "Banyak peran", p: "Satu orang bisa menjadi owner sekaligus barber atau kasir, dengan satu akun dan pemilih peran. Aksi kasir tetap tercatat atas nama orangnya." },
    { h: "Pembagian pengaturan", p: "Nominal dan mode booking fee, akun staf, dan persetujuan void ada di owner. Jadwal serta harga dan durasi layanan juga bisa diubah admin, dan tercatat di log audit." },
    { h: "Void", p: "Owner memberi kode persetujuan di luar sistem, atau menolak dengan catatan. Token kedaluwarsa jika tidak dipakai, dan tidak pernah tampil di layar kasir." },
    { h: "Refund", p: "Booking yang dibatalkan toko masuk daftar refund belum selesai di dasbor sampai ditandai \"Refund selesai\"." },
    { h: "Katalog layanan", p: "Isi awal disiapkan tim Loque. Setelah itu owner mengubah layanan, add-on, harga, dan durasi sendiri." },
    { h: "Booking fee", p: "Nominal dan mode diatur owner: dipotong dari total tagihan, dihitung terpisah, atau tanpa fee. Perubahan hanya berlaku untuk booking baru." },
    { h: "Jadwal toko", p: "Tidak bisa disimpan jika menimpa booking. Owner memindahkan atau membatalkan booking terdampak lebih dulu. Aturan toko mengalahkan jam kerja dan blok barber." },
    { h: "Menonaktifkan staf", p: "Keanggotaan dinonaktifkan tanpa menghapus portofolio dan ulasan barber." },
    { h: "DOKU merchant", p: "Hanya tim Loque yang memasukkan kredensial. Owner hanya melihat statusnya." },
    { h: "Invoice Loque", p: "Rp 2.000 per transaksi selesai. Invoice PDF dibuat otomatis saat periode ditutup (tanggal 26 sampai 25), dibayar dengan transfer, tanpa PPN." },
    { h: "Void setelah tutup", p: "Mengurangi tagihan periode berikutnya sebagai kredit. Invoice lama tidak diubah." },
    { h: "Laporan", p: "Pendapatan, booking per barber (bukan komisi), sumber booking, dan ekspor CSV." }
  ],
  internalRules: [
    { h: "Risiko 1: owner satu-satunya penjaga", p: "Void, refund, booking fee, dan akun staf semua lewat owner. Jika owner jarang membuka sistem, kasir terblokir dan toko kembali ke cara lama. Ukur waktu tunggu void dan refund." },
    { h: "Risiko 2: batas void belum ada angka", p: "Tanda void besar tidak berguna sebelum batas ditetapkan dari data harga toko." },
    { h: "Risiko 3: CSV memuat nomor telepon", p: "Termasuk data pribadi menurut UU PDP. Perlu aturan siapa yang boleh mengunduh, dan pencatatan di log audit." },
    { h: "Risiko 4: kredensial DOKU", p: "Hanya dipegang Loque Admin. Aman untuk pilot, tetapi tiap toko baru butuh penyiapan manual." },
    { h: "Risiko 5: tagihan dan invoice", p: "Tagihan di dasbor harus cocok dengan invoice. Aturan void setelah tutup sudah ada (kredit ke periode berikutnya), tetapi owner perlu melihat kredit itu dengan jelas di dasbor agar tidak terkesan selisih." },
    { h: "Harga diubah admin", p: "Admin bisa mengubah harga dan jadwal tanpa persetujuan owner. Pengamannya log audit; owner perlu melihatnya secara berkala." },
    { h: "Struktur peran", p: "Owner dan Manager satu peran di V1. Satu orang bisa punya banyak peran lewat keanggotaan toko." },
    { h: "Belum diputuskan", p: "Angka batas nominal void. Siapa yang boleh mengunduh CSV dan apakah nomor telepon disamarkan. Pengelolaan tautan barber di sisi owner." }
  ],
  features: OWNER_FEATURES
};
})();
