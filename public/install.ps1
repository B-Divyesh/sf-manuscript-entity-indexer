$ErrorActionPreference = "Stop"
$repo = "B-Divyesh/sf-manuscript-entity-indexer"
$base = "https://github.com/$repo/releases/latest/download"
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("mei-" + [System.Guid]::NewGuid())
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
  $manifestPath = Join-Path $tempDir "latest.json"
  Invoke-WebRequest "$base/latest.json" -OutFile $manifestPath
  $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
  $asset = $manifest.assets | Where-Object { $_.name -match '\.msi$' } | Select-Object -First 1
  if (-not $asset) { throw "No Windows MSI is available in this release." }

  $msiPath = Join-Path $tempDir $asset.name
  $sumsPath = Join-Path $tempDir "SHA256SUMS"
  Invoke-WebRequest $asset.url -OutFile $msiPath
  Invoke-WebRequest "$base/SHA256SUMS" -OutFile $sumsPath
  $line = Get-Content $sumsPath | Where-Object { $_ -match "  $([regex]::Escape($asset.name))$" } | Select-Object -First 1
  if (-not $line) { throw "The release has no checksum for $($asset.name)." }
  $expected = ($line -split '\s+')[0].ToLowerInvariant()
  $actual = (Get-FileHash $msiPath -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($expected -ne $actual) { throw "The downloaded MSI checksum did not match." }

  Start-Process msiexec.exe -ArgumentList "/i `"$msiPath`"" -Wait
  Write-Host "Verified and installed Manuscript Entity Indexer."
} finally {
  Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}
