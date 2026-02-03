/* =========================
   Helpers
========================= */
function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}
function setText(el, text) {
  if (el) el.textContent = text;
}
function setRequired(el, required) {
  if (!el) return;
  if (required) el.setAttribute("required", "required");
  else el.removeAttribute("required");
}

/* =========================
   Mobile Nav
========================= */
(function initMobileNav() {
  const toggle = $(".nav-toggle");
  const nav = $("#siteNav");

  if (!toggle || !nav) return;

  function openNav() {
    nav.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  function toggleNav() {
    const isOpen = nav.classList.contains("open");
    if (isOpen) closeNav();
    else openNav();
  }

  // Toggle button
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
  });

  // Close when a link is clicked
  $all("a", nav).forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    const clickedInside = nav.contains(e.target) || toggle.contains(e.target);
    if (!clickedInside) closeNav();
  });

  // Close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Safety: if resizing to desktop, ensure nav resets
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeNav();
  });
})();

/* =========================
   Courses: General Form Logic
   (Fiqh / Aqeedah checkboxes)
========================= */
(function initGeneralCourseForm() {
  const form = $("#courseForm");
  if (!form) return; // only on courses.html

  const wantFiqh = $("#wantFiqh");
  const wantAqeedah = $("#wantAqeedah");

  const fiqhBlock = $("#fiqhBlock");
  const aqeedahBlock = $("#aqeedahBlock");

  const madhhabSelect = $("#madhhabSelect");
  const creedSelect = $("#creedSelect");

  const note = $("#courseNote");

  function updateVisibility() {
    const fiqh = !!wantFiqh?.checked;
    const aqeedah = !!wantAqeedah?.checked;

    if (fiqhBlock) fiqhBlock.hidden = !fiqh;
    if (aqeedahBlock) aqeedahBlock.hidden = !aqeedah;

    setRequired(madhhabSelect, fiqh);
    setRequired(creedSelect, aqeedah);

    // Reset dropdown if hidden
    if (!fiqh && madhhabSelect) madhhabSelect.selectedIndex = 0;
    if (!aqeedah && creedSelect) creedSelect.selectedIndex = 0;
  }

  wantFiqh?.addEventListener("change", updateVisibility);
  wantAqeedah?.addEventListener("change", updateVisibility);
  updateVisibility();

  // Require at least one checkbox before submitting
  form.addEventListener("submit", (e) => {
    const fiqh = !!wantFiqh?.checked;
    const aqeedah = !!wantAqeedah?.checked;

    if (!fiqh && !aqeedah) {
      e.preventDefault();
      alert("Please select at least one: Fiqh or ʿAqīdah.");
      return;
    }

    setText(note, "Submitting…");
  });
})();

/* =========================
   Courses: Hanafi Ramadan Form
========================= */
(function initHanafiRamadanForm() {
  const form = $("#hanafiRamadanForm");
  if (!form) return;

  const note = $("#hanafiNote");

  form.addEventListener("submit", () => {
    setText(note, "Submitting…");
  });
})();

/* =========================
   Contact Form (index.html demo)
   - prevents ugly reload
   - shows message
   - replace with Formspree later
========================= */
(function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  const note = $("#formNote");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setText(note, "Message received (demo). Add Formspree to send emails.");
    form.reset();
  });
})();
