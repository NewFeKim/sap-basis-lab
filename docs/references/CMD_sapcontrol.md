# sapcontrol / startsap / stopsap

## 기준 환경
SLES 15 SP4 / SAP S/4HANA 2023 / Kernel 793

## GetProcessList 실제 출력 (공식 문서 확인)

```
GetProcessList
OK
name, description, dispstatus, textstatus, starttime, elapsedtime, pid
disp+work, Dispatcher, GREEN, Running, 2015 03 23 23:51:35, 263:27:26, 25549
igswd_mt, IGS Watchdog, GREEN, Running, 2015 03 23 23:51:35, 263:27:26, 25550
gwrd, Gateway, GREEN, Running, 2015 03 23 23:51:36, 263:27:25, 25590
icman, ICM, GREEN, Running, 2015 03 23 23:51:36, 263:27:25, 25591
```

**⚠️ 차이점**: starttime 형식이 `YYYY MM DD HH:MM:SS` (공백 구분)  
현재 구현: `2026/04/23 06:20:11` (슬래시 구분) → **수정 필요**

## GetSystemInstanceList 실제 출력 (공식 문서 확인)

```
GetSystemInstanceList
OK
hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
testserver001, 0, 50013, 50014, 3, ABAP|GATEWAY|ICMAN|IGS, GREEN
testserver001, 1, 50113, 50114, 1, MESSAGESERVER|ENQUE, GREEN
```

**⚠️ 차이점**: features 값이 파이프(`|`)로 연결  
현재 구현: `MESSAGESERVER|ENQUE` (일치) / `ABAP` 단독 → **`ABAP|GATEWAY|ICMAN|IGS`로 수정 필요**

## ABAPGetWPTable 실제 출력 (공식 문서 확인)

```
ABAPGetWPTable
OK
No, Typ, Pid, Status, Reason, Start, Err, Sem, Cpu, Time, Program, Client, User, Action, Table
 0, DIA, 28473, Wait,   ,    ,   , , 0.02, 1:25,          , 000,       ,
 1, DIA, 28474, Wait,   ,    ,   , , 0.12, 2:41, SAPMV45A , 100, TESTUSER,
```

**✅ 현재 구현과 일치**

## startsap 실제 출력 순서 (커뮤니티 확인)

```
Starting SAP System S4H ...
Checking smda97 (SAP Start Dialog) ... not running
Starting instance ASCS01
  Message Server .... ok
  Enqueue Server .... ok
Starting instance D00
  Dispatcher     .... ok
  ICM            .... ok
  Work Processes .... ok
SAP System S4H started.
```

**✅ 현재 구현과 대체로 일치** (smda97 체크 라인 없음 — 무시 가능)

## stopsap 실제 출력 순서

```
Stopping SAP System S4H ...
Stopping instance D00 ...
  Stopping Work Processes .... stopped
  Stopping ICM            .... stopped
  Stopping Dispatcher     .... stopped
Stopping instance ASCS01 ...
  Stopping Enqueue Server .... stopped
  Stopping Message Server .... stopped
SAP System S4H stopped.
```

**✅ 현재 구현과 일치 (역순 정지 순서 정확)**

## 출처
- https://buddysap.com/list-sapcontrol-command-startsystem-stopsystem-getprocesslist/
- https://sapbasissolutions.wordpress.com/2018/05/01/sapcontrols-instance-management-commands/
- https://help.sap.com/docs/SLTOOLSET/4fbd902c7c76410bb82c6311dd4dc94b/0a2f54809e064ee68b02fb9fb392bafd.html
- https://community.sap.com/t5/technology-blog-posts-by-sap/useful-sapcontrol-command-to-check-status-of-application-server/ba-p/13237593
