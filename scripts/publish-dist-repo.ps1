param(
  [string]$TargetPath = "..\wpt-site-dist",
  [string]$ZipName = "wpt-site-dist.zip",
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$distPath = Join-Path $repoRoot "dist"
$cpanelPath = Join-Path $repoRoot ".cpanel.yml"
$resolvedTarget = [System.IO.Path]::GetFullPath((Join-Path $repoRoot $TargetPath))
$targetDistPath = Join-Path $resolvedTarget "dist"
$zipPath = Join-Path $resolvedTarget $ZipName

if (-not $SkipBuild) {
  Push-Location $repoRoot
  try {
    npm run build
  }
  finally {
    Pop-Location
  }
}

if (-not (Test-Path $distPath)) {
  throw "Build output not found at $distPath"
}

if (-not (Test-Path $resolvedTarget)) {
  New-Item -ItemType Directory -Path $resolvedTarget | Out-Null
}

if (-not (Test-Path (Join-Path $resolvedTarget ".git"))) {
  git -C $resolvedTarget init | Out-Null
}

Get-ChildItem -Path $resolvedTarget -Force |
  Where-Object { $_.Name -ne ".git" } |
  Remove-Item -Recurse -Force

New-Item -ItemType Directory -Path $targetDistPath -Force | Out-Null
Copy-Item -Path (Join-Path $distPath "*") -Destination $targetDistPath -Recurse -Force

if (Test-Path $cpanelPath) {
  Copy-Item -Path $cpanelPath -Destination (Join-Path $resolvedTarget ".cpanel.yml") -Force
}

if (Test-Path $zipPath) {
  Remove-Item -Path $zipPath -Force
}

Compress-Archive -Path $targetDistPath -DestinationPath $zipPath -Force

$sourceCommit = "unavailable"
try {
  $sourceCommit = (git -C $repoRoot rev-parse --short HEAD).Trim()
}
catch {
}

$generatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss K")
$deploymentInfo = @(
  "Source repo: wpt-site"
  "Source commit: $sourceCommit"
  "Generated at: $generatedAt"
  "Artifact: $ZipName"
)

Set-Content -Path (Join-Path $resolvedTarget "DEPLOYMENT.txt") -Value $deploymentInfo

if (-not (Test-Path (Join-Path $resolvedTarget ".gitignore"))) {
  Set-Content -Path (Join-Path $resolvedTarget ".gitignore") -Value @(
    ""
  )
}

if (-not (Test-Path (Join-Path $resolvedTarget "README.md"))) {
  Set-Content -Path (Join-Path $resolvedTarget "README.md") -Value @(
    "# WPT Site Deploy Artifacts"
    ""
    "This repository stores build output generated from the main"
    "'wpt-site' repository."
    ""
    "Primary artifact: 'wpt-site-dist.zip'"
  )
}

Write-Host "Deployment repository ready at $resolvedTarget"
Write-Host "Zip artifact: $zipPath"
