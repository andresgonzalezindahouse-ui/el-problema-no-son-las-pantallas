/* ===================================================================
   EL PROBLEMA NO SON LAS PANTALLAS — Main JS
   Scroll animations, parallax, header behavior
   =================================================================== */

import './style.css';
// reader.js is lazy-loaded on demand (see initReader below)

// ── Intersection Observer for scroll animations ─────────────────
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.anim-fade-up, .anim-scale-in, .deco-image'
  );

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once visible, stop observing (one-time animation)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}


// ── Parallax for decorative images ──────────────────────────────
function initParallax() {
  const parallaxElements = document.querySelectorAll('.anim-parallax');
  if (!parallaxElements.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      // How far the element center is from viewport center, normalized
      const offset = (elCenter - vh / 2) / vh;
      // Subtle movement: max ±30px
      const translateY = offset * -30;
      el.style.transform = `translateY(${translateY}px)`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax(); // initial position
}


// ── Header scroll state ─────────────────────────────────────────
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastScrollY = 0;

  function onScroll() {
    const sy = window.scrollY;
    
    if (sy > 80) {
      header.style.background = 'rgba(5, 6, 8, 0.92)';
    } else {
      header.style.background = 'rgba(5, 6, 8, 0.75)';
    }

    lastScrollY = sy;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}


// ── Smooth scroll for anchor links ──────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.includes('REEMPLAZAR')) return;

      // Skip fragment links — handled by the reader module
      if (href === '#fragmento' || link.id === 'hero-fragment-btn') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('site-header')?.offsetHeight || 0;
        const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}


// ── Count-up animation for stat numbers ─────────────────────────
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat__number[data-count]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1500;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => observer.observe(el));
}


// ── Subtle particle / grain effect on hero ──────────────────────
function initHeroGrain() {
  // The CSS noise texture handles this; this function is a placeholder
  // for future enhancements like canvas-based particles
}

// ── Lazy-load reader module on first interaction ────────────────
let readerModule = null;

function initReaderLazy() {
  const triggers = document.querySelectorAll('#hero-fragment-btn, a[href="#fragmento"]');
  
  triggers.forEach((el) => {
    el.addEventListener('click', async (e) => {
      // ALWAYS prevent default to avoid scrolling to #fragmento section
      e.preventDefault();
      e.stopPropagation();
      
      try {
        // Load module if not yet loaded
        if (!readerModule) {
          readerModule = await import('./reader.js');
          readerModule.initReader();
        }
        // Always open the appropriate modal on click
        if (localStorage.getItem(readerModule.EMAIL_SESSION_KEY)) {
          readerModule.openReader();
        } else {
          readerModule.openEmailModal();
        }
      } catch (err) {
        console.error('Error loading reader:', err);
      }
    });
  });

  // Preload reader module after idle so clicks feel instant
  const preload = () => {
    if (!readerModule) {
      import('./reader.js').then((mod) => {
        readerModule = mod;
        readerModule.initReader();
      }).catch(() => {});
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(preload, { timeout: 4000 });
  } else {
    setTimeout(preload, 4000);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initParallax();
  initHeaderScroll();
  initSmoothScroll();
  initCountUp();
  initHeroGrain();
  initReaderLazy();
});
