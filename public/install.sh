#!/bin/sh
set -eu

repo="B-Divyesh/sf-manuscript-entity-indexer"
base="https://github.com/$repo/releases/latest/download"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT INT TERM

curl -fsSL "$base/latest.json" -o "$tmp_dir/latest.json"
asset_info="$(python3 - "$tmp_dir/latest.json" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as handle:
    assets = json.load(handle)["assets"]
matches = [item for item in assets if item["name"].endswith(".AppImage")]
if not matches:
    raise SystemExit("No Linux AppImage is available in this release.")
print(matches[0]["name"])
print(matches[0]["url"])
PY
)"
asset="$(printf '%s\n' "$asset_info" | sed -n '1p')"
asset_url="$(printf '%s\n' "$asset_info" | sed -n '2p')"
curl -fsSL "$asset_url" -o "$tmp_dir/$asset"
curl -fsSL "$base/SHA256SUMS" -o "$tmp_dir/SHA256SUMS"
(cd "$tmp_dir" && grep "  $asset\$" SHA256SUMS | sha256sum -c -)

install_dir="${XDG_BIN_HOME:-$HOME/.local/bin}"
mkdir -p "$install_dir"
install -m 0755 "$tmp_dir/$asset" "$install_dir/manuscript-entity-indexer"
printf 'Installed Manuscript Entity Indexer to %s\n' "$install_dir/manuscript-entity-indexer"
