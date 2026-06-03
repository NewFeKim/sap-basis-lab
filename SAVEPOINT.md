# SAVEPOINT — SAP Basis Training Terminal

> 새 세션 시작 시 팀장이 가장 먼저 읽는 파일.
> 커밋 또는 주요 작업 완료 시 갱신한다.

---

## 현재 상태

| 항목 | 값 |
|---|---|
| **앱 버전** | v0.100 |
| **최신 커밋** | `dcc35e6` feat: v0.100 — 버전 관리 체계 도입 및 신규 명령어 9개 추가 |
| **커밋 날짜** | 2026-06-03 |
| **브랜치** | main |
| **smoke test** | 34/34 통과 |

---

## 마지막 세션에서 한 일

1. **CLAUDE.md 전면 개정** — SAP Basis OS 업무 10개 카테고리, S/4HANA 2023 Kernel 793 버전 기준, Agent 역할 구분(팀장/서칭자/기획자/개발자), NotebookLM 워크플로우
2. **Agent 구조 확립** — `.claude/agents/searcher.md`, `planner.md`, `developer.md` 역할 정의 파일 생성 및 git 추적
3. **버전 관리 도입** — `APP_VERSION='v0.100'` 상수, 배너/타이틀 동적 표시
4. **신규 명령어 9개 구현** — id, groups, nslookup, iostat, disp+work, dmesg, tp (세션 버퍼 유지), hdbnsutil
5. **Codex 리뷰 통합** — `codex review --uncommitted` 워크플로우 확립, P1/P2 이슈 4개 수정

---

## 다음 우선순위 작업

### 1순위 — Phase 3 선행 개발
`PHASE3_DEV_TODO.md` 참조

- [ ] `diskFullSim` / `memLowSim` 시뮬레이션 토글 (`df`/`free`/`top` 출력 변경)
- [ ] QuizEngine 코어 (검증 3타입: cmd/tab/state)
- [ ] QuizUI (퀴즈 리스트/진행 패널/완료 화면)
- [ ] QuizStorage (localStorage)
- [ ] QUIZZES 데이터 77개 (카테고리 A~P)

### 2순위 — OS 명령어 보완
- [ ] `telnet <host> <port>` 포트 연결성 확인
- [ ] `journalctl -e` / `journalctl -u <service>`
- [ ] `/etc/resolv.conf` 파일 내용 추가
- [ ] HANA trace 파일 실제 내용 (`alert_*.trc`, `nameserver_*.trc`)

### 3순위 — 정확도 향상 (NotebookLM 연동)
- [ ] 실제 SAP 환경 출력 샘플 수집 (서칭자 → NotebookLM → 사용자 → 개발자)
- [ ] `tp showbuffer` 실제 출력 포맷 검증
- [ ] `sapcontrol` 출력 컬럼 순서 검증

---

## 주요 아키텍처 결정사항

| 결정 | 이유 |
|---|---|
| 단일 index.html 유지 | 배포 편의 (GitHub Pages 등 정적 호스팅) |
| Vanilla JS (라이브러리 금지) | 외부 의존성 없이 파일 하나로 완결 |
| Codex review 통합 | `codex review --uncommitted`로 커밋 전 품질 검증 |
| tp 세션 버퍼 (`window._tpBuffer`) | addtobuffer 후 showbuffer 일관성 보장 |
| APP_VERSION 상수 | 배너/타이틀/서브텍스트 한 곳에서 관리 |

---

## 파일 구조 요약

```
sap-bc-terminal/
├── index.html              ← 단일 앱 파일 (v0.100, APP_VERSION='v0.100')
├── CLAUDE.md               ← 팀장 지침 (이 파일 읽기 전에 SAVEPOINT 먼저)
├── SAVEPOINT.md            ← 이 파일 (세션 재개 기준점)
├── PHASE3_DEV_TODO.md      ← Phase 3 선행 개발 상세 명세
├── AGENTS.md               ← Codex 리뷰어 역할 정의
├── .claude/
│   └── agents/
│       ├── searcher.md     ← 서칭자 역할 + 결과 파일 형식
│       ├── planner.md      ← 기획자 역할 + 시나리오 명세 형식
│       └── developer.md    ← 개발자 역할 + 코드 구조 요약
└── docs/
    ├── references/         ← 서칭자 수집 결과 (CMD_*.md)
    └── scenarios/          ← 기획자 시나리오 명세
```

---

## 버전 이력

| 버전 | 날짜 | 핵심 내용 |
|---|---|---|
| v1 | 2026-05-07 | MVP: SAP 기본 명령어 15개 |
| v2 | 2026-05-07 | grep/tail -f/find/vi/less/netstat/lsof, 파이프 실제 동작 |
| v3 | 2026-05-08 | DB 서버 탭 (HANA), HDB/hdbsql/hdbcons/hdbbackupdiag |
| v0.100 | 2026-06-03 | 버전 관리 도입, 신규 명령어 9개, Agent 구조, Codex 통합 |

---

*갱신: 2026-06-03 / 커밋: dcc35e6*
