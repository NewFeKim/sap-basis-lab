# Local Implementation Handoff

Use this file only when a GitHub PR is not available.

Preferred review flow is now PR-based. For PR reviews, update:

`.ai-collab/PR_REVIEW_REQUEST.md`

## Status

- Owner: Claude Code
- Branch: main
- Head commit: e79068b
- Last updated: 2026-05-15

## Goal

Phase 3 퀴즈 시스템의 우선 수정 3건 처리 후 codex-review 전체 클린 달성.

우선 수정 대상:
1. 자유 모드 `goalState:{}` 자동 완료 문제
2. 파이프 명령이 `QuizEngine.onCmd()`를 호출하지 않아 퀴즈 단계가 진행되지 않는 문제
3. `localStorage` 저장 실패 시 완료 UI가 깨질 수 있는 문제

## Changed Files

- `index.html` (단일 파일)

## Summary

### 1. [High] 자유 모드 빈 goalState 즉시 완료 버그 (commit e79068b)

**문제:** `_checkFree()`에서 `goalState:{}` (빈 객체)인 경우 조건 체크 없이 `allMet=true`로
시작하므로 첫 번째 명령어 입력 즉시 `_complete()`가 호출됐다.

**수정:**
```javascript
// Before
_checkFree(){
  const g=this.quiz.freeform.goalState;
  if(!g)return;
  let allMet=true;
  if(g.sapOn!==undefined&&sapOn!==g.sapOn)allMet=false;
  ...
  if(allMet)this._complete();
}

// After
_checkFree(){
  const g=this.quiz.freeform.goalState;
  if(!g||Object.keys(g).length===0)return; // 빈 객체 = 자유 탐색 모드, 자동 완료 없음
  const done=(g.sapOn===undefined||sapOn===g.sapOn)
           &&(g.dbOn===undefined||dbOn===g.dbOn)
           &&(g.tab===undefined||activeTab===g.tab);
  if(done)this._complete();
}
```

**영향:** goalState가 빈 객체인 60개 시나리오(자유 탐색 형태)가 모두 해당.
현재 77개 시나리오 중 state 전환을 목표로 하는 시나리오(예: Q001 SAP 기동)만 실제 완료 처리됨.

---

### 2. [High] 파이프 명령어 퀴즈 검증 누락 (commit e79068b)

**문제:** `rc()` 내 파이프 분기(`segs.length>1`)가 `return`으로 빠져나오면서
`QuizEngine.onCmd(input)` 및 `QuizEngine.onState()` 호출을 건너뜀.
→ `env | grep SAP`, `ps aux | grep dw` 등 파이프 명령어를 정답으로 요구하는
퀴즈 단계가 절대 진행되지 않았음.

**수정:**
```javascript
// 파이프 브랜치 return 직전에 추가
if(typeof QuizEngine!=='undefined'){
  QuizEngine.onCmd(input);
  setTimeout(()=>QuizEngine.onState(),2000);
}
return;
```

---

### 3. [Medium] localStorage.setItem 예외 처리 누락 (commit e79068b)

**문제:** `QuizStorage._save()`가 `localStorage.setItem`을 try/catch 없이 호출.
스토리지 용량 초과(QuotaExceededError) 등 예외 발생 시 완료 UI 렌더링 전에
스크립트가 중단될 수 있었음.

**수정:**
```javascript
// Before
_save(){localStorage.setItem(this.KEY,JSON.stringify(this._data));},

// After
_save(){try{localStorage.setItem(this.KEY,JSON.stringify(this._data));}catch(e){/* storage full 등 — 진도 저장 실패해도 완료 UI는 계속 표시 */}},
```

---

### 추가 수정 (codex-review 결과 반영)

이하 항목은 codex-review(`.\tools\codex-review.ps1`) 실행 결과 발견된 추가 이슈:

| 심각도 | 내용 | 수정 내용 |
|--------|------|-----------|
| Low | 앱 버전 표기 v3 / README v4 불일치 | `<title>` 및 타이틀바 문자열 전체 v3→v4 |
| Low | `sapOn\|\|true` 의도 불명확 표현식 | `true` + 주석으로 명시 (AP, DB 양쪽) |

## Verification

```powershell
.\tools\codex-review.ps1
# → No automated findings. (exit 0)
```

실행 일시: 2026-05-15
결과: **High 0건 / Medium 0건 / Low 0건**

생성 리포트: `.ai-collab/CODEX_REVIEW_REPORT.md`

## Known Risks

1. **빈 goalState 시나리오 완료 처리 없음**
   60개 시나리오가 `goalState:{}` (자유 탐색)이므로 현재 자동 완료가 불가능함.
   완료 처리가 필요한 경우 `QuizUI`에 수동 완료 버튼(「학습 완료」) 추가가 필요함.
   → Codex 판단 필요.

2. **파이프 3중 이상 체인 미지원**
   현재 파이프는 `cmd | filter` 2단계만 지원. `cmd | grep | wc -l` 형태는 동작하지 않음.
   퀴즈 정답이 3중 파이프를 요구하는 시나리오는 없으나, 사용자 자유 입력 시 혼란 가능.

3. **onState 타이밍 (2000ms)**
   `startsap`/`HDB start`가 완료되는 최대 지연은 약 1700ms.
   현재 2000ms로 충분하나, 향후 애니메이션 시간이 늘어나면 재조정 필요.

## Review Request

- 집중 리뷰 영역: `QuizEngine._checkFree()`, `rc()` 파이프 브랜치, `QuizStorage._save()`
- 회귀 확인: 기존 단계별 모드(step mode) cmd/tab/state 검증 3종이 정상 동작하는지
- 빈 goalState 시나리오의 완료 처리 방식에 대한 UX 판단 요청
