/* ═══════════════════════════════════════════════════
   FUNDAMITO DASHBOARD · dashboard.js
   Maneja: cambio de tabs + simulador de proyección
   Depende de: charts.js (window.projChart disponible)
═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   TABS · Mostrar / ocultar secciones
═══════════════════════════════════════════════════ */

/**
 * Cambia la pestaña visible del dashboard.
 * @param {string} id   - ID del tab sin prefijo: 'resumen' | 'historico' | 'proyeccion'
 * @param {HTMLElement} btn - Botón que disparó el evento
 */
function switchTab(id, btn) {
  const tabs = ['resumen', 'historico', 'proyeccion'];

  // Ocultar todos los tabs
  tabs.forEach(tabId => {
    const el = document.getElementById('tab-' + tabId);
    if (el) el.style.display = 'none';
  });

  // Mostrar el tab seleccionado
  const active = document.getElementById('tab-' + id);
  if (active) active.style.display = 'block';

  // Actualizar estado visual de los botones
  document.querySelectorAll('.dash-tabs .nav-link').forEach(b => {
    b.classList.remove('active');
  });
  btn.classList.add('active');
}

/* ═══════════════════════════════════════════════════
   SIMULADOR · Proyección 2026
═══════════════════════════════════════════════════ */

/**
 * Lee los valores de los sliders y actualiza:
 * - Etiquetas numéricas junto a cada slider
 * - Barra de progreso (alumnos vs meta 420)
 * - Tarjetas de métricas calculadas
 * - Gráfica de proyección (window.projChart)
 */
function updateProj() {
  // ── Leer valores de los sliders ─────────────────
  const alumnos  = parseInt(document.getElementById('s-alu').value, 10);
  const docentes = parseInt(document.getElementById('s-doc').value, 10);
  const escuelas = parseInt(document.getElementById('s-esc').value, 10);

  // ── Actualizar etiquetas de sliders ─────────────
  document.getElementById('v-alu').textContent = alumnos;
  document.getElementById('v-doc').textContent = docentes;
  document.getElementById('v-esc').textContent = escuelas;

  // ── Cálculos derivados ───────────────────────────
  const META_ALUMNOS  = 420;
  const BASE_2025     = 387;
  const TOTAL_2025    = 412;

  const totalParticipantes = alumnos + docentes + escuelas;
  const gap                = alumnos - META_ALUMNOS;
  const pct                = Math.min(Math.round((alumnos / META_ALUMNOS) * 100), 100);
  const crecimiento        = Math.round(((alumnos - BASE_2025) / BASE_2025) * 100);
  const ratio              = docentes > 0 ? (alumnos / docentes).toFixed(1) : '—';

  // ── Barra de progreso ────────────────────────────
  document.getElementById('p-pct-label').textContent = pct + '% · ' + alumnos + ' / ' + META_ALUMNOS;
  document.getElementById('target-bar').style.width  = pct + '%';
  document.getElementById('target-bar').style.background = gap < 0 ? '#D85A30' : '#185FA5';

  // ── Tarjetas de métricas ─────────────────────────
  document.getElementById('p-total').textContent = totalParticipantes;

  const gapEl = document.getElementById('p-gap');
  gapEl.textContent = gap === 0 ? '±0' : (gap > 0 ? '+' + gap : gap);
  gapEl.style.color = gap >= 0 ? '#1D9E75' : '#D85A30';

  document.getElementById('p-crec').textContent  = (crecimiento >= 0 ? '+' : '') + crecimiento + '%';
  document.getElementById('p-ratio').textContent = ratio;

  // ── Actualizar gráfica de proyección ─────────────
  if (window.projChart) {
    window.projChart.data.datasets[1].data = [null, TOTAL_2025, totalParticipantes];
    window.projChart.update();
  }
}

/* ═══════════════════════════════════════════════════
   TEMA · Toggle modo oscuro / claro
═══════════════════════════════════════════════════ */

function toggleTheme() {
  document.body.classList.toggle('dark');

  const btn = document.getElementById('themeBtn');
  btn.textContent = document.body.classList.contains('dark')
    ? 'Modo claro'
    : 'Modo oscuro';

  // Guardar preferencia para que persista al recargar la página
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

/* ═══════════════════════════════════════════════════
   INICIO · Leer preferencia guardada al cargar
═══════════════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('themeBtn').textContent = 'Modo claro';
  }
});