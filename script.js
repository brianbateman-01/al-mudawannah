// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

// Close menu on link click (mobile)
document.querySelectorAll(".nav a").forEach(a => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

// Scroll progress bar
const progress = document.getElementById("progress");
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${pct}%`;
});

// Toast
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelectorAll(".toast-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    showToast(btn.getAttribute("data-toast") || "Done.");
  });
});

// Courses form: show a note on submit (Formspree still handles sending)
const courseForm = document.getElementById("courseForm");
const courseNote = document.getElementById("courseNote");

courseForm?.addEventListener("submit", () => {
  // Let the form submit normally to Formspree
  courseNote.textContent = "Submitting… (If your Formspree endpoint is set, you'll receive it.)";
  showToast("Application submitted (sending).");
});

// Contact form (demo)
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = (data.get("name") || "").toString().trim();
  formNote.textContent = `Thanks ${name || "there"} — message received (demo).`;
  showToast("Message sent (demo).");
  contactForm.reset();
});

// Audio buttons (demo)
function stopAllAudio(){
  document.querySelectorAll("audio").forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
}

document.querySelectorAll(".audio-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-audio");
    const el = id ? document.getElementById(id) : null;
    if (!el) return showToast("Audio element missing.");

    // If no src set, just demo-toast
    if (!el.getAttribute("src")) {
      showToast("Add an audio src to play real files.");
      return;
    }

    const isPlaying = !el.paused;
    stopAllAudio();
    if (!isPlaying) {
      el.play().then(() => showToast("Playing audio…")).catch(() => showToast("Playback blocked."));
    } else {
      showToast("Stopped.");
    }
  });
});

document.getElementById("playAllBtn")?.addEventListener("click", () => {
  showToast("Tip: Add MP3 links to the <audio> tags, then play from buttons.");
});
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

navToggle?.addEventListener("click", toggleNav);

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
