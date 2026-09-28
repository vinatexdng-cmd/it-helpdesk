# Lỗi The trust relationship between this workstation and the primary domain failed

## Mô tả
Máy tính domain không xác thực được secure channel với domain và người dùng domain không đăng nhập bình thường.

## Nguyên nhân có thể
Computer account/secure channel không đồng bộ, máy được restore snapshot/image cũ, thay đổi domain membership hoặc sự cố AD/DNS.

## Xử lý Helpdesk
1. Ghi nhận hostname và người dùng.
2. Kiểm tra kết nối mạng và DNS domain.
3. Bảo đảm dữ liệu/profile người dùng được nhận diện trước mọi thao tác domain membership.
4. Chuyển kỹ thuật viên có quyền AD để kiểm tra secure channel/computer account và sửa theo quy trình.

## Cảnh báo
Không remove khỏi domain rồi join lại như bước đầu tiên nếu chưa đánh giá profile, mã hóa và dữ liệu cục bộ.

## Từ khóa
trust relationship failed, domain, Active Directory, secure channel, computer account