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

// ── Chapter content — 14 pages ────────────────────────────────
const PAGES = [
  /* 1 */ `<div class="reader-chapter-header">
    <span class="reader-eyebrow">Capítulo 1</span>
    <h2 class="reader-chapter-title">Lo que vemos cuando vemos una pantalla</h2>
    <div class="reader-chapter-divider"></div>
  </div>
  <p>Hay una escena que se repite en casi todos los hogares. Un niño con una tablet, absorto, inmóvil. Un padre que lo mira desde el umbral de la puerta, con esa mezcla de alivio —porque al fin hay silencio— y de culpa —porque sabe que ese silencio tiene un precio.</p>
  <p>Ese padre no sabe exactamente qué precio. Pero lo intuye.</p>`,

  /* 2 */ `<p>Lo que hacemos entonces es lo más humano del mundo: tomamos una decisión basada en lo que podemos ver. Y lo que podemos ver es la pantalla.</p>
  <p>No vemos lo que está procesando su cerebro. No vemos si está construyendo algo, aprendiendo algo, imaginando algo. No vemos si está evadiendo o si está completamente presente dentro de ese mundo digital.</p>
  <p>Vemos la pantalla. Y la pantalla nos parece el problema.</p>
  <p>Este libro no empieza con datos. Empieza con esa imagen porque es la más honesta. Porque antes de hablar de neurociencia o de pedagogía o de límites digitales, necesitamos reconocer que lo que nos preocupa no es lo que nuestros hijos están haciendo. Es que no lo entendemos.</p>`,

  /* 3 */ `<p>Y eso nos asusta. Más de lo que admitimos.</p>
  <p>Crecimos en un mundo donde las reglas eran más simples, o al menos nos parecían más simples. El televisor se apagaba a las nueve. Los videojuegos eran para el fin de semana. Los libros eran buenos y las pantallas eran malas. La línea estaba clara.</p>
  <p>Esa línea ya no existe.</p>
  <div class="reader-pullquote">
    <p>"No nos asusta la pantalla. Nos asusta no entender qué hay detrás de ella."</p>
  </div>`,

  /* 4 */ `<p>Hoy un niño de ocho años puede estar viendo YouTube y estar aprendiendo a construir circuitos electrónicos. O puede estar consumiendo contenido diseñado por algoritmos para mantenerlo pegado a la pantalla el mayor tiempo posible. Las dos cosas se ven exactamente igual desde la puerta.</p>
  <p>La diferencia no está en la pantalla. Está en lo que ocurre dentro de la pantalla, y —más importante aún— en lo que ocurre dentro del niño mientras la usa.</p>
  <p>Eso es lo que este libro intenta desentrañar.</p>`,

  /* 5 */ `<h3 class="reader-subhead">El problema con los límites que no entienden</h3>
  <p>Durante años, la respuesta dominante ante la tecnología en la infancia fue el control. Cuántas horas, qué aplicaciones, a qué edad. Los expertos daban cifras. Las escuelas hacían campañas. Los padres ponemos contraseñas y temporizadores.</p>
  <p>Y los niños encontraban la manera de saltárselos.</p>
  <p>No porque sean malos. Sino porque la prohibición sin comprensión no forma criterio. Solo genera ingenio para evadir la prohibición.</p>`,

  /* 6 */ `<p>Cuando le decimos a un niño «no puedes usar el celular porque sí», no le estamos enseñando a relacionarse bien con la tecnología. Le estamos enseñando que los adultos tienen el poder de cortar algo que él percibe como importante, sin darle razones.</p>
  <p>Lo que aprende no es autorregulación. Lo que aprende es que debe esconderse.</p>
  <p>La autorregulación —esa habilidad de manejar el propio tiempo, la propia atención, las propias emociones frente a estímulos poderosos— no se aprende por prohibición. Se aprende por práctica guiada, por conversación honesta, por modelaje.</p>`,

  /* 7 */ `<div class="reader-pullquote">
    <p>"La prohibición sin comprensión no forma criterio. Solo genera ingenio para evadir la prohibición."</p>
  </div>
  <p>Y ahí está el nudo de todo.</p>
  <p>No es que los límites no sirvan. Sirven. Pero los límites tienen que venir de algún lugar. Tienen que tener una lógica que el niño pueda comprender, aunque no le guste. Tienen que ser parte de una conversación, no de una guerra.</p>`,

  /* 8 */ `<h3 class="reader-subhead">Lo que formamos mientras intentamos controlar</h3>
  <p>Cuando un padre pasa los primeros años de la vida digital de su hijo en modo «control total», inevitablemente crea un vacío. El niño no aprende a decidir porque las decisiones siempre las toma otro. No aprende a parar porque siempre lo paran. No aprende a priorizar porque las prioridades ya están establecidas.</p>
  <p>Luego ese niño tiene doce años. O quince. Y de pronto tiene un teléfono propio y nadie que lo controle.</p>`,

  /* 9 */ `<p>Y no sabe qué hacer con esa libertad.</p>
  <p>Esto no es un escenario hipotético. Es lo que estamos viendo. La explosión de ansiedad en adolescentes, la dificultad para concentrarse, la incapacidad de tolerar el aburrimiento, el FOMO crónico —ese miedo a perderse algo— son en parte consecuencia de no haber formado criterio a tiempo.</p>
  <p>No porque los padres fallaron. Sino porque nadie les explicó que su trabajo no era controlar la pantalla. Era formar la persona que iba a vivir con pantallas para siempre.</p>`,

  /* 10 — GATE fires after this page (~67%) */
  `<p>Esa es la diferencia fundamental entre crianza reactiva y crianza con criterio.</p>
  <p>La crianza reactiva responde a lo que ve: pantalla encendida → apagar la pantalla. Niño pegado al teléfono → quitar el teléfono. Calificaciones bajas → prohibir los videojuegos.</p>
  <p>La crianza con criterio pregunta antes de actuar: ¿qué está buscando este niño en esta pantalla? ¿Qué necesidad está satisfaciendo? ¿Qué le falta en otros lugares de su vida que hace que esta pantalla sea tan irresistible?</p>`,

  /* 11 */ `<div class="reader-pullquote">
    <p>"Tu trabajo no era controlar la pantalla. Era formar la persona que iba a vivir con pantallas para siempre."</p>
  </div>
  <p>Las respuestas a esas preguntas cambian completamente la intervención. Y cambian la relación.</p>
  <p>Un niño que entiende por qué ciertos usos de la tecnología son problemáticos, y que tiene un adulto dispuesto a conversar sobre eso sin juzgar ni castigar, tiene muchas más herramientas para navegar el mundo digital que un niño al que simplemente le apagaron la pantalla.</p>`,

  /* 12 */ `<h3 class="reader-subhead">Lo que propone este libro</h3>
  <p>No voy a darte una lista de reglas. No porque las reglas no sirvan, sino porque las reglas sin contexto se vuelven obsoletas rápido. El mundo digital cambia cada dieciocho meses. Las reglas de hoy no servirán para mañana.</p>
  <p>Lo que sí puede servirte es un marco. Una forma de pensar. Cuatro pilares que no dependen del dispositivo ni de la aplicación ni de la plataforma que venga después de TikTok.</p>`,

  /* 13 */ `<p>Criterio. Intención. Estructura. Conversación.</p>
  <p><strong>Criterio:</strong> que el niño entienda el porqué, no solo el qué. Que pueda evaluar por sí mismo si lo que está haciendo le sirve o no.</p>
  <p><strong>Intención:</strong> que el uso de la tecnología tenga un propósito. Que no sea relleno de tiempo sino herramienta, proceso, creación.</p>
  <p><strong>Estructura:</strong> que haya límites que tengan sentido, que el niño pueda entender y eventualmente negociar. No jaulas, sino marcos.</p>
  <p><strong>Conversación:</strong> que el diálogo sea posible. Que el niño pueda venir a contarle a su padre lo que vio, lo que le pareció, lo que le preocupó.</p>`,

  /* 14 */ `<p>Estos cuatro pilares no son un sistema. Son una actitud. Una forma de estar presente en la vida digital de tus hijos sin convertirte en su vigilante ni en su enemigo.</p>
  <p>El resto del libro te muestra cómo.</p>
  <div class="reader-chapter-end">
    <div class="reader-chapter-end__line"></div>
    <p>Fin del capítulo 1</p>
    <div class="reader-chapter-end__line"></div>
  </div>`,
];

// Gate fires when the user navigates TO or PAST this page index (0-based)
const GATE_AT_PAGE = 9; // page 10 of 14 ≈ 67 %
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
      if (sessionStorage.getItem(EMAIL_SESSION_KEY)) {
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
      sessionStorage.setItem(EMAIL_SESSION_KEY, email);
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
