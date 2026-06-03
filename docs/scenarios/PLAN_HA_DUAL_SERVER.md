# 기획: AP/DB 이중화 (HA) 구조 도입

## 목표
SAP S/4HANA 실제 HA 환경을 시뮬레이션:
- AP 서버 2대 (Dialog Instance 다중화)
- DB 서버 2대 (HANA System Replication)
- 단일/이중화 모드 자유 전환

---

## 실제 SAP HA 환경 구조

```
[ 사용자 ]
    ↓ (Message Server 경유 로드밸런싱)
[ AP1: s4happ01 / D00 ]  [ AP2: s4happ02 / D01 ]
    ↓ (JDBC)                   ↓ (JDBC)
[ DB1: s4hdb01 (HANA Primary) ]
    ↕ (System Replication sync)
[ DB2: s4hdb02 (HANA Secondary) ]
```

**서버 역할:**
| 서버 | 호스트 | 역할 | 인스턴스 |
|---|---|---|---|
| AP1 | s4happ01 | Dialog Instance (Primary) | D00 / NR=00 |
| AP2 | s4happ02 | Dialog Instance (Secondary) | D01 / NR=01 |
| DB1 | s4hdb01 | HANA Primary | HDB00 |
| DB2 | s4hdb02 | HANA Secondary (HSR) | HDB00 |

**연관 관계:**
- AP1, AP2 모두 DB1(Primary)에 접속
- DB1 down 시 → DB2로 failover → AP 재접속
- AP1 down 시 → AP2로 사용자 자동 전환 (Message Server)

---

## UI 설계

### 모드 토글
터미널 상단 탭 영역 좌측에 배치:

```
[ 단일 | 이중화 ]  [AP Server (s4happ01)] [DB Server (s4hdb01)]
                                   ↕ 이중화 모드 전환 시
[ 단일 | 이중화 ]  [AP1 s4happ01] [AP2 s4happ02] [DB1 s4hdb01] [DB2 s4hdb02]
```

### 탭 색상 구분
- AP 계열: 파란 계열 테두리 (현재와 동일)
- DB 계열: 주황 계열 테두리 (HANA 색상)

---

## 단일 구조 연습 방안

### 문제
기존 시나리오 77개는 단일 AP + 단일 DB 기준으로 설계됨.
이중화 모드로 전환하면 어느 서버에서 연습해야 할지 혼란 가능.

### 해결책: 모드 분리

| 모드 | 탭 구성 | 대상 |
|---|---|---|
| **단일 모드** (기본) | AP + DB (2탭) | 기존 퀴즈 77개, 기초 학습자 |
| **이중화 모드** | AP1+AP2+DB1+DB2 (4탭) | HA 시나리오, 중급 이상 |

**단일 모드 특징:**
- AP = s4happ01 (D00) 고정
- DB = s4hdb01 (Primary) 고정
- 기존 모든 퀴즈 동작
- `localStorage`에 모드 저장 → 새로고침 후 유지

**이중화 모드 특징:**
- AP1/AP2 독립 상태 (각각 sapOn/Off)
- DB1 Primary, DB2 Secondary 역할 고정
- DB1 down 시뮬레이션 → DB2 Takeover 연습
- AP2 추가/제거 시나리오

### 학습 경로 권장
```
단일 모드 (기초)
  → 기동/정지, 로그분석, 성능모니터링 등 77개 시나리오
  
이중화 모드 (심화)
  → HANA System Replication 상태 확인
  → DB Failover (DB1 down → DB2 takeover)
  → AP 다중화 (AP2 추가, 로드밸런싱 확인)
  → HA 점검 루틴
```

---

## 구현 기술 설계

### 상태 변수 (신규)
```javascript
const AP2_HOST = 's4happ02';
const DB2_HOST = 's4hdb02';

let haMode = false;           // false=단일, true=이중화
let activeServer = 'ap1';     // 'ap1'|'ap2'|'db1'|'db2'

// 서버별 독립 기동 상태
let ap1On = true;   // sapOn과 동기화 (ap1 활성 시)
let ap2On = true;
let db1On = true;   // dbOn과 동기화 (db1 활성 시)
let db2On = true;

// AP2 독립 상태
let ap2Cwd = '/usr/sap/S4H', ap2User = 's4hadm';
// DB2 독립 상태
let db2Cwd = '/hana/shared/S4H', db2User = 's4hdb02adm';
```

### 하위 호환성 전략
`activeTab`('ap'|'db')과 `sapOn`/`dbOn`은 유지 — 기존 퀴즈/명령어 코드 수정 없음.
서버 전환 시 이들을 자동으로 동기화:

```
switchServer('ap2') 실행 시:
  activeTab = 'ap'       ← 기존 코드 호환
  HOST = AP2_HOST        ← 명령어 출력에 s4happ02 표시
  sapOn = ap2On          ← startsap/stopsap 등 기존 명령어 동작
  cwd, user = ap2 상태   ← 프롬프트 정확성
```

### 파일시스템 공유
- AP2는 AP1과 동일한 FS_AP/FILES_AP 공유 (같은 SAP 시스템)
  - 단, 인스턴스 D01 경로가 차이남 (D00→D01)
- DB2는 DB1과 동일한 FS_DB/FILES_DB 공유 (HANA secondary)
  - hdbnsutil 출력만 다름 (SECONDARY 표시)

### 이중화 전용 명령어 변화
| 명령어 | 단일(DB1) | 이중화(DB2) |
|---|---|---|
| `hdbnsutil -sr_state` | mode: primary | mode: secondary |
| `HDB info` | Primary 프로세스 | Secondary 프로세스 |
| `sapcontrol GetSystemInstanceList` | 3개 (ASCS+D00+HDB1) | 4개 (추가: HDB2) |
| `hdbnsutil -sr_stateConfiguration` | primary | secondary |

---

## Phase 4 퀴즈 아이디어 (이중화 전용)

| ID | 제목 | 시나리오 |
|---|---|---|
| HA001 | HANA SR 상태 확인 | DB1에서 sr_state로 SYNC 확인 |
| HA002 | Secondary 상태 점검 | DB2로 전환, sr_state SECONDARY 확인 |
| HA003 | DB Failover 시뮬레이션 | DB1 stop → DB2 takeover 절차 |
| HA004 | AP2 서버 기동 확인 | AP2 startsap → GetProcessList |
| HA005 | 전체 HA 점검 루틴 | 4개 서버 순서대로 상태 확인 |

---

*작성: 2026-06-03 / feat/ha-dual-server 브랜치*
