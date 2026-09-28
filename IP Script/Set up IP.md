# 📡 Hướng dẫn cấu hình IP tĩnh (Static IP Configuration)

Tài liệu hướng dẫn các cách cấu hình IP tĩnh dành cho kỹ thuật viên mạng, thực tập sinh IT Helpdesk hoặc học viên CCNA.

## ✅ 1. Cấu hình IP tĩnh trên Windows (Giao diện đồ họa)

### Các bước:
1. Vào **Control Panel** → `Network and Sharing Center`  
2. Chọn **Change adapter settings**  
3. Nhấn chuột phải vào `Ethernet` hoặc `Wi-Fi` → `Properties`  
4. Chọn `Internet Protocol Version 4 (TCP/IPv4)` → `Properties`  
5. Chọn **Use the following IP address**  
6. Nhập:  
   - IP address: `192.168.1.100`  
   - Subnet mask: `255.255.255.0`  
   - Default gateway: `192.168.1.1`  
   - Preferred DNS: `8.8.8.8`  
7. Nhấn OK để lưu cấu hình

## ✅ 2. Cấu hình IP tĩnh bằng PowerShell (Windows)

```powershell
# Đặt IP, subnet mask, gateway
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.100 -PrefixLength 24 -DefaultGateway 192.168.1.1

# Đặt DNS
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses ("8.8.8.8", "1.1.1.1")
```

📌 Lưu ý:
- Chạy PowerShell bằng **Run as Administrator**
- Thay `Ethernet` bằng `Wi-Fi` nếu bạn dùng Wi-Fi

## ✅ 3. Cấu hình IP tĩnh trên Cisco Packet Tracer

### Trên máy tính (PC):
1. Vào `Desktop` → `IP Configuration`  
2. Chọn Static  
3. Nhập:  
   - IP: `192.168.1.10`  
   - Subnet Mask: `255.255.255.0`  
   - Default Gateway: `192.168.1.1`

### Trên Router/Switch:
```plaintext
enable
configure terminal
interface FastEthernet0/0
ip address 192.168.1.1 255.255.255.0
no shutdown
exit
```

## 🧠 Kiến thức liên quan

- **IP tĩnh**: Gán thủ công, không thay đổi khi restart  
- **IP động (DHCP)**: Cấp tự động từ router/modem  
- IP tĩnh thường dùng cho: Server, máy in, thiết bị mạng cố định
