# CASE-020 - Máy yêu cầu BitLocker Recovery sau thay đổi BIOS

## Người dùng báo
"Máy vừa cập nhật BIOS xong thì khởi động lên hỏi Recovery Key."

## Quy trình
1. Xác định đúng hostname/serial/tài sản và người sử dụng.
2. Ghi Recovery Key ID hiển thị.
3. Tra cứu recovery key trong hệ thống quản trị chính thức nếu có quyền.
4. Xác minh thiết bị/người dùng trước khi nhập/cung cấp khóa theo quy trình.
5. Sau khi vào Windows, nếu Recovery lặp lại, chuyển cấp kiểm tra TPM/BitLocker/firmware.

## Bài học
BitLocker Recovery không phải lý do để tắt mã hóa. Mục tiêu là khôi phục truy cập an toàn và xác định nguyên nhân thay đổi trạng thái bảo vệ.

## Từ khóa
case, BitLocker, recovery key, BIOS, TPM