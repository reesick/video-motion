"""Tile any set of images into labelled 2x2 grids (1920x1080) for quick review.

Usage: python tools/tile_images.py <in_dir> <out_dir>
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
files = sorted([p for p in src.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp")])
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22)
for g in range(0, len(files), 4):
    sheet = Image.new("RGB", (1920, 1080), "white")
    d = ImageDraw.Draw(sheet)
    for i, p in enumerate(files[g:g + 4]):
        im = Image.open(p).convert("RGB")
        im.thumbnail((960, 540), Image.LANCZOS)
        x, y = (i % 2) * 960, (i // 2) * 540
        sheet.paste(im, (x + (960 - im.width) // 2, y + (540 - im.height) // 2))
        d.rectangle([x, y, x + 420, y + 30], fill="black")
        d.text((x + 6, y + 3), f"{g + i + 1}: {p.name}", fill="yellow", font=font)
    f = out / f"tiles_{g // 4 + 1:02d}.jpg"
    sheet.save(f, quality=88)
    print(f)
