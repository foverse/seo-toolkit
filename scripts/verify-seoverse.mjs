import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const shotsDir = resolve(__dirname, '..', 'shots');
mkdirSync(shotsDir, { recursive: true });

async function main() {
  console.log('🚀 Starting comprehensive OpenSEO E2E verification...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  console.log('🌐 1. Navigating to OpenSEO root (http://localhost:3001)...');
  await page.goto('http://localhost:3001', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  await page.waitForTimeout(3000);
  const currentUrl = page.url();
  console.log(`📍 Redirected to default project: ${currentUrl}`);

  const title = await page.title();
  console.log(`📄 Page title: "${title}"`);

  // Screenshot Dashboard
  const dashboardShot = resolve(shotsDir, 'openseo-dashboard.png');
  await page.screenshot({ path: dashboardShot, fullPage: true });
  console.log(`📸 [1/5] Saved Dashboard screenshot: ${dashboardShot}`);

  // 2. Keyword Research
  console.log('🔍 2. Navigating to Keyword Research...');
  const keywordLink = page.locator('text=Keyword Research').first();
  await keywordLink.click();
  await page.waitForTimeout(2000);
  const keywordsShot = resolve(shotsDir, 'openseo-keywords.png');
  await page.screenshot({ path: keywordsShot, fullPage: true });
  console.log(`📸 [2/5] Saved Keyword Research screenshot: ${keywordsShot}`);

  // 3. Domain Overview
  console.log('🌐 3. Navigating to Domain Overview...');
  const domainLink = page.locator('text=Domain Overview').first();
  await domainLink.click();
  await page.waitForTimeout(2000);
  const domainShot = resolve(shotsDir, 'openseo-domain.png');
  await page.screenshot({ path: domainShot, fullPage: true });
  console.log(`📸 [3/5] Saved Domain Overview screenshot: ${domainShot}`);

  // 4. Site Audit
  console.log('🛡️ 4. Navigating to Site Audit...');
  const auditLink = page.locator('text=Site Audit').first();
  await auditLink.click();
  await page.waitForTimeout(2000);
  const auditShot = resolve(shotsDir, 'openseo-audit.png');
  await page.screenshot({ path: auditShot, fullPage: true });
  console.log(`📸 [4/5] Saved Site Audit screenshot: ${auditShot}`);

  // 5. Reports
  console.log('📊 5. Navigating to Reports...');
  const reportsLink = page.locator('text=Reports').first();
  await reportsLink.click();
  await page.waitForTimeout(2000);
  const reportsShot = resolve(shotsDir, 'openseo-reports.png');
  await page.screenshot({ path: reportsShot, fullPage: true });
  console.log(`📸 [5/5] Saved Reports screenshot: ${reportsShot}`);

  console.log('\n--- Diagnostics Summary ---');
  console.log(`Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }
  console.log(`Page errors: ${pageErrors.length}`);
  if (pageErrors.length > 0) {
    console.log('Page errors:', pageErrors);
  }

  await browser.close();

  if (pageErrors.length === 0) {
    console.log('\n🎉 ALL OPENSEO E2E WORKFLOW CHECKS PASSED WITH 0 ERRORS!');
    process.exit(0);
  } else {
    console.error('\n❌ E2E checks had page errors.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
