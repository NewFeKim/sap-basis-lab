/* ───────────────────────────────────────────
   파이프 / 리다이렉션 파싱 & 실행
─────────────────────────────────────────── */
function parsePipe(input){
  return input.split('|').map(s=>{const p=s.trim().split(/\s+/);return{cmd:p[0],args:p.slice(1)};});
}

function handleRedirect(input){
  const m=input.match(/^(.+?)\s*(>>|>)\s*(\S+)$/);
  if(!m)return false;
  ap(`(리다이렉션: '${m[1].trim()}' → ${m[3]} ${m[2]==='>'?'저장':'추가'} — 시뮬레이션)`,'mu');
  const p=m[1].trim().split(/\s+/);
  if(CMDS[p[0]])CMDS[p[0]](p.slice(1));
  return true;
}

function rc(input){
  input=input.trim();
  if(!input)return;
  if(pagerActive){pagerNext();return;}
  hist.push(input);hidx=hist.length;
  apc(input);

  if(handleRedirect(input)){if(typeof QuizEngine!=='undefined')QuizEngine.onCmd(input);return;}

  const segs=parsePipe(input);
  if(segs.length>1){
    const main=segs[0],filters=segs.slice(1);
    if(!CMDS[main.cmd]){ap(`bash: ${main.cmd}: command not found`,'er');return;}
    const o=document.getElementById('output');
    const prevCount=o.children.length;
    CMDS[main.cmd](main.args);
    filters.forEach(f=>{
      const items=Array.from(o.children).slice(prevCount);
      if(f.cmd==='grep'){
        const flagArgs=f.args.filter(a=>a.startsWith('-'));
        const rest=f.args.filter(a=>!a.startsWith('-'));
        const opts=flagArgs.join('').replace(/-/g,''),pat=rest[0]||'';
        let re;
        try{re=new RegExp(pat,opts.includes('i')?'i':'');}
        catch(e){ap(`grep: invalid regex '${pat}': ${e.message}`,'er');return;}
        const invert=opts.includes('v');
        items.forEach(el=>{
          if(invert?re.test(el.textContent):!re.test(el.textContent))
            el.style.display='none';
          else if(/(ERROR|FAIL)/i.test(el.textContent))el.className='ln er';
          else if(/WARN/i.test(el.textContent))el.className='ln wa';
        });
      }else if(f.cmd==='sort'){
        const sorted=[...items].sort((a,b)=>a.textContent.localeCompare(b.textContent));
        items.forEach((el,i)=>el.textContent=sorted[i].textContent);
      }else if(f.cmd==='wc'&&f.args.includes('-l')){
        const cnt=items.filter(el=>el.style.display!=='none').length;
        ap(`${cnt}`);
      }else if(f.cmd==='uniq'){
        const seen=new Set();
        items.forEach(el=>{
          if(seen.has(el.textContent))el.style.display='none';
          else seen.add(el.textContent);
        });
      }
    });
    // 파이프 명령어도 퀴즈 검증 대상
    if(typeof QuizEngine!=='undefined'){
      QuizEngine.onCmd(input);
      setTimeout(()=>QuizEngine.onState(),2000);
    }
    return;
  }

  const parts=input.split(/\s+/),cmd=parts[0],args=parts.slice(1);
  if(CMDS[cmd]){
    CMDS[cmd](args);
    // 명령어 실행 후 퀴즈 cmd 검증 및 state 검증
    if(typeof QuizEngine!=='undefined'){
      QuizEngine.onCmd(input);
      // setTimeout으로 비동기 상태 변경(startsap/stopsap 등) 후 state 체크
      setTimeout(()=>QuizEngine.onState(),2000);
    }
  }else{
    ap(`bash: ${cmd}: command not found`,'er');
    ap("힌트: 'help' 를 입력하면 사용 가능한 명령어 목록을 볼 수 있습니다.",'mu');
  }
}

/* ───────────────────────────────────────────
   키보드 이벤트
─────────────────────────────────────────── */
document.getElementById('ci').addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    if(pagerActive)pagerNext();
    else{rc(e.target.value);e.target.value='';}
  }else if(e.key==='ArrowUp'){
    e.preventDefault();
    if(hidx>0){hidx--;e.target.value=hist[hidx]||'';}
  }else if(e.key==='ArrowDown'){
    e.preventDefault();
    if(hidx<hist.length-1){hidx++;e.target.value=hist[hidx]||'';}
    else{hidx=hist.length;e.target.value='';}
  }else if(e.key==='Tab'){
    e.preventDefault();
    const val=e.target.value.trim(),parts=val.split(/\s+/);
    if(parts.length>=1){
      const partial=parts[parts.length-1];
      const baseDir=partial.includes('/')?partial.split('/').slice(0,-1).join('/')||'/':'';
      const base=rp(baseDir||''),frag=partial.split('/').pop();
      const matches=(FS[base]||[]).filter(x=>x.startsWith(frag));
      if(matches.length===1){
        parts[parts.length-1]=(baseDir?baseDir+'/':'')+matches[0];
        e.target.value=parts.join(' ');
      }else if(matches.length>1){apc(val);ap(matches.join('   '));}
    }
  }else if(e.ctrlKey&&e.key==='l'){e.preventDefault();CMDS.clear();}
  else if(e.ctrlKey&&e.key==='c'){
    ap('^C','mu');e.target.value='';
    if(pagerActive)pagerQuit();
    if(activeTailTid){clearInterval(activeTailTid);activeTailTid=null;ap('(tail -f 종료)','mu');}
  }
  else if(e.key===' '&&pagerActive){e.preventDefault();pagerNext();}
  else if(e.key==='q'&&pagerActive){e.preventDefault();pagerQuit();}
});

/* ───────────────────────────────────────────
   초기 화면
─────────────────────────────────────────── */
apl([
  'SUSE Linux Enterprise Server 15 SP4',
  `Kernel 5.14.21-150400.24.81-default (${AP_HOST})`,
  'Last login: Mon May 05 18:31:02 2026 from 10.10.1.10',
],'mu');
apl([
  '',
  `SAP BASIS TRAINING TERMINAL ${APP_VERSION} — AP Server Simulator`,
  `SID: S4H  |  Instance: D00  |  Host: ${AP_HOST}  |  User: ${user}`,
  'SAP System Status: RUNNING  |  SLES 15 SP4  |  Kernel 793',
  '',
  `퀴즈: ${QUIZZES.length}개 시나리오 (우상단 📝 퀴즈 버튼)  |  'help' 로 명령어 목록`,
  '',
],'in');
up();
