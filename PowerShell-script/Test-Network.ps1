$hosts = @("google.com", "facebook.com", "192.168.1.1")

foreach ($host in $hosts) {
    Write-Host "Testing $host..."
    if (Test-Connection -ComputerName $host -Count 2 -Quiet) {
        Write-Host "$host is reachable.`n" -ForegroundColor Green
    } else {
        Write-Host "$host is unreachable.`n" -ForegroundColor Red
    }
}
