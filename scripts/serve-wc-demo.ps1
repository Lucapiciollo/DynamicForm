#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build WC + apri la pagina demo nel browser.

.DESCRIPTION
    1. (Opzionale) Esegue build:wc se il bundle non esiste ancora o se -Rebuild.
    2. Avvia http-server sulla root del progetto (porta 8080).
    3. Apre il browser sulla pagina demo.

.PARAMETER Rebuild
    Forza il rebuild del WC prima di avviare il server.

.PARAMETER Dev
    Usa configurazione development nel rebuild.

.PARAMETER Port
    Porta per il server HTTP (default: 8080).

.EXAMPLE
    .\scripts\serve-wc-demo.ps1
    .\scripts\serve-wc-demo.ps1 -Rebuild
    .\scripts\serve-wc-demo.ps1 -Rebuild -Dev
#>
param(
    [switch]$Rebuild,
    [switch]$Dev,
    [int]$Port = 8080
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root    = $PSScriptRoot | Split-Path -Parent
$bundle  = Join-Path $root 'dist\dynamicform-wc\dynamicform-wc.js'
$demoUrl = "http://localhost:$Port/projects/dynamicform-wc/demo/index.html"

# ── 1. Build se necessario ────────────────────────────────────────────────────
if ($Rebuild -or -not (Test-Path $bundle)) {
    $buildArgs = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File',
                   (Join-Path $PSScriptRoot 'build-wc.ps1'))
    if ($Dev) { $buildArgs += '-Dev' }
    Write-Host "→ Esecuzione build-wc.ps1..." -ForegroundColor Cyan
    pwsh @buildArgs
}

# ── 2. Verifica http-server ───────────────────────────────────────────────────
$httpServer = Get-Command 'http-server' -ErrorAction SilentlyContinue
if (-not $httpServer) {
    Write-Host "→ Installazione http-server (npx)..." -ForegroundColor Yellow
}

# ── 3. Apri browser ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "→ Demo disponibile su: $demoUrl" -ForegroundColor Green
Start-Process $demoUrl

# ── 4. Avvia server ──────────────────────────────────────────────────────────
Write-Host "→ Avvio http-server su porta $Port (Ctrl+C per fermare)" -ForegroundColor Cyan
Write-Host ""
Push-Location $root
try {
    & npx http-server . --port $Port --cors -c-1 --silent
} finally {
    Pop-Location
}
