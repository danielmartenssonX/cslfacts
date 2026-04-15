/**
 * Paketerar dist/ med ett start-skript för Windows.
 * Kör: node scripts/package-dist.mjs
 * Resultat: dist/ innehåller start.bat som startar en lokal webbserver.
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  console.error('dist/ finns inte. Kör "npm run build" först.');
  process.exit(1);
}

// start.bat — startar Pythons inbyggda HTTP-server eller PowerShell-server
const batContent = `@echo off
title cslFacts - lokal server
echo.
echo  =======================================
echo    cslFacts - startar lokal webbserver
echo  =======================================
echo.

REM Försök Python först (vanligast på nyare Windows)
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  Startar via Python...
    echo  Oppna http://localhost:8080 i webblasaren
    echo  Tryck Ctrl+C for att stanga
    echo.
    start http://localhost:8080
    python -m http.server 8080
    goto :eof
)

REM Försök Python3
where python3 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  Startar via Python3...
    echo  Oppna http://localhost:8080 i webblasaren
    echo  Tryck Ctrl+C for att stanga
    echo.
    start http://localhost:8080
    python3 -m http.server 8080
    goto :eof
)

REM Fallback: PowerShell inbyggd HTTP-server
echo  Startar via PowerShell...
echo  Oppna http://localhost:8080 i webblasaren
echo  Stang detta fonster for att stoppa servern
echo.
start http://localhost:8080
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$root='%~dp0';" ^
  "$types=@{'.html'='text/html';'.js'='application/javascript';'.css'='text/css';'.png'='image/png';'.svg'='image/svg+xml';'.json'='application/json';'.woff2'='font/woff2'};" ^
  "$l=[Net.HttpListener]::new(); $l.Prefixes.Add('http://localhost:8080/');" ^
  "$l.Start(); Write-Host 'Server startad pa http://localhost:8080';" ^
  "while($l.IsListening){" ^
  "  $c=$l.GetContext();" ^
  "  $p=$c.Request.Url.LocalPath -replace '^/$','/index.html';" ^
  "  $f=Join-Path $root $p.TrimStart('/');" ^
  "  if(Test-Path $f -PathType Leaf){" ^
  "    $ext=[IO.Path]::GetExtension($f);" ^
  "    $c.Response.ContentType=if($types[$ext]){$types[$ext]}else{'application/octet-stream'};" ^
  "    $bytes=[IO.File]::ReadAllBytes($f);" ^
  "    $c.Response.ContentLength64=$bytes.Length;" ^
  "    $c.Response.OutputStream.Write($bytes,0,$bytes.Length)" ^
  "  }else{$c.Response.StatusCode=404}" ^
  "  $c.Response.Close()}"
`;

writeFileSync(join(distDir, 'start.bat'), batContent, 'utf-8');
console.log('✓ dist/start.bat skapad');
console.log('');
console.log('Leverera dist/-mappen. Användaren dubbelklickar start.bat.');
