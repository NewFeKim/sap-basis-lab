# 공개 문서 대조 결과 (Accuracy Diff)

> 서칭자 에이전트(3개 병렬)가 수집한 공개 SAP 문서와 현재 index.html 구현 비교.
> 검증일: 2026-06-03 / 브랜치: fix/accuracy-verification

---

## 검증 상태 요약

| 명령어 | 검증 완료 | 차이 | 수정 여부 |
|---|---|---|---|
| GetProcessList starttime 형식 | ✅ | ⚠️ 슬래시→공백 | ✅ 수정 완료 |
| GetSystemInstanceList features | ✅ | ⚠️ ABAP→ABAP\|GATEWAY\|ICMAN\|IGS | ✅ 수정 완료 |
| HDB version (git merge time, weekstone) | ✅ | ⚠️ 필드 누락 | ✅ 수정 완료 |
| HDB version (branch 이름) | ✅ | ⚠️ hanab2sp06→fa/hana2sp06 | ✅ 수정 완료 |
| hdbnsutil -sr_state (6개 필드 누락) | ✅ | ⚠️ 다수 누락 | ✅ 수정 완료 |
| hdbnsutil -sr_state (mode 대소문자) | ✅ | ⚠️ PRIMARY→primary | ✅ 수정 완료 |
| hdbnsutil -sr_state (Host Mappings 형식) | ✅ | ⚠️ --→~~ | ✅ 수정 완료 |
| GetProcessList 컬럼 구조 | ✅ | ✅ 일치 | - |
| ABAPGetWPTable 컬럼 | ✅ | ✅ 일치 | - |
| startsap/stopsap 순서 | ✅ | ✅ 일치 | - |
| dpmon 컬럼 구조 | ✅ | ✅ 일치 | - |
| M_DATABASES 컬럼 | ✅ | ✅ 대체로 일치 | - |
| M_DISK_USAGE 컬럼 | ✅ | ✅ 일치 | - |
| M_BACKUP_CATALOG 컬럼 | ✅ | ✅ 일치 | - |
| M_SERVICES (ACTIVE_STATUS, PROCESS_ID) | ✅ | ⚠️ 비표준 컬럼 | 학습 목적 유지 |
| M_SYSTEM_OVERVIEW | ✅ | ⚠️ 공식 문서 미확인 | NotebookLM 검증 필요 |

---

## 수정 상세 내역

### 1. GetProcessList starttime 형식
- **변경 전**: `2026/04/23 06:20:11` (슬래시)
- **변경 후**: `2026 04 23 06:20:11` (공백, 공식 포맷)
- **출처**: SAP Basis Solutions 공식 문서 확인

### 2. GetSystemInstanceList features
- **변경 전**: `ABAP`
- **변경 후**: `ABAP|GATEWAY|ICMAN|IGS`
- **출처**: SAP 공식 GetSystemInstanceList 문서

### 3. HDB version 누락 필드 추가
- `git merge time: 2023-06-02 10:12:44` 추가
- `weekstone: 0000.00.0` 추가
- `branch: hanab2sp06` → `fa/hana2sp06` 수정

### 4. hdbnsutil -sr_state 개선
- `mode: PRIMARY` → `mode: primary` (소문자)
- 추가: `site id: 1`, `site name: SITE_1`, `active primary site: 1`
- 추가: `primary fully connected: true`, `full sync: false`, `primary time stamp`
- Host Mappings 구분선: `--` → `~~~~~~~~~~~~~~`
- Host Mappings 형식: `s4hdb01 -> SITE_1 (s4hdb01)`

---

## NotebookLM 검증 필요 항목

공개 문서로 확인하지 못한 항목들:

| 항목 | 이유 | NotebookLM 쿼리 |
|---|---|---|
| M_SYSTEM_OVERVIEW | 공식 문서에서 뷰 미확인 | "M_SYSTEM_OVERVIEW hana sql view columns" |
| HDB start/stop 상세 메시지 | 커뮤니티 간략 확인만 | "HDB start output GREEN YELLOW status" |
| ABAPReadSyslog 컬럼 | 공식 문서 접근 제한 | SAP Note 809477 내용 |
| dpmon 실제 컬럼 순서 | 커뮤니티 기반 확인 | "dpmon columns order actual output" |

---

*검증: 2026-06-03 / fix/accuracy-verification 브랜치*
