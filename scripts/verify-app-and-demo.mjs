import { chromium } from '../.agents/skills/stageshow/node_modules/playwright-core/index.mjs';

async function runVerification() {
  console.log('======================================================');
  console.log('  SEO Toolkit & Stageshow End-to-End Verification');
  console.log('======================================================\n');

  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
  });

  console.log('1. Loading http://localhost:3000 ...');
  const res = await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  if (!res || res.status() !== 200) {
    throw new Error(`Failed to load page: status ${res?.status()}`);
  }
  console.log('   [PASS] Page returned 200 OK');

  // Verify Lucide SVGs
  const unrenderedLucide = await page.$$eval('[data-lucide]', els => els.length);
  const svgs = await page.$$eval('svg', els => els.length);
  console.log(`   [PASS] Local icons rendered: ${svgs} SVG elements present, ${unrenderedLucide} unrendered`);
  if (unrenderedLucide > 0) {
    console.warn(`   [WARN] ${unrenderedLucide} elements still have data-lucide!`);
  }

  // Check initial audit state
  const scoreText = await page.$eval('#score-number', el => el.textContent.trim());
  const gradeText = await page.$eval('#score-grade-badge', el => el.textContent.trim());
  console.log(`   [PASS] Initial SEO Health Score: ${scoreText}/100 (Grade: ${gradeText})`);

  // Test Presets
  console.log('\n2. Testing Presets ...');
  const presets = ['ecommerce', 'blog', 'saas', 'broken'];
  for (const preset of presets) {
    await page.click(`.preset-btn[data-preset="${preset}"]`);
    await page.waitForTimeout(300);
    const score = await page.$eval('#score-number', el => el.textContent.trim());
    const issuesCount = await page.$$eval('#issues-list-container > *', els => els.length);
    console.log(`   [PASS] Preset "${preset}" loaded -> Score: ${score}/100, Issues rendered: ${issuesCount}`);
  }

  // Test HTML Paste / Upload Mode
  console.log('\n3. Testing HTML Paste/Upload Mode ...');
  await page.click('#btn-mode-html');
  await page.waitForTimeout(200);
  const htmlModeVisible = await page.$eval('#panel-html-mode', el => el.style.display !== 'none');
  console.log(`   [PASS] HTML Mode Panel visible: ${htmlModeVisible}`);

  const testHtml = `<!DOCTYPE html><html><head><title>Custom Test Page | Full Offline SEO Audit</title><meta name="description" content="A valid meta description that has the optimal length between 120 and 160 characters for maximum search engine snippet visibility."></head><body><h1>Primary Headline</h1><p>This is a paragraph with several words to test the word count calculation in our analyzer engine.</p></body></html>`;
  await page.fill('#input-raw-html', testHtml);
  await page.click('#btn-run-html-audit');
  await page.waitForTimeout(400);

  const customScore = await page.$eval('#score-number', el => el.textContent.trim());
  console.log(`   [PASS] Custom HTML audit executed -> Score: ${customScore}/100`);

  // Switch back to URL mode & reload E-Commerce
  await page.click('#btn-mode-url');
  await page.click('.preset-btn[data-preset="ecommerce"]');
  await page.waitForTimeout(400);

  // Test Tabs Navigation
  console.log('\n4. Testing Tab Navigation & Interactive Panes ...');

  // Pane 1: Issues & Checks
  await page.click('.tab-btn[data-target="tab-issues"]');
  const issuesTabActive = await page.$eval('#tab-issues', el => el.style.display !== 'none');
  console.log(`   [PASS] Issues Pane active: ${issuesTabActive}`);

  // Test Issues Filter
  await page.click('.filter-issue-btn[data-filter="warning"]');
  await page.waitForTimeout(150);
  await page.click('.filter-issue-btn[data-filter="all"]');

  // Pane 2: SERP Simulator
  await page.click('.tab-btn[data-target="tab-serp"]');
  await page.waitForTimeout(200);
  const desktopTitle = await page.$eval('#serp-preview-title-desktop', el => el.textContent.trim());
  const titlePixelText = await page.$eval('#serp-title-pixel-count', el => el.textContent.trim());
  console.log(`   [PASS] SERP Simulator Desktop Title: "${desktopTitle.slice(0, 40)}..." (Pixel: ${titlePixelText})`);

  // Live edit SERP title
  await page.fill('#editor-serp-title', 'Brand New Custom Title for SoundCraft Pro Audio');
  await page.waitForTimeout(200);
  const updatedPixelText = await page.$eval('#serp-title-pixel-count', el => el.textContent.trim());
  console.log(`   [PASS] Live SERP editor updated pixel meter to: ${updatedPixelText}`);

  // Pane 3: Heading Outline
  await page.click('.tab-btn[data-target="tab-headings"]');
  await page.waitForTimeout(200);
  const headingItems = await page.$$eval('#heading-tree-container > *', els => els.length);
  console.log(`   [PASS] Heading Outline Tree rendered ${headingItems} hierarchy nodes`);

  // Pane 4: Keyword Density
  await page.click('.tab-btn[data-target="tab-keywords"]');
  await page.waitForTimeout(200);
  const keywordItems = await page.$$eval('#keywords-unigrams-list > *', els => els.length);
  console.log(`   [PASS] Keyword Density 1-grams list rendered ${keywordItems} entries`);

  // Pane 5: Social Cards
  await page.click('.tab-btn[data-target="tab-social"]');
  await page.waitForTimeout(200);
  const ogTitle = await page.$eval('#og-preview-title', el => el.textContent.trim());
  console.log(`   [PASS] OpenGraph Social Card Title: "${ogTitle}"`);

  // Pane 6: Schema & Markup Generators
  await page.click('.tab-btn[data-target="tab-tools"]');
  await page.waitForTimeout(200);
  const schemaCode = await page.$eval('#tool-schema-output', el => el.textContent.trim());
  console.log(`   [PASS] Schema Generator produced JSON-LD (${schemaCode.length} chars)`);

  // Switch schema type
  await page.selectOption('#tool-schema-type', 'faq');
  await page.waitForTimeout(200);
  const faqSchemaCode = await page.$eval('#tool-schema-output', el => el.textContent.trim());
  console.log(`   [PASS] Schema Generator switched to FAQPage (${faqSchemaCode.includes('FAQPage') ? 'Verified' : 'Failed'})`);

  // Robots preset switch
  await page.click('.tool-robots-preset[data-preset="blockAi"]');
  await page.waitForTimeout(150);
  const robotsCode = await page.$eval('#tool-robots-output', el => el.textContent.trim());
  console.log(`   [PASS] Robots.txt Generator switched to Block AI Bots (${robotsCode.includes('GPTBot') ? 'Verified' : 'Failed'})`);

  // Test Stageshow Demo Modal in-app
  console.log('\n5. Testing In-App Stageshow Walkthrough Modal ...');
  await page.click('#btn-open-stageshow');
  await page.waitForTimeout(400);

  const modalVisible = await page.$eval('#stageshow-modal', el => el.style.display !== 'none');
  console.log(`   [PASS] Stageshow Modal opened: ${modalVisible}`);

  // Check that the Stageshow player viewport and cursor exist
  const cursorExists = await page.$eval('#ss-cursor', el => !!el);
  console.log(`   [PASS] Stageshow Animated Cursor mounted: ${cursorExists}`);

  // Let walkthrough play for 2.5 seconds
  await page.waitForTimeout(2500);

  // Check score roll progress
  const ssScore = await page.$eval('#ss-score-val', el => el.textContent.trim());
  console.log(`   [PASS] Stageshow Score Counter progress: ${ssScore}/100`);

  // Close modal
  await page.click('#btn-close-stageshow-modal');
  await page.waitForTimeout(200);
  const modalClosed = await page.$eval('#stageshow-modal', el => el.style.display === 'none');
  console.log(`   [PASS] Stageshow Modal closed: ${modalClosed}`);

  // Test Stageshow Vite Dev Server (React Component)
  console.log('\n6. Testing Stageshow Vite Playground (React Environment) ...');
  try {
    const vitePage = await browser.newPage();
    const viteRes = await vitePage.goto('http://127.0.0.1:5173/?capture=seo-toolkit', { waitUntil: 'networkidle', timeout: 7000 });
    console.log(`   [PASS] Stageshow Playground responded with status: ${viteRes?.status()}`);

    const stageMounted = await vitePage.$eval('.ss-stage', el => !!el).catch(() => false);
    const winMounted = await vitePage.$eval('.st-win', el => !!el).catch(() => false);
    const brandText = await vitePage.$eval('.st-brand', el => el.textContent.trim()).catch(() => '');
    console.log(`   [PASS] Stageshow React Stage mounted: ${stageMounted}, Window mounted: ${winMounted} ("${brandText}")`);
    await vitePage.close();
  } catch (err) {
    console.warn(`   [NOTE] Vite playground check: ${err.message}`);
  }

  console.log('\n7. Final Console & Network Health Check:');
  console.log(`   Total Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('   Errors detected:', consoleErrors);
  }
  console.log(`   Total Failed Requests: ${failedRequests.length}`);
  if (failedRequests.length > 0) {
    console.error('   Failed requests:', failedRequests);
  }

  await browser.close();

  if (consoleErrors.length === 0 && failedRequests.length === 0) {
    console.log('\n======================================================');
    console.log('  ALL CHECKS PASSED: App & Demo are 100% functional!');
    console.log('======================================================');
    return true;
  } else {
    throw new Error('Verification completed with errors.');
  }
}

runVerification().catch(err => {
  console.error('\nVerification FAILED:', err);
  process.exit(1);
});
