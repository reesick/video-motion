"""Grab full-res stills at given timestamps and tile them 2x2 (each 960x540) for close inspection.

Usage: python tools/grab_stills.py <video> <out_dir> t1 t2 t3 ...
"""
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

video, out = sys.argv[1], Path(sys.argv[2])
times = [float(t) for t in sys.argv[3:]]
out.mkdir(parents=True, exist_ok=True)
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)

paths = []
for t in times:
    p = out / f"still_{t:06.2f}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", video, "-frames:v", "1", str(p)], check=True)
    paths.append((t, p))

for g in range(0, len(paths), 4):
    sheet = Image.new("RGB", (1920, 1080), "white")
    d = ImageDraw.Draw(sheet)
    for i, (t, p) in enumerate(paths[g:g + 4]):
        im = Image.open(p).resize((960, 540), Image.LANCZOS)
        x, y = (i % 2) * 960, (i // 2) * 540
        sheet.paste(im, (x, y))
        d.rectangle([x, y, x + 120, y + 30], fill="black")
        d.text((x + 6, y + 3), f"{t:.2f}s", fill="yellow", font=font)
    sheet.save(out / f"grid_{g // 4 + 1:02d}.jpg", quality=90)
    print(out / f"grid_{g // 4 + 1:02d}.jpg")
