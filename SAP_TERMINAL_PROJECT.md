# SAP Basis Training Terminal — 프로젝트 문서

## 개요

신입 SAP Basis 컨설턴트를 위한 **웹 기반 OS단 교육용 터미널 시뮬레이터**.  
실제 SAP 바이너리 없이 AP 서버의 디렉토리 구조, 환경변수, SAP/Linux 명령어를 브라우저에서 실습할 수 있다.

- 현재 버전: **v3 (Phase 2 완료)**
- 구현 형태: 단일 HTML 파일 (React/JSX 없이 순수 HTML + Vanilla JS)
- 대상 서버: AP Server (s4happ01) — DB Server는 Phase 2 예정

---

## 파일 구조

```
sap-terminal/
├── SAP_TERMINAL_PROJECT.md   ← 이 파일 (프로젝트 문서)
├── index.html                ← 메인 터미널 (단일 파일로 배포 가능)
└── (향후)
    ├── scenarios/            ← 시나리오 기반 교육 스크립트
    ├── db-server.html        ← DB 서버 시뮬레이터 (Phase 2)
    └── quiz/                 ← 채점 기능 (Phase 3)
```

---

## 현재 구현 상태 (v2)

### 지원 명령어 목록

#### SAP 명령어
| 명령어 | 설명 | 비고 |
|--------|------|------|
| `startsap` | SAP 시스템 전체 기동 | sapOn 상태 변경 |
| `startsap r3` | ABAP 인스턴스만 기동 | |
| `stopsap` | SAP 시스템 전체 정지 | sapOn 상태 변경 |
| `sapcontrol -nr 00 -function GetProcessList` | WP 목록 조회 | |
| `sapcontrol -nr 00 -function GetSystemInstanceList` | 인스턴스 목록 | |
| `sapcontrol -nr 00 -function GetAlertTree` | 알럿 조회 | |
| `sapcontrol -nr 00 -function ParameterValue <param>` | 파라미터 값 조회 | |
| `dpmon` | Dispatcher Monitor (WP 상세) | sm50 별칭 동일 |
| `sm50` | dpmon과 동일 출력 | |
| `R3trans -d` | DB 연결 테스트 | sapOn 상태 연동 |
| `lgtst /H/... /S/...` | Message Server 연결 테스트 | |

#### Linux 명령어
| 명령어 | 설명 | 옵션 |
|--------|------|------|
| `ls` | 디렉토리 목록 | `-l`, `-a`, `-la` |
| `cd` | 디렉토리 이동 | 상대/절대 경로, `..` |
| `cat` | 파일 출력 | |
| `vi` / `vim` | 파일 뷰어 (읽기전용) | |
| `less` / `more` | 페이징 뷰어 | Space: 다음 / q: 종료 |
| `head` | 앞부분 출력 | `-n N` |
| `tail` | 뒷부분 출력 | `-n N`, `-f` (시뮬레이션) |
| `grep` | 패턴 검색 | `-v`, `-i`, `-n` |
| `find` | 파일 검색 | `-name`, `-type f/d` |
| `wc` | 행 수 카운트 | `-l` |
| `sort` | 정렬 | 파이프 조합 |
| `uniq` | 중복 제거 | 파이프 조합 |
| `chmod` | 권한 변경 (출력만) | |
| `chown` | 소유자 변경 (출력만) | |
| `ps` | 프로세스 목록 | `aux`, 파이프+grep |
| `df` | 디스크 사용량 | `-h` |
| `free` | 메모리 사용량 | `-m` |
| `top` | 프로세스 모니터 | 스냅샷 |
| `vmstat` | 시스템 통계 | |
| `netstat` | 포트/소켓 | `-tlnp` |
| `ss` | netstat 대체 | |
| `lsof` | 포트별 프로세스 | `-i :<port>` |
| `uname` | 커널 정보 | `-a` |
| `su` | 사용자 전환 | `su - s4hadm`, `su - root` |
| `exit` | 사용자 전환 복귀 | |
| `env` | 환경변수 | 파이프+grep 조합 |
| `pwd` | 현재 경로 | |
| `whoami` | 현재 사용자 | |
| `hostname` | 호스트명 | |
| `date` | 날짜/시간 | |
| `uptime` | 가동시간 | |
| `history` | 명령어 히스토리 | |
| `clear` | 화면 지우기 | Ctrl+L 동일 |

#### 파이프 & 리다이렉션
| 표현 | 지원 여부 |
|------|-----------|
| `cmd \| grep <pattern>` | ✅ (실제 필터링 동작) |
| `cmd \| grep -v <pattern>` | ✅ |
| `cmd \| wc -l` | ✅ |
| `cmd \| sort` | ✅ |
| `cmd > file` | ✅ (시뮬레이션 출력) |
| `cmd >> file` | ✅ (시뮬레이션 출력) |
| `2>&1` | ⚠️ 미구현 |
| 3중 이상 파이프 | ⚠️ 미구현 |

---

## 가상 파일시스템 구조

```
/
├── usr/
│   └── sap/
│       ├── S4H/
│       │   ├── D00/
│       │   │   ├── work/       ← dev_w0, dev_disp, dev_icm, dev_ms 등
│       │   │   ├── exe/        ← disp+work, icman, gwrd, R3trans
│       │   │   └── log/
│       │   ├── SYS/
│       │   │   ├── profile/    ← DEFAULT.PFL, S4H_D00_s4happ01 등
│       │   │   └── global/
│       │   └── ASCS01/
│       │       └── work/       ← dev_ms, dev_en
│       ├── hostctrl/
│       └── trans/
│           ├── data/
│           ├── cofiles/
│           └── log/
├── sapmnt/
│   └── S4H/
├── home/
│   ├── s4hadm/   ← .bash_profile, sap_trans_check.sh
│   └── root/
├── etc/
│   ├── hosts
│   └── fstab
└── var/
    └── log/
        └── messages
```

### 파일 내용이 구현된 경로 (FILES 객체)
- `/usr/sap/S4H/D00/work/dev_w0` — Work Process 트레이스
- `/usr/sap/S4H/D00/work/dev_disp` — Dispatcher 트레이스
- `/usr/sap/S4H/D00/work/dev_icm` — ICM 트레이스
- `/usr/sap/S4H/D00/work/dev_ms` — Message Server 트레이스
- `/usr/sap/S4H/D00/work/sapstart.log` — 기동 로그
- `/usr/sap/S4H/SYS/profile/DEFAULT.PFL` — 기본 프로파일
- `/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01` — 인스턴스 프로파일
- `/etc/hosts` — 호스트 목록
- `/etc/fstab` — 마운트 설정
- `/home/s4hadm/.bash_profile` — SAP 환경변수 설정
- `/home/s4hadm/sap_trans_check.sh` — 예제 스크립트
- `/var/log/messages` — 시스템 로그

---

## 주요 변수 / 상태

```javascript
const SID = 'S4H'           // SAP System ID
const HOST = 's4happ01'     // AP 서버 호스트명
const NR = '00'             // Instance Number

let cwd = '/usr/sap/S4H'   // 현재 디렉토리 (cd 명령으로 변경)
let user = 's4hadm'         // 현재 사용자 (su 명령으로 변경)
let sapOn = true            // SAP 기동 상태 (startsap/stopsap 연동)
let hist = []               // 명령어 히스토리 배열
let pagerLines = []         // less/more 페이저 내용
let pagerActive = false     // 페이저 활성화 여부
```

---

## 코드 구조

```
index.html
├── <style>          CSS (터미널 테마, 다크모드 고정)
├── <div#tr>         루트 컨테이너
│   ├── .tb          타이틀바 (신호등 버튼)
│   ├── .stabs       서버 탭 (AP / DB)
│   ├── #output      출력 영역
│   ├── #pager       페이저 컨트롤 바
│   ├── .ir          입력 행 (프롬프트 + input)
│   └── .hb          힌트 버튼 바
└── <script>
    ├── 상수/상태 변수
    ├── FS {}         가상 파일시스템 (경로 → 자식 목록)
    ├── FILES {}      파일 내용 (경로 → 문자열)
    ├── 유틸 함수
    │   ├── gp()      프롬프트 문자열 생성
    │   ├── up()      프롬프트 UI 업데이트
    │   ├── ap()      한 줄 출력
    │   ├── apl()     여러 줄 출력
    │   ├── rp()      경로 resolve (상대→절대)
    │   ├── isFile()  파일 여부 판별
    │   ├── showPager() / pagerNext() / pagerQuit()
    │   ├── doGrep()  grep 실행
    │   ├── doTail()  tail 실행 (-f 포함)
    │   ├── doFind()  find 실행
    │   ├── doVi()    vi 뷰어
    │   ├── doChmod() chmod 처리
    │   └── doChown() chown 처리
    ├── CMDS {}       명령어 핸들러 테이블
    ├── parsePipe()   파이프 파싱
    ├── handleRedirect() 리다이렉션 처리
    ├── rc()          명령어 실행 진입점
    └── 이벤트 리스너 (keydown: Enter/↑↓/Tab/Ctrl+C/Ctrl+L)
```

---

## 터미널 편의기능

| 키 | 동작 |
|----|------|
| `Enter` | 명령어 실행 |
| `↑` / `↓` | 히스토리 탐색 |
| `Tab` | 경로 자동완성 |
| `Ctrl+L` | 화면 지우기 |
| `Ctrl+C` | 현재 입력 취소 / 페이저 종료 |
| `Space` (페이저) | 다음 페이지 |
| `q` (페이저) | 페이저 종료 |

---

## 개발 로드맵

### Phase 1 — 완료 ✅
- AP 서버 OS단 시뮬레이터
- SAP 핵심 명령어 (sapcontrol, startsap, dpmon, R3trans 등)
- Linux 기본/텍스트처리 명령어
- 파이프/리다이렉션 기본 지원
- 가상 파일시스템 + 주요 파일 내용

### Phase 2 — 완료 ✅
- **DB 서버 탭 추가** (s4hdb01 / HANA)
  - `HDB start`, `HDB stop`, `HDB info`, `HDB version`
  - `hdbsql` mock 응답 (M_SERVICES, M_DATABASES, M_DISK_USAGE, M_BACKUP_CATALOG)
  - `hdbcons "replication info"`
  - `hdbbackupdiag --check`
  - `/hana/shared/`, `/hana/data/`, `/hana/log/`, `/hana/backup/` 디렉토리
  - 탭별 독립 상태 (FS, FILES, cwd, user, ps/df/netstat 출력, 환경변수)
  - DB 탭 전용 힌트 버튼 바

### Phase 3 — 예정
- 퀴즈/채점 기능 (명령어 입력 정확도 평가)
- 수강생 진도 관리
- Claude API 연동 (자유형 명령어 대응)

---

## Phase 2 DB 서버 추가 시 참고사항

### 추가할 파일시스템 경로
```javascript
'/hana/shared': ['S4H'],
'/hana/shared/S4H': ['HDB00', 'global', 'profile'],
'/hana/shared/S4H/HDB00': ['exe', 'work', 'trace'],
'/hana/shared/S4H/HDB00/trace': ['nameserver_s4hdb01.30001.000.trc', 'indexserver.trc'],
'/hana/data': ['S4H'],
'/hana/log': ['S4H'],
'/hana/backup': ['data', 'log'],
'/usr/sap/S4H/HDB00': ['work', 'exe'],
```

### 추가할 HANA 명령어 핸들러
```javascript
'HDB'(args) {
  // args[0]: start | stop | info | version
},
'hdbsql'(args) {
  // mock SQL 응답
},
'hdbcons'(args) {},
'hdbbackupdiag'(args) {},
```

### HANA 주요 환경변수 (DB 서버용)
```
HANA_SID=S4H
HDB_NR=00
DIR_INSTANCE=/usr/sap/S4H/HDB00
SECUDIR=/usr/sap/S4H/HDB00/exe/sec
PATH=/usr/sap/S4H/HDB00/exe:/hana/shared/S4H/hdbclient:$PATH
```

---

## 실제 SAP와의 차이점 (검수 필요 항목)

> 실제 SAP Basis 경험자가 아래 항목을 검토하고 수정하기를 권장한다.

| 항목 | 현재 시뮬레이터 | 실제 환경 확인 필요 |
|------|----------------|-------------------|
| sapcontrol 출력 컬럼 순서 | 추정 기반 | 실환경 출력 복사 권장 |
| dev_w0 로그 메시지 | 패턴 재현 | 실제 로그 발췌 권장 |
| dpmon 컬럼명 | 추정 기반 | 실환경 확인 필요 |
| startsap 출력 메시지 | 유사하게 재현 | 버전별 차이 있을 수 있음 |
| 포트 번호 체계 | 표준 규칙 적용 | 설치 환경마다 다를 수 있음 |

---

## 배포 방법

단일 HTML 파일로 완결되므로 별도 서버 불필요.

```bash
# 로컬 확인
open index.html

# 간단한 웹 서버로 서빙
python3 -m http.server 8080

# GitHub Pages, S3 정적 호스팅 등에 index.html 업로드만으로 배포 가능
```

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1 | 2026-05-07 | MVP: SAP 기본 명령어 15개, 기본 파일시스템 |
| v2 | 2026-05-07 | grep/tail -f/find/vi/less/netstat/lsof 등 추가, 파이프 실제 동작, 파일시스템 확장, dpmon/sm50 추가 |
| v3 | 2026-05-08 | DB 서버 탭 추가 (HANA), HDB/hdbsql/hdbcons/hdbbackupdiag 구현, 탭별 독립 FS/상태/힌트 버튼 |
