# Render the 5 candidate intros (light theme only), each with voice-over + music + SFX, cut where the intro ends.
#   powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make_intros.ps1            # all 5
#   powershell -ExecutionPolicy Bypass -File D:\video-1\alos\make_intros.ps1 -Only 1,4  # just some
# Output: alos\output\intros\intro_1.mp4 … intro_5.mp4  +  intros_all.mp4 (all five back to back)
param([int[]]$Only = @(1, 2, 3, 4, 5), [int]$Workers = 6, [int]$Sub = 4)
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)          # D:\video-1
$out = "alos/output/intros"
New-Item -ItemType Directory -Force $out | Out-Null

# intro ends just after the 46,000 card leaves (= start of "Suppliers overcharge" + 0.35 s)
$vo  = Get-Content alos\audio\vo\lines.json | ConvertFrom-Json
$end = [math]::Round($vo.lines[2].start + 0.35, 2)

$env:STUDIO = "alos/studio/index.html"
$env:THEME  = "light"
foreach ($v in $Only) {
  $env:INTRO      = "$v"
  $env:RENDER_LOG = "$out/render_intro_$v.log"
  $env:SEGMENTS   = "$out/_segments_$v"
  Write-Host "`n[intro $v] rendering 0-${end}s, light, 60fps, $Sub subframes, $Workers workers" -ForegroundColor Cyan
  node studio/render.mjs 0 $end $Workers $Sub "$out/intro_${v}_silent.mp4"
  if ($LASTEXITCODE -ne 0) { throw "render failed (intro $v)" }

  python tools/intro_cues.py $v $end "$out/cues_intro_$v.json"
  if ($LASTEXITCODE -ne 0) { throw "cues failed (intro $v)" }
  python tools/mix_audio.py "$out/cues_intro_$v.json" "$out/intro_${v}_audio.wav"
  if ($LASTEXITCODE -ne 0) { throw "mix failed (intro $v)" }

  ffmpeg -v error -y -i "$out/intro_${v}_silent.mp4" -i "$out/intro_${v}_audio.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest "$out/intro_$v.mp4"
  if ($LASTEXITCODE -ne 0) { throw "mux failed (intro $v)" }
  Write-Host "DONE [intro $v]  ->  D:\video-1\alos\output\intros\intro_$v.mp4" -ForegroundColor Green
}

# one reel with all rendered intros back to back, each labelled
$list = "$out/_reel.txt"; Remove-Item $list -ErrorAction SilentlyContinue
foreach ($v in $Only) {
  ffmpeg -v error -y -i "$out/intro_$v.mp4" -vf "drawtext=fontfile='C\:/Windows/Fonts/arialbd.ttf':text='INTRO $v':x=24:y=20:fontsize=34:fontcolor=white:box=1:boxcolor=0x1f1b3dcc:boxborderw=12" -c:v h264_nvenc -cq 18 -c:a copy "$out/_lab_$v.mp4"
  Add-Content $list "file '_lab_$v.mp4'"
}
ffmpeg -v error -y -f concat -safe 0 -i $list -c copy "$out/intros_all.mp4"
Write-Host "`nALL DONE  ->  D:\video-1\alos\output\intros\intros_all.mp4" -ForegroundColor Green
