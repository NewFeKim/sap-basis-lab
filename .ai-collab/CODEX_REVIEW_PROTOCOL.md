# Codex Review Protocol

## Roles

- Claude Code owns implementation.
- Codex owns code review.
- The user coordinates priorities and decides what gets merged.

## Default PR Review Flow

1. Claude Code creates a feature branch from `main`.
2. Claude Code implements the requested change.
3. Claude Code commits and pushes the branch to GitHub.
4. Claude Code opens a GitHub Pull Request into `main`.
5. Claude Code updates `.ai-collab/PR_REVIEW_REQUEST.md` with the PR URL and summary.
6. Codex fetches the branch or reads the PR diff, then reviews the change.
7. Codex reports findings first, ordered by severity, with file and line references.
8. Claude Code fixes accepted findings and pushes updates to the same PR branch.
9. Codex re-reviews the updated PR.

## Branch And PR Rules

- Preferred branch naming:
  - `fix/<short-issue>`
  - `feature/<short-feature>`
  - `review-fix/<short-topic>`
- PR target branch: `main`
- Keep each PR focused on one logical change.
- Do not mix formatting-only cleanup with behavior changes unless requested.
- Acceptable fallback: Claude Code works locally and leaves a handoff file for Codex.
- Avoid simultaneous edits to the same file by both agents.

## PR Review Inputs

Codex should review from one of these sources:

- GitHub PR URL
- Remote branch name
- Local branch checked out by the user
- `.ai-collab/PR_REVIEW_REQUEST.md`

If a PR URL or branch is provided, Codex should compare it against `main`.

## Codex Review Checklist

- Run `.\tools\codex-review.ps1` first for local static checks.
- Read `.ai-collab/CODEX_REVIEW_REPORT.md` before writing the final review.
- The review command uses repo-local Node from `.tools\node` when available.
- Behavioral regressions
- Quiz validation correctness
- Command simulator correctness
- State transitions and async timing
- Browser/runtime errors
- Persistence behavior
- Test or manual verification gaps
- Scope creep or unnecessary refactors

## Output Contract

Codex review responses should include:

- Findings first
- Open questions or assumptions
- Brief change summary only after findings
- Verification status
