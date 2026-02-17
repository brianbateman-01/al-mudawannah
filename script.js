/* helpers */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* ===== Mobile Nav (works on every page) ===== */
(function(){
  const toggle = $(".nav-toggle");
  const nav = $("#siteNav");
  if(!toggle || !nav) return;

  const open = () => { nav.classList.add("open"); toggle.setAttribute("aria-expanded","true"); };
  const close= () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); };

  toggle.addEventListener("click",(e)=>{
    e.preventDefault();
    e.stopPropagation();
    nav.classList.contains("open") ? close() : open();
  });

  $$("a", nav).forEach(a => a.addEventListener("click", close));

  document.addEventListener("click",(e)=>{
    if(!nav.classList.contains("open")) return;
    const inside = nav.contains(e.target) || toggle.contains(e.target);
    if(!inside) close();
  });

  document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape") close();
  });

  window.addEventListener("resize", ()=>{
    if(window.innerWidth > 980) close();
  });
})();

/* ===== Teachers Slider (only on index.html) ===== */
(function(){
  const card = $("#teacherCard");
  if(!card) return;

  const nameEl = $("#teacherName");
  const roleEl = $("#teacherRole");
  const bioEl  = $("#teacherBio");
  const tagsEl = $("#teacherTags");
  const initialsEl = $("#teacherInitials");
  const dotsWrap = $("#teacherDots");
  const prevBtn = $("#teacherPrev");
  const nextBtn = $("#teacherNext");

  const teachers = [
    { name:"Shaykh Minhaji", role:"Teacher", bio:"Bio coming soon.", tags:["Teacher","Scholarship"] },
    { name:"Shaykh Harun Kanj", role:"Teacher", bio:"Bio coming soon.", tags:["Teacher","Fiqh"] },
    { name:"Shaykh Muhammad al-Masri", role:"Teacher", bio:"Bio coming soon.", tags:["Teacher","Study"] },
    { name:"Shaykh Muhammad al-Azhari", role:"Teacher", bio:"Bio coming soon.", tags:["Teacher","ʿAqīdah"] },
    { name:"Shaykh Shams Tameez", role:"Teacher", bio:"Bio coming soon.", tags:["Teacher","Arabic"] },
    { name:"Shaykh Abdullah Shuuke", role:"Teacher", bio:"Bio coming soon.", tags:["Teacher","Fiqh/ʿAqīdah"] },
    { name:"Imam Sudagar", role:"Imam", bio:"Bio coming soon.", tags:["Imam","Community"] },
  ];

  let i = 0;

  const initials = (n)=>{
    const parts = n.trim().split(/\s+/);
    const a = parts[0]?.[0] || "A";
    const b = parts[1]?.[0] || "M";
    return (a+b).toUpperCase();
  };

  function renderDots(){
    dotsWrap.innerHTML = "";
    teachers.forEach((_, idx)=>{
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dot" + (idx===i ? " active" : "");
      b.addEventListener("click", ()=> go(idx));
      dotsWrap.appendChild(b);
    });
  }

  function setContent(){
    const t = teachers[i];
    nameEl.textContent = t.name;
    roleEl.textContent = t.role;
    bioEl.textContent  = t.bio;
    initialsEl.textContent = initials(t.name);

    tagsEl.innerHTML = "";
    t.tags.forEach(tag=>{
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = tag;
      tagsEl.appendChild(s);
    });

    renderDots();
  }

  function go(idx){
    i = idx;
    card.animate(
      [{opacity:1, transform:"translateY(0)"},{opacity:0, transform:"translateY(6px)"}],
      {duration:140, easing:"ease-out"}
    ).onfinish = ()=>{
      setContent();
      card.animate(
        [{opacity:0, transform:"translateY(6px)"},{opacity:1, transform:"translateY(0)"}],
        {duration:160, easing:"ease-out"}
      );
    };
  }

  const prev = ()=> go((i - 1 + teachers.length) % teachers.length);
  const next = ()=> go((i + 1) % teachers.length);

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  document.addEventListener("keydown",(e)=>{
    if(e.key==="ArrowLeft") prev();
    if(e.key==="ArrowRight") next();
  });

  setContent();
})();


/* ===== Courses form note (Formspree) ===== */
(function(){
  const form = $("#hanafiRamadanForm");
  if(!form) return;
  const note = $("#hanafiNote");
  form.addEventListener("submit", ()=>{
    if(note) note.textContent = "Submitting…";
  });
})();
(() => {
  const toggle = document.getElementById("searchToggle");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("searchClose");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  // Search exists only on Home page
  if (!toggle || !overlay || !closeBtn || !input || !results) return;

  const index = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [];

  // Build correct base path for GitHub Pages (repo sites) + custom domains
  const base = (() => {
    const isGitHub = window.location.hostname.endsWith("github.io");
    if (!isGitHub) return ""; // custom domain => relative links are fine

    // /REPO/... => base = /REPO
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts.length ? `/${parts[0]}` : "";
  })();

  const toHref = (url) => {
    // If url is already absolute (starts with http), return it
    if (/^https?:\/\//i.test(url)) return url;

    // Make sure we don’t double-slash
    const clean = String(url || "").replace(/^\/+/, "");
    return base ? `${base}/${clean}` : clean;
  };

  const openSearch = () => {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => input.focus(), 50);
    render("");
  };

  const closeSearch = () => {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    input.value = "";
    results.innerHTML = "";
    toggle.focus();
  };

  const norm = (s) => (s || "").toLowerCase().trim();

  const score = (item, q) => {
    const hay = `${item.title} ${item.type} ${item.keywords || ""}`.toLowerCase();
    if (!q) return 0;
    if (hay.includes(q)) return 10;

    const tokens = q.split(/\s+/).filter(Boolean);
    let hits = 0;
    for (const t of tokens) if (hay.includes(t)) hits++;
    return hits;
  };

  const itemHTML = (item) => {
    const href = toHref(item.url);
    return `
      <a class="result-item" href="${href}">
        <span class="result-left">
          <span class="result-title">${item.title}</span>
          <span class="result-meta">${item.url}</span>
        </span>
        <span class="result-type">${item.type}</span>
      </a>
    `;
  };

  const render = (query) => {
    const q = norm(query);

    if (!q) {
      // default: show a few important entries
      const top = index.slice(0, 10);
      results.innerHTML = top.map(itemHTML).join("");
      return;
    }

    const ranked = index
      .map((it) => ({ it, s: score(it, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 14)
      .map((x) => x.it);

    results.innerHTML = ranked.length
      ? ranked.map(itemHTML).join("")
      : `<div class="result-item" style="justify-content:center;">
           <span class="result-meta">No results found.</span>
         </div>`;
  };

  // Events
  toggle.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) closeSearch();
    // Optional: CTRL+K to open
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  input.addEventListener("input", (e) => render(e.target.value));
})();
(() => {
  const toggle = document.getElementById("searchToggle");
  const overlay = document.getElementById("searchOverlay");
  const closeBtn = document.getElementById("searchClose");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const hint = document.getElementById("searchHint");

  if (!toggle || !overlay || !closeBtn || !input || !results) return;

  const index = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [];

  const computeBase = () => {
    const isGitHub = window.location.hostname.endsWith("github.io");
    if (!isGitHub) return "";
    const parts = window.location.pathname.split("/").filter(Boolean);
    return parts.length ? `/${parts[0]}` : "";
  };

  const base = computeBase();

  const toAbs = (rel) => {
    const clean = String(rel || "").replace(/^\//, "");
    return `${base}/${clean}`.replace(/\/+/g, "/");
  };

  const openSearch = () => {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    input.value = "";
    results.innerHTML = "";
    results.hidden = true;          // ✅ hide results on open
    if (hint) hint.hidden = false;  // ✅ show tip
    setTimeout(() => input.focus(), 50);
  };

  const closeSearch = () => {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    input.value = "";
    results.innerHTML = "";
    results.hidden = true;
    if (hint) hint.hidden = false;
    toggle.focus();
  };

  const normalize = (s) => (s || "").toLowerCase().trim();

  const scoreItem = (item, q) => {
    const hay = `${item.title} ${item.type} ${item.keywords || ""}`.toLowerCase();
    if (hay.includes(q)) return 10;
    const tokens = q.split(/\s+/).filter(Boolean);
    let hits = 0;
    for (const t of tokens) if (hay.includes(t)) hits++;
    return hits ? hits : 0;
  };

const itemToHTML = (item) => {
  const href = toAbs(item.url);

  return `
    <a class="result-item" href="${href}">
      <span class="result-left">
        <span class="result-title">${item.title}</span>
      </span>
      <span class="result-type">${item.type}</span>
    </a>
  `;
};


  const renderResults = (query) => {
    const q = normalize(query);

    // ✅ If empty: hide results, show tip only
    if (!q) {
      results.innerHTML = "";
      results.hidden = true;
      if (hint) hint.hidden = false;
      return;
    }

    // ✅ If typing: show results, hide tip
    if (hint) hint.hidden = true;
    results.hidden = false;

    const ranked = index
      .map((it) => ({ it, s: scoreItem(it, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.it);

    results.innerHTML = ranked.length
      ? ranked.map(itemToHTML).join("")
      : `<div class="result-item" style="justify-content:center;">
           <span class="result-meta">No results found.</span>
         </div>`;
  };

  toggle.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) closeSearch();
  });

  input.addEventListener("input", (e) => renderResults(e.target.value));
})();
// Collapsible Course Notice
const noticeToggle = document.getElementById("noticeToggle");
const noticeContent = document.getElementById("noticeContent");

if (noticeToggle && noticeContent) {
  noticeToggle.addEventListener("click", () => {
    noticeContent.classList.toggle("active");

    if (noticeContent.classList.contains("active")) {
      noticeToggle.textContent = "Hide Notice";
    } else {
      noticeToggle.textContent = "Read Notice";
    }
  });
}
