# SAVEPOINT — SAP Basis Training Terminal

> 새 세션 시작 시 팀장이 가장 먼저 읽는 파일.
> 커밋 또는 주요 작업 완료 시 갱신한다.

---

## 현재 상태

| 항목 | 값 |
|---|---|
| **앱 버전** | v0.100 |
| **main 최신 작업** | dispstatus RED→YELLOW, hdbnsutil online 라인, 문서 현행화 (이번 세션) |
| **이전 마일스톤** | `efa792b` fix(sapcontrol): GetProcessList dispstatus RED→YELLOW |
| **갱신 날짜** | 2026-06-30 |
| **smoke test** | 48/48 통과 (단일+HA 모드, 퀴즈엔진, HA 심볼 포함) |
| **GitHub Pages** | 배포 중 — https://newfekim.github.io/sap-bc-terminal/ |

---

## 마지막 세션에서 한 일 (2026-06-30)

1. **퀴즈 버그 수정** — 커밋 `e46b3ee`
   - Q073/Q074: 마지막 step이 탭 전환(type:'tab')인데 instruction은 추가 명령("DB/SAP 기동")을
     요구 → 탭 전환만으로 조기 완료되던 버그. 탭 전환과 명령 실행을 별도 step으로 분리 (각 5→6 step)

2. **콘텐츠 정확도 — dispstatus** — 커밋 `efa792b`
   - sapcontrol GetProcessList의 dispstatus는 GREEN/YELLOW/GRAY만 존재 (RED 비표준)
   - DB 미연결 시 AP 프로세스 RED → YELLOW ("Running but...") · Q012 설명 (GREEN/RED)→(GREEN/GRAY)
   - 근거: SAP KBA 3303514 / 2237021 / 2610358, help.sap.com SAPControl 문서

3. **콘텐츠 정확도 — hdbnsutil** — (이번 커밋)
   - `-sr_state` 출력 상단에 `online: true` 라인 추가 (primary/secondary), primary에 `operation mode: primary`

4. **문서 현행화** — 커밋 `3499ca8` + (이번 커밋)
   - CLAUDE.md: HA 모드/퀴즈 시스템/빌드·검증 명령어 섹션 추가, "미구현" 오류 정정
   - codex-review.ps1 ExpectedQuizCount 기본값 77→82
   - README 검수 현황 표(✅/⬜) + 근거 Note 번호 명기
   - 다단계 파이프(3중 이상)는 이미 동작함을 확인 → "미구현" 오류 정정

5. **MCP 도구 추가 활용** — `sap-cloud-alm` MCP로 SAP Notes/KBA 검색 가능
   - 시뮬레이터 출력 검수에 활용 (본문은 요약 발췌까지 / 공식문서는 help.sap.com 직접 조회)
   - 메모리 기록: `sap-cloud-alm-mcp`

---

## 다음 우선순위 작업

### 완료 확인 — Phase 3 선행 개발
- [x] `diskFullSim` / `memLowSim` 시뮬레이션 토글 — 이미 구현 완료
  - `df`/`free`/`top`/`vmstat` 모두 분기 구현
  - Q053/Q054 (`diskFull:true`), Q055/Q056 (`memLow:true`) 연결 완료
  - `QuizEngine._complete()`/`abort()` 자동 해제 구현

### 완료 — OS 명령어 보완 (커밋 3b5efd7)
- [x] `telnet <host> <port>` — sapOn/dbOn 연동 포트 연결성 확인
- [x] `journalctl -e` / `journalctl -u <service>` — AP/DB 탭별 systemd 저널
- [x] `/etc/resolv.conf` — AP/DB 양쪽 추가 (corp.com DNS)
- [x] `alert_s4hdb01.trc` — HANA alert trace 파일 (메모리 경보 시나리오)

### 완료 — 퀴즈 콘텐츠 정확도 (커밋 65cd124)
- [x] hdbcons 실행/퀴즈 힌트에 "프로덕션 주의" 경고 문구 추가
- [x] hdbbackupcheck 명령어 추가 (암호화 백업 무결성 검증, SAP Note 2165194)

### 1순위 — 실제 SAP 환경 출력 샘플 수집
- [ ] NotebookLM 워크플로우 통해 실제 명령어 출력 샘플 확보
  - 대상: sapcontrol GetProcessList, hdbnsutil -sr_state, tp showbuffer 등
  - 방법: 서칭자 서브에이전트 → docs/references/ 저장 → index.html 반영


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
| v0.100 | 2026-06-30 | Q073/Q074 조기완료 버그픽스, dispstatus RED→YELLOW, hdbnsutil online 라인, 문서 현행화 |

---

*갱신: 2026-06-30 / 마일스톤 커밋: efa792b*
