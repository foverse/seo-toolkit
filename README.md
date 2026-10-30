# SEO Toolkit

A fast, zero-dependency on-page SEO analyzer, Google SERP simulator, and technical markup toolkit.

- Live Web App: [https://foverse.github.io/seo-toolkit/](https://foverse.github.io/seo-toolkit/)
- Repository: [https://github.com/foverse/seo-toolkit](https://github.com/foverse/seo-toolkit)
- License: MIT

---

## Overview

SEO Toolkit provides on-page audit insights, real-time SERP previews, and structured data generators without requiring external API subscriptions or heavy dependencies. It runs completely client-side in the browser, with optional Node.js and Python CLIs for automated workflows.

Built and maintained by [Fouad Sennouni](https://growthmaker.fr) ([@foverse](https://github.com/foverse)), creator of [growthmaker.fr](https://growthmaker.fr).

---

## Core Features

### 1. On-Page SEO Auditor
- Health Score (0 to 100): Weighted calculation across meta tags, content, images, links, social graphs, and technical markup.
- Meta direct inspection: Title length, meta description length, canonical tags, viewport configuration, charset, and robots indexing directives (`noindex`, `nofollow`).
- Content analysis: Heading hierarchy (`H1` through `H6`), multiple or missing H1 alerts, total word count, reading time estimates, and text-to-HTML code ratio.
- Asset and link validation: Image count, missing `alt` attributes, modern format detection (WebP, AVIF, SVG), internal vs external link distribution, and `rel="noopener noreferrer"` validation.
- Social graph preview: Open Graph tags (`og:title`, `og:image`, `og:description`, `og:url`) and Twitter Cards.
- Technical checks: Schema.org JSON-LD validation, language attribute, and HTTPS enforcement.

### 2. Google SERP Simulator
- Real-time desktop and mobile search snippet previews.
- Accurate pixel width calculations:
  - Title pixel tracker (target: under ~600px).
  - Meta description pixel tracker (target: under ~960px).
- Live interactive sandbox to test title tags and descriptions before deploying to production.

### 3. Heading Structure Tree
- Visual outline mapping heading nesting depth.
- Detects skipped heading levels (such as an `H1` jumping directly to an `H3`).

### 4. Keyword Density and N-Gram Extraction
- Single keyword, two-word phrase, and three-word phrase frequency extraction.
- Built-in stop-word filtering and over-optimization alerts for high keyword densities.

### 5. Schema and Technical File Generators
- Schema.org Builder: Visual JSON-LD generator for FAQPage, Article, Product, LocalBusiness, and Breadcrumbs.
- Robots.txt Builder: Presets for standard production sites, staging environments, and blocking aggressive AI scrapers.
- XML Sitemap Builder: Generates structured `sitemap.xml` entries directly from discovered page links.
- Meta Tag Generator: Complete template generator for HTML `<head>` tags.

### 6. Export Options
- PDF / Print: Clean print stylesheet accessible via `Ctrl+P` or the export button.
- JSON Export: Download the full audit payload as structured JSON.
- Markdown Summary: Single-click clipboard copy formatted for GitHub issues, pull requests, or client reports.

---

## Quick Start

### Option 1: Browser (Zero Setup)
Open [https://foverse.github.io/seo-toolkit/](https://foverse.github.io/seo-toolkit/) or open `index.html` locally in any modern browser.

### Option 2: Local Node Server (Bypasses CORS for External URLs)
```bash
git clone https://github.com/foverse/seo-toolkit.git
cd seo-toolkit
npm start
```
Then visit `http://localhost:3000` in your browser.

### Option 3: Terminal CLI (Node.js)
```bash
# Audit a live URL
node cli.js https://example.com

# Audit a local HTML file
node cli.js --file ./index.html

# Export audit to JSON
node cli.js https://example.com --json --output report.json

# Run test suite
npm test
```

### Option 4: Python CLI (Zero Dependencies)
```bash
# Audit a live URL
python seo_audit.py https://example.com

# Audit a local HTML file
python seo_audit.py --file index.html

# Output to JSON
python seo_audit.py https://example.com --json --output audit.json
```

---

## Architecture

```
seo-toolkit/
├── index.html         # Web application and UI layout
├── css/
│   └── styles.css     # Dark mode layout, SERP simulation, and print styles
├── js/
│   ├── analyzer.js    # Core SEO rules, scoring, and n-gram extraction
│   ├── tools.js       # Schema, robots.txt, sitemap, and pixel measurement
│   ├── samples.js     # Test presets (SaaS, E-commerce, Blog, Edge cases)
│   └── app.js         # Event orchestration and export handlers
├── server.js          # Lightweight Node.js server and proxy
├── cli.js             # Command line interface for Node.js
├── seo_audit.py       # Standalone Python 3 auditor (standard library only)
└── package.json       # Metadata and scripts
```

---

## Author & Project Info

Built by [Fouad Sennouni](https://growthmaker.fr) ([@foverse](https://github.com/foverse)).

Visit [growthmaker.fr](https://growthmaker.fr) for case studies and notes on acquisition, conversion optimization, and web engineering.

Licensed under the [MIT License](LICENSE).
