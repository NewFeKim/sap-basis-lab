/* ───────────────────────────────────────────
   AP 서버 가상 파일시스템
─────────────────────────────────────────── */
const FS_AP={
  '/':['usr','sapmnt','tmp','var','etc','home','proc','dev'],
  '/usr':['sap','bin','local','lib'],
  '/usr/sap':[SID,'hostctrl','trans'],
  '/usr/sap/S4H':['D00','SYS','ASCS01'],
  '/usr/sap/S4H/D00':['work','exe','log','data'],
  '/usr/sap/S4H/D00/work':['dev_w0','dev_w1','dev_w2','dev_w3','dev_disp','dev_icm','dev_ms','dev_rfc','stderr','stdout','sapstart.log'],
  '/usr/sap/S4H/D00/exe':['disp+work','icman','gwrd','msserv','sapstartsrv','R3trans'],
  '/usr/sap/S4H/D00/log':['sapstart.log','SLOG00.log'],
  '/usr/sap/S4H/SYS':['profile','global','exe'],
  '/usr/sap/S4H/SYS/profile':['DEFAULT.PFL','S4H_D00_s4happ01','S4H_ASCS01_s4happ01','S4H_MS_s4happ01'],
  '/usr/sap/S4H/SYS/global':['security','sapcontrol.xml'],
  '/usr/sap/S4H/ASCS01':['work','exe'],
  '/usr/sap/S4H/ASCS01/work':['dev_ms','dev_en','sapstart.log'],
  '/usr/sap/hostctrl':['exe','work'],
  '/usr/sap/trans':['data','cofiles','log','tmp','buffer','actlog'],
  '/usr/sap/trans/data':['R000123.S4H','R000124.S4H','R000125.S4H','R000126.S4H','R000127.S4H'],
  '/usr/sap/trans/cofiles':['K000123.S4H','K000124.S4H','K000125.S4H','K000126.S4H','K000127.S4H'],
  '/usr/sap/trans/log':['SLOG.log','ALOG20260507.log','ALOG20260508.log'],
  '/sapmnt':[SID],
  '/sapmnt/S4H':['global','profile','exe'],
  '/home':['s4hadm','root'],
  '/home/s4hadm':['.bash_profile','.sapenv_s4happ01.sh','sap_trans_check.sh'],
  '/home/root':['.bash_profile','.bashrc'],
  '/tmp':['sapinst_instdir','hsperfdata_s4hadm'],
  '/var':['log','run'],
  '/var/log':['messages','secure','zypper.log','sap'],
  '/var/log/sap':['sec_audit_20260507','sec_audit_20260508'],
  '/etc':['hosts','hostname','fstab','sysconfig','passwd','resolv.conf','init.d'],
  '/etc/init.d':['sapinit','sapstartsrv_S4H_00'],
};

/* ───────────────────────────────────────────
   AP 서버 파일 내용
─────────────────────────────────────────── */
const FILES_AP={
  '/usr/sap/S4H/D00/work/dev_w0':`trc file: "dev_w0", trc level: 1, release: "753"
*  ACTIVE TRACE LEVEL           1
*  ACTIVE TRACE COMPONENTS      all

M  Wed May 07 09:14:22 2026
M  ***LOG Q0I=> NiPConnect2: connect (s4hdb01.corp.com:30015) [nixxi.cpp 3066]
M  Wed May 07 09:14:22 2026
M  *** connected to DB (s4hdb01.corp.com:30015) ***
M  Wed May 07 09:14:23 2026
M  set_MBT_RQ_CONTEXT: CL_HTTP_SERVER=>HANDLE_REQUEST
W  Wed May 07 09:14:25 2026
W  WorkProcess is WAITING for roll-in
M  Wed May 07 09:40:01 2026
M  ThVBEnd: WP back to free state (type DIA, no.0)
M  Wed May 07 09:41:10 2026
M  ERROR => DpWPCheck: wp 2 (dia) not responding (PID 28474)
M  Wed May 07 09:41:10 2026
M  DpHdlDeadWp: wp 2 restarted (new PID: 28511)`,

  '/usr/sap/S4H/D00/work/dev_disp':`trc file: "dev_disp", trc level: 1, release: "753"
DpISetVBufLockTimeout: TIMEOUT = 5000
*  Wed May 07 09:14:20 2026
*  SAP Dispatcher - Start
*  kernel release                753
*  kernel make variant           753_REL
*  compiled on                   Linux GNU SLES-15 x86_64
*  compilation mode              UNICODE
*  compile time                  Feb 14 2026 12:33:22
*  Dispatcher runs with dp version 286000
*  nr of app server processes    6 DIA + 3 BTC + 2 SPO + 1 UPD + 1 UPD2
DpStartStopRecord: disp start finished`,

  '/usr/sap/S4H/D00/work/dev_icm':`trc file: "dev_icm", trc level: 1, release: "753"
[Thr 140411026644736] Wed May 07 09:14:21 2026
[Thr 140411026644736] IcmListenThreadMain: started
[Thr 140411026644736] NiBufListen: TCP port 8000 (HTTP) on s4happ01 (10.10.1.51)
[Thr 140411026644736] NiBufListen: TCP port 44300 (HTTPS) on s4happ01
[Thr 140411026644736] ICM started successfully`,

  '/usr/sap/S4H/D00/work/dev_ms':`trc file: "dev_ms", trc level: 1, release: "753"
MsIInitClientSlot: init slot table (maxServers=1000)
MsSrv2Name: server s4happ01_S4H_00, type AP
MsRegistrationOk: server s4happ01_S4H_00 registered OK`,

  '/usr/sap/S4H/D00/work/sapstart.log':`sapstart: starting SAP instance D00
sapstart: Wed May 07 2026 09:14:18
sapstart: /usr/sap/S4H/D00/exe/disp+work pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01
sapstart: process disp+work started, pid = 28472
sapstart: process icman started, pid = 28490
sapstart: process gwrd started, pid = 28483`,

  '/usr/sap/S4H/SYS/profile/DEFAULT.PFL':`SAPSYSTEMNAME = S4H
SAPSYSTEM = 00
SAPGLOBALHOST = s4happ01
rdisp/wp_no_dia = 6
rdisp/wp_no_btc = 3
rdisp/wp_no_spo = 2
rdisp/wp_no_upd = 1
rdisp/wp_no_vb2 = 1
icm/server_port_0 = PROT=HTTP,PORT=8000
icm/server_port_1 = PROT=HTTPS,PORT=44300
login/system_client = 100
zcsa/installed_languages = KE
abap/heap_area_total = 8589934592
em/initial_size_MB = 4096
rdisp/max_wprun_time = 600`,

  '/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01':`SAPSYSTEMNAME = S4H
SAPSYSTEM = 00
INSTANCE_NAME = D00
DIR_CT_RUN = /usr/sap/S4H/D00/exe
DIR_EXECUTABLE = /usr/sap/S4H/D00/exe
rdisp/myname = s4happ01_S4H_00
rdisp/mshost = s4happ01
rdisp/msserv = sapmsS4H
ms/server_port_0 = PROT=HTTP,PORT=8100
dbs/hdb/dbhost = s4hdb01.corp.com
dbs/hdb/dbname = S4H
dbs/hdb/schema = SAPABAP1`,

  '/etc/hosts':`127.0.0.1   localhost
10.10.1.51  s4happ01 s4happ01.corp.com
10.10.1.52  s4hdb01  s4hdb01.corp.com
10.10.1.53  s4happ02 s4happ02.corp.com`,

  '/etc/fstab':`/dev/sda1  /              ext4  defaults          1 1
/dev/sda3  /usr/sap       xfs   defaults,noatime  0 0
/dev/sdb1  /sapmnt        xfs   defaults,noatime  0 0
/dev/sdb2  /usr/sap/trans xfs   defaults,noatime  0 0
tmpfs      /dev/shm       tmpfs size=16G          0 0`,

  '/home/s4hadm/.bash_profile':`# SAP environment for s4hadm
SAPSYSTEMNAME=S4H; export SAPSYSTEMNAME
SAPSYSTEM=00;     export SAPSYSTEM
SAPGLOBALHOST=s4happ01; export SAPGLOBALHOST
. /usr/sap/S4H/D00/exe/sapenv_s4happ01.sh
umask 022`,

  '/home/s4hadm/sap_trans_check.sh':`#!/bin/bash
# Transport buffer check script
echo "=== Transport Buffer Status ==="
ls -lh /usr/sap/trans/data/ | tail -20
echo ""
echo "=== Cofiles ==="
ls -lh /usr/sap/trans/cofiles/ | tail -20`,

  '/var/log/sap/sec_audit_20260507':`AUD|2026-05-07 08:01:12|I|RFC_LOGON      |100|TESTUSER |s4happ01|RFC logon successful
AUD|2026-05-07 08:03:45|I|TRANSACTION    |100|TESTUSER |s4happ01|Transaction SE38 executed
AUD|2026-05-07 09:22:01|W|RFC_LOGON      |100|DEVUSER  |s4happ01|RFC logon failed — wrong password
AUD|2026-05-07 09:22:04|W|RFC_LOGON      |100|DEVUSER  |s4happ01|RFC logon failed — wrong password
AUD|2026-05-07 09:22:08|E|RFC_LOGON      |100|DEVUSER  |s4happ01|User locked after 3 failed attempts
AUD|2026-05-07 13:45:00|I|SU01_CHANGE    |000|BASISADM |s4happ01|User DEVUSER password reset`,

  '/var/log/sap/sec_audit_20260508':`AUD|2026-05-08 07:55:00|I|RFC_LOGON      |100|TESTUSER |s4happ01|RFC logon successful
AUD|2026-05-08 08:10:22|I|TRANSACTION    |100|BASISADM |s4happ01|Transaction SM59 executed
AUD|2026-05-08 08:12:05|I|TRANSACTION    |000|BASISADM |s4happ01|Transaction SU01 executed
AUD|2026-05-08 09:00:00|I|SYSTEM_LOGON   |000|s4hadm   |s4happ01|OS user s4hadm logged in via SSH
AUD|2026-05-08 09:14:18|I|SAP_START      |   |s4hadm   |s4happ01|SAP system S4H D00 started
AUD|2026-05-08 11:30:44|W|TABLE_ACCESS   |000|BASISADM |s4happ01|Direct table access: USR02 (SE16)
AUD|2026-05-08 11:31:02|E|AUTH_CHECK_FAIL|100|TESTUSER |s4happ01|Authorization check failed: S_DEVELOP`,

  '/etc/init.d/sapinit':`#!/bin/bash
### BEGIN INIT INFO
# Provides:       sapinit
# Required-Start: $network $remote_fs
# Required-Stop:  $network $remote_fs
# Default-Start:  3 5
# Default-Stop:   0 1 2 6
# Description:    SAP System Startup/Shutdown
### END INIT INFO

SAPSYSTEMNAME=S4H
SAPINSTANCE=D00
SAPUSER=s4hadm
. /usr/sap/S4H/D00/exe/sapenv_s4happ01.sh

case "$1" in
  start)
    echo "Starting SAP System $SAPSYSTEMNAME ..."
    su - $SAPUSER -c "startsap ALL"
    ;;
  stop)
    echo "Stopping SAP System $SAPSYSTEMNAME ..."
    su - $SAPUSER -c "stopsap ALL"
    ;;
  status)
    su - $SAPUSER -c "sapcontrol -nr 00 -function GetSystemInstanceList"
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac`,

  '/etc/init.d/sapstartsrv_S4H_00':`#!/bin/bash
### BEGIN INIT INFO
# Provides:       sapstartsrv_S4H_00
# Required-Start: $network $remote_fs
# Default-Start:  3 5
# Default-Stop:   0 1 2 6
# Description:    SAP Start Service for S4H Instance 00
### END INIT INFO

SAPUSER=s4hadm
SAPPROFILE=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01

case "$1" in
  start)
    su - $SAPUSER -c "sapstartsrv pf=$SAPPROFILE -D"
    ;;
  stop)
    su - $SAPUSER -c "sapcontrol -nr 00 -function StopService"
    ;;
esac`,

  '/usr/sap/trans/log/ALOG20260508.log':`ALOG20260508 - SAP Transport System Audit Log
================================================
2026-05-08 08:00:01  TP    S4H  Import queue check: 3 requests pending
2026-05-08 09:30:12  TP    S4H  Import started: K000125.S4H (DEV -> QAS)
2026-05-08 09:30:45  R3TR  S4H  Program ZSAPBC_TEST imported successfully
2026-05-08 09:30:47  TP    S4H  Import finished: K000125.S4H  RC=0`,

  '/etc/resolv.conf':`# Generated by NetworkManager
search corp.com
nameserver 10.10.1.1
nameserver 10.10.1.2`,

  '/var/log/messages':`May  7 09:14:15 s4happ01 kernel: EXT4-fs (sda1): re-mounted
May  7 09:14:18 s4happ01 sapstartsrv: starting SAP instance S4H D00
May  7 09:14:22 s4happ01 kernel: NFS: server s4hdb01 not responding
May  7 09:14:23 s4happ01 kernel: NFS: server s4hdb01 OK
May  7 09:40:01 s4happ01 sapstartsrv: [D00] disp+work: PID 28474 DEAD - restarting`,
};

