/**
 * Fouad's SEO Toolkit - Interactive SEO Tools Module
 * Generators for Schema.org JSON-LD, Robots.txt, XML Sitemaps, Meta Tags, and SERP pixel calculations.
 * Created by Fouad Sennouni (https://github.com/foverse)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SEOTools = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Approximates Google Desktop & Mobile SERP Pixel Widths
   * Arial 20px for Title (~600px max limit)
   * Arial 14px for Snippet (~960px max limit)
   */
  function calculateTitlePixelWidth(text) {
    if (!text) return 0;
    // Character width approximation table for Arial 20px bold/regular
    const charWidths = {
      W: 20, M: 19, m: 16, w: 15, O: 16, Q: 16, G: 16, C: 15, D: 15,
      i: 5, l: 5, I: 6, j: 6, t: 7, f: 7, r: 8, ' ': 6, '.': 6, ',': 6,
      '-': 7, '|': 6, ':': 6, ';': 6, '!': 6
    };
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      width += charWidths[ch] || 11.5;
    }
    return Math.round(width);
  }

  function calculateSnippetPixelWidth(text) {
    if (!text) return 0;
    return Math.round(text.length * 7.5);
  }

  /**
   * Generates Schema.org JSON-LD structured data
   */
  const SchemaGenerator = {
    article(data) {
      return {
        '@context': 'https://schema.org',
        '@type': data.type || 'BlogPosting',
        'headline': data.headline || 'Article Title Here',
        'image': data.image ? [data.image] : ['https://example.com/cover.jpg'],
        'datePublished': data.datePublished || new Date().toISOString(),
        'dateModified': data.dateModified || new Date().toISOString(),
        'author': [{
          '@type': 'Person',
          'name': data.authorName || 'Author Name',
          'url': data.authorUrl || 'https://example.com/author'
        }],
        'publisher': {
          '@type': 'Organization',
          'name': data.publisherName || 'Site Name',
          'logo': {
            '@type': 'ImageObject',
            'url': data.publisherLogo || 'https://example.com/logo.png'
          }
        },
        'description': data.description || 'Brief description of the article content.'
      };
    },

    faq(items) {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': (items && items.length > 0 ? items : [
          { q: 'What is Fouad\'s SEO Toolkit?', a: 'Fouad\'s SEO Toolkit is an open-source SEO analysis and audit toolkit.' },
          { q: 'How do I run an audit?', a: 'Enter your website URL or paste HTML and click Run Audit.' }
        ]).map(item => ({
          '@type': 'Question',
          'name': item.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': item.a
          }
        }))
      };
    },

    product(data) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': data.name || 'Wireless Noise-Canceling Headphones',
        'image': [data.image || 'https://example.com/product.jpg'],
        'description': data.description || 'Premium over-ear wireless headphones with active noise cancellation.',
        'sku': data.sku || 'PROD-00123',
        'brand': {
          '@type': 'Brand',
          'name': data.brand || 'BrandName'
        },
        'offers': {
          '@type': 'Offer',
          'url': data.url || 'https://example.com/product',
          'priceCurrency': data.currency || 'USD',
          'price': data.price || '199.99',
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': 'https://schema.org/InStock'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': data.rating || '4.8',
          'reviewCount': data.reviews || '84'
        }
      };
    },

    localBusiness(data) {
      return {
        '@context': 'https://schema.org',
        '@type': data.type || 'LocalBusiness',
        'name': data.name || 'Tetouan Digital Studio',
        'image': data.image || 'https://example.com/storefront.jpg',
        'telephone': data.phone || '+212-600-000000',
        'url': data.url || 'https://example.com',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': data.street || 'Avenue Mohammed V',
          'addressLocality': data.city || 'Tetouan',
          'postalCode': data.postalCode || '93000',
          'addressCountry': data.country || 'MA'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': data.lat || 35.5889,
          'longitude': data.lng || -5.3626
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'opens': '09:00',
            'closes': '18:00'
          }
        ]
      };
    },

    breadcrumbs(crumbs) {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': (crumbs && crumbs.length > 0 ? crumbs : [
          { name: 'Home', url: 'https://example.com' },
          { name: 'Tools', url: 'https://example.com/tools' },
          { name: 'SEO Auditor', url: 'https://example.com/tools/seo' }
        ]).map((item, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': item.name,
          'item': item.url
        }))
      };
    }
  };

  /**
   * Generates Robots.txt directives with presets
   */
  const RobotsGenerator = {
    presets: {
      standard: `# Standard SEO-Friendly robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /tmp/

Sitemap: https://example.com/sitemap.xml
`,
      blockAi: `# Block AI Scraping Crawlers while allowing search engines
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
`,
      disallowAll: `# Disallow all indexing (Dev / Staging / Private environments)
User-agent: *
Disallow: /
`
    },

    generate(customRules) {
      const lines = ['# Generated by Fouad\'s SEO Toolkit (https://github.com/foverse/seo)'];
      if (customRules.sitemap) {
        lines.push(`Sitemap: ${customRules.sitemap}`);
      }
      lines.push(`User-agent: ${customRules.userAgent || '*'}`);
      if (customRules.crawlDelay) {
        lines.push(`Crawl-delay: ${customRules.crawlDelay}`);
      }
      (customRules.allows || []).forEach(p => {
        if (p.trim()) lines.push(`Allow: ${p.trim()}`);
      });
      (customRules.disallows || []).forEach(p => {
        if (p.trim()) lines.push(`Disallow: ${p.trim()}`);
      });
      return lines.join('\n');
    }
  };

  /**
   * Generates XML Sitemap
   */
  const SitemapGenerator = {
    generate(urls, defaultFreq = 'weekly', defaultPriority = '0.8') {
      const today = new Date().toISOString().split('T')[0];
      const items = (urls || ['https://example.com/']).map(u => {
        const clean = typeof u === 'string' ? { loc: u.trim() } : u;
        return `  <url>
    <loc>${escapeXml(clean.loc)}</loc>
    <lastmod>${clean.lastmod || today}</lastmod>
    <changefreq>${clean.changefreq || defaultFreq}</changefreq>
    <priority>${clean.priority || defaultPriority}</priority>
  </url>`;
      });

      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join('\n')}
</urlset>`;
    }
  };

  /**
   * Generates Complete <head> Meta Tags
   */
  const MetaTagGenerator = {
    generate(data) {
      return `<!-- Primary Meta Tags -->
<title>${escapeHtml(data.title || 'Page Title')}</title>
<meta name="title" content="${escapeHtml(data.title || '')}">
<meta name="description" content="${escapeHtml(data.description || '')}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta charset="utf-8">
<link rel="canonical" href="${escapeHtml(data.url || '')}">
<meta name="robots" content="${escapeHtml(data.robots || 'index, follow')}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${escapeHtml(data.type || 'website')}">
<meta property="og:url" content="${escapeHtml(data.url || '')}">
<meta property="og:title" content="${escapeHtml(data.title || '')}">
<meta property="og:description" content="${escapeHtml(data.description || '')}">
<meta property="og:image" content="${escapeHtml(data.image || '')}">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="${escapeHtml(data.url || '')}">
<meta name="twitter:title" content="${escapeHtml(data.title || '')}">
<meta name="twitter:description" content="${escapeHtml(data.description || '')}">
<meta name="twitter:image" content="${escapeHtml(data.image || '')}">`;
    }
  };

  function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  return {
    calculateTitlePixelWidth,
    calculateSnippetPixelWidth,
    SchemaGenerator,
    RobotsGenerator,
    SitemapGenerator,
    MetaTagGenerator,
    escapeHtml
  };
});
