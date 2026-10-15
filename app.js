// app.js - builds the page from its content, and lets its owner edit that content on the page itself (?edit).
// The content comes from the ClassPulse database (table "profiles"); content.js is the backup copy shown when the
// database does not answer. Nothing to edit here: the texts are changed in edit mode.
(function () {
  const LANGS = ["en", "ar", "fr"];
  const LANG_LABEL = { en: "EN", ar: "ع", fr: "FR" };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const params = new URLSearchParams(location.search);
  const EDIT = params.has("edit");
  const HAS_DB = typeof CONFIG !== "undefined" && CONFIG.supabaseUrl && !/YOUR-PROJECT/.test(CONFIG.supabaseUrl);

  let SITE = clone(window.SITE);          // backup copy (content.js) until the database answers
  let source = "backup";                  // backup | database
  let savedAt = null;
  let lang = "en";
  try { const saved = localStorage.getItem("pp_lang"); if (LANGS.includes(saved)) lang = saved; } catch (e) { /* private mode */ }
  if (LANGS.includes(params.get("lang"))) lang = params.get("lang");

  // ---- edit state
  let db = null, user = null, canEdit = false, dirty = false, editLang = "en";

  // ------------------------------------------------------------------ values in three languages
  const isTri = (v) => v && typeof v === "object" && !Array.isArray(v) && ("en" in v || "ar" in v || "fr" in v);
  const tr = (v, l) => (v == null ? "" : typeof v === "string" ? v : (v[l || lang] || v.en || v.fr || v.ar || ""));
  const getAt = (path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), SITE);
  function setAt(path, text) {
    const keys = path.split("."), last = keys.pop();
    const parent = keys.reduce((o, k) => o[k], SITE);
    const v = parent[last];
    if (typeof v === "string") parent[last] = text;
    else { const o = isTri(v) ? v : {}; o[editLang] = text; parent[last] = o; }
    dirty = true; updateBar();
  }
  const url = (u) => (u === "@classpulse" ? SITE.classpulse : u === "@classpulse-teacher" ? SITE.classpulse + "index.html?view=teacher" : u);
  const todo = (s) => /TODO/.test(s);

  // An editable text. In edit mode it shows the language being edited; a missing translation is flagged.
  function ed(path, tag, cls) {
    const v = getAt(path);
    tag = tag || "span";
    if (!EDIT || !canEdit) return `<${tag} class="${cls || ""} ${todo(tr(v)) ? "todo" : ""}">${esc(tr(v))}</${tag}>`;
    const own = typeof v === "string" ? v : (v && v[editLang]) || "";
    const missing = typeof v !== "string" && !own;
    return `<${tag} class="${cls || ""} ed ${missing ? "missing" : ""}" contenteditable="true" spellcheck="true" data-path="${path}"
      ${missing ? `data-hint="${esc(tr(v, "en") || "(empty)")}"` : ""} dir="${typeof v === "string" ? "auto" : editLang === "ar" ? "rtl" : "ltr"}">${esc(own)}</${tag}>`;
  }
  // List tools (edit mode): move up, move down, delete; and the "+ Add" button after the list.
  const tools = (list, i) => EDIT && canEdit ? `<span class="itools"><button data-op="up" data-list="${list}" data-i="${i}" title="Move up">↑</button><button data-op="down" data-list="${list}" data-i="${i}" title="Move down">↓</button><button data-op="del" data-list="${list}" data-i="${i}" title="Delete">✕</button></span>` : "";
  const addBtn = (list, kind) => EDIT && canEdit ? `<button class="add" data-op="add" data-list="${list}" data-kind="${kind}">+ Add</button>` : "";
  const TEMPLATES = {
    card: () => ({ t: { en: "New title" }, d: { en: "" } }),
    offer: () => ({ t: { en: "New proposal" }, d: { en: "" }, level: { en: "Master / final-year project" } }),
    line: () => ({ en: "New line" }),
    fact: () => ({ k: { en: "Label" }, v: { en: "Value" } }),
    link: () => ({ label: "New link", url: "https://" }),
  };

  function currentTab() {
    const id = location.hash.replace("#", "");
    return SITE.tabs.find((t) => t.id === id) || SITE.tabs[0];
  }
  // v30: proposals, office hours and announcement come from ClassPulse "My space" (null = not loaded: backup copy shown)
  let LIVE = null;
  const PKIND = { pfe: { en: "Final-year project", ar: "مشروع نهاية الدراسة", fr: "Projet de fin d'études" }, master: { en: "Master thesis", ar: "مذكرة ماستر", fr: "Mémoire de master" },
    licence: { en: "Licence project", ar: "مشروع ليسانس", fr: "Projet de licence" }, mini: { en: "Mini-project", ar: "مشروع صغير", fr: "Mini-projet" }, other: { en: "Project", ar: "مشروع", fr: "Projet" } };
  const OFFER_KIND = { supervision: { en: "Supervision", ar: "تأطير", fr: "Encadrement" }, miniproject: { en: "Mini-project", ar: "مشروع صغير", fr: "Mini-projet" } };

  function renderBlock(b, bp) {
    if (b.type === "text") return ed(bp + ".text", "p", "lead");
    if (b.type === "facts") return `<dl class="facts">${b.items.map((f, i) => `<div class="it">${tools(bp + ".items", i)}<dt>${ed(`${bp}.items.${i}.k`)}</dt><dd>${ed(`${bp}.items.${i}.v`)}</dd></div>`).join("")}</dl>${addBtn(bp + ".items", "fact")}`;
    if (b.type === "cards") return `<div class="grid">${b.items.map((c, i) => `<article class="tile it">${tools(bp + ".items", i)}<h3>${ed(`${bp}.items.${i}.t`)}</h3><p>${ed(`${bp}.items.${i}.d`)}</p></article>`).join("")}</div>${addBtn(bp + ".items", "card")}`;
    if (b.type === "offers" && LIVE) {
      // v30: the proposals of My space (supervision = projects and theses; miniproject = mini-projects)
      const head = b.title ? `<h2>${ed(bp + ".title")}</h2>` : "";
      const list = LIVE.proposals.filter((x) => (b.kind === "miniproject") === (x.kind === "mini"));
      const note = EDIT && canEdit ? `<p class="muted-line">✏ ${esc({ en: "Proposals are entered in ClassPulse › My space.", ar: "تُدخل المقترحات في ClassPulse › My space.", fr: "Les propositions se saisissent dans ClassPulse › My space." }[lang])}</p>` : "";
      if (!list.length) return head + note + `<p class="muted-line">${esc({ en: "No proposal at the moment.", ar: "لا توجد مقترحات حاليًا.", fr: "Aucune proposition pour le moment." }[lang])}</p>`;
      return head + note + `<div class="grid">${list.map((x) => `<article class="tile offer">
          <span class="tag">${esc(tr(PKIND[x.kind] || PKIND.other))}${x.status === "assigned" ? " · " + esc({ en: "assigned", ar: "مُسند", fr: "attribué" }[lang]) : ""}</span>
          <h3>${esc(x.title)}</h3>${x.description ? `<p>${esc(x.description)}</p>` : ""}<p class="level">${esc([x.level, x.keywords].filter(Boolean).join(" · "))}</p></article>`).join("")}</div>`;
    }
    if (b.type === "offers") {
      const head = b.title ? `<h2>${ed(bp + ".title")}</h2>` : "";
      const none = !b.items.length && !(EDIT && canEdit) ? `<p class="muted-line">${esc({ en: "No proposal at the moment.", ar: "لا توجد مقترحات حاليًا.", fr: "Aucune proposition pour le moment." }[lang])}</p>` : "";
      return head + none + `<div class="grid">${b.items.map((c, i) => `<article class="tile offer it">${tools(bp + ".items", i)}
          <span class="tag">${esc(tr(OFFER_KIND[b.kind] || ""))}</span><h3>${ed(`${bp}.items.${i}.t`)}</h3><p>${ed(`${bp}.items.${i}.d`)}</p>
          <p class="level">${ed(`${bp}.items.${i}.level`)}</p></article>`).join("")}</div>${addBtn(bp + ".items", "offer")}`;
    }
    if (b.type === "list") return (b.title ? `<h2>${ed(bp + ".title")}</h2>` : "") +
      `<ul class="list">${b.items.map((x, i) => `<li class="it">${ed(`${bp}.items.${i}`)}${tools(bp + ".items", i)}</li>`).join("")}</ul>${addBtn(bp + ".items", "line")}`;
    if (b.type === "button") return EDIT && canEdit
      ? `<span class="btn">${ed(bp + ".label")} <button class="mini" data-op="url" data-path="${bp}.url" title="Change the address">🔗</button></span>`
      : `<a class="btn" href="${esc(url(b.url))}">${esc(tr(b.label))} <span class="arrow" aria-hidden="true">→</span></a>`;
    return "";
  }

  function render() {
    const shown = EDIT && canEdit ? editLang : lang;
    const saveLang = lang; lang = shown;
    document.documentElement.lang = shown;
    document.documentElement.dir = shown === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("#lang button").forEach((b) => b.classList.toggle("on", b.dataset.l === shown));
    $("name").outerHTML = ed("name", "h1").replace("<h1 class=\"", '<h1 id="name" class="');
    $("title").outerHTML = ed("title", "p", "title").replace('<p class="', '<p id="title" class="');
    $("aff").outerHTML = ed("affiliation", "p", "aff").replace('<p class="', '<p id="aff" class="');
    $("tagline").outerHTML = ed("tagline", "p", "tagline").replace('<p class="', '<p id="tagline" class="');
    $("photo").innerHTML = (SITE.photo ? `<img src="${esc(SITE.photo)}" alt="${esc(tr(SITE.name))}" onerror="this.parentNode.textContent='${esc(SITE.initials || "")}'">` : esc(SITE.initials || "")) +
      (EDIT && canEdit ? `<span class="photo-edit">📷 Change</span>` : "");
    $("photo").classList.toggle("editable", EDIT && canEdit);
    const hours = SITE.hours || [];
    // v30: office hours of the next two weeks from My space (instead of the lines typed on the page)
    const day = (d) => new Date(d + "T12:00:00").toLocaleDateString(shown === "ar" ? "ar-DZ" : shown, { weekday: "short", day: "2-digit", month: "short" });
    const liveHours = LIVE && LIVE.office.length ? LIVE.office.map((o) => `<span class="${o.cancelled ? "cancelled" : ""}">${esc(day(o.date))} ${esc(o.start)}–${esc(o.end)}${o.place ? " · " + esc(o.place) : ""}${o.cancelled ? " ✕" : ""}</span>`).join("") : "";
    $("contact").innerHTML = (LIVE && LIVE.announcement ? `<span class="announce">📌 ${esc(LIVE.announcement)}</span>` : "") +
      (EDIT && canEdit ? `<span>✉ ${ed("email")}</span>` : `<a href="mailto:${esc(SITE.email)}">✉ ${esc(SITE.email)}</a>`) +
      (SITE.office ? `<span>⌂ ${ed("office")}</span>` : "") +
      (liveHours ? `<span class="hours-title">🕘 ${esc({ en: "Office hours", ar: "مواعيد الاستقبال", fr: "Réception" }[shown])}</span>` + liveHours : "") +
      (!liveHours && (hours.length || (EDIT && canEdit)) ? `<span class="hours-title">🕘 ${esc({ en: "Office hours", ar: "مواعيد الاستقبال", fr: "Réception" }[shown])}</span>` +
        hours.map((h, i) => `<span class="it">${ed("hours." + i)}${tools("hours", i)}</span>`).join("") + addBtn("hours", "line") : "");
    $("links").innerHTML = EDIT && canEdit
      ? (SITE.links || []).map((l, i) => `<span class="it link-edit">${ed(`links.${i}.label`)}<button class="mini" data-op="url" data-path="links.${i}.url" title="${esc(l.url)}">🔗</button>${tools("links", i)}</span>`).join("") + addBtn("links", "link")
      : (SITE.links || []).filter((l) => l.url).map((l) => `<a href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join("");
    $("cp").href = SITE.classpulse;
    $("cp").textContent = { en: "ClassPulse · students' space", ar: "ClassPulse · فضاء الطلبة", fr: "ClassPulse · espace étudiants" }[shown];
    const cur = currentTab(), ti = SITE.tabs.indexOf(cur);
    $("tabs").innerHTML = SITE.tabs.map((t) =>
      `<a role="tab" href="#${t.id}" aria-selected="${t === cur}" class="${t === cur ? "on" : ""}"><span class="ic">${t.icon || ""}</span>${esc(tr(t.label))}</a>`).join("");
    $("panel").innerHTML = `<h2 class="ptitle">${ed(`tabs.${ti}.label`)}</h2>` + cur.blocks.map((b, bi) => renderBlock(b, `tabs.${ti}.blocks.${bi}`)).join("");
    if (!(EDIT && canEdit)) { $("panel").classList.remove("in"); void $("panel").offsetWidth; $("panel").classList.add("in"); }
    document.title = tr(SITE.name) + " · " + tr(cur.label);
    lang = saveLang;
    updateBar();
  }

  // ------------------------------------------------------------------ edit mode
  function missingCount(l) {
    let n = 0;
    const walk = (v) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (isTri(v)) { if (!v[l] && (v.en || v.fr || v.ar)) n++; }
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
    };
    walk(SITE);
    return n;
  }
  function updateBar() {
    const bar = $("editBar");
    if (!bar || !EDIT) return;
    if (!canEdit) return;
    const miss = missingCount(editLang);
    $("ebState").innerHTML = (dirty ? '<strong class="eb-dirty">Not saved</strong>' : "Saved") +
      ` · source: ${source === "database" ? "database" + (savedAt ? " (" + new Date(savedAt).toLocaleString() + ")" : "") : "backup copy (content.js)"}` +
      (miss ? ` · <span class="eb-miss">${miss} text(s) not translated in ${LANG_LABEL[editLang]}</span>` : "");
    $("ebSave").disabled = !dirty;
    bar.querySelectorAll("[data-el]").forEach((b) => b.classList.toggle("on", b.dataset.el === editLang));
  }
  function showLogin(message) {
    $("editBar").innerHTML = `<div class="eb-row"><strong>Edit mode</strong> · sign in with your ClassPulse account
      <input id="ebEmail" type="email" placeholder="e-mail" autocomplete="username"><input id="ebPass" type="password" placeholder="password" autocomplete="current-password">
      <button id="ebLogin">Sign in</button> <a href="${location.pathname}${location.hash}">Leave</a></div>${message ? `<div class="eb-msg">${esc(message)}</div>` : ""}`;
    $("ebLogin").onclick = async () => {
      const { data, error } = await db.auth.signInWithPassword({ email: $("ebEmail").value.trim(), password: $("ebPass").value });
      if (error) { showLogin(error.message); return; }
      user = data.user; await checkOwner();
    };
  }
  function showEditBar() {
    $("editBar").innerHTML = `<div class="eb-row"><strong>✏ Edit mode</strong>
      <span class="eb-langs">Editing: ${LANGS.map((l) => `<button data-el="${l}">${LANG_LABEL[l]}</button>`).join("")}</span>
      <button id="ebSave" class="eb-save">Save</button>
      <button id="ebBackup">Download backup copy</button>
      <a href="${location.pathname}${location.hash}" id="ebLeave">Leave edit mode</a>
      <span class="eb-user">${esc(user.email || "")} · <a href="#" id="ebOut">sign out</a></span></div>
      <div class="eb-row eb-help" id="ebState"></div>
      <div class="eb-help">Click a text to change it (the layout does not change). Click the photo to replace it. Lists: ↑ ↓ ✕ and + Add.
      Each language is edited separately: a text outlined in orange is not translated yet in this language.</div>`;
    $("editBar").querySelectorAll("[data-el]").forEach((b) => b.onclick = () => { editLang = b.dataset.el; render(); });
    $("ebSave").onclick = save;
    $("ebBackup").onclick = downloadBackup;
    $("ebOut").onclick = async (e) => { e.preventDefault(); await db.auth.signOut(); location.reload(); };
  }
  async function checkOwner() {
    const { data, error } = await db.rpc("t_profile_access", { p_slug: SITE.slug });
    if (error) { showLogin("Cannot check this account: " + error.message); return; }
    if (!data.can_edit) { showLogin("This account cannot edit this page" + (data.my_slug ? " (it owns the page \"" + data.my_slug + "\")." : ".")); return; }
    canEdit = true;
    document.body.classList.add("editing");
    showEditBar();
    render();
  }
  async function save() {
    const { data, error } = await db.rpc("t_save_profile", { p_slug: SITE.slug, p_content: SITE });
    if (error) { alert("Not saved: " + error.message); return; }
    dirty = false; source = "database"; savedAt = (data && data.updated_at) || new Date().toISOString();
    updateBar();
    flash("Saved: the public page is up to date.");
  }
  function downloadBackup() {
    const text = "// content.js - BACKUP COPY of the content of the page, downloaded from the edit mode on " + new Date().toISOString().slice(0, 10) + ".\n" +
      "// The page shows it only when the database does not answer. Put it in the repository in place of the old one (Commit + Push).\n\n" +
      "window.SITE = " + JSON.stringify(SITE, null, 2) + ";\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
    a.download = "content.js"; document.body.appendChild(a); a.click(); a.remove();
  }
  function flash(msg) {
    const f = $("flash"); f.textContent = msg; f.classList.add("show");
    clearTimeout(flash.t); flash.t = setTimeout(() => f.classList.remove("show"), 2600);
  }
  // A square photo of at most 600 px, sent to the public "profile" bucket of the owner.
  function pickPhoto() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
    inp.onchange = async () => {
      const file = inp.files[0]; if (!file) return;
      const img = await createImageBitmap(file);
      const side = Math.min(img.width, img.height), size = Math.min(600, side);
      const c = document.createElement("canvas"); c.width = c.height = size;
      c.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.86));
      const key = `${user.id}/photo-${Date.now()}.jpg`;
      const { error } = await db.storage.from("profile").upload(key, blob, { contentType: "image/jpeg", upsert: true });
      if (error) { alert("Photo not sent: " + error.message); return; }
      SITE.photo = db.storage.from("profile").getPublicUrl(key).data.publicUrl;
      dirty = true; render(); flash("Photo changed. Save to publish it.");
    };
    inp.click();
  }

  // One listener for every edit action
  document.addEventListener("focusout", (e) => {
    const el = e.target.closest && e.target.closest(".ed");
    if (!el || !canEdit) return;
    const text = el.innerText.replace(/\s+\n/g, "\n").trim();
    const v = getAt(el.dataset.path);
    const old = typeof v === "string" ? v : (v && v[editLang]) || "";
    if (text !== old) { setAt(el.dataset.path, text); el.classList.toggle("missing", !text && typeof v !== "string"); }
  });
  document.addEventListener("keydown", (e) => {
    const el = e.target.closest && e.target.closest(".ed");
    if (el && e.key === "Enter" && !el.matches("p.lead")) { e.preventDefault(); el.blur(); }
  });
  document.addEventListener("click", (e) => {
    if (!canEdit) return;
    if (e.target.closest("#photo")) { pickPhoto(); return; }
    const b = e.target.closest("[data-op]");
    if (!b) return;
    e.preventDefault();
    const op = b.dataset.op;
    if (op === "url") {
      const v = prompt("Address (https://…). Empty = hidden.", getAt(b.dataset.path) || "");
      if (v === null) return;
      const keys = b.dataset.path.split("."), last = keys.pop();
      keys.reduce((o, k) => o[k], SITE)[last] = v.trim();
      dirty = true; render(); return;
    }
    const list = getAt(b.dataset.list), i = Number(b.dataset.i);
    if (op === "add") list.push(TEMPLATES[b.dataset.kind]());
    if (op === "del") { if (!confirm("Delete this item (in every language)?")) return; list.splice(i, 1); }
    if (op === "up" && i > 0) list.splice(i - 1, 0, list.splice(i, 1)[0]);
    if (op === "down" && i < list.length - 1) list.splice(i + 1, 0, list.splice(i, 1)[0]);
    dirty = true; render();
  });
  window.addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  // ------------------------------------------------------------------ start
  document.querySelectorAll("#lang button").forEach((b) => b.onclick = () => {
    if (EDIT && canEdit) { editLang = b.dataset.l; render(); return; }
    lang = b.dataset.l;
    try { localStorage.setItem("pp_lang", lang); } catch (e) { /* private mode */ }
    render();
  });
  window.addEventListener("hashchange", render);

  async function loadFromDatabase() {
    if (!HAS_DB) return;
    try {
      const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 5000);
      const r = await fetch(CONFIG.supabaseUrl + "/rest/v1/rpc/p_profile", { method: "POST", signal: ctl.signal,
        headers: { "Content-Type": "application/json", apikey: CONFIG.supabaseAnonKey, Authorization: "Bearer " + CONFIG.supabaseAnonKey },
        body: JSON.stringify({ p_slug: window.SITE.slug }) });
      clearTimeout(timer);
      if (!r.ok) return;
      const d = await r.json();
      if (d && d.content && d.content.tabs) { SITE = d.content; SITE.slug = SITE.slug || window.SITE.slug; source = "database"; savedAt = d.updated_at; }
      if (d && d.proposals) LIVE = { proposals: d.proposals || [], office: d.office || [], announcement: d.announcement || "" };   // v30
    } catch (e) { /* database asleep or unreachable: the backup copy stays */ }
  }

  (async () => {
    render();                              // the backup copy at once, then the database version
    await loadFromDatabase();
    render();
    if (!EDIT) return;
    document.body.insertAdjacentHTML("afterbegin", `<div id="editBar" class="edit-bar" dir="ltr"></div><div id="flash" class="flash"></div>`);
    if (!HAS_DB) { $("editBar").innerHTML = `<div class="eb-row"><strong>Edit mode</strong> · the ClassPulse settings (classpulse/config.js) are not reachable: editing is not possible.</div>`; return; }
    try {
      await new Promise((ok, ko) => { const s = document.createElement("script"); s.src = "lib/supabase.js"; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
    } catch (e) { $("editBar").textContent = "The editing library (lib/supabase.js) is missing."; return; }
    db = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
    const { data } = await db.auth.getSession();       // same browser as ClassPulse: often already signed in
    if (data && data.session) { user = data.session.user; await checkOwner(); } else showLogin("");
  })();
})();
