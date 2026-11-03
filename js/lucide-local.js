/**
 * Fouad's SEO Toolkit - Local Zero-Dependency Lucide Icons
 * Self-contained local icon pack extracted from lucide-react.
 * Zero external CDN requests. Runs 100% offline.
 */
(function() {
  const ICONS = {
  "alert-octagon": "<path d=\"M12 16h.01\"></path><path d=\"M12 8v4\"></path><path d=\"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z\"></path>",
  "alert-triangle": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"></path><path d=\"M12 9v4\"></path><path d=\"M12 17h.01\"></path>",
  "check-circle-2": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m9 12 2 2 4-4\"></path>",
  "circle": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle>",
  "code": "<polyline points=\"16 18 22 12 16 6\"></polyline><polyline points=\"8 6 2 12 8 18\"></polyline>",
  "code-2": "<path d=\"m18 16 4-4-4-4\"></path><path d=\"m6 8-4 4 4 4\"></path><path d=\"m14.5 4-5 16\"></path>",
  "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"></line>",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>",
  "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"></path><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"></path><path d=\"M10 9H8\"></path><path d=\"M16 13H8\"></path><path d=\"M16 17H8\"></path>",
  "git-branch": "<line x1=\"6\" x2=\"6\" y1=\"3\" y2=\"15\"></line><circle cx=\"18\" cy=\"6\" r=\"3\"></circle><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><path d=\"M18 9a9 9 0 0 1-9 9\"></path>",
  "github": "<path d=\"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4\"></path><path d=\"M9 18c-4.51 2-5-2-7-2\"></path>",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"></path><path d=\"M2 12h20\"></path>",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path>",
  "layout": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M3 9h18\"></path><path d=\"M9 21V9\"></path>",
  "lightbulb": "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"></path><path d=\"M9 18h6\"></path><path d=\"M10 22h4\"></path>",
  "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>",
  "list-checks": "<path d=\"m3 17 2 2 4-4\"></path><path d=\"m3 7 2 2 4-4\"></path><path d=\"M13 6h8\"></path><path d=\"M13 12h8\"></path><path d=\"M13 18h8\"></path>",
  "map": "<path d=\"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z\"></path><path d=\"M15 5.764v15\"></path><path d=\"M9 3.236v15\"></path>",
  "pie-chart": "<path d=\"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z\"></path><path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\"></path>",
  "play": "<polygon points=\"6 3 20 12 6 21 6 3\"></polygon>",
  "printer": "<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\"></path><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\"></rect>",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path>",
  "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\"></circle><circle cx=\"6\" cy=\"12\" r=\"3\"></circle><circle cx=\"18\" cy=\"19\" r=\"3\"></circle><line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\"></line><line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\"></line>",
  "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"></path><path d=\"m9 12 2 2 4-4\"></path>",
  "sliders": "<line x1=\"4\" x2=\"4\" y1=\"21\" y2=\"14\"></line><line x1=\"4\" x2=\"4\" y1=\"10\" y2=\"3\"></line><line x1=\"12\" x2=\"12\" y1=\"21\" y2=\"12\"></line><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"3\"></line><line x1=\"20\" x2=\"20\" y1=\"21\" y2=\"16\"></line><line x1=\"20\" x2=\"20\" y1=\"12\" y2=\"3\"></line><line x1=\"2\" x2=\"6\" y1=\"14\" y2=\"14\"></line><line x1=\"10\" x2=\"14\" y1=\"8\" y2=\"8\"></line><line x1=\"18\" x2=\"22\" y1=\"16\" y2=\"16\"></line>",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"></path>",
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"17 8 12 3 7 8\"></polyline><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\"></line>",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle>",
  "wrench": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path>",
  "x": "<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>"
};

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
