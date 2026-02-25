/* ============================================================
   DROEFCASTER — JavaScript Interactiviteit
   ============================================================ */

'use strict';

/* ── COOKIE BANNER ─────────────────────────────────────────── */
(function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const btn    = document.getElementById('cookie-accept');
  if (!banner || !btn) return;

  if (localStorage.getItem('droef-cookies')) {
    banner.classList.add('hidden');
  }

  btn.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem('droef-cookies', '1');
    // Show player after accepting cookies (dramatic effect)
    setTimeout(() => {
      document.getElementById('sticky-player')?.classList.add('visible');
    }, 800);
  });
})();

/* ── NAVBAR ────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('nav-toggle');
  const links    = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });

  // Active section highlight
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => observer.observe(sec));
})();

/* ── AUDIO PLAYER (gesimuleerd, geen echte audio) ─────────── */
(function initPlayer() {
  const playBtn    = document.getElementById('play-btn');
  const progressEl = document.getElementById('progress-bar');
  const timeEl     = document.getElementById('time-current');
  const muteBtn    = document.getElementById('mute-btn');
  const speedSel   = document.getElementById('speed-select');
  const epPlayBtn  = document.getElementById('ep-play-btn');
  const progressWrap = document.getElementById('player-progress');
  const player     = document.getElementById('sticky-player');

  let playing = false;
  let muted   = false;
  let progress = 32; // start at 32%
  let interval = null;
  let seconds  = 0 + Math.floor((32 / 100) * 2843); // 47:23 = 2843s, start at 32%

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function updateDisplay() {
    if (progressEl) progressEl.style.width = progress + '%';
    if (timeEl) timeEl.textContent = formatTime(seconds);
  }

  function startPlay() {
    playing = true;
    playBtn && (playBtn.textContent = '⏸');
    epPlayBtn && (epPlayBtn.textContent = '⏸ Pauzeren');
    interval = setInterval(() => {
      if (seconds < 2843) {
        seconds++;
        progress = (seconds / 2843) * 100;
        updateDisplay();
      } else {
        stopPlay();
      }
    }, 1000);
  }

  function stopPlay() {
    playing = false;
    clearInterval(interval);
    playBtn && (playBtn.textContent = '▶');
    epPlayBtn && (epPlayBtn.textContent = '▶ Speel af');
  }

  function togglePlay() {
    if (playing) stopPlay(); else startPlay();
  }

  playBtn?.addEventListener('click', togglePlay);
  epPlayBtn?.addEventListener('click', () => {
    player?.classList.add('visible');
    togglePlay();
    setTimeout(() => {
      player?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 200);
  });

  muteBtn?.addEventListener('click', () => {
    muted = !muted;
    muteBtn.textContent = muted ? '🔇' : '🔈';
  });

  // Click on progress bar to seek
  progressWrap?.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    progress   = pct * 100;
    seconds    = Math.floor(pct * 2843);
    updateDisplay();
  });

  updateDisplay();
})();

/* ── BACK TO TOP ───────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── EPISODE DATA ──────────────────────────────────────────── */
const episodes = [
  {
    num: 47, emoji: '🌧️', category: 'mindset',
    title: 'Dingen die toch niet uitkomen',
    desc: 'Een eerlijk gesprek over verwachtingen, met niemand. Mijn gast zegde af.',
    date: '14 feb 2024', duration: '47:23'
  },
  {
    num: 46, emoji: '😑', category: 'business',
    title: '5 redenen waarom je business niet groeit (en dat misschien ook nooit doet)',
    desc: 'Soms is het gewoon zo. Niet alles hoeft te groeien. Bomen ook niet altijd.',
    date: '7 feb 2024', duration: '38:11'
  },
  {
    num: 45, emoji: '☁️', category: 'interview',
    title: 'Interview met Jan (niet zijn echte naam)',
    desc: 'Jan heeft een bedrijf. Het gaat okay. Echt okay, niet "okay" als in goed.',
    date: '31 jan 2024', duration: '52:04'
  },
  {
    num: 44, emoji: '🌫️', category: 'mindset',
    title: 'Acceptatie als groeistrategie',
    desc: 'Wat als je gewoon accepteert dat het goed genoeg is? Een radicaal idee.',
    date: '24 jan 2024', duration: '29:47'
  },
  {
    num: 43, emoji: '📉', category: 'business',
    title: 'Omzetdoelen die je misschien haalt',
    desc: 'Realistische financiële planning voor mensen die ook realistisch willen zijn.',
    date: '17 jan 2024', duration: '41:20'
  },
  {
    num: 42, emoji: '😴', category: 'mindset',
    title: 'Rust als productiviteitstool (of gewoon rust)',
    desc: 'Misschien hoef je ook gewoon minder te doen. Dat is ook een optie.',
    date: '10 jan 2024', duration: '33:55'
  }
];

const blogPosts = [
  {
    emoji: '📉', category: 'Business', date: '14 feb 2024', readTime: '4 min',
    title: '5 redenen waarom je business niet groeit (en hoe je daarmee leeft)',
    excerpt: 'Niet elke business hoeft exponentieel te groeien. Soms is stabiel ook gewoon stabiel.'
  },
  {
    emoji: '🌧️', category: 'Mindset', date: '7 feb 2024', readTime: '6 min',
    title: 'Hoe ik leerde stoppen met positief denken (en waarom dat beter werkt)',
    excerpt: 'Positief denken is leuk, maar eerlijk denken werkt ook. Misschien beter zelfs.'
  },
  {
    emoji: '🎙️', category: 'Podcast', date: '31 jan 2024', readTime: '3 min',
    title: 'Hoe je een podcast start die niemand luistert (gids voor beginners)',
    excerpt: 'Stap-voor-stap guide om je eigen podcast op te zetten. Of je hem gaat maken is jouw keuze.'
  },
  {
    emoji: '☕', category: 'Leven', date: '24 jan 2024', readTime: '5 min',
    title: 'Waarom koffie de enige consistente factor is in mijn werkdag',
    excerpt: 'Sommige dingen zijn zeker in het leven. Koffie. Meer dingen kan ik niet noemen.'
  },
  {
    emoji: '🤷', category: 'Business', date: '17 jan 2024', readTime: '7 min',
    title: '"Maar wat is dan jouw niche?" – Een vraag waar ik het antwoord niet op heb',
    excerpt: 'Iedereen zegt dat je een niche moet hebben. Ik help mensen die ondernemen. Dat is het.'
  },
  {
    emoji: '😪', category: 'Mindset', date: '10 jan 2024', readTime: '4 min',
    title: 'Burnout preventie door gewoon minder te doen (radicaal advies)',
    excerpt: 'Je hoeft niet alles te doen. Sterker nog: dat kan ook helemaal niet. Dat is wiskundig bewijsbaar.'
  }
];

/* ── RENDER EPISODES ───────────────────────────────────────── */
(function initEpisodes() {
  const container  = document.getElementById('episodes-container');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (!container) return;

  let currentFilter = 'all';
  let visibleCount  = 3;

  function renderEpisodes() {
    const filtered = currentFilter === 'all'
      ? episodes
      : episodes.filter(ep => ep.category === currentFilter);
    const visible = filtered.slice(0, visibleCount);

    container.innerHTML = visible.map(ep => `
      <div class="episode-item" data-cat="${ep.category}">
        <div class="ep-item-cover">${ep.emoji}</div>
        <div class="ep-item-info">
          <div class="ep-item-num">Aflevering ${ep.num}</div>
          <div class="ep-item-title">${ep.title}</div>
          <div class="ep-item-desc">${ep.desc}</div>
        </div>
        <div class="ep-item-meta">
          <div>${ep.date}</div>
          <div>${ep.duration}</div>
          <div style="margin-top:6px">
            <button onclick="playEpisode(${ep.num})" style="background:none;border:1px solid var(--border);border-radius:99px;padding:3px 10px;cursor:pointer;font-size:.78rem;color:var(--accent)">▶ Spelen</button>
          </div>
        </div>
      </div>
    `).join('');

    if (loadMoreBtn) {
      loadMoreBtn.style.display = filtered.length <= visibleCount ? 'none' : 'inline-flex';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      visibleCount  = 3;
      renderEpisodes();
    });
  });

  loadMoreBtn?.addEventListener('click', () => {
    visibleCount += 3;
    renderEpisodes();
  });

  renderEpisodes();
})();

window.playEpisode = function(num) {
  const player = document.getElementById('sticky-player');
  player?.classList.add('visible');
  const titleEl = player?.querySelector('.player-title');
  if (titleEl) titleEl.textContent = `Afl. ${num}: Aan het laden...`;
};

/* ── RENDER BLOG ───────────────────────────────────────────── */
(function initBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  grid.innerHTML = blogPosts.map(post => `
    <article class="blog-card">
      <div class="blog-card-img">${post.emoji}</div>
      <div class="blog-card-body">
        <span class="blog-card-tag">${post.category}</span>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
        <div class="blog-card-meta">
          <span>${post.date}</span>
          <span>${post.readTime} lezen</span>
        </div>
      </div>
    </article>
  `).join('');
})();

/* ── TESTIMONIAL SLIDER ────────────────────────────────────── */
(function initSlider() {
  const track  = document.getElementById('testimonials-track');
  const dotsEl = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  const total = cards.length;
  const visible = () => window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1;

  // Create dots
  if (dotsEl) {
    dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
      `<button class="dot${i === 0 ? ' active' : ''}" data-idx="${i}" aria-label="Ga naar ${i+1}"></button>`
    ).join('');

    dotsEl.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => goTo(+dot.dataset.idx));
    });
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - visible()));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    track.style.transition = 'transform .35s cubic-bezier(.4,0,.2,1)';
    dotsEl?.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Auto-advance (slowly, appropriately droef)
  let auto = setInterval(() => goTo((current + 1) % Math.max(1, total - visible() + 1)), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => {
    auto = setInterval(() => goTo((current + 1) % Math.max(1, total - visible() + 1)), 5000);
  });
})();

/* ── NEWSLETTER FORM ───────────────────────────────────────── */
(function initNewsletter() {
  const form    = document.getElementById('newsletter-form');
  const success = document.getElementById('nl-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('nl-email')?.value;
    if (!email) return;

    // Simulate sending
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Bezig met aanmelden...';
    btn.disabled = true;

    setTimeout(() => {
      success?.classList.add('visible');
      btn.textContent = '✓ Aangemeld';
      btn.style.background = '#48bb78';
    }, 1200);
  });
})();

/* ── CONTACT FORM ──────────────────────────────────────────── */
(function initContact() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Bezig met versturen...';
    btn.disabled = true;

    setTimeout(() => {
      success?.classList.add('visible');
      btn.textContent = '✓ Verstuurd (hopelijk)';
      btn.style.background = '#48bb78';
      form.reset();
    }, 1500);
  });
})();

/* ── SMOOTH SCROLL + OFFSET ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── FADE-IN ON SCROLL ─────────────────────────────────────── */
(function initFadeIn() {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.service-card, .testimonial-card, .blog-card, .episode-item, .stat, .skill-item'
  );

  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => io.observe(el));
})();

/* ── EASTER EGG: Konami Code ───────────────────────────────── */
(function initEasterEgg() {
  const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[idx]) {
      idx++;
      if (idx === konamiCode.length) {
        idx = 0;
        showEasterEgg();
      }
    } else {
      idx = 0;
    }
  });

  function showEasterEgg() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.85);
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      color:#fff;text-align:center;gap:20px;
    `;
    overlay.innerHTML = `
      <div style="font-size:5rem">😔</div>
      <h2 style="font-size:2rem;font-weight:800">Je hebt de Droef Code gevonden</h2>
      <p style="opacity:.7;max-width:400px">Gefeliciteerd. Dit was de meest droevige easter egg ooit gemaakt.
      Er is geen prijs. Er was nooit een prijs. Maar je deed het toch.</p>
      <button onclick="this.parentElement.remove()" style="
        background:#667eea;color:#fff;border:none;padding:12px 28px;
        border-radius:8px;cursor:pointer;font-size:1rem;font-weight:700;
      ">Terug naar de droefheid →</button>
    `;
    document.body.appendChild(overlay);
  }
})();

/* ── TITLE VISIBILITY TRICK ────────────────────────────────── */
(function initTitleChange() {
  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden
      ? '😔 Kom terug... of niet. Maakt ook niet uit.'
      : originalTitle;
  });
})();
