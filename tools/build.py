#!/usr/bin/env python3
"""
단일 파일 빌드 — 다중 파일 소스(index.html + css/ + js/)를 1개 HTML로 병합한다.

투트랙 전략:
  - index.html (다중 파일)      : 메인. GitHub Pages/로컬 개발용
  - dist/index.html (단일 파일) : 이 스크립트의 산출물. 파일 하나만 받아 쓰는 사용자용

사용법:
  python tools/build.py            # → dist/index.html
  python tools/build.py 출력경로   # 출력 위치 지정

Python 표준 라이브러리만 사용 (프로젝트 무의존성 원칙).
"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'dist', 'index.html')

LINK_RE = re.compile(r'^\s*<link\s+rel="stylesheet"\s+href="([^"]+)">\s*$')
SCRIPT_RE = re.compile(r'^\s*<script\s+src="([^"]+)"></script>\s*$')


def read(path):
    with open(os.path.join(ROOT, path), 'r', encoding='utf-8', newline='') as f:
        # 에디터/도구가 CRLF로 저장해도 산출물은 항상 LF (바이트 동일성 보장)
        return f.read().replace('\r\n', '\n')


def main():
    src_lines = read('index.html').split('\n')
    out, i = [], 0
    inlined_css, inlined_js = 0, 0

    while i < len(src_lines):
        line = src_lines[i]
        m = LINK_RE.match(line)
        if m and not m.group(1).startswith('http'):
            out.append('<style>')
            out.append(read(m.group(1)).removesuffix('\n'))
            out.append('</style>')
            inlined_css += 1
            i += 1
            continue
        m = SCRIPT_RE.match(line)
        if m and not m.group(1).startswith('http'):
            # 연속된 script src 라인들을 하나의 <script> 블록으로 병합
            out.append('<script>')
            parts = []
            while i < len(src_lines):
                m2 = SCRIPT_RE.match(src_lines[i])
                if not m2 or m2.group(1).startswith('http'):
                    break
                parts.append(read(m2.group(1)).removesuffix('\n'))
                inlined_js += 1
                i += 1
            out.append('\n'.join(parts))
            out.append('</script>')
            continue
        out.append(line)
        i += 1

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='') as f:
        f.write('\n'.join(out))

    size = os.path.getsize(OUT)
    print(f'OK: {OUT}')
    print(f'    inlined: css {inlined_css}, js {inlined_js} / size {size:,} bytes')
    if inlined_css == 0 or inlined_js == 0:
        print('WARN: 인라인된 파일이 없습니다 — index.html 태그 형식을 확인하세요.')
        sys.exit(1)


if __name__ == '__main__':
    main()
