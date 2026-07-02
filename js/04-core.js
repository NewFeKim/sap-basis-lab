/* ───────────────────────────────────────────
   활성 FS/FILES 참조 (탭 전환 시 교체)
─────────────────────────────────────────── */
let FS=FS_AP, FILES=FILES_AP;

/* ───────────────────────────────────────────
   유틸 함수
─────────────────────────────────────────── */
function gp(){return user==='root'?`root@${HOST}:${cwd}#`:`${user}@${HOST}:${cwd}>`;}
function up(){document.getElementById('pl').textContent=gp();}

function ap(text,cls=''){
  const o=document.getElementById('output');
  const d=document.createElement('div');
  d.className='ln'+(cls?' '+cls:'');
  d.textContent=text;
  o.appendChild(d);
  o.scrollTop=o.scrollHeight;
}
function apl(lines,cls=''){lines.forEach(l=>ap(l,cls));}
function apc(cmd){ap(gp()+' '+cmd,'mu');}

function rp(p){
  if(!p)return cwd;
  if(p.startsWith('/'))return p.replace(/\/+$/,'')||'/';
  const pts=cwd.split('/').filter(Boolean);
  p.split('/').forEach(s=>{
    if(s==='..')pts.length&&pts.pop();
    else if(s!=='.')pts.push(s);
  });
  return'/'+pts.join('/');
}

function isFile(path){
  const par=path.split('/').slice(0,-1).join('/')||'/';
  const name=path.split('/').pop();
  return FS[par]&&FS[par].includes(name)&&!FS[path];
}

/* ───────────────────────────────────────────
   탭/서버 전환
─────────────────────────────────────────── */

// 현재 서버 상태 저장
function _saveServer(){
  if(activeServer==='ap1'){apCwd=cwd;apUser=user;ap1On=sapOn;}
  else if(activeServer==='ap2'){ap2Cwd=cwd;ap2User=user;ap2On=sapOn;}
  else if(activeServer==='db1'){dbCwd=cwd;dbUser=user;db1On=dbOn;}
  else if(activeServer==='db2'){db2Cwd=cwd;db2User=user;db2On=dbOn;}
}

// 서버 전환 (단일/이중화 공통)
function switchServer(server){
  if(activeServer===server)return;
  _saveServer();
  activeServer=server;
  activeTab=server.startsWith('ap')?'ap':'db';

  // 상태 복원
  if(server==='ap1'){
    cwd=apCwd;user=apUser;sapOn=ap1On;HOST=AP_HOST;FS=FS_AP;FILES=FILES_AP;
    dbOn=db1On; // AP에서 DB 연결성은 Primary(DB1) 기준
  }else if(server==='ap2'){
    cwd=ap2Cwd;user=ap2User;sapOn=ap2On;HOST=AP2_HOST;FS=FS_AP;FILES=FILES_AP;
    dbOn=db1On; // AP2도 Primary(DB1)에 접속
  }else if(server==='db1'){
    cwd=dbCwd;user=dbUser;dbOn=db1On;HOST=DB_HOST;FS=FS_DB;FILES=FILES_DB;
  }else if(server==='db2'){
    cwd=db2Cwd;user=db2User;dbOn=db2On;HOST=DB2_HOST;FS=FS_DB;FILES=FILES_DB;
  }

  _updateTabUI(server);
  document.getElementById('output').innerHTML='';
  pagerQuit();
  if(activeTailTid){clearInterval(activeTailTid);activeTailTid=null;}
  up();
  if(typeof QuizEngine!=='undefined'){QuizEngine.onTab(activeTab);QuizEngine.onServer(activeServer);}
  _showWelcome(server);
}

// 하위 호환: 기존 switchTab('ap'|'db') 호출 대응
function switchTab(tab){
  if(tab==='ap')switchServer('ap1');
  else switchServer('db1');
}

// 모드 토글: 단일 ↔ 이중화
function setHaMode(enable){
  haMode=enable;
  localStorage.setItem('haMode', enable?'1':'0');
  const single=['tab-ap','tab-db'];
  const ha=['tab-ap1','tab-ap2','tab-db1','tab-db2'];
  single.forEach(id=>document.getElementById(id).style.display=enable?'none':'');
  ha.forEach(id=>document.getElementById(id).style.display=enable?'':'none');
  document.getElementById('mode-single').classList.toggle('on',!enable);
  document.getElementById('mode-ha').classList.toggle('on',enable);
  // 항상 ap1로 리셋 + UI 강제 갱신 (같은 서버여도 모드 변경 반영)
  activeServer=''; // force switchServer to not skip
  switchServer('ap1');
}

// UI 탭 강조 업데이트
function _updateTabUI(server){
  const isAP=server.startsWith('ap');
  const isDB=server.startsWith('db');
  // 단일 모드 탭
  document.getElementById('tab-ap').className='stab'+(server==='ap1'?' on':'');
  document.getElementById('tab-db').className='stab db-tab'+(server==='db1'?' on':'');
  // 이중화 모드 탭
  ['ap1','ap2'].forEach(s=>{
    const el=document.getElementById('tab-'+s);
    el.className='stab'+(server===s?' on':'');
  });
  ['db1','db2'].forEach(s=>{
    const el=document.getElementById('tab-'+s);
    el.className='stab db-tab'+(server===s?' on':'');
  });
  // 힌트 버튼 전환
  ['hb-ap','hb-ap2','hb-db','hb-db2'].forEach(id=>
    document.getElementById(id).style.display='none');
  if(server==='ap1')document.getElementById('hb-ap').style.display='flex';
  else if(server==='ap2')document.getElementById('hb-ap2').style.display='flex';
  else if(server==='db1')document.getElementById('hb-db').style.display='flex';
  else if(server==='db2')document.getElementById('hb-db2').style.display='flex';
  // 타이틀바
  const titles={
    ap1:`SAP Basis Training Terminal ${APP_VERSION} — AP1 s4happ01 (SLES 15 SP4) — SID: S4H`,
    ap2:`SAP Basis Training Terminal ${APP_VERSION} — AP2 s4happ02 (SLES 15 SP4) — SID: S4H`,
    db1:`SAP Basis Training Terminal ${APP_VERSION} — DB1 s4hdb01 (SLES 15 SP4) — SID: S4H / HANA 2.0`,
    db2:`SAP Basis Training Terminal ${APP_VERSION} — DB2 s4hdb02 (SLES 15 SP4) — SID: S4H / HANA 2.0`,
  };
  document.getElementById('tt-title').textContent=titles[server]||titles.ap1;
}

// 서버별 웰컴 배너
function _showWelcome(server){
  if(server==='ap1'){
    apl(['SUSE Linux Enterprise Server 15 SP4',`Kernel 5.14.21-150400.24.81-default (${AP_HOST})`,'Last login: Mon May 05 18:31:02 2026 from 10.10.1.10'],'mu');
    apl(['',`SAP BASIS TRAINING TERMINAL ${APP_VERSION} — AP1 Server Simulator`,`SID: S4H  |  Instance: D00  |  Host: ${AP_HOST}  |  User: ${apUser}`,'SAP System Status: '+(sapOn?'RUNNING':'STOPPED')+'  |  SLES 15 SP4  |  Kernel 793','','\'help\' 를 입력하면 명령어 목록을 볼 수 있습니다.',''],'in');
  }else if(server==='ap2'){
    apl(['SUSE Linux Enterprise Server 15 SP4',`Kernel 5.14.21-150400.24.81-default (${AP2_HOST})`,'Last login: Mon May 05 18:32:15 2026 from 10.10.1.10'],'mu');
    apl(['',`SAP BASIS TRAINING TERMINAL ${APP_VERSION} — AP2 Server Simulator`,`SID: S4H  |  Instance: D01  |  Host: ${AP2_HOST}  |  User: ${ap2User}`,'SAP System Status: '+(sapOn?'RUNNING':'STOPPED')+'  |  SLES 15 SP4  |  Kernel 793','','\'help\' 를 입력하면 명령어 목록을 볼 수 있습니다.',''],'in');
  }else if(server==='db1'){
    apl(['SUSE Linux Enterprise Server 15 SP4',`Kernel 5.14.21-150400.24.81-default (${DB_HOST})`,'Last login: Mon May 05 18:35:10 2026 from 10.10.1.51'],'mu');
    apl(['',`SAP BASIS TRAINING TERMINAL ${APP_VERSION} — DB1 Server Simulator`,`SID: S4H  |  Instance: HDB00  |  Host: ${DB_HOST}  |  User: ${dbUser}`,'HANA Status: '+(dbOn?'RUNNING':'STOPPED')+'  |  SLES 15 SP4  |  HANA 2.00.067  |  Role: PRIMARY','','\'help\' 를 입력하면 명령어 목록을 볼 수 있습니다.',''],'in');
  }else if(server==='db2'){
    apl(['SUSE Linux Enterprise Server 15 SP4',`Kernel 5.14.21-150400.24.81-default (${DB2_HOST})`,'Last login: Mon May 05 18:36:20 2026 from 10.10.1.51'],'mu');
    apl(['',`SAP BASIS TRAINING TERMINAL ${APP_VERSION} — DB2 Server Simulator`,`SID: S4H  |  Instance: HDB00  |  Host: ${DB2_HOST}  |  User: ${db2User}`,'HANA Status: '+(dbOn?'RUNNING':'STOPPED')+'  |  SLES 15 SP4  |  HANA 2.00.067  |  Role: SECONDARY','','\'help\' 를 입력하면 명령어 목록을 볼 수 있습니다.',''],'in');
  }
}

/* ───────────────────────────────────────────
   페이저 (less/more)
─────────────────────────────────────────── */
function showPager(lines){
  pagerLines=lines;pagerPos=0;pagerActive=true;
  document.getElementById('pager').style.display='flex';
  showPagerPage();
}
function showPagerPage(){
  const chunk=20;
  pagerLines.slice(pagerPos,pagerPos+chunk).forEach(l=>ap(l));
  pagerPos+=chunk;
  document.getElementById('pg-info').textContent=`(${Math.min(pagerPos,pagerLines.length)}/${pagerLines.length}행)`;
  if(pagerPos>=pagerLines.length)pagerQuit();
}
function pagerNext(){if(pagerActive)showPagerPage();}
function pagerQuit(){
  pagerActive=false;
  document.getElementById('pager').style.display='none';
  pagerLines=[];pagerPos=0;
}

/* ───────────────────────────────────────────
   파일 메타데이터 (find -size / -mtime 용)
─────────────────────────────────────────── */
const FILE_META={
  '/usr/sap/S4H/HDB00/trace/indexserver_s4hdb01.30003.000.trc':{size_mb:152,mtime_days:5},
  '/usr/sap/S4H/D00/work/dev_w0':{size_mb:8,mtime_days:0},
  '/usr/sap/S4H/D00/work/dev_disp':{size_mb:3,mtime_days:0},
  '/usr/sap/S4H/D00/work/dev_icm':{size_mb:2,mtime_days:0},
  '/usr/sap/S4H/D00/work/dev_ms':{size_mb:1,mtime_days:0},
  '/usr/sap/S4H/D00/work/sapstart.log':{size_mb:0.5,mtime_days:0},
  '/usr/sap/S4H/SYS/profile/DEFAULT.PFL':{size_mb:0.1,mtime_days:30},
  '/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01':{size_mb:0.1,mtime_days:30},
  '/usr/sap/trans/data/R000123.S4H':{size_mb:45,mtime_days:2},
  '/usr/sap/trans/data/R000124.S4H':{size_mb:12,mtime_days:1},
  '/usr/sap/trans/data/R000125.S4H':{size_mb:88,mtime_days:0},
  '/usr/sap/trans/data/R000126.S4H':{size_mb:220,mtime_days:0},
  '/usr/sap/trans/data/R000127.S4H':{size_mb:7,mtime_days:3},
  '/usr/sap/trans/cofiles/K000123.S4H':{size_mb:0.5,mtime_days:2},
  '/usr/sap/trans/cofiles/K000124.S4H':{size_mb:0.3,mtime_days:1},
  '/usr/sap/trans/cofiles/K000125.S4H':{size_mb:0.4,mtime_days:0},
  '/usr/sap/trans/cofiles/K000126.S4H':{size_mb:0.6,mtime_days:0},
  '/usr/sap/trans/cofiles/K000127.S4H':{size_mb:0.2,mtime_days:3},
  '/var/log/sap/sec_audit_20260507':{size_mb:1.0,mtime_days:1},
  '/var/log/sap/sec_audit_20260508':{size_mb:1.2,mtime_days:0},
  '/var/log/messages':{size_mb:5,mtime_days:0},
  '/hana/shared/S4H/HDB00/trace/indexserver_s4hdb01.30003.000.trc':{size_mb:152,mtime_days:5},
  '/hana/shared/S4H/HDB00/trace/nameserver_s4hdb01.30001.000.trc':{size_mb:24,mtime_days:5},
  '/usr/sap/S4H/HDB00/trace/backup.log':{size_mb:2,mtime_days:1},
};

/* ───────────────────────────────────────────
   명령어별 처리 함수
─────────────────────────────────────────── */
function doGrep(pattern,filePath,opts){
  const target=rp(filePath);
  let content=FILES[target];
  if(!content){
    if(FS[target])return ap(`grep: ${filePath}: Is a directory`,'er');
    if(!isFile(target))return ap(`grep: ${filePath}: No such file or directory`,'er');
    content='';
  }
  const invert=opts.includes('v'),ci=opts.includes('i'),linenum=opts.includes('n');
  let re;
  try{re=new RegExp(pattern,ci?'i':'');}
  catch(e){ap(`grep: invalid regex '${pattern}': ${e.message}`,'er');return;}
  const matched=content.split('\n').filter(l=>invert?!re.test(l):re.test(l));
  if(!matched.length){ap('(일치하는 행 없음)','mu');return;}
  matched.forEach((l,i)=>{
    const isErr=/(ERROR|FAIL)/i.test(l),isWarn=/WARN/i.test(l);
    ap(linenum?`${i+1}:${l}`:l,isErr?'er':isWarn?'wa':'');
  });
}

function doTail(args){
  let n=20,follow=false,file='';
  for(let i=0;i<args.length;i++){
    if(args[i]==='-f')follow=true;
    else if(args[i]==='-n')n=parseInt(args[++i])||20;
    else if(/^-\d+$/.test(args[i]))n=parseInt(args[i].slice(1));
    else file=args[i];
  }
  const target=rp(file);
  const content=FILES[target];
  if(!content){
    if(!isFile(target))ap(`tail: ${file}: No such file or directory`,'er');
    return;
  }
  content.split('\n').slice(-n).forEach(l=>{ap(l,/(ERROR|FAIL)/i.test(l)?'er':'');});
  if(follow){
    ap('(tail -f 시뮬레이션: 실시간 추적 중... Ctrl+C 로 종료)','wa');
    let cnt=0;
    const isDB=activeTab==='db';
    const msgs=isDB?[
      `[3${Math.floor(4765+cnt)}]{-1}[-1/-1] 2026-05-08 09:4${cnt}:00.000000 i nameserver     RowEngine.cc : processing query`,
      `[3${Math.floor(4890+cnt)}]{-1}[-1/-1] 2026-05-08 09:4${cnt}:01.000000 i indexserver    AttributeEngine.cc : memory delta merge started`,
      `[3${Math.floor(4890+cnt)}]{-1}[-1/-1] 2026-05-08 09:4${cnt}:02.000000 i indexserver    AttributeEngine.cc : delta merge complete`,
    ]:[
      `M  Wed May 07 09:4${cnt}:00 2026`,
      `M  ThRqNew: new request from ICM (client 10.10.1.10)`,
      `M  ThVBEnd: WP back to free state (type DIA, no.${cnt%6})`,
    ];
    if(activeTailTid){clearInterval(activeTailTid);activeTailTid=null;}
    activeTailTid=setInterval(()=>{
      cnt++;
      ap(msgs[cnt%msgs.length],'mu');
      document.getElementById('output').scrollTop=99999;
      if(cnt>=6){clearInterval(activeTailTid);activeTailTid=null;}
    },1200);
  }
}

function doFind(args){
  let path='.',name='',type='',sizeOp='',sizeMb=0,mtimeOp='',mtimeDays=0;
  for(let i=0;i<args.length;i++){
    const a=args[i];
    if(a==='-name')name=args[++i]||'';
    else if(a==='-type')type=args[++i]||'';
    else if(a==='-size'){
      const sv=args[++i]||'';
      const m=sv.match(/^([+-]?)(\d+(?:\.\d+)?)([kKmMgG]?)$/);
      if(m){sizeOp=m[1]||'=';sizeMb=parseFloat(m[2])*(m[3].toLowerCase()==='g'?1024:m[3].toLowerCase()==='k'?1/1024:1);}
    }else if(a==='-mtime'){
      const mv=args[++i]||'';
      const m=mv.match(/^([+-]?)(\d+)$/);
      if(m){mtimeOp=m[1]||'=';mtimeDays=parseInt(m[2]);}
    }else if(!a.startsWith('-'))path=a;
  }
  const base=rp(path),results=[];
  function matchSize(full,isDir){
    if(!sizeOp)return true;
    if(isDir){const mb=0.004;if(sizeOp==='+')return mb>sizeMb;if(sizeOp==='-')return mb<sizeMb;return false;}
    const m=FILE_META[full];
    const mb=m?m.size_mb:0.5; // 메타 없으면 기본값
    if(sizeOp==='+')return mb>sizeMb;
    if(sizeOp==='-')return mb<sizeMb;
    return Math.round(mb)===Math.round(sizeMb);
  }
  function matchMtime(full,isDir){
    if(!mtimeOp)return true;
    if(isDir)return false; // 디렉토리는 mtime 필터에서 제외
    const m=FILE_META[full];
    const d=m?m.mtime_days:5;
    if(mtimeOp==='+')return d>mtimeDays;
    if(mtimeOp==='-')return d<mtimeDays;
    return d===mtimeDays;
  }
  function walk(dir){
    (FS[dir]||[]).forEach(e=>{
      const full=(dir==='/'?'':dir)+'/'+e;
      const isDir=!!FS[full];
      // glob 와일드카드(* ?)는 이스케이프 제외, 나머지 regex 메타문자만 이스케이프
      const escaped=name.replace(/[.+^${}()|[\]\\]/g,'\\$&');
      const mName=!name||new RegExp('^'+escaped.replace(/\*/g,'.*').replace(/\?/g,'.')+'$').test(e);
      const mType=!type||(type==='d'&&isDir)||(type==='f'&&!isDir);
      const mSize=matchSize(full,isDir);
      const mMtime=matchMtime(full,isDir);
      if(mName&&mType&&mSize&&mMtime)results.push(full);
      if(isDir)walk(full);
    });
  }
  walk(base);
  if(!results.length)ap('(검색 결과 없음)','mu');
  else results.forEach(r=>ap(r));
}

function doVi(args){
  if(!args[0])return ap('사용법: vi <파일>','wa');
  const target=rp(args[0]),content=FILES[target];
  if(FS[target])return ap(`vi: ${args[0]}: Is a directory`,'er');
  if(!content&&!isFile(target))return ap(`vi: ${args[0]}: No such file or directory`,'er');
  ap(`"${args[0]}" (읽기 전용 — 시뮬레이터)`,'wa');
  ap('─'.repeat(50),'mu');
  if(content)content.split('\n').forEach((l,i)=>ap(`${String(i+1).padStart(3)}  ${l}`));
  else ap('(내용 없음)','mu');
  ap('─'.repeat(50),'mu');
  ap(`"${args[0]}" ${(content||'').split('\n').length}L  (읽기전용)  :q 종료`,'mu');
}

/* ───────────────────────────────────────────
   공유 데이터 헬퍼
─────────────────────────────────────────── */
// Work Process 공유 데이터 (dpmon + ABAPGetWPTable 공유)
const WP_DATA=[
  {no:' 0',ty:'DIA', pid:'28473',st:'Wait', cpu:'0.02',time:'1:25',prg:'',        cl:'000',usr:''},
  {no:' 1',ty:'DIA', pid:'28474',st:'Wait', cpu:'0.12',time:'2:41',prg:'SAPMV45A',cl:'100',usr:'TESTUSER'},
  {no:' 2',ty:'DIA', pid:'28475',st:'Run',  cpu:'1.82',time:'0:04',prg:'RSBDCSUB',cl:'100',usr:'BASISADM'},
  {no:' 3',ty:'DIA', pid:'28476',st:'Wait', cpu:'0.01',time:'1:25',prg:'',        cl:'000',usr:''},
  {no:' 4',ty:'DIA', pid:'28477',st:'PRIV', cpu:'0.44',time:'8:12',prg:'',        cl:'100',usr:'DEVUSER'},
  {no:' 5',ty:'DIA', pid:'28478',st:'Wait', cpu:'0.01',time:'1:25',prg:'',        cl:'000',usr:''},
  {no:' 6',ty:'BTC', pid:'28479',st:'Wait', cpu:'0.00',time:'0:00',prg:'',        cl:'000',usr:''},
  {no:' 7',ty:'BTC', pid:'28480',st:'Run',  cpu:'0.55',time:'0:12',prg:'RSSNAPDL',cl:'000',usr:''},
  {no:' 8',ty:'BTC', pid:'28481',st:'Wait', cpu:'0.00',time:'0:00',prg:'',        cl:'000',usr:''},
  {no:' 9',ty:'SPO', pid:'28482',st:'Wait', cpu:'0.00',time:'0:00',prg:'',        cl:'000',usr:''},
  {no:'10',ty:'SPO', pid:'28483',st:'Wait', cpu:'0.00',time:'0:00',prg:'',        cl:'000',usr:''},
  {no:'11',ty:'UPD', pid:'28484',st:'Wait', cpu:'0.00',time:'0:00',prg:'',        cl:'000',usr:''},
  {no:'12',ty:'UPD2',pid:'28485',st:'Wait', cpu:'0.00',time:'0:00',prg:'',        cl:'000',usr:''},
];

// AP 서버 공통 환경변수 (env 명령어 + sapcontrol GetEnvironment 공유)
const getApEnv=()=>{
  const inst=activeServer==='ap2'?'D01':'D00';
  const nr=activeServer==='ap2'?'01':'00';
  return[
    'SAPSYSTEMNAME=S4H',`SAPSYSTEM=${nr}`,`SAPGLOBALHOST=${HOST}`,
    `DIR_LIBRARY=/usr/sap/S4H/${inst}/exe`,`DIR_CT_RUN=/usr/sap/S4H/${inst}/exe`,
    `DIR_EXECUTABLE=/usr/sap/S4H/${inst}/exe`,`SAPLOCALHOSTFULL=${HOST}.corp.com`,
    'dbs_hdb_dbhost=s4hdb01.corp.com','dbs_hdb_dbname=S4H','dbs_hdb_schema=SAPABAP1',
    `PATH=/usr/sap/S4H/${inst}/exe:/usr/local/bin:/usr/bin:/bin`,
    'SHELL=/bin/bash','LANG=en_US.UTF-8',
  ];
};

