# Push this repo to GitHub:  powershell -ExecutionPolicy Bypass -File D:\video-1\ship.ps1 ["commit message"]
# Safe to re-run: inits once, commits whatever changed, pushes main. Renders and third-party media stay out (.gitignore).
param([string]$Message = "video-motion: DisruptionOps film (intro 1, light) + Madison remake pipeline")
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$remote = "https://github.com/reesick/video-motion.git"

if (-not (Test-Path .git)) { git init | Out-Null }
git add -A
if ($LASTEXITCODE -ne 0) { throw "git add failed" }

# guard: GitHub rejects files over 100 MB; stop at 50 MB so nothing big slips in
$big = git diff --cached --name-only -z | ForEach-Object { $_ -split "`0" } | Where-Object { $_ -and (Test-Path -LiteralPath $_) -and (Get-Item -LiteralPath $_).Length -gt 50MB }
if ($big) { git reset -q; throw "Files over 50 MB staged (add them to .gitignore):`n$($big -join "`n")" }

$n = (git diff --cached --name-only | Measure-Object).Count
$mb = ((git diff --cached --name-only | Where-Object { Test-Path -LiteralPath $_ } | Get-Item | Measure-Object Length -Sum).Sum / 1MB)
Write-Host ("Staged {0} files, {1:N1} MB" -f $n, $mb) -ForegroundColor Cyan

if ($n -gt 0) {
  git commit -q -m $Message
  if ($LASTEXITCODE -ne 0) { throw "commit failed (set your identity once: git config --global user.name / user.email)" }
}
git branch -M main
if (git remote | Select-String -Quiet '^origin$') { git remote set-url origin $remote } else { git remote add origin $remote }
git push -u origin main
if ($LASTEXITCODE -ne 0) { throw "push failed" }
Write-Host "PUSHED -> https://github.com/reesick/video-motion" -ForegroundColor Green
