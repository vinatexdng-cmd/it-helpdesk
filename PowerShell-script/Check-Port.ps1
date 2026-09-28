$ip = Read-Host "Enter IP or domain"
$port = Read-Host "Enter port number"

$result = Test-NetConnection -ComputerName $ip -Port $port

if ($result.TcpTestSucceeded) {
    Write-Host "$ip:$port is OPEN" -ForegroundColor Green
} else {
    Write-Host "$ip:$port is CLOSED or BLOCKED" -ForegroundColor Red
}
