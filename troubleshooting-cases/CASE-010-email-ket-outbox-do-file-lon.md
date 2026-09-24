# CASE-010 - Email kẹt Outbox do file đính kèm lớn

## Người dùng báo
"Outlook không gửi được mail và cứ quay mãi ở Outbox."

## Khoanh vùng
Thử gửi một email văn bản nhỏ. Nếu email nhỏ gửi được nhưng thư có file lớn không gửi được, tập trung vào kích thước thư/quota/policy.

## Xử lý
1. Kiểm tra dung lượng file đính kèm.
2. Nếu cần, đưa Outlook Offline để chỉnh hoặc xóa thư đang kẹt.
3. Bật lại Online và thử gửi email nhỏ.
4. Với file lớn, sử dụng phương thức chia sẻ doanh nghiệp được phê duyệt thay vì dịch vụ upload công cộng.

## Bài học
Một thư bị kẹt không đồng nghĩa toàn bộ Outlook hoặc máy chủ mail bị lỗi.

## Từ khóa
case, Outbox, attachment lớn, Outlook, email