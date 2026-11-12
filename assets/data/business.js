/* =====================================================================
   BISNIS & PILOT (internal) — dipakai bisnis.html.
   ===================================================================== */

(function () {
const BUSINESS = [
  { h: "Model bisnis", p: "Loque menagih toko Rp 2.000 per transaksi selesai, baik online maupun walk-in, lewat invoice bulanan. Loque tidak memegang dana pelanggan." },
  { h: "Transaksi yang ditagih", p: "Satu tagihan selesai yang terkait booking atau walk-in, dengan total di atas nol. Tidak ditagih: booking belum dibayar, hold kedaluwarsa, pembatalan, no-show, dan tagihan yang hanya berisi minuman atau produk. Tagihan yang di-void atau di-refund setelah selesai membatalkan biayanya." },
  { h: "Pencatatan tunai", p: "Walk-in tunai bergantung pada kasir yang mencatatnya. Dianggap urusan SOP toko: transaksi tak tercatat merusak laporan owner dan membuat barber tidak mendapat ulasan." },
  { h: "Pajak", p: "Loque belum PKP dan tidak berencana jadi PKP di tahun awal, jadi invoice tanpa PPN. Pajak di tagihan toko diatur per toko, default mati. Belum ada akuntan; konsultasi pajak perlu sebelum invoice pertama." },
  { h: "Badan hukum", p: "Loque masih perorangan. Tentukan badan usaha dan pajak sebelum toko ke-2." },
  { h: "Pembayaran di toko", p: "Sisa harga dibayar langsung di toko dan dicatat manual oleh kasir. Hanya booking fee yang lewat DOKU. Booking fee punya dua cara hitung: dipotong dari total tagihan, atau dihitung terpisah dari harga layanan." },
  { h: "Merchant", p: "Tiap toko punya merchant DOKU sendiri. Loque membantu menyiapkannya." },
  { h: "Kelebihan durasi", p: "Barber dibayar per layanan, bukan per durasi. Layanan yang melebihi waktu diatur kebijakan toko. Tidak ada tombol perpanjang. Waktu selesai tagihan dicatat sebagai data untuk menyetel durasi." },
  { h: "Pilot", p: "Satu toko, 2 bulan. Baseline 2 minggu sebelum rilis." },
  { h: "Komisi barber", p: "Bagi hasil ditandai sebagai uji fitur masa depan. Simpan item tagihan per barber sejak sekarang agar bisa dihitung nanti." },
  { h: "Barber solo", p: "Mode tanpa booking fee. Model pendapatan untuk barber solo belum dianalisis." }
];

const PARKED = [
  { h: "Monetisasi", items: [
    "Riset monetisasi lebih lanjut. Rp 2.000 per transaksi menutup pengeluaran saat ini; tinjau di toko ke-2.",
    "Batas atau tingkatan biaya untuk toko dengan volume tinggi.",
    "Tanya DOKU soal split atau sub-account settlement, dan soal refund QRIS lewat sistem.",
    "Model pendapatan untuk barber solo."
  ]},
  { h: "Konversi", items: [
    "Ukur drop-off di langkah pembayaran; putuskan apakah booking fee sepadan.",
    "Booking fee dibebaskan untuk customer repeat yang terpercaya.",
    "Pantau apakah satu unpaid hold menyulitkan \"Untuk orang lain\"."
  ]},
  { h: "Retensi", items: [
    "Rebooking nudge, mis. \"waktunya potong\" setelah 3 sampai 4 minggu.",
    "Reminder dan push notification untuk customer dan barber.",
    "Membership atau loyalty."
  ]},
  { h: "Penjadwalan", items: [
    "Aturan reschedule mandiri, mis. satu kali gratis, 24 jam sebelumnya.",
    "Tombol perpanjang durasi saat layanan melebihi waktu."
  ]},
  { h: "Barber", items: [
    "Komisi dan statistik pendapatan barber.",
    "Balasan barber untuk ulasan.",
    "Halaman \"layanan dan harga saya\" (hanya baca).",
    "Tanya Indra dan dua barber: apa yang membuat mereka membuka aplikasi tiap hari."
  ]},
  { h: "Hukum dan pajak", items: [
    "Pilih badan usaha sebelum toko ke-2.",
    "Konsultasi pajak sebelum invoice pertama.",
    "Tinjau kode klaim di struk jika ulasan palsu meningkat."
  ]},
  { h: "Data toko pilot", items: [
    "Isi durasi tiap layanan (kelipatan 30 menit), per barber jika berbeda.",
    "Pastikan arti \"By barber\" di daftar harga (kemungkinan barber baru).",
    "Pastikan semua barber punya email yang aktif."
  ]},
  { h: "Dokumentasi berikutnya", items: [
    "Admin & kasir, Owner & manajer, Super Admin Loque.",
    "Pengelolaan tautan barber di sisi admin dan owner.",
    "Antrean laporan foto dan ulasan di sisi admin Loque."
  ]},
  { h: "Keputusan pilot", items: [
    "Syarat mengambil toko ke-2.",
    "Angka keberhasilan, setelah baseline terkumpul."
  ]}
];

const BASELINE = [
  ["Customer per minggu (total; hari kerja vs akhir pekan)", "Dasar semua klaim pertumbuhan", "Hitung 4 minggu terakhir dari buku kasir, POS, atau chat WhatsApp."],
  ["Barber aktif, jam kerja, customer per barber per hari", "Apakah slot 30 menit cocok dengan kapasitas", "Tanya owner, lalu amati satu hari ramai dan satu hari sepi."],
  ["Jam ramai vs jam kosong", "Booking mengisi celah atau hanya menambah beban di jam ramai", "Amati atau tally 2 minggu; tanya barber."],
  ["Cara customer datang: walk-in, WhatsApp, DM Instagram, telepon", "Seberapa banyak yang bisa pindah ke Loque", "Tally di kasir 2 minggu, atau hitung chat WhatsApp."],
  ["Tingkat no-show (janji vs tidak datang dalam 15 menit)", "Ujian utama booking fee", "Hitung dari 4 sampai 8 minggu chat WhatsApp, dengan aturan 15 menit yang sama."],
  ["Biaya satu no-show (rata-rata tiket × seberapa sering jam itu terisi walk-in)", "Apakah Rp 10.000 sepadan", "Tanya owner, cocokkan dengan tingkat no-show."],
  ["Customer repeat vs baru; yang minta barber tertentu", "Menguji Quick Rebook dan visibilitas barber", "Tanya barber dan owner, cek dengan buku kasir."],
  ["Sumber customer baru (Instagram, Maps, teman)", "Pembanding untuk data ref", "Tally di kasir 2 minggu (\"Tahu dari mana?\")."],
  ["Rata-rata tiket dan layanan umum", "Porsi Rp 10.000 terhadap tiket", "Hitung dari daftar harga dan catatan kasir."],
  ["Cash vs QRIS; iPhone vs Android", "Kesiapan pembayaran digital dan risiko PWA di iOS", "Tanya owner; tally HP customer seminggu."],
  ["Waktu admin untuk booking per hari", "Baseline untuk \"Loque menghemat waktu admin\"", "Catat satu hari normal; tanya admin."],
  ["Apakah semua transaksi dicatat", "Menentukan keandalan status completed dan no-show", "Cek buku kasir sebulan terakhir."],
  ["Harga yang mau dibayar owner (komisi vs langganan)", "Pembanding uji kesediaan bayar di minggu ke-8", "Tanya langsung, catat jawaban dan tanggalnya."],
  ["Syarat mengambil toko ke-2", "Aturan go/no-go", "Keputusan Anda."]
];

const METRICS = [
  ["Konversi pembayaran (dibuka → dibayar)", "Booking fee dan DOKU checkout berfungsi", "Di bawah ±60%: periksa booking fee dan UX checkout."],
  ["No-show rate vs baseline toko", "Booking membantu barber", "Tidak turun: booking fee tidak bekerja."],
  ["Booking dari customer baru dan tautan ref", "Loque membawa visibilitas", "Mendekati nol: Loque sebatas alat booking."],
  ["Booking ditandai selesai atau no-show di hari yang sama", "Ketergantungan pada kasir terjaga", "Di bawah ±95%: status dan ulasan tak bisa dipercaya."],
  ["Ulasan yang dihapus karena \"bukan kunjungan nyata\"", "Risiko klaim nomor telepon", "Naik: tinjau kode klaim di struk."],
  ["Kesediaan owner membayar (minggu ke-8)", "Ada bisnisnya", "Ya atau tidak, plus harga."]
];

const CHANGELOG = [
  { v: "0.8", d: "31 Okt 2026", time: "", t: "Admin, harga, dan pembayaran di toko", items: [
    "Admin boleh mengubah jadwal (jam kerja, blok barber, jadwal toko) serta harga dan durasi layanan. Halaman Admin dan Owner diperbarui; Admin kini 31 fitur.",
    "Sisa harga dibayar langsung di toko dan dicatat manual oleh kasir, tidak lewat DOKU. Halaman Customer, beranda, dan istilah diperbarui.",
    "Booking fee mendukung dua cara hitung yang dijelaskan di semua halaman terkait: dipotong dari total tagihan, atau dihitung terpisah dari harga layanan. Mode tanpa fee tetap ada."
  ]},
  { v: "0.7", d: "31 Okt 2026", time: "", t: "Super Admin Loque terdokumentasi", items: [
    "Super Admin Loque pindah dari Segera ke Terdokumentasi. Kelima peran kini terdokumentasi, dengan 21 fitur untuk Super Admin (S1 sampai S21).",
    "Keputusan baru masuk: checklist penyiapan toko, dua antrean moderasi dengan batas 48 jam dan 7 hari, Best Rated otomatis (minimal 5 ulasan), layar sengketa nomor telepon, dan invoice PDF otomatis dengan periode tanggal 26 sampai 25.",
    "Invoice: void setelah tutup menjadi kredit di periode berikutnya. Halaman Owner diperbarui (invoice otomatis, kredit void, aturan koreksi tidak lagi terbuka; kini 31 fitur).",
    "Dua butir yang tadinya terbuka kini diputuskan dan diperbarui di halaman Barber dan Customer: batas tanggapan moderasi, dan minimum ulasan Best Rated."
  ]},
  { v: "0.6", d: "31 Okt 2026", time: "", t: "Owner & manajer terdokumentasi", items: [
    "Owner & manajer pindah dari Segera ke Terdokumentasi, dengan gambaran, aturan, dan 30 fitur (O1 sampai O30).",
    "Keputusan baru masuk: dasbor, daftar void dengan tolak, kedaluwarsa token, filter, dan tanda void besar, pengaturan toko, invoice Loque di luar sistem, dan laporan dengan ekspor CSV.",
    "Owner dan Manager satu peran di versi pertama.",
    "Lima risiko dan butir terbuka dicatat di bagian Internal."
  ]},
  { v: "0.5", d: "31 Okt 2026", time: "", t: "Admin & kasir terdokumentasi", items: [
    "Admin & kasir pindah dari Segera ke Terdokumentasi, dengan gambaran, aturan, dan 28 fitur (A1 sampai A28; 26 tampil di daftar utama).",
    "Keputusan baru masuk: timeline kalender semua barber, walk-in dua jalur, pindah jadwal hanya lewat form, tanpa tombol perpanjang, pembayaran sisa dicatat manual, dan void dengan persetujuan owner.",
    "Pengaturan harga, durasi, booking fee, dan jadwal barber hanya untuk owner atau manajer.",
    "Enam risiko yang dipantau selama pilot dicatat di bagian Internal.",
    "Ditambah istilah Void di daftar istilah."
  ]},
  { v: "0.4", d: "22 Okt 2026", time: "13:15 WIB", t: "Disusun per peran", items: [
    "Halaman dipisah per peran: Customer dan Barber terdokumentasi, Admin & kasir, Owner & manajer, dan Super Admin Loque ditandai Segera.",
    "Tiap bagian punya toggle Internal sendiri, ditambah tombol \"Tampilkan semua internal\" di sidebar.",
    "Ditambah bagian Tentang Loque, peran, istilah, dan status booking agar mudah dipahami pembaca baru.",
    "Keputusan baru masuk: booking fee dipotong dari tagihan dengan tiga mode, slot 30 menit, durasi per layanan dan barber, Rp 2.000 per transaksi untuk toko, walk-in dengan nama dan nomor telepon, laporan foto tanpa login."
  ]},
  { v: "0.3", d: "21 Okt 2026", time: "03:17 WIB", t: "Versi presentasi", items: [
    "Semua fitur ulasan customer (C33 sampai C38) masuk MVP; status \"belum diputuskan\" dihapus.",
    "Teks diringkas untuk pemilik toko dan calon mitra.",
    "Konten internal dipindah ke satu bagian yang bisa disembunyikan.",
    "Changelog memakai jam (WIB)."
  ]},
  { v: "0.2", d: "21 Okt 2026", time: "03:02 WIB", t: "Tampilan dan bahasa", items: [
    "Tema default terang.",
    "Navigasi pindah ke sidebar, dengan drawer di layar kecil.",
    "Seluruh teks Bahasa Indonesia; istilah teknis tetap Inggris."
  ]},
  { v: "0.1", d: "21 Okt 2026", time: "02:53 WIB", t: "Versi pertama", items: [
    "46 fitur awal ditulis ulang dengan keputusan pilot.",
    "Baris baru 47 sampai 52: tautan barber, dibatalkan toko, jadwal diubah admin, funnel tracking, beranda sebelum login, tidak hadir.",
    "Menambah keputusan, status booking, daftar ditunda, baseline dan metrik pilot."
  ]}
];

Loque.data = Object.assign(Loque.data || {}, { BUSINESS, PARKED, BASELINE, METRICS, CHANGELOG });
})();
