# SAVEPOINT — SAP Basis Training Terminal

> 새 세션 시작 시 팀장이 가장 먼저 읽는 파일.
> 커밋 또는 주요 작업 완료 시 갱신한다.

---

## 현재 상태

| 항목 | 값 |
|---|---|
| **앱 버전** | v0.100 |
| **main 최신 커밋** | `79e9d4c` Merge branch 'feat/ha-dual-server': AP/DB 이중화(HA) 구조 도입 |
| **커밋 날짜** | 2026-06-03 |
| **smoke test** | 34/34 통과 (단일 모드) + 이중화 UI/퀴즈 호환성 검증 완료 |

---

## 마지막 세션에서 한 일

1. **AP/DB 이중화(HA) 구조 도입** — `feat/ha-dual-server` 브랜치 → main 머지 완료
   - 단일/이중화 모드 토글 `[단일|이중화]`
   - 이중화 모드: AP1(s4happ01/D00), AP2(s4happ02/D01), DB1(s4hdb01/Primary), DB2(s4hdb02/Secondary) 4탭
   - `activeServer` 상태변수 + 서버별 독립 플래그 (ap1On/ap2On/db1On/db2On)
   - DB2 hdbnsutil: mode:sync / SECONDARY / Host Mappings 분리 출력
   - GetSystemInstanceList: 이중화 모드 시 5행(AP2+DB2 추가)
   - 타이머 race condition 수정 (`const _srv=activeServer` 캡처)
   - Codex P1/P2 5건 수정 후 커밋
2. **퀴즈 HA 호환성 검증** — Puppeteer 자동화 테스트
   - 77개 시나리오 단일/이중화 모두 정상 로드
   - tab 검증: DB1·DB2 모두 `activeTab='db'` → 기존 퀴즈 통과
   - initialState 상태 반영 정상 (SAP STOPPED 표시 확인)
3. **버그 수정** — 초기 환영 메시지 `v4` 하드코딩 → `APP_VERSION` 변수화 (Codex 리뷰 통과)

---

## 다음 우선순위 작업

### 1순위 — Phase 3 선행 개발
`PHASE3_DEV_TODO.md` 참조

- [ ] `diskFullSim` / `memLowSim` 시뮬레이션 토글 (`df`/`free`/`top` 출력 변경)
- [x] QuizEngine 코어 — 구현 완료 (cmd/tab/state 검증)
- [x] QuizUI — 구현 완료 (퀴즈 리스트/진행 패널/완료 화면)
- [x] QuizStorage (localStorage) — 구현 완료
- [x] QUIZZES 데이터 77개 (카테고리 A~P) — 구현 완료

### 1-2순위 — Phase 4 HA 전용 퀴즈 (신규)
`docs/scenarios/PLAN_HA_DUAL_SERVER.md` 참조

- [ ] HA001: HANA SR 상태 확인 (DB1 sr_state SYNC 확인)
- [ ] HA002: Secondary 상태 점검 (DB2 sr_state SECONDARY)
- [ ] HA003: DB Failover 시뮬레이션 (DB1 stop → DB2 takeover)
- [ ] HA004: AP2 서버 기동 확인
- [ ] HA005: 전체 HA 점검 루틴

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
| v0.100 | 2026-06-03 | HA 이중화 구조 (AP1/AP2/DB1/DB2), 퀴즈 77개, 정확도 검증 |

---

*갱신: 2026-06-03 / 커밋: 79e9d4c*
