#!/usr/bin/env python3
"""
Fouad's SEO Toolkit - Python CLI Auditor
Zero-dependency SEO auditing tool for websites and HTML files using Python 3 standard library.
Created by Fouad Sennouni (https://github.com/foverse)

Usage:
    python seo_audit.py https://example.com
    python seo_audit.py --file index.html
    python seo_audit.py https://example.com --json --output report.json
"""

import sys
import os
import re
import json
import argparse
import urllib.request
import urllib.error
from html.parser import HTMLParser

class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'

class SimpleHTMLAnalyzer(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta_desc = ""
        self.canonical = ""
        self.viewport = ""
        self.robots = ""
        self.h1_list = []
        self.h2_list = []
        self.h3_list = []
        self.current_tag = None
        self.current_text = []
        self.images = []
        self.links = []
        self.schemas = []
        self.in_script_ldjson = False
        self.script_buffer = []
        self.all_text = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = {k.lower(): v for k, v in attrs if v is not None}
        self.current_tag = tag.lower()

        if tag == 'title':
            self.in_title = True
        elif tag == 'meta':
            name = attrs_dict.get('name', '').lower()
            prop = attrs_dict.get('property', '').lower()
            content = attrs_dict.get('content', '')

            if name == 'description' or prop == 'og:description':
                if not self.meta_desc:
                    self.meta_desc = content
            elif name == 'viewport':
                self.viewport = content
            elif name == 'robots':
                self.robots = content
        elif tag == 'link':
            rel = attrs_dict.get('rel', '').lower()
            if rel == 'canonical':
                self.canonical = attrs_dict.get('href', '')
        elif tag == 'img':
            self.images.append({
                'src': attrs_dict.get('src', ''),
                'alt': attrs_dict.get('alt', None)
            })
        elif tag == 'a':
            self.links.append({
                'href': attrs_dict.get('href', ''),
                'rel': attrs_dict.get('rel', ''),
                'target': attrs_dict.get('target', '')
            })
        elif tag == 'script':
            script_type = attrs_dict.get('type', '').lower()
            if script_type == 'application/ld+json':
                self.in_script_ldjson = True
                self.script_buffer = []

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag == 'script' and self.in_script_ldjson:
            self.in_script_ldjson = False
            raw_json = ''.join(self.script_buffer).strip()
            if raw_json:
                try:
                    self.schemas.append(json.loads(raw_json))
                except Exception:
                    pass
        elif tag in ('h1', 'h2', 'h3'):
            text = ''.join(self.current_text).strip()
            if tag == 'h1': self.h1_list.append(text)
            elif tag == 'h2': self.h2_list.append(text)
            elif tag == 'h3': self.h3_list.append(text)
            self.current_text = []

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif self.in_script_ldjson:
            self.script_buffer.append(data)
        elif self.current_tag in ('h1', 'h2', 'h3'):
            self.current_text.append(data)
        elif self.current_tag not in ('script', 'style', 'noscript'):
            self.all_text.append(data)

def audit_html(html, source_name="Local"):
    parser = SimpleHTMLAnalyzer()
    parser.feed(html)

    issues = []
    passed = []

    # Title check
    title = parser.title.strip()
    if not title:
        issues.append({'severity': 'critical', 'title': 'Missing <title> tag', 'desc': 'Search engines require a headline title.'})
    elif len(title) < 30:
        issues.append({'severity': 'warning', 'title': 'Title too short', 'desc': f'Only {len(title)} chars ("{title}").'})
    elif len(title) > 60:
        issues.append({'severity': 'warning', 'title': 'Title too long', 'desc': f'{len(title)} chars (may truncate in search results).'})
    else:
        passed.append({'title': 'Optimal title tag', 'desc': f'{len(title)} chars: "{title}"'})

    # Meta Description check
    desc = parser.meta_desc.strip()
    if not desc:
        issues.append({'severity': 'critical', 'title': 'Missing meta description', 'desc': 'Snippet description is missing.'})
    elif len(desc) < 70:
        issues.append({'severity': 'warning', 'title': 'Meta description too short', 'desc': f'{len(desc)} characters.'})
    elif len(desc) > 160:
        issues.append({'severity': 'warning', 'title': 'Meta description may truncate', 'desc': f'{len(desc)} characters.'})
    else:
        passed.append({'title': 'Optimal meta description', 'desc': f'{len(desc)} characters.'})

    # Canonical
    if not parser.canonical:
        issues.append({'severity': 'warning', 'title': 'Missing canonical URL', 'desc': 'Helps prevent duplicate content.'})
    else:
        passed.append({'title': 'Canonical tag found', 'desc': parser.canonical})

    # Viewport
    if not parser.viewport:
        issues.append({'severity': 'critical', 'title': 'Missing mobile viewport tag', 'desc': 'Page not optimized for mobile.'})
    else:
        passed.append({'title': 'Mobile viewport configured', 'desc': 'Responsive meta tag present.'})

    # Headings
    if len(parser.h1_list) == 0:
        issues.append({'severity': 'critical', 'title': 'Missing H1 heading', 'desc': 'No <h1> main headline found.'})
    elif len(parser.h1_list) > 1:
        issues.append({'severity': 'warning', 'title': f'Multiple H1 headings ({len(parser.h1_list)})', 'desc': 'Only 1 H1 is recommended.'})
    else:
        passed.append({'title': 'Single H1 headline present', 'desc': parser.h1_list[0]})

    # Images
    missing_alts = sum(1 for img in parser.images if img['alt'] is None or img['alt'].strip() == '')
    if len(parser.images) > 0 and missing_alts > 0:
        issues.append({'severity': 'critical' if missing_alts > 2 else 'warning', 'title': f'{missing_alts} image(s) missing alt text', 'desc': f'Out of {len(parser.images)} total images.'})
    elif len(parser.images) > 0:
        passed.append({'title': 'All images have alt tags', 'desc': f'{len(parser.images)} images verified.'})

    # Schemas
    if len(parser.schemas) == 0:
        issues.append({'severity': 'warning', 'title': 'No Schema.org structured data', 'desc': 'JSON-LD markup missing.'})
    else:
        passed.append({'title': f'{len(parser.schemas)} Schema.org item(s)', 'desc': 'Structured data detected.'})

    # Words
    raw_body_text = ' '.join(parser.all_text)
    words = [w for w in re.split(r'\s+', raw_body_text) if len(w) > 0]
    word_count = len(words)

    if word_count < 150:
        issues.append({'severity': 'critical', 'title': 'Thin content detected', 'desc': f'Found only {word_count} words.'})
    else:
        passed.append({'title': 'Healthy content length', 'desc': f'{word_count} words.'})

    # Calculate score
    score = 100
    for i in issues:
        if i['severity'] == 'critical': score -= 15
        elif i['severity'] == 'warning': score -= 8
    score = max(10, min(100, score))

    return {
        'source': source_name,
        'score': score,
        'title': title,
        'description': desc,
        'canonical': parser.canonical,
        'metrics': {
            'word_count': word_count,
            'h1_count': len(parser.h1_list),
            'h2_count': len(parser.h2_list),
            'h3_count': len(parser.h3_list),
            'total_images': len(parser.images),
            'missing_alts': missing_alts,
            'schemas_found': len(parser.schemas)
        },
        'issues': issues,
        'passed': passed
    }

def main():
    arg_parser = argparse.ArgumentParser(description="SEO Studio - Standalone Python SEO Auditor")
    arg_parser.add_argument("url", nargs="?", help="Website URL to audit (e.g. https://example.com)")
    arg_parser.add_argument("--file", help="Path to local HTML file to audit")
    arg_parser.add_argument("--json", action="store_true", help="Output results in JSON format")
    arg_parser.add_argument("--output", help="Save audit result to JSON file")
    args = arg_parser.parse_args()

    html_content = ""
    source_name = ""

    if args.file:
        source_name = args.file
        try:
            with open(args.file, "r", encoding="utf-8") as f:
                html_content = f.read()
        except Exception as e:
            print(f"{Colors.RED}Error reading file:{Colors.END} {e}", file=sys.stderr)
            sys.exit(1)
    elif args.url:
        target = args.url
        if not target.startswith("http://") and not target.startswith("https://"):
            target = "https://" + target
        source_name = target
        if not args.json:
            print(f"{Colors.CYAN}Fetching {target}...{Colors.END}")
        req = urllib.request.Request(
            target,
            headers={'User-Agent': 'Mozilla/5.0 (compatible; SEOStudioPy/2.0; +https://github.com/foverse/seo-toolkit)'}
        )
        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                html_content = response.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"{Colors.RED}Network error fetching URL:{Colors.END} {e}", file=sys.stderr)
            sys.exit(1)
    else:
        arg_parser.print_help()
        sys.exit(1)

    report = audit_html(html_content, source_name)

    if args.json:
        out = json.dumps(report, indent=2)
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(out)
            print(f"Saved JSON report to {args.output}")
        else:
            print(out)
        return

    # Terminal output
    print(f"\n{Colors.BOLD}{Colors.CYAN}======================================================{Colors.END}")
    print(f"  {Colors.BOLD}Fouad's SEO Toolkit - Audit Report (Python CLI){Colors.END}")
    print(f"  Source: {report['source']}")
    print(f"{Colors.BOLD}{Colors.CYAN}======================================================{Colors.END}\n")

    score = report['score']
    score_col = Colors.GREEN if score >= 80 else (Colors.YELLOW if score >= 60 else Colors.RED)
    print(f"  {Colors.BOLD}SEO Health Score:{Colors.END} {score_col}{Colors.BOLD}{score} / 100{Colors.END}\n")

    m = report['metrics']
    print(f"  {Colors.BOLD}Key Metrics:{Colors.END}")
    print(f"    - Words:       {m['word_count']}")
    print(f"    - Headings:    H1: {m['h1_count']} | H2: {m['h2_count']} | H3: {m['h3_count']}")
    print(f"    - Images:      {m['total_images']} ({m['missing_alts']} missing alt)")
    print(f"    - Structured:  {m['schemas_found']} Schema.org item(s)")

    if report['issues']:
        print(f"\n  {Colors.BOLD}{Colors.RED}Issues Detected ({len(report['issues'])}):{Colors.END}")
        for i in report['issues']:
            badge = f"{Colors.RED}[CRITICAL]{Colors.END}" if i['severity'] == 'critical' else f"{Colors.YELLOW}[WARNING]{Colors.END}"
            print(f"    {badge} {Colors.BOLD}{i['title']}:{Colors.END} {i['desc']}")

    if report['passed']:
        print(f"\n  {Colors.BOLD}{Colors.GREEN}Passed Checks ({len(report['passed'])}):{Colors.END}")
        for p in report['passed']:
            print(f"    {Colors.GREEN}✓{Colors.END} {p['title']} ({p['desc']})")

    print(f"\n{Colors.BOLD}{Colors.CYAN}======================================================{Colors.END}\n")

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"{Colors.GREEN}✓ Saved report to {args.output}{Colors.END}")

if __name__ == "__main__":
    main()
