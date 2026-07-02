/* ───────────────────────────────────────────
   DB 서버 가상 파일시스템
─────────────────────────────────────────── */
const FS_DB={
  '/':['usr','hana','home','etc','var','tmp','proc','dev'],
  '/usr':['sap','bin','local','lib'],
  '/usr/sap':[SID,'hostctrl'],
  '/usr/sap/S4H':['HDB00','SYS'],
  '/usr/sap/S4H/HDB00':['exe','work','trace','backup'],
  '/usr/sap/S4H/HDB00/exe':['hdbdaemon','hdbsql','hdbcons','hdbbackupdiag','hdbbackupcheck','hdbuserstore','sapstartsrv'],
  '/usr/sap/S4H/HDB00/work':[],
  '/usr/sap/S4H/HDB00/trace':['alert_s4hdb01.trc','nameserver_s4hdb01.30001.000.trc','indexserver_s4hdb01.30003.000.trc','backup.log','daemon.trc'],
  '/usr/sap/S4H/HDB00/backup':['data','log'],
  '/usr/sap/S4H/SYS':['global','profile'],
  '/usr/sap/S4H/SYS/profile':['S4H_HDB00_s4hdb01'],
  '/hana':['shared','data','log','backup'],
  '/hana/shared':[SID],
  '/hana/shared/S4H':['HDB00','global','profile','hdbclient'],
  '/hana/shared/S4H/HDB00':['exe','work','trace'],
  '/hana/shared/S4H/HDB00/trace':['alert_s4hdb01.trc','nameserver_s4hdb01.30001.000.trc','indexserver_s4hdb01.30003.000.trc','backup.log'],
  '/hana/shared/S4H/global':['hdb'],
  '/hana/shared/S4H/global/hdb':['custom'],
  '/hana/shared/S4H/global/hdb/custom':['config'],
  '/hana/shared/S4H/global/hdb/custom/config':['global.ini','indexserver.ini','nameserver.ini'],
  '/hana/shared/S4H/profile':['S4H_HDB00_s4hdb01'],
  '/hana/shared/S4H/hdbclient':['hdbsql','hdbuserstore','libdbcapiHDB.so'],
  '/hana/data':[SID],
  '/hana/data/S4H':['mnt00001'],
  '/hana/data/S4H/mnt00001':['hdb00001.dat','hdb00002.dat'],
  '/hana/log':[SID],
  '/hana/log/S4H':['mnt00001'],
  '/hana/log/S4H/mnt00001':['hdblog00001.log','hdblog00002.log'],
  '/hana/backup':['data','log','catalog'],
  '/hana/backup/data':['COMPLETE_DATA_BACKUP_databackup_0_1','COMPLETE_DATA_BACKUP_databackup_1_1'],
  '/hana/backup/log':['log_backup_0_0_0_0.1746576000'],
  '/hana/backup/catalog':['log_backup_catalog_0_0.1746576000'],
  '/home':['s4hdb01adm','root'],
  '/home/s4hdb01adm':['.bash_profile','.sapenv_s4hdb01.sh','hdb_backup_check.sh'],
  '/home/root':['.bash_profile','.bashrc'],
  '/etc':['hosts','hostname','fstab','sysconfig','passwd','resolv.conf'],
  '/var':['log'],
  '/var/log':['messages','secure'],
  '/tmp':['hsperfdata_s4hdb01adm'],
};

/* ───────────────────────────────────────────
   DB 서버 파일 내용
─────────────────────────────────────────── */
const FILES_DB={
  '/usr/sap/S4H/HDB00/trace/alert_s4hdb01.trc':`[34765]{-1}[-1/-1] 2026-05-08 09:14:01.000000 i Alert       MemoryManager.cc(00234) : Memory usage normal: 48231 MB / 65536 MB (73%)
[34765]{-1}[-1/-1] 2026-05-08 09:14:05.000000 i Alert       DiskManager.cc(00156) : Disk usage normal: /hana/data 24%
[34765]{-1}[-1/-1] 2026-05-08 09:20:00.000000 w Alert       MemoryManager.cc(00412) : Memory usage high: 58000 MB / 65536 MB (88%)
[34765]{-1}[-1/-1] 2026-05-08 09:20:01.000000 w Alert       WorkloadManager.cc(00312) : High memory alert triggered (threshold: 85%)
[34765]{-1}[-1/-1] 2026-05-08 09:35:00.000000 i Alert       MemoryManager.cc(00234) : Memory usage normal: 48500 MB / 65536 MB (74%)`,

  '/usr/sap/S4H/HDB00/trace/nameserver_s4hdb01.30001.000.trc':`[34765]{-1}[-1/-1] 2026-05-08 09:14:01.123456 i nameserver     SQLMDA.cc(00434) : Starting nameserver
[34765]{-1}[-1/-1] 2026-05-08 09:14:01.234567 i nameserver     MasterNameServer.cc(00234) : Initializing nameserver
[34765]{-1}[-1/-1] 2026-05-08 09:14:02.345678 i nameserver     Catalog.cc(00123) : Loading catalog
[34765]{-1}[-1/-1] 2026-05-08 09:14:03.456789 i nameserver     MasterNameServer.cc(00456) : Nameserver started, topology loaded
[34765]{-1}[-1/-1] 2026-05-08 09:14:03.567890 i nameserver     NameServer.cc(00789) : System is ready`,

  '/usr/sap/S4H/HDB00/trace/indexserver_s4hdb01.30003.000.trc':`[34890]{-1}[-1/-1] 2026-05-08 09:14:05.123456 i indexserver    Startup.cc(00234) : Starting indexserver
[34890]{-1}[-1/-1] 2026-05-08 09:14:05.234567 i indexserver    AttributeEngine.cc(00456) : Loading column store
[34890]{-1}[-1/-1] 2026-05-08 09:14:08.345678 i indexserver    Startup.cc(00789) : Column store loaded (3.2 GB)
[34890]{-1}[-1/-1] 2026-05-08 09:14:09.456789 i indexserver    RowEngine.cc(00234) : Loading row store
[34890]{-1}[-1/-1] 2026-05-08 09:14:10.567890 i indexserver    Startup.cc(01023) : Indexserver ready, port 30003`,

  '/usr/sap/S4H/HDB00/trace/backup.log':`2026-05-07 02:00:00.000000 +0000  INFO    BACKINT  Starting COMPLETE DATA BACKUP
2026-05-07 02:00:03.123456 +0000  INFO    BACKINT  Backup ID: COMPLETE_DATA_BACKUP_databackup_0_1
2026-05-07 02:00:03.234567 +0000  INFO    BACKINT  Backing up volume 1 (DATA)
2026-05-07 04:12:44.345678 +0000  INFO    BACKINT  Volume 1 backup complete (48.3 GB)
2026-05-07 04:12:45.456789 +0000  INFO    BACKINT  COMPLETE DATA BACKUP successful
2026-05-08 00:00:01.000000 +0000  INFO    BACKINT  Starting LOG BACKUP
2026-05-08 00:00:01.123456 +0000  INFO    BACKINT  Log backup successful (2.1 GB)`,

  '/hana/shared/S4H/HDB00/trace/alert_s4hdb01.trc':`[34765]{-1}[-1/-1] 2026-05-08 09:14:01.000000 i Alert       MemoryManager.cc(00234) : Memory usage normal: 48231 MB / 65536 MB (73%)
[34765]{-1}[-1/-1] 2026-05-08 09:14:05.000000 i Alert       DiskManager.cc(00156) : Disk usage normal: /hana/data 24%
[34765]{-1}[-1/-1] 2026-05-08 09:20:00.000000 w Alert       MemoryManager.cc(00412) : Memory usage high: 58000 MB / 65536 MB (88%)
[34765]{-1}[-1/-1] 2026-05-08 09:20:01.000000 w Alert       WorkloadManager.cc(00312) : High memory alert triggered (threshold: 85%)
[34765]{-1}[-1/-1] 2026-05-08 09:35:00.000000 i Alert       MemoryManager.cc(00234) : Memory usage normal: 48500 MB / 65536 MB (74%)`,

  '/hana/shared/S4H/HDB00/trace/nameserver_s4hdb01.30001.000.trc':`[34765]{-1}[-1/-1] 2026-05-08 09:14:01.123456 i nameserver     SQLMDA.cc(00434) : Starting nameserver
[34765]{-1}[-1/-1] 2026-05-08 09:14:01.234567 i nameserver     MasterNameServer.cc(00234) : Initializing nameserver
[34765]{-1}[-1/-1] 2026-05-08 09:14:02.345678 i nameserver     Catalog.cc(00123) : Loading catalog
[34765]{-1}[-1/-1] 2026-05-08 09:14:03.456789 i nameserver     MasterNameServer.cc(00456) : Nameserver started, topology loaded
[34765]{-1}[-1/-1] 2026-05-08 09:14:03.567890 i nameserver     NameServer.cc(00789) : System is ready`,

  '/hana/shared/S4H/HDB00/trace/indexserver_s4hdb01.30003.000.trc':`[34890]{-1}[-1/-1] 2026-05-08 09:14:05.123456 i indexserver    Startup.cc(00234) : Starting indexserver
[34890]{-1}[-1/-1] 2026-05-08 09:14:05.234567 i indexserver    AttributeEngine.cc(00456) : Loading column store
[34890]{-1}[-1/-1] 2026-05-08 09:14:08.345678 i indexserver    Startup.cc(00789) : Column store loaded (3.2 GB)
[34890]{-1}[-1/-1] 2026-05-08 09:14:10.567890 i indexserver    Startup.cc(01023) : Indexserver ready, port 30003`,

  '/hana/shared/S4H/global/hdb/custom/config/global.ini':`[system_replication]
mode        = primary
actual_mode = primary

[persistence]
basepath_datavolumes = /hana/data/S4H
basepath_logvolumes  = /hana/log/S4H

[backup]
catalog_backup_using_backint          = false
log_backup_using_backint              = false
data_backup_buffer_size               = 2048
parallel_data_backup_backint_channels = 4

[communication]
listeninterface = .global

[multidb]
mode               = multidb
database_isolation = low`,

  '/home/s4hdb01adm/.bash_profile':`# SAP HANA environment for s4hdb01adm
SAPSYSTEMNAME=S4H;              export SAPSYSTEMNAME
SAPSYSTEM=00;                   export SAPSYSTEM
HDB_NR=00;                      export HDB_NR
DIR_INSTANCE=/usr/sap/S4H/HDB00; export DIR_INSTANCE
SECUDIR=/usr/sap/S4H/HDB00/exe/sec; export SECUDIR
. /usr/sap/S4H/HDB00/exe/sapenv_s4hdb01.sh
alias HDB='$DIR_INSTANCE/HDB'
umask 022`,

  '/home/s4hdb01adm/hdb_backup_check.sh':`#!/bin/bash
# HANA backup status check script
echo "=== Last Data Backup ==="
hdbsql -i 00 -u SYSTEM -p &lt;password&gt; "SELECT TOP 1 * FROM M_BACKUP_CATALOG WHERE ENTRY_TYPE_NAME='complete data backup' ORDER BY SYS_START_TIME DESC"
echo ""
echo "=== Last Log Backup ==="
hdbsql -i 00 -u SYSTEM -p &lt;password&gt; "SELECT TOP 1 * FROM M_BACKUP_CATALOG WHERE ENTRY_TYPE_NAME='log backup' ORDER BY SYS_START_TIME DESC"`,

  '/etc/hosts':`127.0.0.1   localhost
10.10.1.51  s4happ01 s4happ01.corp.com
10.10.1.52  s4hdb01  s4hdb01.corp.com
10.10.1.53  s4happ02 s4happ02.corp.com`,

  '/etc/fstab':`/dev/sda1  /              ext4  defaults          1 1
/dev/sdb1  /hana/shared   xfs   defaults,noatime  0 0
/dev/sdb2  /hana/data     xfs   defaults,noatime  0 0
/dev/sdb3  /hana/log      xfs   defaults,noatime  0 0
/dev/sdb4  /hana/backup   xfs   defaults,noatime  0 0`,

  '/etc/resolv.conf':`# Generated by NetworkManager
search corp.com
nameserver 10.10.1.1
nameserver 10.10.1.2`,

  '/var/log/messages':`May  8 09:14:00 s4hdb01 kernel: EXT4-fs (sda1): re-mounted
May  8 09:14:01 s4hdb01 sapstartsrv: starting SAP HANA instance S4H HDB00
May  8 09:14:03 s4hdb01 hdbdaemon: nameserver started (PID 34765)
May  8 09:14:05 s4hdb01 hdbdaemon: indexserver started (PID 34890)
May  8 09:14:11 s4hdb01 hdbdaemon: all services started, system RUNNING`,
};

