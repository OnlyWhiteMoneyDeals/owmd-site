/**
 * OWMD Component Loader
 * Navbar and footer HTML are bundled inline — no XHR fetch required.
 * This ensures Googlebot sees full nav/footer content without redirect errors.
 * After injection, fires 'owmdReady' event so scripts can initialize.
 */
(function () {
  'use strict';

  /* ── Inlined partials (no fetch = no redirect error for Googlebot) ── */
  const NAVBAR_HTML = `<div class="topbar">
  <div class="container">
    <div class="topbar-left">
      <a href="#" class="owmd-dynamic-tel">
        <svg class="icon" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
        +91 99108 05491
      </a>
      <a href="#" class="owmd-dynamic-email">
        <svg class="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        contact.us@onlywhitemoneydeals.com
      </a>
    </div>
  </div>
</div>

<div class="nav-overlay" id="navOverlay"></div>
<nav class="nav-mobile-drawer" id="mobileDrawer">
  <button class="drawer-close" id="drawerClose">✕</button>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="index.html#benefits">Benefits</a></li>
    <li><a href="index.html#nri">NRI</a></li>
    <li><a href="index.html#contact">Contact</a></li>
    <li><a href="faq.html">FAQ</a></li>
    <li><a href="browse-properties.html" class="btn-nav-alt" style="margin-top:8px; width:100%; box-sizing:border-box;">🏘 Browse Properties</a></li>
    <li><a href="list-property.html" class="btn-nav" style="margin-top:8px; width:100%; box-sizing:border-box;">+ List Property</a></li>
  </ul>
</nav>

<nav class="navbar" id="navbar">
  <div class="container">
    <a href="index.html" class="nav-logo">
      <img src="assets/logo1.webp"
           srcset="assets/responsive/logo1-400.webp 400w, assets/logo1.webp 566w"
           sizes="(max-width: 480px) 180px, 240px"
           width="240" height="74" alt="Only White Money Deals" fetchpriority="high">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" data-nav="home">Home</a></li>
      <li><a href="index.html#benefits" data-nav="benefits">Benefits</a></li>
      <li><a href="index.html#nri" data-nav="nri">NRI</a></li>
      <li><a href="index.html#contact" data-nav="contact">Contact</a></li>
      <li><a href="faq.html" data-nav="faq">FAQ</a></li>
      <li><a href="browse-properties.html" class="btn-nav-alt" data-nav="browse">🏘 Browse Properties</a></li>
      <li><a href="list-property.html" class="btn-nav" data-nav="list">+ List Property</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Open navigation menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

  const FOOTER_HTML = `<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          <div class="footer-logo-pill"><img src="assets/logo1.webp" width="160" height="50" alt="Only White Money Deals"></div>
        </div>
        <p>Founded by Er. Bhupendra Pratap Singh, MRICS — creating a real estate marketplace where every transaction is conducted exclusively through white money.</p>
        <div class="footer-social">
          <a href="#" class="owmd-dynamic-wa" data-msg="Hi OWMD, I want to discuss a property deal." aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61572109387322" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
          </a>
          <a href="https://www.linkedin.com/company/only-white-money-deals/" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>

        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="browse-properties.html">Browse Properties</a></li>
          <li><a href="list-property.html">List Property</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="index.html#contact">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="#" class="owmd-dynamic-tel">+91 99108 05491</a></li>
          <li><a href="#" class="owmd-dynamic-email">contact.us@onlywhitemoneydeals.com</a></li>
          <li><a href="https://maps.app.goo.gl/DyZkZm1SdLNY8YsF7" target="_blank" rel="noopener">SA-17, Jaipuria Sunrise Plaza,<br>Indirapuram, Ghaziabad – 201014</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span class="copyright-year"></span> Only White Money Deals. All rights reserved.</p>
      <p><em>"Honestly Earned, Tax-Paid Money Deserves Honest Deals"</em></p>
    </div>
  </div>
</footer>
<a class="whatsapp-float owmd-dynamic-wa" href="#" data-msg="Hi OWMD, I am interested in a white money property deal." aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>
<button class="scroll-top" id="scrollTop" aria-label="Scroll to top">↑</button>`;

  /* ── Mark active nav link based on current page ── */
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

  /* ── Initialize all interactive JS — runs after partials inject ── */
  function initScripts() {
    markActiveNav();

    const navbar = document.getElementById('navbar');

    const stBtn = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const pills = document.querySelectorAll('.pill-link');
    const pillsContainer = document.querySelector('.mobile-section-pills');

    // Single rAF-throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);
        if (stBtn) stBtn.classList.toggle('visible', scrollY > 400);

        if (scrollY < 50) {
          navAnchors.forEach(a => {
            if (!a.classList.contains('nav-active')) a.style.color = '';
          });
          pills.forEach(p => p.classList.remove('active'));
        }

        ticking = false;
      });
    }, { passive: true });

    // Scroll Spy via IntersectionObserver
    if (sections.length > 0) {
      const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id) updateSpyHighlights(id);
          }
        });
      }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

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
            if (isActive && pillsContainer && window.innerWidth <= 768) {
              // Read layout values BEFORE class changes invalidate styles
              const offsetLeft = p.offsetLeft;
              const offsetWidth = p.offsetWidth;
              const containerWidth = pillsContainer.offsetWidth;
              requestAnimationFrame(() => {
                pillsContainer.scrollLeft = offsetLeft - containerWidth / 2 + offsetWidth / 2;
              });
            }
            p.classList.toggle('active', isActive);
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
      resetHamburger();
    }

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    document.querySelectorAll('.nav-mobile-drawer a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - (navbar ? navbar.offsetHeight : 0) - 12, behavior: 'smooth' });
        }
      });
    });

    // Scroll to top button
    if (stBtn) {
      stBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Reveal on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

    // Mobile Read More truncation - deferred to a separate frame to prevent forced reflow
    setTimeout(() => {
      document.querySelectorAll('.mobile-truncate').forEach(el => {
        if (window.innerWidth <= 768 && el.scrollHeight > 150) {
          // Double check to avoid duplicate button creation if it already exists
          if (el.nextSibling && el.nextSibling.classList && el.nextSibling.classList.contains('read-more-btn')) return;
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
    }, 100);

    // Dynamic Video (YouTube Facade) Click Handler
    document.querySelectorAll('.dynamic-video').forEach(wrapper => {
      wrapper.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        const title = this.getAttribute('data-title');
        const isNoCookie = this.getAttribute('data-nocookie') === 'true';
        const domain = isNoCookie ? 'youtube-nocookie.com' : 'youtube.com';
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.${domain}/embed/${id}?autoplay=1&rel=0`;
        iframe.title = title;
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', 'true');
        
        this.innerHTML = '';
        this.appendChild(iframe);
      });
    });

    // Obfuscated dynamic contact details logic
    document.addEventListener('click', function (e) {
      const el = e.target.closest('.owmd-dynamic-tel, .owmd-dynamic-email, .owmd-dynamic-wa');
      if (!el) return;

      e.preventDefault();

      // De-obfuscate credentials dynamically to prevent raw crawlers/scrapers from parsing them
      const p1 = '99108';
      const p2 = '05491';
      const num = '91' + p1 + p2; // 919910805491

      const e1 = 'contact.us';
      const e2 = 'onlywhitemoneydeals.com';
      const email = e1 + '@' + e2;

      if (el.classList.contains('owmd-dynamic-tel')) {
        window.location.href = 'tel:+' + num;
      } else if (el.classList.contains('owmd-dynamic-email')) {
        window.location.href = 'mailto:' + email;
      } else if (el.classList.contains('owmd-dynamic-wa')) {
        const baseMsg = el.getAttribute('data-msg') || 'Hi OWMD, I am interested in a white money property deal.';
        const url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(baseMsg);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });

    // Fire ready event for page-specific scripts
    document.dispatchEvent(new CustomEvent('owmdReady'));
  }

  /* ── Boot: inject inlined partials synchronously, then init ── */
  function boot() {
    const navEl = document.getElementById('navbar-root');
    const footEl = document.getElementById('footer-root');
    if (navEl) navEl.innerHTML = NAVBAR_HTML;
    if (footEl) footEl.innerHTML = FOOTER_HTML;
    initScripts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
