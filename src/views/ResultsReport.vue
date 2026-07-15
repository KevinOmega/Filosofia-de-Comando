<script setup>
import { computed, ref } from 'vue'
import { panelRows, questionInfo, dimensionOrder, questionColumnIndex } from '../data/panelResults.js'

const N = panelRows.length
const isExporting = ref(false)
const questionIds = Object.keys(questionColumnIndex).sort(
  (a, b) => Number(a.slice(1)) - Number(b.slice(1))
)

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length
}
function fmt1(n) {
  return n.toFixed(2)
}
function qValues(qid) {
  const idx = questionColumnIndex[qid]
  return panelRows.map((row) => row[idx])
}
function band(v) {
  if (v <= 1.8) return 'Muy bajo'
  if (v <= 2.6) return 'Bajo'
  if (v <= 3.4) return 'Medio'
  if (v <= 4.2) return 'Alto'
  return 'Muy alto'
}

const qMeans = computed(() => {
  const out = {}
  questionIds.forEach((qid) => {
    out[qid] = mean(qValues(qid))
  })
  return out
})

const dimMeans = computed(() => {
  const out = {}
  dimensionOrder.forEach((dim) => {
    const qs = questionIds.filter((q) => questionInfo[q].dim === dim)
    let vals = []
    qs.forEach((q) => {
      vals = vals.concat(qValues(q))
    })
    out[dim] = mean(vals)
  })
  return out
})

const overall = computed(() => mean(Object.values(qMeans.value)))
const maxDim = computed(() =>
  dimensionOrder.reduce((a, b) => (dimMeans.value[a] > dimMeans.value[b] ? a : b))
)
const minDim = computed(() =>
  dimensionOrder.reduce((a, b) => (dimMeans.value[a] < dimMeans.value[b] ? a : b))
)

const statTiles = computed(() => [
  { label: 'Oficiales en el panel', value: String(N), sub: 'respuestas analizadas' },
  {
    label: 'Media general',
    value: fmt1(overall.value),
    sub: `${band(overall.value)} (escala 1–5)`,
    cls: overall.value >= 3.4 ? 'good' : '',
  },
  { label: 'Dimensión más alta', value: fmt1(dimMeans.value[maxDim.value]), sub: maxDim.value, cls: 'good' },
  { label: 'Dimensión más baja', value: fmt1(dimMeans.value[minDim.value]), sub: minDim.value, cls: 'crit' },
])

const dimChartRows = computed(() =>
  dimensionOrder.map((dim) => ({ dim, val: dimMeans.value[dim] }))
)

const qChartGroups = computed(() =>
  dimensionOrder.map((dim) => ({
    dim,
    rows: questionIds
      .filter((q) => questionInfo[q].dim === dim)
      .map((qid) => ({ qid, text: questionInfo[qid].text, val: qMeans.value[qid] })),
  }))
)

const seqStep = { 1: 'var(--seq-250)', 2: 'var(--seq-350)', 3: 'var(--seq-450)', 4: 'var(--seq-550)', 5: 'var(--seq-650)' }

const distRows = computed(() =>
  questionIds.map((qid) => {
    const vals = qValues(qid)
    const counts = [1, 2, 3, 4, 5].map((v) => vals.filter((x) => x === v).length)
    return {
      qid,
      text: questionInfo[qid].text,
      segments: counts.map((c, i) => ({ level: i + 1, count: c, pct: (c / N) * 100 })).filter((s) => s.count > 0),
    }
  })
)

const tableRows = computed(() =>
  panelRows.map((row) => {
    const vals = questionIds.map((q) => row[questionColumnIndex[q]])
    return {
      grado: row[0],
      arma: row[1],
      nombre: row[2],
      vals,
      avg: mean(vals),
    }
  })
)

function styleHeaderRow(row) {
  row.font = { bold: true }
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0EFEC' } }
  })
}

async function downloadExcel() {
  if (isExporting.value) return
  isExporting.value = true
  try {
    await buildAndDownloadWorkbook()
  } finally {
    isExporting.value = false
  }
}

async function buildAndDownloadWorkbook() {
  const [{ default: ExcelJS }, { drawHBarChart, drawDistributionChart, dataUrlToBase64 }] = await Promise.all([
    import('exceljs'),
    import('../utils/chartImages.js'),
  ])

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Encuesta · Filosofía de Mando Tipo Misión'

  // ---- Detalle ----
  const wsDetalle = wb.addWorksheet('Detalle')
  const detalleHeader = ['Grado', 'Arma', 'Nombre completo', ...questionIds.map((q) => q.toUpperCase()), 'Promedio']
  styleHeaderRow(wsDetalle.addRow(detalleHeader))
  tableRows.value.forEach((r) => {
    wsDetalle.addRow([r.grado, r.arma, r.nombre, ...r.vals, Number(fmt1(r.avg))])
  })
  wsDetalle.columns.forEach((col, i) => {
    col.width = i === 2 ? 32 : i < 2 ? 16 : 9
  })

  // ---- Preguntas ----
  const wsPreguntas = wb.addWorksheet('Preguntas')
  styleHeaderRow(
    wsPreguntas.addRow(['Pregunta', 'Dimensión', 'Texto', 'Promedio', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'])
  )
  distRows.value.forEach((d) => {
    const counts = [1, 2, 3, 4, 5].map((lvl) => d.segments.find((s) => s.level === lvl)?.count ?? 0)
    wsPreguntas.addRow([d.qid.toUpperCase(), questionInfo[d.qid].dim, d.text, Number(fmt1(qMeans.value[d.qid])), ...counts])
  })
  wsPreguntas.columns.forEach((col, i) => {
    col.width = i === 2 ? 48 : i === 1 ? 20 : 12
  })

  // ---- Dimensiones ----
  const wsDimensiones = wb.addWorksheet('Dimensiones')
  styleHeaderRow(wsDimensiones.addRow(['Dimensión', 'Promedio']))
  dimChartRows.value.forEach((r) => wsDimensiones.addRow([r.dim, Number(fmt1(r.val))]))
  wsDimensiones.columns.forEach((col) => {
    col.width = 22
  })

  // ---- Gráficos (imágenes) ----
  const dimImg = drawHBarChart({
    title: 'Promedio por dimensión',
    rows: dimChartRows.value.map((r) => ({ label: r.dim, value: r.val })),
    barColor: '#256abf',
  })
  const qImg = drawHBarChart({
    title: 'Promedio por pregunta',
    rows: qChartGroups.value.flatMap((g) =>
      g.rows.map((r) => ({ label: `${r.qid.toUpperCase()} · ${r.text}`, value: r.val, group: g.dim }))
    ),
  })
  const distImg = drawDistributionChart({
    title: 'Distribución de respuestas por pregunta',
    rows: distRows.value.map((d) => ({ label: `${d.qid.toUpperCase()} · ${d.text}`, segments: d.segments })),
  })

  const wsGraficos = wb.addWorksheet('Gráficos')
  let imgId = wb.addImage({ base64: dataUrlToBase64(dimImg.dataUrl), extension: 'png' })
  wsGraficos.addImage(imgId, { tl: { col: 0, row: 0 }, ext: { width: dimImg.width, height: dimImg.height } })

  let nextRow = Math.ceil(dimImg.height / 20) + 2
  imgId = wb.addImage({ base64: dataUrlToBase64(qImg.dataUrl), extension: 'png' })
  wsGraficos.addImage(imgId, { tl: { col: 0, row: nextRow }, ext: { width: qImg.width, height: qImg.height } })

  nextRow += Math.ceil(qImg.height / 20) + 2
  imgId = wb.addImage({ base64: dataUrlToBase64(distImg.dataUrl), extension: 'png' })
  wsGraficos.addImage(imgId, { tl: { col: 0, row: nextRow }, ext: { width: distImg.width, height: distImg.height } })

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'reporte-panel-mando-mision.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="viz-root">
    <div class="wrap">
      <header class="page-head">
        <div class="page-head__row">
          <div>
            <p class="eyebrow">Encuesta · Filosofía de Mando Tipo Misión — Ejército de Bolivia</p>
            <h1>Reporte de panel: 30 oficiales seleccionados</h1>
            <p class="subtitle">Escala de todas las preguntas: 1 (más bajo) a 5 (más alto).</p>
          </div>
          <button type="button" class="download-btn" :disabled="isExporting" @click="downloadExcel">
            {{ isExporting ? 'Generando...' : 'Descargar Excel' }}
          </button>
        </div>
      </header>

      <div class="stat-row">
        <div v-for="s in statTiles" :key="s.label" class="stat-tile">
          <div class="label">{{ s.label }}</div>
          <div class="value" :class="s.cls">{{ s.value }}</div>
          <div class="sub">{{ s.sub }}</div>
        </div>
      </div>

      <section class="card">
        <h2>Promedio por dimensión</h2>
        <p class="card-note">
          Media aritmética de las preguntas que componen cada dimensión del instrumento, sobre los
          {{ N }} oficiales del panel.
        </p>
        <div class="hbar-row dim-row" v-for="r in dimChartRows" :key="r.dim">
          <div class="hbar-label">{{ r.dim }}</div>
          <div class="hbar-track">
            <div class="hbar-fill dim-fill" :style="{ width: (r.val / 5) * 100 + '%' }" />
          </div>
          <div class="hbar-value">{{ fmt1(r.val) }}</div>
        </div>
      </section>

      <section class="card">
        <h2>Promedio por pregunta</h2>
        <p class="card-note">Agrupado por dimensión, en el orden del instrumento original.</p>
        <div class="hbar-group" v-for="g in qChartGroups" :key="g.dim">
          <p class="hbar-group-title">{{ g.dim }}</p>
          <div class="hbar-row" v-for="r in g.rows" :key="r.qid">
            <div class="hbar-label"><span class="qid">{{ r.qid.toUpperCase() }}</span>{{ r.text }}</div>
            <div class="hbar-track">
              <div class="hbar-fill" :style="{ width: (r.val / 5) * 100 + '%' }" />
            </div>
            <div class="hbar-value">{{ fmt1(r.val) }}</div>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Distribución de respuestas por pregunta</h2>
        <p class="card-note">Proporción de oficiales que marcó cada nivel de la escala (1–5) en cada pregunta.</p>
        <div class="dist-row" v-for="r in distRows" :key="r.qid">
          <div class="dist-label"><strong>{{ r.qid.toUpperCase() }}</strong> · {{ r.text }}</div>
          <div class="dist-track">
            <div
              v-for="s in r.segments"
              :key="s.level"
              class="dist-seg"
              :style="{ width: s.pct + '%', background: seqStep[s.level] }"
              :title="`Nivel ${s.level}: ${s.count} de ${N}`"
            />
          </div>
        </div>
        <div class="dist-legend">
          <span class="item" v-for="v in [1, 2, 3, 4, 5]" :key="v">
            <span class="swatch" :style="{ background: seqStep[v] }" />Nivel {{ v }}
          </span>
        </div>
      </section>

      <section class="card">
        <h2>Detalle por oficial</h2>
        <p class="card-note">
          Respuestas individuales de los {{ N }} oficiales del panel.
          <span class="scale-badge">Prom. = promedio de las 12 preguntas</span>
        </p>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Grado</th>
                <th>Arma</th>
                <th>Nombre completo</th>
                <th v-for="qid in questionIds" :key="qid">{{ qid.toUpperCase() }}</th>
                <th>Prom.</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in tableRows" :key="r.nombre">
                <td>{{ r.grado }}</td>
                <td>{{ r.arma }}</td>
                <td class="name">{{ r.nombre }}</td>
                <td class="num" v-for="(v, i) in r.vals" :key="i">{{ v }}</td>
                <td class="num avg">{{ fmt1(r.avg) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.viz-root {
  --surface-1: #ffffff;
  --surface-page: #ffffff;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --text-muted: #898781;
  --gridline: #e1e0d9;
  --border: rgba(11, 11, 11, 0.1);
  --seq-250: #86b6ef;
  --seq-350: #5598e7;
  --seq-450: #2a78d6;
  --seq-500: #256abf;
  --seq-550: #1c5cab;
  --seq-650: #104281;
  --status-good: #0ca30c;
  --status-critical: #d03b3b;

  color-scheme: light;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: var(--surface-page);
  color: var(--text-primary);
  min-height: 100dvh;
  padding: 28px 16px 60px;
}

.wrap {
  max-width: 1040px;
  margin: 0 auto;
}

.page-head {
  margin-bottom: 28px;
}
.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 8px;
}
h1 {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  margin: 0 0 8px;
  line-height: 1.25;
}
.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  max-width: 68ch;
  line-height: 1.5;
  margin: 0;
}

.page-head__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.download-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--seq-450);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.download-btn:hover {
  opacity: 0.88;
}
.download-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}
.download-btn:active {
  opacity: 0.75;
}

.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px 20px;
  margin-bottom: 20px;
}
.card h2 {
  font-size: 1.05rem;
  margin: 0 0 4px;
}
.card .card-note {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin: 0 0 18px;
  line-height: 1.5;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}
.stat-tile {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 16px 14px;
}
.stat-tile .label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.stat-tile .value {
  font-size: 1.7rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}
.stat-tile .sub {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 4px;
}
.stat-tile .value.good {
  color: var(--status-good);
}
.stat-tile .value.crit {
  color: var(--status-critical);
}

.hbar-group {
  margin-bottom: 22px;
}
.hbar-group:last-child {
  margin-bottom: 0;
}
.hbar-group-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 8px;
  padding-top: 10px;
  border-top: 1px solid var(--gridline);
}
.hbar-group:first-child .hbar-group-title {
  border-top: none;
  padding-top: 0;
}
.hbar-row {
  display: grid;
  grid-template-columns: 230px 1fr 44px;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}
.hbar-row .hbar-label {
  font-size: 0.82rem;
  color: var(--text-primary);
  line-height: 1.3;
}
.hbar-row .hbar-label .qid {
  color: var(--text-muted);
  font-weight: 700;
  margin-right: 5px;
}
.hbar-track {
  position: relative;
  height: 14px;
  background: var(--gridline);
  border-radius: 4px;
  overflow: hidden;
}
.hbar-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--seq-450);
}
.hbar-row .hbar-value {
  font-size: 0.82rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: var(--text-secondary);
}
.dim-row {
  grid-template-columns: 190px 1fr 44px;
}
.dim-fill {
  background: var(--seq-500);
}

.dist-row {
  display: grid;
  grid-template-columns: 230px 1fr;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}
.dist-row .dist-label {
  font-size: 0.78rem;
  color: var(--text-secondary);
}
.dist-track {
  display: flex;
  height: 12px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--gridline);
}
.dist-seg {
  height: 100%;
}
.dist-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 14px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.dist-legend .item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dist-legend .swatch {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}

.table-scroll {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 12px;
}
table.data-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 920px;
  font-size: 0.78rem;
}
table.data-table th,
table.data-table td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid var(--gridline);
  white-space: nowrap;
}
table.data-table th {
  position: sticky;
  top: 0;
  background: var(--surface-1);
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.66rem;
  letter-spacing: 0.03em;
}
table.data-table td.num {
  text-align: center;
  font-variant-numeric: tabular-nums;
}
table.data-table td.name {
  white-space: normal;
  min-width: 220px;
}
table.data-table td.avg {
  font-weight: 700;
}
table.data-table tbody tr:nth-child(even) {
  background: color-mix(in srgb, var(--text-primary) 3%, transparent);
}

.notes {
  margin-top: 26px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.6;
}
.notes h3 {
  font-size: 0.85rem;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.notes ul {
  margin: 0;
  padding-left: 18px;
}
.notes li {
  margin-bottom: 4px;
}

.scale-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 700;
  background: color-mix(in srgb, var(--seq-450) 16%, transparent);
  color: var(--seq-450);
}
</style>
