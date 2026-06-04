#!/usr/bin/env python3
"""
Smoke test for SAP Basis Training Terminal.
Starts Python http.server, fetches the page, checks key elements, then stops.

Usage:
  python smoke.py [port]   default port: 18080
"""
import sys, os, time, socket, subprocess, urllib.request

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 18080
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

def wait_for_port(port, timeout=10):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(('localhost', port), 0.5):
                return True
        except OSError:
            time.sleep(0.2)
    return False

PASS = '\033[32mPASS\033[0m'
FAIL = '\033[31mFAIL\033[0m'
results = []

def check(label, condition):
    status = PASS if condition else FAIL
    print(f"  [{status}] {label}")
    results.append(condition)

srv = subprocess.Popen(
    [sys.executable, '-m', 'http.server', str(PORT)],
    cwd=ROOT,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

try:
    if not wait_for_port(PORT):
        print(f"[{FAIL}] Server did not start on port {PORT}")
        sys.exit(1)

    url = f'http://localhost:{PORT}/'
    html = urllib.request.urlopen(url, timeout=10).read().decode('utf-8')

    print(f"\nSAP Basis Training Terminal -- smoke test (port {PORT})\n")

    # ── Page load ────────────────────────────────────────────────────────────
    check("HTTP 200 / page returned", len(html) > 1000)
    check("Title: SAP Basis Training Terminal", 'SAP Basis Training Terminal' in html)

    # ── Core DOM IDs ─────────────────────────────────────────────────────────
    for elem_id in ['tr', 'tab-ap', 'tab-db', 'output', 'ci', 'hb-ap', 'hb-db',
                    'mode-single', 'mode-ha']:
        check(f'DOM id="{elem_id}" present', f'id="{elem_id}"' in html)

    # ── Core JS state variables ───────────────────────────────────────────────
    for symbol in ['const CMDS', 'sapOn', 'dbOn', 'switchTab',
                   'FS_AP', 'FS_DB', 'FILES_AP', 'FILES_DB',
                   'haMode', 'activeServer', 'switchServer',
                   'ap1On', 'ap2On', 'db1On', 'db2On']:
        check(f'JS symbol "{symbol}" present', symbol in html)

    # ── SAP commands ─────────────────────────────────────────────────────────
    for cmd in ['startsap', 'stopsap', 'sapcontrol', 'dpmon', 'R3trans', 'lgtst',
                'disp+work', 'tp ']:
        check(f'SAP cmd "{cmd}" in source', cmd in html)

    # ── HANA commands ────────────────────────────────────────────────────────
    for cmd in ['HDB', 'hdbsql', 'hdbcons', 'hdbbackupdiag', 'hdbnsutil']:
        check(f'HANA cmd "{cmd}" in source', cmd in html)

    # ── Quiz engine ──────────────────────────────────────────────────────────
    for symbol in ['const QUIZZES', 'QuizEngine', 'QuizUI', 'QuizStorage',
                   'haOnly', 'haHint', 'onServer']:
        check(f'Quiz symbol "{symbol}" present', symbol in html)

    # ── Styling ──────────────────────────────────────────────────────────────
    check('Terminal dark bg #0d1117', '#0d1117' in html)
    check('APP_VERSION constant present', 'APP_VERSION' in html)

    total = len(results)
    passed = sum(results)
    failed = total - passed
    print(f"\n{'--'*25}")
    print(f"  Total: {total}  Passed: {passed}  Failed: {failed}")
    if failed == 0:
        print(f"  [{PASS}] All checks passed\n")
        sys.exit(0)
    else:
        print(f"  [{FAIL}] {failed} check(s) failed\n")
        sys.exit(1)

finally:
    srv.terminate()
    srv.wait()
