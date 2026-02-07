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
