/* ───────────────────────────────────────────
   QuizStorage — localStorage 영구 저장
─────────────────────────────────────────── */
const QuizStorage={
  KEY:'sap_bc_quiz_v1',
  _data:null,
  _load(){
    if(this._data)return this._data;
    try{this._data=JSON.parse(localStorage.getItem(this.KEY)||'{}');}
    catch{this._data={};}
    return this._data;
  },
  _save(){try{localStorage.setItem(this.KEY,JSON.stringify(this._data));}catch(e){/* storage full 등 — 진도 저장 실패해도 완료 UI는 계속 표시 */}},
  markDone(id){const d=this._load();d[id]=(d[id]||{});d[id].done=true;d[id].ts=Date.now();this._save();},
  isDone(id){return!!(this._load()[id]||{}).done;},
  getAll(){return this._load();},
  reset(){this._data={};localStorage.removeItem(this.KEY);},
  stats(){
    const d=this._load();
    const total=QUIZZES.length;
    const done=Object.values(d).filter(v=>v.done).length;
    return{total,done};
  },
};

/* ───────────────────────────────────────────
   QuizEngine — 검증 코어 (cmd / tab / state)
─────────────────────────────────────────── */
const QuizEngine={
  active:false,
  quiz:null,
  mode:'step',        // 'step' | 'free'
  stepIdx:0,
  hintShown:false,

  start(quizId, mode='step'){
    const q=QUIZZES.find(x=>x.id===quizId);
    if(!q)return;
    this.quiz=q;
    this.mode=mode;
    this.stepIdx=0;
    this.hintShown=false;
    this.active=true;

    // initialState 적용 (서버별 플래그에도 동기화)
    if(q.initialState){
      if(q.initialState.sapOn!==undefined){
        sapOn=q.initialState.sapOn;
        if(activeServer==='ap1')ap1On=sapOn;
        else if(activeServer==='ap2')ap2On=sapOn;
        // db 서버에서 시작하는 경우 ap 플래그는 건드리지 않음
      }
      if(q.initialState.dbOn!==undefined){
        dbOn=q.initialState.dbOn;
        db1On=dbOn; // 퀴즈는 단일 모드 기준 → DB1에 반영
      }
      if(q.initialState.diskFull!==undefined)diskFullSim=q.initialState.diskFull;
      if(q.initialState.memLow!==undefined)memLowSim=q.initialState.memLow;
    }

    // 퀴즈가 특정 탭을 요구하면 전환
    if(q.tab==='ap'&&activeTab!=='ap')switchTab('ap');
    if(q.tab==='db'&&activeTab!=='db')switchTab('db');

    document.getElementById('qz-done-banner').className='';
    QuizUI.renderActive();
    ap(`▶ 퀴즈 시작: [${q.id}] ${q.title}`,'in');
    ap(`  모드: ${mode==='step'?'단계별':'자유'} | 난이도: ${q.difficulty}`,'mu');
    ap('─'.repeat(50),'mu');
  },

  // rc() 에서 명령어 입력 후 호출
  onCmd(input){
    if(!this.active)return;
    if(this.mode==='step')this._checkStep(input);
    else this._checkFree();
  },

  // switchTab() 에서 탭 전환 후 호출
  onTab(newTab){
    if(!this.active)return;
    if(this.mode==='step'){
      const step=this._curStep();
      if(step&&step.expect.type==='tab'&&step.expect.value===newTab){
        this._passStep();
      }
    }else{
      this._checkFree();
    }
  },

  // switchServer() 에서 서버 전환 후 호출 — HA 전용 server 타입 스텝 처리
  onServer(newServer){
    if(!this.active)return;
    if(this.mode==='step'){
      const step=this._curStep();
      if(step&&step.expect.type==='server'&&step.expect.value===newServer){
        this._passStep();
      }
    }else{
      this._checkFree();
    }
  },

  // state 체크 (sapOn/dbOn 변경 직후 명시적으로 호출)
  onState(){
    if(!this.active)return;
    if(this.mode==='step'){
      const step=this._curStep();
      if(step&&step.expect.type==='state'){
        const cur=step.expect.key==='sapOn'?sapOn:step.expect.key==='dbOn'?dbOn:undefined;
        if(cur===step.expect.value)this._passStep();
      }
    }else{
      this._checkFree();
    }
  },

  _curStep(){
    if(!this.quiz||this.stepIdx>=this.quiz.steps.length)return null;
    return this.quiz.steps[this.stepIdx];
  },

  _checkStep(input){
    const step=this._curStep();
    if(!step)return;
    if(step.expect.type!=='cmd')return; // tab/state는 onTab/onState에서 처리
    const match=step.expect.pattern instanceof RegExp
      ?step.expect.pattern.test(input.trim())
      :input.trim()===step.expect.pattern;
    if(match)this._passStep();
    else{
      ap('✗ 예상 명령어가 아닙니다. 힌트가 필요하면 퀴즈 패널의 [💡 힌트 보기]를 클릭하세요.','wa');
    }
  },

  _checkFree(){
    const g=this.quiz.freeform.goalState;
    if(!g||Object.keys(g).length===0)return; // goalState가 없거나 빈 객체면 자유 탐색 모드 — 자동 완료 없음
    const done=(g.sapOn===undefined||sapOn===g.sapOn)
             &&(g.dbOn===undefined||dbOn===g.dbOn)
             &&(g.tab===undefined||activeTab===g.tab);
    if(done)this._complete();
  },

  _passStep(){
    const step=this._curStep();
    ap(`✔ 정답! ${step.feedback||''}`,'su');
    this.stepIdx++;
    this.hintShown=false;
    if(this.stepIdx>=this.quiz.steps.length){
      this._complete();
    }else{
      QuizUI.renderActive();
      ap('─'.repeat(50),'mu');
    }
  },

  // 자유 모드 + 빈 goalState 시나리오에서 사용자가 직접 완료를 선언
  completeManually(){
    if(!this.active||this.mode!=='free')return;
    const g=this.quiz.freeform.goalState;
    if(g&&Object.keys(g).length>0)return; // 자동 완료 대상은 버튼 비활성
    this._complete();
  },

  _complete(){
    this.active=false;
    diskFullSim=false;memLowSim=false; // 시뮬 토글 해제
    QuizStorage.markDone(this.quiz.id);
    document.getElementById('qz-active').className='';
    const banner=document.getElementById('qz-done-banner');
    banner.textContent=`🎉 퀴즈 완료! [${this.quiz.id}] ${this.quiz.title}  —  수고하셨습니다!`;
    banner.className='open';
    ap('═'.repeat(50),'su');
    ap(`✔ 퀴즈 완료: [${this.quiz.id}] ${this.quiz.title}`,'su');
    ap('═'.repeat(50),'su');
    setTimeout(()=>{banner.className='';},6000);
  },

  abort(){
    if(!this.active)return;
    diskFullSim=false;memLowSim=false;
    this.active=false;
    this.quiz=null;
    document.getElementById('qz-active').className='';
    document.getElementById('qz-hint-box').className='';
    document.getElementById('qz-done-banner').className='';
    ap('(퀴즈 종료)','mu');
  },

  switchMode(){
    if(!this.active||!this.quiz)return;
    this.mode=this.mode==='step'?'free':'step';
    this.stepIdx=0;
    this.hintShown=false;
    document.getElementById('qz-hint-box').className='';
    QuizUI.renderActive();
    ap(`(모드 전환 → ${this.mode==='step'?'단계별':'자유'} 모드)`,'in');
  },
};

/* ───────────────────────────────────────────
   QuizUI — 렌더링
─────────────────────────────────────────── */
const QuizUI={
  openList(){
    const overlay=document.getElementById('qz-overlay');
    overlay.className='open';
    this._renderList();
  },
  closeList(){
    document.getElementById('qz-overlay').className='';
  },

  _renderList(){
    const cats=document.getElementById('qz-cats');
    cats.innerHTML='';
    // 현재 모드에 맞는 퀴즈만 표시 (haOnly는 이중화 모드에서만 노출)
    const visibleQuizzes=QUIZZES.filter(q=>!q.haOnly||haMode);
    const doneCnt=visibleQuizzes.filter(q=>QuizStorage.isDone(q.id)).length;
    // 진도 헤더
    const prog=document.createElement('div');
    prog.style.cssText='font-size:11px;color:#6e7681;margin-bottom:12px';
    prog.textContent=`진도: ${doneCnt} / ${visibleQuizzes.length} 완료${haMode?' (이중화 모드)':''}`;
    cats.appendChild(prog);

    // 카테고리별 그룹
    const groups={};
    visibleQuizzes.forEach(q=>{
      if(!groups[q.category])groups[q.category]=[];
      groups[q.category].push(q);
    });
    Object.entries(groups).forEach(([cat,items])=>{
      const hd=document.createElement('div');
      hd.className='qz-cat-hd';
      hd.textContent=cat;
      cats.appendChild(hd);
      const row=document.createElement('div');
      row.className='qz-items';
      items.forEach(q=>{
        const el=document.createElement('div');
        el.className='qz-item'+(QuizStorage.isDone(q.id)?' done':'');
        const diff=q.difficulty==='초급'?'e':q.difficulty==='중급'?'m':'h';
        el.innerHTML=`<span style="font-size:10px;color:#6e7681">[${q.id}]</span> ${q.title} <span class="qz-diff ${diff}">${q.difficulty}</span>`;
        el.onclick=()=>this._selectQuiz(q.id);
        row.appendChild(el);
      });
      cats.appendChild(row);
    });
  },

  _selectQuiz(id){
    this.closeList();
    // 모드 선택 (간단 팝업 대신 기본 step으로 시작)
    QuizEngine.start(id,'step');
  },

  renderActive(){
    if(!QuizEngine.active)return;
    const q=QuizEngine.quiz;
    const panel=document.getElementById('qz-active');
    panel.className='open';
    document.getElementById('qz-id-badge').textContent=q.id;
    document.getElementById('qz-mode-badge').className='qz-badge mode'+(QuizEngine.mode==='free'?' free':'');
    document.getElementById('qz-mode-badge').textContent=QuizEngine.mode==='step'?'단계별':'자유';

    const instrEl=document.getElementById('qz-instr');
    if(QuizEngine.mode==='step'){
      const step=q.steps[QuizEngine.stepIdx];
      const total=q.steps.length;
      document.getElementById('qz-step-badge').textContent=`${QuizEngine.stepIdx+1}/${total}`;
      document.getElementById('qz-step-badge').style.display='';
      instrEl.textContent=step?(haMode&&step.haInstruction?step.haInstruction:step.instruction):'(완료)';
    }else{
      document.getElementById('qz-step-badge').style.display='none';
      instrEl.textContent=q.freeform.description;
    }
    // 수동 완료 버튼: 자유 모드 + goalState가 빈 객체인 경우에만 표시
    const manualDoneBtn=document.getElementById('qz-manual-done');
    const g=q.freeform?q.freeform.goalState:{};
    const showBtn=QuizEngine.mode==='free'&&(!g||Object.keys(g).length===0);
    manualDoneBtn.style.display=showBtn?'':'none';
    document.getElementById('qz-hint-box').className='';
  },

  showHint(){
    if(!QuizEngine.active)return;
    const hintBox=document.getElementById('qz-hint-box');
    let hint='';
    if(QuizEngine.mode==='step'){
      const step=QuizEngine.quiz.steps[QuizEngine.stepIdx];
      hint=step?(haMode&&step.haHint?step.haHint:step.hint):'(힌트 없음)';
    }else{
      hint=QuizEngine.quiz.freeform.hint||'(힌트 없음)';
    }
    hintBox.textContent='💡 '+hint;
    hintBox.className='open';
    QuizEngine.hintShown=true;
  },

  switchMode(){QuizEngine.switchMode();},
};

