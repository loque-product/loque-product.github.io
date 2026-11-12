/* =====================================================================
   render-business.js — halaman Bisnis & pilot (bisnis.html). Khusus tim.
   Isi dibungkus blok Internal, seperti sebelumnya.
   ===================================================================== */
(function (L) {
  const { esc, cards } = L;
  const { BUSINESS, PARKED, BASELINE, METRICS, CHANGELOG } = L.data;

  function businessHTML(){
    const parked = PARKED.map(g => `<div class="pcard"><h4>${esc(g.h)}</h4><ul>${g.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("loque-baseline") || "{}"); } catch(e){}
    const base = BASELINE.map((r,i) =>
      `<tr class="brow"><td class="chk" data-label="Selesai"><input type="checkbox" data-i="${i}" aria-label="Sudah terkumpul: ${esc(r[0])}" ${saved[i] ? "checked" : ""}></td>` +
      `<td data-label="Yang dikonfirmasi"><b>${i+1}.</b> ${esc(r[0])}</td><td data-label="Alasan">${esc(r[1])}</td><td data-label="Cara dapat">${esc(r[2])}</td></tr>`).join("");
    const metrics = METRICS.map(m =>
      `<tr class="brow"><td data-label="Metrik"><b>${esc(m[0])}</b></td><td data-label="Menguji">${esc(m[1])}</td><td data-label="Aturan sementara">${esc(m[2])}</td></tr>`).join("");
    const log = CHANGELOG.map(c =>
      `<li><b>v${esc(c.v)} · ${esc(c.t)}</b><span class="d">${esc(c.d)}${c.time ? " · " + esc(c.time) : ""}</span><ul>${c.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></li>`).join("");

    const inner = `
    <h2 class="sub-h">Keputusan bisnis</h2>
    <div class="cards">${cards(BUSINESS)}</div>

    <h2 class="sub-h">Ditunda dan TBD</h2>
    <div class="parked-grid">${parked}</div>

    <h2 class="sub-h">Pilot: baseline</h2>
    <div class="timeline">
      <div class="tl"><b>2 minggu</b><span>Baseline sebelum rilis</span></div>
      <div class="tl"><b>8 minggu</b><span>Pilot satu toko</span></div>
      <div class="tl"><b>Minggu ke-4</b><span>Checkpoint</span></div>
      <div class="tl"><b>Minggu ke-8</b><span>Go / no-go toko ke-2</span></div>
    </div>
    <div class="table-wrap" style="margin-top:14px"><table>
      <thead><tr><th>Selesai</th><th>Yang dikonfirmasi</th><th>Alasan</th><th>Cara dapat</th></tr></thead>
      <tbody id="baseBody">${base}</tbody>
    </table></div>
    <p class="foot-note">Waktu terbatas? Kerjakan nomor 1, 4, 5, 7, 11. Kolom tally: tanggal, jam, cara booking, baru/repeat, barber, layanan, cara bayar, hadir/tidak.</p>

    <h2 class="sub-h">Pilot: metrik</h2>
    <p class="sub-p">Ambang adalah placeholder. Ganti setelah baseline terkumpul.</p>
    <div class="table-wrap"><table>
      <thead><tr><th>Metrik</th><th>Menguji</th><th>Aturan sementara</th></tr></thead>
      <tbody>${metrics}</tbody>
    </table></div>

    <h2 class="sub-h">Changelog</h2>
    <ul class="log">${log}</ul>

    <p class="edit-note">Untuk mengubah isi, edit file data di folder <code>assets/data/</code>. Isi halaman ini ada di <code>business.js</code>. Peran baru: tambahkan satu baris ke <code>ROLES</code> di <code>site.js</code>, lalu buat <code>assets/data/roles/&lt;id&gt;.js</code> dan <code>roles/&lt;id&gt;.html</code>. Fitur baru: tambahkan satu objek ke daftar fitur di file peran itu. Tandai <code>internal: true</code> agar tidak tampil di daftar utama.</p>`;

    return `<section class="role" id="bisnis">
    <a class="crumb" href="${L.url.home()}">← Dokumentasi Loque</a>
    <div class="role-head">
      <div>
        <div class="eyebrow">Khusus tim</div>
        <h1>Bisnis &amp; pilot</h1>
        <p>Model bisnis, pajak, rencana, baseline, dan changelog. Untuk tim, bukan untuk presentasi.</p>
      </div>
    </div>
    ${L.internalBlock("int-bisnis", "Bisnis & pilot", "Model bisnis, ditunda, baseline, metrik, changelog.", inner)}
  </section>`;
  }

  document.title = "Bisnis & pilot · Dokumentasi Produk Loque";
  L.mountShell("");
  L.$("mount").innerHTML = businessHTML();
  L.$("baseBody").addEventListener("change", (e) => {
    const el = e.target; if (!el.matches("input[type=checkbox]")) return;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("loque-baseline") || "{}"); } catch(err){}
    saved[el.dataset.i] = el.checked;
    try { localStorage.setItem("loque-baseline", JSON.stringify(saved)); } catch(err){}
  });
  L.finish();
  /* Halaman ini memang khusus tim; buka bloknya seperti saat tautan #bisnis dibuka dulu. */
  const blk = document.getElementById("int-bisnis");
  if (blk) L.setInt(blk, true);
})(window.Loque);
