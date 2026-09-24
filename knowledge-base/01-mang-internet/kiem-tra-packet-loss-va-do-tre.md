# Kiểm tra độ trễ và mất gói mạng

## Mục đích
Phân biệt mạng nội bộ, đường Internet và dịch vụ đích khi người dùng báo mạng chậm.

## Kiểm tra cơ bản
```cmd
ping <default-gateway> -n 20
ping 8.8.8.8 -n 20
tracert 8.8.8.8
```
Có thể kiểm tra thêm hostname dịch vụ cần dùng để đánh giá DNS và đường đi thực tế.

## Cách đọc
- Loss/latency ngay gateway: ưu tiên LAN/Wi-Fi.
- Gateway tốt nhưng Internet có loss: kiểm tra uplink/ISP/firewall.
- Internet IP tốt nhưng ứng dụng chậm: kiểm tra DNS, dịch vụ đích hoặc ứng dụng.

## Lưu ý
Một router trên đường đi không trả lời ICMP không tự động chứng minh đường truyền lỗi. Đánh giá dựa trên điểm đích và xu hướng tổng thể.

## Từ khóa
ping, packet loss, latency, tracert, mạng chậm