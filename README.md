# Prototype shop.fpt.vn — ba concept theo link sales

Website: https://duythien2610.github.io/shop-fpt-vn/

AM là kênh sales chia sẻ link chứa cấu hình riêng cho khách. Mỗi link có tối đa 3 gói Internet và 3 gói Combo, không bắt buộc đủ 6 gói. Bật/tắt từng nhóm độc lập, giữ thứ tự sales chọn; nhóm không có gói được ẩn cùng đường dẫn đến nhóm. Prototype chưa nối admin hoặc backend.

## Xem ba concept

- `index.html`: nền sáng, hero ngắn, card so sánh giá theo nhóm. Một gói tự chuyển thành card ngang ở desktop.
- `concept-2.html`: hero than đậm với ảnh cáp quang; gói trình bày theo hàng, ưu tiên tốc độ và CTA cạnh giá.
- `concept-3.html`: nền ấm, ảnh đời sống và người tư vấn cụ thể; hai nhóm đặt cạnh nhau khi lượng gói cân bằng, chuyển thành một cột nếu chênh lệch lớn. Có thẻ sales ngắn ở cuối danh sách.

Mở trực tiếp bằng trình duyệt. Thanh xem mẫu cuối trang cho phép đổi concept và link AM mẫu. Đây là công cụ duyệt prototype, không phải tính năng người mua chọn số gói.

Các link mẫu dùng `?offer=family` (1+3), `performance` (3+3), `apartment` (2+1), `internet` (2+0), `combo` (0+2). Đổi concept giữ nguyên offer đang xem. Có thể xem `concept-3.html?offer=performance` để thấy bố cục hai nhóm cân bằng.

## Dữ liệu và hành trình

`offers.js` chứa danh mục gói mẫu, các link sales mẫu và mẫu nội dung theo tệp khách. Sales chỉ chọn ID gói, thứ tự, nhóm hiển thị, gói gợi ý và mẫu nội dung. Tên gói/mô tả lấy từ danh mục, không bị đổi theo concept. Các mẫu mô tả là đề xuất chờ duyệt nghiệp vụ, chưa phải nội dung đã được FPT phê duyệt.

Chọn gói → thông tin liên hệ/lắp đặt → xác nhận → kết quả mô phỏng. Chi tiết kỹ thuật mở tùy chọn trong popup. Sản phẩm, giá và mã sales được giữ xuyên suốt. Không tạo đơn, gửi thông tin, gọi điện, nhắn Zalo hay thanh toán thật.

Tên sales, cấu hình, giá và quyền lợi trong bản này là dữ liệu minh họa; chưa xác minh điều kiện địa chỉ. Giá giữa các gói không phải bảng giá thương mại đề xuất. Avatar chữ cái thể hiện trường hợp sales chưa có ảnh. Không dùng số điện thoại ngẫu nhiên cho kênh liên hệ.

## Thiết kế và tài nguyên

Áp dụng `.agents/skills/ui-ux/SKILL.md`: khoảng cách, card, giá, form và responsive. Landing chưa có mẫu riêng trong skill; mượn khuôn bảng giá và card, đổi bố cục theo ba concept đã mô tả. Giữ focus bàn phím và control form native của prototype. Không có công tắc dark mode; concept 2 chỉ có vùng hero tối.

Token chung ở đầu `styles.css`; font và cấu trúc card trong `journey.css`; màu riêng concept 3 ở đầu `concept-3.css`. Inter 400/500/600/700 được lưu tại assets, không cần tải Google Fonts khi mở trang.

Logo chính thức: https://fpt.vn/frontend_layout_2025_vibecode/assets/images/logo-ftel.svg, từ https://fpt.vn/vi. Không ghép chữ shop vào logo.

Ảnh đời sống `assets/hero-family.png` được tạo bằng ImageGen trong lượt trước: gia đình Việt trong căn hộ, ánh sáng cửa sổ tự nhiên, màu gỗ và kem, không chữ/logo.

Ảnh công nghệ `assets/hero-fiber.png` được tạo bằng ImageGen trong lượt trước: macro cáp quang than đậm, đầu sợi sáng cam, vật liệu chân thực, không logo/chữ/thiết bị giả. Hai ảnh được tái sử dụng trong lần cập nhật này.

## Kiểm tra

Chạy `node shop-prototype/verify.cjs` từ thư mục dự án (dùng Playwright có sẵn trong runtime máy hiện tại). Kiểm tra 3 concept × 5 cấu hình link, giới hạn/ẩn nhóm/loại bỏ ID sai hoặc trùng, giữ sản phẩm và mã sales qua popup/checkout, sửa thông tin, trạng thái lỗi và hoàn tất mô phỏng. Kiểm tra chiều rộng 375/768/1024/1440px và chụp ảnh ở `qa/revision-3/`.

Probe UI và ảnh chụp nằm cùng thư mục QA. Những cảnh báo gu về độ dài FAQ, card nhiều dòng và viền nền ấm được xem xét theo bố cục landing; không phải lỗi dữ liệu. Mọi kiểm tra đều trên dữ liệu mẫu, không kiểm chứng hạ tầng/giá hoặc tích hợp thanh toán thực tế.
