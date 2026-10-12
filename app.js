// app.js - builds the page from content.js. Nothing to edit here.
(function () {
  const S = window.SITE;
  const LANGS = ["en", "ar", "fr"];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let lang = "en";
  try { const saved = localStorage.getItem("pp_lang"); if (LANGS.includes(saved)) lang = saved; } catch (e) { /* private mode */ }
  const q = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(q)) lang = q;

  const tr = (v) => (v == null ? "" : typeof v === "string" ? v : v[lang] || v.en || "");
  const url = (u) => (u === "@classpulse" ? S.classpulse : u);
  const todo = (s) => /TODO/.test(s);

  function currentTab() {
    const id = location.hash.replace("#", "");
    return S.tabs.find((t) => t.id === id) || S.tabs[0];
  }

  function renderBlock(b) {
    if (b.type === "text") return `<p class="lead">${esc(tr(b.text))}</p>`;
    if (b.type === "facts") return `<dl class="facts">${b.items.map((f) => `<div><dt>${esc(tr(f.k))}</dt><dd class="${todo(tr(f.v)) ? "todo" : ""}">${esc(tr(f.v))}</dd></div>`).join("")}</dl>`;
    if (b.type === "cards") return `<div class="grid">${b.items.map((c) => `<article class="tile"><h3>${esc(tr(c.t))}</h3><p>${esc(tr(c.d))}</p></article>`).join("")}</div>`;
    if (b.type === "list") return (b.title ? `<h2>${esc(tr(b.title))}</h2>` : "") +
      `<ul class="list">${b.items.map((i) => `<li class="${todo(tr(i)) ? "todo" : ""}">${esc(tr(i))}</li>`).join("")}</ul>`;
    if (b.type === "button") return `<a class="btn" href="${esc(url(b.url))}">${esc(tr(b.label))} <span aria-hidden="true">→</span></a>`;
    return "";
  }

  function render() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("#lang button").forEach((b) => b.classList.toggle("on", b.dataset.l === lang));
    $("name").textContent = tr(S.name);
    $("title").textContent = tr(S.title);
    $("aff").textContent = tr(S.affiliation);
    $("tagline").textContent = tr(S.tagline);
    $("photo").innerHTML = S.photo ? `<img src="${esc(S.photo)}" alt="${esc(tr(S.name))}" onerror="this.parentNode.textContent='${esc(S.initials)}'">` : esc(S.initials);
    $("contact").innerHTML =
      `<a href="mailto:${esc(S.email)}">✉ ${esc(S.email)}</a>` +
      (S.office ? `<span>⌂ ${esc(tr(S.office))}</span>` : "");
    $("links").innerHTML = (S.links || []).filter((l) => l.url).map((l) => `<a href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join("");
    $("cp").href = S.classpulse;
    $("cp").textContent = { en: "ClassPulse · students' space", ar: "ClassPulse · فضاء الطلبة", fr: "ClassPulse · espace étudiants" }[lang];
    const cur = currentTab();
    $("tabs").innerHTML = S.tabs.map((t) =>
      `<a role="tab" href="#${t.id}" aria-selected="${t === cur}" class="${t === cur ? "on" : ""}"><span class="ic">${t.icon || ""}</span>${esc(tr(t.label))}</a>`).join("");
    $("panel").innerHTML = `<h2 class="ptitle">${esc(tr(cur.label))}</h2>` + cur.blocks.map(renderBlock).join("");
    $("panel").classList.remove("in"); void $("panel").offsetWidth; $("panel").classList.add("in");
    document.title = tr(S.name) + " · " + tr(cur.label);
  }

  document.querySelectorAll("#lang button").forEach((b) => b.onclick = () => {
    lang = b.dataset.l;
    try { localStorage.setItem("pp_lang", lang); } catch (e) { /* private mode */ }
    render();
  });
  window.addEventListener("hashchange", render);
  render();
})();
