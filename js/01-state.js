/* ───────────────────────────────────────────
   상태 변수
─────────────────────────────────────────── */
const APP_VERSION='v0.100';
const SID='S4H', AP_HOST='s4happ01', DB_HOST='s4hdb01', NR='00';
const AP2_HOST='s4happ02', DB2_HOST='s4hdb02';
let activeTab='ap';     // 'ap'|'db' — 하위 호환 (퀴즈 시스템용)
let activeServer='ap1'; // 'ap1'|'ap2'|'db1'|'db2' — 실제 활성 서버
let haMode=false;       // false=단일, true=이중화
let HOST=AP_HOST;

/* ── 글씨 크기 조절 ── */
const FS_MIN=13, FS_MAX=20, FS_STEP=1;
let termFs=parseInt(localStorage.getItem('termFs')||FS_MIN,10);
function adjFs(delta){
  const next=Math.min(FS_MAX,Math.max(FS_MIN,termFs+delta*FS_STEP));
  if(next===termFs)return;
  termFs=next;
  document.getElementById('tr').style.fontSize=termFs+'px';
  document.getElementById('fs-val').textContent=termFs+'px';
  document.getElementById('fs-dec').classList.toggle('fs-disabled',termFs<=FS_MIN);
  document.getElementById('fs-inc').classList.toggle('fs-disabled',termFs>=FS_MAX);
  localStorage.setItem('termFs',termFs);
}
// 버전 표시 및 haMode 복원 — 항상 실행
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('page-version').textContent=`신입 Basis 컨설턴트를 위한 OS단 실습 환경 · ${APP_VERSION}`;
  document.title=`SAP Basis Training Terminal ${APP_VERSION}`;
  // 저장된 HA 모드 복원
  if(localStorage.getItem('haMode')==='1')setHaMode(true);
});
// 페이지 로드 시 저장된 글씨 크기 적용
(function initFs(){
  if(termFs===FS_MIN)return; // 기본값이면 스타일 변경 불필요
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('tr').style.fontSize=termFs+'px';
    document.getElementById('fs-val').textContent=termFs+'px';
    document.getElementById('fs-dec').classList.toggle('fs-disabled',termFs<=FS_MIN);
    document.getElementById('fs-inc').classList.toggle('fs-disabled',termFs>=FS_MAX);
  });
})();

// AP1 서버 상태 (기존 apCwd/apUser 대응)
let apCwd='/usr/sap/S4H', apUser='s4hadm', sapOn=true;
let ap1On=true;   // AP1 독립 기동 상태
// AP2 서버 상태 (이중화 전용)
let ap2Cwd='/usr/sap/S4H', ap2User='s4hadm', ap2On=true;
// DB1 서버 상태 (기존 dbCwd/dbUser 대응)
let dbCwd='/usr/sap/S4H/HDB00', dbUser='s4hdb01adm', dbOn=true;
let db1On=true;   // DB1 독립 기동 상태
// DB2 서버 상태 (이중화 전용)
let db2Cwd='/hana/shared/S4H', db2User='s4hdb02adm', db2On=true;

// 현재 활성 상태 (탭 전환 시 교체)
let cwd=apCwd, user=apUser;
let hist=[], hidx=-1, pagerLines=[], pagerPos=0, pagerActive=false;
let activeTailTid=null; // tail -f 인터벌 추적 (탭 전환/Ctrl+C 시 취소)
// Phase 3 — 퀴즈 시뮬레이션 토글 (퀴즈 시작 시 활성화, 종료 시 해제)
let diskFullSim=false;  // df 출력을 풀 상태(/usr/sap 95%)로 변경
let memLowSim=false;    // free/top/vmstat 출력을 메모리 부족 상태로 변경

// DB 서버 — hdbuserstore 가상 키 저장소
let hdbuserStore={
  'BKPKEY':    {env:`${DB_HOST}:30013`, user:'SYSTEM'},
  'DBACOCKPIT':{env:`${DB_HOST}:30015`, user:'SAPDBCTRL'},
};

