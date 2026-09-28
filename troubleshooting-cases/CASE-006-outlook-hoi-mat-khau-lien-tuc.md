# CASE-006 - Outlook liên tục hỏi mật khẩu

## Người dùng báo
"Outlook cứ hiện cửa sổ yêu cầu đăng nhập dù em đã nhập đúng mật khẩu."

## Khoanh vùng
- Webmail đăng nhập được không?
- Tài khoản có vừa đổi mật khẩu không?
- Máy có nhiều Office account không?
- Outlook có Connected không?
- Chỉ Outlook hay Teams/OneDrive cũng yêu cầu đăng nhập?

## Quy trình xử lý
1. Xác nhận tài khoản không bị khóa/hết hạn.
2. Kiểm tra webmail để phân biệt lỗi tài khoản và lỗi máy trạm.
3. Kiểm tra kết nối Internet, ngày giờ hệ thống.
4. Kiểm tra credential/profile Office theo công cụ và quyền Helpdesk được cấp.
5. Nếu tạo profile mới, phải bảo đảm dữ liệu cục bộ/PST được nhận diện và bảo toàn.

## Cảnh báo
Không yêu cầu người dùng gửi mật khẩu cho IT. Nếu xuất hiện đăng nhập bất thường hoặc MFA lạ, chuyển sang quy trình tài khoản nghi bị xâm nhập.

## Từ khóa
case, Outlook, hỏi mật khẩu, credential, profile, account locked