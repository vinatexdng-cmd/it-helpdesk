$subnet = "192.168.1"

1..254 | ForEach-Object {
    $ip = "$subnet.$_"
    if (Test-Connection -ComputerName $ip -Count 1 -Quiet) {
        Write-Host "$ip is online" -ForegroundColor Green
    }
}