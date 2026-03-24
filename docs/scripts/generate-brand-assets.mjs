import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

const ASCII_LINES = [
  '██╗   ██╗ ██████╗ ██╗      ██████╗ ██████╗  ██████╗ ██╗  ██╗',
  '╚██╗ ██╔╝██╔═══██╗██║     ██╔═══██╗██╔══██╗██╔═══██╗╚██╗██╔╝',
  ' ╚████╔╝ ██║   ██║██║     ██║   ██║██████╔╝██║   ██║ ╚███╔╝ ',
  '  ╚██╔╝  ██║   ██║██║     ██║   ██║██╔══██╗██║   ██║ ██╔██╗ ',
  '   ██║   ╚██████╔╝███████╗╚██████╔╝██████╔╝╚██████╔╝██╔╝ ██╗',
  '   ╚═╝    ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝',
]

const LOGO_METRICS = {
  cell: 18,
  stroke: 4,
  padX: 52,
  padY: 42,
  radius: 30,
  shadowX: 10,
  shadowY: 10,
}

const LIGHT_THEME = {
  backgroundStart: '#FFF8EE',
  backgroundEnd: '#FDF1E2',
  border: '#F1D7B6',
  glow: '#FFB15A',
  shadow: '#E38B2A',
  fill: '#24160C',
}

const DARK_THEME = {
  backgroundStart: '#121218',
  backgroundEnd: '#09090B',
  border: '#FFFFFF',
  borderOpacity: 0.08,
  glow: '#FF8C00',
  shadow: '#7A2F00',
  fill: '#FF8C00',
}

const SOCIAL_CARD = {
  width: 1200,
  height: 630,
  radius: 32,
}

function buildRects(char, cell, stroke) {
  switch (char) {
    case '█':
      return [[0, 0, cell, cell]]
    case '═':
      return [[0, cell - stroke, cell, stroke]]
    case '║':
      return [[0, 0, stroke, cell]]
    case '╔':
      return [
        [0, 0, stroke, cell],
        [0, 0, cell, stroke],
      ]
    case '╗':
      return [
        [cell - stroke, 0, stroke, cell],
        [0, 0, cell, stroke],
      ]
    case '╚':
      return [
        [0, 0, stroke, cell],
        [0, cell - stroke, cell, stroke],
      ]
    case '╝':
      return [
        [cell - stroke, 0, stroke, cell],
        [0, cell - stroke, cell, stroke],
      ]
    default:
      return []
  }
}

function renderGlyphLayer({ lines, cell, stroke, offsetX, offsetY, fill }) {
  let svg = ''
  lines.forEach((line, row) => {
    Array.from(line).forEach((char, col) => {
      for (const [x, y, width, height] of buildRects(char, cell, stroke)) {
        svg += `<rect x="${offsetX + col * cell + x}" y="${offsetY + row * cell + y}" width="${width}" height="${height}" rx="1" fill="${fill}"/>`
      }
    })
  })
  return svg
}

function getLogoSize(metrics = LOGO_METRICS) {
  const columns = Math.max(...ASCII_LINES.map((line) => line.length))
  const artWidth = columns * metrics.cell
  const artHeight = ASCII_LINES.length * metrics.cell

  return {
    columns,
    artWidth,
    artHeight,
    width: artWidth + metrics.padX * 2 + metrics.shadowX,
    height: artHeight + metrics.padY * 2 + metrics.shadowY,
  }
}

function renderLogoSvg(theme, metrics = LOGO_METRICS) {
  const size = getLogoSize(metrics)
  const borderOpacity = theme.borderOpacity ?? 1
  const artX = metrics.padX
  const artY = metrics.padY
  const glowCx = size.width / 2
  const glowCy = size.height / 2

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" role="img" aria-labelledby="title desc">
  <title id="title">yolobox logo</title>
  <desc id="desc">The yolobox name rendered from its block ASCII wordmark.</desc>
  <defs>
    <linearGradient id="logo-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.backgroundStart}"/>
      <stop offset="100%" stop-color="${theme.backgroundEnd}"/>
    </linearGradient>
    <radialGradient id="logo-glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size.width}" height="${size.height}" rx="${metrics.radius}" fill="url(#logo-bg)"/>
  <rect x="1" y="1" width="${size.width - 2}" height="${size.height - 2}" rx="${metrics.radius - 1}" fill="none" stroke="${theme.border}" stroke-opacity="${borderOpacity}"/>
  <ellipse cx="${glowCx}" cy="${glowCy}" rx="${size.artWidth * 0.32}" ry="${size.height * 0.44}" fill="url(#logo-glow)"/>
  ${renderGlyphLayer({
    lines: ASCII_LINES,
    cell: metrics.cell,
    stroke: metrics.stroke,
    offsetX: artX + metrics.shadowX,
    offsetY: artY + metrics.shadowY,
    fill: theme.shadow,
  })}
  ${renderGlyphLayer({
    lines: ASCII_LINES,
    cell: metrics.cell,
    stroke: metrics.stroke,
    offsetX: artX,
    offsetY: artY,
    fill: theme.fill,
  })}
</svg>`
}

function renderSocialCardSvg() {
  const logo = getLogoSize()
  const scale = 0.86
  const scaledLogoWidth = logo.width * scale
  const scaledLogoHeight = logo.height * scale
  const logoX = (SOCIAL_CARD.width - scaledLogoWidth) / 2
  const logoY = 92

  const titleY = logoY + scaledLogoHeight + 96
  const subtitleY = titleY + 60
  const commandY = subtitleY + 88

  const badgeX = 88
  const badgeY = 54
  const badgeWidth = 180
  const badgeHeight = 38
  const commandWidth = 428
  const commandHeight = 56

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SOCIAL_CARD.width}" height="${SOCIAL_CARD.height}" viewBox="0 0 ${SOCIAL_CARD.width} ${SOCIAL_CARD.height}" role="img" aria-labelledby="title desc">
  <title id="title">yolobox social card</title>
  <desc id="desc">The yolobox logo with the tagline Run AI coding agents in a sandboxed container.</desc>
  <defs>
    <linearGradient id="card-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14141A"/>
      <stop offset="100%" stop-color="#08080A"/>
    </linearGradient>
    <radialGradient id="card-glow" cx="32%" cy="28%" r="58%">
      <stop offset="0%" stop-color="#FF8C00" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#FF8C00" stop-opacity="0"/>
    </radialGradient>
    <pattern id="card-grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M36 0H0V36" fill="none" stroke="white" stroke-opacity="0.05"/>
    </pattern>
    <linearGradient id="badge-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#15151B"/>
      <stop offset="100%" stop-color="#09090B"/>
    </linearGradient>
  </defs>
  <rect width="${SOCIAL_CARD.width}" height="${SOCIAL_CARD.height}" rx="${SOCIAL_CARD.radius}" fill="url(#card-bg)"/>
  <rect width="${SOCIAL_CARD.width}" height="${SOCIAL_CARD.height}" rx="${SOCIAL_CARD.radius}" fill="url(#card-grid)"/>
  <rect x="24" y="24" width="${SOCIAL_CARD.width - 48}" height="${SOCIAL_CARD.height - 48}" rx="24" fill="none" stroke="white" stroke-opacity="0.08"/>
  <ellipse cx="420" cy="188" rx="520" ry="220" fill="url(#card-glow)"/>

  <rect x="${badgeX}" y="${badgeY}" width="${badgeWidth}" height="${badgeHeight}" rx="19" fill="#2B1B08" stroke="#FF8C00" stroke-opacity="0.35"/>
  <text x="${badgeX + badgeWidth / 2}" y="${badgeY + 25}" text-anchor="middle" fill="#FFB66E" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="0.18em">YOLOBOX.DEV</text>

  <g transform="translate(${logoX} ${logoY}) scale(${scale})">
    <rect width="${logo.width}" height="${logo.height}" rx="${LOGO_METRICS.radius}" fill="url(#badge-bg)"/>
    <rect x="1" y="1" width="${logo.width - 2}" height="${logo.height - 2}" rx="${LOGO_METRICS.radius - 1}" fill="none" stroke="white" stroke-opacity="0.08"/>
    <ellipse cx="${logo.width / 2}" cy="${logo.height / 2}" rx="${logo.artWidth * 0.3}" ry="${logo.height * 0.45}" fill="#FF8C00" fill-opacity="0.2"/>
    ${renderGlyphLayer({
      lines: ASCII_LINES,
      cell: LOGO_METRICS.cell,
      stroke: LOGO_METRICS.stroke,
      offsetX: LOGO_METRICS.padX + LOGO_METRICS.shadowX,
      offsetY: LOGO_METRICS.padY + LOGO_METRICS.shadowY,
      fill: DARK_THEME.shadow,
    })}
    ${renderGlyphLayer({
      lines: ASCII_LINES,
      cell: LOGO_METRICS.cell,
      stroke: LOGO_METRICS.stroke,
      offsetX: LOGO_METRICS.padX,
      offsetY: LOGO_METRICS.padY,
      fill: DARK_THEME.fill,
    })}
  </g>

  <text x="96" y="${titleY}" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="800">Run AI coding agents in a sandboxed container.</text>
  <text x="96" y="${subtitleY}" fill="#BCBFC9" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500">Your home directory stays home.</text>

  <rect x="96" y="${commandY - 40}" width="${commandWidth}" height="${commandHeight}" rx="14" fill="#14141A" stroke="white" stroke-opacity="0.09"/>
  <text x="122" y="${commandY - 4}" fill="#FFB66E" font-family="'Courier New', monospace" font-size="21" font-weight="700">brew install finbarr/tap/yolobox</text>
  <text x="1108" y="${commandY - 4}" text-anchor="end" fill="#8F939C" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">yolobox.dev</text>
</svg>`
}

async function writeSvg(name, contents) {
  await fs.writeFile(path.join(publicDir, name), contents, 'utf8')
}

async function writePng(svgName, pngName) {
  const svgPath = path.join(publicDir, svgName)
  const pngPath = path.join(publicDir, pngName)
  const svgBuffer = await fs.readFile(svgPath)
  await sharp(svgBuffer).png().toFile(pngPath)
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true })

  const darkLogoSvg = renderLogoSvg(DARK_THEME)
  const lightLogoSvg = renderLogoSvg(LIGHT_THEME)
  const socialCardSvg = renderSocialCardSvg()

  await writeSvg('logo-dark.svg', darkLogoSvg)
  await writeSvg('logo-light.svg', lightLogoSvg)
  await writeSvg('social-card.svg', socialCardSvg)

  await writePng('logo-dark.svg', 'logo-dark.png')
  await writePng('logo-light.svg', 'logo-light.png')
  await writePng('social-card.svg', 'social-card.png')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
