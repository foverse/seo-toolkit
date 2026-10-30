#!/usr/bin/env node
/**
 * Fouad's SEO Toolkit - Command Line Interface (CLI)
 * Run terminal SEO audits on live URLs or local HTML files with zero external dependencies.
 * Created by Fouad Sennouni (https://github.com/foverse)
 *
 * Usage:
 *   node cli.js https://example.com
 *   node cli.js --file ./index.html
 *   node cli.js --json https://example.com
 *   node cli.js --test
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--test')) {
    runSelfTest();
    return;
  }

  const isJson = args.includes('--json');
  let outputFilePath = null;
  const outIdx = args.indexOf('--output');
  if (outIdx !== -1 && args[outIdx + 1]) {
    outputFilePath = args[outIdx + 1];
  }

  let targetUrl = '';
  let localFile = '';

  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    localFile = args[fileIdx + 1];
  } else {
    targetUrl = args.find(a => !a.startsWith('--') && a !== outputFilePath);
  }

  let htmlContent = '';
  let auditSource = '';

  if (localFile) {
    auditSource = localFile;
    try {
      htmlContent = fs.readFileSync(path.resolve(localFile), 'utf-8');
    } catch (err) {
      console.error(`${c.red}Error reading file ${localFile}:${c.reset} ${err.message}`);
      process.exit(1);
    }
  } else if (targetUrl) {
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    auditSource = targetUrl;
    if (!isJson) {
      console.log(`${c.cyan}Fetching ${targetUrl}...${c.reset}`);
    }
    try {
      htmlContent = await fetchUrl(targetUrl);
    } catch (err) {
      console.error(`${c.red}Fetch failed:${c.reset} ${err.message}`);
      process.exit(1);
    }
  } else {
    printHelp();
    process.exit(1);
  }

  // Run audit
  const report = analyzeHtmlRaw(htmlContent, auditSource);

  if (isJson) {
    const jsonOutput = JSON.stringify(report, null, 2);
    if (outputFilePath) {
      fs.writeFileSync(outputFilePath, jsonOutput);
      console.log(`Saved JSON report to ${outputFilePath}`);
    } else {
      console.log(jsonOutput);
    }
    return;
  }

  // Print Terminal Report
  printReport(report);

  if (outputFilePath) {
    fs.writeFileSync(outputFilePath, JSON.stringify(report, null, 2));
    console.log(`\n${c.green}✓ Detailed report saved to:${c.reset} ${outputFilePath}`);
  }
}

function printHelp() {
  console.log(`
${c.bold}${c.cyan}Fouad's SEO Toolkit CLI${c.reset} (https://github.com/foverse/seo-toolkit)

${c.bold}Usage:${c.reset}
  node cli.js <url> [options]
  node cli.js --file <path-to-html> [options]

${c.bold}Options:${c.reset}
  --json             Output raw JSON result
  --output <file>    Save audit result to JSON file
  --test             Run internal unit test suite
  --help, -h         Show this help guide

${c.bold}Examples:${c.reset}
  node cli.js https://example.com
  node cli.js --file ./index.html
  node cli.js https://example.com --json --output report.json
`);
}

function fetchUrl(targetUrl, timeoutMs = 10000, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects.'));

    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOStudioCLI/2.0; +https://github.com/foverse/seo-toolkit)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: timeoutMs
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = new URL(res.headers.location, targetUrl).href;
        return resolve(fetchUrl(nextUrl, timeoutMs, maxRedirects - 1));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timed out after ${timeoutMs}ms.`));
    });
  });
}

/**
 * Robust regex-based CLI HTML analyzer (Node.js standalone without external DOM libraries)
 */
function analyzeHtmlRaw(html, sourceUrl) {
  const issues = [];
  const passed = [];

  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  if (!title) {
    issues.push({ severity: 'critical', title: 'Missing Title Tag', desc: 'No <title> tag found.' });
  } else if (title.length < 30) {
    issues.push({ severity: 'warning', title: 'Title Too Short', desc: `Title is only ${title.length} characters ("${title}").` });
  } else if (title.length > 60) {
    issues.push({ severity: 'warning', title: 'Title Too Long', desc: `Title is ${title.length} characters. May be truncated.` });
  } else {
    passed.push({ title: 'Optimal Title Length', desc: `Title is ${title.length} chars: "${title}".` });
  }

  // Meta Description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i) ||
                    html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["'][^>]*>/i);
  const description = descMatch ? descMatch[1].trim() : '';

  if (!description) {
    issues.push({ severity: 'critical', title: 'Missing Meta Description', desc: 'No meta description found.' });
  } else if (description.length < 70) {
    issues.push({ severity: 'warning', title: 'Meta Description Too Short', desc: `${description.length} chars.` });
  } else if (description.length > 160) {
    issues.push({ severity: 'warning', title: 'Meta Description May Be Truncated', desc: `${description.length} chars.` });
  } else {
    passed.push({ title: 'Optimal Meta Description', desc: `${description.length} chars.` });
  }

  // Canonical
  const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i);
  const canonical = canonMatch ? canonMatch[1].trim() : '';
  if (!canonical) {
    issues.push({ severity: 'warning', title: 'Missing Canonical Tag', desc: 'Can cause duplicate content issues.' });
  } else {
    passed.push({ title: 'Canonical Tag Present', desc: canonical });
  }

  // Viewport
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  if (!viewportMatch) {
    issues.push({ severity: 'critical', title: 'Missing Viewport Meta Tag', desc: 'Page is not mobile-responsive.' });
  } else {
    passed.push({ title: 'Mobile Viewport Configured', desc: 'Responsive tag found.' });
  }

  // Headings
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h3Matches = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];

  if (h1Matches.length === 0) {
    issues.push({ severity: 'critical', title: 'Missing H1 Heading', desc: 'No <h1> headline found.' });
  } else if (h1Matches.length > 1) {
    issues.push({ severity: 'warning', title: `Multiple H1 Headings (${h1Matches.length})`, desc: 'Recommended: exactly 1 H1 per page.' });
  } else {
    const cleanH1 = h1Matches[0].replace(/<[^>]+>/g, '').trim();
    passed.push({ title: 'Single H1 Heading Present', desc: cleanH1 });
  }

  // Images
  const imgMatches = html.match(/<img[^>]+>/gi) || [];
  let missingAlts = 0;
  imgMatches.forEach(img => {
    if (!/alt=["'][^"']*["']/i.test(img)) {
      missingAlts++;
    }
  });

  if (imgMatches.length > 0 && missingAlts > 0) {
    issues.push({
      severity: missingAlts > 2 ? 'critical' : 'warning',
      title: `${missingAlts} Image(s) Missing Alt Text`,
      desc: `Out of ${imgMatches.length} total images.`
    });
  } else if (imgMatches.length > 0) {
    passed.push({ title: 'All Images Have Alt Attributes', desc: `${imgMatches.length} images checked.` });
  }

  // Schema.org
  const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  if (schemaMatches.length === 0) {
    issues.push({ severity: 'warning', title: 'No Schema.org Structured Data', desc: 'Rich results markup missing.' });
  } else {
    passed.push({ title: `${schemaMatches.length} Schema.org Structured Data Item(s)`, desc: 'JSON-LD detected.' });
  }

  // Content Word Count
  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = textOnly ? textOnly.split(/\s+/).filter(w => w.length > 0) : [];
  const wordCount = words.length;

  if (wordCount < 150) {
    issues.push({ severity: 'critical', title: 'Thin Content Detected', desc: `Only ${wordCount} words.` });
  } else {
    passed.push({ title: 'Healthy Content Length', desc: `${wordCount} words.` });
  }

  // Calculate score
  let score = 100;
  issues.forEach(i => {
    if (i.severity === 'critical') score -= 15;
    else if (i.severity === 'warning') score -= 8;
  });
  score = Math.max(10, Math.min(100, score));

  return {
    source: sourceUrl,
    score,
    title,
    description,
    canonical,
    metrics: {
      wordCount,
      h1Count: h1Matches.length,
      h2Count: h2Matches.length,
      h3Count: h3Matches.length,
      imagesTotal: imgMatches.length,
      missingAlts,
      schemasFound: schemaMatches.length
    },
    issues,
    passed
  };
}

function printReport(r) {
  console.log(`\n======================================================`);
  console.log(`  ${c.bold}${c.cyan}Fouad's SEO Toolkit - Audit Report${c.reset}`);
  console.log(`  Source: ${r.source}`);
  console.log(`======================================================`);

  let scoreColor = c.green;
  if (r.score < 60) scoreColor = c.red;
  else if (r.score < 80) scoreColor = c.yellow;

  console.log(`\n  ${c.bold}SEO Health Score:${c.reset} ${scoreColor}${c.bold}${r.score} / 100${c.reset}`);

  console.log(`\n  ${c.bold}Key Metrics:${c.reset}`);
  console.log(`    - Words:       ${r.metrics.wordCount}`);
  console.log(`    - Headings:    H1: ${r.metrics.h1Count} | H2: ${r.metrics.h2Count} | H3: ${r.metrics.h3Count}`);
  console.log(`    - Images:      ${r.metrics.imagesTotal} (${r.metrics.missingAlts} missing alt)`);
  console.log(`    - Structured:  ${r.metrics.schemasFound} Schema.org item(s)`);

  if (r.issues.length > 0) {
    console.log(`\n  ${c.bold}${c.red}Issues Detected (${r.issues.length}):${c.reset}`);
    r.issues.forEach(i => {
      const icon = i.severity === 'critical' ? `${c.red}[CRITICAL]${c.reset}` : `${c.yellow}[WARNING]${c.reset}`;
      console.log(`    ${icon} ${c.bold}${i.title}:${c.reset} ${i.desc}`);
    });
  }

  if (r.passed.length > 0) {
    console.log(`\n  ${c.bold}${c.green}Passed Checks (${r.passed.length}):${c.reset}`);
    r.passed.forEach(p => {
      console.log(`    ${c.green}✓${c.reset} ${p.title} (${p.desc})`);
    });
  }

  console.log(`\n======================================================\n`);
}

function runSelfTest() {
  console.log(`${c.bold}${c.cyan}Running SEO Studio Self Test...${c.reset}`);
  const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Modern Web Architecture Guide and Best Practices</title>
  <meta name="description" content="Discover modern web architecture strategies, edge rendering techniques, and high-performance SEO optimizations for scalable web apps.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="https://example.com/guide">
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"Web Architecture Guide"}
  </script>
</head>
<body>
  <h1>Comprehensive Guide to Modern Web Architecture</h1>
  <p>Building high performance web applications requires evaluating modern edge caching, decoupled microfrontends, and server-side rendering mechanisms. In this technical deep dive, we explore structural design patterns that maximize Core Web Vitals and search crawler indexability across diverse client devices and geographical locations.</p>
  <h2>Understanding Time to First Byte and Server Latency</h2>
  <p>Minimizing initial server response latency ensures users and search engine bots immediately receive HTML markup without bottlenecks. Configuring distributed reverse proxies, compression protocols like Brotli, and edge TLS termination significantly drops load time. In addition, maintaining low DNS lookup latencies through Anycast networks guarantees consistent response speeds regardless of where your visitors are browsing from.</p>
  <h2>Optimizing Image Assets and Modern Media Formats</h2>
  <p>High-resolution imagery must be compressed and formatted in modern containers such as WebP and AVIF to prevent excessive bandwidth consumption and cumulative layout shift. Setting explicit width and height dimensions prevents visual layout recalculation during browser image decoding. Furthermore, serving images through a responsive picture element ensures mobile screens do not waste mobile data downloading oversized desktop assets.</p>
  <img src="https://example.com/hero.webp" alt="High performance web architecture diagram illustration">
</body>
</html>`;
  const report = analyzeHtmlRaw(sampleHtml, 'self-test');
  console.log(`Score: ${report.score}/100`);
  console.log(`Passed checks: ${report.passed.length}`);
  console.log(`Issues found: ${report.issues.length}`);
  if (report.score >= 95) {
    console.log(`${c.green}${c.bold}✓ All Self Tests Passed Successfully!${c.reset}`);
  } else {
    console.log(`${c.red}Self test produced unexpected score: ${report.score}${c.reset}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
