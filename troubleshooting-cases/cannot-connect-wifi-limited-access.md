# Sự cố: Không kết nối được Wi-Fi - Hiện trạng "Limited Access"

## Nguyên nhân có thể:
- Địa chỉ IP bị xung đột hoặc chưa được cấp phát.
- Bộ định tuyến (router) gặp lỗi.
- Driver card mạng có vấn đề.

## Cách xử lý:
1. Mở Command Prompt, chạy các lệnh:
```
ipconfig /release
ipconfig /renew
ipconfig /flushdns
```
2. Khởi động lại router.
3. Cập nhật hoặc cài lại driver card mạng.
4. Kiểm tra lại cấu hình IP (nên để tự động lấy IP).

---
