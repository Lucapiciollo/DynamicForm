#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Build del Web Component DynamicForm.

.DESCRIPTION
    1. Esegue `ng build dynamicform-wc` (produzione, output-hashing none).
    2. Concatena runtime.js + polyfills.js + main.js in un singolo file
       distribuibile: dist/dynamicform-wc/dynamicform-wc.js
    3. Copia gli eventuali file .css nella stessa cartella output.

.PARAMETER Dev
    Se specificato, usa la configurazione "development" (sourcemap, no ottimizzazione).

.EXAMPLE
    .\scripts\build-wc.ps1
    .\scripts\build-wc.ps1 -Dev
#>
param(
    [switch]$Dev
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root     = $PSScriptRoot | Split-Path -Parent
$outDir   = Join-Path $root 'dist\dynamicform-wc'
$outFile  = Join-Path $outDir 'dynamicform-wc.js'
$outCss   = Join-Path $outDir 'dynamicform-wc.css'
$config   = if ($Dev) { 'development' } else { 'production' }

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  DynamicForm — Web Component Build" -ForegroundColor Cyan
Write-Host "  Configurazione : $config" -ForegroundColor Cyan
Write-Host "  Output         : $outDir" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# ── 1. Clean output ──────────────────────────────────────────────────────────
if (Test-Path $outDir) {
    Write-Host "→ Pulizia cartella output precedente..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $outDir
}

# ── 2. ng build ──────────────────────────────────────────────────────────────
Write-Host "→ Avvio ng build dynamicform-wc --configuration $config ..." -ForegroundColor Yellow
Push-Location $root
try {
    & npx ng build dynamicform-wc --configuration $config
    if ($LASTEXITCODE -ne 0) {
        throw "ng build ha restituito exit code $LASTEXITCODE"
    }
} finally {
    Pop-Location
}

# ── 3. Concatena JS ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "→ Concatenazione bundle JS..." -ForegroundColor Yellow

# Ordine di concatenazione (Webpack):
#   1. runtime.js   — bootstrap Webpack, module registry (DEVE essere primo)
#   2. polyfills.js — polyfill browser
#   3. chunk numerati (es. 1234.js) — lazy chunks Material/libs, si auto-registrano
#   4. common.js    — shared chunk (se esiste)
#   5. main.js      — entry Angular (DEVE essere ultimo, fa il bootstrap)
#
# Ogni chunk numerato chiama `self["webpackChunkapp"]` per registrarsi nel
# registry di runtime.js, quindi concatenarli tutti produce un bundle funzionante.

$orderedFiles = [System.Collections.Generic.List[string]]::new()

$addIfExists = {
    param($name)
    $p = Join-Path $outDir $name
    if (Test-Path $p) { $orderedFiles.Add($p) }
}

& $addIfExists 'runtime.js'
& $addIfExists 'polyfills.js'

# Chunk numerati — ordinati per nome (l'ordine tra di loro non è rilevante)
Get-ChildItem -Path $outDir -Filter '*.js' |
    Where-Object { $_.Name -match '^\d+\.js$' } |
    Sort-Object Name |
    ForEach-Object { $orderedFiles.Add($_.FullName) }

& $addIfExists 'common.js'
& $addIfExists 'main.js'

if ($orderedFiles.Count -eq 0) {
    throw "Nessun file JS trovato in $outDir — il build potrebbe essere fallito."
}

$sb = [System.Text.StringBuilder]::new()
foreach ($file in $orderedFiles) {
    $content = Get-Content -Raw -Encoding UTF8 $file
    $null = $sb.AppendLine("/* === $([System.IO.Path]::GetFileName($file)) === */")
    $null = $sb.AppendLine($content)
    Write-Host "  + $([System.IO.Path]::GetFileName($file))  ($([math]::Round($content.Length/1KB, 1)) KB)"
}

[System.IO.File]::WriteAllText($outFile, $sb.ToString(), [System.Text.Encoding]::UTF8)
$finalKb = [math]::Round((Get-Item $outFile).Length / 1KB, 1)
Write-Host "  ✓ dynamicform-wc.js → $finalKb KB total" -ForegroundColor Green

# ── 4. Unifica CSS ───────────────────────────────────────────────────────────
$cssFiles = Get-ChildItem -Path $outDir -Filter '*.css' -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -ne 'dynamicform-wc.css' }

if ($cssFiles) {
    Write-Host ""
    Write-Host "→ Concatenazione CSS..." -ForegroundColor Yellow
    $cssSb = [System.Text.StringBuilder]::new()
    foreach ($f in $cssFiles) {
        $null = $cssSb.AppendLine("/* === $($f.Name) === */")
        $null = $cssSb.AppendLine((Get-Content -Raw -Encoding UTF8 $f.FullName))
        Write-Host "  + $($f.Name)  ($([math]::Round($f.Length/1KB, 1)) KB)"
    }
    [System.IO.File]::WriteAllText($outCss, $cssSb.ToString(), [System.Text.Encoding]::UTF8)
    $cssKb = [math]::Round((Get-Item $outCss).Length / 1KB, 1)
    Write-Host "  ✓ dynamicform-wc.css → $cssKb KB" -ForegroundColor Green
}

# ── 5. Riepilogo ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  Build completato!" -ForegroundColor Green
Write-Host ""
Write-Host "  File distribuibili:" -ForegroundColor White
Write-Host "    $outFile" -ForegroundColor White
if (Test-Path $outCss) {
    Write-Host "    $outCss" -ForegroundColor White
}
Write-Host ""
Write-Host "  Utilizzo in HTML:" -ForegroundColor White
Write-Host '    <link rel="stylesheet" href="dynamicform-wc.css">' -ForegroundColor DarkCyan
Write-Host '    <script src="dynamicform-wc.js"></script>' -ForegroundColor DarkCyan
Write-Host '    <dynamic-form id="myForm"></dynamic-form>' -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  Configurazione via JS:" -ForegroundColor White
Write-Host '    const el = document.getElementById("myForm");' -ForegroundColor DarkCyan
Write-Host '    el.questions = myConfigForm;   // ConfigForm object' -ForegroundColor DarkCyan
Write-Host '    el.layout = "tabs";            // "default" | "tabs" | "steps"' -ForegroundColor DarkCyan
Write-Host '    el.addEventListener("onFormCreate", e => console.log(e.detail));' -ForegroundColor DarkCyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
