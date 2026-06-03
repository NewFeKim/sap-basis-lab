# NotebookLM 업로드 소스 목록

> 이 파일의 문서들을 NotebookLM에 업로드하면 시뮬레이터 출력 정확도 검증에 활용할 수 있습니다.
> 업로드 후 Claude에게 "NotebookLM에서 [명령어] 실제 출력을 조회해줘" 형식으로 전달하세요.

---

## 우선순위 1 — 즉시 업로드 권장 (검증 급한 항목)

### SAP HANA Administration Guide
- **URL**: https://help.sap.com/docs/SAP_HANA_PLATFORM/6b94445c94ae495c83a19646e7c3fd56/330e5550b09d4f0f8b6e4362a2e4478d.html
- **검증 목적**: HDB info / HDB start / HDB stop / HDB version 정확한 출력 형식
- **PDF 다운로드**: SAP Help Portal → SAP HANA Platform 2.0 → Administration Guide → PDF

### SAP HANA SQL and System Views Reference
- **URL**: https://help.sap.com/docs/SAP_HANA_PLATFORM/4fe29514fd584807ac9f2a04f6754767/b4b0f6ed4fc3407c9b00f4baeb832a04.html
- **검증 목적**: M_SERVICES / M_DATABASES / M_DISK_USAGE / M_BACKUP_CATALOG / M_CONNECTIONS / M_SYSTEM_OVERVIEW 컬럼 목록 및 순서
- **PDF 다운로드**: SAP Help Portal → SAP HANA SQL and System Views Reference → PDF

### hdbnsutil Command Reference
- **URL**: https://help.sap.com/docs/SAP_HANA_PLATFORM/4e9b18c116aa42fc84c7dbfd02111aba/2dd26de6360046309e1579accbd9e527.html
- **검증 목적**: hdbnsutil -sr_state / -sr_stateConfiguration 정확한 출력 형식
- **비고**: 페이지 전체 복사하여 텍스트 파일로 업로드 가능

---

## 우선순위 2 — SAP Notes (S-user 로그인 필요)

> SAP Support Launchpad(https://launchpad.support.sap.com)에서 로그인 후 접근

| Note 번호 | 제목 | 검증 목적 |
|---|---|---|
| **809477** | sapcontrol - Complete Function Reference | GetProcessList / ABAPGetWPTable 컬럼 순서 |
| **1763593** | sapcontrol Usage Guide | 인증 옵션, 에러 코드, exit status |
| **2369910** | SAP HANA: hdbnsutil — System Replication Utility | hdbnsutil 전체 옵션 및 출력 형식 |
| **1747967** | HANA DB: Backup and Recovery using hdbbackupdiag | hdbbackupdiag 출력 형식 |
| **1642148** | dpmon / sm50 — Work Process Monitor | dpmon 정확한 컬럼 순서 |

---

## 우선순위 3 — 커뮤니티 포스트 (공개 접근)

> 아래 링크를 NotebookLM에 URL 소스로 추가하거나, 내용을 복사해서 업로드

| 주제 | 검색 쿼리 | 목적 |
|---|---|---|
| startsap 출력 형식 | `site:community.sap.com "startsap" output` | startsap/stopsap 메시지 검증 |
| HDB info 출력 | `site:community.sap.com "HDB info" output format` | HDB info 프로세스 트리 검증 |
| dpmon 컬럼 | `site:community.sap.com dpmon columns` | dpmon 컬럼 순서 검증 |
| tp showbuffer 형식 | `site:community.sap.com "tp showbuffer" output` | tp 출력 포맷 검증 |

---

## 우선순위 4 — SUSE Linux for SAP (공개)

### SUSE Linux Enterprise Server for SAP Applications Guide
- **URL**: https://documentation.suse.com/sles-sap/15-SP4/
- **검증 목적**: SLES 15 SP4 기준 커널 파라미터, systemctl 출력, /etc/fstab 형식
- **PDF 다운로드**: SUSE Documentation 사이트에서 직접 다운로드 가능

---

## NotebookLM 활용 쿼리 예시

업로드 후 다음 형식으로 질문하면 됩니다:

```
"SAP HANA Administration Guide 기준으로 HDB info 명령어의 정확한 출력 형식을 알려줘.
 특히 컬럼 순서(USER/PID/PPID/%CPU/VSZ/RSS/LstChg/COMMAND)가 맞는지 확인해줘."

"M_SERVICES 시스템 뷰의 컬럼 목록을 순서대로 알려줘.
 SERVICE_NAME, PORT, ACTIVE_STATUS 외에 어떤 컬럼이 있어?"

"sapcontrol GetProcessList 출력에서 dispstatus 값의 종류(GREEN/YELLOW/GRAY/RED)와
 textstatus 값의 종류를 알려줘."

"hdbnsutil -sr_state 출력의 정확한 형식을 보여줘.
 mode, done, Host Mappings 등의 순서가 맞는지 확인해줘."
```

---

## 검증 완료 후 처리 방법

1. NotebookLM에서 조회한 결과를 Claude 대화창에 붙여넣기
2. 팀장이 현재 index.html 구현과 비교
3. 차이가 있으면 `fix/accuracy-verification` 브랜치에서 수정
4. 수정 후 `docs/references/CMD_<명령어>.md`에 "(공식 문서 확인)" 표기로 저장

---

*작성: 2026-06-03 / 서칭자 에이전트 + 팀장*
