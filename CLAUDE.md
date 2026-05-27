# SAP Basis Training Terminal — CLAUDE.md

## 프로젝트 한 줄 요약
SAP Basis 신입 컨설턴트를 위한 **웹 기반 OS단 교육용 터미널 시뮬레이터**.
실제 SAP 바이너리 없이 AP/DB 서버의 디렉토리 구조, 환경변수, 명령어를 브라우저에서 실습.

---

## 기술 스택 & 제약사항
- **단일 파일(index.html) 유지** — 배포 편의를 위해 절대 분리 금지
- 순수 Vanilla JS + HTML/CSS — 외부 라이브러리, npm, 빌드 도구 사용 금지
- 다크 테마 고정 (배경: #0d1117)
- 한국어 주석 및 응답

---

## 현재 버전: v3 / Phase 2 완료

### 구현 완료
- AP 서버(s4happ01) 터미널 시뮬레이터
- DB 서버(s4hdb01) 터미널 시뮬레이터 — 탭으로 전환
- SAP 명령어: startsap, stopsap, sapcontrol, dpmon, sm50, R3trans, lgtst
- HANA 명령어: HDB start/stop/info/version, hdbsql, hdbcons, hdbbackupdiag
- Linux 명령어: ls/cd/cat/vi/less/tail -f/grep/find/wc/chmod/chown/ps/df/free/top/netstat/lsof 등
- 파이프(|) 실제 필터링 동작, 리다이렉션(>/>>), 페이저(less/more)
- 탭별 독립 파일시스템(FS_AP/FS_DB), 파일 내용(FILES_AP/FILES_DB)
- 탭별 독립 상태(cwd, user, sapOn/dbOn, 환경변수, ps/df/netstat 출력)
- sapOn/dbOn 상태변수로 기동/정지 연동

### 미구현 (다음 작업)
- 퀴즈 시스템 (Phase 3) — 설계 완료, 선행 개발 필요
  - 시나리오 77개 (카테고리 A~P)
  - 단계별 / 자유 모드 동시 제공
  - 검증 3타입 (cmd/tab/state), 힌트는 사용자 요청 시
  - 채점 시스템 없음 (피드백 위주), 진도는 localStorage
  - **선행 개발 항목은 `PHASE3_DEV_TODO.md` 참조**

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


---

# GitHub PR Workflow: Claude as Planner and Implementer

## Role

Claude Code is the planner and implementer for this repository.

Claude is responsible for:
- Understanding issues and requirements
- Creating an implementation plan
- Editing code
- Adding or updating tests
- Running relevant checks
- Creating or updating pull requests
- Responding to Codex review comments

Codex is responsible for:
- Reviewing pull requests
- Finding correctness, security, testing, and maintainability issues

Claude must not:
- Merge pull requests
- Approve its own work
- Ignore Codex P0 or P1 review comments
- Rewrite unrelated code

---

## Standard Workflow

For every requested task:

1. Read the issue, PR, and relevant files.
2. Restate the goal briefly.
3. Create a short implementation plan.
4. Make the smallest safe code change.
5. Add or update tests for changed behavior.
6. Run relevant checks when possible.
7. Create or update a pull request.
8. Write a clear PR description.
9. Leave the PR ready for Codex review.
10. Do not merge.

---

## PR Requirements

Every PR should include:

```md
## Summary

- What changed
- Why it changed

## Implementation Notes

- Important design decisions
- Tradeoffs
- Any assumptions

## Test Plan

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual verification
- [ ] Not applicable

Commands run:

```bash
# Add commands here