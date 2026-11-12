/* =====================================================================
   render-role.js — halaman satu peran (roles/<id>.html).
   Id peran dibaca dari <html data-role="...">.
   ===================================================================== */
(function (L) {
  const { esc, fmt, cards, TAG_LABEL, stageLabel } = L;
  const r = L.getRole(document.documentElement.dataset.role);
  if (!r){ L.mountShell(""); L.$("mount").innerHTML = `<p class="empty">Peran tidak ditemukan. <a href="${L.url.home("#peran")}">Kembali ke daftar peran</a>.</p>`; return; }

  const state = { stage: "all", q: "" };
  const stagesOf = (pub) => [...new Set(pub.map(f => f.stage))].sort((a,b) => parseInt(a) - parseInt(b));

  function headHTML(){
    const live = r.status === "live";
    return `
    <a class="crumb" href="${L.url.home("#peran")}">← Semua peran</a>
    <div class="role-head">
      <div>
        <div class="eyebrow">Peran ${r.order}</div>
        <h1>${esc(r.name)}</h1>
        <p>${esc(r.who)}</p>
      </div>
      <span class="st ${live ? "live" : ""}">${live ? "Terdokumentasi" : "Segera"}</span>
    </div>`;
  }

  function soonHTML(){
    const decided = `<div class="paras"><p>Keputusan yang sudah masuk untuk peran ini:</p></div><ul class="note" style="margin:0 0 10px; padding-left:18px">${r.decided.map(d => `<li>${esc(d)}</li>`).join("")}</ul>` +
      (r.open ? `<p class="note"><b>Terbuka:</b> ${esc(r.open)}</p>` : "");
    return `<section class="role" id="${r.id}">${headHTML()}
      <div class="block" style="margin-bottom:0">
        <div class="paras"><p>${esc(r.soonText)}</p></div>
        ${L.internalBlock("int-" + r.id, "Keputusan yang sudah masuk", "Catatan dari pembahasan sejauh ini. Bukan daftar fitur final.", decided)}
      </div>
    </section>`;
  }

  function liveHTML(){
    const flow = `<div class="flow" style="--n:${r.flow.length}">${r.flow.map((s,i) =>
      `<div class="flow-step"><span class="fn">${i+1}</span><h4>${esc(s[0])}</h4><p>${esc(s[1])}</p></div>`).join("")}</div>`;

    const noteRows = r.features.filter(f => f.internal || f.tech || f.open || f.dflt || f.parked || (f.tags||[]).length).sort((a,b) => a.no - b.no);
    const notes = noteRows.map(f => {
      const tg = [...(f.tags||[])];
      if (f.internal) tg.unshift("internal");
      if (f.dflt) tg.push("dflt");
      if (f.open) tg.push("open");
      if (f.parked) tg.push("parked");
      const pills = tg.length ? `<div class="tags">${tg.map(t => `<span class="tag ${t}">${TAG_LABEL[t]}</span>`).join("")}</div>` : "";
      const body =
        (f.internal ? `<p class="note">${fmt(f.desc)}</p>` : "") +
        (f.tech ? `<p class="note">${fmt(f.tech)}</p>` : "") +
        (f.dflt ? `<p class="note"><b>Default:</b> ${fmt(f.dflt)}</p>` : "") +
        (f.open ? `<p class="note"><b>Terbuka:</b> ${fmt(f.open)}</p>` : "") +
        (f.parked ? `<p class="note"><b>Ditunda:</b> ${fmt(f.parked)}</p>` : "");
      return `<tr class="row"><td class="no">${r.prefix}${f.no}</td><td class="feat" data-label="Fitur">${fmt(f.name)}</td><td data-label="Catatan">${pills}${body || `<p class="note">Fitur ini berubah dari versi pertama.</p>`}</td></tr>`;
    }).join("");

    const featInternal = L.internalBlock("int-" + r.id + "-features", `Catatan fitur ${r.name}`, "Detail teknis, default, poin terbuka, item ditunda, dan fitur yang tidak dilihat pengguna.",
      `<div class="table-wrap"><table><thead><tr><th>No</th><th>Fitur</th><th>Catatan</th></tr></thead><tbody>${notes}</tbody></table></div>`);
    const rulesInternal = L.internalBlock("int-" + r.id + "-rules", `Catatan aturan ${r.name}`, "Alasan di balik aturan dan keputusan teknis.", `<div class="cards">${cards(r.internalRules)}</div>`);

    return `<section class="role" id="${r.id}">${headHTML()}
    <div class="block">
      <h2 class="sec lvl">Gambaran</h2>
      <div class="paras" style="margin-top:12px">${r.intro.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      ${flow}
    </div>

    <div class="block" id="${r.id}-rules">
      <h2 class="sec lvl">Aturan</h2>
      <p class="sub">${esc(r.rulesSub)}</p>
      <div class="cards">${cards(r.rules)}</div>
      ${rulesInternal}
    </div>

    <div class="block" id="${r.id}-features" style="margin-bottom:0">
      <h2 class="sec lvl">Daftar fitur</h2>
      <p class="sub">Per tahap perjalanan. Kode fitur diawali huruf ${r.prefix}.</p>
      <div class="filters">
        <input class="search" id="q-${r.id}" type="search" placeholder="Cari fitur ${esc(r.name)}" aria-label="Cari fitur ${esc(r.name)}">
        <div class="chips" id="chips-${r.id}" role="group" aria-label="Filter menurut tahap"></div>
      </div>
      <p class="count-line" id="count-${r.id}"></p>
      <div class="table-wrap"><table>
        <thead><tr><th>No</th><th>Fitur</th><th>Fungsi</th></tr></thead>
        <tbody id="body-${r.id}"></tbody>
      </table></div>
      ${featInternal}
    </div>
  </section>`;
  }

  function renderFeatures(){
    const pub = r.features.filter(f => !f.internal);
    const stages = stagesOf(pub);
    const list = pub.filter(f => {
      if (state.stage !== "all" && f.stage !== state.stage) return false;
      if (state.q){
        const hay = (r.prefix + f.no + " " + f.name + " " + f.desc + " " + f.stage).toLowerCase();
        if (!hay.includes(state.q)) return false;
      }
      return true;
    });
    L.$("count-" + r.id).textContent = `${list.length} dari ${pub.length} fitur`;
    if (!list.length){ L.$("body-" + r.id).innerHTML = `<tr><td colspan="3" class="empty">Tidak ada fitur yang cocok.</td></tr>`; return; }
    let html = "";
    stages.forEach(s => {
      const rows = list.filter(f => f.stage === s).sort((a,b) => a.no - b.no);
      if (!rows.length) return;
      html += `<tr class="group"><td colspan="3">${esc(s)}<span>${rows.length} fitur</span></td></tr>`;
      rows.forEach(f => {
        html += `<tr class="row"><td class="no">${r.prefix}${f.no}</td><td class="feat" data-label="Fitur">${fmt(f.name)}</td><td data-label="Fungsi">${fmt(f.desc)}</td></tr>`;
      });
    });
    L.$("body-" + r.id).innerHTML = html;
  }

  function buildFilters(){
    const pub = r.features.filter(f => !f.internal);
    const box = L.$("chips-" + r.id);
    const mk = (key, label) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = label; b.dataset.key = key;
      b.setAttribute("aria-pressed", String(state.stage === key));
      b.addEventListener("click", () => {
        state.stage = key;
        box.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.key === key)));
        renderFeatures();
      });
      return b;
    };
    box.append(mk("all", "Semua"));
    stagesOf(pub).forEach(s => box.append(mk(s, stageLabel(s))));
    L.$("q-" + r.id).addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); renderFeatures(); });
    renderFeatures();
  }

  /* peran sebelum / sesudah, supaya bisa dibaca berurutan */
  function pagerHTML(){
    const all = L.allRoles(), i = all.findIndex(x => x.id === r.id);
    const link = (x, dir) => x ? `<a class="pg ${dir}" href="${L.url.role(x.id)}"><span>${dir === "prev" ? "Sebelumnya" : "Berikutnya"}</span><b>${esc(x.name)}</b></a>` : `<span></span>`;
    return `<nav class="pager" aria-label="Peran lain">${link(all[i-1], "prev")}${link(all[i+1], "next")}</nav>`;
  }

  document.title = `${r.name} · Dokumentasi Produk Loque`;
  L.mountShell("");
  L.$("mount").innerHTML = (r.status === "live" ? liveHTML() : soonHTML()) + pagerHTML();
  if (r.status === "live") buildFilters();
  L.finish();
})(window.Loque);
