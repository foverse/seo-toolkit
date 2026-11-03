const fs = require('fs');
const path = require('path');

const iconNames = [
  'alert-octagon', 'alert-triangle', 'check-circle-2', 'circle', 'code',
  'code-2', 'download', 'eye', 'file-text', 'git-branch', 'github',
  'globe', 'info', 'layout', 'lightbulb', 'link', 'list-checks', 'map',
  'pie-chart', 'play', 'printer', 'search', 'share-2', 'shield-check',
  'sliders', 'star', 'upload', 'user', 'wrench', 'x'
];

const dir = path.join(__dirname, '..', '.agents', 'skills', 'stageshow', 'node_modules', 'lucide-react', 'dist', 'esm', 'icons');
const iconMap = {};

for (const name of iconNames) {
  let currentFile = path.join(dir, name + '.js');
  if (!fs.existsSync(currentFile)) {
    console.error('Missing icon:', name);
    continue;
  }
  let content = fs.readFileSync(currentFile, 'utf8');
  const aliasMatch = content.match(/export\s*\{\s*default\s*\}\s*from\s*['"]\.\/([^'"]+)['"]/);
  if (aliasMatch) {
    currentFile = path.join(dir, aliasMatch[1]);
    content = fs.readFileSync(currentFile, 'utf8');
  }

  const match = content.match(/createLucideIcon\([^,]+,\s*(\[[\s\S]*?\])\s*\);/);
  if (match) {
    const tuples = eval(match[1]);
    let svgElements = '';
    for (const [tag, attrs] of tuples) {
      let attrStr = '';
      for (const [k, v] of Object.entries(attrs)) {
        if (k !== 'key') {
          attrStr += ` ${k}="${v}"`;
        }
      }
      svgElements += `<${tag}${attrStr}></${tag}>`;
    }
    iconMap[name] = svgElements;
  }
}

const fileContent = `/**
 * Fouad's SEO Toolkit - Local Zero-Dependency Lucide Icons
 * Self-contained local icon pack extracted from lucide-react.
 * Zero external CDN requests. Runs 100% offline.
 */
(function() {
  const ICONS = ${JSON.stringify(iconMap, null, 2)};

  function renderIcon(el) {
    const name = el.getAttribute('data-lucide');
    const inner = ICONS[name];
    if (!inner) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', el.getAttribute('stroke-width') || '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    if (el.className) svg.setAttribute('class', el.className);
    if (el.getAttribute('style')) svg.setAttribute('style', el.getAttribute('style'));
    if (el.getAttribute('id')) svg.setAttribute('id', el.getAttribute('id'));

    svg.innerHTML = inner;
    el.parentNode.replaceChild(svg, el);
  }

  window.lucide = {
    icons: ICONS,
    createIcons: function() {
      const elements = document.querySelectorAll('[data-lucide]');
      elements.forEach(renderIcon);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.lucide.createIcons();
    });
  } else {
    window.lucide.createIcons();
  }
})();
`;

fs.writeFileSync(path.join(__dirname, '..', 'js', 'lucide-local.js'), fileContent, 'utf8');
console.log('Successfully generated js/lucide-local.js with', Object.keys(iconMap).length, 'icons');
