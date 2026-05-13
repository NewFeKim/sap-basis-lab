# SAP Basis Training Terminal

신입 SAP Basis 컨설턴트를 위한 **웹 기반 OS단 교육용 터미널 시뮬레이터**입니다.  
실제 SAP 시스템 없이 브라우저에서 AP 서버 / DB 서버의 디렉토리 구조, 환경변수, 명령어를 실습하고 퀴즈로 점검할 수 있습니다.

---

## 개요

SAP Basis 업무에서 가장 빈번하게 사용하는 OS 레벨 작업을 브라우저에서 직접 실습할 수 있도록 만든 교육 도구입니다.  
별도 서버나 SAP 라이선스 없이 `index.html` 파일 하나만으로 실행됩니다.

> **주의**: 이 프로젝트의 모든 서버 주소, IP, 계정명, 비밀번호는 **교육용 더미 데이터**입니다.  
> 실제 시스템과 연결되지 않으며, 어떠한 실제 자격증명도 포함되어 있지 않습니다.

---

## 대상

- SAP Basis 컨설턴트 신입 / 입문자
- SAP 환경의 Linux OS 명령어를 처음 접하는 학습자
- SAP 기동/정지 절차 및 진단 명령어를 반복 연습하고 싶은 분

---

## 실습 환경

| 구분 | 내용 |
|------|------|
| AP 서버 | `s4happ01` — ABAP 인스턴스 (D00), ASCS01 |
| DB 서버 | `s4hdb01` — SAP HANA 2.0 (HDB00) |
| OS | SUSE Linux Enterprise Server 15 SP4 |
| SAP SID | S4H / 인스턴스 번호 00 |

---

## 주요 기능

### AP 서버 탭 (`s4happ01`)

**SAP 기동/정지**
```bash
startsap          # SAP 시스템 전체 기동
stopsap           # SAP 시스템 전체 정지
```

**SAP 상태 조회**
```bash
sapcontrol -nr 00 -function GetProcessList
sapcontrol -nr 00 -function GetSystemInstanceList
sapcontrol -nr 00 -function GetAlertTree
sapcontrol -nr 00 -function ParameterValue rdisp/wp_no_dia
dpmon             # Work Process 모니터 (= sm50)
R3trans -d        # DB 연결 테스트
lgtst /H/s4happ01 /S/sapmsS4H
```

**프로파일 / 트레이스 확인**
```bash
cat /usr/sap/S4H/SYS/profile/DEFAULT.PFL
tail -f /usr/sap/S4H/D00/work/dev_w0
grep ERROR /usr/sap/S4H/D00/work/dev_w0
```

---

### DB 서버 탭 (`s4hdb01`)

**HANA 기동/정지**
```bash
HDB start         # HANA 기동
HDB stop          # HANA 정지
HDB info          # 서비스 상태 확인
HDB version       # 버전 정보

# sapcontrol 방식 (동일 효과)
sapcontrol -nr 00 -function Start
sapcontrol -nr 00 -function Stop
sapcontrol -nr 00 -function GetProcessList
```

**HANA SQL 조회**
```bash
hdbsql -i 00 -u SYSTEM -p <password> "SELECT * FROM M_SERVICES"
hdbsql -i 00 -u SYSTEM -p <password> "SELECT * FROM M_DATABASES"
hdbsql -i 00 -u SYSTEM -p <password> "SELECT * FROM M_DISK_USAGE"
hdbsql -i 00 -u SYSTEM -p <password> "SELECT * FROM M_BACKUP_CATALOG"
```

**HANA 진단**
```bash
hdbcons "replication info"
hdbbackupdiag --check
tail -f /usr/sap/S4H/HDB00/trace/nameserver_s4hdb01.30001.000.trc
```

---

### 공통 Linux 명령어

```bash
# 파일시스템
ls -la /usr/sap/S4H    cd /hana/shared    cat /etc/hosts    pwd
vi /usr/sap/S4H/SYS/profile/DEFAULT.PFL
find /usr/sap/S4H -name "*.log"
find /usr/sap/S4H -size +5M          # 파일 크기 필터
find /usr/sap/S4H -mtime -1          # 최근 1일 내 수정
grep -i error /var/log/messages

# OS 리소스
df -h    free -m    top    ps aux    uptime    vmstat
du -sh /usr/sap/trans
du -h --max-depth=1 /usr/sap/trans

# 네트워크
netstat -tlnp    ss -tlnp    lsof -i :30015
ping s4hdb01 -c 4

# 서비스 상태
systemctl status sapinit
systemctl status hdbdaemon

# 파이프 & 리다이렉션
ps aux | grep dw
tail -f dev_w0 | grep ERROR
env | grep SAP
```

---

### AP ↔ DB 연계 시뮬레이션

실제 SAP 환경과 동일하게 AP/DB 간 의존관계가 구현되어 있습니다.

| 시나리오 | 동작 |
|----------|------|
| DB 정지 상태에서 `startsap` | D00 기동 시 DB 접속 실패로 중단 |
| DB 정지 상태에서 `R3trans -d` | DB 직접 접속 실패 (HANA 상태 체크) |
| DB 정지 상태에서 `sapcontrol GetProcessList` | WP 상태 `RED / Waiting for DB` 표시 |
| `sapcontrol GetSystemInstanceList` | AP/DB 양쪽 GREEN/GRAY 실시간 반영 |

---

## 퀴즈 시스템 (Phase 3)

오른쪽 상단 **Quiz** 버튼으로 진입합니다.

### 특징

- **77개 시나리오** — 카테고리 A~P (기동/정지, 트레이스, 백업, 네트워크, 보안 감사 등)
- **단계별 모드** — 순서대로 안내받으며 실습
- **자유 모드** — 목표 상태만 주어지고 자유롭게 명령어 실행
- **힌트** — 요청 시에만 표시 (자동 표시 없음)
- **진도 저장** — localStorage에 자동 저장 (브라우저 닫아도 유지)
- **채점 없음** — 피드백 위주, 부담 없는 실습 환경

### 시나리오 카테고리

| 카테고리 | 내용 | 시나리오 수 |
|----------|------|------------|
| A | SAP 기동/정지 | 6개 |
| B | SAP 상태 확인 | 5개 |
| C | Work Process 진단 | 5개 |
| D | 트레이스 파일 분석 | 5개 |
| E | 프로파일 파라미터 | 5개 |
| F | 사용자/권한 관리 | 5개 |
| G | HANA 기동/정지 | 5개 |
| H | HANA SQL 조회 | 5개 |
| I | HANA 백업/복구 | 5개 |
| J | HANA 복제 확인 | 5개 |
| K | 전송 관리 | 5개 |
| L | 디스크/메모리 진단 | 5개 |
| M | 보안 감사 로그 | 5개 |
| N | 네트워크 진단 | 5개 |
| O | 서비스 기동 확인 | 4개 |
| P | 종합 실습 | 2개 |

### 검증 방식

퀴즈는 3가지 방식으로 수행을 검증합니다.

| 타입 | 설명 |
|------|------|
| `cmd` | 입력한 명령어가 정규식 패턴과 일치하는지 확인 |
| `tab` | AP↔DB 서버 탭을 올바른 순서로 전환했는지 확인 |
| `state` | SAP/HANA 기동 상태 변수가 목표값에 도달했는지 확인 |

---

## 실행 방법

별도 설치 없이 파일을 열면 바로 실행됩니다.

```bash
# 로컬에서 열기
open index.html       # macOS
start index.html      # Windows

# 로컬 웹서버로 실행 (권장 — 퀴즈 진도 저장 안정화)
python3 -m http.server 8080
# → 브라우저에서 http://localhost:8080 접속
```

GitHub Pages, S3 정적 호스팅 등에 `index.html` 파일 하나만 업로드해도 배포됩니다.

---

## 기술 스택

- 순수 HTML + Vanilla JavaScript (외부 라이브러리 없음)
- 단일 파일 (`index.html`) — 빌드 도구, npm 불필요
- 브라우저만 있으면 어디서나 실행 가능

---

## 버전 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1 | 2026-05-07 | MVP: SAP 기본 명령어 15개, 기본 파일시스템 |
| v2 | 2026-05-07 | grep/tail -f/find/vi/less/netstat/lsof 추가, 파이프 실제 동작, dpmon/sm50 추가 |
| v3 | 2026-05-08 | DB 서버 탭 추가 (HANA), sapcontrol AP/DB 통합, AP↔DB 연계 시뮬레이션 |
| v4 | 2026-05-13 | 퀴즈 시스템 (77개 시나리오, 단계별/자유 모드), find -size/-mtime, ping, du, systemctl 추가 |

---

## 기여 / 개선

실제 SAP 환경과 다른 출력값이나 개선 아이디어가 있다면 Issue 또는 PR로 알려주세요.  
특히 아래 항목은 실환경 검수가 필요합니다:

- `sapcontrol GetProcessList` 컬럼 순서 및 정확한 서비스명
- `dpmon` 컬럼 레이아웃
- HANA trace 파일 메시지 포맷
- `startsap` / `stopsap` 출력 메시지 (커널 버전별)

---

## 라이선스

MIT License
