'use strict';

/* ── HEADER: scroll shadow ── */
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE NAV TOGGLE ── */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ── SMOOTH ANCHOR SCROLL (offset for fixed header) ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  const required = form.querySelectorAll('[required]');

  function validate() {
    let ok = true;
    required.forEach(field => {
      const empty = !field.value.trim();
      const emailInvalid = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (empty || emailInvalid) {
        field.classList.add('error');
        ok = false;
      } else {
        field.classList.remove('error');
      }
    });
    return ok;
  }

  required.forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) field.classList.remove('error');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.textContent = '';
    success.className = 'form-success';

    if (!validate()) {
      success.textContent = 'Vul alle verplichte velden correct in.';
      success.classList.add('error-msg');
      return;
    }

    // Simulate send (no real backend)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Versturen…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Verstuur bericht';
      success.textContent = 'Bedankt! Uw bericht is ontvangen. Wij nemen zo snel mogelijk contact met u op.';
      success.classList.add('success');
    }, 800);
  });
})();

/* ── INTERSECTION OBSERVER: fade-in on scroll ── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.product-card, .service-card, .review-card, .over-card, .usp-item, .contact-item'
  );

  targets.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();
