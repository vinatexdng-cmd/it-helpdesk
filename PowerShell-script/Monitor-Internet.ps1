$logFile = "$PSScriptRoot\network-log.txt"

Write-Host "Monitoring internet connection every 60 seconds..."
Write-Host "Log file: $logFile`n"

while ($true) {
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $status = if (Test-Connection google.com -Count 1 -Quiet) { "Online" } else { "Offline" }
    "$time - $status" | Out-File -FilePath $logFile -Append
    Start-Sleep -Seconds 60
}