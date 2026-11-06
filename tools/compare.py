"""Side-by-side comparison: reference frame (left) vs our frame (right), labelled.

Usage:
  python tools/compare.py stills <ref_video> <our_stills_dir> <out_dir> t1 t2 ...   # ours = PNG stills t_XXX.XX.png
  python tools/compare.py video  <ref_video> <our_video> <out_mp4> [t0] [t1]          # full side-by-side mp4
"""
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

mode = sys.argv[1]
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)

if mode == "stills":
    ref, ours, out = sys.argv[2], Path(sys.argv[3]), Path(sys.argv[4])
    out.mkdir(parents=True, exist_ok=True)
    tiles = []
    for t in map(float, sys.argv[5:]):
        rp = out / f"ref_{t:06.2f}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", ref, "-frames:v", "1", str(rp)], check=True)
        a = Image.open(rp).convert("RGB").resize((960, 540), Image.LANCZOS)
        b = Image.open(ours / f"t_{t:06.2f}.png").convert("RGB").resize((960, 540), Image.LANCZOS)
        row = Image.new("RGB", (1920, 540), "white")
        row.paste(a, (0, 0)); row.paste(b, (960, 0))
        d = ImageDraw.Draw(row)
        for x, lab in ((0, f"REFERENCE {t:.2f}s"), (960, f"OURS {t:.2f}s")):
            d.rectangle([x, 0, x + 300, 36], fill="black"); d.text((x + 8, 4), lab, fill="yellow", font=font)
        tiles.append(row)
    for i in range(0, len(tiles), 2):
        sheet = Image.new("RGB", (1920, 1080), "white")
        for j, tl in enumerate(tiles[i:i + 2]):
            sheet.paste(tl, (0, j * 540))
        p = out / f"compare_{i // 2 + 1:02d}.jpg"
        sheet.save(p, quality=88); print(p)
elif mode == "video":
    ref, ours, out = sys.argv[2], sys.argv[3], sys.argv[4]
    t0 = sys.argv[5] if len(sys.argv) > 5 else "0"
    t1 = sys.argv[6] if len(sys.argv) > 6 else "57.5"
    vf = ("[0:v]trim=start={0}:end={1},setpts=PTS-STARTPTS,fps=60,scale=960:540,drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='REFERENCE':x=12:y=10:fontsize=26:fontcolor=yellow:box=1:boxcolor=black[a];"
          "[1:v]trim=start={0}:end={1},setpts=PTS-STARTPTS,scale=960:540,drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='OURS':x=12:y=10:fontsize=26:fontcolor=yellow:box=1:boxcolor=black[b];"
          "[a][b]hstack=inputs=2[v]").format(t0, t1)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", ref, "-i", ours, "-filter_complex", vf, "-map", "[v]", "-map", "1:a?",
                    "-c:v", "h264_nvenc", "-cq", "23", "-c:a", "aac", "-shortest", out], check=True)
    print(out)
