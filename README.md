# Fouad's SEO Toolkit

A fast, zero-dependency on-page SEO analyzer, Google SERP simulator, and technical markup toolkit.

- **Live Web App**: [https://foverse.github.io/seo-toolkit/](https://foverse.github.io/seo-toolkit/)
- **Repository**: [https://github.com/foverse/seo-toolkit](https://github.com/foverse/seo-toolkit)
- **License**: MIT

---

## About the Author

Hi, I am **Fouad Sennouni**, a photography, videography, and tech enthusiast based in Tetouan, Morocco.

- **Location**: Tetouan, Morocco
- **Focus**: Web development, open-source tools, visual media, and video editing
- **Skills**: JavaScript, Python, HTML/CSS, Adobe Photoshop, Illustrator, Premiere Pro
- **GitHub**: [@fouad01](https://github.com/foverse)
- **Instagram**: [@fouadsennouni](https://www.instagram.com/fouadsennouni)

### Project Background
I originally created this repository back in 2019 as a personal sandbox. In 2026, I rebuilt it into a full open-source toolkit. The goal was simple: provide a fast, clean, subscription-free SEO tool that anyone can run directly in their browser, on their terminal, or self-host for free.

---

## What It Does

### 1. On-Page SEO Auditor
- **Health Score (0 to 100)**: Evaluates page health across 6 weighted categories (Meta, Content, Images, Links, Social, Technical).
- **Meta checks**: Title length, description length, canonical tags, viewport meta, charset, robots indexing directives (`noindex`, `nofollow`), and favicon.
- **Content analysis**: Heading tags (`H1` to `H6`), missing or multiple H1 detection, total word count, reading time, and text-to-code HTML ratio.
- **Image audit**: Total images, missing `alt` attributes, non-descriptive labels, modern format support (WebP, AVIF, SVG), and layout shift attributes.
- **Link profile**: Total links, internal vs. external counts, empty anchor text warnings, and `rel="noopener noreferrer"` validation.
- **Social tags**: Open Graph tags (`og:title`, `og:image`, `og:description`, `og:url`) and Twitter / X Card validation.
- **Technical checks**: Schema.org JSON-LD detection and syntax check, HTML `lang` attribute, and HTTPS check.
- **Actionable issue list**: Sorted by Critical, Warnings, and Passed checks with clear fix recommendations.

### 2. Google SERP Simulator
- Live desktop and mobile search snippet previews.
- Real-time pixel width calculators:
  - Title pixel bar (max ~600px).
  - Description pixel bar (max ~960px).
- Editable fields to test titles and descriptions before publishing.

### 3. Heading Structure Tree
- Visual tree outline showing heading levels (`H1` -> `H2` -> `H3`).
- Highlights skipped levels (for example, when an `H1` is followed directly by an `H3`).

### 4. Keyword Density and N-Gram Extraction
- Extracts single keywords (1-grams), two-word phrases (2-grams), and three-word phrases (3-grams).
- Includes stop-word filtering and keyword stuffing warnings (>3.5% density).

### 5. Schema and Technical Generators
- **Schema.org Builder**: Visual JSON-LD generator for FAQPage, Article, Product, LocalBusiness, and Breadcrumbs.
- **Robots.txt Builder**: Presets for standard sites, dev staging, and blocking AI crawlers (`GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider`, `Google-Extended`).
- **XML Sitemap Generator**: Generates clean `sitemap.xml` directly from page links.
- **Meta Tag Generator**: Complete `<head>` template generator for new projects.

### 6. Export Options
- **Print / PDF**: Clean printable stylesheet (`Ctrl+P` or via the Export PDF button).
- **Save JSON**: Download full audit data as a JSON file.
- **Copy Markdown**: One-click markdown summary ready to paste into GitHub issues, pull requests, or client notes.

---

## How to Run It

### 1. In Your Browser (No Setup Needed)
Open `index.html` in any browser or visit the live site:
[https://foverse.github.io/seo-toolkit/](https://foverse.github.io/seo-toolkit/)

### 2. Local Node.js Server & Proxy
To audit external websites without browser CORS limits, start the local server:

```bash
git clone https://github.com/foverse/seo-toolkit.git
cd seo

npm start
```

Then open `http://localhost:3000` in your browser.

### 3. Node.js Command Line
Run audits straight from your terminal:

```bash
# Audit a live website
node cli.js https://example.com

# Audit a local HTML file
node cli.js --file ./index.html

# Save results as JSON
node cli.js https://example.com --json --output report.json

# Run unit verification tests
npm test
```

### 4. Python Command Line
If you prefer Python, run the standalone script (uses only the Python 3 standard library):

```bash
# Audit a live URL
python seo_audit.py https://example.com

# Audit a local file
python seo_audit.py --file index.html

# Output to JSON
python seo_audit.py https://example.com --json --output audit.json
```

---

## File Structure

```
seo/
├── index.html              # Main web application with About modal and tab
├── css/
│   └── styles.css          # Dark theme, SERP cards, heading tree, and print styles
├── js/
│   ├── analyzer.js         # Core SEO rules, scoring, and keyword extractor
│   ├── tools.js            # Schema, robots.txt, sitemap, and SERP pixel calculator
│   ├── samples.js          # Demo presets (E-commerce, Blog, SaaS, Broken SEO)
│   └── app.js              # UI controller, About modal, and export handlers
├── server.js               # Zero-dependency local Node.js server and CORS proxy
├── cli.js                  # Standalone Node.js CLI tool
├── seo_audit.py            # Standalone Python 3 CLI tool
├── package.json            # Scripts and metadata
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions Pages deployment
├── .gitignore              # Ignored files
├── LICENSE                 # MIT License
└── README.md               # Documentation and author info
```

---

## License

This project is licensed under the [MIT License](LICENSE).
Created by [Fouad Sennouni](https://github.com/foverse).
