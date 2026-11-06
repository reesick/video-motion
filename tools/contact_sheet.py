"""Build timestamped contact sheets from extracted frames.

Usage: python tools/contact_sheet.py <frames_dir> <out_dir> [fps=2] [cols=4] [rows=4]
Frames must be named f_0001.jpg ... (ffmpeg -vf fps=N output).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

frames_dir = Path(sys.argv[1])
out_dir = Path(sys.argv[2])
fps = float(sys.argv[3]) if len(sys.argv) > 3 else 2.0
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
rows = int(sys.argv[5]) if len(sys.argv) > 5 else 4

out_dir.mkdir(parents=True, exist_ok=True)
frames = sorted(frames_dir.glob("f_*.jpg"))
if not frames:
    sys.exit("no frames found")

w, h = Image.open(frames[0]).size
label_h = 28
per = cols * rows
try:
    font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
except OSError:
    font = ImageFont.load_default()

for s in range(0, len(frames), per):
    chunk = frames[s:s + per]
    sheet = Image.new("RGB", (cols * w, rows * (h + label_h)), "white")
    d = ImageDraw.Draw(sheet)
    for i, fp in enumerate(chunk):
        idx = s + i
        t = idx / fps  # ffmpeg fps filter: frame n covers t = n/fps
        x, y = (i % cols) * w, (i // cols) * (h + label_h)
        sheet.paste(Image.open(fp), (x, y + label_h))
        d.text((x + 6, y + 3), f"#{idx + 1:04d}  t={t:6.2f}s", fill="black", font=font)
    name = out_dir / f"sheet_{s // per + 1:02d}_{chunk[0].stem}-{chunk[-1].stem}.jpg"
    sheet.save(name, quality=85)
    print(name)
