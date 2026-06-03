# hdbsql M_ 시스템 뷰 / dpmon

## 기준 환경
SAP HANA 2.0 SPS 06+

## M_SERVICES 실제 컬럼 (공식 문서 확인)

공식 컬럼: SERVICE_NAME, PORT, SQL_PORT, COORDINATOR_TYPE, DATABASE_NAME

**⚠️ 현재 구현 차이점**:
- `ACTIVE_STATUS`, `PROCESS_ID`, `DETAIL` 컬럼은 공식 문서에 없음
- 시뮬레이터 편의상 추가한 컬럼 — 학습 목적으로 유지 가능
- `COORDINATOR_TYPE` 추가 권장 (MASTER/SLAVE 구분)

## M_DATABASES 실제 컬럼 (공식 문서 확인)

공식 컬럼: DATABASE_NAME, DESCRIPTION, ACTIVE_STATUS, ACTIVE_STATUS_DETAILS, OS_USER, OS_GROUP, RESTART_MODE

**✅ 현재 구현과 대체로 일치**

## M_DISK_USAGE 실제 컬럼 (공식 문서 확인)

공식 컬럼: USAGE_TYPE, USED_SIZE, TOTAL_SIZE

**✅ 현재 구현과 일치**

## M_BACKUP_CATALOG 실제 컬럼 (공식 문서 확인)

공식 컬럼: BACKUP_ID, ENTRY_TYPE_NAME, STATE_NAME, SYS_START_TIME, UTC_START_TIME

**⚠️ 현재 구현 차이점**: STATE_NAME 컬럼 추가 권장

## M_CONNECTIONS (공식 문서 확인)

공식 문서에서 확인 — 다수의 연결 모니터링 컬럼 포함  
**✅ 학습 목적의 현재 구현 유지 가능**

## M_SYSTEM_OVERVIEW

**⚠️ 공식 SAP HANA 문서에서 확인 불가**  
SAP HANA 2.0에서 존재하지 않거나 이름이 다를 수 있음.  
→ NotebookLM으로 실제 HANA Admin Guide에서 확인 필요

## dpmon 컬럼 (공식 문서 확인)

```
No  Ty   Pid    Status  Reason  Start  Err  Sem  CPU   Time  Program  Cl   User
```

컬럼 설명:
- **No**: Work process 번호
- **Ty**: 유형 (DIA/UPD/ENQ/BTC/SPO/UP2)
- **Pid**: 프로세스 ID
- **Status**: 상태 (Running/Wait/Ended/PRIV/Hold)
- **Reason**: 대기 이유
- **CPU**: CPU 사용 시간
- **Time**: 경과 시간

**✅ 현재 구현과 컬럼 구조 일치**

## 출처
- https://help.sap.com/docs/SAP_HANA_PLATFORM/4fe29514fd584807ac9f2a04f6754767/20c4f3a175191014b4a3e79aada4fd95.html (M_SERVICES)
- https://help.sap.com/docs/SAP_HANA_PLATFORM/4fe29514fd584807ac9f2a04f6754767/20a8437d7519101495a3fa7ad9961cf6.html (M_BACKUP_CATALOG)
- https://sapbasisinfo.com/blog/2018/04/26/find-active-hana-ports-via-sql-queries/
- https://itsiti.com/dpmon-work-process-monitoring/
