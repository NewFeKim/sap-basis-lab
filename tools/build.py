#!/usr/bin/env python3
"""
단일 파일 빌드 — 다중 파일 소스(index.html + css/ + js/)를 1개 HTML로 병합한다.

투트랙 전략:
  - index.html (다중 파일)      : 메인. GitHub Pages/로컬 개발용
  - dist/index.html (단일 파일) : 이 스크립트의 산출물. 파일 하나만 받아 쓰는 사용자용

사용법:
  python tools/build.py            # → dist/index.html
  python tools/build.py 출력경로   # 출력 위치 지정 (예: out.html, dist/out.html)
  python tools/build.py --check    # dist/index.html이 최신 상태인지만 검사 (파일 미작성, exit 1=stale)

Python 표준 라이브러리만 사용 (프로젝트 무의존성 원칙).
"""
import os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CHECK_MODE = '--check' in sys.argv
_positional = [a for a in sys.argv[1:] if a != '--check']
OUT = _positional[0] if _positional else os.path.join(ROOT, 'dist', 'index.html')

# 속성 순서·추가 속성(defer, type=module 등)에 관계없이 매칭 — 태그 형식이 조금만 달라도
# 인라인에 실패해 dist가 조용히 깨지는 것을 방지 (전체 라인 고정 매칭 대신 부분 매칭)
LINK_RE = re.compile(r'<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>')
SCRIPT_RE = re.compile(r'<script\b[^>]*\bsrc="([^"]+)"[^>]*></script>')


def is_local(ref):
    """외부 URL(http/https/protocol-relative)이나 절대경로·상위 디렉터리 참조가 아닌 로컬 상대경로인가."""
    if re.match(r'^(https?:)?//', ref):
        return False
    if os.path.isabs(ref) or re.match(r'^[A-Za-z]:', ref):
        return False
    if '..' in ref.split('/'):
        return False
    return True


def read(path):
    full = os.path.join(ROOT, path)
    if not os.path.isfile(full):
        sys.exit(f'ERROR: 참조된 파일을 찾을 수 없습니다: {path} (경로: {full})')
    with open(full, 'r', encoding='utf-8', newline='') as f:
        # 에디터/도구가 CRLF로 저장해도 산출물은 항상 LF (바이트 동일성 보장)
        return f.read().replace('\r\n', '\n')


def build():
    """다중 파일 소스를 병합한 문자열과 (css, js) 인라인 개수를 반환한다."""
    src_lines = read('index.html').split('\n')
    out, i = [], 0
    inlined_css, inlined_js = 0, 0

    while i < len(src_lines):
        line = src_lines[i]
        m = LINK_RE.search(line)
        if m and is_local(m.group(1)):
            out.append('<style>')
            out.append(read(m.group(1)).removesuffix('\n'))
            out.append('</style>')
            inlined_css += 1
            i += 1
            continue
        m = SCRIPT_RE.search(line)
        if m and is_local(m.group(1)):
            # 연속된 script src 라인들(사이 빈 줄 허용)을 하나의 <script> 블록으로 병합.
            # 빈 줄 뒤에 진짜로 또 다른 script 태그가 있을 때만 그 빈 줄을 건너뛴다 —
            # 그렇지 않으면(빈 줄 다음이 일반 HTML) 빈 줄을 소비하지 않고 병합을 종료해
            # 원본에 있던 빈 줄이 사라지는 것을 방지한다.
            out.append('<script>')
            parts = []
            while i < len(src_lines):
                cur = src_lines[i]
                if cur.strip() == '':
                    j = i
                    while j < len(src_lines) and src_lines[j].strip() == '':
                        j += 1
                    if j < len(src_lines):
                        m2 = SCRIPT_RE.search(src_lines[j])
                        if m2 and is_local(m2.group(1)):
                            i = j
                            continue
                    break
                m2 = SCRIPT_RE.search(cur)
                if not m2 or not is_local(m2.group(1)):
                    break
                parts.append(read(m2.group(1)).removesuffix('\n'))
                inlined_js += 1
                i += 1
            out.append('\n'.join(parts))
            out.append('</script>')
            continue
        # 로컬 참조인데 위 정규식에 안 걸린 태그가 있으면 조용히 넘기지 않고 즉시 실패
        if (re.search(r'<link\b[^>]*\brel="stylesheet"', line) or re.search(r'<script\b[^>]*\bsrc=', line)) \
                and 'http' not in line:
            sys.exit(f'ERROR: 인라인되지 않은 로컬 태그 형식을 인식하지 못했습니다: {line.strip()!r}')
        out.append(line)
        i += 1

    return '\n'.join(out), inlined_css, inlined_js


def main():
    merged, inlined_css, inlined_js = build()

    if CHECK_MODE:
        if not os.path.isfile(OUT):
            sys.exit(f'STALE: {OUT} 파일이 없습니다. `python tools/build.py`를 실행하세요.')
        with open(OUT, 'r', encoding='utf-8', newline='') as f:
            current = f.read()
        if current != merged:
            sys.exit(f'STALE: {OUT}가 소스(index.html/css/js)와 다릅니다. `python tools/build.py`를 다시 실행하세요.')
        print(f'OK: {OUT} is up to date.')
        return

    out_dir = os.path.dirname(OUT) or '.'
    os.makedirs(out_dir, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='') as f:
        f.write(merged)

    size = os.path.getsize(OUT)
    print(f'OK: {OUT}')
    print(f'    inlined: css {inlined_css}, js {inlined_js} / size {size:,} bytes')
    if inlined_css == 0 or inlined_js == 0:
        print('WARN: 인라인된 파일이 없습니다 — index.html 태그 형식을 확인하세요.')
        sys.exit(1)


if __name__ == '__main__':
    main()
