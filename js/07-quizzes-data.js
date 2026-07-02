/* ───────────────────────────────────────────
   QUIZZES — 77개 시나리오 데이터
─────────────────────────────────────────── */
const QUIZZES=[
  // ── A. SAP 기동/정지 ──────────────────────────
  {
    id:'Q001',title:'표준 기동 순서 (DB → AP)',category:'A. SAP 기동/정지',difficulty:'초급',tab:'either',
    description:'SAP 시스템의 올바른 기동 순서를 실습합니다.',
    initialState:{sapOn:false,dbOn:false},
    steps:[
      {instruction:'① DB 서버 탭으로 전환하세요.',expect:{type:'tab',value:'db'},hint:'상단의 "DB Server (s4hdb01)" 탭을 클릭하세요.',haHint:'이중화 모드: 상단의 "DB1 (s4hdb01, Primary)" 탭을 클릭하세요.',feedback:'DB 탭으로 전환되었습니다.'},
      {instruction:'② HANA DB를 기동하세요. (HDB 방식)',expect:{type:'cmd',pattern:/^HDB\s+start$/i},hint:'HDB start 를 입력하세요.',feedback:'HANA 기동 명령이 실행되었습니다.'},
      {instruction:'③ DB 기동 상태를 확인하세요.',expect:{type:'state',key:'dbOn',value:true},hint:'HDB start 실행 후 상태가 자동으로 RUNNING으로 전환됩니다.',feedback:'HANA DB가 RUNNING 상태입니다.'},
      {instruction:'④ AP 서버 탭으로 전환하세요.',expect:{type:'tab',value:'ap'},hint:'상단의 "AP Server (s4happ01)" 탭을 클릭하세요.',haHint:'이중화 모드: 상단의 "AP1 (s4happ01, D00)" 탭을 클릭하세요.',feedback:'AP 탭으로 전환되었습니다.'},
      {instruction:'⑤ SAP 시스템을 기동하세요. (sapcontrol)',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Start(System|Wait)?(\s|$)/i},hint:'sapcontrol -nr 00 -function Start',feedback:'SAP 기동 명령이 실행되었습니다.'},
      {instruction:'⑥ SAP 기동 상태를 확인하세요. (GetProcessList)',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 00 -function GetProcessList',feedback:'프로세스 목록이 조회되었습니다.'},
    ],
    freeform:{description:'SAP 시스템이 완전히 정지된 상태입니다.\nDB 서버(HANA)를 먼저 기동한 후, AP 서버(SAP)를 기동하여 두 시스템 모두 RUNNING 상태로 만드세요.',goalState:{sapOn:true,dbOn:true},hint:'순서: DB 탭 전환 → HDB start → AP 탭 전환 → sapcontrol -nr 00 -function Start'},
  },
  {
    id:'Q002',title:'sapcontrol로 SAP 기동',category:'A. SAP 기동/정지',difficulty:'초급',tab:'ap',
    description:'sapcontrol Start 함수로 SAP를 기동합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'sapcontrol을 사용하여 SAP 인스턴스를 기동하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Start(System|Wait)?\b/i},hint:'sapcontrol -nr 00 -function Start',feedback:'sapcontrol Start 명령이 실행되었습니다.'},
      {instruction:'GetProcessList로 기동 결과를 확인하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 00 -function GetProcessList',feedback:'프로세스 목록이 확인되었습니다.'},
    ],
    freeform:{description:'SAP AP 인스턴스가 정지된 상태입니다.\nsapcontrol 명령어를 사용하여 SAP를 기동하고 GetProcessList로 상태를 확인하세요.',goalState:{sapOn:true},hint:'sapcontrol -nr 00 -function Start'},
  },
  {
    id:'Q003',title:'sapcontrol로 SAP 정지 (StopWait)',category:'A. SAP 기동/정지',difficulty:'초급',tab:'ap',
    description:'sapcontrol StopWait 함수로 SAP 시스템을 정지합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'sapcontrol StopWait으로 SAP 시스템을 정지하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Stop(System|Wait)?(\s|$)/i},hint:'sapcontrol -nr 00 -function StopWait',feedback:'SAP 정지 명령이 실행되었습니다.'},
      {instruction:'정지 상태를 확인하세요. (GetSystemInstanceList)',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetSystemInstanceList/i},hint:'sapcontrol -nr 00 -function GetSystemInstanceList',feedback:'인스턴스 목록이 조회되었습니다.'},
    ],
    freeform:{description:'SAP 시스템을 완전히 정지시키세요.',goalState:{sapOn:false},hint:'sapcontrol -nr 00 -function StopWait'},
  },
  {
    id:'Q004',title:'정상 정지 순서 (SAP → DB)',category:'A. SAP 기동/정지',difficulty:'초급',tab:'either',
    description:'SAP 정지 후 HANA DB를 정지하는 표준 순서를 실습합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'① AP 서버에서 sapcontrol로 SAP를 먼저 정지하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Stop(System|Wait)?(\s|$)/i},hint:'sapcontrol -nr 00 -function StopWait',feedback:'SAP 정지 명령이 실행되었습니다.'},
      {instruction:'② SAP 정지 완료 상태를 확인하세요.',expect:{type:'state',key:'sapOn',value:false},hint:'sapcontrol StopWait 완료 후 자동으로 정지 상태가 됩니다.',feedback:'SAP가 정지되었습니다.'},
      {instruction:'③ DB 서버 탭으로 전환하세요.',expect:{type:'tab',value:'db'},hint:'상단 DB Server 탭을 클릭하세요.',haHint:'이중화 모드: 상단의 "DB1 (s4hdb01, Primary)" 탭을 클릭하세요.',feedback:'DB 탭으로 전환되었습니다.'},
      {instruction:'④ HANA DB를 정지하세요.',expect:{type:'cmd',pattern:/^HDB\s+stop$/i},hint:'HDB stop 을 입력하세요.',feedback:'HANA 정지 명령이 실행되었습니다.'},
    ],
    freeform:{description:'SAP 시스템 전체를 올바른 순서로 정지시키세요.\nAP(SAP)를 먼저 정지한 후, DB(HANA)를 정지해야 합니다.',goalState:{sapOn:false,dbOn:false},hint:'순서: sapcontrol -nr 00 -function StopWait → (AP) → HDB stop (DB 탭)'},
  },
  {
    id:'Q005',title:'sapcontrol로 HANA 정지',category:'A. SAP 기동/정지',difficulty:'초급',tab:'db',
    description:'DB 서버에서 sapcontrol Stop으로 HANA를 정지합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'sapcontrol StopSystem으로 HANA를 정지하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Stop(System|Wait)?\b/i},hint:'sapcontrol -nr 00 -function StopSystem',feedback:'HANA 정지 명령이 실행되었습니다.'},
      {instruction:'HANA 상태를 확인하세요.',expect:{type:'state',key:'dbOn',value:false},hint:'Stop 명령 후 자동으로 정지됩니다.',feedback:'HANA가 정지되었습니다.'},
    ],
    freeform:{description:'HANA DB를 sapcontrol 명령어로 정지하세요.',goalState:{dbOn:false},hint:'sapcontrol -nr 00 -function StopSystem'},
  },
  {
    id:'Q006',title:'DB 없이 SAP 기동 시도',category:'A. SAP 기동/정지',difficulty:'중급',tab:'ap',
    description:'DB가 정지된 상태에서 SAP 기동 시 어떤 오류가 발생하는지 확인합니다.',
    initialState:{sapOn:false,dbOn:false},
    steps:[
      {instruction:'DB가 정지된 상태에서 SAP를 기동 시도하세요. (sapcontrol)',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Start(System|Wait)?(\s|$)/i},hint:'sapcontrol -nr 00 -function Start',feedback:'DB 없이 기동을 시도했습니다. 오류 메시지를 확인하세요.'},
      {instruction:'오류 내용을 확인하고 dev_w0 트레이스를 열어보세요.',expect:{type:'cmd',pattern:/^(cat|vi|less|tail)\s+.*dev_w0/i},hint:'vi /usr/sap/S4H/D00/work/dev_w0',feedback:'Work Process 트레이스가 열렸습니다.'},
    ],
    freeform:{description:'DB가 정지된 상태에서 SAP 기동을 시도하고, 발생하는 오류 메시지를 트레이스 파일에서 확인하세요.',goalState:{},hint:'sapcontrol -nr 00 -function Start → 오류 발생 → vi /usr/sap/S4H/D00/work/dev_w0'},
  },

  // ── B. 프로세스 모니터링 ───────────────────────
  {
    id:'Q007',title:'Work Process 상태 조회 (dpmon)',category:'B. 프로세스 모니터링',difficulty:'초급',tab:'ap',
    description:'dpmon 명령어로 SAP Work Process 상태를 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'dpmon 명령어를 실행하세요.',expect:{type:'cmd',pattern:/^dpmon(\s|$)/i},hint:'dpmon 을 입력하세요.',feedback:'Dispatcher Monitor가 실행되었습니다.'},
      {instruction:'WP 타입별 개수를 확인하세요. (하단 요약 라인 확인)',expect:{type:'cmd',pattern:/^(dpmon|sm50)(\s|$)/i},hint:'dpmon 출력의 마지막 줄 "DIA: 6/6 BTC: 3/3 ..." 를 확인하세요.',feedback:'WP 요약 정보가 확인되었습니다.'},
    ],
    freeform:{description:'dpmon 명령어로 현재 Work Process 상태를 확인하세요.\nDIA, BTC, SPO, UPD, UPD2 타입별 상태를 파악하세요.',goalState:{},hint:'dpmon 또는 sm50'},
  },
  {
    id:'Q008',title:'ABAPGetWPTable로 WP 조회',category:'B. 프로세스 모니터링',difficulty:'초급',tab:'ap',
    description:'sapcontrol ABAPGetWPTable 함수로 Work Process 테이블을 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'sapcontrol ABAPGetWPTable을 실행하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+ABAPGetWPTable/i},hint:'sapcontrol -nr 00 -function ABAPGetWPTable',feedback:'WP 테이블이 조회되었습니다.'},
    ],
    freeform:{description:'sapcontrol ABAPGetWPTable로 Work Process 상세 정보를 조회하세요.',goalState:{},hint:'sapcontrol -nr 00 -function ABAPGetWPTable'},
  },
  {
    id:'Q009',title:'ps로 SAP 프로세스 확인',category:'B. 프로세스 모니터링',difficulty:'초급',tab:'ap',
    description:'ps aux | grep으로 SAP 관련 OS 프로세스를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'ps aux | grep disp 로 Dispatcher 프로세스를 확인하세요.',expect:{type:'cmd',pattern:/ps\s+aux\s*\|\s*grep\s+disp/i},hint:'ps aux | grep disp',feedback:'Dispatcher 프로세스가 확인되었습니다.'},
      {instruction:'ps aux | grep icman 으로 ICM 프로세스를 확인하세요.',expect:{type:'cmd',pattern:/ps\s+aux\s*\|\s*grep\s+icman/i},hint:'ps aux | grep icman',feedback:'ICM 프로세스가 확인되었습니다.'},
    ],
    freeform:{description:'ps 명령어로 SAP 프로세스 (disp+work, icman, gwrd)가 실행 중인지 OS 레벨에서 확인하세요.',goalState:{},hint:'ps aux | grep disp'},
  },
  {
    id:'Q010',title:'Queue 통계 조회',category:'B. 프로세스 모니터링',difficulty:'중급',tab:'ap',
    description:'GetQueueStatistic으로 큐 상태를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'sapcontrol GetQueueStatistic을 실행하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetQueueStatistic/i},hint:'sapcontrol -nr 00 -function GetQueueStatistic',feedback:'큐 통계가 조회되었습니다.'},
    ],
    freeform:{description:'GetQueueStatistic으로 DIA/UPD/BTC/SPO 큐의 현재 상태를 확인하세요.',goalState:{},hint:'sapcontrol -nr 00 -function GetQueueStatistic'},
  },
  {
    id:'Q011',title:'HANA 프로세스 상태 조회 (HDB info)',category:'B. 프로세스 모니터링',difficulty:'초급',tab:'db',
    description:'HDB info 명령어로 HANA 프로세스 상태를 조회합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'HDB info 를 실행하여 HANA 프로세스를 확인하세요.',expect:{type:'cmd',pattern:/^HDB\s+info$/i},hint:'HDB info 를 입력하세요.',feedback:'HANA 프로세스 정보가 표시되었습니다.'},
    ],
    freeform:{description:'HDB info 명령어로 HANA 프로세스 (hdbdaemon, hdbnameserver, hdbindexserver 등)의 PID와 상태를 확인하세요.',goalState:{},hint:'HDB info'},
  },
  {
    id:'Q012',title:'HANA GetProcessList (sapcontrol)',category:'B. 프로세스 모니터링',difficulty:'초급',tab:'db',
    description:'DB 서버에서 sapcontrol GetProcessList로 HANA 서비스 상태를 조회합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'sapcontrol -nr 00 -function GetProcessList 를 실행하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 00 -function GetProcessList',feedback:'HANA 프로세스 목록이 조회되었습니다.'},
    ],
    freeform:{description:'sapcontrol GetProcessList로 HANA 서비스 상태(GREEN/GRAY)를 확인하세요.',goalState:{},hint:'sapcontrol -nr 00 -function GetProcessList'},
  },

  // ── C. 파일/로그 분석 ─────────────────────────
  {
    id:'Q013',title:'Work Process 트레이스 열기',category:'C. 파일/로그 분석',difficulty:'초급',tab:'ap',
    description:'vi 명령어로 dev_w0 트레이스 파일을 열어봅니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'vi로 dev_w0 파일을 열어보세요.',expect:{type:'cmd',pattern:/^(vi|vim|cat|less)\s+.*dev_w0/i},hint:'vi /usr/sap/S4H/D00/work/dev_w0',feedback:'dev_w0 파일이 열렸습니다.'},
    ],
    freeform:{description:'/usr/sap/S4H/D00/work/dev_w0 파일을 열어 Work Process 트레이스 내용을 확인하세요.',goalState:{},hint:'vi /usr/sap/S4H/D00/work/dev_w0'},
  },
  {
    id:'Q014',title:'ERROR 로그 grep 검색',category:'C. 파일/로그 분석',difficulty:'초급',tab:'ap',
    description:'grep으로 dev_w0에서 ERROR 라인만 추출합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'dev_w0에서 ERROR 키워드를 grep으로 검색하세요.',expect:{type:'cmd',pattern:/grep\s+(-[a-z]+\s+)*ERROR\s+.*dev_w0/i},hint:'grep ERROR /usr/sap/S4H/D00/work/dev_w0',feedback:'ERROR 라인이 추출되었습니다.'},
    ],
    freeform:{description:'dev_w0 트레이스 파일에서 ERROR 또는 FAIL 키워드가 포함된 라인만 확인하세요.',goalState:{},hint:'grep ERROR /usr/sap/S4H/D00/work/dev_w0'},
  },
  {
    id:'Q015',title:'tail -f로 실시간 로그 확인',category:'C. 파일/로그 분석',difficulty:'초급',tab:'ap',
    description:'tail -f로 dev_w0 파일을 실시간 추적합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'tail -f로 dev_w0을 실시간 추적하세요. (Ctrl+C로 종료)',expect:{type:'cmd',pattern:/^tail\s+.*-f\s+.*dev_w0|^tail\s+-f\s+.*dev_w0/i},hint:'tail -f /usr/sap/S4H/D00/work/dev_w0',feedback:'tail -f 시뮬레이션이 시작되었습니다. Ctrl+C로 종료하세요.'},
    ],
    freeform:{description:'tail -f 명령으로 dev_w0 파일을 실시간으로 모니터링하세요.',goalState:{},hint:'tail -f /usr/sap/S4H/D00/work/dev_w0'},
  },
  {
    id:'Q016',title:'HANA trace 파일 확인',category:'C. 파일/로그 분석',difficulty:'초급',tab:'db',
    description:'HANA nameserver 트레이스 파일을 조회합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'nameserver 트레이스 파일을 열어보세요.',expect:{type:'cmd',pattern:/^(vi|cat|less|tail)\s+.*nameserver.*\.trc/i},hint:'vi /usr/sap/S4H/HDB00/trace/nameserver_s4hdb01.30001.000.trc',feedback:'nameserver 트레이스가 열렸습니다.'},
    ],
    freeform:{description:'/usr/sap/S4H/HDB00/trace/ 아래 nameserver 트레이스 파일을 열어 내용을 확인하세요.',goalState:{},hint:'ls /usr/sap/S4H/HDB00/trace 후 해당 파일을 cat 또는 vi로 열기'},
  },
  {
    id:'Q017',title:'find로 .trc 파일 검색',category:'C. 파일/로그 분석',difficulty:'초급',tab:'ap',
    description:'find 명령어로 SAP 디렉토리에서 .trc 파일을 검색합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'find로 /usr/sap 아래 .trc 파일을 검색하세요.',expect:{type:'cmd',pattern:/^find\s+.*\.trc/i},hint:'find /usr/sap -name "*.trc"',feedback:'trc 파일 목록이 검색되었습니다.'},
    ],
    freeform:{description:'find 명령어로 /usr/sap 하위의 모든 .trc 파일을 찾으세요.',goalState:{},hint:'find /usr/sap -name "*.trc"'},
  },
  {
    id:'Q018',title:'backup.log 확인',category:'C. 파일/로그 분석',difficulty:'초급',tab:'db',
    description:'HANA 백업 로그 파일을 조회합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'backup.log 파일을 열어 마지막 백업 결과를 확인하세요.',expect:{type:'cmd',pattern:/^(cat|vi|less|tail)\s+.*backup\.log/i},hint:'cat /usr/sap/S4H/HDB00/trace/backup.log',feedback:'백업 로그가 열렸습니다.'},
    ],
    freeform:{description:'backup.log에서 마지막 데이터 백업의 성공/실패 여부를 확인하세요.',goalState:{},hint:'cat /usr/sap/S4H/HDB00/trace/backup.log'},
  },
  {
    id:'Q019',title:'ABAPReadSyslog 시스템 로그 확인',category:'C. 파일/로그 분석',difficulty:'중급',tab:'ap',
    description:'sapcontrol ABAPReadSyslog로 시스템 로그를 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'ABAPReadSyslog를 실행하여 시스템 로그를 확인하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+ABAPReadSyslog/i},hint:'sapcontrol -nr 00 -function ABAPReadSyslog',feedback:'시스템 로그가 조회되었습니다.'},
      {instruction:'grep으로 ERROR 타입만 필터링하세요.',expect:{type:'cmd',pattern:/sapcontrol.+ABAPReadSyslog.*\|.*grep.*E\b|grep.*E.*sapcontrol.*ABAPReadSyslog/i},hint:'sapcontrol -nr 00 -function ABAPReadSyslog | grep "E,"',feedback:'오류 로그가 필터링되었습니다.'},
    ],
    freeform:{description:'ABAPReadSyslog로 시스템 로그를 확인하고, 오류(E 타입) 메시지를 grep으로 추출하세요.',goalState:{},hint:'sapcontrol -nr 00 -function ABAPReadSyslog'},
  },
  {
    id:'Q020',title:'find -size로 대용량 파일 검색',category:'C. 파일/로그 분석',difficulty:'중급',tab:'ap',
    description:'find -size 옵션으로 100MB 이상 파일을 검색합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'find로 /usr/sap/trans에서 100MB 이상 파일을 검색하세요.',expect:{type:'cmd',pattern:/^find\s+.*-size\s+\+\d+[mMgG]/i},hint:'find /usr/sap/trans -size +100M',feedback:'대용량 파일이 검색되었습니다.'},
    ],
    freeform:{description:'find -size 옵션으로 전송 디렉토리(/usr/sap/trans)에서 100MB 이상인 파일을 찾으세요.',goalState:{},hint:'find /usr/sap/trans -size +100M'},
  },
  {
    id:'Q021',title:'find -mtime으로 최근 수정 파일 검색',category:'C. 파일/로그 분석',difficulty:'중급',tab:'ap',
    description:'find -mtime 옵션으로 최근 1일 이내 수정된 파일을 검색합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'최근 1일 이내 수정된 파일을 /usr/sap/S4H/D00/work에서 검색하세요.',expect:{type:'cmd',pattern:/^find\s+.*-mtime\s+-\d+/i},hint:'find /usr/sap/S4H/D00/work -mtime -1',feedback:'최근 수정 파일 목록이 검색되었습니다.'},
    ],
    freeform:{description:'find -mtime 옵션으로 Work 디렉토리에서 최근 1일 이내 변경된 파일을 검색하세요.',goalState:{},hint:'find /usr/sap/S4H/D00/work -mtime -1'},
  },

  // ── D. 프로파일 파라미터 ──────────────────────
  {
    id:'Q022',title:'DEFAULT.PFL 파라미터 확인',category:'D. 프로파일 파라미터',difficulty:'초급',tab:'ap',
    description:'cat으로 DEFAULT.PFL 프로파일 파일을 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'DEFAULT.PFL 파일 내용을 출력하세요.',expect:{type:'cmd',pattern:/^(cat|vi|less)\s+.*DEFAULT\.PFL/i},hint:'cat /usr/sap/S4H/SYS/profile/DEFAULT.PFL',feedback:'DEFAULT.PFL 내용이 표시되었습니다.'},
      {instruction:'rdisp 파라미터만 grep으로 필터링하세요.',expect:{type:'cmd',pattern:/grep\s+.*rdisp.*DEFAULT\.PFL|DEFAULT\.PFL.*\|.*grep.*rdisp/i},hint:'grep rdisp /usr/sap/S4H/SYS/profile/DEFAULT.PFL',feedback:'rdisp 파라미터가 필터링되었습니다.'},
    ],
    freeform:{description:'DEFAULT.PFL 파일을 열어 Work Process 개수(rdisp/wp_no_dia 등)를 확인하세요.',goalState:{},hint:'cat /usr/sap/S4H/SYS/profile/DEFAULT.PFL'},
  },
  {
    id:'Q023',title:'sappfpar로 파라미터 조회',category:'D. 프로파일 파라미터',difficulty:'초급',tab:'ap',
    description:'sappfpar 명령어로 특정 파라미터 값을 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'sappfpar -v rdisp/wp_no_dia로 DIA WP 개수를 조회하세요.',expect:{type:'cmd',pattern:/sappfpar\s+-v\s+rdisp\/wp_no_dia/i},hint:'sappfpar -v rdisp/wp_no_dia pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01',feedback:'DIA WP 개수가 조회되었습니다.'},
    ],
    freeform:{description:'sappfpar 명령어로 DIA Work Process 개수(rdisp/wp_no_dia) 파라미터 값을 조회하세요.',goalState:{},hint:'sappfpar -v rdisp/wp_no_dia pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01'},
  },
  {
    id:'Q024',title:'sappfpar check 전체 파라미터 점검',category:'D. 프로파일 파라미터',difficulty:'초급',tab:'ap',
    description:'sappfpar check로 전체 프로파일 파라미터 점검을 실행합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'sappfpar check pf=<인스턴스 프로파일 경로>를 실행하세요.',expect:{type:'cmd',pattern:/sappfpar\s+check\s+pf=/i},hint:'sappfpar check pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01',feedback:'전체 파라미터 점검이 실행되었습니다.'},
    ],
    freeform:{description:'sappfpar check 명령으로 인스턴스 프로파일의 모든 파라미터를 점검하세요.',goalState:{},hint:'sappfpar check pf=/usr/sap/S4H/SYS/profile/S4H_D00_s4happ01'},
  },
  {
    id:'Q025',title:'sapcontrol ParameterValue 조회',category:'D. 프로파일 파라미터',difficulty:'초급',tab:'ap',
    description:'sapcontrol ParameterValue로 런타임 파라미터를 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'rdisp/wp_no_dia 파라미터 값을 sapcontrol로 조회하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+ParameterValue\s+rdisp\/wp_no_dia/i},hint:'sapcontrol -nr 00 -function ParameterValue rdisp/wp_no_dia',feedback:'파라미터 값이 조회되었습니다.'},
    ],
    freeform:{description:'sapcontrol ParameterValue 함수로 em/initial_size_MB 파라미터 값을 조회하세요.',goalState:{},hint:'sapcontrol -nr 00 -function ParameterValue em/initial_size_MB'},
  },
  {
    id:'Q026',title:'인스턴스 프로파일 확인',category:'D. 프로파일 파라미터',difficulty:'초급',tab:'ap',
    description:'인스턴스 프로파일 파일을 열어 DB 연결 설정을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'인스턴스 프로파일을 열어 dbs/hdb/dbhost 값을 확인하세요.',expect:{type:'cmd',pattern:/^(cat|vi|less)\s+.*S4H_D00_s4happ01/i},hint:'vi /usr/sap/S4H/SYS/profile/S4H_D00_s4happ01',feedback:'인스턴스 프로파일이 열렸습니다.'},
      {instruction:'grep으로 dbs/ 설정만 필터링하세요.',expect:{type:'cmd',pattern:/grep\s+.*dbs.*S4H_D00|S4H_D00.*\|.*grep.*dbs/i},hint:'grep dbs /usr/sap/S4H/SYS/profile/S4H_D00_s4happ01',feedback:'DB 연결 설정이 필터링되었습니다.'},
    ],
    freeform:{description:'인스턴스 프로파일에서 dbs/hdb/dbhost, dbs/hdb/dbname 설정을 확인하세요.',goalState:{},hint:'cat /usr/sap/S4H/SYS/profile/S4H_D00_s4happ01'},
  },

  // ── E. 네트워크/포트 ──────────────────────────
  {
    id:'Q027',title:'SAP 포트 상태 확인 (netstat)',category:'E. 네트워크/포트',difficulty:'초급',tab:'ap',
    description:'netstat -tlnp로 SAP 관련 포트 상태를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'netstat -tlnp 로 포트 목록을 확인하세요.',expect:{type:'cmd',pattern:/^netstat\s+(-[a-z]+\s+)*-[tlnp]*t[lnp]*|^netstat\s+-tlnp/i},hint:'netstat -tlnp',feedback:'포트 목록이 표시되었습니다.'},
      {instruction:'grep으로 3200 포트만 필터링하세요.',expect:{type:'cmd',pattern:/netstat.*\|\s*grep\s+3200|grep\s+3200.*netstat/i},hint:'netstat -tlnp | grep 3200',feedback:'3200 포트(SAP Dispatcher)가 확인되었습니다.'},
    ],
    freeform:{description:'netstat -tlnp로 SAP Dispatcher 포트(3200)와 ICM 포트(8000, 44300)가 Listen 상태인지 확인하세요.',goalState:{},hint:'netstat -tlnp'},
  },
  {
    id:'Q028',title:'lsof로 특정 포트 점유 프로세스 확인',category:'E. 네트워크/포트',difficulty:'초급',tab:'ap',
    description:'lsof -i :3200으로 포트를 점유한 프로세스를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'lsof -i :3200 으로 Dispatcher 포트 점유 프로세스를 확인하세요.',expect:{type:'cmd',pattern:/^lsof\s+-i\s+:3200/i},hint:'lsof -i :3200',feedback:'포트 3200 점유 프로세스가 표시되었습니다.'},
    ],
    freeform:{description:'lsof 명령어로 8000 포트(ICM HTTP)를 점유한 프로세스를 확인하세요.',goalState:{},hint:'lsof -i :8000'},
  },
  {
    id:'Q029',title:'lgtst 메시지 서버 연결 확인',category:'E. 네트워크/포트',difficulty:'중급',tab:'ap',
    description:'lgtst로 SAP 메시지 서버 연결을 테스트합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'lgtst 명령어로 메시지 서버 연결을 테스트하세요.',expect:{type:'cmd',pattern:/^lgtst(\s|$)/i},hint:'lgtst /H/s4happ01 /S/sapmsS4H',feedback:'메시지 서버 연결이 확인되었습니다.'},
    ],
    freeform:{description:'lgtst 명령어로 Message Server(sapmsS4H)에 연결이 가능한지 테스트하세요.',goalState:{},hint:'lgtst /H/s4happ01 /S/sapmsS4H'},
  },
  {
    id:'Q030',title:'ping으로 호스트 연결 확인',category:'E. 네트워크/포트',difficulty:'초급',tab:'ap',
    description:'ping 명령어로 DB 서버와의 네트워크 연결을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'ping으로 DB 서버(s4hdb01)에 연결 가능한지 확인하세요.',expect:{type:'cmd',pattern:/^ping\s+(-[cC]\s*\d+\s+)?s4hdb01/i},hint:'ping -c 4 s4hdb01',feedback:'s4hdb01로 ping이 전송되었습니다.'},
    ],
    freeform:{description:'ping 명령어로 s4hdb01 서버와의 네트워크 연결이 정상인지 확인하세요.',goalState:{},hint:'ping -c 4 s4hdb01'},
  },
  {
    id:'Q031',title:'R3trans DB 연결 테스트',category:'E. 네트워크/포트',difficulty:'초급',tab:'ap',
    description:'R3trans -d로 SAP에서 DB로의 연결을 테스트합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'R3trans -d 를 실행하여 DB 연결을 테스트하세요.',expect:{type:'cmd',pattern:/^R3trans\s+-d$/i},hint:'R3trans -d',feedback:'R3trans DB 연결 테스트가 실행되었습니다.'},
    ],
    freeform:{description:'R3trans -d로 AP 서버에서 HANA DB(s4hdb01.corp.com)로의 연결을 테스트하세요.',goalState:{},hint:'R3trans -d'},
  },
  {
    id:'Q032',title:'HANA 포트 확인 (netstat)',category:'E. 네트워크/포트',difficulty:'초급',tab:'db',
    description:'DB 서버에서 netstat으로 HANA 포트를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'netstat -tlnp | grep 30 으로 HANA 포트를 확인하세요.',expect:{type:'cmd',pattern:/netstat.*\|\s*grep\s+30|netstat.*30/i},hint:'netstat -tlnp | grep 30',feedback:'HANA 관련 포트(30001, 30003 등)가 확인되었습니다.'},
    ],
    freeform:{description:'netstat으로 HANA SQL 포트(30015)와 System DB 포트(30013)가 Listen 중인지 확인하세요.',goalState:{},hint:'netstat -tlnp | grep 30'},
  },

  // ── F. HANA DB 관리 ───────────────────────────
  {
    id:'Q033',title:'M_SERVICES 조회',category:'F. HANA DB 관리',difficulty:'초급',tab:'db',
    description:'hdbsql로 M_SERVICES 뷰를 조회하여 HANA 서비스 상태를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'hdbsql로 M_SERVICES를 조회하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_SERVICES/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SERVICES"',feedback:'HANA 서비스 목록이 조회되었습니다.'},
    ],
    freeform:{description:'hdbsql M_SERVICES 뷰에서 HANA 서비스 목록과 상태를 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SERVICES"'},
  },
  {
    id:'Q034',title:'M_CONNECTIONS 조회',category:'F. HANA DB 관리',difficulty:'초급',tab:'db',
    description:'hdbsql M_CONNECTIONS로 현재 DB 연결 목록을 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'hdbsql로 M_CONNECTIONS를 조회하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_CONNECTIONS/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_CONNECTIONS"',feedback:'DB 연결 목록이 조회되었습니다.'},
    ],
    freeform:{description:'M_CONNECTIONS 뷰에서 SAPABAP1 사용자의 DB 연결 상태를 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_CONNECTIONS"'},
  },
  {
    id:'Q035',title:'M_SYSTEM_OVERVIEW 조회',category:'F. HANA DB 관리',difficulty:'초급',tab:'db',
    description:'hdbsql M_SYSTEM_OVERVIEW로 시스템 전반 상태를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'M_SYSTEM_OVERVIEW를 hdbsql로 조회하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_SYSTEM_OVERVIEW/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SYSTEM_OVERVIEW"',feedback:'시스템 개요가 조회되었습니다.'},
    ],
    freeform:{description:'M_SYSTEM_OVERVIEW에서 HANA 버전, 메모리 사용량, 알람 개수를 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SYSTEM_OVERVIEW"'},
  },
  {
    id:'Q036',title:'hdbuserstore 키 관리',category:'F. HANA DB 관리',difficulty:'중급',tab:'db',
    description:'hdbuserstore로 사용자 키를 조회하고 신규 키를 추가합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'hdbuserstore list로 현재 저장된 키 목록을 확인하세요.',expect:{type:'cmd',pattern:/^hdbuserstore\s+list$/i},hint:'hdbuserstore list',feedback:'저장된 키 목록이 표시되었습니다.'},
      {instruction:'BKPKEY 키 상세 정보를 조회하세요.',expect:{type:'cmd',pattern:/^hdbuserstore\s+get\s+BKPKEY$/i},hint:'hdbuserstore get BKPKEY',feedback:'BKPKEY 정보가 조회되었습니다.'},
      {instruction:'MONKEY라는 새 키를 추가하세요. (HOST:PORT USER PW 임의 지정)',expect:{type:'cmd',pattern:/^hdbuserstore\s+set\s+MONKEY\s+/i},hint:'hdbuserstore set MONKEY s4hdb01:30015 MONUSER MonP@ss1',feedback:'MONKEY 키가 추가되었습니다.'},
    ],
    freeform:{description:'hdbuserstore로 현재 키 목록을 확인하고, 신규 모니터링 키(MONKEY)를 추가하세요.',goalState:{},hint:'hdbuserstore list → hdbuserstore set MONKEY ...'},
  },
  {
    id:'Q037',title:'HANA 버전 확인',category:'F. HANA DB 관리',difficulty:'초급',tab:'db',
    description:'HDB version으로 HANA 버전 정보를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'HDB version 을 실행하세요.',expect:{type:'cmd',pattern:/^HDB\s+version$/i},hint:'HDB version',feedback:'HANA 버전 정보가 표시되었습니다.'},
    ],
    freeform:{description:'HDB version 명령어로 현재 HANA 버전과 빌드 정보를 확인하세요.',goalState:{},hint:'HDB version'},
  },
  {
    id:'Q038',title:'M_DATABASES 조회',category:'F. HANA DB 관리',difficulty:'초급',tab:'db',
    description:'hdbsql M_DATABASES로 데이터베이스 목록을 조회합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'M_DATABASES를 조회하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_DATABASES/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DATABASES"',feedback:'데이터베이스 목록이 조회되었습니다.'},
    ],
    freeform:{description:'M_DATABASES에서 SYSTEMDB와 S4H 테넌트 DB의 상태를 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DATABASES"'},
  },

  // ── G. HANA 백업 ──────────────────────────────
  {
    id:'Q039',title:'M_BACKUP_CATALOG 조회',category:'G. HANA 백업',difficulty:'초급',tab:'db',
    description:'hdbsql M_BACKUP_CATALOG로 최근 백업 이력을 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'M_BACKUP_CATALOG를 조회하여 백업 이력을 확인하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_BACKUP_CATALOG/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_BACKUP_CATALOG"',feedback:'백업 카탈로그가 조회되었습니다.'},
    ],
    freeform:{description:'M_BACKUP_CATALOG에서 마지막 데이터 백업 날짜와 성공 여부를 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_BACKUP_CATALOG"'},
  },
  {
    id:'Q040',title:'hdbbackupdiag 백업 진단',category:'G. HANA 백업',difficulty:'초급',tab:'db',
    description:'hdbbackupdiag --check로 백업 설정 전반을 진단합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'hdbbackupdiag --check 를 실행하세요.',expect:{type:'cmd',pattern:/^hdbbackupdiag\s+--check$/i},hint:'hdbbackupdiag --check',feedback:'백업 진단이 실행되었습니다.'},
    ],
    freeform:{description:'hdbbackupdiag --check로 마지막 데이터 백업과 로그 백업 상태를 진단하세요.',goalState:{},hint:'hdbbackupdiag --check'},
  },
  {
    id:'Q041',title:'백업 디렉토리 파일 확인',category:'G. HANA 백업',difficulty:'초급',tab:'db',
    description:'ls로 /hana/backup 디렉토리 구조를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'ls /hana/backup/data 로 데이터 백업 파일을 확인하세요.',expect:{type:'cmd',pattern:/^ls\s+(-[la]+\s+)?.*hana\/backup\/data/i},hint:'ls -l /hana/backup/data',feedback:'데이터 백업 파일 목록이 확인되었습니다.'},
      {instruction:'backup.log 파일을 열어 마지막 백업을 확인하세요.',expect:{type:'cmd',pattern:/^(cat|vi|tail)\s+.*backup\.log/i},hint:'cat /usr/sap/S4H/HDB00/trace/backup.log',feedback:'백업 로그가 열렸습니다.'},
    ],
    freeform:{description:'/hana/backup 디렉토리 구조를 확인하고, 최근 완료된 백업 파일을 식별하세요.',goalState:{},hint:'ls /hana/backup/data → cat backup.log'},
  },
  {
    id:'Q042',title:'M_DISK_USAGE로 볼륨 사용량 확인',category:'G. HANA 백업',difficulty:'중급',tab:'db',
    description:'M_DISK_USAGE 뷰로 데이터/로그 볼륨 사용량을 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'M_DISK_USAGE를 조회하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_DISK_USAGE/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DISK_USAGE"',feedback:'디스크 사용량이 조회되었습니다.'},
    ],
    freeform:{description:'M_DISK_USAGE로 DATA, LOG, TRACE 볼륨 사용량을 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DISK_USAGE"'},
  },

  // ── H. 디스크/스토리지 ────────────────────────
  {
    id:'Q043',title:'df로 파일시스템 사용량 확인',category:'H. 디스크/스토리지',difficulty:'초급',tab:'ap',
    description:'df -h로 AP 서버 파일시스템 사용량을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'df -h 를 실행하여 파일시스템 사용량을 확인하세요.',expect:{type:'cmd',pattern:/^df(\s+-[hH])?\s*$/i},hint:'df -h',feedback:'파일시스템 사용량이 표시되었습니다.'},
      {instruction:'/usr/sap 파티션의 사용률을 확인하세요. (grep 활용)',expect:{type:'cmd',pattern:/df.*\|\s*grep\s+sap|grep.*sap.*df/i},hint:'df -h | grep sap',feedback:'/usr/sap 사용률이 필터링되었습니다.'},
    ],
    freeform:{description:'df -h로 AP 서버의 각 파티션 사용률을 확인하고, /usr/sap가 어느 정도 사용 중인지 파악하세요.',goalState:{},hint:'df -h 또는 df -h | grep sap'},
  },
  {
    id:'Q044',title:'du로 디렉토리 크기 확인',category:'H. 디스크/스토리지',difficulty:'중급',tab:'ap',
    description:'du 명령어로 /usr/sap/trans 디렉토리 크기를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'du -sh /usr/sap/trans 로 전송 디렉토리 총 크기를 확인하세요.',expect:{type:'cmd',pattern:/^du\s+(-[sh]+\s+)?.*trans/i},hint:'du -sh /usr/sap/trans',feedback:'전송 디렉토리 크기가 표시되었습니다.'},
      {instruction:'du -h --max-depth=1 /usr/sap/trans 로 하위 디렉토리별 크기를 확인하세요.',expect:{type:'cmd',pattern:/^du\s+.*--max-depth.*trans|^du\s+.*trans.*--max-depth/i},hint:'du -h --max-depth=1 /usr/sap/trans',feedback:'하위 디렉토리별 크기가 표시되었습니다.'},
    ],
    freeform:{description:'du 명령어로 /usr/sap/trans 전송 디렉토리와 그 하위 디렉토리(data, cofiles, log)별 크기를 확인하세요.',goalState:{},hint:'du -sh /usr/sap/trans → du -h --max-depth=1 /usr/sap/trans'},
  },
  {
    id:'Q045',title:'HANA 볼륨 사용량 (df)',category:'H. 디스크/스토리지',difficulty:'초급',tab:'db',
    description:'DB 서버에서 df -h로 HANA 볼륨 사용량을 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'df -h | grep hana 로 HANA 볼륨 사용량을 확인하세요.',expect:{type:'cmd',pattern:/df.*\|\s*grep\s+hana|df\s+-h\s*$/i},hint:'df -h | grep hana',feedback:'HANA 볼륨 사용량이 확인되었습니다.'},
    ],
    freeform:{description:'df -h로 /hana/data, /hana/log, /hana/shared 볼륨의 사용률을 확인하세요.',goalState:{},hint:'df -h | grep hana'},
  },
  {
    id:'Q046',title:'M_VOLUME_SIZES 볼륨 조회',category:'H. 디스크/스토리지',difficulty:'중급',tab:'db',
    description:'hdbsql M_VOLUME_SIZES로 HANA 내부 볼륨 크기를 조회합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'M_VOLUME_SIZES를 조회하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_VOLUME_SIZES/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_VOLUME_SIZES"',feedback:'볼륨 크기 정보가 조회되었습니다.'},
    ],
    freeform:{description:'M_VOLUME_SIZES 뷰에서 DATA 볼륨의 총 크기(TOTAL_SIZE)와 사용량(USED_SIZE)을 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_VOLUME_SIZES"'},
  },
  {
    id:'Q047',title:'전송 디렉토리 파일 목록 확인',category:'H. 디스크/스토리지',difficulty:'초급',tab:'ap',
    description:'ls로 전송 data/cofiles 디렉토리 내용을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'ls /usr/sap/trans/data 로 데이터 파일 목록을 확인하세요.',expect:{type:'cmd',pattern:/^ls\s+.*trans\/data/i},hint:'ls /usr/sap/trans/data',feedback:'전송 데이터 파일 목록이 확인되었습니다.'},
      {instruction:'ls /usr/sap/trans/cofiles 로 코파일 목록을 확인하세요.',expect:{type:'cmd',pattern:/^ls\s+.*trans\/cofiles/i},hint:'ls /usr/sap/trans/cofiles',feedback:'코파일 목록이 확인되었습니다.'},
    ],
    freeform:{description:'/usr/sap/trans/data와 /usr/sap/trans/cofiles 디렉토리의 파일 목록을 확인하세요.',goalState:{},hint:'ls /usr/sap/trans/data'},
  },

  // ── I. 메모리/성능 ────────────────────────────
  {
    id:'Q048',title:'free -m으로 메모리 사용량 확인',category:'I. 메모리/성능',difficulty:'초급',tab:'ap',
    description:'free -m으로 AP 서버 메모리 사용량을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'free -m 을 실행하세요.',expect:{type:'cmd',pattern:/^free(\s+-[mMgGbBkK])?$/i},hint:'free -m',feedback:'메모리 사용량이 표시되었습니다.'},
    ],
    freeform:{description:'free -m으로 AP 서버의 총 메모리, 사용 중인 메모리, available 메모리를 확인하세요.',goalState:{},hint:'free -m'},
  },
  {
    id:'Q049',title:'top으로 CPU/메모리 사용 프로세스 확인',category:'I. 메모리/성능',difficulty:'초급',tab:'ap',
    description:'top 명령어로 CPU와 메모리를 많이 사용하는 프로세스를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'top 명령어를 실행하여 프로세스 자원 사용량을 확인하세요.',expect:{type:'cmd',pattern:/^top$/i},hint:'top',feedback:'시스템 자원 현황이 표시되었습니다.'},
    ],
    freeform:{description:'top 명령어로 CPU 사용률이 가장 높은 프로세스를 확인하세요.',goalState:{},hint:'top'},
  },
  {
    id:'Q050',title:'vmstat으로 시스템 통계 확인',category:'I. 메모리/성능',difficulty:'중급',tab:'ap',
    description:'vmstat으로 CPU, 메모리, I/O 통계를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'vmstat 을 실행하세요.',expect:{type:'cmd',pattern:/^vmstat(\s|$)/i},hint:'vmstat',feedback:'시스템 통계가 표시되었습니다.'},
    ],
    freeform:{description:'vmstat으로 swap in/out(si, so) 값을 확인하세요. 0이 정상입니다.',goalState:{},hint:'vmstat'},
  },
  {
    id:'Q051',title:'saposcol로 OS 자원 수집 확인',category:'I. 메모리/성능',difficulty:'중급',tab:'ap',
    description:'saposcol 명령어로 OS Collector 상태를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'saposcol -s 로 OS Collector 상태를 확인하세요.',expect:{type:'cmd',pattern:/^saposcol\s+-s$/i},hint:'saposcol -s',feedback:'OS Collector 상태가 표시되었습니다.'},
      {instruction:'saposcol -d 로 OS 자원 상세 정보를 확인하세요.',expect:{type:'cmd',pattern:/^saposcol\s+-d$/i},hint:'saposcol -d',feedback:'OS 자원 상세 정보가 표시되었습니다.'},
    ],
    freeform:{description:'saposcol 명령어로 CPU, 메모리, 디스크 사용 현황을 OS Collector에서 확인하세요.',goalState:{},hint:'saposcol -s → saposcol -d'},
  },
  {
    id:'Q052',title:'GetAlertTree로 SAP 알람 확인',category:'I. 메모리/성능',difficulty:'중급',tab:'ap',
    description:'sapcontrol GetAlertTree로 현재 SAP 알람 상태를 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'GetAlertTree를 실행하여 현재 알람을 확인하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetAlertTree/i},hint:'sapcontrol -nr 00 -function GetAlertTree',feedback:'알람 트리가 조회되었습니다.'},
    ],
    freeform:{description:'sapcontrol GetAlertTree로 CPU, 메모리, Dispatcher WP 현황 알람을 확인하세요.',goalState:{},hint:'sapcontrol -nr 00 -function GetAlertTree'},
  },

  // ── J. 긴급대응 — 디스크풀 ───────────────────
  {
    id:'Q053',title:'디스크 풀 상태 진단',category:'J. 긴급대응 - 디스크풀',difficulty:'고급',tab:'ap',
    description:'/usr/sap 파티션이 95% 이상인 상황을 시뮬레이션하여 진단 절차를 실습합니다.',
    initialState:{sapOn:true,dbOn:true,diskFull:true},
    steps:[
      {instruction:'df -h 로 디스크 사용량을 확인하세요. (/usr/sap 95% 주목)',expect:{type:'cmd',pattern:/^df(\s+-h)?$/i},hint:'df -h — /usr/sap 파티션이 95%입니다.',feedback:'디스크 풀 상태가 확인되었습니다.'},
      {instruction:'find로 /usr/sap 아래 100MB 이상 파일을 검색하세요.',expect:{type:'cmd',pattern:/^find\s+.*-size\s+\+\d+[mMgG]/i},hint:'find /usr/sap -size +100M',feedback:'대용량 파일이 검색되었습니다.'},
      {instruction:'du -h --max-depth=1 /usr/sap/trans 로 전송 디렉토리 크기를 확인하세요.',expect:{type:'cmd',pattern:/^du\s+.*--max-depth.*trans|^du\s+.*trans.*--max-depth/i},hint:'du -h --max-depth=1 /usr/sap/trans',feedback:'전송 디렉토리 크기가 확인되었습니다.'},
    ],
    freeform:{description:'[디스크 풀 시뮬레이션]\n/usr/sap 파티션이 95% 이상입니다.\n1. df -h로 현황 파악\n2. find로 대용량 파일 탐색\n3. du로 디렉토리별 크기 확인',goalState:{},hint:'df -h → find /usr/sap -size +100M → du -h --max-depth=1 /usr/sap/trans'},
  },
  {
    id:'Q054',title:'HANA 데이터 볼륨 풀 진단',category:'J. 긴급대응 - 디스크풀',difficulty:'고급',tab:'db',
    description:'/hana/data 볼륨이 96% 사용된 상황을 시뮬레이션합니다.',
    initialState:{sapOn:false,dbOn:true,diskFull:true},
    steps:[
      {instruction:'df -h | grep hana 로 HANA 볼륨 사용률을 확인하세요.',expect:{type:'cmd',pattern:/df.*grep\s+hana|^df\s+-h\s*$/i},hint:'df -h | grep hana — /hana/data가 96%입니다.',feedback:'HANA 볼륨 상태가 확인되었습니다.'},
      {instruction:'M_DISK_USAGE를 조회하여 HANA 내부 사용량을 확인하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_DISK_USAGE/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DISK_USAGE"',feedback:'HANA 디스크 사용량이 조회되었습니다.'},
      {instruction:'du -sh /hana/backup 로 백업 디렉토리 크기를 확인하세요.',expect:{type:'cmd',pattern:/^du\s+.*hana\/backup/i},hint:'du -sh /hana/backup',feedback:'백업 디렉토리 크기가 확인되었습니다.'},
    ],
    freeform:{description:'[디스크 풀 시뮬레이션]\n/hana/data 볼륨이 96% 가득 찼습니다.\ndf, M_DISK_USAGE, du를 활용하여 원인을 진단하세요.',goalState:{},hint:'df -h → M_DISK_USAGE → du -sh /hana/backup'},
  },

  // ── K. 긴급대응 — 메모리 ─────────────────────
  {
    id:'Q055',title:'메모리 부족 진단 (AP)',category:'K. 긴급대응 - 메모리',difficulty:'고급',tab:'ap',
    description:'AP 서버 메모리 부족(available ~94MB) 상황을 진단합니다.',
    initialState:{sapOn:true,dbOn:true,memLow:true},
    steps:[
      {instruction:'free -m 으로 메모리 상태를 확인하세요. (available 값 주목)',expect:{type:'cmd',pattern:/^free(\s+-[mMgGbBkK])?$/i},hint:'free -m — available이 매우 낮습니다.',feedback:'메모리 부족 상태가 확인되었습니다.'},
      {instruction:'top 으로 메모리를 많이 사용하는 프로세스를 확인하세요.',expect:{type:'cmd',pattern:/^top$/i},hint:'top — %MEM 열을 확인하세요.',feedback:'메모리 사용 프로세스가 확인되었습니다.'},
      {instruction:'vmstat 으로 swap 사용 현황을 확인하세요. (si, so 열)',expect:{type:'cmd',pattern:/^vmstat(\s|$)/i},hint:'vmstat — si, so 값이 높으면 swap 활발',feedback:'Swap 활용 현황이 확인되었습니다.'},
    ],
    freeform:{description:'[메모리 부족 시뮬레이션]\nAP 서버 available 메모리가 94MB로 매우 낮습니다.\nfree, top, vmstat으로 원인을 진단하세요.',goalState:{},hint:'free -m → top → vmstat'},
  },
  {
    id:'Q056',title:'HANA 메모리 부족 진단',category:'K. 긴급대응 - 메모리',difficulty:'고급',tab:'db',
    description:'HANA 서버 메모리 부족(available ~87MB, swap 활발) 상황을 진단합니다.',
    initialState:{sapOn:false,dbOn:true,memLow:true},
    steps:[
      {instruction:'free -m 으로 HANA 서버 메모리 상태를 확인하세요.',expect:{type:'cmd',pattern:/^free(\s+-[mMgGbBkK])?$/i},hint:'free -m',feedback:'메모리 상태가 확인되었습니다.'},
      {instruction:'M_SYSTEM_OVERVIEW로 HANA 내부 메모리 사용량을 확인하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_SYSTEM_OVERVIEW/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_SYSTEM_OVERVIEW"',feedback:'HANA 메모리 사용량이 조회되었습니다.'},
      {instruction:'top 으로 hdbindexserver의 메모리 사용률을 확인하세요.',expect:{type:'cmd',pattern:/^top$/i},hint:'top — hdbindexserver의 %MEM를 확인하세요.',feedback:'hdbindexserver 메모리 사용량이 확인되었습니다.'},
    ],
    freeform:{description:'[메모리 부족 시뮬레이션]\nHANA 서버가 메모리를 거의 다 사용했습니다.\nfree, M_SYSTEM_OVERVIEW, top으로 진단하세요.',goalState:{},hint:'free -m → M_SYSTEM_OVERVIEW → top'},
  },

  // ── L. 보안/감사 ──────────────────────────────
  {
    id:'Q057',title:'보안 감사 로그 조회',category:'L. 보안/감사',difficulty:'중급',tab:'ap',
    description:'SAP 보안 감사 로그 파일을 분석합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'감사 로그 파일 목록을 확인하세요.',expect:{type:'cmd',pattern:/^ls\s+.*var\/log\/sap/i},hint:'ls /var/log/sap',feedback:'감사 로그 파일 목록이 표시되었습니다.'},
      {instruction:'오늘 날짜 감사 로그를 열어보세요.',expect:{type:'cmd',pattern:/^(cat|vi|less|tail)\s+.*sec_audit/i},hint:'cat /var/log/sap/sec_audit_20260508',feedback:'감사 로그가 열렸습니다.'},
      {instruction:'grep으로 로그인 실패(FAIL 또는 W/E 타입) 항목을 검색하세요.',expect:{type:'cmd',pattern:/grep\s+.*(FAIL|W\||E\|).*sec_audit|sec_audit.*\|.*grep.*(FAIL|W\||E\|)/i},hint:'grep "E|" /var/log/sap/sec_audit_20260508',feedback:'실패/오류 감사 항목이 필터링되었습니다.'},
    ],
    freeform:{description:'/var/log/sap/ 아래 보안 감사 로그에서 로그인 실패 및 권한 오류 이벤트를 찾으세요.',goalState:{},hint:'ls /var/log/sap → cat sec_audit_20260508 → grep "E|"'},
  },
  {
    id:'Q058',title:'시스템 로그 오류 분석',category:'L. 보안/감사',difficulty:'중급',tab:'ap',
    description:'/var/log/messages에서 오류 이벤트를 분석합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'/var/log/messages에서 오류 관련 라인을 grep으로 추출하세요.',expect:{type:'cmd',pattern:/grep\s+.*(error|fail|dead).*messages|grep\s+-i\s+.*(error|fail).*messages/i},hint:'grep -i error /var/log/messages',feedback:'오류 라인이 추출되었습니다.'},
    ],
    freeform:{description:'/var/log/messages에서 SAP 관련 DEAD/error 이벤트를 분석하세요.',goalState:{},hint:'grep -i error /var/log/messages'},
  },

  // ── M. 서비스 관리 ────────────────────────────
  {
    id:'Q059',title:'systemctl로 SAP 서비스 상태 확인',category:'M. 서비스 관리',difficulty:'중급',tab:'ap',
    description:'systemctl status로 SAP 서비스 상태를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'systemctl status sapinit 을 실행하세요.',expect:{type:'cmd',pattern:/^systemctl\s+status\s+sapinit$/i},hint:'systemctl status sapinit',feedback:'sapinit 서비스 상태가 표시되었습니다.'},
    ],
    freeform:{description:'systemctl status sapinit으로 SAP 서비스가 active 상태인지 확인하세요.',goalState:{},hint:'systemctl status sapinit'},
  },
  {
    id:'Q060',title:'sapcontrol RestartService',category:'M. 서비스 관리',difficulty:'중급',tab:'ap',
    description:'sapcontrol RestartService로 sapstartsrv를 재시작합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'RestartService를 실행하여 sapstartsrv를 재시작하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+RestartService/i},hint:'sapcontrol -nr 00 -function RestartService',feedback:'sapstartsrv가 재시작되었습니다.'},
    ],
    freeform:{description:'sapcontrol RestartService로 sapstartsrv 서비스를 재시작하세요.',goalState:{},hint:'sapcontrol -nr 00 -function RestartService'},
  },
  {
    id:'Q061',title:'init.d 스크립트 확인',category:'M. 서비스 관리',difficulty:'중급',tab:'ap',
    description:'/etc/init.d/sapinit 스크립트를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'/etc/init.d/ 디렉토리 내용을 확인하세요.',expect:{type:'cmd',pattern:/^ls\s+.*etc\/init\.d/i},hint:'ls /etc/init.d',feedback:'init.d 파일 목록이 표시되었습니다.'},
      {instruction:'sapinit 스크립트를 열어 기동/정지 로직을 확인하세요.',expect:{type:'cmd',pattern:/^(cat|vi|less)\s+.*init\.d\/sapinit/i},hint:'cat /etc/init.d/sapinit',feedback:'sapinit 스크립트가 열렸습니다.'},
    ],
    freeform:{description:'/etc/init.d/sapinit 스크립트를 열어 SAP 기동/정지 명령을 확인하세요.',goalState:{},hint:'cat /etc/init.d/sapinit'},
  },
  {
    id:'Q062',title:'systemctl HANA 서비스 상태 확인',category:'M. 서비스 관리',difficulty:'중급',tab:'db',
    description:'DB 서버에서 systemctl로 HANA 서비스 상태를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'systemctl status hdbdaemon 을 실행하세요.',expect:{type:'cmd',pattern:/^systemctl\s+status\s+hdbdaemon$/i},hint:'systemctl status hdbdaemon',feedback:'hdbdaemon 서비스 상태가 표시되었습니다.'},
    ],
    freeform:{description:'systemctl status hdbdaemon으로 HANA 서비스가 active 상태인지 확인하세요.',goalState:{},hint:'systemctl status hdbdaemon'},
  },

  // ── N. 환경 설정 ──────────────────────────────
  {
    id:'Q063',title:'SAP 환경변수 확인',category:'N. 환경 설정',difficulty:'초급',tab:'ap',
    description:'env 명령어로 SAP 관련 환경변수를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'env | grep SAP 로 SAP 환경변수를 확인하세요.',expect:{type:'cmd',pattern:/env.*\|\s*grep\s+SAP/i},hint:'env | grep SAP',feedback:'SAP 환경변수가 표시되었습니다.'},
    ],
    freeform:{description:'env | grep SAP으로 SAPSYSTEMNAME, SAPSYSTEM, SAPGLOBALHOST 환경변수를 확인하세요.',goalState:{},hint:'env | grep SAP'},
  },
  {
    id:'Q064',title:'.bash_profile 환경변수 설정 확인',category:'N. 환경 설정',difficulty:'초급',tab:'ap',
    description:'s4hadm 사용자의 .bash_profile을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'.bash_profile 파일을 열어보세요.',expect:{type:'cmd',pattern:/^(cat|vi|less)\s+.*\.bash_profile/i},hint:'cat /home/s4hadm/.bash_profile',feedback:'.bash_profile이 열렸습니다.'},
    ],
    freeform:{description:'/home/s4hadm/.bash_profile에서 SAP 환경변수 설정 내용을 확인하세요.',goalState:{},hint:'cat /home/s4hadm/.bash_profile'},
  },
  {
    id:'Q065',title:'HANA 환경변수 확인',category:'N. 환경 설정',difficulty:'초급',tab:'db',
    description:'DB 서버에서 env | grep HDB로 HANA 환경변수를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'env | grep HDB 로 HANA 환경변수를 확인하세요.',expect:{type:'cmd',pattern:/env.*\|\s*grep\s+HDB/i},hint:'env | grep HDB',feedback:'HANA 환경변수가 표시되었습니다.'},
    ],
    freeform:{description:'env | grep HDB로 HDB_NR, DIR_INSTANCE, SECUDIR 환경변수를 확인하세요.',goalState:{},hint:'env | grep HDB'},
  },
  {
    id:'Q066',title:'GetEnvironment로 SAP 런타임 환경 확인',category:'N. 환경 설정',difficulty:'중급',tab:'ap',
    description:'sapcontrol GetEnvironment로 SAP 프로세스 환경변수를 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'sapcontrol GetEnvironment 를 실행하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetEnvironment/i},hint:'sapcontrol -nr 00 -function GetEnvironment',feedback:'SAP 환경변수가 조회되었습니다.'},
      {instruction:'dbs/hdb 관련 설정만 grep으로 필터링하세요.',expect:{type:'cmd',pattern:/sapcontrol.*GetEnvironment.*\|\s*grep\s+dbs|grep.*dbs.*sapcontrol.*GetEnvironment/i},hint:'sapcontrol -nr 00 -function GetEnvironment | grep dbs',feedback:'DB 연결 환경변수가 필터링되었습니다.'},
    ],
    freeform:{description:'GetEnvironment로 SAP의 DB 연결 설정(dbs/hdb/dbhost 등)을 확인하세요.',goalState:{},hint:'sapcontrol -nr 00 -function GetEnvironment | grep dbs'},
  },

  // ── O. 시스템 정보 ────────────────────────────
  {
    id:'Q067',title:'OS/커널 정보 확인',category:'O. 시스템 정보',difficulty:'초급',tab:'ap',
    description:'uname -a로 OS와 커널 버전을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'uname -a 를 실행하여 OS 커널 정보를 확인하세요.',expect:{type:'cmd',pattern:/^uname\s+-a$/i},hint:'uname -a',feedback:'OS 커널 정보가 표시되었습니다.'},
    ],
    freeform:{description:'uname -a로 현재 OS 버전과 커널 버전을 확인하세요.',goalState:{},hint:'uname -a'},
  },
  {
    id:'Q068',title:'disp+work 버전 확인',category:'O. 시스템 정보',difficulty:'초급',tab:'ap',
    description:'disp+work -V로 SAP 커널 버전을 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'disp+work -V 를 실행하여 SAP 커널 버전을 확인하세요.',expect:{type:'cmd',pattern:/^disp\+work\s+-V$/i},hint:'disp+work -V',feedback:'SAP 커널 버전 정보가 표시되었습니다.'},
    ],
    freeform:{description:'disp+work -V로 SAP 커널 버전(SAP_BASIS), 빌드 일시, 플랫폼을 확인하세요.',goalState:{},hint:'disp+work -V'},
  },
  {
    id:'Q069',title:'M_LICENSE 라이선스 정보 확인',category:'O. 시스템 정보',difficulty:'중급',tab:'db',
    description:'hdbsql M_LICENSE로 HANA 라이선스 정보를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'M_LICENSE를 조회하여 라이선스 유효 여부를 확인하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_LICENSE/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_LICENSE"',feedback:'라이선스 정보가 조회되었습니다.'},
    ],
    freeform:{description:'M_LICENSE에서 라이선스 만료일(EXPIRATION_DATE)과 사용량(PRODUCT_USAGE)을 확인하세요.',goalState:{},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_LICENSE"'},
  },
  {
    id:'Q070',title:'GetSystemInstanceList로 인스턴스 조회',category:'O. 시스템 정보',difficulty:'초급',tab:'ap',
    description:'GetSystemInstanceList로 SAP 인스턴스 전체 목록을 조회합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'GetSystemInstanceList를 실행하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetSystemInstanceList/i},hint:'sapcontrol -nr 00 -function GetSystemInstanceList',feedback:'인스턴스 목록이 조회되었습니다.'},
    ],
    freeform:{description:'GetSystemInstanceList로 AP 서버와 DB 서버의 인스턴스 상태를 한 번에 확인하세요.',goalState:{},hint:'sapcontrol -nr 00 -function GetSystemInstanceList'},
  },

  // ── P. 종합 시나리오 ──────────────────────────
  {
    id:'Q071',title:'SAP 일상 점검 (AP)',category:'P. 종합 시나리오',difficulty:'중급',tab:'ap',
    description:'AP 서버 일상 운영 점검 항목을 순서대로 실행합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'① WP 상태를 dpmon으로 확인하세요.',expect:{type:'cmd',pattern:/^(dpmon|sm50)(\s|$)/i},hint:'dpmon',feedback:'WP 상태가 확인되었습니다.'},
      {instruction:'② 시스템 로그를 ABAPReadSyslog로 확인하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+ABAPReadSyslog/i},hint:'sapcontrol -nr 00 -function ABAPReadSyslog',feedback:'시스템 로그가 조회되었습니다.'},
      {instruction:'③ df -h로 디스크 사용량을 확인하세요.',expect:{type:'cmd',pattern:/^df(\s+-h)?$/i},hint:'df -h',feedback:'디스크 사용량이 확인되었습니다.'},
      {instruction:'④ free -m으로 메모리 상태를 확인하세요.',expect:{type:'cmd',pattern:/^free(\s+-[mMgGbBkK])?$/i},hint:'free -m',feedback:'메모리 상태가 확인되었습니다.'},
    ],
    freeform:{description:'AP 서버 일상 점검을 수행하세요:\n① WP 상태 (dpmon)\n② 시스템 로그 (ABAPReadSyslog)\n③ 디스크 (df -h)\n④ 메모리 (free -m)',goalState:{},hint:'dpmon → ABAPReadSyslog → df -h → free -m'},
  },
  {
    id:'Q072',title:'SAP 일상 점검 (DB)',category:'P. 종합 시나리오',difficulty:'중급',tab:'db',
    description:'DB 서버 일상 운영 점검을 순서대로 실행합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'① HDB info로 프로세스 상태를 확인하세요.',expect:{type:'cmd',pattern:/^HDB\s+info$/i},hint:'HDB info',feedback:'HANA 프로세스 상태가 확인되었습니다.'},
      {instruction:'② M_BACKUP_CATALOG로 최근 백업을 확인하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_BACKUP_CATALOG/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_BACKUP_CATALOG"',feedback:'백업 이력이 조회되었습니다.'},
      {instruction:'③ df -h | grep hana 로 볼륨 사용률을 확인하세요.',expect:{type:'cmd',pattern:/df.*grep\s+hana|^df\s+-h\s*$/i},hint:'df -h | grep hana',feedback:'HANA 볼륨 사용률이 확인되었습니다.'},
      {instruction:'④ GetAlertTree로 알람을 확인하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetAlertTree/i},hint:'sapcontrol -nr 00 -function GetAlertTree',feedback:'알람이 확인되었습니다.'},
    ],
    freeform:{description:'DB 서버 일상 점검을 수행하세요:\n① HDB info\n② M_BACKUP_CATALOG\n③ df -h\n④ GetAlertTree',goalState:{},hint:'HDB info → M_BACKUP_CATALOG → df -h → GetAlertTree'},
  },
  {
    id:'Q073',title:'SAP 기동 실패 트러블슈팅',category:'P. 종합 시나리오',difficulty:'고급',tab:'ap',
    description:'SAP 기동 실패 후 트레이스 파일을 분석하는 흐름을 실습합니다.',
    initialState:{sapOn:false,dbOn:false},
    steps:[
      {instruction:'① SAP 기동을 시도하세요. (실패할 것입니다)',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Start(System|Wait)?(\s|$)/i},hint:'sapcontrol -nr 00 -function Start — DB 없이 기동 시도',feedback:'기동 실패 오류가 발생했습니다.'},
      {instruction:'② dev_w0에서 ERROR를 grep으로 확인하세요.',expect:{type:'cmd',pattern:/grep\s+.*ERROR\s+.*dev_w0/i},hint:'grep ERROR /usr/sap/S4H/D00/work/dev_w0',feedback:'오류 원인이 확인되었습니다.'},
      {instruction:'③ R3trans -d로 DB 연결 상태를 테스트하세요.',expect:{type:'cmd',pattern:/^R3trans\s+-d$/i},hint:'R3trans -d — DB 연결 실패 확인',feedback:'DB 연결이 실패했습니다.'},
      {instruction:'④ ping으로 s4hdb01 네트워크 연결을 확인하세요.',expect:{type:'cmd',pattern:/^ping\s+.*s4hdb01/i},hint:'ping -c 4 s4hdb01',feedback:'네트워크는 정상입니다.'},
      {instruction:'⑤ DB 서버 탭으로 전환하세요.',expect:{type:'tab',value:'db'},hint:'상단 DB Server 탭으로 이동',haHint:'이중화 모드: DB1 (s4hdb01, Primary) 탭으로 이동',feedback:'DB 서버로 이동했습니다.'},
      {instruction:'⑥ HDB start로 정지된 HANA(DB)를 기동하세요.',expect:{type:'cmd',pattern:/^HDB\s+start$/i},hint:'HDB start — SAP 기동 실패의 원인이던 DB를 기동',feedback:'DB가 기동되었습니다. 이제 AP에서 SAP를 재기동할 수 있습니다.'},
    ],
    freeform:{description:'SAP 기동 실패 시 트러블슈팅:\n1. 기동 시도 → 오류 확인\n2. dev_w0 grep ERROR\n3. R3trans -d DB 연결 확인\n4. ping 네트워크 확인\n5. DB 기동 후 재시도',goalState:{},hint:'sapcontrol -nr 00 -function Start → grep ERROR dev_w0 → R3trans -d → ping s4hdb01 → (DB 탭) HDB start'},
  },
  {
    id:'Q074',title:'HANA 재기동 후 AP 복구',category:'P. 종합 시나리오',difficulty:'고급',tab:'either',
    description:'HANA가 비정상 종료된 상황에서 복구하는 전체 흐름을 실습합니다.',
    initialState:{sapOn:false,dbOn:false},
    steps:[
      {instruction:'① DB 서버로 전환하여 HANA 상태를 확인하세요.',expect:{type:'tab',value:'db'},hint:'DB 탭으로 전환 후 HDB info',haHint:'이중화 모드: DB1 (s4hdb01, Primary) 탭으로 전환 후 HDB info',feedback:'DB 서버로 전환되었습니다.'},
      {instruction:'② HDB info로 프로세스 상태를 확인하세요.',expect:{type:'cmd',pattern:/^HDB\s+info$/i},hint:'HDB info',feedback:'HANA가 정지된 것을 확인했습니다.'},
      {instruction:'③ HANA를 기동하세요.',expect:{type:'cmd',pattern:/^HDB\s+start$/i},hint:'HDB start',feedback:'HANA 기동 명령이 실행되었습니다.'},
      {instruction:'④ HANA 기동 완료를 확인하세요. (GetProcessList)',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 00 -function GetProcessList',feedback:'HANA 서비스가 모두 GREEN입니다.'},
      {instruction:'⑤ AP 서버로 전환하세요.',expect:{type:'tab',value:'ap'},hint:'AP 탭으로 전환',haHint:'이중화 모드: AP1 (s4happ01, D00) 탭으로 전환',feedback:'AP 서버로 전환되었습니다.'},
      {instruction:'⑥ SAP를 기동하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Start(System|Wait)?(\s|$)/i},hint:'sapcontrol -nr 00 -function Start — HANA 복구 후 SAP 재기동',feedback:'SAP가 기동되었습니다. 시스템 복구 완료.'},
    ],
    freeform:{description:'HANA와 SAP 모두 정지된 상태에서 전체 시스템을 복구하세요.',goalState:{sapOn:true,dbOn:true},hint:'DB 탭 → HDB start → (확인) → AP 탭 → sapcontrol -nr 00 -function Start'},
  },
  {
    id:'Q075',title:'전송 요청 확인 및 R3trans 테스트',category:'P. 종합 시나리오',difficulty:'중급',tab:'ap',
    description:'전송 디렉토리 확인 후 R3trans로 DB 연결을 검증합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'① 전송 data 디렉토리 파일 목록을 확인하세요.',expect:{type:'cmd',pattern:/^ls\s+.*trans\/data/i},hint:'ls /usr/sap/trans/data',feedback:'전송 데이터 파일이 확인되었습니다.'},
      {instruction:'② find로 최근 2일 이내 수정된 전송 파일을 검색하세요.',expect:{type:'cmd',pattern:/^find\s+.*trans.*-mtime\s+-\d+/i},hint:'find /usr/sap/trans -mtime -2',feedback:'최근 전송 파일이 검색되었습니다.'},
      {instruction:'③ R3trans -d 로 DB 연결을 확인하세요.',expect:{type:'cmd',pattern:/^R3trans\s+-d$/i},hint:'R3trans -d',feedback:'DB 연결이 정상입니다.'},
    ],
    freeform:{description:'전송 디렉토리를 확인하고, R3trans -d로 DB 연결을 검증하세요.',goalState:{},hint:'ls /usr/sap/trans/data → find /usr/sap/trans -mtime -2 → R3trans -d'},
  },
  {
    id:'Q076',title:'사용자 전환 및 환경 확인',category:'P. 종합 시나리오',difficulty:'초급',tab:'ap',
    description:'su로 사용자를 전환하고 환경변수를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'① root로 전환하세요.',expect:{type:'cmd',pattern:/^su\s+-\s*root$|^su\s+root$/i},hint:'su - root',feedback:'root로 전환되었습니다.'},
      {instruction:'② s4hadm으로 전환하세요.',expect:{type:'cmd',pattern:/^su\s+-\s*s4hadm$|^su\s+s4hadm$/i},hint:'su - s4hadm',feedback:'s4hadm으로 전환되었습니다.'},
      {instruction:'③ whoami로 현재 사용자를 확인하세요.',expect:{type:'cmd',pattern:/^whoami$/i},hint:'whoami',feedback:'현재 사용자가 표시되었습니다.'},
      {instruction:'④ env | grep SAP 로 환경변수를 확인하세요.',expect:{type:'cmd',pattern:/env.*\|\s*grep\s+SAP/i},hint:'env | grep SAP',feedback:'SAP 환경변수가 확인되었습니다.'},
    ],
    freeform:{description:'su 명령으로 사용자를 전환하면서 각 사용자의 환경변수가 올바르게 설정되어 있는지 확인하세요.',goalState:{},hint:'su - root → su - s4hadm → whoami → env | grep SAP'},
  },
  {
    id:'Q077',title:'HANA 전체 점검 (hdbcons + 백업)',category:'P. 종합 시나리오',difficulty:'고급',tab:'db',
    description:'HANA 복제 상태 확인, 백업 진단, 볼륨 확인을 종합 수행합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'① hdbcons "replication info" 로 복제 상태를 확인하세요. (⚠ 전문가 전용 도구 — 프로덕션 환경에서 주의)',expect:{type:'cmd',pattern:/^hdbcons\s+"replication\s+info"/i},hint:'hdbcons "replication info"  ※ 전문가 전용 — 잘못된 명령은 시스템 장애 유발',feedback:'복제 상태가 확인되었습니다.'},
      {instruction:'② hdbbackupdiag --check 로 백업 상태를 진단하세요.',expect:{type:'cmd',pattern:/^hdbbackupdiag\s+--check$/i},hint:'hdbbackupdiag --check',feedback:'백업 진단이 완료되었습니다.'},
      {instruction:'③ M_DISK_USAGE를 조회하여 볼륨 사용량을 확인하세요.',expect:{type:'cmd',pattern:/hdbsql.*M_DISK_USAGE/i},hint:'hdbsql -i 00 -u SYSTEM -p <pw> "SELECT * FROM M_DISK_USAGE"',feedback:'볼륨 사용량이 확인되었습니다.'},
      {instruction:'④ systemctl status hdbdaemon 으로 서비스 상태를 확인하세요.',expect:{type:'cmd',pattern:/^systemctl\s+status\s+hdbdaemon$/i},hint:'systemctl status hdbdaemon',feedback:'hdbdaemon 서비스 상태가 확인되었습니다.'},
    ],
    freeform:{description:'HANA 시스템 종합 점검:\n① 복제 상태 (hdbcons)\n② 백업 진단 (hdbbackupdiag)\n③ 볼륨 사용량 (M_DISK_USAGE)\n④ 서비스 상태 (systemctl)',goalState:{},hint:'hdbcons → hdbbackupdiag --check → M_DISK_USAGE → systemctl status hdbdaemon'},
  },

  // ── Q. HA 이중화 (이중화 모드에서만 표시) ──────────────────────
  {
    id:'HA001',title:'HANA SR Primary 상태 확인',category:'Q. HA 이중화',difficulty:'초급',tab:'db',haOnly:true,
    description:'DB1(Primary) 서버에서 HANA System Replication 상태를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'① DB1(Primary) 서버로 전환하세요.',expect:{type:'server',value:'db1'},hint:'이중화 모드 상단의 "DB1 (s4hdb01)" 탭을 클릭하세요.',feedback:'DB1 Primary 서버로 전환되었습니다.'},
      {instruction:'② hdbnsutil -sr_state 로 복제 상태를 확인하세요.',expect:{type:'cmd',pattern:/hdbnsutil\s+(-{1,2})sr_state/i},hint:'hdbnsutil -sr_state',feedback:'Primary SR 상태가 출력되었습니다.'},
      {instruction:'③ hdbnsutil -sr_stateConfiguration 으로 복제 설정을 확인하세요.',expect:{type:'cmd',pattern:/hdbnsutil\s+(-{1,2})sr_stateConfiguration/i},hint:'hdbnsutil -sr_stateConfiguration',feedback:'SR 복제 설정 정보가 출력되었습니다.'},
    ],
    freeform:{description:'DB1(Primary) 서버에서 HANA SR 상태를 점검하세요.\nmode: primary, operation mode: primary 가 출력되는지 확인합니다.',goalState:{},hint:'DB1 탭 → hdbnsutil -sr_state → hdbnsutil -sr_stateConfiguration'},
  },
  {
    id:'HA002',title:'HANA SR Secondary 상태 점검',category:'Q. HA 이중화',difficulty:'초급',tab:'db',haOnly:true,
    description:'DB2(Secondary) 서버에서 복제 동기화 상태를 확인합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'① DB2(Secondary) 서버로 전환하세요.',expect:{type:'server',value:'db2'},hint:'이중화 모드 상단의 "DB2 (s4hdb02)" 탭을 클릭하세요.',feedback:'DB2 Secondary 서버로 전환되었습니다.'},
      {instruction:'② hdbnsutil -sr_state 로 Secondary 상태를 확인하세요.',expect:{type:'cmd',pattern:/hdbnsutil\s+(-{1,2})sr_state/i},hint:'hdbnsutil -sr_state',feedback:'Secondary mode: sync 상태가 출력되었습니다.'},
      {instruction:'③ HDB info 로 Secondary의 프로세스 상태를 확인하세요.',expect:{type:'cmd',pattern:/^HDB\s+info$/i},hint:'HDB info',feedback:'Secondary HANA 프로세스 목록이 출력되었습니다.'},
    ],
    freeform:{description:'DB2(Secondary) 서버에서 복제 동기화 상태를 점검하세요.\nmode: sync, operation mode: secondary 가 출력되는지 확인합니다.',goalState:{},hint:'DB2 탭 → hdbnsutil -sr_state → HDB info'},
  },
  {
    id:'HA003',title:'DB Failover 시뮬레이션',category:'Q. HA 이중화',difficulty:'고급',tab:'db',haOnly:true,
    description:'Primary(DB1) 장애 상황에서 Secondary(DB2) 전환 절차를 실습합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'① DB1(Primary)로 전환하여 SR 상태를 확인하세요.',expect:{type:'server',value:'db1'},hint:'DB1 탭을 클릭하세요.',feedback:'DB1 Primary 서버로 전환되었습니다.'},
      {instruction:'② Primary HANA를 정지하세요. (장애 시뮬레이션)',expect:{type:'cmd',pattern:/^HDB\s+stop$/i},hint:'HDB stop',feedback:'Primary HANA 정지 명령이 실행되었습니다.'},
      {instruction:'③ DB2(Secondary)로 전환하세요.',expect:{type:'server',value:'db2'},hint:'DB2 탭을 클릭하세요.',feedback:'DB2 Secondary 서버로 전환되었습니다.'},
      {instruction:'④ DB2에서 SR 상태를 확인하세요.',expect:{type:'cmd',pattern:/hdbnsutil\s+(-{1,2})sr_state/i},hint:'hdbnsutil -sr_state',feedback:'Secondary 상태가 확인되었습니다. 실제 환경에서는 hdbnsutil -sr_takeover 로 Takeover를 실행합니다.'},
      {instruction:'⑤ DB2에서 HDB info 로 서비스 상태를 확인하세요.',expect:{type:'cmd',pattern:/^HDB\s+info$/i},hint:'HDB info',feedback:'Secondary 서비스 상태가 확인되었습니다.'},
    ],
    freeform:{description:'Primary(DB1) 장애 시뮬레이션:\n① DB1 SR 상태 확인\n② DB1 HANA 정지 (HDB stop)\n③ DB2로 전환\n④ DB2 SR 상태 확인\n⑤ DB2 서비스 확인\n\n실제 환경에서는 ④ 후 hdbnsutil -sr_takeover 를 실행합니다.',goalState:{},hint:'DB1 탭 → hdbnsutil -sr_state → HDB stop → DB2 탭 → hdbnsutil -sr_state → HDB info'},
  },
  {
    id:'HA004',title:'AP2 서버 기동 및 확인',category:'Q. HA 이중화',difficulty:'초급',tab:'ap',haOnly:true,
    description:'AP2(s4happ02, D01) 서버에서 SAP 인스턴스를 기동하고 상태를 확인합니다.',
    initialState:{sapOn:false,dbOn:true},
    steps:[
      {instruction:'① AP2 서버(s4happ02)로 전환하세요.',expect:{type:'server',value:'ap2'},hint:'이중화 모드 상단의 "AP2 (s4happ02)" 탭을 클릭하세요.',feedback:'AP2 서버로 전환되었습니다.'},
      {instruction:'② GetProcessList로 현재 AP2 프로세스 상태를 확인하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 01 -function GetProcessList  (AP2 인스턴스 번호는 01)',feedback:'AP2 프로세스 목록이 조회되었습니다.'},
      {instruction:'③ AP2에서 SAP를 기동하세요. (인스턴스 번호 01)',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+Start(System|Wait)?(\s|$)/i},hint:'sapcontrol -nr 01 -function Start  (AP2 인스턴스 번호는 01)',feedback:'AP2 SAP 기동 명령이 실행되었습니다.'},
      {instruction:'④ 기동 완료 후 GetProcessList로 상태를 재확인하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 01 -function GetProcessList',feedback:'AP2 SAP가 GREEN 상태로 기동되었습니다.'},
    ],
    freeform:{description:'AP2(s4happ02, D01) 서버에서 SAP를 기동하고 상태를 확인하세요.\nAP2 인스턴스 번호는 01 입니다.',goalState:{sapOn:true},hint:'AP2 탭 → sapcontrol -nr 01 -function GetProcessList → sapcontrol -nr 01 -function Start → (확인)'},
  },
  {
    id:'HA005',title:'전체 HA 시스템 점검 루틴',category:'Q. HA 이중화',difficulty:'중급',tab:'either',haOnly:true,
    description:'4개 서버(AP1/AP2/DB1/DB2)를 순서대로 점검하는 HA 점검 루틴을 실습합니다.',
    initialState:{sapOn:true,dbOn:true},
    steps:[
      {instruction:'① AP1(s4happ01)로 전환하여 SAP 프로세스를 확인하세요.',expect:{type:'server',value:'ap1'},hint:'AP1 탭을 클릭하세요.',feedback:'AP1 서버로 전환되었습니다.'},
      {instruction:'② AP1 GetProcessList 를 실행하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 00 -function GetProcessList',feedback:'AP1 프로세스 상태가 확인되었습니다.'},
      {instruction:'③ AP2(s4happ02)로 전환하세요.',expect:{type:'server',value:'ap2'},hint:'AP2 탭을 클릭하세요.',feedback:'AP2 서버로 전환되었습니다.'},
      {instruction:'④ AP2 GetProcessList 를 실행하세요.',expect:{type:'cmd',pattern:/sapcontrol.+-function\s+GetProcessList/i},hint:'sapcontrol -nr 01 -function GetProcessList',feedback:'AP2 프로세스 상태가 확인되었습니다.'},
      {instruction:'⑤ DB1(Primary)로 전환하세요.',expect:{type:'server',value:'db1'},hint:'DB1 탭을 클릭하세요.',feedback:'DB1 Primary 서버로 전환되었습니다.'},
      {instruction:'⑥ DB1 SR 상태를 확인하세요.',expect:{type:'cmd',pattern:/hdbnsutil\s+(-{1,2})sr_state/i},hint:'hdbnsutil -sr_state',feedback:'DB1 Primary 상태가 확인되었습니다.'},
      {instruction:'⑦ DB2(Secondary)로 전환하세요.',expect:{type:'server',value:'db2'},hint:'DB2 탭을 클릭하세요.',feedback:'DB2 Secondary 서버로 전환되었습니다.'},
      {instruction:'⑧ DB2 SR 상태를 확인하세요.',expect:{type:'cmd',pattern:/hdbnsutil\s+(-{1,2})sr_state/i},hint:'hdbnsutil -sr_state',feedback:'DB2 Secondary 복제 동기화 상태가 확인되었습니다.'},
    ],
    freeform:{description:'4개 서버를 순서대로 순회하며 HA 시스템 전체 점검을 수행하세요.\nAP1 → AP2 → DB1(SR) → DB2(SR) 순서로 점검합니다.',goalState:{},hint:'AP1→GetProcessList → AP2→GetProcessList → DB1→hdbnsutil -sr_state → DB2→hdbnsutil -sr_state'},
  },
];

