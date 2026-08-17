const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const STORYBOOK_URL = 'http://localhost:6006';
const BRAIN_DIR = '/Users/aldi/.gemini/antigravity/brain/b1389ef7-dd0b-4095-bbea-de93e1d65656';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  console.log('==================================================');
  console.log(' 🛡️ Hfe POS Automated Storybook Playwright Crawler');
  console.log('==================================================');

  let indexData;
  try {
    indexData = await fetchJson(`${STORYBOOK_URL}/index.json`);
  } catch (err) {
    console.error(`Failed to fetch Storybook index from ${STORYBOOK_URL}/index.json:`, err.message);
    process.exit(1);
  }

  const entries = indexData.entries || indexData.stories || {};
  const storyList = Object.values(entries).filter(e => e.type === 'story');

  console.log(`Found ${storyList.length} stories to inspect in Storybook.\n`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const results = {
    passed: [],
    failed: []
  };

  for (let i = 0; i < storyList.length; i++) {
    const story = storyList[i];
    const storyId = story.id;
    const title = story.title;
    const name = story.name;
    const iframeUrl = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;

    const pageErrors = [];
    const onPageError = err => pageErrors.push(err.message || String(err));
    page.on('pageerror', onPageError);

    try {
      await page.goto(iframeUrl, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(600);

      // Check if Storybook error banner is rendered and visible
      const errorBanner = await page.$('#error-message');
      let bannerText = '';
      if (errorBanner) {
        const isVisible = await errorBanner.isVisible();
        if (isVisible) {
          bannerText = (await errorBanner.innerText()).trim();
        }
      }

      // Check if root error container or red box is displayed
      const errorContainer = await page.$('.sb-errordisplay, #error-stack');
      let hasErrorDisplay = false;
      if (errorContainer) {
        hasErrorDisplay = await errorContainer.isVisible();
      }

      page.off('pageerror', onPageError);

      const isFailed = pageErrors.length > 0 || (bannerText.length > 0 && bannerText !== '') || hasErrorDisplay;

      if (isFailed) {
        const errorDetail = pageErrors.join(' | ') || bannerText || 'Component Render Exception';
        console.error(`❌ [FAIL] [${i+1}/${storyList.length}] ${title} > ${name} (${storyId})`);
        console.error(`   Error: ${errorDetail}`);

        const ssPath = path.join(BRAIN_DIR, `fail_${storyId.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`);
        await page.screenshot({ path: ssPath });

        results.failed.push({
          id: storyId,
          title,
          name,
          error: errorDetail,
          screenshot: ssPath
        });
      } else {
        console.log(`✅ [PASS] [${i+1}/${storyList.length}] ${title} > ${name}`);
        results.passed.push({
          id: storyId,
          title,
          name
        });
      }
    } catch (err) {
      page.off('pageerror', onPageError);
      console.error(`💥 [TIMEOUT/CRASH] [${i+1}/${storyList.length}] ${title} > ${name}:`, err.message);
      results.failed.push({
        id: storyId,
        title,
        name,
        error: err.message
      });
    }
  }

  await browser.close();

  console.log('\n==================================================');
  console.log(` 📊 Storybook Playwright Inspection Summary:`);
  console.log(`    Total Stories: ${storyList.length}`);
  console.log(`    ✅ Passed:     ${results.passed.length}`);
  console.log(`    ❌ Failed:     ${results.failed.length}`);
  console.log('==================================================\n');

  if (results.failed.length > 0) {
    console.error('List of Failed Stories:');
    results.failed.forEach(f => console.error(` - ${f.title} > ${f.name} (${f.id}): ${f.error}`));
    process.exit(1);
  } else {
    console.log('🎉 100% OF ALL STORYBOOK STORIES RENDERED CLEANLY WITH ZERO ERRORS!');
    process.exit(0);
  }
})();
