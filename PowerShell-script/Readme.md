# PowerShell Network Scripts

Tập hợp các PowerShell script hỗ trợ kiểm tra, giám sát và xử lý sự cố mạng dành cho IT Helpdesk.

## 📜 Danh sách script:

- **Test-Network.ps1**  
  Kiểm tra kết nối đến nhiều host một lúc bằng `Test-Connection`.

- **Scan-Subnet.ps1**  
  Quét IP trong dải mạng nội bộ (LAN) để xác định thiết bị online.

- **Get-NetworkConfig.ps1**  
  Hiển thị địa chỉ IP, DNS, Gateway đang dùng.

- **Reset-Network.ps1**  
  Làm mới kết nối mạng, reset TCP/IP và DNS cache.

- **Check-Port.ps1**  
  Kiểm tra port mở trên IP hoặc domain cụ thể.

- **Monitor-Internet.ps1**  
  Ghi log trạng thái kết nối Internet mỗi phút vào file `.txt`.

## 🛠 Yêu cầu:
- Windows PowerShell 5.1+
- Một số script yêu cầu quyền Admin
