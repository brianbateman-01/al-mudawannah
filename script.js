/* =========================
   HELPERS
========================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/* =========================
   COMPONENT LOADER
========================= */

async function loadComponent(selector, path) {
  const mount = $(selector);
  if (!mount) return;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Failed to load component: ${path}`);
    }

    const html = await response.text();
    mount.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

/* =========================
   ACTIVE NAV
========================= */

function setActiveNav() {
  const section = document.body.dataset.section;
  if (!section) return;

  $$("[data-nav]").forEach((link) => {
    if (link.dataset.nav === section) {
      link.classList.add("active");
    }
  });
}

/* =========================
   MOBILE NAV
========================= */

function initMobileNav() {
  const toggle = $(".nav-toggle");
  const nav = $("#siteNav");

  if (!toggle || !nav) return;

  const openNav = () => {
    nav.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeNav = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    nav.classList.contains("open") ? closeNav() : openNav();
  });

  $$("a", nav).forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("open")) return;

    const clickedInside = nav.contains(event.target) || toggle.contains(event.target);
    if (!clickedInside) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeNav();
  });
}

/* =========================
   SEARCH MODAL
========================= */

function initSearch() {
  const toggle = $("#searchToggle");
  const overlay = $("#searchOverlay");
  const closeBtn = $("#searchClose");
  const input = $("#searchInput");
  const results = $("#searchResults");
  const hint = $("#searchHint");

  if (!toggle || !overlay || !closeBtn || !input || !results) return;

  const index = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [];

  const normalize = (value) => String(value || "").toLowerCase().trim();

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const isAbsoluteUrl = (url) => /^https?:\/\//i.test(url);

  const resolveUrl = (url) => {
    if (!url) return "#";
    if (isAbsoluteUrl(url)) return url;
    return url.startsWith("/") ? url : `/${url}`;
  };

  const scoreItem = (item, query) => {
    const haystack = `${item.title} ${item.type} ${item.keywords || ""}`.toLowerCase();

    if (!query) return 0;
    if (haystack.includes(query)) return 100;

    const tokens = query.split(/\s+/).filter(Boolean);
    let score = 0;

    tokens.forEach((token) => {
      if (haystack.includes(token)) score += 10;
    });

    return score;
  };

  const renderItem = (item) => {
    const href = resolveUrl(item.url);

    return `
      <a class="result-item" href="${escapeHtml(href)}">
        <span class="result-left">
          <span class="result-title">${escapeHtml(item.title)}</span>
          <span class="result-meta">${escapeHtml(item.url)}</span>
        </span>
        <span class="result-type">${escapeHtml(item.type)}</span>
      </a>
    `;
  };

  const renderResults = (query) => {
    const q = normalize(query);

    if (!q) {
      results.innerHTML = "";
      results.hidden = true;
      if (hint) hint.hidden = false;
      return;
    }

    const ranked = index
      .map((item) => ({ item, score: scoreItem(item, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.item);

    if (hint) hint.hidden = true;
    results.hidden = false;

    results.innerHTML = ranked.length
      ? ranked.map(renderItem).join("")
      : `
        <div class="result-item" style="justify-content:center;">
          <span class="result-meta">No results found.</span>
        </div>
      `;
  };

  const openSearch = () => {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    input.value = "";
    results.innerHTML = "";
    results.hidden = true;
    if (hint) hint.hidden = false;

    window.setTimeout(() => {
      input.focus();
    }, 50);
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

  toggle.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      closeSearch();
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }
  });

  input.addEventListener("input", (event) => {
    renderResults(event.target.value);
  });
}

/* =========================
   TEACHERS SLIDER
========================= */

function initTeacherSlider() {
  const card = $("#teacherCard");
  if (!card) return;

  const nameEl = $("#teacherName");
  const roleEl = $("#teacherRole");
  const bioEl = $("#teacherBio");
  const tagsEl = $("#teacherTags");
  const initialsEl = $("#teacherInitials");
  const dotsWrap = $("#teacherDots");
  const prevBtn = $("#teacherPrev");
  const nextBtn = $("#teacherNext");

  if (!nameEl || !roleEl || !bioEl || !tagsEl || !initialsEl || !dotsWrap) return;

  const teachers = [
    { name: "Shaykh Minhaji", role: "Teacher", bio: "Bio coming soon.", tags: ["Teacher", "Scholarship"] },
    { name: "Shaykh Harun Kanj", role: "Teacher", bio: "Bio coming soon.", tags: ["Teacher", "Fiqh"] },
    { name: "Shaykh Muhammad al-Masri", role: "Teacher", bio: "Bio coming soon.", tags: ["Teacher", "Study"] },
    { name: "Shaykh Muhammad al-Azhari", role: "Teacher", bio: "Bio coming soon.", tags: ["Teacher", "ʿAqīdah"] },
    { name: "Shaykh Shams Tameez", role: "Teacher", bio: "Bio coming soon.", tags: ["Teacher", "Arabic"] },
    { name: "Shaykh Abdullah Shuuke", role: "Teacher", bio: "Bio coming soon.", tags: ["Teacher", "Fiqh/ʿAqīdah"] },
    { name: "Imam Sudagar", role: "Imam", bio: "Bio coming soon.", tags: ["Imam", "Community"] }
  ];

  let currentIndex = 0;

  const getInitials = (name) => {
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0]?.[0] || "A";
    const second = parts[1]?.[0] || "M";
    return `${first}${second}`.toUpperCase();
  };

  const renderDots = () => {
    dotsWrap.innerHTML = "";

    teachers.forEach((_, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `dot${index === currentIndex ? " active" : ""}`;
      button.setAttribute("aria-label", `Go to teacher ${index + 1}`);
      button.addEventListener("click", () => goTo(index));
      dotsWrap.appendChild(button);
    });
  };

  const renderTeacher = () => {
    const teacher = teachers[currentIndex];

    nameEl.textContent = teacher.name;
    roleEl.textContent = teacher.role;
    bioEl.textContent = teacher.bio;
    initialsEl.textContent = getInitials(teacher.name);

    tagsEl.innerHTML = "";
    teacher.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });

    renderDots();
  };

  const animateSwap = (callback) => {
    const fadeOut = card.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(6px)" }
      ],
      { duration: 140, easing: "ease-out" }
    );

    fadeOut.onfinish = () => {
      callback();

      card.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 160, easing: "ease-out" }
      );
    };
  };

  const goTo = (index) => {
    currentIndex = index;
    animateSwap(renderTeacher);
  };

  const prev = () => {
    currentIndex = (currentIndex - 1 + teachers.length) % teachers.length;
    animateSwap(renderTeacher);
  };

  const next = () => {
    currentIndex = (currentIndex + 1) % teachers.length;
    animateSwap(renderTeacher);
  };

  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  document.addEventListener("keydown", (event) => {
    if ($("#teacherCard")) {
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    }
  });

  renderTeacher();
}

/* =========================
   COLLAPSIBLE NOTICE
========================= */

function initNoticeToggle() {
  const noticeToggle = $("#noticeToggle");
  const noticeContent = $("#noticeContent");

  if (!noticeToggle || !noticeContent) return;

  noticeToggle.addEventListener("click", () => {
    noticeContent.classList.toggle("active");
    noticeToggle.textContent = noticeContent.classList.contains("active")
      ? "Hide Notice"
      : "Read Notice";
  });
}

/* =========================
   FORM STATUS
========================= */

function initFormStatus() {
  const mappings = [
    { form: "#contactForm", note: "#formNote", message: "Sending..." },
    { form: "#hanafiRamadanForm", note: "#hanafiNote", message: "Submitting..." },
    { form: "#arabicCourseForm", note: "#arabicNote", message: "Submitting..." }
  ];

  mappings.forEach(({ form, note, message }) => {
    const formEl = $(form);
    const noteEl = $(note);

    if (!formEl || !noteEl) return;

    formEl.addEventListener("submit", () => {
      noteEl.textContent = message;
    });
  });
}

/* =========================
   BOOT
========================= */

async function bootSite() {
  await loadComponent("#site-header", "/components/header.html");
  await loadComponent("#site-footer", "/components/footer.html");

  setActiveNav();
  initMobileNav();
  initSearch();
  initTeacherSlider();
  initNoticeToggle();
  initFormStatus();
}

document.addEventListener("DOMContentLoaded", bootSite);