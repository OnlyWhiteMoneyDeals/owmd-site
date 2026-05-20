/**
 * OWMD Component Loader
 * Fetches navbar.html and footer.html partials and injects them into
 * their placeholder divs on every page — single source of truth.
 * After injection, fires 'owmdReady' event so scripts can initialize.
 */
(function () {
  'use strict';

  // Determine base path (handles pages in subdirectories if needed)
  const BASE = (function () {
    const path = location.pathname;
    const depth = path.split('/').length - 2;
    return depth > 0 ? '../'.repeat(depth) : '';
  })();

  // Start fetching partials immediately in parallel (non-blocking, triggers before DOMContentLoaded)
  const navbarPromise = fetch(BASE + 'partials/navbar.html')
    .then(r => r.ok ? r.text() : Promise.reject('Navbar fetch failed'))
    .catch(err => {
      console.warn(err);
      return '';
    });

  const footerPromise = fetch(BASE + 'partials/footer.html')
    .then(r => r.ok ? r.text() : Promise.reject('Footer fetch failed'))
    .catch(err => {
      console.warn(err);
      return '';
    });

  // Mark the active nav link based on current page filename
  function markActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(el => {
      const href = el.getAttribute('href') || '';
      const hrefPage = href.split('/').pop().split('#')[0] || 'index.html';
      if (hrefPage === page) {
        el.classList.add('nav-active');
        el.style.color = 'var(--purple)';
      }
    });
    // Set copyright year
    document.querySelectorAll('.copyright-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  // Initialize all interactive JS (formerly script.js) — runs after partials load
  function initScripts() {
    markActiveNav();

    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const stBtn = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const pills = document.querySelectorAll('.pill-link');
    const pillsContainer = document.querySelector('.mobile-section-pills');

    // Single rAF-throttled scroll handler for lightweight visual states only (extremely performant!)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 40);
        if (stBtn) stBtn.classList.toggle('visible', scrollY > 400);

        // If at the very top, clear active styles of scroll spy anchors
        if (scrollY < 50) {
          navAnchors.forEach(a => {
            if (!a.classList.contains('nav-active')) {
              a.style.color = '';
            }
          });
          pills.forEach(p => p.classList.remove('active'));
        }

        ticking = false;
      });
    }, { passive: true });

    // Scroll Spy via IntersectionObserver (Zero layout thrashing!)
    if (sections.length > 0) {
      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) {
              updateSpyHighlights(id);
            }
          }
        });
      }, {
        // Triggers when section passes the top 80px (navbar height) down to 60% of the screen
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0
      });

      sections.forEach(sec => spyObserver.observe(sec));

      function updateSpyHighlights(id) {
        navAnchors.forEach(a => {
          if (!a.classList.contains('nav-active')) {
            a.style.color = a.getAttribute('href') === '#' + id ? 'var(--purple)' : '';
          }
        });

        if (pills.length > 0) {
          pills.forEach(p => {
            const isActive = p.getAttribute('href') === '#' + id;
            p.classList.toggle('active', isActive);
            if (isActive && pillsContainer && window.innerWidth <= 768) {
              requestAnimationFrame(() => {
                pillsContainer.scrollLeft = p.offsetLeft - pillsContainer.offsetWidth / 2 + p.offsetWidth / 2;
              });
            }
          });
        }
      }
    }

    // Mobile hamburger
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('navOverlay');
    const drawerClose = document.getElementById('drawerClose');

    function resetHamburger() {
      if (!hamburger) return;
      const spans = hamburger.querySelectorAll('span');
      if (spans[0]) spans[0].style.transform = '';
      if (spans[1]) spans[1].style.opacity = '1';
      if (spans[2]) spans[2].style.transform = '';
    }

    function openDrawer() {
      drawer && drawer.classList.add('open');
      overlay && overlay.classList.add('active');
      // Animate to X
      if (hamburger) {
        const spans = hamburger.querySelectorAll('span');
        if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        if (spans[1]) spans[1].style.opacity = '0';
        if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      }
    }
    function closeDrawer() {
      drawer && drawer.classList.remove('open');
      overlay && overlay.classList.remove('active');
      resetHamburger(); // Reset back to 3-bar icon
    }

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    // Close drawer when any drawer link clicked
    document.querySelectorAll('.nav-mobile-drawer a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - navbar.offsetHeight - 12, behavior: 'smooth' });
        }
      });
    });

    // Scroll to top button
    if (stBtn) {
      stBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Reveal on scroll (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

    // Mobile Read More truncation
    document.querySelectorAll('.mobile-truncate').forEach(el => {
      if (window.innerWidth <= 768 && el.scrollHeight > 150) {
        const btn = document.createElement('button');
        btn.className = 'read-more-btn';
        btn.textContent = 'Read More';
        el.parentNode.insertBefore(btn, el.nextSibling);
        btn.addEventListener('click', () => {
          const expanded = el.classList.toggle('expanded');
          btn.textContent = expanded ? 'Read Less' : 'Read More';
        });
      }
    });

    // Fire ready event for any page-specific scripts listening
    document.dispatchEvent(new CustomEvent('owmdReady'));
  }

  // Boot: wait for DOM to be parsed, inject preloaded partials, and init
  function boot() {
    Promise.all([navbarPromise, footerPromise])
      .then(([navHtml, footHtml]) => {
        const navEl = document.getElementById('navbar-root');
        const footEl = document.getElementById('footer-root');
        if (navEl && navHtml) navEl.innerHTML = navHtml;
        if (footEl && footHtml) footEl.innerHTML = footHtml;
        initScripts();
      })
      .catch(err => {
        console.warn('OWMD boot error:', err);
        initScripts(); // still init even if partials fail
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
