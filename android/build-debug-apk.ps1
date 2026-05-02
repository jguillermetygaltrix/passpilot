# Build PassPilot Android debug APK using Android Studio's bundled JBR (Java 21).
# Drop-in replacement for ./gradlew assembleDebug — handles Java env properly
# and works around PowerShell's stderr-as-error quirk for native commands.
#
# Usage:
#   PowerShell -NoProfile -ExecutionPolicy Bypass -File build-debug-apk.ps1
#
# First run takes 5-15 min (downloads Gradle dist, Android SDK Build-Tools 35).
# Subsequent runs are 30s-2min depending on what changed.
#
# Output APK path on success:
#   app/build/outputs/apk/debug/app-debug.apk

$jbr = 'C:\Program Files\Android\Android Studio\jbr'
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$projectDir = 'C:\Users\janky\OneDrive\Documents\Galtrix\Appstore\PassPilot\android'

if (-not (Test-Path "$jbr\bin\java.exe")) { Write-Host "FAIL: JBR not at $jbr" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $sdk)) { Write-Host "FAIL: SDK not at $sdk" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $projectDir)) { Write-Host "FAIL: Project not at $projectDir" -ForegroundColor Red; exit 1 }

$env:JAVA_HOME = $jbr
$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:Path = "$jbr\bin;$env:Path"

Write-Host '=== Build environment ===' -ForegroundColor Cyan
Write-Host "JAVA_HOME    = $env:JAVA_HOME"
Write-Host "ANDROID_HOME = $env:ANDROID_HOME"

Set-Location $projectDir

# Write local.properties so Gradle finds the SDK explicitly
$localPropsPath = Join-Path $projectDir 'local.properties'
$sdkEsc = $sdk -replace '\\', '\\\\'
"sdk.dir=$sdkEsc" | Out-File -FilePath $localPropsPath -Encoding ascii -Force
Write-Host "Wrote $localPropsPath" -ForegroundColor Green

Write-Host ''
Write-Host '=== Running gradlew assembleDebug ===' -ForegroundColor Cyan
Write-Host '(first build downloads Gradle 8.14.3 + Build-Tools 35, can take 5-15 min)'
Write-Host ''

# Use cmd /c to fully detach env handling — this is the most reliable
# way to invoke gradlew.bat with our JAVA_HOME on Windows. Pass
# -WorkingDirectory so the cmd subprocess starts in the project (Start-Process
# doesn't inherit PowerShell's Set-Location cwd by default).
$proc = Start-Process -FilePath 'cmd.exe' `
    -ArgumentList '/c', '.\gradlew.bat', 'assembleDebug', '--no-daemon' `
    -WorkingDirectory $projectDir `
    -NoNewWindow -PassThru -Wait `
    -RedirectStandardOutput (Join-Path $projectDir 'build-stdout.log') `
    -RedirectStandardError (Join-Path $projectDir 'build-stderr.log')

Write-Host ''
Write-Host "Gradle exit code: $($proc.ExitCode)" -ForegroundColor $(if ($proc.ExitCode -eq 0) { 'Green' } else { 'Red' })

if ($proc.ExitCode -eq 0) {
    $apk = Join-Path $projectDir 'app\build\outputs\apk\debug\app-debug.apk'
    if (Test-Path $apk) {
        $sizeKb = [math]::Round((Get-Item $apk).Length / 1024, 1)
        Write-Host "[OK] APK built: $apk ($sizeKb KB)" -ForegroundColor Green
    } else {
        Write-Host "[WARN] gradle exit 0 but APK not found at expected path" -ForegroundColor Yellow
    }
} else {
    Write-Host '=== Last 30 lines of stdout ===' -ForegroundColor Yellow
    Get-Content 'build-stdout.log' -Tail 30 -ErrorAction SilentlyContinue
    Write-Host '=== Last 30 lines of stderr ===' -ForegroundColor Yellow
    Get-Content 'build-stderr.log' -Tail 30 -ErrorAction SilentlyContinue
}

exit $proc.ExitCode
