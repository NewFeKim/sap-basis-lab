# Issue: 자유 모드 빈 goalState 시나리오 완료 경로 추가

## Priority

P2 — Should Fix

## Problem

Phase 3 퀴즈의 자유 모드에서 `freeform.goalState`가 빈 객체(`{}`)인 시나리오는 완료 처리 경로가 없다.

기존 자동 완료 버그를 막기 위해 `QuizEngine._checkFree()`가 빈 `goalState`를 무시하도록 수정된 것은 맞지만, 그 결과 자유 탐색형 시나리오는 사용자가 실습을 끝내도 `QuizStorage.markDone()`까지 도달하지 못한다.

관련 코드:

- `index.html`: `QuizEngine._checkFree()`
- `index.html`: `QuizUI.renderActive()`
- `index.html`: `QuizStorage.markDone()`

## Failure Scenario

1. 사용자가 `goalState:{}`인 시나리오를 시작한다.
2. 모드 전환으로 자유 모드에 진입한다.
3. 설명과 힌트에 따라 명령어를 모두 수행한다.
4. 완료 배너가 표시되지 않는다.
5. 진도 카운트가 증가하지 않고, localStorage에도 완료 상태가 저장되지 않는다.

README는 자유 모드와 진도 저장을 기능으로 설명하므로, 사용자는 퀴즈가 끝나지 않는 것처럼 느낄 수 있다.

## Suggested Fix

가장 작은 수정:

- 자유 모드이면서 `goalState`가 비어 있는 경우에만 보이는 `학습 완료` 액션을 추가한다.
- 해당 액션은 `QuizEngine`의 명시적 완료 메서드를 호출한다.
- 완료 메서드는 기존 `_complete()` 흐름을 재사용해 배너 표시와 `QuizStorage.markDone()`을 동일하게 처리한다.

예상 방향:

```javascript
manualComplete(){
  if(!this.active || this.mode !== 'free')return;
  const g=this.quiz.freeform.goalState;
  if(g && Object.keys(g).length > 0)return;
  this._complete();
}
```

대안:

- 각 `freeform`에 명령 패턴 기반 완료 조건을 추가한다.
- 다만 60개 이상 시나리오를 수정해야 하므로 초기 수정 범위가 커진다.

## Acceptance Criteria

- `goalState:{}` 자유 모드 시나리오에서 사용자가 수동으로 완료 처리할 수 있다.
- 완료 시 기존 단계별 완료와 동일하게 완료 배너가 표시된다.
- 완료 시 `QuizStorage.markDone()`이 호출되어 진도에 반영된다.
- `goalState`가 있는 자유 모드는 기존 상태 기반 자동 완료 동작을 유지한다.
- 단계별 모드에는 불필요한 완료 버튼이 보이지 않는다.
- `.\tools\codex-review.ps1` 결과가 clean이다.

## Review Notes

Codex review에서 확인된 이슈:

```text
[P2] 자유 모드의 빈 goalState 시나리오는 완료할 방법이 없습니다
```
