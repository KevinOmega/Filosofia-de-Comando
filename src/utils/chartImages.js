// ---------------------------------------------------------------------------
// Dibuja los gráficos del reporte en un <canvas> fuera de pantalla para
// poder incrustarlos como imagen en el Excel exportado (la versión gratuita
// de las librerías de Excel para JS no soporta gráficos nativos editables).
// ---------------------------------------------------------------------------

const COLORS = {
  bar: '#2a78d6',
  barDim: '#256abf',
  track: '#e1e0d9',
  text: '#0b0b0b',
  muted: '#898781',
  groupTitle: '#6b6a64',
  white: '#ffffff',
  seq: { 1: '#86b6ef', 2: '#5598e7', 3: '#2a78d6', 4: '#1c5cab', 5: '#104281' },
}

function makeCanvas(width, height) {
  const canvas = document.createElement('canvas')
  const dpr = 2 // exporta a 2x para que se vea nítido en Excel
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.fillStyle = COLORS.white
  ctx.fillRect(0, 0, width, height)
  ctx.textBaseline = 'middle'
  return { canvas, ctx, width, height }
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, h / 2, Math.max(w, 0) / 2)
  ctx.beginPath()
  if (w <= 0) return
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

/**
 * rows: [{ label, value, group? }] — filas consecutivas con el mismo `group`
 * quedan agrupadas bajo un título de sección.
 */
export function drawHBarChart({ title, rows, maxValue = 5, barColor = COLORS.bar, width = 860 }) {
  const rowH = 34
  const groupTitleH = 26
  const labelColW = 300
  const valueColW = 50
  const padding = { top: title ? 50 : 16, bottom: 16, left: 16, right: 16 }
  const trackX = padding.left + labelColW
  const trackW = width - padding.left - padding.right - labelColW - valueColW

  let groups
  if (rows.some((r) => r.group)) {
    groups = []
    let lastGroup
    rows.forEach((r) => {
      if (groups.length === 0 || r.group !== lastGroup) {
        groups.push({ title: r.group, rows: [] })
        lastGroup = r.group
      }
      groups[groups.length - 1].rows.push(r)
    })
  } else {
    groups = [{ title: null, rows }]
  }

  const height =
    padding.top +
    padding.bottom +
    groups.reduce((acc, g) => acc + (g.title ? groupTitleH : 0) + g.rows.length * rowH, 0)

  const { canvas, ctx } = makeCanvas(width, height)

  if (title) {
    ctx.fillStyle = COLORS.text
    ctx.font = '700 18px system-ui, sans-serif'
    ctx.fillText(title, padding.left, 28)
  }

  let y = padding.top
  groups.forEach((g) => {
    if (g.title) {
      ctx.fillStyle = COLORS.groupTitle
      ctx.font = '700 12px system-ui, sans-serif'
      ctx.fillText(g.title.toUpperCase(), padding.left, y + groupTitleH / 2)
      y += groupTitleH
    }
    g.rows.forEach((r) => {
      const cy = y + rowH / 2
      ctx.fillStyle = COLORS.text
      ctx.font = '400 13px system-ui, sans-serif'
      wrapText(ctx, r.label, padding.left, cy, labelColW - 12, 15)

      ctx.fillStyle = COLORS.track
      roundRect(ctx, trackX, cy - 6, trackW, 12, 4)
      ctx.fill()

      ctx.fillStyle = barColor
      const w = Math.max(0, (r.value / maxValue) * trackW)
      roundRect(ctx, trackX, cy - 6, w, 12, 4)
      ctx.fill()

      ctx.fillStyle = COLORS.muted
      ctx.font = '700 13px system-ui, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(r.value.toFixed(2), trackX + trackW + valueColW - 4, cy)
      ctx.textAlign = 'left'

      y += rowH
    })
  })

  return { dataUrl: canvas.toDataURL('image/png'), width, height }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  const lines = []
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  })
  if (line) lines.push(line)
  const startY = y - ((lines.length - 1) * lineHeight) / 2
  lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}

/**
 * rows: [{ label, segments: [{ level, pct }] }]
 */
export function drawDistributionChart({ title, rows, width = 860 }) {
  const rowH = 34
  const labelColW = 300
  const padding = { top: title ? 50 : 16, bottom: 40, left: 16, right: 16 }
  const trackX = padding.left + labelColW
  const trackW = width - padding.left - padding.right - labelColW
  const height = padding.top + padding.bottom + rows.length * rowH

  const { canvas, ctx } = makeCanvas(width, height)

  if (title) {
    ctx.fillStyle = COLORS.text
    ctx.font = '700 18px system-ui, sans-serif'
    ctx.fillText(title, padding.left, 28)
  }

  let y = padding.top
  rows.forEach((r) => {
    const cy = y + rowH / 2
    ctx.fillStyle = COLORS.text
    ctx.font = '400 13px system-ui, sans-serif'
    wrapText(ctx, r.label, padding.left, cy, labelColW - 12, 15)

    let x = trackX
    r.segments.forEach((s) => {
      const w = (s.pct / 100) * trackW
      ctx.fillStyle = COLORS.seq[s.level]
      ctx.fillRect(x, cy - 6, w, 12)
      x += w
    })

    y += rowH
  })

  // leyenda
  let lx = trackX
  const ly = y + 18
  ;[1, 2, 3, 4, 5].forEach((lvl) => {
    ctx.fillStyle = COLORS.seq[lvl]
    ctx.fillRect(lx, ly - 6, 10, 10)
    ctx.fillStyle = COLORS.muted
    ctx.font = '400 12px system-ui, sans-serif'
    ctx.fillText(`Nivel ${lvl}`, lx + 16, ly)
    lx += 80
  })

  return { dataUrl: canvas.toDataURL('image/png'), width, height }
}

/** Convierte un dataURL PNG a base64 puro (sin el prefijo data:) para ExcelJS. */
export function dataUrlToBase64(dataUrl) {
  return dataUrl.split(',')[1]
}
