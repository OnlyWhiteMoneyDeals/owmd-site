// Sticky navbar
const navbar = document.getElementById('navbar');
const stBtn = document.getElementById('scrollTop');
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const pills = document.querySelectorAll('.pill-link');
const pillsContainer = document.querySelector('.mobile-section-pills');

let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Sticky navbar logic
      navbar.classList.toggle('scrolled', scrollY > 40);
      if (stBtn) stBtn.classList.toggle('visible', scrollY > 400);

      // Navbar active link highlight
      let current = '';
      sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - navbar.offsetHeight - 60) current = sec.getAttribute('id');
      });
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--purple)' : '';
      });

      // Mobile Section Pills Active State & Auto-scroll
      if (pills.length > 0) {
        pills.forEach(p => {
          if (p.getAttribute('href') === '#' + current) {
            if (!p.classList.contains('active')) {
              pills.forEach(p2 => p2.classList.remove('active'));
              p.classList.add('active');
              if (pillsContainer && window.innerWidth <= 768) {
                const pillOffset = p.offsetLeft;
                const containerHalf = pillsContainer.offsetWidth / 2;
                const pillHalf = p.offsetWidth / 2;
                pillsContainer.scrollTo({
                  left: pillOffset - containerHalf + pillHalf,
                  behavior: 'smooth'
                });
              }
            }
          }
        });
      }
      ticking = false;
    });
    ticking = true;
  }
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// Scroll to top
if (stBtn) {
  stBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Reveal on scroll (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// Mobile Truncate Read More Logic
document.querySelectorAll('.mobile-truncate').forEach(el => {
  if (window.innerWidth <= 768) {
    if (el.scrollHeight > 150) {
      const btn = document.createElement('button');
      btn.className = 'read-more-btn';
      btn.textContent = 'Read More';
      // Insert button right after the truncated element
      el.parentNode.insertBefore(btn, el.nextSibling);
      
      btn.addEventListener('click', () => {
        const isExpanded = el.classList.toggle('expanded');
        btn.textContent = isExpanded ? 'Read Less' : 'Read More';
      });
    }
  }
});
