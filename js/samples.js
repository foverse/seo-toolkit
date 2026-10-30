/**
 * SEO Studio - Preset Sample Pages
 * Realistic HTML datasets for instant 1-click testing and demonstration.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SEOSamples = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const samples = {
    ecommerce: {
      name: 'E-Commerce Product Page (Optimized)',
      url: 'https://shop.soundcraft.com/products/pro-wireless-headphones',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pro Wireless Noise-Cancelling Headphones | SoundCraft</title>
  <meta name="description" content="Experience studio-grade acoustics with our active noise-cancelling wireless headphones. 40-hour battery life, ultra-plush comfort, and crystal clear call clarity.">
  <link rel="canonical" href="https://shop.soundcraft.com/products/pro-wireless-headphones">
  <link rel="icon" href="https://shop.soundcraft.com/favicon.ico">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:type" content="product">
  <meta property="og:title" content="Pro Wireless Noise-Cancelling Headphones">
  <meta property="og:description" content="Immerse yourself in high-fidelity audio with intelligent noise suppression and all-day comfort.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200">
  <meta property="og:url" content="https://shop.soundcraft.com/products/pro-wireless-headphones">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Pro Wireless Noise-Cancelling Headphones">
  <meta name="twitter:description" content="Studio acoustics, 40-hour battery, and intelligent noise cancellation.">
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "SoundCraft Pro Wireless Headphones",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
    "description": "Studio-grade wireless over-ear headphones with active noise cancellation and ergonomic headband.",
    "brand": {
      "@type": "Brand",
      "name": "SoundCraft"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "249.99",
      "availability": "https://schema.org/InStock",
      "url": "https://shop.soundcraft.com/products/pro-wireless-headphones"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  }
  </script>
</head>
<body>
  <header>
    <a href="https://shop.soundcraft.com/" rel="noopener">Home</a>
    <a href="https://shop.soundcraft.com/catalog" rel="noopener">Headphones Collection</a>
  </header>
  <main>
    <h1>SoundCraft Pro Wireless Headphones with Active Noise Cancellation</h1>
    <p>Discover our flagship audiophile headphones engineered with custom 45mm neodymium drivers, active acoustic dampening, and multi-point Bluetooth 5.4 connectivity. Designed for producers, engineers, and everyday music connoisseurs.</p>
    
    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" alt="SoundCraft Pro Wireless Headphones in matte black finish on wooden surface" width="800" height="600">

    <h2>Acoustic Precision and Sound Engineering</h2>
    <p>Every nuance of your audio track is delivered with pristine accuracy. With low harmonic distortion below 0.1% and a broad frequency spectrum spanning 10Hz to 40,000Hz, you hear music exactly as the recording artist intended. Dedicated sound profiles allow seamless switching between flat monitor reference and bass-boosted casual listening.</p>

    <h2>Adaptive Noise Cancellation and Ambient Passthrough</h2>
    <p>Four outward-facing MEMS microphones constantly analyze ambient noise frequencies at 48,000 samples per second, generating an inverted acoustic wave that neutralizes airplane hum, city commuter traffic, and office chatter. When you need to hear flight announcements or converse with colleagues, tap the touch sensor to activate transparent ambient mode.</p>

    <h2>All-Day Ergonomics & Long Battery Life</h2>
    <p>Memory foam ear cushions wrapped in breathable protein leather guarantee fatigue-free listening during long international flights and extended studio mixing sessions. The high-density lithium polymer cell provides up to 40 hours of continuous playback with ANC enabled, and quick charging grants 6 hours of playtime in just 10 minutes.</p>

    <h2>Frequently Asked Questions</h2>
    <h3>Are these headphones water resistant?</h3>
    <p>Yes, they feature IPX4 splash resistance against sweat and light rain.</p>

    <h3>Can I use a wired 3.5mm connection?</h3>
    <p>Yes, an oxygen-free copper 3.5mm cable is included in the premium carrying case.</p>

    <a href="https://shop.soundcraft.com/checkout" rel="noopener">Order Now with Free Express Shipping</a>
  </main>
  <footer>
    <p>&copy; 2026 SoundCraft Audio Inc. All rights reserved.</p>
  </footer>
</body>
</html>`
    },

    blog: {
      name: 'Tech Blog Article (Needs Optimization)',
      url: 'https://devcraft.io/posts/mastering-modern-web-architecture',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mastering Web Architecture in 2026</title>
  <!-- Short meta description -->
  <meta name="description" content="A guide to modern web stacks.">
  <link rel="canonical" href="https://devcraft.io/posts/mastering-modern-web-architecture">

  <!-- Missing og:image -->
  <meta property="og:title" content="Mastering Web Architecture in 2026">
  <meta property="og:description" content="A guide to modern web stacks and performance.">

  <!-- No Schema.org JSON-LD -->
</head>
<body>
  <header>
    <h1>Mastering Modern Web Architecture</h1>
  </header>

  <article>
    <!-- Skipped heading hierarchy: H1 to H3 directly -->
    <h3>Why Micro-Frontends and Serverless Matter</h3>
    <p>Building resilient, scalable web applications requires evaluating modern decoupled systems, edge caching, and server-driven UI paradigms. In this comprehensive technical breakdown, we explore architectural trade-offs between monolithic single page applications and distributed edge computing.</p>

    <!-- Missing alt attribute on image -->
    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800">

    <h3>Edge Middleware and Distributed Caching</h3>
    <p>Routing user requests to edge points of presence minimizes time-to-first-byte (TTFB) and ensures dynamic content is rendered within single-digit milliseconds of the user location. By pairing edge middleware with globally replicated databases, organizations achieve zero-downtime resilience.</p>

    <!-- Generic anchor text -->
    <p>To read more about infrastructure benchmarks, <a href="https://example.com/benchmarks" target="_blank">click here</a>.</p>
  </article>
</body>
</html>`
    },

    saas: {
      name: 'SaaS Platform Landing Page (Good)',
      url: 'https://pulseanalytics.com/',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulse Analytics | Real-Time User Insights & Funnel Tracking</title>
  <meta name="description" content="Automate product analytics, user behavioral funnels, and retention metrics in real time. Privacy-first, lightweight SDK with zero cookie banners required.">
  <link rel="canonical" href="https://pulseanalytics.com/">
  <link rel="icon" href="https://pulseanalytics.com/favicon.png">

  <meta property="og:type" content="website">
  <meta property="og:title" content="Pulse Analytics | Real-Time Product Intelligence">
  <meta property="og:description" content="Automate product analytics and retention tracking without bloated cookies.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200">
  <meta property="og:url" content="https://pulseanalytics.com/">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Pulse Analytics">
  <meta name="twitter:description" content="Real-time product analytics with zero performance overhead.">
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Pulse Analytics",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "49.00",
      "priceCurrency": "USD"
    }
  }
  </script>
</head>
<body>
  <nav>
    <a href="https://pulseanalytics.com/features" rel="noopener">Features</a>
    <a href="https://pulseanalytics.com/pricing" rel="noopener">Pricing</a>
    <a href="https://pulseanalytics.com/docs" rel="noopener">Documentation</a>
  </nav>

  <main>
    <h1>Transform Raw Event Data Into Actionable Product Growth Insights</h1>
    <p>Pulse Analytics gives engineering and product teams instant clarity into how customers interact with your web and mobile applications. Eliminate guesswork with sub-second funnel querying, cohort retention curves, and automated friction alerts.</p>
    
    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800" alt="Dashboard interface showing real-time event analytics and conversion graphs" width="800" height="500">

    <h2>Why Fast-Growing Engineering Teams Choose Pulse</h2>
    <p>Traditional legacy analytics tools inject heavy client-side bundles exceeding 100KB, degrade Core Web Vitals, and run afoul of international privacy frameworks. Pulse was architected from the ground up to be ultra-lean (under 2.4KB gzipped), privacy-compliant by default, and powered by distributed columnar data stores.</p>

    <h2>Instant Funnel Analysis & Journey Mapping</h2>
    <p>Identify where drop-offs happen in minutes. Trace individual user steps from initial landing page visit through checkout with complete anonymity preservation and retroactive event recalculation.</p>
  </main>
</body>
</html>`
    },

    broken: {
      name: 'Flawed Page (Critical SEO Issues)',
      url: 'https://bad-seo-example.com/test',
      html: `<html>
<head>
  <!-- Missing charset -->
  <!-- Missing viewport -->
  <!-- Missing title -->
  <!-- Missing meta description -->
  <!-- Missing canonical -->
  <!-- Blocked from search engines -->
  <meta name="robots" content="noindex, nofollow">
</head>
<body>
  <!-- Missing H1 tag -->
  <h2>Welcome to our website</h2>
  
  <!-- Multiple images without alt text -->
  <img src="/assets/photo1.jpg">
  <img src="/assets/photo2.jpg">
  <img src="/assets/photo3.jpg">

  <!-- Empty anchor text -->
  <a href="/somewhere"></a>
  <a href="https://external-site.com" target="_blank"></a>

  <!-- Thin content -->
  <p>Call us today.</p>
</body>
</html>`
    }
  };

  return samples;
});
