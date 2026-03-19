/* =============================================
   NIEDERL BAR – Schladming
   JavaScript Interactivity
   ============================================= */

'use strict';

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ---- Smooth scroll offset for fixed navbar ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- Menu tabs ----
const menuTabs = document.querySelectorAll('.menu-tab');
const menuContents = document.querySelectorAll('.menu-content');

menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    menuTabs.forEach(t => t.classList.remove('active'));
    menuContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const content = document.getElementById('tab-' + target);
    if (content) content.classList.add('active');
  });
});

// ---- Scroll reveal ----
const revealElements = document.querySelectorAll(
  '.feature, .contact-card, .hours-card, .menu-item, .about-text, .about-features, .opening-text, .opening-hours'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ---- Back to top ----
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Active nav link highlight on scroll ----
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));
