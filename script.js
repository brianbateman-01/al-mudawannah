// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("siteNav");

function closeNav(){
  if (!siteNav || !navToggle) return;
  siteNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

function toggleNav(){
  if (!siteNav || !navToggle) return;
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

navToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleNav();
});

// Close menu when a link is clicked
siteNav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", closeNav);
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeNav();
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!siteNav || !navToggle) return;
  const clickedInside = siteNav.contains(e.target) || navToggle.contains(e.target);
  if (!clickedInside) closeNav();
});


// Courses: independent Fiqh / Aqeedah choices
const courseFormEl = document.getElementById("courseForm");
const wantFiqh = document.getElementById("wantFiqh");
const wantAqeedah = document.getElementById("wantAqeedah");

const fiqhBlock = document.getElementById("fiqhBlock");
const aqeedahBlock = document.getElementById("aqeedahBlock");

const madhhabSelect = document.getElementById("madhhabSelect");
const creedSelect = document.getElementById("creedSelect");

function setRequired(el, required){
  if (!el) return;
  if (required) el.setAttribute("required", "required");
  else el.removeAttribute("required");
}

function updateCourseChoices(){
  const fiqh = !!wantFiqh?.checked;
  const aqeedah = !!wantAqeedah?.checked;

  if (fiqhBlock) fiqhBlock.hidden = !fiqh;
  if (aqeedahBlock) aqeedahBlock.hidden = !aqeedah;

  setRequired(madhhabSelect, fiqh);
  setRequired(creedSelect, aqeedah);

  if (!fiqh && madhhabSelect) madhhabSelect.selectedIndex = 0;
  if (!aqeedah && creedSelect) creedSelect.selectedIndex = 0;
}

wantFiqh?.addEventListener("change", updateCourseChoices);
wantAqeedah?.addEventListener("change", updateCourseChoices);
updateCourseChoices();

// Prevent submitting if neither is selected
courseFormEl?.addEventListener("submit", (e) => {
  const fiqh = !!wantFiqh?.checked;
  const aqeedah = !!wantAqeedah?.checked;
  if (!fiqh && !aqeedah) {
    e.preventDefault();
    alert("Please select at least one: Fiqh or ʿAqīdah.");
  }
});

// Contact demo feedback (optional)
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (formNote) formNote.textContent = "Message received (demo). Connect this form to Formspree if you want it to send.";
});
