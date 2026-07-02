# SAP Basis Training Terminal

> A browser-based OS-level terminal simulator for SAP Basis engineers — built entirely with Vanilla JS, zero dependencies, deployed as a single HTML file.

**[Live Demo →](https://newfekim.github.io/sap-basis-lab/)** &nbsp;|&nbsp; Built with [Claude Code](https://claude.ai/code) · Maintained by [@NewFeKim](https://github.com/NewFeKim)

---

## What This Is

신입 SAP Basis 컨설턴트를 위한 **웹 기반 OS단 교육용 터미널 시뮬레이터**입니다.

실제 SAP 라이선스·서버 없이 브라우저 하나로 아래를 실습할 수 있습니다:

- AP 서버 / DB 서버 터미널 명령어 실행
- SAP 기동·정지 시뮬레이션 (startsap / stopsap / HDB start·stop)
- **AP/DB 이중화(HA) 구조** — AP1·AP2·DB1·DB2 4-서버 토폴로지
- 82개 퀴즈 시나리오 (단계별 / 자유 모드, HA 전용 퀴즈 포함)

> **Security note:** All hostnames, IPs, credentials in this project are dummy data for educational purposes. No real credentials are included.

---

## Technical Highlights

| Constraint | Decision | Why |
|---|---|---|
| **Zero dependencies** | Pure Vanilla JS + HTML/CSS | Single-file deployment to any static host |
| **Single `index.html`** | No build step, no npm | Open the file — it runs |
| **HA simulation** | 4 independent server states with shared `sapOn`/`dbOn` flags | Mirrors real SAP dual-stack topology |
| **Quiz engine** | Step validator (`cmd` / `tab` / `server` / `state` types) with localStorage persistence | No backend needed |
| **Pipe & redirect** | Real `|` filtering + `>` / `>>` / `less` / `more` pager | Teaches actual shell muscle memory |

---

## Architecture

```
State
├── Single mode:  activeTab ('ap' | 'db')  +  sapOn / dbOn
└── HA mode:      activeServer ('ap1'|'ap2'|'db1'|'db2')
                  + ap1On / ap2On / db1On / db2On (independent)

Data
├── FS_AP / FS_DB      — virtual filesystem trees
├── FILES_AP / FILES_DB — simulated file contents
└── QUIZZES[]          — 82 quiz definitions (haOnly:true for HA-only)

QuizEngine
├── step types: cmd (regex), tab, server, state
├── haHint / haInstruction — HA-aware hint overrides
└── onServer() — triggered by switchServer(), validates {type:'server'} steps
```

### HA Mode Topology

```
단일 모드                     이중화(HA) 모드
┌─────────────────┐           ┌──────────────────────────────────────────┐
│  AP  │  DB      │           │ AP1 (s4happ01) │ AP2 (s4happ02) │ DB1 … │
│  탭  │  탭      │           │    Primary     │   Secondary    │       │
└─────────────────┘           └──────────────────────────────────────────┘
```

---

## Simulated Environment

| Item | Value |
|------|-------|
| OS | SUSE Linux Enterprise Server 15 SP4 (Kernel 5.14.21) |
| SAP | S/4HANA 2023 — ABAP Kernel 793, Instance D00/D01 (NR=00/01) |
| HANA | SAP HANA 2.0 SPS 06+ |
| SID | S4H |
| AP hosts | `s4happ01` (Primary), `s4happ02` (Secondary) |
| DB hosts | `s4hdb01` (Primary), `s4hdb02` (Secondary / SR Sync) |

---

## Command Coverage

<details>
<summary><strong>SAP Commands (click to expand)</strong></summary>

```bash
# Lifecycle
startsap / stopsap
sapcontrol -nr 00 -function GetProcessList
sapcontrol -nr 00 -function GetSystemInstanceList
sapcontrol -nr 00 -function Start / Stop / StopWait
sapcontrol -nr 00 -function ABAPGetWPTable
sapcontrol -nr 00 -function ParameterValue <param>
sapcontrol -nr 00 -function GetAlertTree

# Diagnostics
dpmon / sm50
R3trans -d
lgtst /H/s4happ01 /S/sapmsS4H
disp+work -version / -V

# Transport
tp showbuffer S4H
tp addtobuffer <trkorr> S4H
tp importall S4H
```
</details>

<details>
<summary><strong>HANA Commands</strong></summary>

```bash
HDB start / stop / info / version
hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SERVICES"
hdbsql ... "M_DATABASES / M_DISK_USAGE / M_BACKUP_CATALOG / M_CONNECTIONS"
hdbsql ... "M_SYSTEM_OVERVIEW / M_VOLUME_SIZES / M_LICENSE"
hdbcons "replication info"
hdbbackupdiag --check
hdbnsutil -sr_state
hdbnsutil -sr_stateConfiguration
```
</details>

<details>
<summary><strong>Linux Commands</strong></summary>

```bash
# Filesystem
ls / cd / cat / vi / less / more / head / tail -f / find / wc / sort / uniq

# Process & Resource
ps / df / free / top / vmstat / iostat -x / uptime / dmesg

# Network
ping / netstat / ss / lsof / nslookup

# Permission
chmod / chown / su / id / groups

# System
systemctl status / uname / env / date / history / clear
```
</details>

---

## Quiz System

오른쪽 상단 **Quiz** 버튼으로 진입.

| Mode | Description |
|------|-------------|
| **단계별** | 순서대로 안내 받으며 실습. 힌트 요청 가능 |
| **자유** | 목표 상태만 주어지고 자유롭게 탐색 |

| Category | Topic | Count |
|----------|-------|-------|
| A–F | SAP 기동·정지, WP 진단, 트레이스, 프로파일, 권한 | 31 |
| G–J | HANA 기동, SQL 조회, 백업, 복제 | 20 |
| K–P | 전송, 디스크·메모리, 보안감사, 네트워크, 서비스, 종합 | 26 |
| **Q** | **HA 이중화 전용** (haOnly) | **5** |
| **Total** | Single mode: **77** / HA mode: **82** | |

### Quiz Step Types

| Type | Validates |
|------|-----------|
| `cmd` | 입력 명령어 → 정규식 매칭 |
| `tab` | AP↔DB 탭 전환 순서 |
| `server` | 특정 서버(ap1/ap2/db1/db2) 선택 |
| `state` | sapOn/dbOn 상태 변수 목표값 도달 |

---

## Run Locally

```bash
# Option 1 — just open the file
open index.html          # macOS
start index.html         # Windows

# Option 2 — local web server (recommended for localStorage stability)
python3 -m http.server 8080
# → http://localhost:8080
```

No npm install. No build step. No backend. The entire app is `index.html`.

---

## Development Process — AI-Assisted Maintainership

This project is maintained using a **structured multi-agent workflow** with Claude Code as orchestrator. The maintainer's role is to define architecture, set quality gates, and guide agents — not to write every line of code manually.

```
Maintainer Request
    │
    ▼
Team Lead (Claude Code — orchestrator)
    ├── Planner agent   →  docs/scenarios/    (scenario & learning design)
    ├── Searcher agent  →  docs/references/   (SAP/SUSE doc research)
    └── Developer agent →  index.html         (implementation)
                               │
                               ▼
                    Codex PR Review (P0/P1 block merge)
                               │
                               ▼
                          main branch
```

### What the Maintainer Owns

| Artifact | Purpose |
|----------|---------|
| `CLAUDE.md` | Project constitution — agent roles, constraints, architecture decisions, coding standards |
| `SAVEPOINT.md` | Session continuity checkpoint — new sessions restore full context from this file without re-reading code |
| `.claude/agents/*.md` | Role definitions for each sub-agent (Planner / Searcher / Developer) |
| `AGENTS.md` | Codex reviewer instructions — P0/P1 severity definitions, review scope |
| Memory system (`memory/`) | Cross-session user preferences and project decisions |

### Why This Workflow Demonstrates Maintainership

- **Context management across sessions** — CLAUDE.md + SAVEPOINT.md allow any new session to resume without history, the same way a maintainer onboards new contributors
- **Quality gates** — Codex review on every PR; P0/P1 findings are blocking; the maintainer defines what P0 means
- **Agent delegation** — maintainer decides *what* to build and *why*; agents implement; maintainer reviews and merges
- **Architecture ownership** — single-file constraint, zero-dependency rule, HA state model — all defined in CLAUDE.md and enforced across sessions

This is a practical demonstration of **AI-assisted open-source maintainership**: one person maintaining a non-trivial codebase with AI agents handling implementation details, while the human maintains architectural coherence and quality standards.

---

## Contribution

실제 SAP 환경과 다른 출력값·개선 아이디어가 있다면 Issue 또는 PR로 알려주세요.

실환경 검수 현황 (SAP Notes/KBA 기반):

- ✅ `sapcontrol GetProcessList` 컬럼 순서 — 검증 완료 (`name, description, dispstatus, textstatus, starttime, elapsedtime, pid` · KBA 2237021 / 2610358)
- ✅ `dispstatus` 값 — GREEN/YELLOW/GRAY로 교정 (RED는 비표준 · KBA 3303514 / 2237021)
- ✅ `startsap` / `stopsap` — deprecated 안내 출력 (SAP Note 1763593 / 809477, sapcontrol 권장)
- ⬜ `dpmon` 컬럼 레이아웃 — 추가 검수 필요 (직접 Note 근거 부족)
- ⬜ `hdbnsutil -sr_state` 세부 라인 — HANA 버전별 차이 확인 가능
- ⬜ HANA trace 파일 메시지 포맷 (`alert_*.trc`, `nameserver_*.trc`) — 정밀 검수 여지

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| v1 | 2026-05-07 | MVP — 15 SAP commands, basic filesystem |
| v2 | 2026-05-07 | grep/tail -f/find/vi/less/netstat, real pipe support, dpmon/sm50 |
| v3 | 2026-05-08 | DB server tab (HANA), AP↔DB dependency simulation |
| v0.100 | 2026-06-03 | Version management, 9 new commands, Agent architecture, Codex integration |
| v0.100 | 2026-06-03 | HA dual-server mode (AP1/AP2/DB1/DB2), 77 quizzes, `server` step type |
| v0.100 | 2026-06-04 | HA quiz improvements: haHint/haInstruction, 5 HA-only quizzes (82 total) |

> **Versioning note:** v1–v3 were prototype milestones (numbered per release day). Starting 2026-06-03 the project adopted the `APP_VERSION` scheme — `v0.x` marks the pre-1.0 phase; **v1.0 is reserved for the release whose command outputs have been fully audited against official SAP documentation** (see the verification checklist in [Contribution](#contribution)).

---

## License

MIT
