# 🧪 Wireshark Lab: Phân tích DNS Query A tới facebook.com

## 🧭 Mục tiêu
Thực hiện bắt và phân tích gói tin DNS dạng **query A** đến `facebook.com` bằng Wireshark, từ đó hiểu cách thức hoạt động của hệ thống phân giải tên miền DNS trong mạng máy tính.

## 🛠 Công cụ
- 🖥 Hệ điều hành: Windows 10/11  
- 🌐 Kết nối mạng: Wi-Fi hoặc Ethernet  
- 🦈 Phần mềm: [Wireshark](https://www.wireshark.org/)

## ✅ Các bước thực hiện

### 🔹 Bước 1: Mở Wireshark và bắt gói
- Mở Wireshark  
- Chọn giao diện đang kết nối Internet (`Wi-Fi` hoặc `Ethernet`)  
- Nhấn biểu tượng **cá mập xanh** để bắt đầu bắt gói

### 🔹 Bước 2: Tạo truy vấn DNS
- Mở CMD và gõ lệnh:
```
nslookup facebook.com
```

### 🔹 Bước 3: Lọc và tìm gói DNS
- Trong thanh filter của Wireshark, nhập:
```
dns.qry.name == "facebook.com"
```
- Nhấn **Enter** để lọc chính xác các gói DNS truy vấn đến `facebook.com`

**Một số filter hữu ích khác:**

| Filter | Ý nghĩa |
|--------|--------|
| `udp.port == 53` | Hiển thị tất cả gói DNS |
| `dns.flags.response == 0` | Lọc chỉ gói DNS query |
| `dns.qry.type == 1` | Lọc truy vấn A record (IPv4) |

### 🔹 Bước 4: Phân tích gói DNS
- Chọn gói có `Standard query A facebook.com`  
- Kéo xuống phần **Domain Name System (query)** → mở rộng  
- Kiểm tra thông tin:
```
Queries
    facebook.com: type A, class IN
```
✅ Đây chính là truy vấn yêu cầu địa chỉ IPv4 của `facebook.com`.

## 📘 Kết quả thu được

| Nội dung | Ý nghĩa |
|----------|---------|
| DNS Query | Gói tin gửi từ máy tới DNS server yêu cầu phân giải tên miền |
| Type A | Truy vấn địa chỉ IPv4 |
| Port | Sử dụng UDP port 53 |
| Response (nếu có) | Trả về IP như `157.240.x.x` |

## 🧠 Kiến thức rút ra
- Phân biệt **gói DNS query** và **response**  
- Sử dụng Wireshark để lọc chính xác dữ liệu cần phân tích  
- Hiểu cách hệ điều hành sử dụng DNS để phân giải tên miền thành IP  
- Biết cách sử dụng bộ lọc như `dns.qry.name`, `dns.flags.response`

## 💾 File đính kèm
- [`DNS_Lab_facebook.pcapng`](./DNS_Lab_facebook.pcapng): File dữ liệu Wireshark đã bắt gói DNS  
- `README.md`: Hướng dẫn phân tích
