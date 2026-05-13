# Phase 3 개발 필요 항목

> Phase 3 (퀴즈 시스템) 착수 전 선행 개발이 필요한 항목 목록.
> 본 문서는 시나리오 77개를 현재 구현(v3)과 대조한 결과 도출됨.

작성일: 2026-05-13
대상 버전: v3 → v4 준비

---

## 1. Phase 3 개요 (요약)

| 항목 | 내용 |
|------|------|
| 목적 | 신입 Basis 컨설턴트 실습용 퀴즈 시스템 |
| 시나리오 수 | **77개** (카테고리 A~P, 16개) |
| 실행 모드 | 단계별 / 자유 모드 — 시나리오마다 둘 다 제공 |
| 검증 방식 | cmd 패턴 / tab 전환 / state 변수 — 시나리오별 적절히 혼용 |
| 힌트 정책 | 사용자 요청 시에만 표시 (자동 표시 ❌) |
| 진도 저장 | localStorage |
| 외부 의존 | 없음 (단일 index.html 유지) |
| 채점 시스템 | 없음 (피드백 위주) |

---

## 2. 시나리오 가능 여부 통계

| 구분 | 시나리오 수 | 비율 |
|------|------------|------|
| ✅ 즉시 사용 가능 | 60개 | 78% |
| ⚠️ 부분 수정 필요 | 8개 | 10% |
| ❌ 명령어 신규 개발 필요 | 9개 | 12% |

---

## 3. 개발 필요 항목 (착수 순서)

### 3-1. 신규 명령어 구현 (4종)

#### (1) `find` 옵션 확장
**현재 상태:** `-name`, `-type` 만 지원
**필요 옵션:**
- `-size +<N>M` / `-size -<N>M` (파일 크기 기준)
- `-mtime +N` / `-mtime -N` (수정 시각 기준)

**구현 위치:** `doFind()` 함수 (E:\dev\sap-bc-terminal\index.html)

**선행 작업:** 가상 파일 메타데이터 객체 추가
```javascript
const FILE_META = {
  '/usr/sap/S4H/HDB00/trace/indexserver_s4hdb01.30003.000.trc': {size_mb: 152, mtime_days: 5},
  '/usr/sap/S4H/D00/work/dev_w0': {size_mb: 8,   mtime_days: 1},
  '/usr/sap/S4H/D00/work/dev_disp': {size_mb: 3,   mtime_days: 1},
  // 등...
};
```

**관련 시나리오:** Q025, Q059, Q060

---

#### (2) `ping` 명령어
**필요 사양:**
- `ping <host> [-c N]` 형식
- 동일 SID 내부 호스트 (s4happ01, s4hdb01) → 응답 출력
- 외부 호스트 → "Destination Host Unreachable"
- DB 정지 상태에서 s4hdb01 ping → 정상 응답 (네트워크 레이어이므로)

**예상 출력:**
```
PING s4hdb01.corp.com (10.10.1.52) 56(84) bytes of data.
64 bytes from s4hdb01 (10.10.1.52): icmp_seq=1 ttl=64 time=0.234 ms
64 bytes from s4hdb01 (10.10.1.52): icmp_seq=2 ttl=64 time=0.198 ms
--- s4hdb01.corp.com ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
```

**관련 시나리오:** Q064

---

#### (3) `du` 명령어
**필요 사양:**
- `du -sh <path>` — 디렉토리 총 크기 요약
- `du -h --max-depth=N <path>` — 깊이 제한

**구현 방식:** 가상 디렉토리별 사이즈 데이터 정의 후 합산

**예상 출력:**
```
$ du -sh /usr/sap/trans
4.2G    /usr/sap/trans

$ du -h --max-depth=1 /usr/sap/trans
1.8G    /usr/sap/trans/data
1.5G    /usr/sap/trans/cofiles
512M    /usr/sap/trans/log
4.2G    /usr/sap/trans
```

**관련 시나리오:** Q068

---

#### (4) `systemctl` 명령어 (부분 구현)
**필요 사양:**
- `systemctl status sapinit`
- `systemctl status sapstartsrv_S4H_00`
- `systemctl status hdbdaemon` (DB 탭)

**구현 방식:** sapOn/dbOn 상태 연동

**관련 시나리오:** Q077

---

### 3-2. 시뮬레이션 토글 (퀴즈 모드 전용)

#### (5) 디스크 풀 / 메모리 부족 시나리오 상태

**필요 사양:**
- `let diskFullSim = false;` — `df -h` 출력을 풀 상태로 변경
- `let memLowSim = false;` — `free -m`, `top` 출력을 부족 상태로 변경
- 퀴즈 시작 시 자동 활성화, 퀴즈 종료/Ctrl+C 시 자동 해제

**구현 예시:**
```javascript
df(args){
  // ... 기존 로직
  if(diskFullSim){
    // 특정 마운트포인트를 95% 이상으로 변경한 출력 반환
  }
}
```

**관련 시나리오:** Q051 (디스크 풀), Q052 (메모리 부족)

---

### 3-3. 가상 파일/디렉토리 추가

#### (6) 감사 로그 파일
```javascript
FS_AP['/var/log']: [...기존, 'sap'],
FS_AP['/var/log/sap']: ['sec_audit_20260507','sec_audit_20260508'],
FILES_AP['/var/log/sap/sec_audit_20260508']: `... 감사 로그 내용 ...`,
```
**관련 시나리오:** Q061

---

#### (7) SAP service 시작 스크립트
```javascript
FS_AP['/etc']: [...기존, 'init.d', 'systemd'],
FS_AP['/etc/init.d']: ['sapinit','sapstartsrv_S4H_00'],
FILES_AP['/etc/init.d/sapinit']: `... systemd unit 내용 ...`,
```
**관련 시나리오:** Q077

---

#### (8) 전송 디렉토리 파일 목록
```javascript
FS_AP['/usr/sap/trans/data']: ['R000123.S4H','R000124.S4H','R000125.S4H', /* 등 */],
FS_AP['/usr/sap/trans/cofiles']: ['K000123.S4H','K000124.S4H','K000125.S4H', /* 등 */],
```
**관련 시나리오:** Q068

---

### 3-4. 기존 명령어 출력 데이터 보강 (시뮬레이션용)

| 명령어 | 추가 데이터 | 용도 |
|--------|------------|------|
| `df -h` | 디스크 풀 상태 출력 (특정 마운트 95%↑) | Q051 |
| `free -m` | 메모리 부족 출력 (available 100MB↓) | Q052 |
| `top` | CPU 점유 상위 프로세스 강조 | Q052, Q074 |
| `vmstat` | swap in/out 활발 상태 | Q052 |

---

## 4. Phase 3 핵심 모듈 (신규 작성)

선행 항목 완료 후 작성.

### 4-1. QuizEngine — 검증 로직
```javascript
const QuizEngine = {
  start(quizId, mode) {...},      // 퀴즈 시작 (mode: 'step' | 'free')
  validate(input) {...},           // 명령어 입력 검증
  validateState() {...},           // state 타입 검증 (명령어 실행 후 호출)
  validateTab(newTab) {...},       // tab 타입 검증 (탭 전환 시 호출)
  showHint() {...},                // 사용자 요청 시 힌트 노출
  advanceStep() {...},             // 다음 단계
  complete() {...},                // 완료 처리
  abort() {...},                   // 중단
};
```

### 4-2. QuizUI — UI 렌더링
```javascript
const QuizUI = {
  renderQuizList() {...},          // 퀴즈 선택 화면 (카테고리/난이도/모드)
  renderActivePanel() {...},       // 진행 중 패널 (현재 단계, 힌트 버튼)
  renderCompletion() {...},        // 완료 화면
  renderProgress() {...},          // 진도 표시 (완료한 퀴즈 수)
};
```

### 4-3. QuizStorage — 영구 저장
```javascript
const QuizStorage = {
  save() {...},                    // localStorage 저장
  load() {...},                    // localStorage 로드
  getCompleted() {...},            // 완료한 퀴즈 ID 목록
  getStats() {...},                // 통계 (시도/완료/힌트 사용)
  reset() {...},                   // 초기화
};
```

### 4-4. QUIZZES — 시나리오 데이터
```javascript
const QUIZZES = [
  {
    id: 'Q001',
    title: 'SAP 시스템 정상 기동',
    category: '기동/정지',
    difficulty: '초급',
    tab: 'either',
    description: '...',
    initialState: {sapOn: false, dbOn: false},
    // 단계별 모드
    steps: [
      {instruction: '...', expect: {type:'tab', value:'db'}, hint: '...'},
      {instruction: '...', expect: {type:'cmd',  pattern:/^HDB\s+start$/}, hint: '...'},
      // ...
    ],
    // 자유 모드
    freeform: {
      description: '...',
      goalState: {sapOn: true, dbOn: true},
      hint: '...',
    },
  },
  // ... 77개
];
```

---

## 5. 코드량 추정

| 모듈 | 예상 코드량 |
|------|------------|
| 선행 명령어 4종 (find 확장, ping, du, systemctl) | ~250 lines |
| 시뮬레이션 토글 + 출력 보강 | ~120 lines |
| 가상 파일/디렉토리 추가 | ~80 lines |
| QuizEngine | ~200 lines |
| QuizUI | ~150 lines |
| QuizStorage | ~50 lines |
| QUIZZES 데이터 (77개 × 평균 20 lines) | ~1,540 lines |
| HTML/CSS 추가 | ~100 lines |
| **합계** | **~2,490 lines** |

---

## 6. 착수 권장 순서

```
[0단계] 선행 명령어/데이터 개발  ← 본 문서의 3-1, 3-2, 3-3, 3-4
   ↓
[1단계] QuizStorage (가장 단순)
   ↓
[2단계] QuizEngine 코어 (검증 3타입 + 2모드)
   ↓
[3단계] QuizUI (퀴즈 리스트 / 진행 패널 / 완료 화면)
   ↓
[4단계] QUIZZES 시나리오 데이터 작성 (난이도 순: 초급 → 중급 → 고급)
   ↓
[5단계] 통합 테스트
   ↓
[6단계] 오류 검토 + 보안 검토 (simplify 스킬 활용)
```

---

## 7. 관련 문서

- `CLAUDE.md` — 프로젝트 한 줄 요약, 코드 구조 가이드
- `SAP_TERMINAL_PROJECT.md` — 프로젝트 전체 문서, 명령어 목록
- `docs_to_verify.txt` — 실환경 검수가 필요한 SAP 노트 목록
- `sapcontrol_error_guide.md` — sapcontrol 에러 코드 가이드

---

## 변경 이력

| 일자 | 내용 |
|------|------|
| 2026-05-13 | 초안 작성 (선행 개발 항목 9건 + 시뮬레이션 토글 2건 + 가상 파일 3건 도출) |
