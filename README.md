# 🔍 SEO Studio — All-in-One SEO Audit & Optimization Suite

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://fouad01.github.io/seo/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![No Dependencies](https://img.shields.io/badge/Dependencies-Zero%20External-purple?style=for-the-badge)](#)

> **SEO Studio** is a modern, blazing-fast, open-source SEO audit and developer optimization suite. Inspect meta tags, diagnose broken heading hierarchies, simulate Google SERP snippets with pixel-accurate counters, extract keyword n-grams, generate Schema.org JSON-LD, build AI-blocking `robots.txt`, and export audit reports to PDF, JSON, or Markdown.

**Live Web App**: [https://fouad01.github.io/seo/](https://fouad01.github.io/seo/)

---

## ✨ Features

### 1. 📊 Deep On-Page SEO Auditor
- **Health Score (0–100)** with animated radial gauge and letter grade (`A+`, `A`, `B`, `C`, `D`, `F`).
- **6-Category Breakdown**:
  - **Meta & Indexing (25 pts)**: `<title>` length & pixel width, meta description, canonical URL, robots meta directives (`noindex`, `nofollow`), viewport, charset, and favicon.
  - **Content & Hierarchy (25 pts)**: `<h1>` presence, duplicate H1 detection, H2–H6 hierarchy structure, total word count, estimated reading time, and text-to-code HTML ratio.
  - **Images & Media (15 pts)**: Missing `alt` tags, generic labels (`"image.jpg"`), modern container formats (WebP, AVIF, SVG), and layout shift prevention attributes.
  - **Links & Navigation (15 pts)**: Internal vs. external link counts, empty anchor text warnings, `rel="noopener noreferrer"` validation, and nofollow counts.
  - **Social Open Graph (10 pts)**: `og:title`, `og:image`, `og:description`, `og:url`, `og:type`, and Twitter / X Card validation.
  - **Technical & Structured Data (10 pts)**: Schema.org JSON-LD syntax validation, HTML `lang` localization, HTTPS protocol enforcement, and doctype check.
- **Actionable Issue Tracker**: Sorted into 🚨 Critical (blockers), ⚠️ Warnings (optimizations), ℹ️ Info, and ✅ Passed checks with exact fixes.

### 2. 📱 Pixel-Accurate SERP Simulator
- Real-time **Google Desktop & Mobile** search snippet preview.
- Dynamic **pixel-width calculators**:
  - Title pixel gauge (max ~600px, turns amber/red when truncating).
  - Description pixel gauge (max ~960px).
- Editable fields for rapid headline copy testing.

### 3. 🌳 Headings Structural Hierarchy Tree
- Visual tree outline showing heading levels (`H1` ➔ `H2` ➔ `H3`).
- Alerts when heading levels are skipped (e.g., an `H1` followed directly by an `H3`).

### 4. 📈 Keyword Density & N-Gram Analyzer
- Instant extraction of:
  - **1-Grams** (single focus keywords)
  - **2-Grams** (two-word phrases)
  - **3-Grams** (long-tail keyphrases)
- Automatic stop-word filtering and keyword stuffing alerts (>3.5% density).

### 5. 🛠️ Interactive SEO Developer Tools
- **Schema.org JSON-LD Generator**: Visual builders for `FAQPage`, `Article` / `BlogPosting`, `Product`, `LocalBusiness`, and `Breadcrumbs`.
- **Robots.txt Builder**: Includes 1-click presets for standard sites, dev/staging blocking, and **blocking AI crawlers** (`GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider`, `Google-Extended`).
- **XML Sitemap Generator**: Generates standard, valid `sitemap.xml` directly from audited pages.
- **Meta Tag Generator**: Complete `<head>` template generator for new projects.

### 6. 📄 Multi-Format Export
- **Print / PDF**: Professional printable report stylesheet (triggerable via 1-click or `Ctrl+P`).
- **Save JSON**: Full programmatic audit data export.
- **Copy Markdown**: Ready-to-paste executive summary for pull requests, tickets, or client reports.

---

## 🚀 Quick Start

### Option A: Run in the Browser (GitHub Pages or Local)
No build step or server required! Simply open `index.html` in any browser or visit the live deployment:
👉 **[https://fouad01.github.io/seo/](https://fouad01.github.io/seo/)**

### Option B: Run Local Node.js Server & CORS Proxy
To audit any external URL without browser CORS limitations, launch the zero-dependency local server:

```bash
# Clone the repository
git clone https://github.com/fouad01/seo.git
cd seo

# Start the local server
npm start
# or: node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option C: Node.js Terminal CLI
Audit websites or local files directly from your terminal:

```bash
# Audit a live website
node cli.js https://example.com

# Audit a local HTML file
node cli.js --file ./index.html

# Output JSON or save to file
node cli.js https://example.com --json --output report.json

# Run unit verification tests
npm test
```

### Option D: Python 3 CLI
If you prefer Python, use the standalone `seo_audit.py` script (requires only Python 3 standard library):

```bash
# Audit a website
python seo_audit.py https://example.com

# Audit a local file
python seo_audit.py --file index.html

# Export to JSON
python seo_audit.py https://example.com --json --output audit.json
```

---

## 📂 Project Architecture

```
seo/
├── index.html              # Main Single-Page Application (SPA)
├── css/
│   └── styles.css          # Glassmorphism, dark theme, SERP cards, print CSS
├── js/
│   ├── analyzer.js         # Core SEO rules, scoring logic, keyword extractor
│   ├── tools.js            # Schema.org, robots.txt, sitemap, SERP pixel logic
│   ├── samples.js          # Preloaded test presets (E-commerce, Blog, SaaS, Broken)
│   └── app.js              # Application UI controller and export handlers
├── server.js               # Zero-dependency Node.js HTTP server & CORS proxy
├── cli.js                  # Standalone Node.js CLI auditor with colored output
├── seo_audit.py            # Standalone Python 3 CLI auditor
├── package.json            # NPM package metadata and runner scripts
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automated GitHub Pages CI/CD workflow
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # Documentation
```

---

## 🧪 Testing & Verification

The suite includes internal unit tests:

```bash
# Node.js self test
node cli.js --test
# Output: ✓ All Self Tests Passed Successfully! (100/100)

# Audit index.html itself
node cli.js --file ./index.html
# Output: SEO Health Score: 100 / 100
```

---

## 🚢 Deploying to GitHub Pages

1. Push your changes to the `master` or `main` branch:
   ```bash
   git add .
   git commit -m "feat: complete SEO Studio suite v2.0"
   git push origin master
   ```
2. In your GitHub repository settings, go to **Settings > Pages**.
3. Under **Build and deployment**, select **GitHub Actions** (or deploy directly from the `master` branch `/ (root)`).
4. Your SEO tool is now live at `https://<your-username>.github.io/<repo-name>/`!

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
Created with ❤️ by [Fouad Sennouni](https://github.com/fouad01).
