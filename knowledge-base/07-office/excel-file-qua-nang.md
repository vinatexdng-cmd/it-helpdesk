# File Excel quá nặng, mở và lưu rất chậm

## Nguyên nhân thường gặp
- Dữ liệu hoặc Used Range quá lớn.
- Nhiều công thức volatile hoặc công thức toàn cột.
- Conditional Formatting quá nhiều.
- External Links/Power Query/Pivot lớn.
- Nhiều hình ảnh/object.
- File nằm trên kết nối mạng chậm.

## Khoanh vùng
Tạo bản sao file trước khi tối ưu. Thử mở bản sao từ ổ cục bộ được phép để phân biệt lỗi file và mạng.

## Kiểm tra
- Dung lượng file.
- Sheet nào có Used Range bất thường.
- External Links/Data Connections.
- Công thức phức tạp và Calculation Mode.

## Xử lý
Tối ưu trên bản sao: loại bỏ vùng dữ liệu/format không cần thiết, giảm công thức dư thừa, nén hình ảnh và xem xét định dạng XLSB khi phù hợp với quy trình. Luôn kiểm tra kết quả nghiệp vụ sau tối ưu.

## Chuyển cấp
Workbook chứa macro/mô hình nghiệp vụ quan trọng hoặc việc tối ưu có thể thay đổi kết quả tính toán.

## Từ khóa
Excel nặng, file lớn, mở chậm, công thức, XLSB, Power Query