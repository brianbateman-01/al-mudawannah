// search-index.js
// Simple site-wide index for client-side search

window.SEARCH_INDEX = [
  // Home sections
  { title: "Home", type: "Page", url: "index.html", keywords: "home al mudawwanah" },
  { title: "About", type: "Section", url: "index.html#about", keywords: "about mission institute ashari teachers" },
  { title: "Contact Us", type: "Section", url: "index.html#contact", keywords: "contact email message form" },
  { title: "Meet Our Teachers", type: "Section", url: "index.html#teachers", keywords: "teachers shaykh minhaji harun kanj masri azhari shams tameez abdullah shuuke imam sudagar" },

  // Main pages
  { title: "Articles", type: "Page", url: "articles/index.html", keywords: "articles library topics" },
  { title: "Courses", type: "Page", url: "courses.html", keywords: "courses classes apply enrollment hanafi ramadan" },
  { title: "Videos & Audios", type: "Page", url: "media.html", keywords: "videos audios media lectures recordings" },

  // Articles categories
  { title: "Foundations of Islam", type: "Articles", url: "articles/foundations/index.html", keywords: "foundations islam basics pillars faith purpose quran allah prophet" },
  { title: "Islamic Theology & Creed", type: "Articles", url: "articles/theology/index.html", keywords: "theology creed aqidah ashari maturidi attributes qadar revelation prophethood" },
  { title: "Addressing Misconceptions About Islam", type: "Articles", url: "articles/misconceptions/index.html", keywords: "misconceptions women marriage jihad sharia extremism violence science human rights" },
  { title: "Comparative Religion & Worldviews", type: "Articles", url: "articles/worldviews/index.html", keywords: "atheism christianity judaism hinduism buddhism other religions worldviews" },
  { title: "Modern Ideologies & Contemporary Thought", type: "Articles", url: "articles/modern-ideologies/index.html", keywords: "liberalism feminism postmodernism secularism nihilism materialism ideologies" },
  { title: "ʿIlm al-Kalām", type: "Articles", url: "articles/ilm-al-kalam/index.html", keywords: "kalam logic metaphysics moral philosophy philosophy of religion arguments methods theology" },

  // Foundations subpages
  { title: "What is Islam?", type: "Foundations", url: "articles/foundations/what-is-islam.html", keywords: "what is islam definition submission" },
  { title: "Who is Allah?", type: "Foundations", url: "articles/foundations/who-is-allah.html", keywords: "allah god tawhid attributes" },
  { title: "Prophet Muhammad ﷺ", type: "Foundations", url: "articles/foundations/prophet-muhammad.html", keywords: "prophet muhammad seerah messenger" },
  { title: "Qur’an Overview", type: "Foundations", url: "articles/foundations/quran-overview.html", keywords: "quran revelation scripture" },
  { title: "Pillars of Islam", type: "Foundations", url: "articles/foundations/pillars-of-islam.html", keywords: "pillars islam shahada salah zakah sawm hajj" },
  { title: "Pillars of Faith", type: "Foundations", url: "articles/foundations/pillars-of-faith.html", keywords: "iman angels books messengers last day qadar" },
  { title: "Purpose of Life", type: "Foundations", url: "articles/foundations/purpose-of-life.html", keywords: "purpose life worship tests afterlife" },

  // Worldviews subpages (major belief systems)
  { title: "Atheism", type: "Worldviews", url: "articles/worldviews/atheism.html", keywords: "atheism non belief god" },
  { title: "Christianity", type: "Worldviews", url: "articles/worldviews/christianity.html", keywords: "christianity trinity jesus" },
  { title: "Judaism", type: "Worldviews", url: "articles/worldviews/judaism.html", keywords: "judaism torah" },
  { title: "Hinduism", type: "Worldviews", url: "articles/worldviews/hinduism.html", keywords: "hinduism vedas polytheism" },
  { title: "Buddhism", type: "Worldviews", url: "articles/worldviews/buddhism.html", keywords: "buddhism nirvana" },
  { title: "Other Religions", type: "Worldviews", url: "articles/worldviews/other-religions.html", keywords: "other religions" },
];
