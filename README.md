## 🚀 FPTU Automation Orchestrator

  FPTU Automation Orchestrator là công cụ hỗ trợ tự động hóa thao tác trên hệ thống FAP, giúp sinh viên tối ưu hóa khả năng chuyển lớp (Move Out) vào đúng thời điểm hệ thống mở slot.





# 🎯 Mục tiêu

  Tăng tỉ lệ thành công khi tranh slot chuyển lớp bằng cách loại bỏ độ trễ của con người và tự động hóa các thao tác lặp lại.

# 🛠 Hướng dẫn sử dụng (Chuẩn 4 Bước)

## Bước 1: Chuẩn bị môi trường

    Sử dụng trình duyệt Google Chrome.

    Truy cập vào hệ thống FAP và đăng nhập sẵn tài khoản sinh viên.

## Bước 2: Thiết lập thao tác sẵn

    Truy cập vào mục Move Out Class.

    Chọn đúng Môn cần chuyển và Lớp muốn chuyển vào.

  Quan trọng: Nhấn thử nút SAVE một lần để đảm bảo form hoạt động bình thường và không bị lỗi kết nối.

## Bước 3: Cấu hình Tool

    Mở giao diện công cụ.

    Thiết lập Thời gian chính xác (giờ hệ thống mở slot).

    Nhấn START.

## Bước 4: Chờ đợi & Tự động hóa



## Tool sẽ tự động thực hiện các tác vụ sau:

    [x] Duy trì trạng thái trang web (Anti-idle).

    [x] Đợi đến đúng mili-giây đã cài đặt.

    [x] Click đồng loạt các nút cần thiết.

    [x] Tự động Retry (thử lại) liên tục nếu gặp lỗi hệ thống.
    

## 📦 Cài đặt

| Cách thức | Hướng dẫn |
|-----------|----------|
| Cách 1 (Local) | Tải source và làm theo hướng dẫn cài đặt extension thủ công |
| Cách 2 (Nhanh) | Tìm kiếm từ khóa Auto-Move-Out-Class trên Chrome Web Store và nhấn Thêm vào Chrome |



⚠️ Lưu ý quan trọng (Đọc kỹ để tránh mất slot)

> **CAUTION:** Đây là những lưu ý rất quan trọng để tránh mất slot:

   1. **Tuyệt đối không Reload (F5) thủ công:** Trong quá trình tool đang đếm ngược hoặc đang chạy, việc tải lại trang sẽ làm mất session và hỏng tiến trình auto.

   2. **Giữ ổn định Session:** Tránh đăng nhập lại hoặc mở quá nhiều tab FAP cùng một tài khoản trên nhiều trình duyệt khác nhau.

   3. **Thời gian chuẩn:** Đảm bảo giờ máy tính đã được đồng bộ với giờ internet (Network time). Lệch 1-2 giây đồng nghĩa với việc mất slot.

   4. **Kết nối mạng:** Ưu tiên dùng mạng dây hoặc Wifi ổn định. Ping cao hoặc packet loss sẽ làm giảm tỉ lệ thành công.

   5. **Mở sớm:** Nên bật tool và setup sẵn sàng trước giờ mở slot ít nhất 1–2 phút.




# 💡 Tips tăng tỉ lệ thành công

  - **Đa nhiệm:** Bạn có thể chạy nhiều tab (mỗi tab một lớp dự phòng) để tăng cơ hội.

  - **Lớp dự phòng:** Nếu lớp chính bị full, tool sẽ tiếp tục retry hoặc bạn có thể chuyển hướng sang lớp dự phòng ngay lập tức.

  - **Tránh VPN:** Tránh sử dụng các VPN lạ/miễn phí vì dễ bị Cloudflare chặn hoặc yêu cầu xác thực captcha đột xuất.

🔧 Xử lý sự cố (Troubleshooting)

**Bị kẹt ở màn hình "Just a moment..." (Cloudflare):**

    - **Nguyên nhân:** Do hệ thống bảo vệ của FAP nghi ngờ bot.
- **Xử lý:** Reload thủ công một lần duy nhất trước khi bật tool, hoặc thực hiện đăng nhập lại.

**Tool không tự Click:**

  - Kiểm tra xem đã chọn đúng lớp trong dropdown chưa.
  - Kiểm tra nút SAVE trên trang FAP có bị ẩn hoặc bị đổi ID không.

## 📞 Liên hệ hỗ trợ

- **Facebook:** [sc.aln24](https://facebook.com/sc.aln24)
- **Email:** aizasybxitjpvbi@zohomail.com


---

**Developed for FPTU Students.** 
