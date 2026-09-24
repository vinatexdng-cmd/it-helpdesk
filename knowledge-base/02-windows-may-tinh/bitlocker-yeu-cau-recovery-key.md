# Windows yêu cầu BitLocker Recovery Key

## Biểu hiện
Khi khởi động, máy hiển thị màn hình BitLocker Recovery và yêu cầu khóa khôi phục.

## Nguyên nhân có thể
Thay đổi TPM/BIOS/UEFI, cập nhật firmware, thay phần cứng, thay đổi boot hoặc cơ chế bảo vệ phát hiện trạng thái không mong đợi.

## Helpdesk cần làm
1. Xác định đúng tài sản/máy và người sử dụng.
2. Ghi lại Recovery Key ID hiển thị trên màn hình, không chụp/phát tán khóa khôi phục thật.
3. Tra cứu khóa bằng hệ thống quản trị chính thức nếu Helpdesk được cấp quyền.
4. Xác minh danh tính/quyền sở hữu thiết bị trước khi cung cấp hoặc nhập khóa theo quy trình.

## Không nên làm
Không tìm khóa trên các website/công cụ không chính thức. Không tắt BitLocker hoặc TPM để né màn hình Recovery.

## Chuyển cấp
Không tìm thấy khóa, máy không thuộc inventory, Recovery lặp lại sau mỗi lần boot hoặc có thay đổi BIOS/TPM bất thường.

## Từ khóa
BitLocker, recovery key, TPM, BIOS, Windows, mã hóa