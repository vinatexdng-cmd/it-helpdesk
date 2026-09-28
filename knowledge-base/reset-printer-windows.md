# Hướng dẫn Reset máy in trên Windows

1. Mở Services (nhấn Windows + R, gõ `services.msc` và Enter).
2. Tìm dịch vụ **Print Spooler**.
3. Nhấn **Stop** để tạm dừng dịch vụ.
4. Xóa các file trong thư mục:  
   `C:\Windows\System32\spool\PRINTERS`
5. Quay lại Services, nhấn **Start** để khởi động lại dịch vụ.
6. Thử in lại để kiểm tra.

---
