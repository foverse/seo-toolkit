/**
 * SEO Studio - Frontend Application Controller
 * Handles UI interactions, live audit execution, tab navigation, SERP simulator, and report exports.
 * Follows tasteskill v2 design standards.
 */

(function () {
  'use strict';

  let currentAuditData = null;
  let currentRawHtml = '';

  // DOM Elements
  const btnModeUrl = document.getElementById('btn-mode-url');
  const btnModeHtml = document.getElementById('btn-mode-html');
  const panelUrlMode = document.getElementById('panel-url-mode');
  const panelHtmlMode = document.getElementById('panel-html-mode');
  const urlAuditForm = document.getElementById('url-audit-form');
  const inputUrl = document.getElementById('input-url');
  const inputRawHtml = document.getElementById('input-raw-html');
  const inputFile = document.getElementById('input-file');
  const btnRunHtmlAudit = document.getElementById('btn-run-html-audit');
  const auditLoading = document.getElementById('audit-loading');
  const auditResults = document.getElementById('audit-results');

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    initTabNavigation();
    initModeSwitcher();
    initPresets();
    initSerpLiveEditor();
    initGenerators();
    initExportButtons();
    initAboutModal();
    initStageshowModal();

    // Run initial demo audit with the E-Commerce sample
    loadPreset('ecommerce');
  });

  function initIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  // Switch between URL and HTML input modes
  function initModeSwitcher() {
    if (btnModeUrl && btnModeHtml) {
      btnModeUrl.addEventListener('click', () => {
        btnModeUrl.classList.add('active');
        btnModeHtml.classList.remove('active');
        panelUrlMode.style.display = 'block';
        panelUrlMode.classList.remove('hidden');
        panelHtmlMode.style.display = 'none';
        panelHtmlMode.classList.add('hidden');
      });

      btnModeHtml.addEventListener('click', () => {
        btnModeHtml.classList.add('active');
        btnModeUrl.classList.remove('active');
        panelHtmlMode.style.display = 'block';
        panelHtmlMode.classList.remove('hidden');
        panelUrlMode.style.display = 'none';
        panelUrlMode.classList.add('hidden');
      });
    }

    // File upload
    if (inputFile) {
      inputFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            inputRawHtml.value = evt.target.result;
            runHtmlAudit(inputRawHtml.value, file.name);
          };
          reader.readAsText(file);
        }
      });
    }

    // HTML button
    if (btnRunHtmlAudit) {
      btnRunHtmlAudit.addEventListener('click', () => {
        const html = inputRawHtml.value.trim();
        if (!html) {
          alert('Please enter or paste HTML code to analyze.');
          return;
        }
        runHtmlAudit(html, 'Pasted HTML');
      });
    }

    // URL form submit
    if (urlAuditForm) {
      urlAuditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = inputUrl.value.trim();
        if (!url) return;
        await runUrlAudit(url);
      });
    }
  }

  // Quick Preset Handlers
  function initPresets() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        loadPreset(presetKey);
      });
    });

    const btnQuickTour = document.getElementById('btn-quick-tour');
    if (btnQuickTour) {
      btnQuickTour.addEventListener('click', () => {
        loadPreset('ecommerce');
      });
    }
  }

  function loadPreset(presetKey) {
    if (typeof SEOSamples === 'undefined' || !SEOSamples[presetKey]) return;
    const sample = SEOSamples[presetKey];
    inputUrl.value = sample.url;
    inputRawHtml.value = sample.html;
    runHtmlAudit(sample.html, sample.url);
  }

  // Tab Navigation
  function initTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetId = btn.getAttribute('data-target');
        panes.forEach(p => {
          if (p.id === targetId) {
            p.style.display = 'block';
            p.classList.remove('hidden');
          } else {
            p.style.display = 'none';
            p.classList.add('hidden');
          }
        });
        initIcons();
      });
    });
  }

  // URL Audit Runner with multi-tier proxy support
  async function runUrlAudit(url) {
    showLoading(true);

    try {
      let html = '';

      // Tier 0: Instant offline matching with preset samples (100% offline local)
      if (typeof SEOSamples !== 'undefined') {
        for (const k of Object.keys(SEOSamples)) {
          if (SEOSamples[k] && (SEOSamples[k].url === url || (url && url.includes('soundcraft.com')))) {
            html = SEOSamples[k].html;
            break;
          }
        }
      }
      
      // Tier 1: Check if local backend API is running (/api/audit)
      if (!html) {
        try {
          const localRes = await fetch(`/api/audit?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(4000) });
          if (localRes.ok) {
            const json = await localRes.json();
            if (json.html) {
              html = json.html;
            }
          }
        } catch (e) {
          // Local server not available, fall back to client proxies
        }
      }

      // Tier 2: Public CORS relay fallback
      if (!html) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(7000) });
        if (res.ok) {
          html = await res.text();
        }
      }

      if (!html) {
        throw new Error('Unable to fetch URL due to cross-origin restrictions.');
      }

      runHtmlAudit(html, url);
    } catch (err) {
      alert(`Could not fetch the URL directly due to CORS restrictions: "${err.message}"\n\nTip: You can view the page source, copy it, and paste into the "Paste / Upload HTML" tab for an instant offline audit!`);
      showLoading(false);
    }
  }

  // Core Audit Runner
  function runHtmlAudit(html, pageUrl) {
    showLoading(true);
    currentRawHtml = html;

    try {
      const report = SEOAnalyzer.audit(html, pageUrl);
      currentAuditData = report;
      renderDashboard(report);
      showLoading(false);
    } catch (err) {
      alert(`Audit error: ${err.message}`);
      showLoading(false);
    }
  }

  function showLoading(isLoading) {
    if (isLoading) {
      if (auditLoading) {
        auditLoading.style.display = 'block';
        auditLoading.classList.remove('hidden');
      }
      if (auditResults) {
        auditResults.style.display = 'none';
        auditResults.classList.add('hidden');
      }
    } else {
      if (auditLoading) {
        auditLoading.style.display = 'none';
        auditLoading.classList.add('hidden');
      }
      if (auditResults) {
        auditResults.style.display = 'block';
        auditResults.classList.remove('hidden');
      }
      initIcons();
    }
  }

  // Render Full Dashboard
  function renderDashboard(data) {
    // 1. Overall Score & Circular Gauge
    const scoreNum = document.getElementById('score-number');
    const scoreCircle = document.getElementById('score-circle-bar');
    const gradeBadge = document.getElementById('score-grade-badge');
    const gradeLabel = document.getElementById('score-grade-label');
    const pageAuditedUrl = document.getElementById('page-audited-url');

    scoreNum.textContent = data.score;
    gradeBadge.textContent = data.grade.letter;
    gradeLabel.textContent = data.grade.label;
    pageAuditedUrl.textContent = data.url;

    // Circumference = 2 * PI * 50 = 314.16
    const circumference = 314.16;
    const offset = circumference - (data.score / 100) * circumference;
    scoreCircle.style.strokeDashoffset = offset;

    // Color code circle based on score tokens
    if (data.score >= 88) {
      scoreCircle.style.stroke = 'var(--positive)';
      gradeBadge.className = 'score-grade-badge pill pos';
    } else if (data.score >= 75) {
      scoreCircle.style.stroke = 'var(--accent)';
      gradeBadge.className = 'score-grade-badge pill neutral';
    } else if (data.score >= 60) {
      scoreCircle.style.stroke = 'var(--warning)';
      gradeBadge.className = 'score-grade-badge pill warn';
    } else {
      scoreCircle.style.stroke = 'var(--negative)';
      gradeBadge.className = 'score-grade-badge pill neg';
    }

    // 2. Issue Counters
    const critCount = data.issues.filter(i => i.severity === 'critical').length;
    const warnCount = data.issues.filter(i => i.severity === 'warning').length;
    const passCount = data.passed.length;

    document.getElementById('badge-crit-count').textContent = critCount;
    document.getElementById('badge-warn-count').textContent = warnCount;
    document.getElementById('badge-pass-count').textContent = passCount;

    // 3. Category Progress Bars
    const cats = data.categoryScores;
    renderCatBar('meta', cats.meta);
    renderCatBar('content', cats.content);
    renderCatBar('images', cats.images);
    renderCatBar('links', cats.links);
    renderCatBar('social', cats.social);
    renderCatBar('technical', cats.technical);

    // 4. Metric Chips
    document.getElementById('stat-words').textContent = data.metrics.wordCount.toLocaleString();
    document.getElementById('stat-read-time').textContent = `${data.metrics.readingTimeMinutes}m`;
    document.getElementById('stat-h1').textContent = data.metrics.h1Count;
    document.getElementById('stat-headings').textContent = data.metrics.headingsTotal;
    document.getElementById('stat-images').textContent = data.metrics.totalImages;
    document.getElementById('stat-missing-alt').textContent = data.metrics.imagesWithoutAlt;
    document.getElementById('stat-links').textContent = data.metrics.totalLinks;
    document.getElementById('stat-schemas').textContent = data.metrics.schemasFound;

    // 5. Issues List
    renderIssuesList(data.issues, data.passed);

    // 6. SERP Simulator Sync
    syncSerpSimulator(data.meta, data.url);

    // 7. Headings Tree
    renderHeadingsTree(data.headings);

    // 8. Keyword Density
    renderKeywordTables(data.keywords);

    // 9. Social Previews
    renderSocialPreviews(data.social, data.meta, data.url);

    // 10. Generators
    syncGenerators(data);
  }

  function renderCatBar(catKey, catData) {
    if (!catData) return;
    const scoreEl = document.getElementById(`cat-score-${catKey}`);
    const barEl = document.getElementById(`cat-bar-${catKey}`);
    if (scoreEl) scoreEl.textContent = `${catData.percentage}%`;
    if (barEl) barEl.style.width = `${catData.percentage}%`;
  }

  // Render Issues List with Filter Tabs
  function renderIssuesList(issues, passed) {
    const container = document.getElementById('issues-list-container');
    container.innerHTML = '';

    const allItems = [
      ...issues.map(i => ({ ...i, isPassed: false })),
      ...passed.map(p => ({ ...p, severity: 'passed', isPassed: true }))
    ];

    allItems.forEach(item => {
      const card = document.createElement('div');
      card.className = `issue-item ${getIssueBorderClass(item.severity)}`;
      card.setAttribute('data-severity', item.severity);

      card.innerHTML = `
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
          <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
            <span style="margin-top: 2px;">${getIssueIcon(item.severity)}</span>
            <div style="flex: 1;">
              <div class="issue-title-row">
                <h4>${escapeHtml(item.title)}</h4>
                <span class="pill ${getIssueBadgeClass(item.severity)}">${item.severity}</span>
              </div>
              <p class="issue-desc">${escapeHtml(item.description)}</p>
              ${item.recommendation ? `
                <div class="issue-fix-box">
                  <i data-lucide="lightbulb" style="width: 14px; height: 14px; color: var(--accent); flex-shrink: 0; margin-top: 2px;"></i>
                  <span><strong>Fix:</strong> ${escapeHtml(item.recommendation)}</span>
                </div>
              ` : ''}
              ${item.details && item.details.length ? `
                <ul style="margin: 8px 0 0 0; padding-left: 18px; font-size: 12px; color: var(--muted); font-family: var(--font-mono); line-height: 1.4;">
                  ${item.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Initialize issue filter buttons
    const filterBtns = document.querySelectorAll('.filter-issue-btn');
    filterBtns.forEach(btn => {
      btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.issue-item').forEach(el => {
          const sev = el.getAttribute('data-severity');
          if (filter === 'all' || sev === filter) {
            el.style.display = 'block';
          } else {
            el.style.display = 'none';
          }
        });
      };
    });

    initIcons();
  }

  function getIssueBorderClass(sev) {
    switch (sev) {
      case 'critical': return 'border-rose-900/40';
      case 'warning': return 'border-amber-900/40';
      case 'passed': return 'border-emerald-900/30';
      default: return '';
    }
  }

  function getIssueBadgeClass(sev) {
    switch (sev) {
      case 'critical': return 'neg';
      case 'warning': return 'warn';
      case 'passed': return 'pos';
      default: return 'neutral';
    }
  }

  function getIssueIcon(sev) {
    switch (sev) {
      case 'critical': return '<i data-lucide="alert-octagon" style="width: 16px; height: 16px; color: var(--negative);"></i>';
      case 'warning': return '<i data-lucide="alert-triangle" style="width: 16px; height: 16px; color: var(--warning);"></i>';
      case 'info': return '<i data-lucide="info" style="width: 16px; height: 16px; color: var(--accent);"></i>';
      case 'passed': return '<i data-lucide="check-circle-2" style="width: 16px; height: 16px; color: var(--positive);"></i>';
      default: return '<i data-lucide="circle" style="width: 16px; height: 16px; color: var(--muted);"></i>';
    }
  }

  // SERP Live Simulator
  function initSerpLiveEditor() {
    const editTitle = document.getElementById('editor-serp-title');
    const editUrl = document.getElementById('editor-serp-url');
    const editDesc = document.getElementById('editor-serp-desc');

    const updatePreviews = () => {
      const title = editTitle.value;
      const url = editUrl.value;
      const desc = editDesc.value;

      // Desktop
      document.getElementById('serp-preview-title-desktop').textContent = title || 'Untitled Page';
      document.getElementById('serp-preview-snippet-desktop').textContent = desc || 'No description provided.';
      document.getElementById('serp-preview-url-desktop').textContent = url || 'https://shop.soundcraft.com/products/pro-wireless-headphones';

      // Mobile
      document.getElementById('serp-preview-title-mobile').textContent = title || 'Untitled Page';
      document.getElementById('serp-preview-snippet-mobile').textContent = desc || 'No description provided.';
      document.getElementById('serp-preview-url-mobile').textContent = url || 'https://shop.soundcraft.com/products/pro-wireless-headphones';

      // Host name
      let host = 'soundcraft.com';
      try { host = new URL(url).hostname; } catch {}
      document.getElementById('serp-preview-sitename').textContent = host;
      document.getElementById('serp-preview-sitename-mobile').textContent = host;

      // Pixel Width Calculations
      const titlePx = SEOTools.calculateTitlePixelWidth(title);
      const titleMax = 600;
      const titlePct = Math.min(100, Math.round((titlePx / titleMax) * 100));
      const titleMeter = document.getElementById('meter-serp-title');
      titleMeter.style.width = `${titlePct}%`;
      titleMeter.style.backgroundColor = titlePx > 580 ? 'var(--negative)' : (titlePx < 250 ? 'var(--warning)' : 'var(--chart-2)');
      document.getElementById('serp-title-pixel-count').textContent = `${titlePx}px / ~600px (${title.length} chars)`;

      const descPx = SEOTools.calculateSnippetPixelWidth(desc);
      const descMax = 960;
      const descPct = Math.min(100, Math.round((descPx / descMax) * 100));
      const descMeter = document.getElementById('meter-serp-desc');
      descMeter.style.width = `${descPct}%`;
      descMeter.style.backgroundColor = descPx > 960 ? 'var(--negative)' : (descPx < 400 ? 'var(--warning)' : 'var(--positive)');
      document.getElementById('serp-desc-pixel-count').textContent = `${descPx}px / ~960px (${desc.length} chars)`;
    };

    if (editTitle && editUrl && editDesc) {
      editTitle.addEventListener('input', updatePreviews);
      editUrl.addEventListener('input', updatePreviews);
      editDesc.addEventListener('input', updatePreviews);
    }
  }

  function syncSerpSimulator(meta, pageUrl) {
    const editTitle = document.getElementById('editor-serp-title');
    const editUrl = document.getElementById('editor-serp-url');
    const editDesc = document.getElementById('editor-serp-desc');

    if (editTitle && editUrl && editDesc) {
      editTitle.value = meta.title || '';
      editUrl.value = pageUrl || meta.canonical || 'https://shop.soundcraft.com/products/pro-wireless-headphones';
      editDesc.value = meta.description || '';
      editTitle.dispatchEvent(new Event('input'));
    }
  }

  // Headings Tree
  function renderHeadingsTree(headings) {
    const container = document.getElementById('heading-tree-container');
    container.innerHTML = '';

    if (!headings.all || headings.all.length === 0) {
      container.innerHTML = '<p style="font-size: 13px; color: var(--muted); margin: 0;">No HTML headings (H1-H6) detected on this page.</p>';
      return;
    }

    headings.all.forEach(h => {
      const node = document.createElement('div');
      const indent = (h.level - 1) * 1.5;
      node.className = 'heading-tree-node';
      node.style.marginLeft = `${indent}rem`;

      node.innerHTML = `
        <span class="heading-tag-badge heading-${h.tag}">${h.tag.toUpperCase()}</span>
        <span style="font-weight: 500; color: var(--text);">${escapeHtml(h.text || '[Empty Heading Text]')}</span>
      `;
      container.appendChild(node);
    });
  }

  // Keyword Tables
  function renderKeywordTables(keywords) {
    const uniList = document.getElementById('keywords-unigrams-list');
    const biList = document.getElementById('keywords-bigrams-list');
    const triList = document.getElementById('keywords-trigrams-list');

    if (uniList) uniList.innerHTML = renderNgramItems(keywords.unigrams);
    if (biList) biList.innerHTML = renderNgramItems(keywords.bigrams);
    if (triList) triList.innerHTML = renderNgramItems(keywords.trigrams);
  }

  function renderNgramItems(items) {
    if (!items || items.length === 0) {
      return '<p style="color: var(--muted); font-size: 12px; margin: 0;">No frequent terms found.</p>';
    }
    return items.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--raised); border: 1px solid var(--border); border-radius: 4px; font-size: 13px;">
        <span style="font-weight: 500; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">${escapeHtml(item.phrase)}</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: var(--muted); font-variant-numeric: tabular-nums;">${item.count}x</span>
          <span class="pill ${parseFloat(item.density) > 3.5 ? 'neg' : 'neutral'}" style="font-variant-numeric: tabular-nums;">${item.density}%</span>
        </div>
      </div>
    `).join('');
  }

  // Social Previews
  function renderSocialPreviews(social, meta, pageUrl) {
    const fallbackImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200';
    let host = 'soundcraft.com';
    try { host = new URL(pageUrl).hostname; } catch {}

    // Facebook / OpenGraph
    const ogHost = document.getElementById('og-preview-host');
    const ogTitle = document.getElementById('og-preview-title');
    const ogDesc = document.getElementById('og-preview-desc');
    const ogImg = document.getElementById('og-preview-image');

    if (ogHost) ogHost.textContent = host.toUpperCase();
    if (ogTitle) ogTitle.textContent = social.og.title || meta.title || 'Page Title';
    if (ogDesc) ogDesc.textContent = social.og.description || meta.description || 'Description text...';
    if (ogImg) ogImg.src = social.og.image || fallbackImage;

    // Twitter
    const twHost = document.getElementById('tw-preview-host');
    const twTitle = document.getElementById('tw-preview-title');
    const twDesc = document.getElementById('tw-preview-desc');
    const twImg = document.getElementById('tw-preview-image');

    if (twHost) twHost.textContent = host;
    if (twTitle) twTitle.textContent = social.twitter.title || social.og.title || meta.title || 'Page Title';
    if (twDesc) twDesc.textContent = social.twitter.description || social.og.description || meta.description || 'Description text...';
    if (twImg) twImg.src = social.twitter.image || social.og.image || fallbackImage;
  }

  // Generators & Tools
  function initGenerators() {
    const schemaSelect = document.getElementById('tool-schema-type');
    const schemaOutput = document.getElementById('tool-schema-output');

    if (schemaSelect && schemaOutput) {
      const updateSchema = () => {
        const type = schemaSelect.value;
        let json = {};
        if (type === 'faq') {
          json = SEOTools.SchemaGenerator.faq();
        } else if (type === 'product') {
          json = SEOTools.SchemaGenerator.product({});
        } else if (type === 'article') {
          json = SEOTools.SchemaGenerator.article({});
        } else if (type === 'localBusiness') {
          json = SEOTools.SchemaGenerator.localBusiness({});
        } else if (type === 'breadcrumbs') {
          json = SEOTools.SchemaGenerator.breadcrumbs();
        }
        schemaOutput.textContent = JSON.stringify(json, null, 2);
      };

      schemaSelect.addEventListener('change', updateSchema);
      updateSchema();
    }

    // Copy Schema
    const btnCopySchema = document.getElementById('btn-copy-schema');
    if (btnCopySchema && schemaOutput) {
      btnCopySchema.addEventListener('click', () => {
        copyToClipboard(schemaOutput.textContent, 'Schema.org JSON-LD copied!');
      });
    }

    // Robots Presets
    const robotsOutput = document.getElementById('tool-robots-output');
    if (robotsOutput) {
      robotsOutput.textContent = SEOTools.RobotsGenerator.presets.standard;

      document.querySelectorAll('.tool-robots-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = btn.getAttribute('data-preset');
          robotsOutput.textContent = SEOTools.RobotsGenerator.presets[p] || '';
        });
      });
    }

    const btnCopyRobots = document.getElementById('btn-copy-robots');
    if (btnCopyRobots && robotsOutput) {
      btnCopyRobots.addEventListener('click', () => {
        copyToClipboard(robotsOutput.textContent, 'robots.txt copied!');
      });
    }

    // XML Sitemap
    const sitemapOutput = document.getElementById('tool-sitemap-output');
    if (sitemapOutput) {
      sitemapOutput.textContent = SEOTools.SitemapGenerator.generate(['https://shop.soundcraft.com/']);

      const btnGenSitemap = document.getElementById('btn-generate-sitemap');
      if (btnGenSitemap) {
        btnGenSitemap.addEventListener('click', () => {
          if (currentAuditData && currentAuditData.links) {
            const urls = [currentAuditData.url || 'https://shop.soundcraft.com/'];
            sitemapOutput.textContent = SEOTools.SitemapGenerator.generate(urls);
          }
        });
      }

      const btnCopySitemap = document.getElementById('btn-copy-sitemap');
      if (btnCopySitemap) {
        btnCopySitemap.addEventListener('click', () => {
          copyToClipboard(sitemapOutput.textContent, 'Sitemap XML copied!');
        });
      }
    }
  }

  function syncGenerators(data) {
    const sitemapOutput = document.getElementById('tool-sitemap-output');
    if (sitemapOutput && data.url) {
      sitemapOutput.textContent = SEOTools.SitemapGenerator.generate([data.url]);
    }
  }

  // Export Handlers
  function initExportButtons() {
    // Print / PDF
    const btnExportPdf = document.getElementById('btn-export-pdf');
    if (btnExportPdf) {
      btnExportPdf.addEventListener('click', () => {
        window.print();
      });
    }

    // JSON Download
    const btnExportJson = document.getElementById('btn-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        if (!currentAuditData) return;
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentAuditData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', `seo-audit-${Date.now()}.json`);
        dlAnchor.click();
      });
    }

    // Copy Markdown Summary
    const btnCopyMarkdown = document.getElementById('btn-copy-markdown');
    if (btnCopyMarkdown) {
      btnCopyMarkdown.addEventListener('click', () => {
        if (!currentAuditData) return;
        const md = generateMarkdownReport(currentAuditData);
        copyToClipboard(md, 'Markdown report copied to clipboard!');
      });
    }
  }

  function initAboutModal() {
    const modal = document.getElementById('about-modal');
    const openBtn = document.getElementById('btn-open-about');
    const footerBtn = document.getElementById('footer-btn-about');
    const closeBtn = document.getElementById('btn-close-about-modal');

    const showModal = () => {
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        initIcons();
      }
    };

    const hideModal = () => {
      if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
      }
    };

    if (openBtn) openBtn.addEventListener('click', showModal);
    if (footerBtn) footerBtn.addEventListener('click', showModal);
    if (closeBtn) closeBtn.addEventListener('click', hideModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
      });
    }
  }

  function initStageshowModal() {
    const modal = document.getElementById('stageshow-modal');
    const openBtn = document.getElementById('btn-open-stageshow');
    const closeBtn = document.getElementById('btn-close-stageshow-modal');
    const container = document.getElementById('stageshow-container');
    let playerInstance = null;

    const showModal = () => {
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        initIcons();
        if (typeof window.createStageshowPlayer === 'function' && container) {
          if (playerInstance) playerInstance.destroy();
          playerInstance = window.createStageshowPlayer(container);
        }
      }
    };

    const hideModal = () => {
      if (modal) {
        modal.style.display = 'none';
        modal.classList.add('hidden');
        if (playerInstance) {
          playerInstance.destroy();
          playerInstance = null;
        }
      }
    };

    if (openBtn) openBtn.addEventListener('click', showModal);
    if (closeBtn) closeBtn.addEventListener('click', hideModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
      });
    }
  }

  function generateMarkdownReport(d) {
    return `# SEO Audit Report
- **URL**: ${d.url}
- **Score**: ${d.score}/100 (${d.grade.letter}: ${d.grade.label})
- **Timestamp**: ${d.timestamp}

## Key Metrics
- Words: ${d.metrics.wordCount} (~${d.metrics.readingTimeMinutes} min read)
- Headings: H1: ${d.metrics.h1Count}, Total: ${d.metrics.headingsTotal}
- Images: ${d.metrics.totalImages} (${d.metrics.imagesWithoutAlt} missing alt)
- Links: ${d.metrics.totalLinks} (${d.metrics.internalLinks} internal, ${d.metrics.externalLinks} external)
- Schemas: ${d.metrics.schemasFound} detected

## Issues Summary
- Critical: ${d.issues.filter(i => i.severity === 'critical').length}
- Warnings: ${d.issues.filter(i => i.severity === 'warning').length}
- Passed: ${d.passed.length}

### Action Items
${d.issues.map(i => `- [${i.severity.toUpperCase()}] **${i.title}**: ${i.description}\n  *Fix*: ${i.recommendation}`).join('\n')}

---
*Generated by Fouad's SEO Toolkit (https://github.com/foverse/seo-toolkit)*
`;
  }

  function copyToClipboard(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      alert(successMsg || 'Copied to clipboard!');
    }).catch(() => {
      prompt('Copy the content below:', text);
    });
  }

  function escapeHtml(str) {
    return SEOTools.escapeHtml(str);
  }

})();
