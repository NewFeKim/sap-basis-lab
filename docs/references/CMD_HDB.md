# HDB / hdbnsutil 명령어

## 기준 환경
SLES 15 SP4 / SAP HANA 2.0 SPS 06 (2.00.067)

## HDB info 실제 출력 (공식 문서 확인)

```
HDB info for: s4hdb01adm
  pid    ppid  %cpu vsz        rss        LstChg   command
hdbdaemon is running (pid: 34765)
  34765     1   0.0  218772     12436      09:14:01  hdbdaemon --processname=hdbdaemon
  34766 34765   0.3  2254188   1154232     09:14:03  hdbnameserver
  34767 34765   0.1   487654    298432     09:14:05  hdbpreprocessor
  34890 34765   0.2   876543    345678     09:14:07  hdbindexserver -port 30003
  34892 34765   0.1   124512     51200     09:14:11  hdbwebdispatcher
```

**✅ 현재 구현과 대체로 일치** (헤더 "hdbdaemon is running" 라인 없음 — 추가 가능)

## HDB version 실제 출력 (공식 문서 확인)

```
HDB version info:
  version:             2.00.067.00.1690000000
  branch:              fa/hana2sp06
  machine config:      linuxx86_64
  git hash:            9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b
  git merge time:      2023-07-22 03:15:00
  weekstone:           0000.00.0
  compile date:        2023-07-22 03:27:06
  compile host:        ld7272
  compile type:        rel
```

**⚠️ 현재 구현에서 누락 필드:**
- `git merge time` → **추가 필요**
- `weekstone` → **추가 필요**
- `compile host` → **추가 필요**
- `compile type` → **추가 필요**

## hdbnsutil -sr_state 실제 출력 (공식 문서 확인)

### Primary 출력:
```
System Replication State
~~~~~~~~~~~~~~~~~~~~~~~~

mode: primary
site id: 1
site name: SITE_1
active primary site: 1
primary fully connected: true
full sync: false
primary time stamp: 2026-05-08 09:14:00.000000
Replication mode of s4hdb01: PRIMARY
Operation mode of s4hdb01: primary

Host Mappings:
~~~~~~~~~~~~~~

s4hdb01 -> SITE_1 (s4hdb01)

done.
```

**⚠️ 현재 구현과 차이점:**
- `site id`, `site name` 누락 → **추가 필요**
- `active primary site` 누락 → **추가 필요**
- `primary fully connected` 누락 → **추가 필요**
- `full sync` 누락 → **추가 필요**
- `primary time stamp` 누락 → **추가 필요**
- `mode:` 값이 `PRIMARY` → **`primary` (소문자)로 수정 필요**
- `Host Mappings` 섹션 구분선(`~~`) 형식 → **수정 필요**

## HDB start / HDB stop 실제 출력 (커뮤니티 확인)

**HDB start:**
```
Starting...
[각 서비스별 GREEN/YELLOW 상태 진행 표시]
Impromptu CCC initialization by 'rscpCInit'
Done
```

**HDB stop:**
```
Stopping...
hdbdaemon will wait maximal 300 seconds for NewDB services finishing
[각 서비스별 정지 진행]
Done
```

**⚠️ 현재 구현**: 상세 진행 메시지 없음 — 학습 목적으로 허용 가능

## 출처
- https://help.sap.com/docs/SAP_HANA_PLATFORM/4e9b18c116aa42fc84c7dbfd02111aba/14e7d23911de4b34850d53718dcb960d.html
- https://help.sap.com/docs/SAP_HANA_PLATFORM/4e9b18c116aa42fc84c7dbfd02111aba/2dd26de6360046309e1579accbd9e527.html
- https://docs.redhat.com/en/documentation/red_hat_enterprise_linux_for_sap_solutions/9/html/configuring_sap_hana_scale-up_multitarget_system_replication_for_disaster_recovery/
- https://insights-core.readthedocs.io/en/latest/shared_parsers_catalog/sap_hdb_version.html
