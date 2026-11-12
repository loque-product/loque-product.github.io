/* =====================================================================
   render-home.js — beranda (index.html): gerbang ke semua halaman.
   ===================================================================== */
(function (L) {
  const { esc, cards } = L;
  const { META, ABOUT, GLOSSARY, STATUSES, STATUS_INTERNAL } = L.data;

  /* Tautan lama seperti /#customer-features dulunya satu halaman.
     Arahkan ke halaman peran yang sesuai supaya tautan lama tetap jalan. */
  (function redirectLegacyHash(){
    const id = decodeURIComponent((location.hash || "").slice(1));
    if (!id) return;
    if (id === "bisnis" || id === "int-bisnis"){ location.replace(L.url.business()); return; }
    const hit = L.data.ROLES.find(r =>
      id === r.id || id.startsWith(r.id + "-") || id === "int-" + r.id || id.startsWith("int-" + r.id + "-"));
    if (hit) location.replace(L.url.role(hit.id, "#" + id));
  })();

  const hero = `
      <div class="hero">
        <div class="eyebrow">Loque · Dokumentasi produk</div>
        <h1>Booking barber yang rapi, dari cari sampai ulasan.</h1>
        <p class="lead">Loque adalah platform booking untuk barbershop. Dokumentasi ini menjelaskan cara kerjanya, peran demi peran, beserta fitur MVP yang dibangun untuk pilot.</p>
        <p class="lead">Baru pertama membaca? Mulai dari "Tentang Loque", lalu buka peran yang ingin Anda pahami.</p>
        <p class="meta">Versi ${esc(META.version)} · diperbarui ${esc(META.updated)}</p>
      </div>`;

  function aboutHTML(){
    const steps = (list) => `<div class="flow" style="--n:${list.length}">${list.map((s,i) =>
      `<div class="flow-step"><span class="fn">${i+1}</span><h4>${esc(s[0])}</h4><p>${esc(s[1])}</p></div>`).join("")}</div>`;

    const roleCards = L.allRoles().map(r =>
      `<div class="card"><h4>${esc(r.name)} <span class="st ${r.status === "live" ? "live" : ""}">${r.status === "live" ? "Terdokumentasi" : "Segera"}</span></h4><p>${esc(r.who)}</p> <a href="${L.url.role(r.id)}">Buka halaman peran ini</a></div>`).join("");

    const statusRows = STATUSES.map(s =>
      `<tr class="srow"><td data-label="Status"><b>${esc(s.s)}</b></td><td data-label="Artinya">${esc(s.mean)}</td><td data-label="Diatur oleh">${esc(s.by)}</td><td data-label="Yang dilihat customer">${esc(s.sees)}</td></tr>`).join("");

    return `
  <section class="block" id="tentang">
    <h2 class="sec">Tentang Loque</h2>
    <div class="paras" style="margin-top:14px">${ABOUT.paras.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    <h3 class="sub-h">Cara kerjanya, dari awal sampai akhir</h3>
    <p class="sub-p">Satu booking melewati beberapa peran. Ini urutannya.</p>
    ${steps(ABOUT.flow)}
  </section>

  <section class="block" id="manfaat">
    <h2 class="sec">Untuk toko dan barber</h2>
    <p class="sub">Yang berubah di sisi toko.</p>
    <div class="cards">${cards(ABOUT.benefits)}</div>
  </section>

  <section class="block" id="peran">
    <h2 class="sec">Peran di Loque</h2>
    <p class="sub">Lima jenis pengguna, dengan akses yang berbeda. Tiap peran punya halaman sendiri berisi gambaran, aturan, dan daftar fiturnya.</p>
    <div class="cards">${roleCards}</div>
    <h3 class="sub-h">Cara membaca dokumentasi ini</h3>
    <div class="cards">${cards(ABOUT.readme)}</div>
  </section>

  <section class="block" id="istilah">
    <h2 class="sec">Istilah</h2>
    <p class="sub">Kata-kata yang akan sering muncul, dalam bahasa sederhana.</p>
    <div class="cards">${GLOSSARY.map(g => `<div class="card"><h4>${esc(g.t)}</h4><p>${esc(g.d)}</p></div>`).join("")}</div>
  </section>

  <section class="block" id="status">
    <h2 class="sec">Status booking</h2>
    <p class="sub">Setiap booking punya satu status. Ini artinya dan siapa yang mengubahnya.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Status</th><th>Artinya</th><th>Diatur oleh</th><th>Yang dilihat customer</th></tr></thead>
      <tbody>${statusRows}</tbody>
    </table></div>
    ${L.internalBlock("int-status", "Catatan status booking", "Label kerja, field refund, dan jalur pembatalan.", `<div class="cards">${cards(STATUS_INTERNAL)}</div>`)}
  </section>`;
  }

  document.title = "Dokumentasi Produk Loque";
  L.mountShell(hero);
  L.$("mount").innerHTML = aboutHTML();
  L.finish();
})(window.Loque);
