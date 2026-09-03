/* =========================================================
   AL MUDAWWANAH — SHARED SITE JAVASCRIPT
   Navigation, search, filters and small UI enhancements.
   Brevo newsletter submission is handled by Brevo's own
   script included in the HTML, not by this file.
========================================================= */

(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  document.addEventListener('DOMContentLoaded', () => {
    initActiveNav();
    initMobileMenu();
    initHeaderState();
    initSearch();
    initFilters();
    initSmoothAnchors();
    initExternalLinks();
    initTeacherCarousel();
  });

  /* ---------------------------------------------------------
     ACTIVE NAV ITEM
  --------------------------------------------------------- */
  function initActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;

    $$('[data-page]').forEach((link) => {
      link.classList.toggle('active', link.dataset.page === page);
      if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    });
  }

  /* ---------------------------------------------------------
     MOBILE NAVIGATION
  --------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = $('.menu-toggle');
    const nav = $('.main-nav');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });

    $$('a, button', nav).forEach((item) => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 980) closeMenu();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------
     HEADER SCROLL STATE
  --------------------------------------------------------- */
  function initHeaderState() {
    const header = $('.site-header');
    if (!header) return;

    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */
  const searchIndex = [
    {
      title: 'Curriculum',
      type: 'Learning',
      description: 'Structured study paths in Islamic studies, creed, Qur’anic studies and Arabic.',
      href: 'curriculum.html',
      terms: 'curriculum courses learning study path islamic studies aqidah kalam quran arabic'
    },
    {
      title: 'Study Topics',
      type: 'Explore',
      description: 'Browse the archive by discipline and subject.',
      href: 'topics.html',
      terms: 'topics aqidah theology fiqh usul quran tafsir hadith arabic philosophy logic spirituality history'
    },
    {
      title: 'Articles',
      type: 'Archive',
      description: 'Long-form articles and research from the Al Mudawwanah archive.',
      href: 'articles.html',
      terms: 'articles research reading aqidah kalam fiqh theology'
    },
    {
      title: 'Imām Abū Ḥāmid al-Ghazālī',
      type: 'Scholar',
      description: 'Jurist, theologian and spiritual author whose works shaped later Sunni intellectual life.',
      href: 'scholars.html',
      terms: 'ghazali imam abu hamid ashari shafii scholar theology spirituality'
    },
    {
      title: 'Imām Abū al-Ḥasan al-Ashʿarī',
      type: 'Scholar',
      description: 'A central theologian in the development of one of Sunni Islam’s major kalām traditions.',
      href: 'scholars.html',
      terms: 'ashari imam abu al hasan kalam theology sunni scholar'
    },
    {
      title: 'Imām Abū Manṣūr al-Māturīdī',
      type: 'Scholar',
      description: 'Major theologian associated with the Ḥanafī tradition and classical Sunni theology.',
      href: 'scholars.html',
      terms: 'maturidi imam abu mansur hanafi theology kalam scholar'
    },
    {
      title: 'Classical Library',
      type: 'Library',
      description: 'Explore classical works, authors and reading context.',
      href: 'library.html',
      terms: 'library books texts tahawiyyah iqtisad risalah classical manuscripts'
    },
    {
      title: 'Questions & Answers',
      type: 'Q&A',
      description: 'Focused responses to questions in theology, law and spirituality.',
      href: 'answers.html',
      terms: 'questions answers theology fiqh spirituality aqidah'
    },
    {
      title: 'Media',
      type: 'Watch & Listen',
      description: 'Lectures and discussions from the Al Mudawwanah YouTube channel.',
      href: 'media.html',
      terms: 'media youtube video lecture audio watch listen'
    },
    {
      title: 'About Al Mudawwanah',
      type: 'Institute',
      description: 'Mission, editorial method and information about the institute.',
      href: 'about.html',
      terms: 'about mission institute methodology muhyidin somali'
    }
  ];

  function initSearch() {
    const dialog = $('#searchDialog');
    const input = $('#searchQuery');
    const hits = $('#searchHits');
    const close = $('.search-close', dialog || document);
    const triggers = $$('[data-search]');

    if (!dialog || !input || !hits || !triggers.length) return;

    const openDialog = () => {
      if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.classList.add('search-open');
      renderSearch('', hits);
      setTimeout(() => input.focus(), 20);
    };

    const closeDialog = () => {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
      document.body.classList.remove('search-open');
    };

    triggers.forEach((button) => button.addEventListener('click', openDialog));
    close?.addEventListener('click', closeDialog);

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });

    input.addEventListener('input', () => renderSearch(input.value, hits));

    document.addEventListener('keydown', (event) => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;

      if (event.key === '/' && !typing) {
        event.preventDefault();
        openDialog();
      }

      if (event.key === 'Escape' && dialog.open) closeDialog();
    });
  }

  function renderSearch(query, container) {
    const q = normalize(query);

    let results = q
      ? searchIndex
          .map((item) => {
            const title = normalize(item.title);
            const haystack = normalize(`${item.title} ${item.type} ${item.description} ${item.terms}`);
            let score = 0;
            if (title === q) score += 100;
            if (title.startsWith(q)) score += 30;
            if (title.includes(q)) score += 20;
            if (haystack.includes(q)) score += 10;
            return { ...item, score };
          })
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
      : searchIndex.slice(0, 6);

    if (!results.length) {
      container.innerHTML = `
        <div class="search-empty">
          <strong>No results found.</strong>
          <p>Try a scholar, discipline, book, or broader topic.</p>
        </div>`;
      return;
    }

    container.innerHTML = results
      .slice(0, 8)
      .map(
        (item) => `
          <a class="search-hit" href="${item.href}">
            <span class="search-hit-type">${escapeHTML(item.type)}</span>
            <strong>${escapeHTML(item.title)}</strong>
            <p>${escapeHTML(item.description)}</p>
          </a>`
      )
      .join('');
  }

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ʿʾ‘’']/g, '')
      .replace(/ḥ/g, 'h')
      .replace(/ṣ/g, 's')
      .replace(/ḍ/g, 'd')
      .replace(/ṭ/g, 't')
      .replace(/ẓ/g, 'z')
      .replace(/ā/g, 'a')
      .replace(/ī/g, 'i')
      .replace(/ū/g, 'u')
      .trim();
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ---------------------------------------------------------
     ARTICLE FILTERS
  --------------------------------------------------------- */
  function initFilters() {
    const buttons = $$('[data-filter]');
    const cards = $$('[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = (button.dataset.filter || 'all').toLowerCase();

        buttons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');

        cards.forEach((card) => {
          const categories = (card.dataset.category || '')
            .toLowerCase()
            .split(',')
            .map((item) => item.trim());

          const show = filter === 'all' || categories.includes(filter);
          card.hidden = !show;
          card.setAttribute('aria-hidden', String(!show));
        });
      });
    });
  }

  /* ---------------------------------------------------------
     SMOOTH ON-PAGE LINKS
  --------------------------------------------------------- */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------------------------------------------------------
     SAFER EXTERNAL LINKS
  --------------------------------------------------------- */
  function initExternalLinks() {
    $$('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', [...rel].join(' '));
    });
  }

  /* ---------------------------------------------------------
     TEACHER CAROUSEL
  --------------------------------------------------------- */
  function initTeacherCarousel() {
    const carousel = $('[data-teacher-carousel]');
    if (!carousel) return;
    const track = $('.teacher-track', carousel);
    const slides = $$('.teacher-slide', carousel);
    const prev = $('[data-teacher-prev]', carousel);
    const next = $('[data-teacher-next]', carousel);
    const dotsWrap = $('.teacher-dots', carousel);
    if (!track || slides.length === 0) return;

    let index = 0;
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'teacher-dot' + (i === 0 ? ' active' : '');
      b.type = 'button';
      b.setAttribute('aria-label', `Show teacher ${i + 1}`);
      b.addEventListener('click', () => go(i));
      dotsWrap?.appendChild(b);
      return b;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, n) => d.classList.toggle('active', n === index));
    }
    prev?.addEventListener('click', () => go(index - 1));
    next?.addEventListener('click', () => go(index + 1));

    let startX = null;
    track.addEventListener('pointerdown', e => { startX = e.clientX; });
    track.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

})();

// V11 contact form: static-site friendly; opens the visitor's mail app.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';
    const subject = encodeURIComponent(`Al Mudawwanah website inquiry — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  });
}
