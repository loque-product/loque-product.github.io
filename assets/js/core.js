/* =====================================================================
   core.js — dipakai semua halaman.
   Isi: helper, tema, shell (sidebar + header mobile), toggle Internal,
   navigasi, dan scroll-spy. Dimuat di <head> supaya tema terpasang
   sebelum halaman tampil (tanpa kedip).
   ===================================================================== */
window.Loque = window.Loque || {};
window.Loque.data = window.Loque.data || {};
window.Loque.roles = window.Loque.roles || {};

(function (L) {
  const html = document.documentElement;
  L.root = html.dataset.root || "";          // "" di akar situs, "../" di roles/
  L.page = html.dataset.page || "home";      // home | role | business

  /* ---------- helper ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const fmt = (s) => esc(s).replace(/\{\{(.+?)\}\}/g, "<code>$1</code>");
  const cards = (list) => list.map(r => `<div class="card"><h4>${esc(r.h)}</h4><p>${esc(r.p)}</p></div>`).join("");
  Object.assign(L, {
    $, esc, fmt, cards,
    TAG_LABEL: { new: "Baru", changed: "Diubah", open: "Terbuka", parked: "Ditunda", dflt: "Default", internal: "Internal saja" },
    stageLabel: (s) => s.replace(/^\d+\.\s*/, "")
  });

  /* ---------- tautan antarhalaman ---------- */
  L.url = {
    home: (hash) => `${L.root}index.html${hash || ""}`,
    role: (id, hash) => `${L.root}roles/${id}.html${hash || ""}`,
    business: (hash) => `${L.root}bisnis.html${hash || ""}`
  };

  /* ---------- data peran: indeks (site.js) + detail (roles/<id>.js) ---------- */
  L.allRoles = () => L.data.ROLES.slice().sort((a, b) => a.order - b.order).map(r => Object.assign({}, r, L.roles[r.id] || {}));
  L.getRole = (id) => L.allRoles().find(r => r.id === id);

  /* ---------- tema (default terang) ---------- */
  function applyTheme(t){
    if (t === "dark") html.setAttribute("data-theme","dark");
    else html.removeAttribute("data-theme");
    document.querySelectorAll("[data-theme-btn]").forEach(b => b.textContent = t === "dark" ? "Mode terang" : "Mode gelap");
  }
  let theme = "light";
  try { if (localStorage.getItem("loque-theme") === "dark") theme = "dark"; } catch(e){}
  applyTheme(theme);

  /* ---------- komponen: blok internal ---------- */
  L.internalBlock = function (id, title, hint, inner){
    return `<div class="int" id="${id}">
    <div class="int-head">
      <div><span class="pill">Internal</span><div class="int-title">${esc(title)}</div><div class="int-hint">${esc(hint)}</div></div>
      <button class="int-btn" type="button" aria-expanded="false" aria-controls="${id}-body">Tampilkan</button>
    </div>
    <div class="int-body" id="${id}-body" hidden>${inner}</div>
  </div>`;
  };

  function setInt(el, open){
    const btn = el.querySelector(":scope > .int-head > .int-btn");
    const body = el.querySelector(":scope > .int-body");
    body.hidden = !open;
    btn.textContent = open ? "Sembunyikan" : "Tampilkan";
    btn.setAttribute("aria-expanded", String(open));
    syncAll();
  }
  L.setInt = setInt;
  function syncAll(){
    const btn = $("intAll"); if (!btn) return;
    const all = [...document.querySelectorAll(".int")];
    btn.hidden = !all.length;
    const allOpen = all.length && all.every(e => !e.querySelector(":scope > .int-body").hidden);
    btn.textContent = allOpen ? "Sembunyikan semua internal" : "Tampilkan semua internal";
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".int-btn");
    if (btn){
      const el = btn.closest(".int");
      setInt(el, el.querySelector(":scope > .int-body").hidden);
    }
  });
  function openForHash(hash){
    if (!hash) return;
    const t = document.getElementById(hash.slice(1));
    if (!t) return;
    const inside = t.closest(".int") || (t.id === "bisnis" ? t.querySelector(".int") : null);
    if (inside) setInt(inside, true);
  }

  /* ---------- navigasi sidebar ---------- */
  function navHTML(){
    const onHome = L.page === "home";
    const curRole = L.page === "role" ? html.dataset.role : null;
    const dot = `<span class="dot"></span>`;

    const startLinks = [["tentang","Tentang Loque"],["manfaat","Untuk toko &amp; barber"],["peran","Peran di Loque"],["istilah","Istilah"],["status","Status booking"]];
    let h = `<div class="nav-group"><h4>Mulai di sini</h4>` + startLinks.map(([id,label]) =>
      onHome ? `<a href="#${id}" data-spy="${id}">${dot}${label}</a>`
             : `<a href="${L.url.home("#" + id)}">${dot}${label}</a>`).join("") + `</div>`;

    const roles = L.allRoles();
    const roleLink = (r) => {
      const isCur = r.id === curRole;
      const badge = r.status === "live" ? "" : `<span class="n">segera</span>`;
      let out = `<a href="${L.url.role(r.id)}"${isCur ? ` aria-current="page"` : ""}>${dot}${esc(r.name)}${badge}</a>`;
      if (isCur && r.status === "live"){
        const n = r.features.filter(f => !f.internal).length;
        out += `<a class="sub" href="#${r.id}" data-spy="${r.id}">${dot}Gambaran</a>
          <a class="sub" href="#${r.id}-rules" data-spy="${r.id}-rules">${dot}Aturan</a>
          <a class="sub" href="#${r.id}-features" data-spy="${r.id}-features">${dot}Fitur<span class="n">${n}</span></a>`;
      }
      return out;
    };
    h += `<div class="nav-group"><h4>Peran</h4>${roles.filter(r => r.status === "live").map(roleLink).join("")}</div>`;
    const soon = roles.filter(r => r.status !== "live");
    if (soon.length) h += `<div class="nav-group"><h4>Peran lain</h4>${soon.map(roleLink).join("")}</div>`;

    h += `<div class="nav-group"><h4>Tim</h4>
      <a href="${L.url.business()}"${L.page === "business" ? ` aria-current="page"` : ""}>${dot}Bisnis &amp; pilot<span class="n">internal</span></a>
    </div>`;
    return h;
  }

  function setupSpy(){
    const links = {};
    document.querySelectorAll("a[data-spy]").forEach(a => links[a.dataset.spy] = a);
    if (!Object.keys(links).length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting){
          Object.values(links).forEach(a => a.removeAttribute("aria-current"));
          const a = links[en.target.id]; if (a) a.setAttribute("aria-current","true");
        }
      });
    }, { rootMargin: "-15% 0px -75% 0px" });
    Object.keys(links).forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- shell halaman ---------- */
  L.mountShell = function (heroHTML){
    const m = L.data.META;
    $("app").innerHTML = `
<header class="mbar">
  <button class="menu-btn" id="menuBtn" type="button" aria-label="Buka navigasi" aria-expanded="false" aria-controls="side">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
  </button>
  <a class="brand" href="${L.url.home()}"><img src="${L.url.home()}favicon.svg" class="brand-mark" alt="Loque"><div class="brand-name">Loque</div></a>
  <button class="theme-btn" data-theme-btn type="button">Mode gelap</button>
</header>
<div class="scrim" id="scrim"></div>

<div class="shell">
  <nav class="side" id="side" aria-label="Navigasi halaman">
    <a class="brand" href="${L.url.home()}">
      <img src="${L.url.home()}favicon.svg" class="brand-mark" alt="Loque">
      <div class="brand-name">Loque<small>Dokumentasi Produk</small></div>
    </a>

    <div id="navMount">${navHTML()}</div>

    <div class="side-foot">
      <button class="theme-btn wide" id="intAll" type="button">Tampilkan semua internal</button>
      <div class="row">
        <span class="ver">v${esc(m.version)}</span>
        <button class="theme-btn" data-theme-btn type="button">Mode gelap</button>
      </div>
    </div>
  </nav>

  <main>
    <div class="content">
      ${heroHTML || ""}
      <div id="mount"></div>
      <footer>Loque · versi ${esc(m.version)} · ${esc(m.updated)}</footer>
    </div>
  </main>
</div>`;

    /* drawer (mobile) */
    const side = $("side"), scrim = $("scrim"), menuBtn = $("menuBtn");
    const openDrawer = () => { side.classList.add("open"); scrim.classList.add("show"); menuBtn.setAttribute("aria-expanded","true"); };
    const closeDrawer = () => { side.classList.remove("open"); scrim.classList.remove("show"); menuBtn.setAttribute("aria-expanded","false"); };
    menuBtn.addEventListener("click", () => side.classList.contains("open") ? closeDrawer() : openDrawer());
    scrim.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 1000) closeDrawer(); });
    $("navMount").addEventListener("click", (e) => { if (e.target.closest("a")) closeDrawer(); });

    /* tema */
    applyTheme(theme);
    document.querySelectorAll("[data-theme-btn]").forEach(b => b.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      applyTheme(theme);
      try { localStorage.setItem("loque-theme", theme); } catch(e){}
    }));

    /* tampilkan/sembunyikan semua blok internal */
    $("intAll").addEventListener("click", () => {
      const all = [...document.querySelectorAll(".int")];
      const allOpen = all.every(e => !e.querySelector(":scope > .int-body").hidden);
      all.forEach(e => setInt(e, !allOpen));
    });
  };

  /* Dipanggil setelah isi halaman terpasang di #mount. */
  L.finish = function (){
    setupSpy();
    syncAll();
    openForHash(location.hash);
    /* Konten dirender lewat JS, jadi lompat ke #bagian dilakukan di sini. */
    if (location.hash){
      let t = null;
      try { t = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch(e){}
      if (t) t.scrollIntoView();
    }
  };
})(window.Loque);
