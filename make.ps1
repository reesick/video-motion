# One command to build the whole video:  powershell -ExecutionPolicy Bypass -File make.ps1
# Steps: render frames (progress bar) -> mix audio -> mux final mp4 -> side-by-side compare mp4.
param([int]$Workers = 6, [int]$Sub = 4)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$ref = "Explainer Video for Madison_ AI Powered Digital Marketing Tool_1080p.mp4"

Write-Host "`n[1/4] Rendering 57.5s @ 60fps, $Sub subframes, $Workers workers (log: output\render.log)" -ForegroundColor Cyan
node studio/render.mjs 0 57.5 $Workers $Sub output/video_silent.mp4
if ($LASTEXITCODE -ne 0) { throw "render failed" }

Write-Host "`n[2/4] Mixing voice + music + SFX (-14 LUFS)" -ForegroundColor Cyan
python tools/mix_audio.py docs/cues.json output/soundtrack.wav
if ($LASTEXITCODE -ne 0) { throw "mix failed" }

Write-Host "`n[3/4] Muxing final video" -ForegroundColor Cyan
ffmpeg -v error -stats -y -i output/video_silent.mp4 -i output/soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest output/madison_first_half.mp4
if ($LASTEXITCODE -ne 0) { throw "mux failed" }

Write-Host "`n[4/4] Building side-by-side comparison" -ForegroundColor Cyan
python tools/compare.py video "$ref" output/madison_first_half.mp4 output/side_by_side.mp4 0 57.5
if ($LASTEXITCODE -ne 0) { throw "compare failed" }

Write-Host "`nDONE" -ForegroundColor Green
Write-Host "  final:        output\madison_first_half.mp4"
Write-Host "  side-by-side: output\side_by_side.mp4"
