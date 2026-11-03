# SEOVerse Showcase

Open-source SEO and AI visibility platform showcase hosted on GitHub Pages.

- Repository: [https://github.com/foverse/seoverse](https://github.com/foverse/seoverse)
- Live Showcase: [https://foverse.github.io/seoverse/](https://foverse.github.io/seoverse/)
- License: MIT

## Overview

SEOVerse is a developer-first open-source alternative to Semrush and Ahrefs. It provides autonomous AI agent skills, an MCP server for AI coding assistants, and a full local SEO analytics workspace.

## Autonomous Agent Skills

SEOVerse includes 12 skills for Cursor, Claude Code, Antigravity, and Codex:

1. `/seo-audit`: Deep site audit investigating real search opportunities and high-impact traffic levers.
2. `/keyword-research`: Keyword discovery, volume, search intent, and ranking opportunity scoring.
3. `/competitor-analysis`: Map competitor organic footprints, top URLs, content gaps, and backlinks.
4. `/keyword-clustering`: Cluster keywords by topical intent into actionable content silos.
5. `/link-prospecting`: Find high-authority backlink prospects, verify contacts, and draft outreach.
6. `/local-seo`: Audit Google Business Profiles and track rankings across local radius grids.
7. `/seo-coach`: Strategic recommendations and prioritizing quick wins versus long-term investments.
8. `/seo-report`: Generate executive-ready SEO performance reports in markdown and HTML.
9. `/seo-project-setup`: Configure domain baselines, tracked competitors, and seed keywords.
10. `/ai-visibility-audit`: Audit brand citations across ChatGPT, Perplexity, and Gemini.
11. `/ai-prompt-research`: Uncover questions and prompts buyers ask conversational AI models.
12. `/competitive-landscape`: Multi-domain competitive footprint and SERP share comparison.

## Local Quickstart

```bash
git clone https://github.com/foverse/seoverse.git
cd seoverse
pnpm install
pnpm run db:migrate:local
pnpm run build:report-widgets
pnpm run dev
```
