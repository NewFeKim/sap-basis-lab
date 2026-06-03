# SAP Basis Training Terminal — CLAUDE.md

## 프로젝트 목적

SAP Basis 신입 컨설턴트를 위한 **웹 기반 OS단 교육용 터미널 시뮬레이터**.
실제 SAP 바이너리 없이 AP/DB 서버의 디렉토리 구조, 환경변수, 명령어를 브라우저에서 실습.

### SAP Basis 컨설턴트 OS 업무 범위 (시뮬레이터 커버리지 기준)

| 카테고리 | 주요 업무 | 핵심 명령어/경로 |
|---|---|---|
| **기동/정지** | SAP/HANA 시스템 시작·정지, 상태 확인 | `startsap`, `stopsap`, `sapcontrol`, `HDB start/stop`, `hdbnsutil -sr_state` |
| **로그 분석** | Work Process 트레이스, HANA 트레이스, 시스템 로그 | `dev_w*`, `dev_disp`, `alert_*.trc`, `nameserver_*.trc`, `/var/log/messages` |
| **성능 모니터링** | CPU/메모리/디스크/I/O 모니터링, 병목 판단 | `top`, `free`, `df`, `vmstat`, `iostat` |
| **네트워크 확인** | 호스트 연결성, 포트 개방, DNS 확인 | `ping`, `netstat`, `lsof`, `telnet`, `nslookup` |
| **전송(Transport)** | 전송 디렉토리 구조 관리, tp 명령어 | `tp showbuffer`, `tp addtobuffer`, `/usr/sap/trans/` |
| **사용자/권한** | OS 사용자 전환, 파일 권한·소유자 확인 | `su -`, `id`, `groups`, `chmod`, `chown` |
| **HANA OS 관리** | HANA 백업·복구, 시스템 복제 상태 | `hdbsql`, `hdbbackupdiag`, `hdbnsutil`, `/hana/*/trace/` |
| **커널/파일 확인** | SAP 커널 버전·실행 파일 확인 | `disp+work -version`, `uname`, `ls -la /usr/sap/<SID>/SYS/exe/run/` |
| **파일시스템** | SAP 디렉토리 구조 탐색 및 파일 내용 확인 | `find`, `du`, `ls`, `cat`, `tail -f` |
| **트러블슈팅** | WP 크래시, RFC 오류, 전송 중단, 디스크 풀 | 위 명령어 복합 사용 |

---

## 기술 스택 & 제약사항

### 구현 제약
- **단일 파일(index.html) 유지** — 배포 편의를 위해 절대 분리 금지
- 순수 Vanilla JS + HTML/CSS — 외부 라이브러리, npm, 빌드 도구 사용 금지
- 다크 테마 고정 (배경: #0d1117)
- 한국어 주석 및 응답

### 시뮬레이션 기준 버전 (명령어 출력 진위 판단 기준)

| 항목 | 기준 |
|---|---|
| OS | SUSE Linux Enterprise Server 15 SP4 (Kernel 5.14.21-150400.24.81-default) |
| HANA | SAP HANA 2.0 SPS 06+ |
| SAP | S/4HANA 2023 (ABAP Kernel 793, Instance D00 / NR=00) |
| 포트 | 3`<NR>`XX 체계 (NR=00 기준: 3200/3300/3600/3601) |
| AP 사용자 | `s4hadm` (group: sapsys) |
| DB 사용자 | `s4hadm` + `hdbadm` (group: sapsys, GID 통일) |
| NFS 마운트 | `/sapmnt`, `/usr/sap/trans` → NFS / `/usr/sap/S4H/D00/work` → 로컬 |

---

## 현재 버전: v0.100

> **세이브포인트 → `SAVEPOINT.md` 참조** (세션 재개 시 이 파일부터 읽을 것)

### 구현 완료 (v0.100 기준)

**기반 인프라**
- AP 서버(s4happ01) + DB 서버(s4hdb01) 탭 전환 시뮬레이터
- 탭별 독립 파일시스템(FS_AP/FS_DB), 파일 내용(FILES_AP/FILES_DB), 상태 변수
- 파이프(|) 실제 필터링, 리다이렉션(>/>>), 페이저(less/more)
- sapOn/dbOn 상태변수 기동/정지 연동
- APP_VERSION 상수 기반 버전 표시 (v0.100)

**SAP 명령어**
startsap, stopsap, sapcontrol (GetProcessList/GetSystemInstanceList/GetAlertTree/ParameterValue/Start/Stop/StopWait/ABAPGetWPTable 등), dpmon, sm50, R3trans, lgtst, disp+work -version/-V, tp (showbuffer/addtobuffer/importall/count/connect, 세션 내 버퍼 유지)

**HANA 명령어**
HDB start/stop/info/version, hdbsql (M_SERVICES/M_DATABASES/M_DISK_USAGE/M_BACKUP_CATALOG/M_CONNECTIONS/M_SYSTEM_OVERVIEW/M_VOLUME_SIZES/M_LICENSE), hdbcons, hdbbackupdiag, hdbnsutil (-sr_state/-sr_stateConfiguration)

**Linux 명령어**
ls, cd, cat, vi/vim, less/more, head, tail/-f, grep, find (-name/-type/-size/-mtime), wc, sort, uniq, chmod, chown, ps, df, free, top, vmstat, iostat (-x), netstat/ss, lsof, uname, su/exit, env, pwd, whoami, hostname, date, uptime, history, clear, ping, du (-sh/--max-depth), systemctl status, id, groups, nslookup, dmesg

### 미구현 (다음 작업 대상)

**Phase 3 선행 개발 (PHASE3_DEV_TODO.md 참조):**
- `diskFullSim`, `memLowSim` 시뮬레이션 토글 (df/free/top 출력 변경)
- 퀴즈 시스템: QuizEngine / QuizUI / QuizStorage / QUIZZES 77개

**OS 명령어 추가 구현:**
- `telnet <host> <port>` (포트 연결성 확인)
- `journalctl -e`, `journalctl -u <service>` (systemd 로그)
- `/etc/resolv.conf` 파일 내용, `/usr/sap/trans/EPS/` 디렉토리

**HANA 파일시스템 확장:**
- `alert_*.trc`, `nameserver_*.trc`, `indexserver_*.trc` 파일 내용 (현재 경로만 있고 내용 없음)

---

## 세이브포인트 시스템

### 개념
`SAVEPOINT.md` 파일이 현재 개발 상태의 스냅샷이다.
**새 세션 시작 시 팀장이 가장 먼저 읽어야 할 파일.**

### 세이브포인트 갱신 규칙
커밋 또는 주요 작업 완료 시 팀장이 `SAVEPOINT.md`를 업데이트한다:

```
갱신 타이밍
  - 커밋 직후
  - 장시간 작업 세션 종료 전
  - 사용자가 명시적으로 저장 요청 시
```

### 세이브포인트 파일 위치
```
SAVEPOINT.md   ← 프로젝트 루트 (git 추적)
```

---

## Agent 역할 구분

이 프로젝트는 4개의 역할로 작업을 분담합니다.
**팀장(현재 Claude 세션)이 오케스트레이터 역할**을 하며, 나머지 3개는 필요 시 서브 에이전트로 호출합니다.

### 역할 정의

| 에이전트 | 역할 | 결과물 저장 위치 |
|---|---|---|
| **팀장 (Team Lead)** | 요청 분석, 서브 에이전트 조율, 품질 검토, PR 생성, Codex P0/P1 대응 | - |
| **기획자 (Planner)** | 시나리오 설계, 학습 목표 정의, 커버리지 검토 | `docs/scenarios/` |
| **서칭자 (Searcher)** | SAP/SUSE 공식 문서 수집, 실제 명령어 출력 샘플 확보 | `docs/references/` |
| **개발자 (Developer)** | index.html 코드 구현 (명령어 핸들러, FS/FILES 데이터) | `index.html` 직접 수정 |

### 에이전트 역할 파일 위치
각 서브 에이전트의 역할 정의는 `.claude/agents/` 에 저장되어 있다.
팀장은 서브 에이전트 호출 시 해당 파일을 Read하여 프롬프트에 포함한다.

```
.claude/agents/
  searcher.md   ← 서칭자 역할 정의 + 결과 파일 형식
  planner.md    ← 기획자 역할 정의 + 시나리오 명세 형식
  developer.md  ← 개발자 역할 정의 + 코드 구조 요약
```

### 오케스트레이션 원칙

```
사용자 요청 → 팀장 판단
  │
  ├── 실제 명령어 출력/경로 불확실
  │     → .claude/agents/searcher.md 로드
  │     → 서칭자 서브 에이전트 호출 (조사 대상 명시)
  │     → docs/references/CMD_<명령어>.md 저장 확인
  │
  ├── 새 시나리오/학습 목표 설계 필요
  │     → .claude/agents/planner.md 로드
  │     → 기획자 서브 에이전트 호출 (카테고리/범위 명시)
  │     → docs/scenarios/<시나리오>.md 저장 확인
  │
  ├── 구현 필요 (서칭자/기획자 결과 확인 후)
  │     → .claude/agents/developer.md 로드
  │     → 개발자 서브 에이전트 호출 (참조 파일 경로 명시)
  │     → index.html 수정 확인 + 검증
  │
  └── 소규모 수정 (CSS, 텍스트, 단순 버그)
        → 팀장이 직접 구현
```

**메모리 공유 방식:** 서브 에이전트 간 직접 통신 없음. 파일(`docs/`)을 통해서만 공유.
팀장은 현재 세션 대화 + `MEMORY.md` + 디스크 파일을 모두 참조 가능.
새 세션 시작 시 팀장은 `MEMORY.md`와 `docs/` 폴더의 파일로 컨텍스트를 복원.

---

## 자료 수집 워크플로우

### 1단계 — 서칭자 자동 수집 (WebSearch / WebFetch)
- `help.sap.com` — SAP 공식 문서 (로그인 불필요)
- `community.sap.com` — SAP Community 포스트
- `documentation.suse.com` — SUSE 공식 문서
- 결과: SAP Note 번호 목록, 관련 링크 → `docs/references/SEARCH_RESULTS.md` 저장

### 2단계 — NotebookLM 수동 처리 (사용자 담당)
서칭자가 수집한 Note 번호 / 링크를 사용자가 NotebookLM에 업로드.
이후 NotebookLM에서 필요한 정보(명령어 출력, 파라미터 등)를 조회하여 Claude에게 전달.

```
서칭자 → docs/references/SEARCH_RESULTS.md (Note번호, 링크 목록)
   ↓
사용자 → NotebookLM에 업로드
   ↓
사용자 → NotebookLM 조회 결과를 Claude 대화창에 붙여넣기
   ↓
팀장/개발자 → docs/references/CMD_<명령어>.md 저장 후 index.html 반영
```

### 수집 결과 파일 형식
```
docs/references/SEARCH_RESULTS.md  ← 서칭자가 수집한 Note번호, 링크 목록
docs/references/CMD_<명령어명>.md   ← 확정된 명령어 출력 샘플, 옵션, 경로
docs/scenarios/<시나리오명>.md      ← 퀴즈 시나리오 명세
```

---

## 코드 핵심 구조 (index.html)

```
상태 변수
├── SID = 'S4H'              // SAP System ID
├── AP_HOST = 's4happ01'     // AP 서버 호스트명
├── DB_HOST = 's4hdb01'      // DB 서버 호스트명
├── HOST (let)               // 현재 활성 호스트 (탭 전환 시 교체)
├── activeTab = 'ap'|'db'    // 현재 활성 탭
├── apCwd, apUser, sapOn     // AP 서버 상태
├── dbCwd, dbUser, dbOn      // DB 서버 상태
├── cwd, user                // 현재 활성 상태 (탭 전환 시 교체)
└── hist = []                // 명령어 히스토리

데이터 객체
├── FS_AP{}   / FS_DB{}      // 가상 파일시스템: 경로 → 자식 목록 배열
├── FILES_AP{}/ FILES_DB{}   // 파일 내용: 경로 → 문자열
├── FS (let)  / FILES (let)  // 현재 활성 FS/FILES (탭 전환 시 교체)
└── CMDS{}                   // 명령어 핸들러 테이블

핵심 함수
├── switchTab(tab)    // 탭 전환 (상태/FS/FILES/UI 일괄 교체)
├── rc(input)         // 명령어 실행 진입점
├── parsePipe(input)  // 파이프 파싱
├── handleRedirect()  // 리다이렉션 처리
├── ap(text, cls)     // 한 줄 출력 (cls: su/er/wa/in/mu)
├── rp(path)          // 경로 resolve (상대→절대)
└── isFile(path)      // 파일 여부 판별
```

### 출력 색상 클래스
| cls | 색상 | 용도 |
|-----|------|------|
| su | 초록 #56d364 | 성공 메시지 |
| er | 빨강 #f85149 | 에러 메시지 |
| wa | 노랑 #e3b341 | 경고 메시지 |
| in | 파랑 #79c0ff | 안내 메시지 |
| mu | 회색 #6e7681 | 부가 정보 |
| (없음) | 기본 #c9d1d9 | 일반 출력 |

---

## 명령어 추가 방법

### 1. 새 명령어 추가
```javascript
// CMDS{} 객체 안에 추가
// AP 전용이면 activeTab 체크 추가
CMDS['새명령어'] = function(args) {
  if(activeTab !== 'ap'){ ap('bash: 새명령어: command not found','er'); return; }
  ap('출력 내용', 'su');
};
```

### 2. 새 파일 내용 추가
```javascript
// FILES_AP{} 또는 FILES_DB{} 에 추가
FILES_AP['/경로/파일명'] = `파일 내용`;

// FS_AP{} 또는 FS_DB{} 에도 경로 등록 필요
FS_AP['/경로'] = ['파일명', '다른파일'];
```

### 3. 힌트 버튼 추가
```html
<!-- #hb-ap 또는 #hb-db div 안에 추가 -->
<span onclick="rc('새명령어')">새명령어</span>
```

---

## hdbsql 지원 쿼리 확장 방법
`CMDS.hdbsql()` 내부의 `if(sql.includes('...'))` 블록에 추가:
```javascript
}else if(sql.includes('M_CONNECTIONS')){
  apl(['CONNECTION_ID  USER    CLIENT_HOST  STATUS', ...]);
```

---

## 변경 이력
| 버전 | 날짜 | 내용 |
|------|------|------|
| v1 | 2026-05-07 | MVP: SAP 기본 명령어 15개, 기본 파일시스템 |
| v2 | 2026-05-07 | grep/tail-f/find/vi/less/netstat/lsof 추가, 파이프 실제 동작, dpmon/sm50 추가 |
| v3 | 2026-05-08 | DB 서버 탭 추가 (HANA), HDB/hdbsql/hdbcons/hdbbackupdiag 구현, 탭별 독립 FS/상태 |
| v3.1 | 2026-06-03 | CLAUDE.md 개정: SAP Basis OS 업무 범위 명세, 기준 버전 S/4HANA 2023(Kernel 793)으로 고정, Agent 역할 구분, NotebookLM 워크플로우 추가 |
| v0.100 | 2026-06-03 | 앱 버전 관리 체계 도입(APP_VERSION), 신규 명령어 9개 추가(id/groups/nslookup/iostat/disp+work/dmesg/tp/hdbnsutil), Kernel 793 배너 반영 |

---

# GitHub PR Workflow: Claude as Planner and Implementer

## Role

Claude Code (팀장)는 이 저장소의 오케스트레이터이자 구현자입니다.

Claude는 다음을 담당합니다:
- 요청 분석 및 서브 에이전트 조율
- 이슈/요구사항 파악
- 구현 계획 수립
- 코드 수정 (직접 또는 개발자 서브 에이전트 호출)
- 테스트 추가/업데이트
- PR 생성 및 Codex 리뷰 코멘트 대응

Codex는 다음을 담당합니다:
- PR 리뷰
- 정확성, 보안, 테스트, 유지보수성 문제 발견

Claude는 다음을 하지 않습니다:
- PR 머지
- 자기 PR 승인
- Codex P0 또는 P1 리뷰 코멘트 무시
- 무관한 코드 수정

---

## Standard Workflow

작업 요청마다:

1. 이슈, PR, 관련 파일 읽기
2. 목표를 간략히 재서술
3. 짧은 구현 계획 수립
4. 가장 작고 안전한 코드 변경
5. 변경된 동작에 대한 테스트 추가/업데이트
6. 가능한 경우 관련 검사 실행
7. PR 생성 또는 업데이트
8. 명확한 PR 설명 작성
9. Codex 리뷰 준비 완료 상태로 남기기
10. 머지하지 않음

---

## PR Requirements

모든 PR에 포함:

```md
## Summary

- 변경 내용
- 변경 이유

## Implementation Notes

- 중요한 설계 결정
- 트레이드오프
- 가정 사항

## Test Plan

- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] 수동 검증
- [ ] 해당 없음

실행한 명령어:

```bash
# 명령어 추가
```
