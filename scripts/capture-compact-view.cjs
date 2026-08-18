const { chromium } = require('playwright')
const path = require('path')
const os = require('os')

const brainDir = process.env.BRAIN_DIR || path.join(os.homedir(), '.gemini', 'antigravity', 'brain', 'default-captures')

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  })
  const page = await context.newPage()
  await page.goto('http://localhost:5173/?app=cafe')
  await page.waitForTimeout(800)

  // Click the compact view button in the command header (the middle grid icon)
  const buttons = await page.$$('button')
  for (const btn of buttons) {
    const title = await btn.getAttribute('title')
    const html = await btn.innerHTML()
    // Find viewMode button with Grid icon or title
    if (title?.includes('Kompak') || title?.includes('Compact') || html.includes('lucide-grid')) {
      await btn.click()
      break
    }
  }

  // Also try clicking the view mode button directly by finding the 3rd icon in the view switcher
  const viewSwitchers = await page.$$('div.bg-slate-950 button')
  for (const btn of viewSwitchers) {
    const html = await btn.innerHTML()
    if (html.includes('Grid') || html.includes('grid')) {
      await btn.click()
    }
  }

  await page.waitForTimeout(600)

  await page.screenshot({
    path: brainDir + '/screenshot_pos_compact_view.png',
    fullPage: false
  })
  await browser.close()
  console.log('COMPACT VIEW CAPTURED SUCCESSFULLY!')
}

run().catch(console.error)
