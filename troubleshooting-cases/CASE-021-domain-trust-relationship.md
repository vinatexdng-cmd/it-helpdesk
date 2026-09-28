# CASE-021 - Máy báo lỗi Trust Relationship khi đăng nhập

## Người dùng báo
"Tài khoản vẫn dùng ở máy khác được nhưng máy này báo trust relationship failed."

## Khoanh vùng
1. Kiểm tra LAN/DNS tới domain.
2. Xác nhận tài khoản người dùng không bị khóa.
3. Ghi hostname và tình trạng domain membership.
4. Xác định dữ liệu/profile cục bộ quan trọng.

## Xử lý
Chuyển kỹ thuật viên có quyền Active Directory kiểm tra computer account/secure channel. Không remove/rejoin domain ngay từ đầu khi chưa đánh giá ảnh hưởng tới profile, BitLocker và dữ liệu.

## Từ khóa
case, trust relationship, Active Directory, domain, đăng nhập Windows