import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import sharp from 'sharp'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname)
const OUT = path.join(ROOT, 'review-package')
const BASE_URL = process.env.REVIEW_BASE_URL || 'http://127.0.0.1:4173'
const SCENES = Array.from({ length: 39 }, (_, index) => String(index + 1).padStart(2, '0'))
const MOTION_SCENES = ['01', '08', '37', '39']
const VIEWPORT = { width: 1920, height: 1080 }

async function ensureDirectories() {
  await Promise.all([
    'screenshots/live',
    'screenshots/reference',
    'screenshots/overlay',
    'screenshots/foreground',
    'comparisons/diff',
    'recordings',
  ].map((folder) => fs.mkdir(path.join(OUT, folder), { recursive: true })))
}

async function stable(page) {
  await page.waitForSelector('[data-visual-stage]')
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(Array.from(document.images).map((image) => image.decode?.().catch(() => undefined)))
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
}

function url(scene, mode, render = 'composite', extra = '') {
  return `${BASE_URL}/?scene=${scene}&mode=${mode}&output=obs&render=${render}&clean=true&paused=true&bgVideo=false&ticker=hide${extra}`
}

async function capture(page, targetUrl, output, options = {}) {
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' })
  await stable(page)
  await page.locator('[data-visual-stage]').screenshot({ path: output, omitBackground: options.omitBackground === true })
}

async function compare(referencePath, livePath, diffPath) {
  const reference = PNG.sync.read(await fs.readFile(referencePath))
  const live = PNG.sync.read(await fs.readFile(livePath))
  const diff = new PNG({ width: reference.width, height: reference.height })
  const mismatched = pixelmatch(reference.data, live.data, diff.data, reference.width, reference.height, { threshold: 0.12, includeAA: false })
  await fs.writeFile(diffPath, PNG.sync.write(diff))
  return { mismatchedPixels: mismatched, totalPixels: reference.width * reference.height, similarity: 1 - (mismatched / (reference.width * reference.height)) }
}

async function transparencyStats(file) {
  const png = PNG.sync.read(await fs.readFile(file))
  let transparent = 0
  let partial = 0
  let opaque = 0
  for (let index = 3; index < png.data.length; index += 4) {
    const alpha = png.data[index]
    if (alpha === 0) transparent += 1
    else if (alpha === 255) opaque += 1
    else partial += 1
  }
  const cornerAlpha = [
    png.data[3],
    png.data[((png.width - 1) * 4) + 3],
    png.data[(((png.height - 1) * png.width) * 4) + 3],
    png.data[(((png.height * png.width) - 1) * 4) + 3],
  ]
  const transparentRatio = transparent / (png.width * png.height)
  const topCornersTransparent = cornerAlpha.slice(0, 2).every((alpha) => alpha === 0)
  return { transparent, partial, opaque, transparentRatio, cornerAlpha, topCornersTransparent, transparencyPass: transparentRatio > 0.55 && topCornersTransparent }
}

async function makeContactSheet(sourceFolder, outputFile, title) {
  const thumbWidth = 320
  const thumbHeight = 180
  const labelHeight = 28
  const columns = 6
  const rows = Math.ceil(SCENES.length / columns)
  const composites = []
  for (let index = 0; index < SCENES.length; index += 1) {
    const scene = SCENES[index]
    const image = await sharp(path.join(sourceFolder, `scene-${scene}.png`)).resize(thumbWidth, thumbHeight).png().toBuffer()
    const label = await sharp({ create: { width: thumbWidth, height: labelHeight, channels: 4, background: '#071b4d' } })
      .composite([{ input: Buffer.from(`<svg width="${thumbWidth}" height="${labelHeight}"><text x="12" y="20" fill="white" font-family="Arial" font-size="16" font-weight="700">Scene ${scene}</text></svg>`) }])
      .png().toBuffer()
    composites.push({ input: image, left: (index % columns) * thumbWidth, top: 42 + Math.floor(index / columns) * (thumbHeight + labelHeight) })
    composites.push({ input: label, left: (index % columns) * thumbWidth, top: 42 + Math.floor(index / columns) * (thumbHeight + labelHeight) + thumbHeight })
  }
  const heading = Buffer.from(`<svg width="${columns * thumbWidth}" height="42"><rect width="100%" height="100%" fill="#020b24"/><text x="18" y="28" fill="white" font-family="Arial" font-size="22" font-weight="700">${title}</text></svg>`)
  await sharp({ create: { width: columns * thumbWidth, height: 42 + rows * (thumbHeight + labelHeight), channels: 4, background: '#020b24' } })
    .composite([{ input: heading, left: 0, top: 0 }, ...composites])
    .png().toFile(outputFile)
}

async function captureMotion(browser, scene) {
  const tempDir = path.join(OUT, 'recordings', `.temp-${scene}`)
  await fs.mkdir(tempDir, { recursive: true })
  const context = await browser.newContext({ viewport: VIEWPORT, recordVideo: { dir: tempDir, size: VIEWPORT } })
  const page = await context.newPage()
  await page.goto(`${BASE_URL}/?scene=${scene}&mode=live&output=obs&render=composite&clean=false&controllerPreview=false&bgVideo=false&ticker=hide`, { waitUntil: 'domcontentloaded' })
  await stable(page)
  await page.locator('[data-trigger-cue="full-sequence"]').click()
  await page.waitForTimeout(2400)
  const video = page.video()
  await page.close()
  await context.close()
  if (video) await video.saveAs(path.join(OUT, 'recordings', `scene-${scene}-full-sequence.webm`))
  await fs.rm(tempDir, { recursive: true, force: true })
}

async function main() {
  await ensureDirectories()
  const response = await fetch(BASE_URL)
  if (!response.ok) throw new Error(`Review server unavailable at ${BASE_URL}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: VIEWPORT })
  const report = []
  try {
    for (const scene of SCENES) {
      const files = {
        live: path.join(OUT, 'screenshots/live', `scene-${scene}.png`),
        reference: path.join(OUT, 'screenshots/reference', `scene-${scene}.png`),
        overlay: path.join(OUT, 'screenshots/overlay', `scene-${scene}.png`),
        foreground: path.join(OUT, 'screenshots/foreground', `scene-${scene}.png`),
        diff: path.join(OUT, 'comparisons/diff', `scene-${scene}.png`),
      }
      await capture(page, url(scene, 'live'), files.live)
      await capture(page, url(scene, 'reference'), files.reference)
      await capture(page, url(scene, 'overlay', 'composite', '&refOpacity=0.5&refOnTop=true&overlayView=both'), files.overlay)
      await capture(page, url(scene, 'live', 'foreground', '&ticker=show'), files.foreground, { omitBackground: true })
      report.push({ scene, comparison: await compare(files.reference, files.live, files.diff), foreground: await transparencyStats(files.foreground) })
      process.stdout.write(`Captured scene ${scene}\n`)
    }
    for (const scene of MOTION_SCENES) await captureMotion(browser, scene)
  } finally {
    await page.close()
    await browser.close()
  }

  await makeContactSheet(path.join(OUT, 'screenshots/live'), path.join(OUT, 'live-contact-sheet.png'), 'BemaHub live scenes 01–39')
  await makeContactSheet(path.join(OUT, 'screenshots/overlay'), path.join(OUT, 'overlay-contact-sheet.png'), 'BemaHub reference/live overlays 01–39')

  await fs.writeFile(path.join(OUT, 'review-data.json'), JSON.stringify({ generatedAt: new Date().toISOString(), branch: 'experiment/scene37-foreground-blockout', report }, null, 2))
  const rows = report.map(({ scene, comparison, foreground }) => `| ${scene} | ${(comparison.similarity * 100).toFixed(2)}% | ${(foreground.transparentRatio * 100).toFixed(2)}% | ${foreground.transparencyPass ? 'PASS' : 'FAIL'} |`)
  const markdown = [
    '# OBS Presentation Review Package', '',
    `Generated: ${new Date().toISOString()}`, '',
    '| Scene | Pixel similarity | Foreground transparent | Transparency check |',
    '| --- | ---: | ---: | --- |',
    ...rows, '',
    'Pixel similarity is diagnostic only: approved presenter photography and supplied background art are intentionally excluded from the coded browser layers.', '',
    'Artifacts:', '',
    '- `screenshots/live/` — all 39 live composites',
    '- `screenshots/reference/` — all 39 approved 1920×1080 references',
    '- `screenshots/overlay/` — all 39 50% reference/live comparisons',
    '- `screenshots/foreground/` — transparent Z3 captures',
    '- `comparisons/diff/` — diagnostic pixel diffs',
    '- `recordings/` — representative full-sequence cue recordings',
  ].join('\n')
  await fs.writeFile(path.join(OUT, 'README.md'), `${markdown}\n`)
  process.stdout.write(`Review package written to ${OUT}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
