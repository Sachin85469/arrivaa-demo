import http.server
import socketserver
import threading
import os
import sys
import time
import urllib.parse
import urllib.request
import re
import base64
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

PORT = 8089
ROOT_DIR = os.path.abspath('website')
SCREENSHOTS_DIR = os.path.abspath('screenshots')
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

class StaticHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def do_GET(self):
        url_parts = urllib.parse.urlparse(self.path)
        req_path = url_parts.path
        local_path = os.path.join(ROOT_DIR, req_path.lstrip('/'))

        if os.path.isdir(local_path):
            if not req_path.endswith('/'):
                self.send_response(301)
                new_path = req_path + '/'
                if url_parts.query:
                    new_path += '?' + url_parts.query
                self.send_header('Location', new_path)
                self.end_headers()
                return

        if not os.path.exists(local_path):
            not_found = os.path.join(ROOT_DIR, '404.html')
            if os.path.exists(not_found):
                self.send_response(404)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                with open(not_found, 'rb') as fp:
                    self.wfile.write(fp.read())
                return
        super().do_GET()

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    server = socketserver.TCPServer(('127.0.0.1', PORT), StaticHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server

def bundle_page(page_rel_path):
    with open(page_rel_path, 'r', encoding='utf-8') as f:
        html = f.read()

    with open('website/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
    html = html.replace('<link rel="stylesheet" href="/styles.css">', f'<style>{css}</style>')

    with open('website/assets/fonts/fonts.css', 'r', encoding='utf-8') as f:
        fcss = f.read()
    html = html.replace('<link rel="stylesheet" href="/assets/fonts/fonts.css">', f'<style>{fcss}</style>')

    def replace_img(match):
        src = match.group(1)
        if src.startswith('/'):
            local_src = os.path.join('website', src.lstrip('/'))
            if os.path.exists(local_src):
                with open(local_src, 'rb') as img_f:
                    b64 = base64.b64encode(img_f.read()).decode('utf-8')
                ext = 'svg+xml' if src.endswith('.svg') else 'png'
                return f'src="data:image/{ext};base64,{b64}"'
        return match.group(0)

    html = re.sub(r'src="([^"]+)"', replace_img, html)
    return html

def main():
    print(f"Starting server on http://127.0.0.1:{PORT}")
    server = start_server()
    time.sleep(1)

    routes = [
        '/',
        '/tourist-guide/',
        '/tourist-guide/privacy/',
        '/tourist-guide/delete-account/',
        '/nexus/',
        '/nexus/privacy/',
        '/orvix/',
        '/orvix/privacy/',
        '/privacy/',
        '/contact/',
        '/privacy.html',
        '/404.html',
        # Non-trailing slash checks
        '/tourist-guide',
        '/tourist-guide/privacy',
        '/tourist-guide/delete-account',
        '/nexus',
        '/nexus/privacy',
        '/orvix',
        '/orvix/privacy',
        '/privacy',
        '/contact'
    ]

    print("\n--- 1. Testing Route Resolution ---")
    route_failures = 0
    for r in routes:
        full_url = f"http://127.0.0.1:{PORT}{r}"
        req = urllib.request.Request(full_url, method='HEAD')
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None
        opener = urllib.request.build_opener(NoRedirect)
        try:
            res = opener.open(req)
            print(f"OK: {r} -> {res.status}")
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 308):
                loc = e.headers.get('Location')
                print(f"OK: {r} -> {e.code} (Redirect to: {loc})")
            elif e.code == 404 and r == '/404.html':
                print(f"OK: {r} -> 404 (Expected error page)")
            else:
                print(f"FAIL: {r} -> {e.code}")
                route_failures += 1
        except Exception as e:
            print(f"FAIL: {r} -> {e}")
            route_failures += 1

    server.shutdown()

    print(f"\nRoute resolution failures: {route_failures}")

    pages = [
        ('home', 'website/index.html'),
        ('tourist-guide', 'website/tourist-guide/index.html'),
        ('tourist-guide-privacy', 'website/tourist-guide/privacy/index.html'),
        ('tourist-guide-delete', 'website/tourist-guide/delete-account/index.html'),
        ('nexus', 'website/nexus/index.html'),
        ('nexus-privacy', 'website/nexus/privacy/index.html'),
        ('orvix', 'website/orvix/index.html'),
        ('orvix-privacy', 'website/orvix/privacy/index.html'),
        ('studio-privacy', 'website/privacy/index.html'),
        ('contact', 'website/contact/index.html'),
        ('404', 'website/404.html')
    ]

    viewports = [(360, 740, '360'), (768, 1024, '768'), (1280, 800, '1280')]

    print("\n--- 2. Testing Viewports, Console & Capturing Screenshots ---")
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)

    overflows = []
    accessibility_issues = []

    for name, path in pages:
        bundled = bundle_page(path)
        data_url = 'data:text/html;charset=utf-8,' + urllib.parse.quote(bundled)
        driver.get(data_url)

        # Check single H1
        h1s = driver.find_elements(By.TAG_NAME, 'h1')
        if len(h1s) != 1:
            accessibility_issues.append(f"{name}: expected 1 h1, found {len(h1s)}")

        # Check alt text on all img tags
        for img in driver.find_elements(By.TAG_NAME, 'img'):
            alt = img.get_attribute('alt')
            if not alt:
                accessibility_issues.append(f"{name}: img tag missing alt")

        for w, h, label in viewports:
            driver.set_window_size(w, h)
            sw = driver.execute_script('return document.documentElement.scrollWidth')
            iw = driver.execute_script('return window.innerWidth')
            if sw > iw:
                overflows.append(f"{name} at {w}px has overflow: {sw} > {iw}")

            if name in ('home', 'tourist-guide', 'tourist-guide-privacy'):
                shot_file = os.path.join(SCREENSHOTS_DIR, f"redesign-{name}-{label}.png")
                driver.save_screenshot(shot_file)

        print(f"Verified {name} (Title: {driver.title})")

    # Verify 0 third party requests in HTML source
    print("\n--- 3. Checking for Third-Party Asset Requests in Source ---")
    third_party = []
    for name, path in pages:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        for tag in soup.find_all(['script', 'link', 'img']):
            val = tag.get('src') or tag.get('href') or ''
            if val.startswith(('http://', 'https://')):
                if not val.startswith('https://arrivaa.tech/'):
                    third_party.append(f"{name}: {tag.name} has external URL {val}")

    driver.quit()

    print("\n================ VERIFICATION SUMMARY ================")
    print(f"Route Failures: {route_failures}")
    print(f"Horizontal Overflows: {len(overflows)}")
    print(f"Accessibility Issues: {len(accessibility_issues)}")
    print(f"Third-Party Source Requests: {len(third_party)}")

    if route_failures == 0 and len(overflows) == 0 and len(accessibility_issues) == 0 and len(third_party) == 0:
        print("\nALL VERIFICATION CHECKS PASSED!")
        return 0
    else:
        print("\nVERIFICATION ISSUES FOUND:")
        for o in overflows:
            print("  Overflow:", o)
        for a in accessibility_issues:
            print("  Accessibility:", a)
        for t in third_party:
            print("  Third party:", t)
        return 1

if __name__ == '__main__':
    sys.exit(main())
