/**
 * Email HTML templates — El problema no son las pantallas
 * Editorial design, mobile-first, email-client compatible
 */

const SITE_URL    = 'https://raisingwithsense.com';
const AMAZON_URL  = process.env.AMAZON_URL  || 'https://www.amazon.com';
const GPLAY_URL   = process.env.GPLAY_URL   || 'https://play.google.com';
const APPLE_URL   = process.env.APPLE_URL   || 'http://books.apple.com/us/book/id6763953364';

// ── Shared partials ────────────────────────────────────────────────

function buyerLink(email) {
  return `${SITE_URL}/api/mark-as-buyer?e=${encodeURIComponent(email)}`;
}

function storeButtons() {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0 8px;">
    <tr>
      <td align="center">
        <!-- Amazon -->
        <a href="${AMAZON_URL}" target="_blank" rel="noopener"
          style="display:inline-block;margin:5px 6px;padding:12px 22px;background:#f5b942;color:#050608;font-family:Georgia,serif;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;letter-spacing:0.02em;">
          📦 Amazon
        </a>
        <!-- Google Play -->
        <a href="${GPLAY_URL}" target="_blank" rel="noopener"
          style="display:inline-block;margin:5px 6px;padding:12px 22px;background:#ffffff;color:#1a1a2e;font-family:Georgia,serif;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;border:1px solid #ddd;letter-spacing:0.02em;">
          ▶ Google Play
        </a>
        <!-- Apple Books -->
        <a href="${APPLE_URL}" target="_blank" rel="noopener"
          style="display:inline-block;margin:5px 6px;padding:12px 22px;background:#ffffff;color:#1a1a2e;font-family:Georgia,serif;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;border:1px solid #ddd;letter-spacing:0.02em;">
           Apple Books
        </a>
      </td>
    </tr>
  </table>`;
}

function divider() {
  return `<div style="width:48px;height:2px;background:#f5b942;margin:28px auto;opacity:0.5;"></div>`;
}

function emailWrapper({ preheader, body, email }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>El problema no son las pantallas</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width:600px){
      .email-container{width:100%!important;margin:0!important;}
      .email-body{padding:28px 20px!important;}
      .store-table td{display:block!important;text-align:center!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f0ebe0;font-family:Georgia,serif;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#f0ebe0;line-height:1px;">
    ${preheader}&nbsp;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f0ebe0">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <!-- Email container -->
        <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" border="0"
               width="580" style="max-width:580px;background:#faf7f2;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0d0d1a;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-family:Georgia,serif;font-size:11px;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:#f5b942;">
                Andrés González Palacio
              </p>
              <p style="margin:6px 0 0;font-family:Georgia,serif;font-size:20px;font-weight:700;color:#faf7f2;letter-spacing:-0.01em;">
                El problema no son las pantallas.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="email-body" style="padding:40px 48px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0ebe0;padding:20px 40px;border-top:1px solid rgba(0,0,0,0.06);">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="text-align:center;padding-bottom:12px;">
                    <p style="margin:0;font-family:Georgia,serif;font-size:12px;color:rgba(26,26,46,0.45);">
                      ¿Ya compraste el libro?
                      <a href="${buyerLink(email)}" style="color:#a07c30;text-decoration:underline;">
                        Haz clic aquí →
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:rgba(26,26,46,0.3);line-height:1.6;">
                      Recibiste este email porque te suscribiste en raisingwithsense.com<br/>
                      <a href="${SITE_URL}/api/mark-as-buyer?e=${encodeURIComponent(email)}&unsub=1"
                         style="color:rgba(26,26,46,0.35);text-decoration:underline;">
                        Cancelar suscripción
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Paragraph helper ────────────────────────────────────────────
function p(text, extra = '') {
  return `<p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;color:#1a1a2e;line-height:1.8;${extra}">${text}</p>`;
}

function pullquote(text) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;">
    <tr>
      <td style="border-left:3px solid #f5b942;padding:12px 20px;background:rgba(245,185,66,0.06);border-radius:0 8px 8px 0;">
        <p style="margin:0;font-family:Georgia,serif;font-size:18px;font-style:italic;color:#3a2e00;line-height:1.65;">${text}</p>
      </td>
    </tr>
  </table>`;
}

function cta(label) {
  return `<p style="margin:28px 0 8px;font-family:Georgia,serif;font-size:16px;font-weight:700;color:#1a1a2e;">${label}</p>`;
}

// ── Email 1 — Immediate ─────────────────────────────────────────
export function email1(email) {
  const body = `
    ${p('Ya empezaste.', 'font-size:22px;font-weight:700;color:#0d0d1a;')}
    ${p('Y eso ya dice algo.')}
    ${p('No porque leíste un capítulo, sino porque algo de lo que viste ahí te hizo sentido.')}
    ${p('La mayoría de personas no llega hasta ese punto.<br/>Prefieren quedarse con la versión cómoda:<br/><em style="color:#a07c30">"las pantallas son el problema".</em>')}
    ${p('Pero ya viste que no es así.')}
    ${p('Y si sigues leyendo, lo que viene no es más de lo mismo.<br/>Es donde empieza a cambiar la forma en la que entiendes todo esto.')}
    ${divider()}
    ${cta('👉 Leer el libro completo en:')}
    ${storeButtons()}
    ${divider()}
    ${p('Esto no es un libro para terminarlo por terminarlo.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
    ${p('Es un libro que te cambia la forma en la que ves lo que está pasando.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
  `;
  return {
    subject: 'Ya empezaste. Y eso ya dice algo.',
    preheader: 'Algo de lo que viste en ese capítulo te hizo sentido. Sigue.',
    html: emailWrapper({ preheader: 'Algo de lo que viste en ese capítulo te hizo sentido. Sigue.', body, email }),
    text: `Ya empezaste. Y eso ya dice algo.

Y eso ya dice algo.

No porque leíste un capítulo, sino porque algo de lo que viste ahí te hizo sentido.

La mayoría de personas no llega hasta ese punto. Prefieren quedarse con la versión cómoda: "las pantallas son el problema".

Pero ya viste que no es así.

Y si sigues leyendo, lo que viene no es más de lo mismo. Es donde empieza a cambiar la forma en la que entiendes todo esto.

—

Leer el libro completo:
${AMAZON_URL}
${GPLAY_URL}
${APPLE_URL}

—

Esto no es un libro para terminarlo por terminarlo. Es un libro que te cambia la forma en la que ves lo que está pasando.

Andrés González Palacio`,
  };
}

// ── Email 2 — t+1 día ──────────────────────────────────────────
export function email2(email) {
  const body = `
    ${p('La mayoría de padres comete el mismo error.', 'font-size:22px;font-weight:700;color:#0d0d1a;')}
    ${p('Miden el problema en horas.')}
    ${pullquote('¿Cuánto tiempo?<br/>¿Cuántas pantallas?<br/>¿Cuánto debería reducir?')}
    ${p('Pero ese no es el problema.')}
    ${p('Puedes reducir el tiempo…<br/>y aun así no estar formando nada importante.')}
    ${p('Puedes controlar…<br/>y aun así perder lo esencial.')}
    ${divider()}
    ${p('El problema no es cuánto tiempo pasa frente a una pantalla.', 'font-weight:700;color:#0d0d1a;')}
    ${p('Es qué está pasando mientras está ahí.')}
    ${p('Y eso casi nadie lo está viendo.')}
    ${divider()}
    ${cta('👉 Seguir leyendo el libro en:')}
    ${storeButtons()}
    ${divider()}
    ${p('Si no cambias eso, no importa cuánto limites.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
    ${p('Vas a llegar al mismo resultado.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
  `;
  return {
    subject: 'La mayoría de padres comete el mismo error.',
    preheader: 'No es cuánto tiempo. Es qué está pasando mientras está ahí.',
    html: emailWrapper({ preheader: 'No es cuánto tiempo. Es qué está pasando mientras está ahí.', body, email }),
    text: `La mayoría de padres comete el mismo error.

Miden el problema en horas.

¿Cuánto tiempo? ¿Cuántas pantallas? ¿Cuánto debería reducir?

Pero ese no es el problema.

Puedes reducir el tiempo y aun así no estar formando nada importante. Puedes controlar y aun así perder lo esencial.

El problema no es cuánto tiempo pasa frente a una pantalla. Es qué está pasando mientras está ahí.

Y eso casi nadie lo está viendo.

—

Seguir leyendo:
${AMAZON_URL}
${GPLAY_URL}
${APPLE_URL}

Andrés González Palacio`,
  };
}

// ── Email 3 — t+2 días ─────────────────────────────────────────
export function email3(email) {
  const body = `
    ${p('Si el capítulo te incomodó un poco…', 'font-size:22px;font-weight:700;color:#0d0d1a;')}
    ${p('es buena señal.')}
    ${p('Porque este libro no está diseñado para validar lo que ya piensas.')}
    ${p('Está diseñado para cuestionarlo.')}
    ${divider()}
    ${p('No para decirte que lo estás haciendo mal.')}
    ${p('Sino para mostrarte que tal vez estás viendo el problema desde el ángulo equivocado.')}
    ${pullquote('Y cuando cambias el ángulo…<br/>todo cambia.')}
    ${cta('👉 Leer el libro completo en:')}
    ${storeButtons()}
    ${divider()}
    ${p('No necesitas más reglas.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
    ${p('Necesitas ver mejor.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
  `;
  return {
    subject: 'Si el capítulo te incomodó un poco… es buena señal.',
    preheader: 'Este libro no está diseñado para validar lo que ya piensas.',
    html: emailWrapper({ preheader: 'Este libro no está diseñado para validar lo que ya piensas.', body, email }),
    text: `Si el capítulo te incomodó un poco… es buena señal.

Porque este libro no está diseñado para validar lo que ya piensas.

Está diseñado para cuestionarlo.

No para decirte que lo estás haciendo mal. Sino para mostrarte que tal vez estás viendo el problema desde el ángulo equivocado.

Y cuando cambias el ángulo… todo cambia.

—

Leer el libro completo:
${AMAZON_URL}
${GPLAY_URL}
${APPLE_URL}

Andrés González Palacio`,
  };
}

// ── Email 4 — t+4 días ─────────────────────────────────────────
export function email4(email) {
  const body = `
    ${p('Esto no es algo que se rompe de un día para otro.', 'font-size:22px;font-weight:700;color:#0d0d1a;')}
    ${p('No es evidente.<br/>No es escandaloso.')}
    ${p('Por eso pasa desapercibido.')}
    ${divider()}
    ${p('Pero con el tiempo, se acumula.')}
    ${pullquote('Decisiones que no toman.<br/>Criterio que no se forma.<br/>Dependencia que crece.')}
    ${p('Y cuando lo notas…<br/>ya es tarde para hacerlo fácil.')}
    ${p('Por eso este momento importa más de lo que parece.')}
    ${divider()}
    ${cta('👉 Leer el libro completo en:')}
    ${storeButtons()}
    ${divider()}
    ${p('No es urgencia artificial.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
    ${p('Es que hay cosas que solo se construyen a tiempo.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
  `;
  return {
    subject: 'Esto no es algo que se rompe de un día para otro.',
    preheader: 'Decisiones que no toman. Criterio que no se forma. Dependencia que crece.',
    html: emailWrapper({ preheader: 'Decisiones que no toman. Criterio que no se forma. Dependencia que crece.', body, email }),
    text: `Esto no es algo que se rompe de un día para otro.

No es evidente. No es escandaloso. Por eso pasa desapercibido.

Pero con el tiempo, se acumula.

Decisiones que no toman. Criterio que no se forma. Dependencia que crece.

Y cuando lo notas… ya es tarde para hacerlo fácil.

Por eso este momento importa más de lo que parece.

No es urgencia artificial. Es que hay cosas que solo se construyen a tiempo.

—

Leer el libro completo:
${AMAZON_URL}
${GPLAY_URL}
${APPLE_URL}

Andrés González Palacio`,
  };
}

// ── Email 5 — t+6 días ─────────────────────────────────────────
export function email5(email) {
  const body = `
    ${p('No te voy a llenar la bandeja de entrada.', 'font-size:22px;font-weight:700;color:#0d0d1a;')}
    ${p('Ni intentar convencerte con más correos.')}
    ${p('Si llegaste hasta aquí, ya sabes suficiente.')}
    ${divider()}
    ${p('Ya viste que el problema no es la pantalla.')}
    ${p('Y también sabes que ignorarlo no lo va a resolver.')}
    ${pullquote('El resto ya no es información.<br/>Es decisión.')}
    ${cta('👉 Leer el libro completo en:')}
    ${storeButtons()}
    ${divider()}
    ${p('Si no lo haces ahora, probablemente lo pospongas.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
    ${p('Y este tipo de cosas…<br/>no suelen resolverse solas.', 'font-style:italic;color:rgba(26,26,46,0.65);font-size:15px;')}
  `;
  return {
    subject: 'No te voy a llenar la bandeja de entrada.',
    preheader: 'Si llegaste hasta aquí, ya sabes suficiente. El resto es decisión.',
    html: emailWrapper({ preheader: 'Si llegaste hasta aquí, ya sabes suficiente. El resto es decisión.', body, email }),
    text: `No te voy a llenar la bandeja de entrada.

Ni intentar convencerte con más correos.

Si llegaste hasta aquí, ya sabes suficiente.

Ya viste que el problema no es la pantalla. Y también sabes que ignorarlo no lo va a resolver.

El resto ya no es información. Es decisión.

—

Leer el libro completo:
${AMAZON_URL}
${GPLAY_URL}
${APPLE_URL}

Si no lo haces ahora, probablemente lo pospongas. Y este tipo de cosas… no suelen resolverse solas.

Andrés González Palacio`,
  };
}
