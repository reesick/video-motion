# DisruptionOps launch film, one command:
#   powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make.ps1                 # light (default)
#   powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make.ps1 -Theme light    # light
#   powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make.ps1 -Theme both     # dark, then light
# Steps: render 60 fps with motion blur (progress bar) -> SFX cues -> audio mix (-14 LUFS) -> final mp4.
param([ValidateSet('dark', 'light', 'both')][string]$Theme = 'light', [int]$Workers = 6, [int]$Sub = 4)
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)          # D:\video-1
New-Item -ItemType Directory -Force alos\output | Out-Null
$dur = (Get-Content alos\audio\vo\lines.json | ConvertFrom-Json).duration

Write-Host "`n[audio] SFX cues from the voice-over timing + mix (-14 LUFS)" -ForegroundColor Cyan
python tools/alos_cues.py
if ($LASTEXITCODE -ne 0) { throw "cues failed" }
python tools/mix_audio.py alos/docs/cues.json alos/output/soundtrack.wav
if ($LASTEXITCODE -ne 0) { throw "mix failed" }

$themes = if ($Theme -eq 'both') { @('dark', 'light') } else { @($Theme) }
foreach ($th in $themes) {
  $env:STUDIO     = "alos/studio/index.html"
  $env:THEME      = $th
  $env:RENDER_LOG = "alos/output/render_$th.log"
  $env:SEGMENTS   = "alos/output/_segments_$th"
  $silent = "alos/output/video_silent_$th.mp4"
  $final  = if ($th -eq 'dark') { "alos/output/disruptionops_launch.mp4" } else { "alos/output/disruptionops_launch_light.mp4" }

  Write-Host "`n[$th] Rendering ${dur}s @ 60fps, $Sub subframes, $Workers workers  (log: $($env:RENDER_LOG))" -ForegroundColor Cyan
  node studio/render.mjs 0 $dur $Workers $Sub $silent
  if ($LASTEXITCODE -ne 0) { throw "render failed ($th)" }

  Write-Host "[$th] Muxing" -ForegroundColor Cyan
  ffmpeg -v error -stats -y -i $silent -i alos/output/soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest $final
  if ($LASTEXITCODE -ne 0) { throw "mux failed ($th)" }
  Write-Host "DONE [$th]  ->  D:\video-1\$($final -replace '/', '\')" -ForegroundColor Green
}
