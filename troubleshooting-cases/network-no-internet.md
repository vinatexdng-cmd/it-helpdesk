# Case: Máy không vào được Internet

## Triệu chứng:
- Biểu tượng mạng có dấu chấm than
- Không ping được `8.8.8.8`
- Trình duyệt báo "No Interet"

## Kiểm tra:
1. `ipconfig` -> máy không có IP
2. `ping 127.0.0.1` -> OK
3. `ping 192.168.1.1` -> Fail
4. Cắm dây mạng sang máy khác -> OK

## Cách xử lý:
- Kiểm tra cổng mạng -> cổng bị lỏng
- Đổi dây mạng -> hoạt động bình thường
- Đổi sang IP tĩnh để test -> được
