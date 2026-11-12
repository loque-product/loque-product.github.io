/* Peran 5: Super Admin Loque (live). Gabungan dengan indeks di site.js membentuk objek peran lengkap. */
(function () {
const SUPERADMIN_FEATURES = [
  { no: 1, stage: "1. Akses", name: "Login email & password", tags: ["new"],
    desc: `Masuk dengan email dan password. Peran ini hanya dipegang tim Loque.`,
    tech: `Saat ini satu orang: pemilik Loque.` },
  { no: 2, stage: "1. Akses", name: "Akses penuh", tags: ["new"],
    desc: `Super Admin bisa melihat semua data toko dan customer.`,
    tech: `Pengamannya hanya log audit; 2FA tidak dipilih. Gunakan password panjang dan unik, dan jelaskan akses ini di halaman privasi UU PDP.` },
  { no: 3, stage: "1. Akses", name: "Log audit", tags: ["new"], internal: true,
    desc: `Tidak terlihat oleh peran lain. Mencatat semua akses data customer dan semua aksi Super Admin.` },

  { no: 4, stage: "2. Penyiapan toko", name: "Checklist penyiapan toko", tags: ["new"],
    desc: `Daftar langkah berurutan di dalam sistem: buat toko, buat akun Owner, hubungkan merchant DOKU, isi katalog layanan dari pricelist, atur jam buka dan jadwal, tes pembayaran, lalu buka.` },
  { no: 5, stage: "2. Penyiapan toko", name: "Toko tersembunyi sampai siap", tags: ["new"], desc: `Toko tidak tampil ke publik sampai semua langkah checklist selesai.` },
  { no: 6, stage: "2. Penyiapan toko", name: "Buat akun Owner", tags: ["new"], desc: `Super Admin membuat akun Owner untuk tiap toko.` },
  { no: 7, stage: "2. Penyiapan toko", name: "Hubungkan merchant DOKU", tags: ["new"],
    desc: `Kredensial merchant DOKU toko dimasukkan di sini. Owner hanya melihat status Terhubung atau Bermasalah.`,
    tech: `Tiap toko baru butuh penyiapan manual.` },

  { no: 8, stage: "3. Moderasi", name: "Antrean foto portofolio", tags: ["new"], desc: `Laporan foto dari siapa saja, dalam antrean tersendiri.` },
  { no: 9, stage: "3. Moderasi", name: "Antrean ulasan", tags: ["new"], desc: `Laporan ulasan dari barber, dalam antrean tersendiri.` },
  { no: 10, stage: "3. Moderasi", name: "Foto disembunyikan dulu", tags: ["new"],
    desc: `Laporan "Saya ada di foto ini" atau "Anak saya" langsung menyembunyikan foto, jadi dikerjakan lebih dulu.` },
  { no: 11, stage: "3. Moderasi", name: "Keputusan dengan alasan", tags: ["new"],
    desc: `Setiap keputusan wajib disertai alasan dan tercatat. Barber diberi tahu hasil dan alasannya.` },
  { no: 12, stage: "3. Moderasi", name: "Batas waktu tanggapan", tags: ["new"],
    desc: `Foto yang disembunyikan ditanggapi dalam 48 jam, laporan lain dalam 7 hari. Lewat batas, sistem memberi penanda.`,
    tech: `Bergantung pada satu orang, tanpa cadangan jika berhalangan.` },

  { no: 13, stage: "4. Best Rated", name: "Best Rated otomatis", tags: ["new"],
    desc: `Badge diberikan ke barber dengan rating tertinggi, dengan minimum 5 ulasan.` },
  { no: 14, stage: "4. Best Rated", name: "Sembunyikan badge", tags: ["new"],
    desc: `Super Admin hanya bisa menyembunyikan badge jika ada indikasi manipulasi, dengan alasan yang tercatat.` },

  { no: 15, stage: "5. Sengketa nomor telepon", name: "Layar sengketa", tags: ["new"],
    desc: `Memuat nomor, akun pemilik saat ini, pelapor, bukti (teks atau foto), status, keputusan, dan alasan.` },
  { no: 16, stage: "5. Sengketa nomor telepon", name: "Riwayat nomor per akun", tags: ["new"], desc: `Nomor lama dan baru, serta siapa yang mengubahnya.` },
  { no: 17, stage: "5. Sengketa nomor telepon", name: "Tetapkan ulang nomor", tags: ["new"],
    desc: `Saat nomor ditetapkan ulang, kunjungan walk-in dan ulasan terkait ikut berpindah ke akun yang baru.`,
    tech: `Pemilik lama tidak dihubungi. Perlu standar tertulis untuk bukti yang diterima.`,
    parked: `Pemberitahuan email ke pemilik lama, dan batas waktu menanggapi.` },

  { no: 18, stage: "6. Tagihan toko", name: "Transaksi dan tagihan per toko", tags: ["new"],
    desc: `Daftar transaksi dan tagihan per toko dan per bulan, dengan ekspor CSV.` },
  { no: 19, stage: "6. Tagihan toko", name: "Invoice PDF otomatis", tags: ["new"],
    desc: `Dibuat otomatis saat periode ditutup, yaitu tanggal 25. Periodenya tanggal 26 bulan lalu sampai tanggal 25 bulan ini. Isinya nomor berurutan, identitas Loque (perorangan), tanpa PPN, dan lampiran rincian transaksi: tanggal, booking atau walk-in, dan nominal biaya.`,
    tech: `Menambah pekerjaan pilot (penomoran, lampiran, status bayar manual). Jika terlalu berat, cukup CSV untuk invoice pertama.`,
    open: `Format identitas di invoice (nama, NIK atau NPWP, alamat).` },
  { no: 20, stage: "6. Tagihan toko", name: "Status pembayaran", tags: ["new"],
    desc: `Super Admin menandai invoice Dibayar atau Belum dibayar secara manual. Pembayaran lewat transfer.` },
  { no: 21, stage: "6. Tagihan toko", name: "Kredit void", tags: ["new"],
    desc: `Void setelah tutup tanggal 25 mengurangi tagihan periode berikutnya sebagai kredit. Invoice lama tidak diubah.`,
    parked: `Urusan pajak, sampai nanti.` }
];

Loque.roles.superadmin = {
  intro: [
    "Super Admin Loque hanya dipegang tim Loque, saat ini satu orang. Peran ini menyiapkan toko, memoderasi laporan foto dan ulasan, menangani sengketa nomor telepon, dan mengurus tagihan toko.",
    "Super Admin punya akses penuh ke data toko dan customer, dengan log audit sebagai pengaman."
  ],
  flow: [
    ["Masuk", "Dengan email dan password."],
    ["Siapkan toko", "Checklist: toko, akun Owner, DOKU, katalog, jadwal, tes, buka."],
    ["Moderasi", "Foto dan ulasan yang dilaporkan, dengan batas waktu."],
    ["Selesaikan sengketa nomor", "Periksa bukti, lalu tetapkan ulang jika perlu."],
    ["Tagih toko", "Invoice PDF otomatis, lalu tandai status bayar."]
  ],
  rulesSub: "Aturan khusus untuk Super Admin Loque.",
  rules: [
    { h: "Pemegang peran", p: "Hanya tim Loque. Saat ini satu orang, yaitu pemilik Loque." },
    { h: "Penyiapan toko", p: "Berurutan lewat checklist. Toko tidak tampil ke publik sampai semua langkah selesai." },
    { h: "Akun Owner", p: "Dibuat oleh Super Admin." },
    { h: "DOKU merchant", p: "Kredensial hanya dimasukkan Super Admin. Owner hanya melihat status Terhubung atau Bermasalah." },
    { h: "Dua antrean moderasi", p: "Foto portofolio dan ulasan dipisah. Setiap keputusan wajib alasan dan tercatat, dan barber diberi tahu hasilnya." },
    { h: "Foto yang disembunyikan", p: "Laporan \"Saya ada di foto ini\" atau \"Anak saya\" menyembunyikan foto otomatis, dan dikerjakan lebih dulu." },
    { h: "Menghapus ulasan", p: "Hanya jika bukan kunjungan nyata, kasar atau diskriminatif, memuat data pribadi, atau jelas tentang toko lain. Tidak pernah karena negatif." },
    { h: "Batas tanggapan", p: "48 jam untuk foto yang disembunyikan, 7 hari untuk laporan lain. Lewat batas, sistem memberi penanda." },
    { h: "Best Rated", p: "Otomatis, rating tertinggi dengan minimum 5 ulasan. Badge hanya disembunyikan jika ada indikasi manipulasi, dengan alasan tercatat." },
    { h: "Akses data", p: "Penuh ke semua data toko dan customer. Semua akses data customer dan aksi Super Admin masuk log audit." },
    { h: "Sengketa nomor", p: "Diputuskan dari layar khusus dengan bukti. Saat nomor ditetapkan ulang, kunjungan walk-in dan ulasan terkait ikut berpindah." },
    { h: "Periode tagihan", p: "Tanggal 26 bulan lalu sampai tanggal 25 bulan ini. Invoice PDF dibuat otomatis saat periode ditutup." },
    { h: "Pembayaran invoice", p: "Lewat transfer. Status Dibayar atau Belum dibayar ditandai manual oleh Super Admin." },
    { h: "Void setelah tutup", p: "Mengurangi tagihan periode berikutnya sebagai kredit. Invoice lama tidak diubah." },
    { h: "Pajak", p: "Invoice tanpa PPN karena Loque bukan PKP. Urusan pajak ditunda." }
  ],
  internalRules: [
    { h: "Risiko 1: akses penuh dengan satu pengaman", p: "Log membantu setelah masalah terjadi. Satu akun dengan akses ke semua data, nomor telepon, dan foto anak adalah target bernilai. Gunakan password panjang unik dan jelaskan akses ini di halaman privasi UU PDP. 2FA tidak dipilih." },
    { h: "Risiko 2: pemilik lama nomor tidak dihubungi", p: "Penetapan ulang bisa memindahkan riwayat dan ulasan seseorang. Perlu standar tertulis untuk bukti yang diterima." },
    { h: "Risiko 3: invoice PDF otomatis", p: "Menambah pekerjaan pilot (status bayar manual, lampiran, penomoran). Jika terlalu berat, cukup CSV untuk invoice pertama." },
    { h: "Risiko 4: identitas di invoice", p: "Nama, NIK atau NPWP, dan alamat tetap perlu dipastikan sebelum invoice pertama, walau pajaknya ditunda." },
    { h: "Risiko 5: satu orang pemegang batas waktu", p: "Batas 48 jam dan 7 hari bergantung pada satu orang. Tidak ada cadangan jika berhalangan." },
    { h: "Tidak dipilih", p: "Pemberitahuan email ke pemilik lama nomor, batas waktu menanggapi sengketa, dan pengaman tambahan seperti 2FA." },
    { h: "Belum diputuskan", p: "Standar bukti untuk sengketa nomor. Format identitas di invoice. Apakah Super Admin tambahan diperlukan sebelum toko ke-2. Pengelolaan tautan barber di sisi Super Admin." }
  ],
  features: SUPERADMIN_FEATURES
};
})();
