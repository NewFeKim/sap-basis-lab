/* ───────────────────────────────────────────
   명령어 핸들러 테이블 (CMDS)
─────────────────────────────────────────── */
const CMDS={

  help(){
    if(activeTab==='db'){
      apl([
        `─── SAP Basis OS Training Terminal ${APP_VERSION} (DB Server) ──────────`,
        '  [HANA 기동/정지 — HDB 방식]',
        '    HDB start      HDB stop      HDB info      HDB version',
        '',
        '  [HANA 기동/정지 — sapcontrol 방식]',
        '    sapcontrol -nr 00 -function Start',
        '    sapcontrol -nr 00 -function Stop',
        '    sapcontrol -nr 00 -function StopWait',
        '',
        '  [HANA 상태 조회 — sapcontrol]',
        '    sapcontrol -nr 00 -function GetProcessList',
        '    sapcontrol -nr 00 -function GetSystemInstanceList',
        '    sapcontrol -nr 00 -function GetAlertTree',
        '    sapcontrol -nr 00 -function GetVersionInfo',
        '    sapcontrol -nr 00 -function ParameterValue <param>',
        '',
        '  [HANA SQL]',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SERVICES"',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DATABASES"',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DISK_USAGE"',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_BACKUP_CATALOG"',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_CONNECTIONS"',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SYSTEM_OVERVIEW"',
        '',
        '  [HANA 진단]',
        '    hdbcons "replication info"  (⚠ 전문가 전용)',
        '    hdbbackupdiag --check',
        '    hdbbackupcheck <backup-prefix>',
        '',
        '  [HANA 사용자 스토어]',
        '    hdbuserstore list',
        '    hdbuserstore get <KEY>',
        '    hdbuserstore set <KEY> <HOST:PORT> <USER> <PW>',
        '    hdbuserstore delete <KEY>',
        '',
        '  [HANA SQL — 추가]',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_VOLUME_SIZES"',
        '    hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_LICENSE"',
        '',
        '  [파일시스템]',
        '    ls [-la] [path]    cd [path]    cat <file>    pwd',
        '    vi <file>    less <file>    find <path> -name "*.trc"',
        '',
        '  [텍스트 처리]',
        '    grep [-v|-i|-n] <pattern> <file>    tail [-f] <file>',
        '    head [-n N] <file>    wc -l <file>',
        '',
        '  [OS 리소스]',
        '    df -h    free -m    top    ps aux    netstat -tlnp',
        '    du -sh <path>    du -h --max-depth=1 <path>',
        '    ping [-c N] <host>',
        '',
        '  [서비스 관리]',
        '    systemctl status hdbdaemon',
        '    systemctl status sapstartsrv_S4H_HDB00',
        '',
        '  [환경/기타]',
        '    env | grep HDB    hostname    date    whoami',
        '    su - s4hdb01adm    su - root    exit    clear    history',
        '──────────────────────────────────────────────────────────────',
      ]);
    }else{
      apl([
        `─── SAP Basis OS Training Terminal ${APP_VERSION} ────────────────────`,
        '  [SAP 기동/정지]',
        '    startsap [r3|ascs]       stopsap [r3|ascs]',
        '',
        '  [sapcontrol]',
        '    sapcontrol -nr 00 -function GetProcessList',
        '    sapcontrol -nr 00 -function GetSystemInstanceList',
        '    sapcontrol -nr 00 -function GetAlertTree',
        '    sapcontrol -nr 00 -function ParameterValue <param>',
        '    sapcontrol -nr 00 -function ABAPGetWPTable',
        '    sapcontrol -nr 00 -function GetQueueStatistic',
        '    sapcontrol -nr 00 -function ABAPReadSyslog',
        '    sapcontrol -nr 00 -function GetEnvironment',
        '',
        '  [SAP 진단]',
        '    dpmon          sm50          R3trans -d',
        '    lgtst /H/s4happ01 /S/sapmsS4H',
        '',
        '  [SAP OS 도구]',
        '    sappfpar -v <param> pf=<profile>',
        '    sappfpar check pf=<profile>',
        '    saposcol [-s|-d|-k]',
        '    disp+work -V',
        '    sapcontrol -nr 00 -function StartSystem',
        '    sapcontrol -nr 00 -function StopSystem',
        '    sapcontrol -nr 00 -function RestartService',
        '',
        '  [파일시스템]',
        '    ls [-la] [path]    cd [path]    cat <file>    pwd',
        '    vi <file>    less <file>    head [-n N] <file>',
        '    find <path> -name "*.log"    find <path> -type f',
        '    chmod <mode> <file>    chown <user> <file>',
        '',
        '  [텍스트 처리]',
        '    grep [-v|-i|-n] <pattern> <file>',
        '    tail [-f] [-n N] <file>',
        '    head [-n N] <file>    wc -l <file>',
        '    cat <file> | sort    cat <file> | uniq',
        '',
        '  [파이프 & 리다이렉션]',
        '    ps aux | grep dw',
        '    tail -f dev_w0 | grep ERROR',
        '    cat file > /tmp/out.txt',
        '',
        '  [OS 리소스]',
        '    df -h    free -m    top    uptime    vmstat',
        '    ps aux [| grep <name>]',
        '    netstat -tlnp    ss -tlnp    lsof -i :<port>',
        '    du -sh <path>    du -h --max-depth=1 <path>',
        '    ping [-c N] <host>',
        '',
        '  [서비스 관리]',
        '    systemctl status sapinit',
        '    systemctl status sapstartsrv_S4H_00',
        '',
        '  [환경/기타]',
        '    env | grep SAP    hostname    date    whoami    uname -a',
        '    su - s4hadm    su - root    exit    clear    history',
        '──────────────────────────────────────────────────────────────',
      ]);
    }
  },

  clear(){document.getElementById('output').innerHTML='';},
  pwd(){ap(cwd);},
  whoami(){ap(user);},
  hostname(){ap(HOST);},
  date(){ap(new Date().toString());},
  uptime(){
    const load=activeTab==='db'?'0.82, 0.91, 1.03':'1.23, 1.45, 1.51';
    ap(` 09:42:17 up 14 days,  3:22,  2 users,  load average: ${load}`);
  },
  history(){hist.slice(-30).forEach((h,i)=>ap(`  ${String(i+1).padStart(3)}  ${h}`));},

  uname(args){
    if(args.includes('-a'))
      ap(`Linux ${HOST} 5.14.21-150400.24.81-default #1 SMP PREEMPT_DYNAMIC Wed Jan 31 06:34:21 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux`);
    else ap('Linux');
  },

  ls(args){
    let showHidden=false,longFmt=false,path='';
    args.forEach(a=>{
      if(a.startsWith('-')){if(a.includes('a'))showHidden=true;if(a.includes('l'))longFmt=true;}
      else path=a;
    });
    const target=rp(path||'');
    const entries=FS[target];
    if(!entries){
      if(isFile(rp(path))){ap(`(파일: ${path})`,'mu');return;}
      ap(`ls: cannot access '${path||target}': No such file or directory`,'er');return;
    }
    if(longFmt){
      ap(`total ${entries.length*4}`,'mu');
      entries.forEach(e=>{
        const full=(target==='/'?'':target)+'/'+e;
        const isDir=!!FS[full];
        ap(`${isDir?'drwxr-xr-x':'-rw-r--r--'}  2 ${user} sapsys ${isDir?'4096':(Math.floor(Math.random()*80+4)+'K').padStart(6)} May  8 09:14 ${isDir?e+'/':e}`);
      });
    }else{
      ap(entries.map(e=>{const f=(target==='/'?'':target)+'/'+e;return FS[f]?e+'/':e;}).join('   '));
    }
  },

  cd(args){
    const target=rp(args[0]||'/home/'+user);
    if(FS[target]){cwd=target;up();return;}
    const par=target.split('/').slice(0,-1).join('/')||'/';
    const nm=target.split('/').pop();
    if(FS[par]&&FS[par].includes(nm))ap(`bash: cd: ${args[0]}: Not a directory`,'er');
    else ap(`bash: cd: ${args[0]}: No such file or directory`,'er');
  },

  cat(args){
    if(!args.length){ap('Usage: cat <file>','wa');return;}
    const target=rp(args[0]);
    if(FILES[target]){
      FILES[target].split('\n').forEach(l=>ap(l,/(ERROR|FAIL)/i.test(l)?'er':/WARN/i.test(l)?'wa':''));
      return;
    }
    if(FS[target])return ap(`cat: ${args[0]}: Is a directory`,'er');
    if(isFile(target))return ap('(파일 내용 없음 — 시뮬레이션 환경)','mu');
    ap(`cat: ${args[0]}: No such file or directory`,'er');
  },

  head(args){
    let n=10,file='';
    for(let i=0;i<args.length;i++){
      if(args[i]==='-n')n=parseInt(args[++i])||10;
      else if(/^-\d+$/.test(args[i]))n=parseInt(args[i].slice(1));
      else file=args[i];
    }
    const content=FILES[rp(file)];
    if(!content){if(!isFile(rp(file)))ap(`head: ${file}: No such file or directory`,'er');return;}
    content.split('\n').slice(0,n).forEach(l=>ap(l));
  },

  wc(args){
    const file=args.find(a=>!a.startsWith('-'));
    if(!file)return ap('사용법: wc -l <file>','wa');
    const content=FILES[rp(file)];
    if(!content){if(!isFile(rp(file)))ap(`wc: ${file}: No such file or directory`,'er');return;}
    ap(`${String(content.split('\n').length).padStart(6)} ${file}`);
  },

  tail(args){doTail(args);},
  grep(args){
    const flags=[],rest=[];
    args.forEach(a=>a.startsWith('-')&&a.length>1?flags.push(...a.slice(1)):rest.push(a));
    const opts=flags.join(''),pattern=rest[0]||'',file=rest[1]||'';
    if(!pattern)return ap('사용법: grep [-v|-i|-n] <pattern> <file>','wa');
    if(!file)return ap('(파이프 모드: 위 출력에서 패턴 검색)','mu');
    doGrep(pattern,file,opts);
  },
  find(args){doFind(args);},
  vi(args){doVi(args);},
  vim(args){doVi(args);},
  less(args){
    if(!args[0])return ap('사용법: less <file>','wa');
    const content=FILES[rp(args[0])];
    if(!content){if(!isFile(rp(args[0])))ap(`less: ${args[0]}: No such file or directory`,'er');return;}
    showPager(content.split('\n'));
  },
  more(args){CMDS.less(args);},
  sort(){ap('(파이프 내 sort 적용됨)','mu');},
  uniq(){ap('(파이프 내 uniq 적용됨)','mu');},

  chmod(args){
    if(args.length<2)return ap('사용법: chmod <mode> <file>','wa');
    const target=rp(args[1]);
    if(!isFile(target)&&!FS[target])return ap(`chmod: ${args[1]}: No such file or directory`,'er');
    ap(`chmod ${args[0]} ${args[1]}  (적용됨)`,'su');
  },
  chown(args){
    if(args.length<2)return ap('사용법: chown <owner> <file>','wa');
    const target=rp(args[1]);
    if(!isFile(target)&&!FS[target])return ap(`chown: ${args[1]}: No such file or directory`,'er');
    ap(`chown ${args[0]} ${args[1]}  (적용됨)`,'su');
  },

  ps(args){
    const joined=args.join(' ');
    const grepPat=(joined.match(/grep\s+(\S+)/)||[])[1]||'';
    let procs;
    if(activeTab==='db'){
      procs=[
        {u:'root',      pid:1,     cpu:'0.0',mem:'0.0', cmd:'/sbin/init splash'},
        {u:'root',      pid:512,   cpu:'0.0',mem:'0.0', cmd:'/usr/sbin/sshd -D'},
        {u:'s4hdb01adm',pid:34760, cpu:'0.1',mem:'0.2', cmd:'sapstartsrv pf=/usr/sap/S4H/SYS/profile/S4H_HDB00_s4hdb01'},
        {u:'s4hdb01adm',pid:34765, cpu:'0.3',mem:'1.1', cmd:'hdbdaemon'},
        {u:'s4hdb01adm',pid:34766, cpu:'1.2',mem:'3.4', cmd:'hdbnameserver'},
        {u:'s4hdb01adm',pid:34767, cpu:'0.4',mem:'0.9', cmd:'hdbpreprocessor'},
        {u:'s4hdb01adm',pid:34890, cpu:'8.7',mem:'28.3',cmd:'hdbindexserver -port 30003'},
        {u:'s4hdb01adm',pid:34891, cpu:'0.2',mem:'0.5', cmd:'hdbstatisticsserver'},
        {u:'s4hdb01adm',pid:34892, cpu:'0.1',mem:'0.4', cmd:'hdbwebdispatcher'},
        {u:user,        pid:39981, cpu:'0.0',mem:'0.0', cmd:'-bash'},
      ];
    }else{
      procs=[
        {u:'root',   pid:1,    cpu:'0.0',mem:'0.0',cmd:'/sbin/init splash'},
        {u:'root',   pid:512,  cpu:'0.0',mem:'0.0',cmd:'/usr/sbin/sshd -D'},
        {u:'s4hadm', pid:28472,cpu:'2.1',mem:'5.3',cmd:`disp+work pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01`},
        {u:'s4hadm', pid:28473,cpu:'0.3',mem:'0.8',cmd:'disp+work (DIA-0)'},
        {u:'s4hadm', pid:28474,cpu:'0.3',mem:'0.8',cmd:'disp+work (DIA-1)'},
        {u:'s4hadm', pid:28475,cpu:'0.2',mem:'0.8',cmd:'disp+work (DIA-2)'},
        {u:'s4hadm', pid:28476,cpu:'0.2',mem:'0.8',cmd:'disp+work (BTC-0)'},
        {u:'s4hadm', pid:28477,cpu:'0.1',mem:'0.8',cmd:'disp+work (UPD-0)'},
        {u:'s4hadm', pid:28490,cpu:'0.4',mem:'1.2',cmd:'icman pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01'},
        {u:'s4hadm', pid:28483,cpu:'0.1',mem:'0.3',cmd:'gwrd pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01'},
        {u:user,     pid:29981,cpu:'0.0',mem:'0.0',cmd:'-bash'},
      ];
    }
    ap(`USER       PID    %CPU %MEM COMMAND`,'mu');
    const active=activeTab==='db'?dbOn:sapOn;
    procs
      .filter(p=>!grepPat||p.cmd.includes(grepPat)||p.u.includes(grepPat))
      .filter(p=>active||p.pid<10000||(activeTab==='db'?p.pid===39981:p.pid===29981))
      .forEach(p=>ap(`${p.u.padEnd(12)} ${String(p.pid).padEnd(7)} ${p.cpu.padStart(4)} ${p.mem.padStart(5)} ${p.cmd}`));
    if(!active)ap(`(${activeTab==='db'?'HANA':'SAP'} 프로세스 없음 — 정지 상태)`,'wa');
  },

  df(){
    if(activeTab==='db'){
      apl(diskFullSim?[
        'Filesystem              Size  Used Avail Use% Mounted on',
        '/dev/sda1                50G   18G   32G  36% /',
        '/dev/sdb1               300G  118G  182G  39% /hana/shared',
        '/dev/sdb2               200G  191G    9G  96% /hana/data',   // 풀 상태
        '/dev/sdb3               100G   12G   88G  12% /hana/log',
        '/dev/sdb4               500G  180G  320G  36% /hana/backup',
        'tmpfs                    32G  6.1G   26G  19% /dev/shm',
      ]:[
        'Filesystem              Size  Used Avail Use% Mounted on',
        '/dev/sda1                50G   18G   32G  36% /',
        '/dev/sdb1               300G  118G  182G  39% /hana/shared',
        '/dev/sdb2               200G   48G  152G  24% /hana/data',
        '/dev/sdb3               100G   12G   88G  12% /hana/log',
        '/dev/sdb4               500G  180G  320G  36% /hana/backup',
        'tmpfs                    32G  6.1G   26G  19% /dev/shm',
      ]);
    }else{
      apl(diskFullSim?[
        'Filesystem              Size  Used Avail Use% Mounted on',
        '/dev/sda1                50G   22G   28G  44% /',
        '/dev/sda3                30G   28G  2.0G  95% /usr/sap',     // 풀 상태
        '/dev/sdb1               200G   87G  113G  44% /sapmnt',
        '/dev/sdb2               100G   34G   66G  34% /usr/sap/trans',
        'tmpfs                    16G  4.2G   12G  26% /dev/shm',
      ]:[
        'Filesystem              Size  Used Avail Use% Mounted on',
        '/dev/sda1                50G   22G   28G  44% /',
        '/dev/sda3                30G   18G   12G  60% /usr/sap',
        '/dev/sdb1               200G   87G  113G  44% /sapmnt',
        '/dev/sdb2               100G   34G   66G  34% /usr/sap/trans',
        'tmpfs                    16G  4.2G   12G  26% /dev/shm',
      ]);
    }
  },

  free(){
    if(activeTab==='db'){
      apl(memLowSim?[
        '              total        used        free      shared  buff/cache   available',
        'Mem:          65536       64821         512        1032         203          87', // 부족
        'Swap:         16383       14512        1871',
      ]:[
        '              total        used        free      shared  buff/cache   available',
        'Mem:          65536       48231        3221        1032       14082       15524',
        'Swap:         16383         128       16255',
      ]);
    }else{
      apl(memLowSim?[
        '              total        used        free      shared  buff/cache   available',
        'Mem:          32072       31841         102        1032          129          94', // 부족
        'Swap:          8191        6144        2047',
      ]:[
        '              total        used        free      shared  buff/cache   available',
        'Mem:          32072       18431        4221        1032        9420       12320',
        'Swap:          8191         512        7679',
      ]);
    }
  },

  vmstat(){
    apl(memLowSim?[
      'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----',
      ' r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st',
      ' 6  4 6291456  98304  20480  83968 1024 2048   512  1024 4521 8123 45 18 22 15  0', // 스왑 활발
    ]:[
      'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----',
      ' r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st',
      ' 2  0 524288 4321024 102400 9626624   0    1    12    44 1823 3241 12  2 85  1  0',
    ]);
  },

  top(){
    if(activeTab==='db'){
      apl(memLowSim?[
        'top - 09:42:17 up 14 days, 3:22,  2 users,  load average: 8.21, 7.94, 7.03',
        'Tasks: 198 total,   8 running, 184 sleeping,   0 stopped,   6 zombie',
        '%Cpu(s):62.4 us, 18.2 sy,  0.0 ni, 12.1 id,  7.1 wa,  0.0 hi,  0.2 si',
        'MiB Mem : 65536.0 total,   512.0 free, 64821.0 used,   203.0 buff/cache',
        'MiB Swap: 16384.0 total,  1872.0 free, 14512.0 used. (swap 사용 중!)',
        '',
        '  PID USER         PR  NI    VIRT    RES S  %CPU  %MEM     TIME+ COMMAND',
        '34890 s4hdb01adm   20   0  18.5g  18.1g S  62.4  55.3 512:44 hdbindexserver',
        '34766 s4hdb01adm   20   0 2254188  1.8g S  18.2  14.1 221:05 hdbnameserver',
        '34767 s4hdb01adm   20   0  487654  498m S   8.4   3.1  88:18 hdbpreprocessor',
        '34765 s4hdb01adm   20   0  124512   71m S   2.1   1.1  42:33 hdbdaemon',
      ]:[
        'top - 09:42:17 up 14 days, 3:22,  2 users,  load average: 0.82, 0.91, 1.03',
        'Tasks: 198 total,   2 running, 196 sleeping,   0 stopped,   0 zombie',
        '%Cpu(s): 9.1 us,  0.8 sy,  0.0 ni, 88.9 id,  1.0 wa,  0.0 hi,  0.2 si',
        'MiB Mem : 65536.0 total,  3221.0 free, 48231.0 used, 14082.0 buff/cache',
        '',
        '  PID USER         PR  NI    VIRT    RES S  %CPU  %MEM     TIME+ COMMAND',
        '34890 s4hdb01adm   20   0  18.5g   9.2g S   8.7  28.3 312:44 hdbindexserver',
        '34766 s4hdb01adm   20   0 2254188  1.1g S   1.2   3.4 121:05 hdbnameserver',
        '34767 s4hdb01adm   20   0  487654  292m S   0.4   0.9  44:18 hdbpreprocessor',
        '34765 s4hdb01adm   20   0  124512   71m S   0.3   1.1  22:33 hdbdaemon',
      ]);
    }else{
      apl(memLowSim?[
        'top - 09:42:17 up 14 days, 3:22,  2 users,  load average: 6.44, 6.12, 5.88',
        'Tasks: 212 total,   5 running, 203 sleeping,   0 stopped,   4 zombie',
        '%Cpu(s):55.2 us, 22.1 sy,  0.0 ni, 12.4 id,  9.8 wa,  0.0 hi,  0.5 si',
        'MiB Mem : 32072.0 total,   102.0 free, 31841.0 used,   129.0 buff/cache',
        'MiB Swap:  8192.0 total,  2047.0 free,  6144.0 used. (swap 사용 중!)',
        '',
        '  PID USER      PR  NI    VIRT    RES S  %CPU  %MEM     TIME+ COMMAND',
        '28472 s4hadm    20   0 4521852   7.2g S  55.2  22.9 921:12 disp+work',
        '28490 s4hadm    20   0  987654 996432 S  22.1   3.1 231:05 icman',
        '28473 s4hadm    20   0 1234567 828412 S  12.4   2.6 198:44 disp+work(DIA-0)',
        '28483 s4hadm    20   0  456789 151200 S   4.2   0.5  84:18 gwrd',
      ]:[
        'top - 09:42:17 up 14 days, 3:22,  2 users,  load average: 1.23, 1.45, 1.51',
        'Tasks: 212 total,   1 running, 211 sleeping,   0 stopped,   0 zombie',
        '%Cpu(s): 12.4 us,  1.2 sy,  0.0 ni, 85.2 id,  1.0 wa,  0.0 hi,  0.2 si',
        'MiB Mem : 32072.0 total,  4221.0 free, 18431.0 used,  9420.0 buff/cache',
        '',
        '  PID USER      PR  NI    VIRT    RES S  %CPU  %MEM     TIME+ COMMAND',
        '28472 s4hadm    20   0 4521852 867244 S  18.3   5.3 721:12 disp+work',
        '28490 s4hadm    20   0  987654 196432 S   3.2   1.2 131:05 icman',
        '28473 s4hadm    20   0 1234567 128412 S   2.1   0.8  98:44 disp+work(DIA-0)',
        '28483 s4hadm    20   0  456789  51200 S   0.1   0.3  44:18 gwrd',
      ]);
    }
    ap('(스냅샷 — 실제 top은 실시간 갱신)','mu');
  },

  netstat(){
    if(activeTab==='db'){
      apl([
        'Proto Recv-Q Send-Q Local Address    Foreign Addr  State   PID/Program',
        'tcp   0      0      0.0.0.0:22       0.0.0.0:*     LISTEN  512/sshd',
        'tcp   0      0      0.0.0.0:30001    0.0.0.0:*     LISTEN  34766/hdbnameserver',
        'tcp   0      0      0.0.0.0:30003    0.0.0.0:*     LISTEN  34890/hdbindexserver',
        'tcp   0      0      0.0.0.0:30010    0.0.0.0:*     LISTEN  34767/hdbpreprocessor',
        'tcp   0      0      0.0.0.0:30013    0.0.0.0:*     LISTEN  34765/hdbdaemon',
        'tcp   0      0      0.0.0.0:30015    0.0.0.0:*     LISTEN  34890/hdbindexserver',
        'tcp   0      0      0.0.0.0:30017    0.0.0.0:*     LISTEN  34891/hdbstatisticsserver',
        'tcp   0      0      0.0.0.0:30040    0.0.0.0:*     LISTEN  34892/hdbwebdispatcher',
      ]);
    }else{
      apl([
        'Proto Recv-Q Send-Q Local Address    Foreign Addr  State   PID/Program',
        'tcp   0      0      0.0.0.0:22       0.0.0.0:*     LISTEN  512/sshd',
        'tcp   0      0      0.0.0.0:3200     0.0.0.0:*     LISTEN  28472/disp+work',
        'tcp   0      0      0.0.0.0:3300     0.0.0.0:*     LISTEN  28472/disp+work',
        'tcp   0      0      0.0.0.0:3600     0.0.0.0:*     LISTEN  28465/msserv',
        'tcp   0      0      0.0.0.0:8000     0.0.0.0:*     LISTEN  28490/icman',
        'tcp   0      0      0.0.0.0:8100     0.0.0.0:*     LISTEN  28465/msserv',
        'tcp   0      0      0.0.0.0:44300    0.0.0.0:*     LISTEN  28490/icman',
      ]);
    }
  },

  ss(args){CMDS.netstat(args);},

  lsof(args){
    const portArg=args.find(a=>a.startsWith(':'));
    const port=portArg?portArg.slice(1):'';
    let all;
    if(activeTab==='db'){
      all=[
        'hdbindexserver  34890 s4hdb01adm  5u  IPv4  TCP *:30003 (LISTEN)',
        'hdbindexserver  34890 s4hdb01adm  6u  IPv4  TCP *:30015 (LISTEN)',
        'hdbnameserver   34766 s4hdb01adm  4u  IPv4  TCP *:30001 (LISTEN)',
        'hdbdaemon       34765 s4hdb01adm  3u  IPv4  TCP *:30013 (LISTEN)',
        'hdbwebdispatcher 34892 s4hdb01adm 4u  IPv4  TCP *:30040 (LISTEN)',
        'sshd              512       root  3u  IPv4  TCP *:22 (LISTEN)',
      ];
    }else{
      all=[
        'disp+w  28472 s4hadm  5u  IPv4  TCP *:3200 (LISTEN)',
        'disp+w  28472 s4hadm  6u  IPv4  TCP *:3300 (LISTEN)',
        'msserv  28465 s4hadm  4u  IPv4  TCP *:3600 (LISTEN)',
        'msserv  28465 s4hadm  5u  IPv4  TCP *:8100 (LISTEN)',
        'icman   28490 s4hadm  8u  IPv4  TCP *:8000 (LISTEN)',
        'icman   28490 s4hadm  9u  IPv4  TCP *:44300 (LISTEN)',
        'sshd      512   root  3u  IPv4  TCP *:22 (LISTEN)',
      ];
    }
    ap('COMMAND          PID    USER        FD   TYPE  NAME','mu');
    all.filter(l=>!port||l.includes(':'+port)).forEach(l=>ap(l));
  },

  env(args){
    const joined=args.join(' ');
    let all;
    if(activeTab==='db'){
      all=[
        'SAPSYSTEMNAME=S4H','SAPSYSTEM=00',`SAPGLOBALHOST=${DB_HOST}`,
        'HDB_NR=00','HANA_SID=S4H',
        'DIR_INSTANCE=/usr/sap/S4H/HDB00',
        'DIR_EXECUTABLE=/usr/sap/S4H/HDB00/exe',
        'SECUDIR=/usr/sap/S4H/HDB00/exe/sec',
        'PATH=/usr/sap/S4H/HDB00/exe:/hana/shared/S4H/hdbclient:/usr/local/bin:/usr/bin:/bin',
        `HOME=/home/${user}`,'SHELL=/bin/bash','LANG=en_US.UTF-8',
        'LD_LIBRARY_PATH=/usr/sap/S4H/HDB00/exe',
        'HDBSQL_PATH=/hana/shared/S4H/hdbclient',
      ];
    }else{
      all=[...getApEnv(),`HOME=/home/${user}`];
    }
    const pat=(joined.match(/grep\s+(\S+)/)||[])[1]||'';
    (pat?all.filter(e=>e.toLowerCase().includes(pat.toLowerCase())):all).forEach(l=>ap(l));
  },

  su(args){
    const t=(args.join(' ').replace(/-/g,' ').trim().split(/\s+/).pop())||'root';
    const valid=activeTab==='db'?['s4hdb01adm','root']:['s4hadm','root'];
    if(valid.includes(t)){
      user=t;
      cwd=t==='root'?'/root':(activeTab==='db'?'/home/s4hdb01adm':'/home/s4hadm');
      up();
      ap(`[${t}@${HOST} ${cwd.split('/').pop()}]`,'su');
    }else ap(`su: user ${t} does not exist`,'er');
  },

  exit(){
    const defaultUser=activeTab==='db'?'s4hdb01adm':'s4hadm';
    const defaultHome=activeTab==='db'?'/home/s4hdb01adm':'/home/s4hadm';
    if(user!==defaultUser){user=defaultUser;cwd=defaultHome;up();ap('logout','mu');}
    else ap('(세션 종료 불가 — 시뮬레이터)','mu');
  },

  /* ─── AP 전용 명령어 ─────────────────────── */

  startsap(args){
    if(activeTab!=='ap'){ap('bash: startsap: command not found','er');return;}
    if(sapOn){ap('SAP system already started','wa');return;}
    const _srv=activeServer; // 타이머 완료 전 탭 전환 방지용 캡처
    ap('NOTE: startsap is deprecated. Consider using: sapcontrol -nr 00 -function StartSystem','wa');
    ap('Starting SAP System S4H ...');
    ap('Checking smda97 ... not running','mu');
    setTimeout(()=>{
      ap('Starting instance ASCS01');
      setTimeout(()=>{
        ap('  Message Server .... ok','su');
        ap('  Enqueue Server .... ok','su');
        ap('Starting instance D00');
        setTimeout(()=>{
          ap('  Dispatcher     .... ok','su');
          ap('  ICM            .... ok','su');
          if(!dbOn){
            // DB가 정지 상태면 Work Process가 DB 접속 실패로 기동 불가
            ap('  Work Processes .... failed','er');
            ap('ERROR: db_connect (s4hdb01.corp.com:30015) failed — HANA not running','er');
            ap('ERROR: Startup of work processes FAILED','er');
            ap('Stopping instance D00 due to startup error ...','wa');
            ap('SAP System S4H start FAILED. (DB를 먼저 기동하십시오)','er');
            return;
          }
          ap('  Work Processes .... ok','su');
          ap('SAP System S4H started.','su');
          sapOn=true;
          if(_srv==='ap1')ap1On=true; else ap2On=true;
        },700);
      },600);
    },400);
  },

  stopsap(){
    if(activeTab!=='ap'){ap('bash: stopsap: command not found','er');return;}
    if(!sapOn){ap('SAP system already stopped','wa');return;}
    const _srv=activeServer; // 타이머 완료 전 탭 전환 방지용 캡처
    ap('NOTE: stopsap is deprecated. Consider using: sapcontrol -nr 00 -function StopSystem','wa');
    ap('Stopping SAP System S4H ...');
    setTimeout(()=>{
      ap('  Stopping Work Processes .... stopped','wa');
      ap('  Stopping ICM            .... stopped','wa');
      ap('  Stopping Dispatcher     .... stopped','wa');
      setTimeout(()=>{
        ap('  Stopping ASCS01         .... stopped','wa');
        ap('SAP System S4H stopped.','su');
        sapOn=false;
        if(_srv==='ap1')ap1On=false; else ap2On=false;
      },600);
    },500);
  },

  sapcontrol(args){
    const joined=args.join(' ');
    const func=(joined.match(/-function\s+(\S+)/)||[])[1]||'';
    const param=(joined.match(/-function\s+\S+\s+(\S+)/)||[])[1]||'';
    const now=new Date();
    const ts=`${String(now.getDate()).padStart(2,'0')}.${String(now.getMonth()+1).padStart(2,'0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const echo=()=>{ap(ts);ap(func);};

    /* ── DB 서버 (HANA 인스턴스 제어) ── */
    if(activeTab==='db'){
      // Start / Stop 은 dbOn 상태와 무관하게 항상 시도 가능
      if(func==='Start'||func==='StartSystem'){
        echo();
        if(dbOn){ap('OK','su');ap('Instance is already running','wa');return;}
        const _srv=activeServer;
        ap('OK','su');
        ap('Starting SAP HANA instance HDB00 ...','in');
        setTimeout(()=>{
          ap('  hdbdaemon         .... started','su');
          setTimeout(()=>{
            ap('  hdbnameserver     .... started','su');
            ap('  hdbindexserver    .... started','su');
            ap('  hdbwebdispatcher  .... started','su');
            ap('SAP HANA HDB00 started successfully.','su');
            dbOn=true;
            if(_srv==='db1')db1On=true; else db2On=true;
          },700);
        },400);
        return;
      }
      if(func==='Stop'||func==='StopSystem'||func==='StopWait'){
        echo();
        if(!dbOn){ap('OK','su');ap('Instance is already stopped','wa');return;}
        const _srv=activeServer;
        ap('OK','su');
        ap('Stopping SAP HANA instance HDB00 ...','in');
        setTimeout(()=>{
          ap('  hdbwebdispatcher  .... stopped','wa');
          ap('  hdbindexserver    .... stopped','wa');
          ap('  hdbnameserver     .... stopped','wa');
          ap('  hdbdaemon         .... stopped','wa');
          ap('SAP HANA HDB00 stopped.','su');
          dbOn=false;
          if(_srv==='db1')db1On=false; else db2On=false;
        },800);
        return;
      }
      // 기타 function: HANA가 정지 상태면 연결 불가 (GetSystemInstanceList 제외)
      if(!dbOn&&func!=='GetSystemInstanceList'){
        ap('FAIL: NIECONN_REFUSED (Connection refused)','er');
        ap('sapcontrol: exit status: 3','er');return;
      }
      echo();
      if(func==='GetProcessList'){
        apl(['OK',
          'name,                description,          dispstatus, textstatus, starttime,           elapsedtime, pid',
          'hdbdaemon,           HDB Daemon,           GREEN,      Running,    2026 04 23 06:20:01,  338:22:16,   34765',
          'hdbnameserver,       HDB NameServer,       GREEN,      Running,    2026 04 23 06:20:03,  338:22:14,   34766',
          'hdbpreprocessor,     HDB Preprocessor,     GREEN,      Running,    2026 04 23 06:20:05,  338:22:12,   34767',
          'hdbindexserver,      HDB IndexServer,      GREEN,      Running,    2026 04 23 06:20:07,  338:22:10,   34890',
          'hdbstatisticsserver, HDB StatisticsServer, GREEN,      Running,    2026 04 23 06:20:09,  338:22:08,   34891',
          'hdbwebdispatcher,    HDB Web Dispatcher,   GREEN,      Running,    2026 04 23 06:20:11,  338:22:06,   34892',
        ],'su');
      }else if(func==='GetSystemInstanceList'){
        const rows=[
          'hostname,  instanceNr, httpPort, httpsPort, startPriority, features,               dispstatus',
          `s4happ01,  01,         50113,    50114,     2,             MESSAGESERVER|ENQUE,     ${ap1On?'GREEN':'GRAY'}`,
          `s4happ01,  00,         50013,    50014,     3,             ABAP|GATEWAY|ICMAN|IGS,  ${ap1On?'GREEN':'GRAY'}`,
          `s4hdb01,   00,         50013,    50014,     1,             HDB|HDB_WORKER|PRIMARY,  ${db1On?'GREEN':'GRAY'}`,
        ];
        if(haMode)rows.push(
          `s4happ02,  01,         50113,    50114,     3,             ABAP|GATEWAY|ICMAN|IGS,  ${ap2On?'GREEN':'GRAY'}`,
          `s4hdb02,   00,         50013,    50014,     1,             HDB|HDB_WORKER|SECONDARY,${db2On?'GREEN':'GRAY'}`,
        );
        apl(['OK',...rows],dbOn?'su':'wa');
      }else if(func==='GetAlertTree'){
        apl(['OK',
          'NameServerMemory,   ,  , 72,  %',
          'IndexServerMemory,  ,  , 65,  %',
          'DataVolumeUsage,    ,  , 24,  %',
          'LogVolumeUsage,     ,  , 12,  %',
          'BackupAge,          ,  , 7,   hours',
        ],'su');
      }else if(func==='GetVersionInfo'){
        apl(['OK',
          'BuildVersion:   2.00.067.00.1685702766',
          'BuildBranch:    hanab2sp06',
          'BuildPlatform:  linuxx86_64',
          'BuildDate:      2023-06-02 12:46:06',
        ]);
      }else if(func==='ParameterValue'){
        const pv={
          'indexserver/max_sessions':'5000',
          'global/persistence/basepath_datavolumes':'/hana/data/S4H',
          'global/persistence/basepath_logvolumes':'/hana/log/S4H',
          'global/backup/data_backup_buffer_size':'2048',
        };
        ap('OK','su');
        ap(`${param} = ${pv[param]||'(파라미터 없음)'}`);
      }else if(!func){
        ap('사용법: sapcontrol -nr 00 -function <FunctionName>','wa');
      }else{
        ap(`FAIL: method '${func}' not found`,'er');
      }
      return;
    }

    /* ── AP 서버 (ABAP 인스턴스 제어) ── */
    if(func==='Start'||func==='StartSystem'||func==='StartWait'){
      echo();
      if(sapOn){ap('OK','su');ap('Instance is already running','wa');return;}
      ap('OK','su');
      ap('Starting SAP instance D00 ...','in');
      setTimeout(()=>{
        ap('  Dispatcher     .... started','su');
        setTimeout(()=>{
          if(!dbOn){ap('  Work Processes .... failed (DB not running)','er');ap('FAIL: Startup of work processes failed','er');return;}
          ap('  Work Processes .... started','su');
          ap('SAP instance D00 started.','su');
          sapOn=true;
          if(activeServer==='ap1')ap1On=true; else ap2On=true;
        },700);
      },500);
      return;
    }
    if(func==='Stop'||func==='StopSystem'||func==='StopWait'){
      echo();
      if(!sapOn){ap('OK','su');ap('Instance is already stopped','wa');return;}
      ap('OK','su');
      setTimeout(()=>{
        ap('  Work Processes .... stopped','wa');
        ap('  ICM            .... stopped','wa');
        ap('  Dispatcher     .... stopped','wa');
        ap('SAP instance D00 stopped.','su');
        sapOn=false;
        if(activeServer==='ap1')ap1On=false; else ap2On=false;
      },600);
      return;
    }
    if(func==='RestartService'){
      echo();
      ap('OK','su');
      ap(`Restarting sapstartsrv on host ${AP_HOST} ...`);
      ap('sapstartsrv restarted (PID 28470 → 29021)','su');
      return;
    }
    if(!sapOn&&func!=='GetSystemInstanceList'){
      ap('FAIL: NIECONN_REFUSED (Connection refused)','er');
      ap('sapcontrol: exit status: 3','er');return;
    }
    echo();
    if(func==='GetProcessList'){
      const wpStatus=dbOn?'GREEN':'YELLOW'; // sapcontrol dispstatus는 GREEN/YELLOW/GRAY만 존재 — DB 미연결 시 프로세스는 기동돼 있으나 YELLOW (SAP KBA 3303514/2237021)
      const wpText=dbOn?'Running':'Waiting for DB';
      apl(['OK',
        'name, description, dispstatus, textstatus, starttime, elapsedtime, pid',
        `disp+work, Dispatcher,   ${wpStatus}, ${wpText}, 2026 04 23 06:20:11, 338:22:06, 28472`,
        `igswd_mt,  IGS Watchdog, GREEN,       Running,   2026 04 23 06:20:13, 338:22:04, 28481`,
        `gwrd,      Gateway,      GREEN,       Running,   2026 04 23 06:20:13, 338:22:04, 28483`,
        `icman,     ICM,          GREEN,       Running,   2026 04 23 06:20:14, 338:22:03, 28490`,
      ],dbOn?'':'wa');
      if(!dbOn)ap('(WP가 DB 접속 대기 중 — DB 서버를 기동하십시오)','er');
    }else if(func==='GetSystemInstanceList'){
      const rows=[
        'hostname,  instanceNr, httpPort, httpsPort, startPriority, features,               dispstatus',
        `s4happ01,  01,         50113,    50114,     2,             MESSAGESERVER|ENQUE,     ${ap1On?'GREEN':'GRAY'}`,
        `s4happ01,  00,         50013,    50014,     3,             ABAP|GATEWAY|ICMAN|IGS,  ${ap1On?'GREEN':'GRAY'}`,
        `s4hdb01,   00,         50013,    50014,     1,             HDB|HDB_WORKER|PRIMARY,  ${db1On?'GREEN':'GRAY'}`,
      ];
      if(haMode)rows.push(
        `s4happ02,  01,         50113,    50114,     3,             ABAP|GATEWAY|ICMAN|IGS,  ${ap2On?'GREEN':'GRAY'}`,
        `s4hdb02,   00,         50013,    50014,     1,             HDB|HDB_WORKER|SECONDARY,${db2On?'GREEN':'GRAY'}`,
      );
      apl(['OK',...rows],sapOn?'su':'wa');
    }else if(func==='GetAlertTree'){
      apl(['OK',
        'ActualResponsetime,  ,  , 42, ms',
        'FreeMemory,          ,  , 71, %',
        'CPULoad,             ,  , 12, %',
        'DiaWPs,              ,  , 6/6, available',
      ],'su');
    }else if(func==='ParameterValue'){
      const pv={'rdisp/wp_no_dia':'6','rdisp/wp_no_btc':'3',
        'icm/server_port_0':'PROT=HTTP,PORT=8000','em/initial_size_MB':'4096'};
      ap('OK','su');
      ap(`${param} = ${pv[param]||'(파라미터 없음)'}`);
    }else if(func==='ABAPGetWPTable'){
      apl(['OK',
        'No, Typ, Pid,   Status, Reason, Start, Err, Sem,  Cpu,   Time,  Program,      Client, User,     Action, Table',
        ...WP_DATA.map(r=>`${r.no}, ${r.ty.padEnd(3)}, ${r.pid}, ${r.st.padEnd(6)},       , 2:07,    0,   0, ${r.cpu},  ${r.time},  ${r.prg.padEnd(12)},  ${r.cl},    ${r.usr.padEnd(8)},  ,`),
      ]);
    }else if(func==='GetQueueStatistic'){
      apl(['OK',
        'Typ, Now, High, Max, Writes, Reads',
        'DIA,   0,    3,  50,    142,   142',
        'UPD,   0,    1,  50,     28,    28',
        'BTC,   0,    1,  50,     17,    17',
        'SPO,   0,    0,  50,      4,     4',
        'UPD2,  0,    0,  50,      2,     2',
      ],'su');
    }else if(func==='ABAPReadSyslog'){
      const syslogTs=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      apl(['OK',
        'Time,            MsgNo, Type, TD, Group,   Program,    Host,     Message',
        `${syslogTs}, 0051,  W,    ,  dialog,  SAPMV45A,   s4happ01, Transaction cancelled by user`,
        `${syslogTs}, 0000,  I,    ,  system,  RSBDCSUB,   s4happ01, Batch job RSSNAPDL started`,
        `${syslogTs}, 0516,  E,    ,  update,  ,           s4happ01, Update terminated (UPD error)`,
      ]);
    }else if(func==='GetEnvironment'){
      apl(['OK',...getApEnv()]);
    }else if(!func){
      ap('사용법: sapcontrol -nr 00 -function <FunctionName>','wa');
    }else{
      ap(`FAIL: method '${func}' not found`,'er');
    }
  },

  dpmon(){
    if(activeTab!=='ap'){ap('bash: dpmon: command not found','er');return;}
    if(!sapOn){ap('DPMON: cannot connect to dispatcher','er');return;}
    apl([
      `DPMON — SID: S4H  Instance: ${activeServer==='ap2'?'D01':'D00'}  Host: ${HOST}`,
      '────────────────────────────────────────────────────────────────',
      ' No Ty   Pid   Status Start Err Sem  CPU   Time Program       Cl  User',
      ...WP_DATA.map(r=>`${r.no.padStart(3)} ${r.ty.padEnd(4)} ${r.pid}  ${r.st.padEnd(6)} 2:07    0   0 ${r.cpu}  ${r.time} ${r.prg.padEnd(13)} ${r.cl}${r.usr?' '+r.usr:''}`),
      '────────────────────────────────────────────────────────────────',
      'DIA: 6/6  BTC: 3/3  SPO: 2/2  UPD: 1/1  UPD2: 1/1',
    ]);
  },

  sm50(args){CMDS.dpmon(args);},

  R3trans(args){
    if(activeTab!=='ap'){ap('bash: R3trans: command not found','er');return;}
    if(args[0]==='-d'){
      ap('This is R3trans version 6.26 (release 753 - 14.02.26 - 12:33:22).');
      ap('unicode enabled version');
      // R3trans는 DB에 직접 접속 — SAP 기동 여부와 무관하게 dbOn 체크
      if(dbOn){
        ap('Connect to database s4hdb01.corp.com S4H <dbs/hdb/schema=SAPABAP1>');
        ap('Connected to DB (S4H on s4hdb01.corp.com)','su');
        ap('R3trans finished (0000).','su');
      }else{
        ap('Connect to database s4hdb01.corp.com S4H <dbs/hdb/schema=SAPABAP1>');
        ap('ERROR: db_connect failed — cannot connect to s4hdb01.corp.com:30015 (HANA not running)','er');
        ap('R3trans finished (0012).','er');
      }
    }else{ap(`R3trans: unknown option '${args[0]}'`,'er');}
  },

  lgtst(){
    if(activeTab!=='ap'){ap('bash: lgtst: command not found','er');return;}
    ap(`Getting information about message server ${AP_HOST} / sapmsS4H ...`);
    if(sapOn){
      apl([`MSG server on host ${AP_HOST}, service sapmsS4H, sysid S4H`,
        'Active clients:',`  s4happ01 (10.10.1.51)  00  Active`],'su');
      ap('lgtst finished successfully','su');
    }else{
      ap('Error: cannot connect to message server','er');
    }
  },

  sappfpar(args){
    if(activeTab!=='ap'){ap('bash: sappfpar: command not found','er');return;}
    const joined=args.join(' ');
    const pf=(joined.match(/pf=(\S+)/)||[])[1]||'/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01';
    const PARAMS={
      'rdisp/wp_no_dia':'6','rdisp/wp_no_btc':'3','rdisp/wp_no_spo':'2',
      'rdisp/wp_no_upd':'1','rdisp/wp_no_up2':'1',
      'em/initial_size_MB':'4096',
      'icm/server_port_0':'PROT=HTTP,PORT=8000',
      'icm/server_port_1':'PROT=HTTPS,PORT=44300',
      'rdisp/max_wprun_time':'600',
      'login/system_client':'000',
      'SAPGLOBALHOST':AP_HOST,'SAPSYSTEMNAME':'S4H','SAPSYSTEM':'00',
    };
    if(args[0]==='check'){
      ap(`sappfpar: parameter check`);
      ap(`profile: ${pf}`);
      Object.entries(PARAMS).forEach(([k,v])=>ap(`  OK : ${k.padEnd(28)} = ${v}`,'su'));
      ap('Profile check: OK','su');
    }else if(args[0]==='-v'){
      const param=args.slice(1).find(a=>!a.startsWith('pf='));
      ap(`sappfpar: parameter query`);
      ap(`profile: ${pf}`);
      if(param&&PARAMS[param]!==undefined) ap(`${param} = ${PARAMS[param]}`,'su');
      else if(param) ap(`${param} = (parameter not found)`,'wa');
      else ap('사용법: sappfpar -v <param> pf=<profile>','wa');
    }else{
      ap('사용법:','wa');
      ap('  sappfpar -v <param> pf=<profile>   (파라미터 단일 조회)','wa');
      ap('  sappfpar check pf=<profile>        (전체 파라미터 체크)','wa');
    }
  },

  saposcol(args){
    if(activeTab!=='ap'){ap('bash: saposcol: command not found','er');return;}
    if(!sapOn){ap('saposcol: SAP instance not running — sapstartsrv unavailable','er');return;}
    const sub=args[0]||'';
    if(sub==='-s'){
      apl([
        `SAP OS Collector running on ${AP_HOST}`,
        `  PID              : 24315`,
        `  Version          : 753, patch 1801, changelist 1943799`,
        `  Collection interval: 60 seconds`,
        `  OS type          : Linux`,
        `  Data file        : /usr/sap/S4H/D00/work/saposcol.data`,
      ],'su');
    }else if(sub==='-k'){
      ap('saposcol: stopping OS Collector (PID 24315) ...','wa');
      ap('saposcol: stopped.','su');
    }else if(sub==='-d'){
      apl([
        `SAP OS Collector — Detailed Status on ${AP_HOST}`,
        `  OS type        : Linux 5.14.21 x86_64`,
        `  CPU(s)         : 8`,
        `  CPU load (1m)  : 1.23`,
        `  Memory total   : 32768 MB`,
        `  Memory free    : 12288 MB`,
        `  Swap total     :  8192 MB`,
        `  Swap free      :  8192 MB`,
        `  Disk /usr/sap  : 48 GB used / 200 GB total (24%)`,
      ]);
    }else{
      ap('SAP OS Collector — starting ...','in');
      ap('saposcol: started (PID 24315)','su');
    }
  },

  'disp+work'(args){
    if(activeTab!=='ap'){ap('bash: disp+work: command not found','er');return;}
    if(args[0]==='-V'){
      apl([
        'disp+work version 7530 (release 753 - 14.02.26 - 12:33:22)',
        'compilation mode: UNICODE',
        'SAP_BASIS: 756    SAP_ABA: 756',
        `kernel id    : linuxx86_64_753`,
        `build on     : suse-15 x86_64    cc5.5.0`,
        `build time   : Feb 14 2026 12:33:22`,
        `patch number : 900`,
      ]);
    }else{
      ap(`disp+work: option '${args[0]||''}'은 지원하지 않습니다. (-V 옵션으로 버전 확인)`,'wa');
    }
  },

  /* ─── DB 전용 명령어 ─────────────────────── */

  HDB(args){
    if(activeTab!=='db'){ap('bash: HDB: command not found','er');return;}
    const sub=args[0]||'';
    if(sub==='start'){
      if(dbOn){ap('HANA system already started','wa');return;}
      const _srv=activeServer; // race condition 방지
      ap(`Starting SAP HANA Database version 2.00.067 ...`);
      setTimeout(()=>{
        ap('  hdbdaemon         .... started (PID 34765)','su');
        setTimeout(()=>{
          ap('  hdbnameserver     .... started (PID 34766)','su');
          ap('  hdbpreprocessor   .... started (PID 34767)','su');
          setTimeout(()=>{
            ap('  hdbindexserver    .... started (PID 34890)','su');
            ap('  hdbstatisticsserver .... started (PID 34891)','su');
            ap('  hdbwebdispatcher  .... started (PID 34892)','su');
            ap('SAP HANA Database S4H started.','su');
            dbOn=true;
            if(_srv==='db1')db1On=true; else db2On=true;
          },700);
        },500);
      },400);
    }else if(sub==='stop'){
      if(!dbOn){ap('HANA system already stopped','wa');return;}
      const _srv=activeServer; // race condition 방지
      ap('Stopping SAP HANA Database ...');
      setTimeout(()=>{
        ap('  hdbwebdispatcher  .... stopped','wa');
        ap('  hdbstatisticsserver .... stopped','wa');
        ap('  hdbindexserver    .... stopped','wa');
        setTimeout(()=>{
          ap('  hdbpreprocessor   .... stopped','wa');
          ap('  hdbnameserver     .... stopped','wa');
          ap('  hdbdaemon         .... stopped','wa');
          ap('SAP HANA Database S4H stopped.','su');
          dbOn=false;
          if(_srv==='db1')db1On=false; else db2On=false;
        },600);
      },500);
    }else if(sub==='info'){
      if(!dbOn){ap('HANA system is not running','er');return;}
      apl([
        `HDB info for: s4hdb01adm`,
        `  pid    ppid  %cpu vsz        rss        LstChg   command`,
        `hdbdaemon is running (pid: 34765)`,
        `  34765  1     0.0  218772     12436      09:14:01  hdbdaemon --processname=hdbdaemon`,
        `  34766  34765 0.3  2254188    1154232    09:14:03  hdbnameserver`,
        `  34767  34765 0.1  487654     298432     09:14:05  hdbpreprocessor`,
        `  34890  34765 8.7  18874368   9437184    09:14:07  hdbindexserver -port 30003`,
        `  34891  34765 0.2  512344     198432     09:14:09  hdbstatisticsserver`,
        `  34892  34765 0.1  124512     51200      09:14:11  hdbwebdispatcher`,
      ]);
    }else if(sub==='version'){
      apl([
        'HDB version info:',
        '  version:             2.00.067.00.1685702766',
        '  branch:              fa/hana2sp06',
        '  machine config:      linuxx86_64',
        '  git hash:            a1b2c3d4e5f698a7b6c5d4e3f2a1b0c9',
        '  git merge time:      2023-06-02 10:12:44',
        '  weekstone:           0000.00.0',
        '  compile date:        2023-06-02 12:46:06',
        '  compile host:        ld5569',
        '  compile type:        rel',
      ]);
    }else{
      ap('사용법: HDB start | stop | info | version','wa');
    }
  },

  hdbsql(args){
    if(activeTab!=='db'){ap('bash: hdbsql: command not found','er');return;}
    if(!dbOn){ap('* 10: error: Connection failed (HANA not running)','er');return;}
    const joined=args.join(' ');
    const sqlMatch=joined.match(/"([^"]+)"/)||joined.match(/'([^']+)'/);
    const sql=(sqlMatch?sqlMatch[1]:'').toUpperCase().trim();

    ap(`hdbsql S4H=> ${sqlMatch?sqlMatch[0]:''}`,'mu');

    if(sql.includes('M_SERVICES')){
      apl([
        'SERVICE_NAME      HOST      PORT   ACTIVE_STATUS  DETAIL',
        'nameserver        s4hdb01   30001  YES            master',
        'preprocessor      s4hdb01   30010  YES',
        'indexserver       s4hdb01   30003  YES            master, SQL port: 30015',
        'statisticsserver  s4hdb01   30017  YES',
        'webdispatcher     s4hdb01   30040  YES',
        '5 rows selected (execution time: 3.127 msec)','','OK','',
      ]);
    }else if(sql.includes('M_DATABASES')){
      apl([
        'DATABASE_NAME  DESCRIPTION  ACTIVE_STATUS  OS_USER      OS_GROUP  RESTART_MODE',
        'SYSTEMDB       SystemDB     YES            s4hdb01adm   sapsys    DEFAULT',
        'S4H            S4H          YES            s4hdb01adm   sapsys    DEFAULT',
        '2 rows selected (execution time: 2.841 msec)','','OK','',
      ]);
    }else if(sql.includes('M_DISK_USAGE')){
      apl([
        'HOST      SERVER_TIMESTAMP             USAGE_TYPE  USED_SIZE    TOTAL_SIZE',
        `s4hdb01   2026-05-08 09:42:17.000000   DATA        51,895,123   214,748,364`,
        `s4hdb01   2026-05-08 09:42:17.000000   LOG         12,845,056   107,374,182`,
        `s4hdb01   2026-05-08 09:42:17.000000   TRACE        2,516,582    53,687,091`,
        '3 rows selected (execution time: 5.223 msec)','','OK','',
      ]);
    }else if(sql.includes('M_BACKUP_CATALOG')){
      apl([
        'ENTRY_ID  ENTRY_TYPE_NAME       SYS_START_TIME               STATE_NAME',
        '1234      complete data backup  2026-05-07 02:00:00.000000   successful',
        '1235      log backup            2026-05-08 00:00:01.000000   successful',
        '2 rows selected (execution time: 4.112 msec)','','OK','',
      ]);
    }else if(sql.includes('M_CONNECTIONS')){
      apl([
        'CONNECTION_ID  USER      CLIENT_HOST    CLIENT_IP      PORT   STATUS  CREATED_AT',
        '        65540  SYSTEM    s4happ01       10.10.1.51     39244  IDLE    2026-05-08 09:14:22.000000',
        '        65541  SAPABAP1  s4happ01       10.10.1.51     39246  IDLE    2026-05-08 09:14:23.000000',
        '        65542  SAPABAP1  s4happ01       10.10.1.51     39248  IDLE    2026-05-08 09:14:23.000000',
        '        65543  SAPABAP1  s4happ01       10.10.1.51     39250  RUNNING 2026-05-08 09:14:23.000000',
        '4 rows selected (execution time: 2.841 msec)','','OK','',
      ]);
    }else if(sql.includes('M_SYSTEM_OVERVIEW')){
      apl([
        'SECTION         DESCRIPTION               VALUE',
        'System          Instance ID               HDB00',
        'System          Instance Start Time       2026-04-23 06:20:01',
        'System          HANA Version              2.00.067.00',
        'System          Mode                      primary',
        'Disk            Data disk size (GB)       200.0',
        'Disk            Data disk used (GB)        48.3',
        'Disk            Log disk size (GB)        100.0',
        'Disk            Log disk used (GB)         12.1',
        'Memory          Physical memory (GB)       64.0',
        'Memory          Used by HANA (GB)          46.8',
        'Memory          Used by OS (GB)             3.2',
        'Alerts          High priority alerts            0',
        'Alerts          Medium priority alerts          1',
        '14 rows selected (execution time: 6.341 msec)','','OK','',
      ]);
    }else if(sql.includes('M_VOLUME_SIZES')){
      apl([
        'HOST      PORT   SERVICE_NAME   VOL_ID  TYPE  TOTAL_SIZE       USED_SIZE',
        's4hdb01   30003  indexserver         1  DATA  214748364800     51895123456',
        's4hdb01   30003  indexserver         2  LOG   107374182400     12715802624',
        '2 rows selected (execution time: 4.521 msec)','','OK','',
      ]);
    }else if(sql.includes('M_LICENSE')){
      apl([
        'SYSTEM_ID  HARDWARE_KEY   INSTALLED_DATE        EXPIRATION_DATE       PRODUCT_LIMIT  PRODUCT_USAGE  VALID',
        'S4H        I1234567890    2024-01-15 00:00:00   9999-12-31 00:00:00              48             46  TRUE',
        '1 row selected (execution time: 1.245 msec)','','OK','',
      ]);
    }else if(sql){
      ap(`* 257: sql syntax error: ${sql}`,'er');
      ap('(지원 쿼리: M_SERVICES, M_DATABASES, M_DISK_USAGE, M_BACKUP_CATALOG, M_CONNECTIONS, M_SYSTEM_OVERVIEW, M_VOLUME_SIZES, M_LICENSE)','mu');
    }else{
      ap('사용법: hdbsql -i 00 -u <user> -p <pw> "SELECT * FROM <view>"','wa');
    }
  },

  hdbcons(args){
    if(activeTab!=='db'){ap('bash: hdbcons: command not found','er');return;}
    if(!dbOn){ap('hdbcons: cannot connect to indexserver (HANA not running)','er');return;}
    const joined=args.join(' ');
    const cmdMatch=joined.match(/"([^"]+)"/)||joined.match(/'([^']+)'/);
    const cmd=(cmdMatch?cmdMatch[1]:'').toLowerCase().trim();

    ap(`hdbcons version 2.00.067`,'mu');
    ap('⚠ hdbcons는 전문가 전용 도구입니다. 프로덕션 환경에서 잘못된 명령 실행 시 시스템 장애가 발생할 수 있습니다.','wa');

    if(cmd.includes('replication')){
      apl([
        '> replication info',
        '────────────────────────────────────────',
        '  Replication Mode   : PRIMARY',
        '  Replication Status : ACTIVE',
        '  Secondary Site     : s4hdb02 (ASYNC)',
        '  Replication Lag    : 0.5 sec',
        '  Last Sync Time     : 2026-05-08 09:41:55',
        '  Log Position       : 1234567',
        '────────────────────────────────────────',
      ],'su');
    }else if(cmd){
      ap(`> ${cmd}`)
      ap(`hdbcons: unknown command '${cmd}'`,'er');
      ap('(지원 명령어: "replication info")','mu');
    }else{
      ap('사용법: hdbcons "replication info"','wa');
    }
  },

  hdbuserstore(args){
    if(activeTab!=='db'){ap('bash: hdbuserstore: command not found','er');return;}
    const sub=args[0]||'', key=args[1]||'';
    const header=()=>{
      ap(`DATA FILE       : /home/${user}/.hdb/${DB_HOST}/SSFS_HDB.DAT`);
      ap(`KEY FILE        : /home/${user}/.hdb/${DB_HOST}/SSFS_HDB.KEY`);
      ap('');
    };
    if(sub==='list'){
      header();
      const keys=Object.entries(hdbuserStore);
      if(!keys.length){ap('(No entries)','mu');}
      else keys.forEach(([k,v])=>{ap(`KEY ${k}`);ap(`  ENV : ${v.env}`);ap(`  USER: ${v.user}`);});
    }else if(sub==='get'){
      if(!key){ap('사용법: hdbuserstore get <KEY>','wa');return;}
      if(!hdbuserStore[key]){ap(`* Key '${key}' does not exist`,'er');return;}
      header();
      ap(`KEY ${key}`);ap(`  ENV : ${hdbuserStore[key].env}`);ap(`  USER: ${hdbuserStore[key].user}`);
    }else if(sub==='set'){
      // hdbuserstore set KEY HOST:PORT USER PASSWORD
      const env=args[2]||'', huser=args[3]||'', pw=args[4]||'';
      if(!key||!env||!huser||!pw){ap('사용법: hdbuserstore set <KEY> <HOST:PORT> <USER> <PASSWORD>','wa');return;}
      hdbuserStore[key]={env,user:huser}; // pw는 보안상 저장 안 함 (실제 동작과 동일)
      ap(`Key '${key}' set successfully.`,'su');
    }else if(sub==='delete'){
      if(!key){ap('사용법: hdbuserstore delete <KEY>','wa');return;}
      if(!hdbuserStore[key]){ap(`* Key '${key}' does not exist`,'er');return;}
      delete hdbuserStore[key];
      ap(`Key '${key}' deleted.`,'su');
    }else{
      ap('사용법: hdbuserstore list | get <KEY> | set <KEY> <ENV> <USER> <PW> | delete <KEY>','wa');
    }
  },

  /* ─── 공통 명령어 (AP/DB 모두 사용 가능) ─── */

  ping(args){
    const cArg=args.indexOf('-c');
    const count=cArg>=0?parseInt(args[cArg+1])||4:4;
    // -c 뒤 숫자 인덱스를 건너뛰고 호스트를 찾음
    const skipIdx=new Set(cArg>=0?[cArg,cArg+1]:[]);
    const host=args.find((a,i)=>!skipIdx.has(i)&&!a.startsWith('-'))||'';
    if(!host){ap('Usage: ping [-c count] <host>','wa');return;}
    const knownHosts={
      's4happ01':{'ip':'10.10.1.51','fqdn':'s4happ01.corp.com'},
      's4happ01.corp.com':{'ip':'10.10.1.51','fqdn':'s4happ01.corp.com'},
      's4hdb01':{'ip':'10.10.1.52','fqdn':'s4hdb01.corp.com'},
      's4hdb01.corp.com':{'ip':'10.10.1.52','fqdn':'s4hdb01.corp.com'},
      's4happ02':{'ip':'10.10.1.53','fqdn':'s4happ02.corp.com'},
      'localhost':{'ip':'127.0.0.1','fqdn':'localhost'},
    };
    const h=knownHosts[host];
    if(!h){
      ap(`PING ${host} (unknown host)`);
      ap(`From ${HOST} icmp_seq=1 Destination Host Unreachable`,'er');
      ap(`--- ${host} ping statistics ---`,'mu');
      ap(`${count} packets transmitted, 0 received, 100% packet loss`,'er');
      return;
    }
    ap(`PING ${h.fqdn} (${h.ip}) 56(84) bytes of data.`);
    for(let i=1;i<=count;i++){
      const ms=(0.1+Math.random()*0.3).toFixed(3);
      ap(`64 bytes from ${h.fqdn} (${h.ip}): icmp_seq=${i} ttl=64 time=${ms} ms`,'su');
    }
    ap(`--- ${h.fqdn} ping statistics ---`,'mu');
    ap(`${count} packets transmitted, ${count} received, 0% packet loss, time ${count*250}ms`,'su');
    ap(`rtt min/avg/max/mdev = 0.112/0.221/0.334/0.052 ms`,'mu');
  },

  du(args){
    // du -sh <path>  또는  du -h --max-depth=N <path>
    const joined=args.join(' ');
    const depthMatch=joined.match(/--max-depth[= ](\d+)/);
    const depth=depthMatch?parseInt(depthMatch[1]):-1;
    const pathArg=args.find(a=>!a.startsWith('-')&&!a.match(/^\d+$/))||'.';
    const target=rp(pathArg);

    // 디렉토리별 가상 크기 (AP)
    const DIR_SIZE_AP={
      '/usr/sap/trans':       '4.2G',
      '/usr/sap/trans/data':  '1.8G',
      '/usr/sap/trans/cofiles':'512M',
      '/usr/sap/trans/log':   '256M',
      '/usr/sap/trans/tmp':   '128M',
      '/usr/sap/trans/buffer':'1.2G',
      '/usr/sap/trans/actlog':'384M',
      '/usr/sap/S4H':         '12G',
      '/usr/sap/S4H/D00':     '8.5G',
      '/usr/sap/S4H/D00/work':'1.2G',
      '/usr/sap/S4H/SYS':     '3.4G',
      '/hana/backup':         '52G',
      '/hana/backup/data':    '48G',
      '/hana/backup/log':     '3.8G',
      '/hana/backup/catalog': '240M',
      '/var/log':             '84M',
      '/var/log/sap':         '2.4M',
    };
    const DIR_SIZE_DB={
      '/hana/backup':         '52G',
      '/hana/backup/data':    '48G',
      '/hana/backup/log':     '3.8G',
      '/hana/backup/catalog': '240M',
      '/hana/data/S4H':       '48G',
      '/hana/log/S4H':        '12G',
      '/hana/shared/S4H':     '18G',
      '/usr/sap/S4H/HDB00':   '2.1G',
      '/usr/sap/S4H/HDB00/trace':'1.8G',
    };
    const sizeMap=activeTab==='db'?DIR_SIZE_DB:DIR_SIZE_AP;

    if(!FS[target]&&!isFile(target)){ap(`du: ${pathArg}: No such file or directory`,'er');return;}
    if(isFile(target)){const m=FILE_META[target];ap(`${m?(m.size_mb<1?Math.round(m.size_mb*1024)+'K':m.size_mb<1024?Math.round(m.size_mb)+'M':Math.round(m.size_mb/1024)+'G'):'4.0K'}\t${target}`);return;}

    if(depth===-1||args.includes('-s')){
      // du -sh: 총합만
      ap(`${sizeMap[target]||'4.0K'}\t${target}`);
    }else{
      // du -h --max-depth=N
      (FS[target]||[]).forEach(e=>{
        const full=(target==='/'?'':target)+'/'+e;
        ap(`${sizeMap[full]||'4.0K'}\t${full}`);
      });
      ap(`${sizeMap[target]||'4.0K'}\t${target}`);
    }
  },

  systemctl(args){
    const sub=args[0]||'',svc=args[1]||'';
    if(sub!=='status'){ap(`systemctl: '${sub}' not supported in simulator (status only)`,'wa');return;}
    if(!svc){ap('Usage: systemctl status <service>','wa');return;}

    // AP 서버 서비스
    const AP_SVCS={
      'sapinit':{desc:'SAP System Startup/Shutdown',running:()=>sapOn},
      'sapstartsrv_S4H_00':{desc:'SAP Start Service S4H 00',running:()=>true}, // sapstartsrv는 SAP 정지 시에도 독립 실행 유지
    };
    // DB 서버 서비스
    const DB_SVCS={
      'hdbdaemon':{desc:'SAP HANA DB Daemon (S4H HDB00)',running:()=>dbOn},
      'sapstartsrv_S4H_HDB00':{desc:'SAP Start Service S4H HDB00',running:()=>true}, // sapstartsrv는 HANA 정지 시에도 독립 실행 유지
    };
    const svcMap=activeTab==='db'?DB_SVCS:AP_SVCS;
    const info=svcMap[svc];
    if(!info){
      // 알 수 없는 서비스
      apl([
        `● ${svc}.service`,
        `   Loaded: not-found (Reason: No such file or directory)`,
        `   Active: inactive (dead)`,
      ],'er');
      return;
    }
    const running=info.running();
    const statusLine=running
      ?'   Active: \x1b[32mactive (running)\x1b[0m'
      :'   Active: inactive (dead)';
    apl([
      `● ${svc}.service - ${info.desc}`,
      `   Loaded: loaded (/etc/init.d/${svc}; enabled)`,
      running
        ?'   Active: active (running) since ' + new Date().toISOString().replace('T',' ').slice(0,19)
        :'   Active: inactive (dead)',
      running?`     Main PID: ${activeTab==='db'?34765:28472} (${activeTab==='db'?'hdbdaemon':'disp+work'})`:'',
      running?`   CGroup: /system.slice/${svc}.service`:'',
    ].filter(Boolean), running?'su':'wa');
    if(!running)ap('(시스템이 정지 상태입니다)','er');
  },

  hdbbackupdiag(args){
    if(activeTab!=='db'){ap('bash: hdbbackupdiag: command not found','er');return;}
    if(args[0]!=='--check'){ap('사용법: hdbbackupdiag --check','wa');return;}
    apl([
      'Backup Diagnosis Tool — SAP HANA 2.00.067',
      '══════════════════════════════════════════',
      'Checking backup configuration ...',
    ]);
    ap('  Backup destination   : /hana/backup/data     [OK]','su');
    ap('  Log backup dest      : /hana/backup/log      [OK]','su');
    ap('  Backup catalog       : /hana/backup/catalog  [OK]','su');
    ap('Checking last data backup ...');
    ap('  Last data backup     : 2026-05-07 02:00:00   [OK]','su');
    ap('  Backup size          : 48.3 GB               [OK]','su');
    ap('  Backup age           : 31:42:17              [OK] (< 48h)','su');
    ap('Checking last log backup ...');
    ap('  Last log backup      : 2026-05-08 00:00:01   [OK]','su');
    ap('  Log backup age       : 9:42:16               [OK] (< 15min: YES)','su');
    ap('══════════════════════════════════════════');
    ap('Overall result: OK — all backup checks passed.','su');
  },

  hdbbackupcheck(args){
    if(activeTab!=='db'){ap('bash: hdbbackupcheck: command not found','er');return;}
    // 암호화 백업 무결성 검증 도구 (SAP Note 2165194)
    const prefix=args[0]||'';
    if(!prefix){
      ap('사용법: hdbbackupcheck <backup-prefix>','wa');
      ap('예)  hdbbackupcheck /hana/backup/data/COMPLETE_DATA_BACKUP_0_1','mu');
      return;
    }
    apl([
      `Checking backup: ${prefix}`,
      '══════════════════════════════════════════',
    ]);
    ap('  Backup type          : complete data backup','mu');
    ap('  Encryption           : AES-256-CBC        [OK]','su');
    ap('  Integrity check      : CRC valid           [OK]','su');
    ap('  Catalog consistency  : verified            [OK]','su');
    ap('  Backup file readable : YES                 [OK]','su');
    ap('══════════════════════════════════════════');
    ap('Backup verification passed. Restore is possible.','su');
  },

  /* ── id: 사용자 UID/GID 정보 ── */
  id(args){
    const target=args[0]||user;
    const userMap={
      's4hadm':   {uid:1001,gid:1000,groups:'1000(sapsys) 1001(s4hadm)'},
      's4hdb01adm':{uid:1002,gid:1000,groups:'1000(sapsys) 1002(s4hdb01adm)'},
      'root':     {uid:0,   gid:0,   groups:'0(root)'},
      'sapadm':   {uid:1003,gid:1000,groups:'1000(sapsys) 1003(sapadm)'},
    };
    const u=userMap[target];
    if(!u){ap(`id: '${target}': no such user`,'er');return;}
    ap(`uid=${u.uid}(${target}) gid=${u.gid}(${target==='root'?'root':'sapsys'}) groups=${u.groups}`);
  },

  /* ── groups: 사용자 그룹 목록 ── */
  groups(args){
    const target=args[0]||user;
    const groupMap={
      's4hadm':    `${target} : sapsys s4hadm`,
      's4hdb01adm':`${target} : sapsys s4hdb01adm`,
      'root':      `${target} : root`,
      'sapadm':    `${target} : sapsys sapadm`,
    };
    const g=groupMap[target];
    if(!g){ap(`groups: '${target}': no such user`,'er');return;}
    ap(g);
  },

  /* ── nslookup: DNS 조회 시뮬레이션 ── */
  nslookup(args){
    const host=args[0]||'';
    if(!host){ap('Usage: nslookup <hostname>','wa');return;}
    const dns={
      's4happ01':'10.10.1.51','s4happ01.corp.com':'10.10.1.51',
      's4hdb01': '10.10.1.52','s4hdb01.corp.com': '10.10.1.52',
      's4happ02':'10.10.1.53','s4happ02.corp.com':'10.10.1.53',
    };
    ap('Server:   10.10.1.1');
    ap('Address:  10.10.1.1#53');
    ap('');
    if(dns[host]){
      ap('Non-authoritative answer:');
      ap(`Name:   ${host.includes('.')?host:host+'.corp.com'}`);
      ap(`Address: ${dns[host]}`);
    }else{
      ap(`** server can't find ${host}: NXDOMAIN`,'er');
    }
  },

  /* ── telnet: 포트 연결성 확인 ── */
  telnet(args){
    const host=args[0]||'';
    const port=args[1]||'';
    if(!host||!port){ap('Usage: telnet <host> <port>','wa');return;}
    // IP 매핑
    const ipMap={
      's4happ01':'10.10.1.51','s4happ01.corp.com':'10.10.1.51',
      's4happ02':'10.10.1.53','s4happ02.corp.com':'10.10.1.53',
      's4hdb01': '10.10.1.52','s4hdb01.corp.com': '10.10.1.52',
    };
    const ip=ipMap[host];
    if(!ip){
      ap(`Trying ${host}...`);
      ap(`telnet: connect to address ${host}: No route to host`,'er');
      return;
    }
    ap(`Trying ${ip}...`);
    // 포트 매핑: 기동 상태에 따라 open/closed 결정
    const portNum=parseInt(port,10);
    const apPorts={3200:sapOn,3300:sapOn,3600:sapOn,3601:sapOn};
    const dbPorts={30015:dbOn,30013:dbOn,30040:dbOn,30007:dbOn};
    let isOpen=false;
    const isApHost=(host==='s4happ01'||host==='s4happ01.corp.com'||host==='s4happ02'||host==='s4happ02.corp.com');
    const isDbHost=(host==='s4hdb01'||host==='s4hdb01.corp.com');
    if(isApHost&&apPorts.hasOwnProperty(portNum)){
      isOpen=apPorts[portNum];
    }else if(isDbHost&&dbPorts.hasOwnProperty(portNum)){
      isOpen=dbPorts[portNum];
    }else{
      // 알려지지 않은 포트 → refused
      isOpen=false;
    }
    if(isOpen){
      ap(`Connected to ${host}.`);
      ap(`Escape character is '^]'.`);
      ap(`Connection closed by foreign host.`,'mu');
    }else{
      ap(`telnet: connect to address ${ip}: Connection refused`,'er');
    }
  },

  /* ── journalctl: systemd 저널 조회 ── */
  journalctl(args){
    // 옵션 파싱: -e, -u <service>
    const eFlag=args.includes('-e')||args.length===0;
    const uIdx=args.indexOf('-u');
    const service=uIdx>=0?args[uIdx+1]||'':'';
    // 알 수 없는 옵션 감지
    const knownOpts=['-e','-u'];
    const unknownOpt=args.find(a=>a.startsWith('-')&&!knownOpts.includes(a));
    if(unknownOpt){ap(`journalctl: invalid option -- '${unknownOpt.replace(/^-+/,'')}'`,'er');return;}
    if(service){
      // 서비스별 로그
      if(activeTab==='ap'){
        if(service==='sapinit'){
          apl([
            `-- Logs begin at Wed 2026-05-07 06:00:00 KST. --`,
            `May 08 09:14:00 s4happ01 sapinit[1234]: Starting SAP initialization`,
            `May 08 09:14:01 s4happ01 sapinit[1234]: INFO: Starting SAP system S4H`,
            `May 08 09:14:02 s4happ01 sapinit[1234]: Mounting /sapmnt via NFS`,
            `May 08 09:14:09 s4happ01 sapinit[1234]: /sapmnt mounted successfully`,
            `May 08 09:14:10 s4happ01 sapinit[1234]: SAP initialization complete`,
          ]);
        }else if(service==='sapstartsrv_S4H_00'){
          apl([
            `-- Logs begin at Wed 2026-05-07 06:00:00 KST. --`,
            `May 08 09:14:02 s4happ01 sapstartsrv_S4H_00[1235]: Startup...`,
            `May 08 09:14:03 s4happ01 sapstartsrv_S4H_00[1235]: Reading profile /usr/sap/S4H/SYS/profile/S4H_D00_s4happ01`,
            `May 08 09:14:04 s4happ01 sapstartsrv_S4H_00[1235]: Starting disp+work (PID 28472)`,
            `May 08 09:14:10 s4happ01 sapstartsrv_S4H_00[1235]: Instance D00 started`,
          ]);
        }else if(service==='syslog'||service==='rsyslog'){
          apl([
            `-- Logs begin at Wed 2026-05-07 06:00:00 KST. --`,
            `May 08 06:00:00 s4happ01 systemd[1]: Started System Logging Service.`,
            `May 08 06:00:01 s4happ01 rsyslogd[1100]: imuxsock: Acquired UNIX socket '/run/systemd/journal/syslog'`,
          ]);
        }else{
          ap('-- No entries --','mu');
        }
      }else{
        // DB 탭
        if(service==='hdbdaemon'){
          apl([
            `-- Logs begin at Wed 2026-05-07 06:00:00 KST. --`,
            `May 08 09:14:05 s4hdb01 hdbdaemon[34765]: Starting HANA services`,
            `May 08 09:14:07 s4hdb01 hdbdaemon[34765]: nameserver (PID 34780) started`,
            `May 08 09:14:09 s4hdb01 hdbdaemon[34765]: indexserver (PID 34890) started`,
            `May 08 09:14:11 s4hdb01 hdbdaemon[34765]: preprocessor (PID 34910) started`,
            `May 08 09:14:11 s4hdb01 hdbdaemon[34765]: All services running`,
          ]);
        }else if(service==='sapinit'){
          apl([
            `-- Logs begin at Wed 2026-05-07 06:00:00 KST. --`,
            `May 08 09:14:00 s4hdb01 sapinit[1100]: Starting SAP HANA initialization`,
            `May 08 09:14:01 s4hdb01 sapinit[1100]: Mounting /hana/shared via XFS`,
            `May 08 09:14:04 s4hdb01 sapinit[1100]: SAP HANA initialization complete`,
          ]);
        }else{
          ap('-- No entries --','mu');
        }
      }
      return;
    }
    // -e 또는 단독 실행: 최근 저널 출력
    if(activeTab==='ap'){
      apl([
        '-- Logs begin at Wed 2026-05-07 06:00:00 KST, end at Thu 2026-05-08 09:42:17 KST. --',
        'May 08 09:14:00 s4happ01 systemd[1]: Starting SAP System Initialization...',
        'May 08 09:14:01 s4happ01 sapinit[1234]: INFO: Starting SAP system S4H',
        'May 08 09:14:02 s4happ01 sapstartsrv_S4H_00[1235]: Startup...',
        'May 08 09:14:10 s4happ01 systemd[1]: Started SAP System Initialization.',
        'May 08 09:41:00 s4happ01 kernel: [12345.678] EXT4-fs: mounted filesystem',
        'May 08 09:42:15 s4happ01 systemd[1]: sapcontrol: SAP System started',
      ]);
    }else{
      apl([
        '-- Logs begin at Wed 2026-05-07 06:00:00 KST, end at Thu 2026-05-08 09:42:17 KST. --',
        'May 08 09:14:00 s4hdb01 systemd[1]: Starting SAP HANA Database System...',
        'May 08 09:14:05 s4hdb01 hdbdaemon[34765]: Starting HANA services',
        'May 08 09:14:09 s4hdb01 hdbindexserver[34890]: Column store loaded',
        'May 08 09:14:11 s4hdb01 systemd[1]: Started SAP HANA Database System.',
        'May 08 09:42:00 s4hdb01 kernel: [12400.123] XFS: mounted /hana/data',
        'May 08 09:42:15 s4hdb01 hdbdaemon[34765]: All services running',
      ]);
    }
  },

  /* ── iostat: 디스크 I/O 통계 ── */
  iostat(args){
    const xflag=args.includes('-x');
    ap('Linux 5.14.21-150400.24.81-default ('+HOST+')   '+new Date().toLocaleDateString('ko-KR'));
    ap('');
    ap('avg-cpu:  %user   %nice %system %iowait  %steal   %idle');
    ap('           2.34    0.00    1.12    0.45    0.00   96.09');
    ap('');
    if(xflag){
      apl([
        'Device            r/s     w/s   rkB/s   wkB/s  rrqm/s  wrqm/s  %util',
        'sda              1.23    8.45    49.2   338.0    0.00    0.12    1.2',
        'sdb             42.10  312.80 16840.0 125120.0   0.00    1.24   38.7',
      ]);
    }else{
      apl([
        'Device             tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn',
        'sda               9.68        49.2        338.0     403968    2772992',
        'sdb             354.90     16840.0     125120.0  138117120 1026007040',
      ]);
    }
  },

  /* ── disp+work -version: SAP 커널 버전 확인 ── */
  'disp+work'(args){
    if(activeTab!=='ap'){ap('bash: disp+work: command not found','er');return;}
    if(!args.includes('-version')&&!args.includes('--version')&&!args.includes('-V')){
      ap('usage: disp+work -version | -V','wa');return;
    }
    apl([
      'disp+work information',
      `kernel release                793`,
      `kernel make variant           793_REL`,
      `ABAP Load Version             4`,
      `compiled for                  OS/390 Kernel 5.14`,
      `compilation mode              UNICODE`,
      `compile time                  Jan 15 2024 03:22:41`,
      `update level                  0`,
      `patch number                  700`,
      `source id                     0.793`,
      `RKS compatibility level       0`,
      `supported environment`,
      `  database (SAP, table SVERS) 793`,
      `  operating system            SUSE LINUX 15`,
    ]);
  },

  /* ── dmesg: 커널 메시지 링 버퍼 ── */
  dmesg(args){
    apl([
      '[    0.000000] Linux version 5.14.21-150400.24.81-default (geeko@buildhost)',
      '[    0.000000] BIOS-provided physical RAM map:',
      '[    1.234567] EXT4-fs (sda1): mounted filesystem with ordered data mode',
      '[    2.345678] XFS (sdb1): Mounting V5 Filesystem',
      '[    2.456789] XFS (sdb1): Ending clean mount',
      '[   15.678901] sapstartsrv[1234]: SAP host agent started',
      '[   18.901234] hdbdaemon['+( activeTab==='db'?34765:28472)+']: HANA daemon initialized',
      '[  120.123456] NET: Registered PF_INET6 protocol family',
      `[ ${Math.floor(Date.now()/1000-86400).toString().padStart(5,' ')}.000000] ${HOST} kernel: NFS: nfs4_reclaim_open_state: 0 recovery`,
    ],'mu');
  },

  /* ── tp: 전송 관리 명령어 (세션 내 버퍼 상태 유지) ── */
  tp(args){
    if(activeTab!=='ap'){ap('bash: tp: command not found','er');return;}
    const sub=args[0]||'';
    if(!sub){
      ap('usage: tp <command> [<transport>] [<SID>] [options]','wa');
      ap('       commands: showbuffer, addtobuffer, import, importall, count, connect','wa');
      return;
    }
    // 세션 내 버퍼 상태 (초기값: 3건)
    if(!window._tpBuffer) window._tpBuffer=[
      {num:'K900001.S4H',date:'2026/05/01',user:'s4hadm'},
      {num:'K900002.S4H',date:'2026/05/06',user:'s4hadm'},
      {num:'K900003.S4H',date:'2026/05/08',user:'s4hadm'},
    ];
    const buf=window._tpBuffer;
    if(sub==='showbuffer'){
      const sid=args[1]||SID;
      ap(`This is tp version 380.04.79 (release 793 - unicode enabled)`);
      ap(``);
      ap(`Bufferfile for ${sid} at: /usr/sap/trans/buffer/${sid}`);
      ap(``);
      buf.forEach(e=>ap(`  SALM  ${e.num}   Import ${e.date} ${e.user}`));
      ap(``);
      ap(`${buf.length} entr${buf.length===1?'y':'ies'} in buffer for ${sid}`);
    }else if(sub==='count'){
      const sid=args[1]||SID;
      ap(`${buf.length} request${buf.length===1?'':'s'} in buffer for ${sid}`);
    }else if(sub==='connect'){
      const sid=args[1]||SID;
      ap(`This is tp version 380.04.79`);
      ap(`tp connect ${sid} OK (R3trans return code: 0)`,'su');
    }else if(sub==='addtobuffer'){
      const trnum=args[1]||'';
      const sid=args[2]||SID;
      if(!trnum){ap('usage: tp addtobuffer <TRNUMBER> <SID>','wa');return;}
      const today=new Date().toISOString().slice(0,10).replace(/-/g,'/');
      buf.push({num:trnum,date:today,user});
      ap(`This is tp version 380.04.79`);
      ap(`tp addtobuffer ${trnum} ${sid}: ok`,'su');
    }else if(sub==='importall'){
      const sid=args[1]||SID;
      ap(`This is tp version 380.04.79`);
      ap(`Importing all requests for ${sid} ...`,'in');
      buf.forEach(e=>ap(`  ${e.num}  return code: 0`,'su'));
      const cnt=buf.length;
      window._tpBuffer=[];
      ap(`tp importall ${sid}: ${cnt} request${cnt===1?'':'s'} imported (rc=0)`,'su');
    }else{
      ap(`tp: command '${sub}' not supported in simulator`,'wa');
    }
  },

  /* ── hdbnsutil: HANA 시스템 복제 상태 (DB1=PRIMARY, DB2=SECONDARY) ── */
  hdbnsutil(args){
    if(activeTab!=='db'){ap('bash: hdbnsutil: command not found','er');return;}
    const sub=args[0]||'';
    const isPrimary=activeServer!=='db2';
    if(sub==='-sr_state'||sub==='--sr_state'){
      if(!dbOn){ap('hdbnsutil: HANA not running','er');return;}
      if(isPrimary){
        apl([
          'System Replication State',
          '~~~~~~~~~~~~~~~~~~~~~~~~',
          '',
          'online: true',
          '',
          'mode: primary',
          'operation mode: primary',
          'site id: 1',
          'site name: SITE_1',
          'active primary site: 1',
          'primary fully connected: true',
          'full sync: false',
          'primary time stamp: 2026 04 23 06:20:01',
          `Replication mode of ${HOST}: PRIMARY`,
          `Operation mode of ${HOST}: primary`,
          '',
          'Host Mappings:',
          '~~~~~~~~~~~~~~',
          '',
          `${HOST} -> SITE_1 (${HOST})`,
          `${DB2_HOST} -> SITE_2 (${DB2_HOST})`,
          '',
          'done.',
        ]);
      }else{
        apl([
          'System Replication State',
          '~~~~~~~~~~~~~~~~~~~~~~~~',
          '',
          'online: true',
          '',
          'mode: sync',
          'site id: 2',
          'site name: SITE_2',
          'active primary site: 1',
          'primary fully connected: true',
          'full sync: false',
          'operation mode: logreplay',
          `Replication mode of ${HOST}: SYNC`,
          `Operation mode of ${HOST}: secondary`,
          'secondary fully connected: true',
          '',
          'Host Mappings:',
          '~~~~~~~~~~~~~~',
          '',
          `${HOST} -> SITE_2 (${HOST})`,
          `${DB_HOST} -> SITE_1 (${DB_HOST})`,
          '',
          'done.',
        ],'in');
      }
    }else if(sub==='-sr_stateConfiguration'||sub==='--sr_stateConfiguration'){
      if(!dbOn){ap('hdbnsutil: HANA not running','er');return;}
      if(isPrimary){
        apl([
          'System Replication Configuration State',
          '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          '',
          'mode: primary',
          'site id: 1',
          'site name: SITE_1',
          '',
          `this host (${HOST}) is primary`,
          'secondary site is registered (mode: sync)',
          '',
          'done.',
        ]);
      }else{
        apl([
          'System Replication Configuration State',
          '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          '',
          'mode: sync',
          'site id: 2',
          'site name: SITE_2',
          '',
          `this host (${HOST}) is secondary`,
          `primary site: SITE_1 (${DB_HOST})`,
          'operation mode: logreplay',
          '',
          'done.',
        ],'in');
      }
    }else{
      ap(`hdbnsutil: unknown option '${sub}'`,'er');
      ap('usage: hdbnsutil -sr_state | -sr_stateConfiguration','wa');
    }
  },

};

/* ═══════════════════════════════════════════
   PHASE 3 — 퀴즈 시스템
═══════════════════════════════════════════ */

