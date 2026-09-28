Write-Host "IP Address Information:" -ForegroundColor Cyan
Get-NetIPAddress | Where-Object {$_.AddressFamily -eq "IPv4"} | Format-Table

Write-Host "`nGateway & DNS Settings:" -ForegroundColor Cyan
Get-NetIPConfiguration | Format-List InterfaceAlias,IPv4Address,DNSServer,DefaultGateway