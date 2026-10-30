/**
 * SEO Studio - Frontend Application Controller
 * Handles UI interactions, live audit execution, tab navigation, SERP simulator, and report exports.
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
    btnModeUrl.addEventListener('click', () => {
      btnModeUrl.classList.replace('bg-slate-800', 'bg-blue-600');
      btnModeUrl.classList.replace('text-slate-300', 'text-white');
      btnModeHtml.classList.replace('bg-blue-600', 'bg-slate-800');
      btnModeHtml.classList.replace('text-white', 'text-slate-300');
      panelUrlMode.classList.remove('hidden');
      panelHtmlMode.classList.add('hidden');
    });

    btnModeHtml.addEventListener('click', () => {
      btnModeHtml.classList.replace('bg-slate-800', 'bg-blue-600');
      btnModeHtml.classList.replace('text-slate-300', 'text-white');
      btnModeUrl.classList.replace('bg-blue-600', 'bg-slate-800');
      btnModeUrl.classList.replace('text-white', 'text-slate-300');
      panelHtmlMode.classList.remove('hidden');
      panelUrlMode.classList.add('hidden');
    });

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
    btnRunHtmlAudit.addEventListener('click', () => {
      const html = inputRawHtml.value.trim();
      if (!html) {
        alert('Please enter or paste HTML code to analyze.');
        return;
      }
      runHtmlAudit(html, 'Pasted HTML');
    });

    // URL form submit
    urlAuditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = inputUrl.value.trim();
      if (!url) return;
      await runUrlAudit(url);
    });
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
            p.classList.remove('hidden');
          } else {
            p.classList.add('hidden');
          }
        });
      });
    });
  }

  // URL Audit Runner with multi-tier proxy support
  async function runUrlAudit(url) {
    showLoading(true);

    try {
      let html = '';
      
      // Tier 1: Check if local backend API is running (/api/audit)
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

    setTimeout(() => {
      try {
        const report = SEOAnalyzer.audit(html, pageUrl);
        currentAuditData = report;
        renderDashboard(report);
        showLoading(false);
      } catch (err) {
        alert(`Audit error: ${err.message}`);
        showLoading(false);
      }
    }, 150);
  }

  function showLoading(isLoading) {
    if (isLoading) {
      auditLoading.classList.remove('hidden');
      auditResults.classList.add('hidden');
    } else {
      auditLoading.classList.add('hidden');
      auditResults.classList.remove('hidden');
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

    // Color code circle based on score
    if (data.score >= 88) scoreCircle.style.stroke = '#10b981'; // Emerald
    else if (data.score >= 75) scoreCircle.style.stroke = '#3b82f6'; // Blue
    else if (data.score >= 60) scoreCircle.style.stroke = '#f59e0b'; // Amber
    else scoreCircle.style.stroke = '#f43f5e'; // Rose

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
      card.className = `p-4 rounded-xl border transition issue-item ${getIssueBorderClass(item.severity)}`;
      card.setAttribute('data-severity', item.severity);

      card.innerHTML = `
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start space-x-3">
            <span class="mt-0.5">${getIssueIcon(item.severity)}</span>
            <div>
              <div class="flex items-center space-x-2">
                <h4 class="text-sm font-semibold text-white">${escapeHtml(item.title)}</h4>
                <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${getIssueBadgeClass(item.severity)}">${item.severity}</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">${escapeHtml(item.description)}</p>
              ${item.recommendation ? `
                <div class="mt-2 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-blue-300 flex items-start space-x-2">
                  <i data-lucide="lightbulb" class="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5"></i>
                  <span><strong>Fix:</strong> ${escapeHtml(item.recommendation)}</span>
                </div>
              ` : ''}
              ${item.details && item.details.length ? `
                <ul class="mt-2 text-[11px] text-slate-500 font-mono space-y-0.5 list-disc list-inside">
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
        filterBtns.forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white');
          b.classList.add('bg-slate-800', 'text-slate-300');
        });
        btn.classList.add('bg-blue-600', 'text-white');
        btn.classList.remove('bg-slate-800', 'text-slate-300');

        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.issue-item').forEach(el => {
          const sev = el.getAttribute('data-severity');
          if (filter === 'all' || sev === filter) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        });
      };
    });
  }

  function getIssueBorderClass(sev) {
    switch (sev) {
      case 'critical': return 'border-rose-900/40 bg-rose-950/10';
      case 'warning': return 'border-amber-900/40 bg-amber-950/10';
      case 'info': return 'border-blue-900/40 bg-blue-950/10';
      case 'passed': return 'border-emerald-900/30 bg-emerald-950/10';
      default: return 'border-slate-800 bg-slate-900/40';
    }
  }

  function getIssueBadgeClass(sev) {
    switch (sev) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'passed': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      default: return 'bg-slate-800 text-slate-400';
    }
  }

  function getIssueIcon(sev) {
    switch (sev) {
      case 'critical': return '<i data-lucide="alert-octagon" class="w-4 h-4 text-rose-500"></i>';
      case 'warning': return '<i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i>';
      case 'info': return '<i data-lucide="info" class="w-4 h-4 text-blue-400"></i>';
      case 'passed': return '<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>';
      default: return '<i data-lucide="circle" class="w-4 h-4 text-slate-500"></i>';
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
      document.getElementById('serp-preview-url-desktop').textContent = url || 'https://example.com';

      // Mobile
      document.getElementById('serp-preview-title-mobile').textContent = title || 'Untitled Page';
      document.getElementById('serp-preview-snippet-mobile').textContent = desc || 'No description provided.';
      document.getElementById('serp-preview-url-mobile').textContent = url || 'https://example.com';

      // Host name
      let host = 'example.com';
      try { host = new URL(url).hostname; } catch {}
      document.getElementById('serp-preview-sitename').textContent = host;
      document.getElementById('serp-preview-sitename-mobile').textContent = host;

      // Pixel Width Calculations
      const titlePx = SEOTools.calculateTitlePixelWidth(title);
      const titleMax = 600;
      const titlePct = Math.min(100, Math.round((titlePx / titleMax) * 100));
      const titleMeter = document.getElementById('meter-serp-title');
      titleMeter.style.width = `${titlePct}%`;
      titleMeter.style.backgroundColor = titlePx > 580 ? '#f43f5e' : (titlePx < 250 ? '#f59e0b' : '#3b82f6');
      document.getElementById('serp-title-pixel-count').textContent = `${titlePx}px / ~600px (${title.length} chars)`;

      const descPx = SEOTools.calculateSnippetPixelWidth(desc);
      const descMax = 960;
      const descPct = Math.min(100, Math.round((descPx / descMax) * 100));
      const descMeter = document.getElementById('meter-serp-desc');
      descMeter.style.width = `${descPct}%`;
      descMeter.style.backgroundColor = descPx > 960 ? '#f43f5e' : (descPx < 400 ? '#f59e0b' : '#10b981');
      document.getElementById('serp-desc-pixel-count').textContent = `${descPx}px / ~960px (${desc.length} chars)`;
    };

    editTitle.addEventListener('input', updatePreviews);
    editUrl.addEventListener('input', updatePreviews);
    editDesc.addEventListener('input', updatePreviews);
  }

  function syncSerpSimulator(meta, pageUrl) {
    const editTitle = document.getElementById('editor-serp-title');
    const editUrl = document.getElementById('editor-serp-url');
    const editDesc = document.getElementById('editor-serp-desc');

    editTitle.value = meta.title || '';
    editUrl.value = pageUrl || meta.canonical || 'https://example.com';
    editDesc.value = meta.description || '';

    // Trigger input event
    editTitle.dispatchEvent(new Event('input'));
  }

  // Headings Tree
  function renderHeadingsTree(headings) {
    const container = document.getElementById('heading-tree-container');
    container.innerHTML = '';

    if (!headings.all || headings.all.length === 0) {
      container.innerHTML = '<p class="text-xs text-slate-500">No HTML headings (H1-H6) detected on this page.</p>';
      return;
    }

    headings.all.forEach(h => {
      const node = document.createElement('div');
      const indent = (h.level - 1) * 1.5;
      node.className = 'heading-tree-node flex items-center space-x-2 text-xs';
      node.style.marginLeft = `${indent}rem`;

      node.innerHTML = `
        <span class="heading-tag-badge heading-${h.tag}">${h.tag.toUpperCase()}</span>
        <span class="text-slate-200 font-medium">${escapeHtml(h.text || '[Empty Heading Text]')}</span>
      `;
      container.appendChild(node);
    });
  }

  // Keyword Tables
  function renderKeywordTables(keywords) {
    const uniList = document.getElementById('keywords-unigrams-list');
    const biList = document.getElementById('keywords-bigrams-list');
    const triList = document.getElementById('keywords-trigrams-list');

    uniList.innerHTML = renderNgramItems(keywords.unigrams);
    biList.innerHTML = renderNgramItems(keywords.bigrams);
    triList.innerHTML = renderNgramItems(keywords.trigrams);
  }

  function renderNgramItems(items) {
    if (!items || items.length === 0) {
      return '<p class="text-slate-500 text-xs">No frequent terms found.</p>';
    }
    return items.map(item => `
      <div class="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
        <span class="font-medium text-slate-300 truncate max-w-[160px]">${escapeHtml(item.phrase)}</span>
        <div class="flex items-center space-x-2">
          <span class="text-slate-500 font-mono">${item.count}x</span>
          <span class="px-1.5 py-0.5 rounded font-mono text-[10px] ${parseFloat(item.density) > 3.5 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-blue-400'}">${item.density}%</span>
        </div>
      </div>
    `).join('');
  }

  // Social Previews
  function renderSocialPreviews(social, meta, pageUrl) {
    const fallbackImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200';
    let host = 'example.com';
    try { host = new URL(pageUrl).hostname; } catch {}

    // Facebook
    document.getElementById('og-preview-host').textContent = host.toUpperCase();
    document.getElementById('og-preview-title').textContent = social.og.title || meta.title || 'Page Title';
    document.getElementById('og-preview-desc').textContent = social.og.description || meta.description || 'Description text...';
    document.getElementById('og-preview-image').src = social.og.image || fallbackImage;

    // Twitter
    document.getElementById('tw-preview-host').textContent = host;
    document.getElementById('tw-preview-title').textContent = social.twitter.title || social.og.title || meta.title || 'Page Title';
    document.getElementById('tw-preview-desc').textContent = social.twitter.description || social.og.description || meta.description || 'Description text...';
    document.getElementById('tw-preview-image').src = social.twitter.image || social.og.image || fallbackImage;
  }

  // Generators & Tools
  function initGenerators() {
    const schemaSelect = document.getElementById('tool-schema-type');
    const schemaOutput = document.getElementById('tool-schema-output');

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

    // Copy Schema
    document.getElementById('btn-copy-schema').addEventListener('click', () => {
      copyToClipboard(schemaOutput.textContent, 'Schema.org JSON-LD copied!');
    });

    // Robots Presets
    const robotsOutput = document.getElementById('tool-robots-output');
    robotsOutput.textContent = SEOTools.RobotsGenerator.presets.standard;

    document.querySelectorAll('.tool-robots-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-preset');
        robotsOutput.textContent = SEOTools.RobotsGenerator.presets[p] || '';
      });
    });

    document.getElementById('btn-copy-robots').addEventListener('click', () => {
      copyToClipboard(robotsOutput.textContent, 'robots.txt copied!');
    });

    // XML Sitemap
    const sitemapOutput = document.getElementById('tool-sitemap-output');
    sitemapOutput.textContent = SEOTools.SitemapGenerator.generate(['https://example.com/']);

    document.getElementById('btn-generate-sitemap').addEventListener('click', () => {
      if (currentAuditData && currentAuditData.links) {
        const urls = [currentAuditData.url || 'https://example.com/'];
        sitemapOutput.textContent = SEOTools.SitemapGenerator.generate(urls);
      }
    });

    document.getElementById('btn-copy-sitemap').addEventListener('click', () => {
      copyToClipboard(sitemapOutput.textContent, 'Sitemap XML copied!');
    });
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
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
      window.print();
    });

    // JSON Download
    document.getElementById('btn-export-json').addEventListener('click', () => {
      if (!currentAuditData) return;
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentAuditData, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', `seo-audit-${Date.now()}.json`);
      dlAnchor.click();
    });

    // Copy Markdown Summary
    document.getElementById('btn-copy-markdown').addEventListener('click', () => {
      if (!currentAuditData) return;
      const md = generateMarkdownReport(currentAuditData);
      copyToClipboard(md, 'Markdown report copied to clipboard!');
    });
  }

  function initAboutModal() {
    const modal = document.getElementById('about-modal');
    const openBtn = document.getElementById('btn-open-about');
    const footerBtn = document.getElementById('footer-btn-about');
    const closeBtn = document.getElementById('btn-close-about-modal');

    const showModal = () => {
      if (modal) {
        modal.classList.remove('hidden');
        initIcons();
      }
    };

    const hideModal = () => {
      if (modal) modal.classList.add('hidden');
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
*Generated by Fouad's SEO Toolkit (https://github.com/fouad01/seo)*
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
