param(
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$IndexPath = 'index.html',
  [int]$ExpectedQuizCount = 82
)

$ErrorActionPreference = 'Stop'

$rootPath = (Resolve-Path $Root).Path
$localNode = Join-Path $rootPath '.tools\node\node.exe'
$systemNode = Get-Command node -ErrorAction SilentlyContinue

if (Test-Path -LiteralPath $localNode) {
  $node = $localNode
} elseif ($systemNode) {
  $node = $systemNode.Source
} else {
  Write-Error 'Node.js is required for Codex review. Install the repo-local Node runtime under .tools\node or add node.exe to PATH.'
}

$script = Join-Path $PSScriptRoot 'codex-review.mjs'
& $node $script $rootPath $IndexPath $ExpectedQuizCount
exit $LASTEXITCODE
