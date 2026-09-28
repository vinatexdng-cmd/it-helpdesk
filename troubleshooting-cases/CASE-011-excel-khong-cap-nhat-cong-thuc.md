# CASE-011 - Excel thay số nhưng kết quả không đổi

## Người dùng báo
"Em sửa số liệu rồi nhưng tổng vẫn giữ nguyên, đóng mở file mới thấy thay đổi."

## Kiểm tra
1. Kiểm tra Formulas > Calculation Options.
2. Nhấn F9 và quan sát kết quả.
3. Kiểm tra công thức có phải text không.
4. Kiểm tra Circular Reference/External Link nếu vẫn lỗi.

## Kết quả điển hình
Workbook hoặc Excel đang đặt Calculation = Manual. Chuyển Automatic nếu phù hợp với thiết kế file.

## Lưu ý
Một số workbook nghiệp vụ rất lớn cố ý dùng Manual Calculation để cải thiện hiệu năng; cần xác nhận với chủ file trước khi thay đổi lâu dài.

## Từ khóa
case, Excel, công thức không cập nhật, calculation manual, F9