# SAVEPOINT — SAP Basis Training Terminal

> 새 세션 시작 시 팀장이 가장 먼저 읽는 파일.
> 커밋 또는 주요 작업 완료 시 갱신한다.

---

## 현재 상태

| 항목 | 값 |
|---|---|
| **앱 버전** | v0.100 |
| **main 최신 커밋** | `02502dc` fix: 퀴즈 기동/정지 명령어 startsap/stopsap → sapcontrol로 교체 |
| **커밋 날짜** | 2026-06-05 |
| **smoke test** | 48/48 통과 (단일+HA 모드, 퀴즈엔진, HA 심볼 포함) |

---

## 마지막 세션에서 한 일

1. **HA 퀴즈 시스템 개선** — 커밋 `6a3946c`
   - `{type:'server'}` 스텝 타입 추가 (QuizEngine.onServer 메서드)
   - switchServer() → QuizEngine.onServer() 연결
   - haOnly:true 필터링 (단일 모드 77개 / HA 모드 82개)
   - haHint / haInstruction — HA 모드에서 힌트/안내문 자동 전환
   - 기존 퀴즈 6개 스텝에 haHint 추가
   - HA001~HA005 신규 퀴즈 5개 (haOnly:true, category:'Q. HA 이중화')
   - initialState 서버 동기화 버그 수정 (db 탭에서 ap2On 오염 방지)

2. **README 전면 개편** — 커밋 `189413a`
   - AI-Assisted Maintainership 포지셔닝
   - HA 토폴로지 다이어그램, 82개 퀴즈 표, step type 표
   - CLAUDE.md/SAVEPOINT.md/AGENTS.md를 메인테이너 아티팩트로 명시

3. **퀴즈 sapcontrol 정확도 수정** — 커밋 `02502dc`
   - Q001/Q003/Q004/Q006/Q073/Q074/HA004의 startsap/stopsap → sapcontrol
   - Q003 제목·설명 전체를 StopWait 기준으로 재작성
   - HA004: `sapcontrol -nr 01 -function Start` (인스턴스 번호 01 명시)

4. **smoke test 업데이트** — 34→48 체크항목
   - HA 모드 심볼 (haMode/activeServer/switchServer/ap1On 등) 추가
   - 퀴즈엔진 심볼 (QUIZZES/QuizEngine/QuizUI/QuizStorage/haOnly/haHint/onServer) 추가
   - hdbnsutil, disp+work, tp 명령어 체크 추가
   - mode-single, mode-ha DOM ID 추가

5. **브랜치 정리** — 머지 완료된 4개 브랜치 삭제 (로컬+GitHub)

---

## 다음 우선순위 작업

### 1순위 — Phase 3 선행 개발
`PHASE3_DEV_TODO.md` 참조

- [ ] `diskFullSim` / `memLowSim` 시뮬레이션 토글 (`df`/`free`/`top` 출력 변경)

### 2순위 — OS 명령어 보완
- [ ] `telnet <host> <port>` 포트 연결성 확인
- [ ] `journalctl -e` / `journalctl -u <service>`
- [ ] `/etc/resolv.conf` 파일 내용 추가
- [ ] HANA trace 파일 실제 내용 (`alert_*.trc`, `nameserver_*.trc`)

### 3순위 — 퀴즈 콘텐츠 정확도
- [ ] hdbcons 퀴즈/힌트에 "프로덕션 주의" 경고 문구 추가
- [ ] hdbbackupcheck 명령어 추가 (hdbbackupdiag 보완, 암호화 백업용)
- [ ] 실제 SAP 환경 출력 샘플 수집 (NotebookLM 워크플로우)

---

## 주요 아키텍처 결정사항

| 결정 | 이유 |
|---|---|
| 단일 index.html 유지 | 배포 편의 (GitHub Pages 등 정적 호스팅) |
| Vanilla JS (라이브러리 금지) | 외부 의존성 없이 파일 하나로 완결 |
| startsap/stopsap 코드 유지 | 레거시 명령어 학습용; 단 deprecated 경고 출력 및 퀴즈는 sapcontrol 권장 |
| tp 세션 버퍼 (`window._tpBuffer`) | addtobuffer 후 showbuffer 일관성 보장 |
| APP_VERSION 상수 | 배너/타이틀/서브텍스트 한 곳에서 관리 |
| HA mode: activeServer 상태변수 | ap1/ap2/db1/db2 독립 플래그로 4-서버 토폴로지 시뮬레이션 |

---

## 파일 구조 요약

```
sap-bc-terminal/
├── index.html              ← 단일 앱 파일 (v0.100)
├── CLAUDE.md               ← 팀장 지침
├── SAVEPOINT.md            ← 이 파일 (세션 재개 기준점)
├── PHASE3_DEV_TODO.md      ← Phase 3 선행 개발 상세 명세
├── AGENTS.md               ← Codex 리뷰어 역할 정의
├── .claude/
│   ├── agents/
│   │   ├── searcher.md
│   │   ├── planner.md
│   │   └── developer.md
│   └── skills/
│       └── run-sap-bc-terminal/
│           ├── SKILL.md    ← smoke test 실행 방법 (48 checks)
│           └── smoke.py    ← 자동 smoke test (python smoke.py)
└── docs/
    ├── references/
    └── scenarios/
```

---

## 버전 이력

| 버전 | 날짜 | 핵심 내용 |
|---|---|---|
| v1 | 2026-05-07 | MVP: SAP 기본 명령어 15개 |
| v2 | 2026-05-07 | grep/tail -f/find/vi/less/netstat/lsof, 파이프 실제 동작 |
| v3 | 2026-05-08 | DB 서버 탭 (HANA), HDB/hdbsql/hdbcons/hdbbackupdiag |
| v0.100 | 2026-06-03 | 버전 관리 도입, 신규 명령어 9개, Agent 구조, Codex 통합 |
| v0.100 | 2026-06-03 | HA 이중화 구조 (AP1/AP2/DB1/DB2), 퀴즈 77개 |
| v0.100 | 2026-06-04 | HA 퀴즈 개선 (haHint/onServer), HA001~HA005 신규 (82개 총) |
| v0.100 | 2026-06-05 | 퀴즈 sapcontrol 정확도, README 메인테이너 리브랜딩, smoke test 48체크 |

---

*갱신: 2026-06-05 / 커밋: 02502dc*
