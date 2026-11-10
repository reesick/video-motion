# DisruptionOps launch film, v4 cut (brief v3 incl. Copilot beat + Coastal/Sahyadri globe), light theme.
# Uses its own studio, voice, cues and output paths, so it never touches a render of alos\make.ps1 that is still running.
#   powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make_v4.ps1
param([int]$Workers = 6, [int]$Sub = 4)
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)          # D:\video-1
$out = "alos/output/v4"
New-Item -ItemType Directory -Force $out | Out-Null
$dur = (Get-Content alos\audio\vo_v4\lines.json | ConvertFrom-Json).duration

Write-Host "`n[audio] SFX cues + mix (-14 LUFS)" -ForegroundColor Cyan
$env:CUES_VO_DIR = "alos/audio/vo_v4"; $env:CUES_TRANSCRIPT = "alos/docs/transcript_v4.json"; $env:CUES_OUT = "alos/docs/cues_v4.json"
python tools/alos_cues.py
if ($LASTEXITCODE -ne 0) { throw "cues failed" }
python tools/mix_audio.py alos/docs/cues_v4.json "$out/soundtrack.wav"
if ($LASTEXITCODE -ne 0) { throw "mix failed" }

$env:STUDIO     = "alos/studio_v4/index.html"
$env:THEME      = "light"
$env:INTRO      = "1"
$env:RENDER_LOG = "$out/render.log"
$env:SEGMENTS   = "$out/_segments"
Write-Host "`n[light] Rendering ${dur}s @ 60fps, $Sub subframes, $Workers workers  (log: $($env:RENDER_LOG))" -ForegroundColor Cyan
node studio/render.mjs 0 $dur $Workers $Sub "$out/video_silent.mp4"
if ($LASTEXITCODE -ne 0) { throw "render failed" }

Write-Host "[light] Muxing" -ForegroundColor Cyan
ffmpeg -v error -stats -y -i "$out/video_silent.mp4" -i "$out/soundtrack.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest "$out/disruptionops_launch_v4.mp4"
if ($LASTEXITCODE -ne 0) { throw "mux failed" }
Write-Host "DONE  ->  D:\video-1\alos\output\v4\disruptionops_launch_v4.mp4" -ForegroundColor Green
