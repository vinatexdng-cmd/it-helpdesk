# Hướng dẫn Map ổ đĩa mạng trên Windows

1. Mở **File Explorer**.
2. Nhấp phải vào **This PC**, chọn **Map network drive...**.
3. Chọn ký tự ổ đĩa bạn muốn gán.
4. Nhập đường dẫn thư mục mạng (ví dụ: `\\servername\sharedfolder`).
5. Tick vào **Reconnect at sign-in** nếu muốn tự động kết nối lại khi đăng nhập.
6. Nhấn **Finish** để hoàn tất.

---

# Hướng dẫn map ổ đĩa mạng bằng CMD
Bạn có thể dùng lệnh CMD trên Windows để kết nối tới thư mục chia sẻ trong mạng LAN.

✅ Bước 1: Mở CMD

- Nhấn `Windows + R` → gõ `cmd` → Enter  
- Hoặc tìm “Command Prompt” trong Start Menu

---

✅ Bước 2: Map ổ đĩa

🔹 Cú pháp cơ bản:
```
net use [Ổ_đĩa] [\Địa_chỉ_mạng\Thư_mục] /persistent:yes
```
🔹 Ví dụ:
```
net use Z: \192.168.1.100\Projects /persistent:yes
```
---

## 🔑 Map với tài khoản và mật khẩu
```
net use Z: \192.168.1.100\Projects yourPassword /user:yourUsername /persistent:yes
```
---

## ❌ Xóa ổ đĩa đã map
```
net use Z: /delete /y
```
---

## 📌 Ghi chú

- Đảm bảo thư mục `\\192.168.1.100\Projects` đã chia sẻ và bạn có quyền truy cập.  
- Bạn có thể đổi `Z:` thành bất kỳ ký tự ổ đĩa chưa dùng.
