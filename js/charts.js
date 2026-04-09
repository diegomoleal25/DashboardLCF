/* ═══════════════════════════════════════════════════
   FUNDAMITO DASHBOARD · charts.js
   Inicializa todas las gráficas con Chart.js 4.x
   Depende de: Chart.js (cargado antes en index.html)
═══════════════════════════════════════════════════ */

/* ─── Configuración global de Chart.js ───────────── */
const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
const labelColor = isDark ? '#aaa' : '#6b6b6b';

Chart.defaults.font.family = "'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif";
Chart.defaults.font.size = 12;

/* ─── Paleta de colores ───────────────────────────── */
const COLORS = {
  blue:   '#185FA5',
  teal:   '#1D9E75',
  amber:  '#BA7517',
  purple: '#7F77DD',
  purpleLight: '#AFA9EC',
};

/* ─── Opciones de escala reutilizables ────────────── */
const scaleX = (stacked = false) => ({
  stacked,
  ticks: { color: labelColor },
  grid: { display: false },
});

const scaleY = (stacked = false) => ({
  stacked,
  beginAtZero: true,
  ticks: { color: labelColor },
  grid: { color: gridColor },
});

/* ═══════════════════════════════════════════════════
   GRÁFICA 1 · Crecimiento + tendencia (tab Resumen)
═══════════════════════════════════════════════════ */
new Chart(document.getElementById('chartMain'), {
  type: 'bar',
  data: {
    labels: ['2024', '2025', '2026'],
    datasets: [
      {
        label: 'Alumnos',
        data: [157, 387, null],
        backgroundColor: COLORS.blue,
        stack: 's',
        order: 2,
      },
      {
        label: 'Docentes',
        data: [6, 20, null],
        backgroundColor: COLORS.teal,
        stack: 's',
        order: 2,
      },
      {
        label: 'Escuelas',
        data: [1, 5, null],
        backgroundColor: COLORS.amber,
        stack: 's',
        order: 2,
      },
      {
        label: 'Tendencia total',
        type: 'line',
        data: [164, 412, 450],
        borderColor: COLORS.purple,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: COLORS.purple,
        tension: 0.35,
        order: 1,
        segment: {
          borderDash: ctx => ctx.p1DataIndex >= 1 ? [6, 4] : undefined,
          borderColor: ctx => ctx.p1DataIndex >= 1 ? COLORS.purpleLight : COLORS.purple,
        },
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' },
    },
    scales: {
      x: scaleX(true),
      y: scaleY(true),
    },
  },
});

/* ═══════════════════════════════════════════════════
   GRÁFICA 2 · Comparativa por año (tab Resumen)
═══════════════════════════════════════════════════ */
new Chart(document.getElementById('chartComp'), {
  type: 'bar',
  data: {
    labels: ['2024', '2025', '2026 (proy.)'],
    datasets: [
      { label: 'Alumnos',  data: [157, 387, 420], backgroundColor: COLORS.blue },
      { label: 'Docentes', data: [6,   20,  25],  backgroundColor: COLORS.teal },
      { label: 'Escuelas', data: [1,   5,   5],   backgroundColor: COLORS.amber },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' },
    },
    scales: {
      x: scaleX(),
      y: scaleY(),
    },
  },
});

/* ═══════════════════════════════════════════════════
   GRÁFICA 3 · Donut distribución (tab Histórico)
═══════════════════════════════════════════════════ */
new Chart(document.getElementById('chartDonut'), {
  type: 'doughnut',
  data: {
    labels: ['Alumnos (544)', 'Docentes (26)', 'Escuelas (6)'],
    datasets: [{
      data: [544, 26, 6],
      backgroundColor: [COLORS.blue, COLORS.teal, COLORS.amber],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: { legend: { display: false } },
  },
});

/* ═══════════════════════════════════════════════════
   GRÁFICA 4 · Proyección (tab Proyección)
   Se exporta como `projChart` para que dashboard.js
   pueda actualizarla desde los sliders.
═══════════════════════════════════════════════════ */
window.projChart = new Chart(document.getElementById('chartProj'), {
  type: 'line',
  data: {
    labels: ['2024', '2025', '2026'],
    datasets: [
      {
        label: 'Histórico real',
        data: [164, 412, null],
        borderColor: COLORS.blue,
        backgroundColor: 'rgba(24,95,165,0.08)',
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: COLORS.blue,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Proyección 2026',
        data: [null, 412, 450],
        borderColor: COLORS.purple,
        backgroundColor: 'rgba(127,119,221,0.06)',
        borderWidth: 2.5,
        borderDash: [7, 4],
        pointRadius: [0, 0, 6],
        pointBackgroundColor: COLORS.purple,
        tension: 0.3,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: scaleX(),
      y: scaleY(),
    },
  },
});
