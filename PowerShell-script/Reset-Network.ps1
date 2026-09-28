Write-Host "Clearing DNS Cache..." -ForegroundColor Yellow
Clear-DnsClientCache

Write-Host "Resetting TCP/IP stack..." -ForegroundColor Yellow
Start-Process "netsh" -ArgumentList "int ip reset" -Verb RunAs -Wait

Write-Host "Releasing IP address..." -ForegroundColor Yellow
ipconfig /release

Start-Sleep -Seconds 2

Write-Host "Renewing IP address..." -ForegroundColor Yellow
ipconfig /renew

Write-Host "Network reset complete!" -ForegroundColor Green