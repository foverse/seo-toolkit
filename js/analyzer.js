/**
 * SEO Studio - Core Analyzer Engine
 * Comprehensive on-page SEO auditor, scoring algorithm, keyword extractor, and structure validator.
 * Compatible with both Browser (DOMParser) and Node.js (via minimal DOM or Cheerio).
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SEOAnalyzer = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Common English and International Stop Words for Keyword Extraction
  const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
    'did', 'do', 'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
    'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
    'is', 'isn\'t', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now',
    'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
    'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
    'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
    'we', 'were', 'weren\'t', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'won\'t', 'would',
    'you', 'your', 'yours', 'yourself', 'yourselves', 'de', 'la', 'le', 'et', 'en', 'un', 'une', 'des', 'du', 'les'
  ]);

  /**
   * Main audit function
   * @param {string|Document} htmlSource - Raw HTML string or DOM Document
   * @param {string} [pageUrl=''] - The target URL being audited
   * @returns {Object} Complete SEO Audit Report
   */
  function audit(htmlSource, pageUrl = '') {
    let doc;
    let rawHtml = '';

    if (typeof htmlSource === 'string') {
      rawHtml = htmlSource;
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        doc = parser.parseFromString(rawHtml, 'text/html');
      } else {
        throw new Error('DOMParser is not available. Please pass a parsed DOM document or Cheerio equivalent in Node.');
      }
    } else if (htmlSource && htmlSource.querySelector) {
      doc = htmlSource;
      rawHtml = doc.documentElement ? doc.documentElement.outerHTML : '';
    } else {
      throw new Error('Invalid HTML input.');
    }

    const issues = [];
    const passed = [];

    // 1. Meta & Indexability
    const meta = analyzeMeta(doc, rawHtml, pageUrl, issues, passed);

    // 2. Headings & Hierarchy
    const headings = analyzeHeadings(doc, issues, passed);

    // 3. Content & Readability
    const content = analyzeContent(doc, rawHtml, issues, passed);

    // 4. Keyword Density & N-Grams
    const keywords = analyzeKeywords(content.plainText);

    // 5. Images Optimization
    const images = analyzeImages(doc, issues, passed);

    // 6. Links Architecture
    const links = analyzeLinks(doc, pageUrl, issues, passed);

    // 7. Social Media (Open Graph & Twitter)
    const social = analyzeSocial(doc, issues, passed);

    // 8. Technical & Schema
    const technical = analyzeTechnical(doc, rawHtml, pageUrl, issues, passed);

    // Calculate Scores
    const scores = calculateScores(issues, passed);

    return {
      url: pageUrl || meta.canonical || 'Local / Input Page',
      timestamp: new Date().toISOString(),
      score: scores.total,
      grade: getGrade(scores.total),
      categoryScores: scores.categories,
      metrics: {
        wordCount: content.wordCount,
        readingTimeMinutes: content.readingTimeMinutes,
        totalImages: images.total,
        imagesWithoutAlt: images.missingAltCount,
        totalLinks: links.total,
        internalLinks: links.internalCount,
        externalLinks: links.externalCount,
        h1Count: headings.h1.length,
        headingsTotal: headings.all.length,
        schemasFound: technical.schemas.length,
        textToHtmlRatio: content.textToHtmlRatio
      },
      meta,
      headings,
      content,
      keywords,
      images,
      links,
      social,
      technical,
      issues: issues.sort((a, b) => severityRank(b.severity) - severityRank(a.severity)),
      passed
    };
  }

  function severityRank(severity) {
    switch (severity) {
      case 'critical': return 3;
      case 'warning': return 2;
      case 'info': return 1;
      default: return 0;
    }
  }

  function getGrade(score) {
    if (score >= 95) return { letter: 'A+', label: 'Outstanding', color: 'text-emerald-500' };
    if (score >= 88) return { letter: 'A', label: 'Excellent', color: 'text-emerald-400' };
    if (score >= 78) return { letter: 'B', label: 'Good', color: 'text-blue-400' };
    if (score >= 65) return { letter: 'C', label: 'Needs Improvement', color: 'text-amber-400' };
    if (score >= 50) return { letter: 'D', label: 'Poor', color: 'text-orange-500' };
    return { letter: 'F', label: 'Critical Issues', color: 'text-rose-500' };
  }

  function analyzeMeta(doc, rawHtml, pageUrl, issues, passed) {
    const titleEl = doc.querySelector('title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    const descEl = doc.querySelector('meta[name="description" i]') || doc.querySelector('meta[property="og:description" i]');
    const description = descEl ? (descEl.getAttribute('content') || '').trim() : '';

    const canonicalEl = doc.querySelector('link[rel="canonical" i]');
    const canonical = canonicalEl ? (canonicalEl.getAttribute('href') || '').trim() : '';

    const robotsEl = doc.querySelector('meta[name="robots" i]');
    const robots = robotsEl ? (robotsEl.getAttribute('content') || '').trim().toLowerCase() : '';

    const viewportEl = doc.querySelector('meta[name="viewport" i]');
    const viewport = viewportEl ? (viewportEl.getAttribute('content') || '').trim() : '';

    const charsetEl = doc.querySelector('meta[charset i]') || doc.querySelector('meta[http-equiv="Content-Type" i]');
    const charset = charsetEl ? (charsetEl.getAttribute('charset') || charsetEl.getAttribute('content') || 'utf-8').trim() : '';

    const faviconEl = doc.querySelector('link[rel~="icon" i]') || doc.querySelector('link[rel="shortcut icon" i]');
    const favicon = faviconEl ? (faviconEl.getAttribute('href') || '').trim() : '';

    // Title validation
    if (!title) {
      issues.push({
        id: 'meta-title-missing',
        category: 'meta',
        severity: 'critical',
        title: 'Missing Page Title Tag',
        description: 'The `<title>` tag is missing or empty. Search engines use this as the primary headline in search results.',
        recommendation: 'Add a clear, keyword-focused `<title>` between 50 and 60 characters.'
      });
    } else if (title.length < 30) {
      issues.push({
        id: 'meta-title-short',
        category: 'meta',
        severity: 'warning',
        title: 'Title Tag is Too Short',
        description: `Your title is only ${title.length} characters long ("${title}"). It may miss valuable keyword opportunities.`,
        recommendation: 'Expand your title to between 50 and 60 characters to maximize SERP visibility.'
      });
    } else if (title.length > 60) {
      issues.push({
        id: 'meta-title-long',
        category: 'meta',
        severity: 'warning',
        title: 'Title Tag is Too Long',
        description: `Your title is ${title.length} characters long. Search engines will likely truncate it around 60 characters in search results.`,
        recommendation: 'Shorten your title to under 60 characters (approximately 580 pixels).'
      });
    } else {
      passed.push({
        id: 'meta-title-ok',
        category: 'meta',
        title: 'Optimal Title Tag Length',
        description: `Title is ${title.length} characters: "${title}". Fits comfortably within Google's snippet limits.`
      });
    }

    // Description validation
    if (!description) {
      issues.push({
        id: 'meta-desc-missing',
        category: 'meta',
        severity: 'critical',
        title: 'Missing Meta Description',
        description: 'No `<meta name="description">` tag found. Search engines will generate their own snippet, which may hurt click-through rates (CTR).',
        recommendation: 'Write an engaging meta description between 120 and 160 characters summarizing the page.'
      });
    } else if (description.length < 70) {
      issues.push({
        id: 'meta-desc-short',
        category: 'meta',
        severity: 'warning',
        title: 'Meta Description is Too Short',
        description: `Your meta description is only ${description.length} characters long.`,
        recommendation: 'Expand to 120-160 characters with a clear call-to-action and primary keyword.'
      });
    } else if (description.length > 160) {
      issues.push({
        id: 'meta-desc-long',
        category: 'meta',
        severity: 'warning',
        title: 'Meta Description May Be Truncated',
        description: `Your meta description is ${description.length} characters. Mobile search snippets often truncate around 120-155 characters.`,
        recommendation: 'Keep your most important message and keyword within the first 120 characters.'
      });
    } else {
      passed.push({
        id: 'meta-desc-ok',
        category: 'meta',
        title: 'Optimal Meta Description Length',
        description: `Meta description is ${description.length} characters. Well-crafted for search snippets.`
      });
    }

    // Canonical validation
    if (!canonical) {
      issues.push({
        id: 'canonical-missing',
        category: 'meta',
        severity: 'warning',
        title: 'Missing Canonical Tag',
        description: 'No `<link rel="canonical">` tag was found. This can lead to duplicate content penalties if accessible via multiple URLs.',
        recommendation: 'Add `<link rel="canonical" href="https://example.com/page">` pointing to the preferred URL.'
      });
    } else {
      passed.push({
        id: 'canonical-ok',
        category: 'meta',
        title: 'Canonical Tag Present',
        description: `Canonical URL defined: ${canonical}`
      });
    }

    // Robots meta validation
    if (robots.includes('noindex')) {
      issues.push({
        id: 'robots-noindex',
        category: 'meta',
        severity: 'critical',
        title: 'Page Set to "noindex"',
        description: `The meta robots tag specifies "${robots}". This instructs search engines NOT to index this page!`,
        recommendation: 'Remove "noindex" if you want this page to rank on search engines.'
      });
    }

    // Viewport validation
    if (!viewport) {
      issues.push({
        id: 'viewport-missing',
        category: 'meta',
        severity: 'critical',
        title: 'Missing Mobile Viewport Meta Tag',
        description: 'Mobile responsive meta viewport is absent. The page will not render properly on smartphones.',
        recommendation: 'Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">` inside `<head>`.'
      });
    } else {
      passed.push({
        id: 'viewport-ok',
        category: 'meta',
        title: 'Mobile Viewport Configured',
        description: 'Viewport tag ensures proper mobile rendering and responsiveness.'
      });
    }

    // Favicon validation
    if (!favicon) {
      issues.push({
        id: 'favicon-missing',
        category: 'meta',
        severity: 'info',
        title: 'Favicon Not Declared in Head',
        description: 'Google displays site favicons next to search results. A missing favicon harms brand recognition.',
        recommendation: 'Add `<link rel="icon" href="/favicon.ico" type="image/x-icon">`.'
      });
    } else {
      passed.push({
        id: 'favicon-ok',
        category: 'meta',
        title: 'Favicon Declared',
        description: `Favicon found: ${favicon}`
      });
    }

    return {
      title,
      titleLength: title.length,
      description,
      descriptionLength: description.length,
      canonical,
      robots: robots || 'index, follow (default)',
      viewport,
      charset,
      favicon
    };
  }

  function analyzeHeadings(doc, issues, passed) {
    const headingEls = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const all = [];
    const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
    const h1List = [];

    headingEls.forEach(el => {
      const tag = el.tagName.toLowerCase();
      const text = el.textContent.trim();
      const level = parseInt(tag.charAt(1), 10);
      counts[tag] = (counts[tag] || 0) + 1;
      if (tag === 'h1') {
        h1List.push(text);
      }
      all.push({ tag, level, text });
    });

    // Check H1
    if (counts.h1 === 0) {
      issues.push({
        id: 'heading-h1-missing',
        category: 'content',
        severity: 'critical',
        title: 'Missing H1 Heading',
        description: 'The page has no `<h1>` heading tag. H1 is one of the highest-weight on-page signals for search engines.',
        recommendation: 'Add exactly one descriptive `<h1>` tag containing your primary target keyword.'
      });
    } else if (counts.h1 > 1) {
      issues.push({
        id: 'heading-h1-multiple',
        category: 'content',
        severity: 'warning',
        title: `Multiple H1 Headings Found (${counts.h1})`,
        description: 'Best practice is to maintain a single H1 per page to clearly indicate the main topic.',
        recommendation: 'Keep your primary headline as H1 and convert secondary sections to H2.'
      });
    } else {
      passed.push({
        id: 'heading-h1-ok',
        category: 'content',
        title: 'Single H1 Heading Configured',
        description: `H1: "${h1List[0]}"`
      });
    }

    // Check heading hierarchy skips (e.g. H1 followed directly by H3 or H4)
    let hierarchySkipped = false;
    for (let i = 0; i < all.length - 1; i++) {
      const currentLevel = all[i].level;
      const nextLevel = all[i + 1].level;
      if (nextLevel > currentLevel + 1) {
        hierarchySkipped = true;
        issues.push({
          id: `heading-skip-${i}`,
          category: 'content',
          severity: 'info',
          title: `Skipped Heading Level (H${currentLevel} to H${nextLevel})`,
          description: `Heading structure jumps directly from H${currentLevel} ("${all[i].text.slice(0, 30)}...") to H${nextLevel} ("${all[i + 1].text.slice(0, 30)}...").`,
          recommendation: 'Follow structured nesting: H1 -> H2 -> H3 without skipping levels for accessibility and crawler navigation.'
        });
        break; // Only report the first skip to avoid flooding
      }
    }

    if (!hierarchySkipped && all.length > 0) {
      passed.push({
        id: 'heading-hierarchy-ok',
        category: 'content',
        title: 'Clean Heading Hierarchy',
        description: `Headings are logically nested across ${all.length} total headings.`
      });
    }

    return {
      all,
      counts,
      h1: h1List
    };
  }

  function analyzeContent(doc, rawHtml, issues, passed) {
    // Clone body to strip scripts and styles for clean text extraction
    let bodyText = '';
    const body = doc.body;

    if (body) {
      const clone = body.cloneNode(true);
      const toRemove = clone.querySelectorAll('script, style, noscript, svg, nav, footer, header');
      toRemove.forEach(el => el.remove());
      bodyText = clone.textContent || '';
    }

    // Clean whitespace
    const cleanText = bodyText.replace(/\s+/g, ' ').trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(w => w.length > 0) : [];
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    // Text to HTML ratio
    const textBytes = new Blob([cleanText]).size;
    const htmlBytes = new Blob([rawHtml]).size || 1;
    const textToHtmlRatio = Math.min(100, Math.round((textBytes / htmlBytes) * 100));

    if (wordCount < 150) {
      issues.push({
        id: 'content-thin',
        category: 'content',
        severity: 'critical',
        title: 'Thin Content Detected',
        description: `The page contains only ${wordCount} words. Thin content struggles to rank for competitive search terms.`,
        recommendation: 'Aim for at least 300-600 words of comprehensive, original content addressing user intent.'
      });
    } else if (wordCount < 300) {
      issues.push({
        id: 'content-short',
        category: 'content',
        severity: 'warning',
        title: 'Relatively Short Content',
        description: `Page has ${wordCount} words. High-ranking pages typically provide more in-depth coverage.`,
        recommendation: 'Consider adding FAQs, specifications, or supporting paragraphs to enrich the page.'
      });
    } else {
      passed.push({
        id: 'content-ok',
        category: 'content',
        title: 'Substantial Content Length',
        description: `Found ${wordCount} words (~${readingTimeMinutes} min read). Good depth for search crawlers.`
      });
    }

    if (textToHtmlRatio < 10) {
      issues.push({
        id: 'ratio-low',
        category: 'content',
        severity: 'info',
        title: 'Low Text-to-HTML Ratio',
        description: `Text makes up only ${textToHtmlRatio}% of the page size. Excessive code bloat may slow down crawlers.`,
        recommendation: 'Minify inline styles/scripts and remove unused HTML wrappers.'
      });
    } else {
      passed.push({
        id: 'ratio-ok',
        category: 'content',
        title: 'Healthy Text-to-HTML Ratio',
        description: `Text-to-HTML ratio is ${textToHtmlRatio}%.`
      });
    }

    return {
      wordCount,
      readingTimeMinutes,
      plainText: cleanText,
      textToHtmlRatio,
      paragraphCount: doc.querySelectorAll('p').length
    };
  }

  function analyzeKeywords(text) {
    if (!text) return { unigrams: [], bigrams: [], trigrams: [] };

    // Clean words: lowercase, letters/numbers only
    const tokens = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    const totalFiltered = tokens.length || 1;

    // 1-grams (Single words)
    const uniMap = {};
    tokens.forEach(t => {
      uniMap[t] = (uniMap[t] || 0) + 1;
    });

    const unigrams = Object.keys(uniMap)
      .map(word => ({
        phrase: word,
        count: uniMap[word],
        density: ((uniMap[word] / totalFiltered) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 2-grams (Two words)
    const biMap = {};
    for (let i = 0; i < tokens.length - 1; i++) {
      const phrase = `${tokens[i]} ${tokens[i + 1]}`;
      biMap[phrase] = (biMap[phrase] || 0) + 1;
    }
    const bigrams = Object.keys(biMap)
      .filter(p => biMap[p] > 1)
      .map(phrase => ({
        phrase,
        count: biMap[phrase],
        density: ((biMap[phrase] / totalFiltered) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 3-grams (Three words)
    const triMap = {};
    for (let i = 0; i < tokens.length - 2; i++) {
      const phrase = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
      triMap[phrase] = (triMap[phrase] || 0) + 1;
    }
    const trigrams = Object.keys(triMap)
      .filter(p => triMap[p] > 1)
      .map(phrase => ({
        phrase,
        count: triMap[phrase],
        density: ((triMap[phrase] / totalFiltered) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return { unigrams, bigrams, trigrams };
  }

  function analyzeImages(doc, issues, passed) {
    const imgEls = Array.from(doc.querySelectorAll('img'));
    const total = imgEls.length;
    let missingAltCount = 0;
    let genericAltCount = 0;
    const missingAltList = [];
    const list = [];

    const GENERIC_ALTS = new Set(['image', 'photo', 'picture', 'img', 'banner', 'untitled', 'logo', 'icon']);

    imgEls.forEach((img, idx) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt');
      const hasDimensions = img.hasAttribute('width') && img.hasAttribute('height');
      const isModernFormat = /\.(webp|avif|svg)(\?.*)?$/i.test(src);

      const item = {
        index: idx + 1,
        src: src.slice(0, 100),
        alt: alt !== null ? alt.trim() : null,
        hasDimensions,
        isModernFormat
      };

      if (alt === null) {
        missingAltCount++;
        missingAltList.push(src || `Image #${idx + 1}`);
      } else if (alt.trim() === '' || GENERIC_ALTS.has(alt.trim().toLowerCase())) {
        genericAltCount++;
      }

      list.push(item);
    });

    if (total > 0 && missingAltCount > 0) {
      issues.push({
        id: 'images-alt-missing',
        category: 'images',
        severity: missingAltCount > 3 ? 'critical' : 'warning',
        title: `${missingAltCount} Image(s) Missing Alt Attributes`,
        description: 'Alt attributes are essential for screen readers and search engines to understand image context.',
        recommendation: 'Provide concise, descriptive `alt` text explaining what each image represents.',
        details: missingAltList.slice(0, 5)
      });
    } else if (total > 0) {
      passed.push({
        id: 'images-alt-ok',
        category: 'images',
        title: 'All Images Have Alt Attributes',
        description: `Verified ${total} image(s). Excellent accessibility and image SEO.`
      });
    }

    if (genericAltCount > 0) {
      issues.push({
        id: 'images-alt-generic',
        category: 'images',
        severity: 'info',
        title: `${genericAltCount} Image(s) Have Generic or Empty Alt Text`,
        description: 'Generic alt text like "image" or "photo" does not provide contextual SEO value.',
        recommendation: 'Replace generic labels with specific descriptions containing relevant keywords.'
      });
    }

    return {
      total,
      missingAltCount,
      genericAltCount,
      list: list.slice(0, 20)
    };
  }

  function analyzeLinks(doc, pageUrl, issues, passed) {
    const linkEls = Array.from(doc.querySelectorAll('a[href]'));
    const total = linkEls.length;
    let internalCount = 0;
    let externalCount = 0;
    let emptyAnchorCount = 0;
    let unsafeTargetBlankCount = 0;
    let nofollowCount = 0;

    const baseHost = extractHost(pageUrl);

    linkEls.forEach(a => {
      const href = (a.getAttribute('href') || '').trim();
      const text = a.textContent.trim();
      const target = a.getAttribute('target');
      const rel = (a.getAttribute('rel') || '').toLowerCase();

      if (!text && !a.querySelector('img[alt]')) {
        emptyAnchorCount++;
      }

      if (rel.includes('nofollow')) {
        nofollowCount++;
      }

      if (target === '_blank' && (!rel.includes('noopener') && !rel.includes('noreferrer'))) {
        unsafeTargetBlankCount++;
      }

      if (href.startsWith('http://') || href.startsWith('https://')) {
        const linkHost = extractHost(href);
        if (baseHost && linkHost === baseHost) {
          internalCount++;
        } else {
          externalCount++;
        }
      } else if (href.startsWith('/') || href.startsWith('#') || !href.includes('://')) {
        internalCount++;
      }
    });

    if (total === 0) {
      issues.push({
        id: 'links-none',
        category: 'links',
        severity: 'warning',
        title: 'No Links Found On Page',
        description: 'Pages without links risk becoming dead ends for crawlers and visitors.',
        recommendation: 'Add relevant internal links to guide users to other sections of your site.'
      });
    } else {
      passed.push({
        id: 'links-count-ok',
        category: 'links',
        title: `Healthy Link Profile (${total} Links)`,
        description: `Found ${internalCount} internal and ${externalCount} external link(s).`
      });
    }

    if (emptyAnchorCount > 0) {
      issues.push({
        id: 'links-empty-anchor',
        category: 'links',
        severity: 'warning',
        title: `${emptyAnchorCount} Link(s) With Empty Anchor Text`,
        description: 'Search engines use anchor text to understand the destination page context.',
        recommendation: 'Provide meaningful, descriptive text inside all `<a>` tags instead of "Click here" or blank text.'
      });
    }

    if (unsafeTargetBlankCount > 0) {
      issues.push({
        id: 'links-unsafe-target',
        category: 'links',
        severity: 'info',
        title: `${unsafeTargetBlankCount} Link(s) Open in New Tab Without rel="noopener"`,
        description: 'Opening external links with `target="_blank"` without `rel="noopener"` poses a security and performance vulnerability (tab-napping).',
        recommendation: 'Add `rel="noopener noreferrer"` to all external links.'
      });
    }

    return {
      total,
      internalCount,
      externalCount,
      emptyAnchorCount,
      unsafeTargetBlankCount,
      nofollowCount
    };
  }

  function analyzeSocial(doc, issues, passed) {
    const og = {
      title: getMetaContent(doc, 'property="og:title"'),
      description: getMetaContent(doc, 'property="og:description"'),
      image: getMetaContent(doc, 'property="og:image"'),
      url: getMetaContent(doc, 'property="og:url"'),
      type: getMetaContent(doc, 'property="og:type"') || 'website',
      siteName: getMetaContent(doc, 'property="og:site_name"')
    };

    const twitter = {
      card: getMetaContent(doc, 'name="twitter:card"') || 'summary_large_image',
      title: getMetaContent(doc, 'name="twitter:title"'),
      description: getMetaContent(doc, 'name="twitter:description"'),
      image: getMetaContent(doc, 'name="twitter:image"'),
      creator: getMetaContent(doc, 'name="twitter:creator"')
    };

    if (!og.title || !og.image) {
      issues.push({
        id: 'social-og-missing',
        category: 'social',
        severity: 'warning',
        title: 'Incomplete Open Graph Metadata',
        description: 'Missing `og:title` or `og:image`. Links shared on Facebook, LinkedIn, Discord, and WhatsApp will not generate rich link previews.',
        recommendation: 'Add `og:title`, `og:description`, and a high-resolution `og:image` (1200x630px).'
      });
    } else {
      passed.push({
        id: 'social-og-ok',
        category: 'social',
        title: 'Open Graph Tags Configured',
        description: 'Rich preview cards enabled for Facebook, LinkedIn, and messaging apps.'
      });
    }

    if (!twitter.card || (!twitter.title && !og.title)) {
      issues.push({
        id: 'social-twitter-missing',
        category: 'social',
        severity: 'info',
        title: 'Twitter / X Cards Not Configured',
        description: 'No `twitter:card` found. Tweets featuring this URL will display plain text links.',
        recommendation: 'Add `<meta name="twitter:card" content="summary_large_image">`.'
      });
    } else {
      passed.push({
        id: 'social-twitter-ok',
        category: 'social',
        title: 'Twitter / X Card Active',
        description: `Card type: ${twitter.card}`
      });
    }

    return { og, twitter };
  }

  function analyzeTechnical(doc, rawHtml, pageUrl, issues, passed) {
    // 1. Language tag
    const htmlEl = doc.querySelector('html');
    const lang = htmlEl ? (htmlEl.getAttribute('lang') || '').trim() : '';

    if (!lang) {
      issues.push({
        id: 'tech-lang-missing',
        category: 'technical',
        severity: 'warning',
        title: 'Missing HTML lang Attribute',
        description: 'The `<html>` element does not specify a language. Search engines and screen readers rely on this for localization.',
        recommendation: 'Add `lang="en"` (or your target language code) to the `<html>` tag.'
      });
    } else {
      passed.push({
        id: 'tech-lang-ok',
        category: 'technical',
        title: 'HTML Language Declared',
        description: `Page language declared as "${lang}".`
      });
    }

    // 2. HTTPS check
    if (pageUrl && pageUrl.startsWith('http://')) {
      issues.push({
        id: 'tech-https-missing',
        category: 'technical',
        severity: 'critical',
        title: 'Insecure HTTP Protocol Used',
        description: 'The page is served over unencrypted HTTP. HTTPS is a confirmed Google ranking signal and prevents browser security warnings.',
        recommendation: 'Install an SSL certificate and redirect all traffic to HTTPS.'
      });
    } else if (pageUrl && pageUrl.startsWith('https://')) {
      passed.push({
        id: 'tech-https-ok',
        category: 'technical',
        title: 'Secure HTTPS Enabled',
        description: 'Page is served over encrypted HTTPS.'
      });
    }

    // 3. Schema.org JSON-LD structured data
    const schemas = [];
    const schemaScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));

    schemaScripts.forEach((script, idx) => {
      try {
        const parsed = JSON.parse(script.textContent);
        const types = Array.isArray(parsed)
          ? parsed.map(p => p['@type']).join(', ')
          : (parsed['@type'] || 'StructuredData');
        schemas.push({
          index: idx + 1,
          type: types,
          data: parsed
        });
      } catch (err) {
        issues.push({
          id: `tech-schema-invalid-${idx}`,
          category: 'technical',
          severity: 'critical',
          title: 'Invalid Schema.org JSON-LD Syntax',
          description: `Syntax error in structured data script #${idx + 1}: ${err.message}`,
          recommendation: 'Validate your JSON-LD syntax using Google Rich Results Test.'
        });
      }
    });

    if (schemas.length === 0) {
      issues.push({
        id: 'tech-schema-missing',
        category: 'technical',
        severity: 'warning',
        title: 'No Structured Data (Schema.org) Found',
        description: 'Structured data enables rich search snippets (star ratings, FAQs, product pricing, breadcrumbs) in Google SERP.',
        recommendation: 'Add JSON-LD markup for Article, Organization, Product, or FAQPage.'
      });
    } else {
      passed.push({
        id: 'tech-schema-ok',
        category: 'technical',
        title: `${schemas.length} Structured Data Schema(s) Detected`,
        description: `Found schemas: ${schemas.map(s => s.type).join(', ')}`
      });
    }

    return {
      lang,
      schemas,
      isHttps: pageUrl ? pageUrl.startsWith('https://') : true
    };
  }

  function calculateScores(issues, passed) {
    const weights = {
      meta: 25,
      content: 25,
      images: 15,
      links: 15,
      social: 10,
      technical: 10
    };

    const deductions = {
      meta: 0,
      content: 0,
      images: 0,
      links: 0,
      social: 0,
      technical: 0
    };

    issues.forEach(issue => {
      const cat = issue.category || 'meta';
      let penalty = 0;
      if (issue.severity === 'critical') penalty = 12;
      else if (issue.severity === 'warning') penalty = 6;
      else if (issue.severity === 'info') penalty = 2;

      deductions[cat] = (deductions[cat] || 0) + penalty;
    });

    const categories = {};
    let totalScore = 0;

    Object.keys(weights).forEach(cat => {
      const max = weights[cat];
      const deducted = Math.min(max, deductions[cat]);
      const current = Math.max(0, max - deducted);
      const percentage = Math.round((current / max) * 100);
      categories[cat] = {
        score: current,
        max,
        percentage
      };
      totalScore += current;
    });

    return {
      total: Math.max(0, Math.min(100, Math.round(totalScore))),
      categories
    };
  }

  function getMetaContent(doc, selector) {
    const el = doc.querySelector(`meta[${selector} i]`);
    return el ? (el.getAttribute('content') || '').trim() : '';
  }

  function extractHost(url) {
    if (!url) return '';
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }

  return {
    audit,
    STOP_WORDS
  };
});
