/* ===================================================================
   READER SYSTEM — Email Gate · Book Viewer · Gating · Analytics
   =================================================================== */

import './reader.css';

// ── Analytics ──────────────────────────────────────────────────
function track(event, data = {}) {
  const payload = { event, ...data, ts: new Date().toISOString() };
  if (window.dataLayer) window.dataLayer.push(payload);
  if (typeof window.gtag === 'function') window.gtag('event', event, data);
  // Dev log
  // eslint-disable-next-line no-console
  console.log('[📊 Track]', event, data);
}

// ── Chapter content — 6 pages (real book text) ───────────────────
const PAGES = [

  /* ── Page 1 of 6 ── */
  `<div class="reader-chapter-header">
    <span class="reader-eyebrow">Capítulo 1</span>
    <h2 class="reader-chapter-title">El problema no son las pantallas</h2>
    <div class="reader-chapter-divider"></div>
  </div>
  <p class="book-p book-p--drop-cap">Nuestra hija puede pasar horas frente a una pantalla. No una o dos. A veces cuatro, a veces más. Y no siempre está haciendo algo que desde afuera parezca “valioso”. Juega, repite niveles, se obsesiona con personajes, ve videos, prueba cosas que no funcionan, se frustra y vuelve a empezar.</p>
  <p class="book-p">Si uno congela esa escena y la mira sin contexto, la conclusión parece obvia: exceso de pantalla, falta de control, un error de crianza. Nosotros también crecimos escuchando eso.</p>
  <p class="book-p">Durante mucho tiempo, la conversación sobre tecnología y niños ha estado dominada por una idea muy simple: menos pantalla es mejor. Y aunque esa idea tiene buenas intenciones, y quizás algunas perspectivas médicas respaldan ciertos aspectos, en la práctica suele simplificar demasiado un problema que es mucho más profundo. Porque el punto no es la pantalla. Nunca lo ha sido.</p>`,

  /* ── Page 2 of 6 ── */
  `<p class="book-pivot">El punto es lo que pasa dentro de ella.</p>
  <p class="book-p book-p--first">Recuerdo una mañana cualquiera, de esas que no parecen importantes en el momento pero que terminan marcando un antes y un después cuando uno las mira con distancia. Estábamos desayunando y Amelia empezó a contarnos sobre una nueva actualización de un videojuego que le gustaba. Hablaba rápido, emocionada, pero no era solo emoción. Había estructura en lo que decía.</p>
  <p class="book-p">Hablaba de probabilidades, de personajes que aparecían con más frecuencia ciertos días, de estrategias para avanzar más rápido. En medio de todo eso dijo algo que, en ese momento, parecía una frase más dentro de su entusiasmo, pero que después entendimos mejor: que ya sabía que lo iba a lograr. No lo dijo como quien desea algo. Lo dijo como quien ya hizo las cuentas.</p>`,

  /* ── Page 3 of 6 ── */
  `<p class="book-p book-p--first">Había estimado cuánto tiempo le tomaría, cuántos intentos necesitaría, qué variables podían jugar a favor o en contra. Incluso comparó con eventos anteriores dentro del mismo juego para ajustar su expectativa. Días después, lo logró. Antes de eso, una amiga suya había dicho que no creía poder conseguir lo mismo. No lo logró.</p>
  <p class="book-p">No es que uno tenga razón y el otro no. Lo interesante es lo que hay detrás de esas dos formas de pensar.</p>
  <p class="book-p">Ahí fue cuando entendimos algo que después se nos fue haciendo cada vez más evidente: lo que estaba aprendiendo no tenía nada que ver con el juego en sí. Tenía que ver con cómo pensaba. Y ese tipo de pensamiento no aparece de la nada. Se construye.</p>`,

  /* ── Page 4 of 6 — GATE fires after this ── */
  `<p class="book-p book-p--first">Porque mientras desde afuera alguien puede ver a una niña “jugando”, por dentro están pasando muchas más cosas. Está evaluando opciones, tomando decisiones, probando estrategias, tolerando frustración, ajustando su comportamiento según resultados. Está, en el sentido más literal, aprendiendo a aprender.</p>
  <p class="book-p">El problema es que casi siempre nos quedamos en la superficie. Vemos la pantalla y asumimos que sabemos lo que está pasando. Pero no lo sabemos. Y ese error de interpretación tiene consecuencias.</p>
  <p class="book-p">Porque cuando creemos que el problema es el tiempo, respondemos con control. Limitamos, prohibimos, reducimos horas. Y con eso, a veces, cortamos procesos que podrían convertirse en algo mucho más grande.</p>`,

  /* ── Page 5 of 6 (post-gate) ── */
  `<p class="book-pivot book-pivot--left">Quitar la pantalla no soluciona el problema de fondo. Solo lo aplaza.</p>
  <div class="book-ornament" aria-hidden="true"><span>★</span></div>
  <p class="book-p book-p--first">Esto es solo el comienzo.</p>
  <p class="book-p">Lo que sigue no es más información. Es donde cambia la forma en la que entiendes todo esto.</p>`,

  /* ── Page 6 of 6 — Closing ── */
  `<div class="reader-closing">
    <div class="reader-closing__ornament" aria-hidden="true">¶</div>
    <p class="reader-closing__quote">“Esto es solo el comienzo.<br>Lo que sigue no es más información.<br>Es donde todo cambia.”</p>
    <p class="reader-closing__cta-label">Leer el libro completo en:</p>
    <div class="reader-closing__buttons">
      <a href="#REEMPLAZAR_POR_LINK_AMAZON" target="_blank" rel="noopener" class="reader-cta-btn reader-cta-btn--primary" id="reader-closing-amazon">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.66.66 0 01-.753.069c-1.06-.878-1.25-1.284-1.828-2.119-1.748 1.784-2.985 2.317-5.249 2.317-2.68 0-4.764-1.653-4.764-4.96 0-2.583 1.401-4.339 3.392-5.2 1.726-.76 4.139-.895 5.984-1.105v-.41c0-.756.058-1.65-.386-2.303-.386-.579-1.124-.818-1.775-.818-1.205 0-2.277.618-2.54 1.897-.054.285-.261.566-.547.58l-3.065-.33c-.258-.058-.544-.266-.472-.66C6.025 1.464 9.11 0 11.862 0c1.407 0 3.243.373 4.351 1.438 1.407 1.307 1.272 3.05 1.272 4.948v4.482c0 1.348.559 1.94 1.084 2.67.185.261.224.574-.012.765-.592.494-1.645 1.415-2.224 1.93l-.189.162z"/><path d="M21.63 19.672C19.086 21.738 15.35 22.84 12.12 22.84c-4.548 0-8.644-1.682-11.745-4.48-.243-.22-.026-.52.267-.35 3.344 1.946 7.48 3.118 11.753 3.118 2.882 0 6.052-.597 8.972-1.834.44-.188.81.289.263.378z"/></svg>
        Amazon
      </a>
      <a href="#REEMPLAZAR_POR_LINK_GOOGLE_PLAY" target="_blank" rel="noopener" class="reader-cta-btn" id="reader-closing-google">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.834 1.64a1 1 0 010 1.733l-2.834 1.64-2.532-2.533 2.532-2.48zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/></svg>
        Google Play
      </a>
      <a href="#REEMPLAZAR_POR_LINK_APPLE_BOOKS" target="_blank" rel="noopener" class="reader-cta-btn" id="reader-closing-apple">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        Apple Books
      </a>
    </div>
  </div>`,
];

// Gate fires when the user navigates TO or PAST this page index (0-based)
const GATE_AT_PAGE = 3; // page 4 of 6 ≈ 67%
const EMAIL_SESSION_KEY = 'rws_email_submitted';

let currentPage = 0;
let gateShown = false;

// ── Backend: capture email ──────────────────────────────────────
async function submitEmail(email) {
  try {
    const res = await fetch('/api/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source: 'landing_book',
        timestamp: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    // Don't block UX on network failure
    return true;
  }
}

// ── Modals: email gate ──────────────────────────────────────────
function openEmailModal() {
  document.getElementById('rws-modal-email').classList.add('is-open');
  document.body.classList.add('modal-open');
  setTimeout(() => document.getElementById('rws-email-input')?.focus(), 350);
}

function closeEmailModal() {
  document.getElementById('rws-modal-email').classList.remove('is-open');
  document.body.classList.remove('modal-open');
}

// ── Modals: reader ─────────────────────────────────────────────
function openReader() {
  currentPage = 0;
  gateShown = false;
  renderPage(0, 'next', true);
  document.getElementById('rws-modal-reader').classList.add('is-open');
  document.body.classList.add('modal-open');
  track('adelanto_opened');
}

function closeReader() {
  document.getElementById('rws-modal-reader').classList.remove('is-open');
  document.body.classList.remove('modal-open');
}

// ── Page rendering ─────────────────────────────────────────────
function renderPage(index, direction = 'next', instant = false) {
  const container = document.getElementById('rws-page-container');
  const totalPages = PAGES.length;

  // Progress
  const pct = ((index + 1) / totalPages) * 100;
  document.getElementById('rws-progress-fill').style.width = pct + '%';
  document.getElementById('rws-page-num').textContent = `${index + 1} / ${totalPages}`;

  // Nav buttons
  document.getElementById('rws-prev').disabled = index === 0;
  document.getElementById('rws-next').disabled = index === totalPages - 1;
  document.getElementById('rws-prev-bottom').disabled = index === 0;
  document.getElementById('rws-next-bottom').disabled = index === totalPages - 1;

  // Remove old page with animation
  const oldPage = container.querySelector('.reader-page');
  if (oldPage && !instant) {
    const exitClass = direction === 'next' ? 'page-exit-left' : 'page-exit-right';
    oldPage.classList.add(exitClass);
    oldPage.addEventListener('animationend', () => oldPage.remove(), { once: true });
  } else if (oldPage) {
    oldPage.remove();
  }

  // Create new page
  const page = document.createElement('div');
  page.className = 'reader-page';
  if (!instant) {
    const enterClass = direction === 'next' ? 'page-enter-right' : 'page-enter-left';
    page.classList.add(enterClass);
    requestAnimationFrame(() => requestAnimationFrame(() => page.classList.remove(enterClass)));
  }
  page.innerHTML = PAGES[index];
  container.appendChild(page);

  // Analytics
  if (pct >= 50) track('scroll_50', { page: index + 1 });
  if (pct >= 80) track('scroll_80', { page: index + 1 });

  // Gate
  if (index >= GATE_AT_PAGE && !gateShown) {
    setTimeout(showGate, 700);
  }
}

function navigate(dir) {
  const next = currentPage + (dir === 'next' ? 1 : -1);
  if (next < 0 || next >= PAGES.length) return;
  currentPage = next;
  renderPage(currentPage, dir);
}

// ── Gate overlay ──────────────────────────────────────────────
function showGate() {
  if (gateShown) return;
  gateShown = true;
  document.getElementById('rws-gate').classList.add('is-visible');
}

function dismissGate() {
  document.getElementById('rws-gate').classList.remove('is-visible');
}

// ── Build modal HTML ──────────────────────────────────────────
function buildModals() {
  const totalPages = PAGES.length;

  const html = /* html */`
  <!-- EMAIL GATE -->
  <div id="rws-modal-email" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="rws-email-title">
    <div class="modal-email">
      <button class="modal-close" id="rws-email-close" aria-label="Cerrar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="modal-email__book-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
        </svg>
      </div>
      <h2 class="modal-email__title" id="rws-email-title">Lee el primer capítulo</h2>
      <p class="modal-email__text">Puedes leerlo gratis. Pero si esto te hace sentido, probablemente vas a querer terminarlo.</p>
      <form id="rws-email-form" class="modal-email__form" novalidate>
        <div class="modal-email__field">
          <input
            type="email"
            id="rws-email-input"
            name="email"
            placeholder="tu@email.com"
            autocomplete="email"
            required
            aria-label="Tu correo electrónico"
          />
        </div>
        <button type="submit" class="modal-email__submit" id="rws-email-submit">
          <span class="btn-text">Acceder al capítulo</span>
          <span class="btn-loader" aria-hidden="true"></span>
        </button>
        <p class="modal-email__micro">No spam. Solo contenido que vale la pena.</p>
      </form>
    </div>
  </div>

  <!-- BOOK READER -->
  <div id="rws-modal-reader" class="modal-overlay modal-overlay--reader" role="dialog" aria-modal="true" aria-label="Lector del libro">
    <div class="reader-shell">

      <div class="reader-header">
        <span class="reader-header__title">El problema no son las pantallas</span>
        <div class="reader-header__controls">
          <span class="reader-page-num" id="rws-page-num">1 / ${totalPages}</span>
          <button class="reader-close" id="rws-reader-close" aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="reader-progress" aria-hidden="true">
        <div class="reader-progress__fill" id="rws-progress-fill"></div>
      </div>

      <div class="reader-body">
        <button class="reader-nav reader-nav--prev" id="rws-prev" aria-label="Página anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="reader-page-container" id="rws-page-container"></div>
        <button class="reader-nav reader-nav--next" id="rws-next" aria-label="Página siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <!-- Gating overlay -->
        <div class="reader-gate" id="rws-gate" aria-live="polite">
          <div class="reader-gate__card">
            <p class="reader-gate__title">Si llegaste hasta aquí,<br>ya entendiste algo importante.</p>
            <p class="reader-gate__sub">El resto no es más de lo mismo.<br>Es donde todo cambia.</p>
            <a
              href="#REEMPLAZAR_POR_LINK_AMAZON"
              target="_blank"
              rel="noopener"
              class="reader-gate__btn-primary"
              id="rws-gate-amazon"
            >
              Leer el libro completo en Amazon
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button class="reader-gate__btn-secondary" id="rws-gate-continue">
              Seguir leyendo
            </button>
          </div>
        </div>
      </div>

      <div class="reader-footer">
        <button class="reader-nav-btn" id="rws-prev-bottom">← Anterior</button>
        <a
          href="#REEMPLAZAR_POR_LINK_AMAZON"
          target="_blank"
          rel="noopener"
          class="reader-footer__amazon"
          id="rws-footer-amazon"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.66.66 0 01-.753.069c-1.06-.878-1.25-1.284-1.828-2.119-1.748 1.784-2.985 2.317-5.249 2.317-2.68 0-4.764-1.653-4.764-4.96 0-2.583 1.401-4.339 3.392-5.2 1.726-.76 4.139-.895 5.984-1.105v-.41c0-.756.058-1.65-.386-2.303-.386-.579-1.124-.818-1.775-.818-1.205 0-2.277.618-2.54 1.897-.054.285-.261.566-.547.58l-3.065-.33c-.258-.058-.544-.266-.472-.66C6.025 1.464 9.11 0 11.862 0c1.407 0 3.243.373 4.351 1.438 1.407 1.307 1.272 3.05 1.272 4.948v4.482c0 1.348.559 1.94 1.084 2.67.185.261.224.574-.012.765-.592.494-1.645 1.415-2.224 1.93l-.189.162z"/>
            <path d="M21.63 19.672C19.086 21.738 15.35 22.84 12.12 22.84c-4.548 0-8.644-1.682-11.745-4.48-.243-.22-.026-.52.267-.35 3.344 1.946 7.48 3.118 11.753 3.118 2.882 0 6.052-.597 8.972-1.834.44-.188.81.289.263.378z"/>
          </svg>
          Comprar en Amazon
        </a>
        <button class="reader-nav-btn" id="rws-next-bottom">Siguiente →</button>
      </div>

    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

// ── Wire up events ────────────────────────────────────────────
function bindEvents() {
  // Open email modal from "Leer un fragmento"
  document.querySelectorAll('#hero-fragment-btn, a[href="#fragmento"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      track('click_adelanto');
      if (localStorage.getItem(EMAIL_SESSION_KEY)) {
        openReader();
      } else {
        openEmailModal();
      }
    });
  });

  // Close email modal
  document.getElementById('rws-email-close').addEventListener('click', closeEmailModal);
  document.getElementById('rws-modal-email').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeEmailModal();
  });

  // Email form submit
  document.getElementById('rws-email-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('rws-email-input');
    const btn = document.getElementById('rws-email-submit');
    const email = input.value.trim();

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.classList.add('is-invalid');
      input.focus();
      return;
    }
    input.classList.remove('is-invalid');

    btn.classList.add('is-loading');
    btn.disabled = true;

    const ok = await submitEmail(email);

    if (ok) {
      localStorage.setItem(EMAIL_SESSION_KEY, email);
      track('email_submitted', { email });
      closeEmailModal();
      setTimeout(openReader, 300);
    } else {
      btn.classList.remove('is-loading');
      btn.disabled = false;
    }
  });

  // Close reader
  document.getElementById('rws-reader-close').addEventListener('click', closeReader);
  document.getElementById('rws-modal-reader').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeReader();
  });

  // Page navigation — arrows
  document.getElementById('rws-prev').addEventListener('click', () => navigate('prev'));
  document.getElementById('rws-next').addEventListener('click', () => navigate('next'));

  // Page navigation — footer buttons
  document.getElementById('rws-prev-bottom').addEventListener('click', () => navigate('prev'));
  document.getElementById('rws-next-bottom').addEventListener('click', () => navigate('next'));

  // Gate buttons
  document.getElementById('rws-gate-amazon').addEventListener('click', () => {
    track('click_amazon', { source: 'gate' });
  });
  document.getElementById('rws-footer-amazon').addEventListener('click', () => {
    track('click_amazon', { source: 'footer' });
  });
  document.getElementById('rws-gate-continue').addEventListener('click', dismissGate);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const readerOpen = document.getElementById('rws-modal-reader').classList.contains('is-open');
    if (!readerOpen) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate('next');
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   navigate('prev');
    if (e.key === 'Escape') closeReader();
  });

  // Touch / swipe
  let touchStartX = 0;
  const readerEl = document.getElementById('rws-modal-reader');
  readerEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  readerEl.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) navigate(dx > 0 ? 'next' : 'prev');
  }, { passive: true });
}

// ── Init ───────────────────────────────────────────────────────
export function initReader() {
  buildModals();
  bindEvents();
}
