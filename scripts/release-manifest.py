import json
import os
import sys
from urllib.parse import quote

tag, directory, output = sys.argv[1:]
repo = os.environ.get("GITHUB_REPOSITORY", "B-Divyesh/sf-manuscript-entity-indexer")
assets = []
for name in sorted(os.listdir(directory)):
    if name in {"SHA256SUMS", "latest.json"}:
        continue
    assets.append({
        "name": name,
        "url": f"https://github.com/{repo}/releases/download/{quote(tag)}/{quote(name)}"
    })
with open(output, "w", encoding="utf-8") as handle:
    json.dump({"version": tag.removeprefix("v"), "tag": tag, "assets": assets}, handle, indent=2)
