"""List / download Mixkit music or sound effects (free license, https://mixkit.co/license/).

Mixkit pages embed a JSON-LD ItemList with name, artist, duration and mp3 url.

Usage:
  python tools/mixkit.py list <page_url>                 # prints index, name, genre, duration, url
  python tools/mixkit.py get  <mp3_url> <out_path>       # downloads one file
Examples of page urls:
  https://mixkit.co/free-stock-music/tag/corporate/
  https://mixkit.co/free-sound-effects/whoosh/
"""
import json
import re
import sys
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"}


def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()


def items(page_url):
    html = fetch(page_url).decode("utf-8", "replace")
    out = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
        try:
            data = json.loads(block)
        except json.JSONDecodeError:
            continue
        for node in data.get("@graph", []):
            for it in node.get("itemListElement", []) or []:
                if isinstance(it, dict) and str(it.get("url", "")).endswith(".mp3"):
                    out.append(it)
    if not out:  # sound-effect pages: fall back to raw mp3 links + nearby titles
        for m in re.finditer(r'https://assets\.mixkit\.co/[^"\'\s]+\.mp3', html):
            out.append({"name": "?", "url": m.group(0)})
    seen, uniq = set(), []
    for it in out:
        if it["url"] not in seen:
            seen.add(it["url"])
            uniq.append(it)
    return uniq


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "list":
        for i, it in enumerate(items(sys.argv[2])):
            print(f"{i:3d} | {it.get('name','?'):32s} | {it.get('genre',''):12s} | {it.get('byArtist','') if isinstance(it.get('byArtist'), str) else '':18s} | {it.get('duration',''):8s} | {it['url']}")
    elif cmd == "get":
        data = fetch(sys.argv[2])
        open(sys.argv[3], "wb").write(data)
        print(f"saved {sys.argv[3]} ({len(data)} bytes)")
