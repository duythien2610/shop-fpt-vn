# Prototype shop AM FPT Telecom — 3 concept

Mở **design-review.html** để so sánh thiết kế, hoặc mở trực tiếp một concept:

- **index.html** — tối giản, ưu tiên giá; checkout TO-BE 5 màn.
- **concept-2.html** — công nghệ, so hiệu năng; checkout TO-BE 5 màn.
- **concept-3.html** — đời sống, ảnh card và sales; checkout một trang.

Ba trang dùng cùng dữ liệu và một luồng mua: **chọn gói → liên hệ → địa chỉ → kỳ cước & thanh toán → hoàn tất**. Không nối backend, tạo đơn hay thu tiền thật. Không lưu dữ liệu khách ngoài bộ nhớ của tab.

## Duyệt cùng PO

Bấm **Duyệt concept** ở cuối trang để đổi concept mà giữ thông tin đang nhập, chọn link mẫu và kịch bản kiểm tra địa chỉ. Có nút xem nhanh homepage, checkout và payment với thông tin mẫu. Khi giao dịch đang chờ/chưa rõ kết quả, vẫn đổi concept nhưng không đổi link hoặc tạo giao dịch mới.

Link mẫu: `?offer=performance` (3+3), `family` (1+3), `apartment` (2+1), `internet` (2+0), `combo` (0+2), `public` (link đại trà, chọn khu vực trước liên hệ), `empty` (không có gói). Trên file mở trực tiếp, tham số `concept` giữ hướng đang duyệt khi đổi concept.

Cước tháng trên card đã áp khu vực của link. Màn liên hệ đứng trước địa chỉ; lưu lead mẫu trong bộ nhớ ngay khi có số điện thoại hợp lệ và đồng ý chính sách. Checkout điền sẵn tỉnh/phường, loại nhà/chung cư từ link. Tự kiểm tra khi rời ô địa chỉ. Có thể đổi khu vực, xác nhận giá mới, chọn gói khác hoặc nhờ sales. Nếu gói không áp dụng, giữ thông tin và cho chọn gói khác từ bộ gói trên link.

## Voucher và payment

Trong **Thông tin thanh toán**, mở **Mã ưu đãi** rồi bấm **Chọn ưu đãi** → popup → chọn voucher → áp dụng. Giữ ô nhập mã thủ công, dòng thông báo thành công, mã và số tiền giảm. Mẫu trả sau: 300.000đ − 50.000đ = 250.000đ. Khi thay kỳ cước/địa chỉ/gói, kiểm tra lại điều kiện ưu đãi.

Có kỳ trả sau/trả trước 3/6/12 tháng, mục bổ sung tùy chọn và sáu phương thức theo ảnh tham chiếu. Phí, cước kỳ và số tiền trả hôm nay tách riêng. Kết quả mô phỏng gồm thành công, lỗi/thử lại, hủy và chưa rõ kết quả. Thanh toán thành công chưa phải kích hoạt dịch vụ. Lỗi hoặc hủy giữ mã đơn, cho thử lại, đổi phương thức hoặc gửi đăng ký thanh toán sau. Nhánh thanh toán sau được mô phỏng để PO duyệt, chưa phải nghiệp vụ được xác nhận. Giao dịch chưa rõ kết quả khóa tạo giao dịch mới và chỉ cho kiểm tra trạng thái.

## Tài nguyên và chỉnh sửa

Đọc **DESIGN-HANDOFF.md** để xem brief, điểm khác biệt, quy tắc và giả định cần PO/backend xác nhận. **assets/IMAGEGEN-V4-PROMPTS.md** chứa prompt của 2 banner + 4 ảnh card tạo bằng ImageGen tích hợp; PNG gốc và WebP đều nằm trong assets. Ảnh minh họa không phải ảnh thiết bị thực tế. Font và logo được giữ local.

Runtime hiện tại: `offers.js`, `commerce.js`, `storefront.js/css`, `checkout.js/css`. Ba HTML chỉ tải các file này. Các script/style/ghi chú cũ giữ làm lịch sử tham khảo, không chạy cùng luồng mới.

## Kiểm tra

Chạy `node verify.cjs` từ thư mục shop-prototype, hoặc `node shop-prototype/verify.cjs` từ thư mục dự án. Bộ kiểm tra TO-BE hiện tại ở `verify-tobe.cjs` (`verify-v4.cjs` giữ làm lịch sử), dùng Playwright trong runtime có sẵn trên máy. Kiểm tra 84 cấu hình homepage ở 375/768/1024/1440px và hành trình mua desktop/mobile, địa chỉ, voucher, payment và giữ trạng thái. Ảnh/kết quả TO-BE ở `qa/tobe` (được gitignore); gallery bàn giao ở `assets/review`.

## Giới hạn

Giá, phí, địa danh mẫu, quyền lợi, voucher, tên sales và dữ liệu khách là minh họa. Backend cần xác nhận quyền đổi khu vực, nguồn giá AM, điều kiện ưu đãi, phương thức và xử lý giao dịch. Không có số liệu chứng minh tăng chuyển đổi. Bản cập nhật này chưa xuất bản hoặc push; website đã publish trước đây chưa phản ánh thay đổi local.

## Mặc định của bản TO-BE

Giữ kỳ trả sau được chọn sẵn để duyệt; các kỳ 3/6/12 tháng luôn hiển thị. Lead, đơn và giao dịch là ba đối tượng mô phỏng riêng; không gửi dữ liệu, không lưu ngoài bộ nhớ tab. Đơn được tạo trước khi chuyển sang cổng thanh toán mẫu. Kết quả thanh toán sau có trạng thái `submitted_unpaid`, không ghi nhận là đã thanh toán. Phí lắp đặt và ưu đãi vẫn dùng dữ liệu minh họa cũ, không suy diễn chính sách FPT.
