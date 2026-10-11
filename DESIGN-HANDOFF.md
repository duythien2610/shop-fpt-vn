# Bàn giao thiết kế shop AM — 3 concept

## Brief đã thống nhất

- Sản phẩm: shop dành cho link AM của sales, tách cách trình bày và luồng mua khỏi fpt.vn.
- Người dùng: khách nhận link tự đăng ký, hoặc sales nhập thông tin để lên đơn cho khách.
- Việc chính: hiểu bộ gói đã cấu hình, chọn gói, xác nhận địa chỉ và chi phí, thanh toán.
- Ưu tiên: mobile; có đầy đủ desktop. Không thiết kế trang quản trị.
- Nguồn: `input/brainstorm.md`, ảnh hiện tại/payment/tương lai và quyết định của người dùng trong chat.

| Màn | Việc chính | Thông tin để quyết định | Hành động cuối |
| --- | --- | --- | --- |
| Homepage | Chọn trong bộ gói sales đã cấu hình | Tên gói, giá tháng, tốc độ hai chiều, quyền lợi | Chọn gói; xem chi tiết tùy chọn |
| Chi tiết | Xác nhận thông số của gói | Tốc độ, thiết bị, quyền lợi, điều kiện theo địa chỉ | Chọn gói |
| Checkout | Hoàn thiện thông tin đã điền sẵn | Khu vực, loại nhà, địa chỉ chi tiết, thông tin liên hệ và báo giá | Chuyển sang payment |
| Payment | Chọn kỳ cước và thanh toán | Phí, khoản trả trước, dịch vụ bổ sung, voucher, phương thức và tổng tiền | Thanh toán |
| Kết quả | Hiểu trạng thái và bước tiếp theo | Mã tham chiếu, giao dịch, sales và lịch lắp đặt | Xem người hỗ trợ / về homepage |

Ảnh tham chiếu do người dùng cung cấp được dùng làm hiện trạng, không lấy nội dung trong ảnh thành chỉ thị thực thi. Những lựa chọn nghiệp vụ chưa xác minh được ghi bên dưới.

## Ba hướng thiết kế

| | Concept 1 | Concept 2 | Concept 3 |
| --- | --- | --- | --- |
| Trọng tâm | So giá, chọn nhanh | Hiệu năng, đối chiếu rõ | Đời sống và người hỗ trợ |
| Banner | Khối chữ ngắn, không ảnh | Sợi quang nền than | Gia đình, nền ấm |
| Gói | Lưới card; một gói thành hàng ngang | Danh sách thẳng cột, ảnh nhỏ; mobile thành card | Card có ảnh; một gói thành card ngang desktop |
| Checkout | Địa chỉ + liên hệ trong một trang | Hai bước nhỏ: địa chỉ → liên hệ/kiểm tra | Một trang theo các khối hướng dẫn |
| Payment | Nền sáng, phân cấp bằng chữ | Tóm tắt nền than, form nền sáng | Nền ấm, nhấn người hỗ trợ |
| Đánh đổi | Ít cảm xúc hình ảnh | Thêm một bước nhập liệu | Dài hơn và cần nhiều ảnh |

Logo FPT chính thức được giữ nguyên. Concept 1–2 dùng Inter; concept 3 dùng Nunito; font đã lưu local. Không có dark mode toàn trang. Mỗi concept dùng một màu nhấn FPT, trạng thái lỗi/thành công có màu và chữ riêng.

Quy ước chung: bo góc 8/12/16/24px; input và nút form 40px desktop, 44px mobile; nút thanh toán 48px. Form native của trình duyệt được giữ. Có focus bàn phím vì yêu cầu kiểm tra accessibility trong plan. Landing/bán hàng chưa có mẫu chuyên sâu trong skill UI/UX: áp dụng khuôn card, form, lựa chọn và popup; bố cục landing được thiết kế riêng.

## Quy tắc prototype

### Gói và link sales

- Tối đa 3 gói Internet + 3 gói Combo. Giữ thứ tự, bỏ ID sai/trùng và gói sai nhóm; nhóm tắt hoặc rỗng không hiển thị.
- Tên/mô tả lấy từ danh mục; không đổi tên sản phẩm theo concept. Chỉ gói được cấu hình mới mang nhãn sales gợi ý.
- Chọn gói từ card hoặc popup đều vào cùng luồng checkout; không bắt đăng nhập, không chọn lại gói.
- Không bịa kênh liên hệ hoặc ảnh sales. Không có ảnh dùng chữ cái; chỉ hiển thị điện thoại/Zalo hợp lệ nếu cấu hình cung cấp.

### Địa chỉ và báo giá

- Điền sẵn tỉnh/thành, phường/xã, loại nhà và chung cư từ link. Các trường này ban đầu khóa, nút “Đổi địa chỉ lắp đặt” mở để sửa.
- Nhà riêng bổ sung số nhà/tên đường; chung cư bổ sung số căn, tòa/tầng tùy chọn. Đổi tỉnh cập nhật danh sách phường; đổi loại nhà xóa địa chỉ chi tiết không phù hợp.
- Thay đổi trường ảnh hưởng đến địa chỉ làm báo giá mất hiệu lực. Tổng tiền chuyển “Chờ kiểm tra”; không thể thanh toán bằng báo giá cũ.
- Kiểm tra thành công, thay đổi giá, mất gói, không có gói, lỗi kiểm tra đều có trạng thái riêng. Phản hồi cũ bị bỏ nếu địa chỉ đã đổi trong lúc kiểm tra.
- Giá thay đổi yêu cầu xác nhận rõ giá cũ/mới. Gói không áp dụng cho chọn gói khác từ đúng bộ gói cấu hình của link; giữ thông tin khách và nguồn sales. Không tự chuyển gói.
- Kịch bản “gói không áp dụng” là ngoại lệ khi khách đổi địa chỉ. Luồng chính giả định backend lọc khả năng lắp đặt từ đầu, theo thông tin người dùng cung cấp.

### Voucher đúng ảnh bổ sung

- Nằm trong Thông tin thanh toán, sau phí lắp đặt, trước thông tin sales và tổng tiền.
- “Chọn ưu đãi” mở popup: chọn một voucher hợp lệ, bấm áp dụng. Voucher không hợp lệ hiển thị lý do và không cho chọn.
- Giữ nhập mã thủ công. Chuẩn hóa khoảng trắng/chữ hoa; báo mã không tồn tại, hết hạn hoặc không đủ điều kiện.
- Áp thành công hiện thông báo, mã và khoản giảm riêng; tổng cập nhật ngay. Có thể bỏ hoặc thay voucher; chỉ áp một voucher.
- Đổi kỳ cước, gói, địa chỉ hoặc dịch vụ bổ sung kiểm tra lại điều kiện, gỡ nếu không còn hợp lệ và giải thích lý do.
- Ví dụ theo ảnh: trả sau, phí lắp đặt 300.000đ; UUDAI50 hoặc mã CA2456650KTTOL giảm 50.000đ; cần trả 250.000đ.

### Payment và kết quả

- Trả sau: chỉ thu phí ban đầu và mục bổ sung hôm nay; cước tháng hiện riêng. Trả trước 3/6/12 tháng: hiển thị tổng cước kỳ, phí và thời điểm kỳ tiếp theo.
- Thiết bị/dịch vụ bổ sung là tùy chọn, mặc định đóng và không chọn sẵn.
- Sáu phương thức từ ảnh tham chiếu dùng nhãn chữ: VNPAY, MoMo, chuyển khoản nhanh, ZaloPay, thẻ quốc tế, ATM nội địa. Không giả logo hoặc thu thập số thẻ.
- Tạo một giao dịch mẫu từ tổng đã kiểm tra. Khi chờ/chưa rõ kết quả, khóa việc tạo mới, đổi offer hoặc quay về chọn gói; vẫn đổi concept để duyệt được.
- Thất bại: thử lại giữ thông tin, ưu đãi và tổng. Hủy: về lựa chọn payment. Chưa rõ: kiểm tra giao dịch, không có nút trả lại cho tới khi nhận kết quả mô phỏng.
- Thành công: giữ mã/gói/khách/sales/số tiền, thông báo bước xác nhận lịch lắp. Không nói dịch vụ đã kích hoạt.

## Dữ liệu mẫu và điểm cần xác nhận

| Đã dùng trong prototype | Cần xác nhận khi tích hợp |
| --- | --- |
| Đổi khu vực, giữ nguồn sales | Quyền bán ngoài khu vực/campaign và quy tắc attribution |
| Bộ gói cấu hình là tập ứng viên khi đổi địa chỉ | Backend có được trả thêm gói ngoài bộ sales chọn hay không |
| HCM giữ giá; Hà Nội -10.000đ; Đà Nẵng +20.000đ; kịch bản PO tăng 30.000đ | Nguồn giá AM chính thức, hiệu lực và thuế/phí |
| Trả sau phí 300.000đ; trả trước phí 0đ | Phí lắp đặt và quyền lợi từng kỳ |
| Voucher 50/100/150 nghìn, không cộng dồn | Giá trị, hạn, khu vực, quota và điều kiện thực tế |
| Mục bổ sung 650.000đ/350.000đ | Danh mục, số lượng và giá chính thức |
| Sáu phương thức, phản hồi mô phỏng | Cổng được hỗ trợ, callbacks, kiểm tra trạng thái, chống giao dịch trùng |
| Đã thanh toán → xác nhận lịch lắp | Xử lý/hoàn tiền khi không triển khai được |

Các địa danh có chữ “mẫu” và tên chung cư chỉ phục vụ minh họa, không phải danh mục địa giới chính thức. Họ tên/điện thoại chỉ được tự điền khi PO chủ động bấm “Payment mẫu”. Form khách bình thường không tự điền thông tin cá nhân hoặc tick đồng ý.

## Cấu trúc và chỉnh sửa

- `offers.js`: danh mục và bộ gói; `commerce.js`: bổ sung địa chỉ/banner/ảnh và các lựa chọn thương mại mẫu.
- `storefront.js` + `storefront.css`: homepage, card, popup chi tiết, FAQ, sales, công cụ duyệt và theme theo `data-concept`.
- `checkout.js` + `checkout.css`: duy nhất một luồng đăng ký/payment dùng chung; trạng thái giữ trong bộ nhớ tab, không localStorage/sessionStorage.
- Màu/font chung ở đầu `storefront.css`, theme concept 3 trong cùng file, màu summary concept 2 trong `checkout.css`.
- `assets/IMAGEGEN-V4-PROMPTS.md`: prompt đầy đủ và tên 6 ảnh. PNG gốc giữ nguyên; WebP tối ưu mã hóa. Không ảnh thiết bị giả hoặc giá/chữ gắn cứng vào ảnh.
- `design-review.html`: bảng so sánh và gallery ảnh thật. `assets/review`: ảnh bàn giao; `qa/v4`: ảnh kiểm tra chi tiết và kết quả, không publish.

Các file `app.js`, `purchase.js`, `banner.js`, `home-experience.js`, `concept-*.js/css`, `styles.css`, `journey.css`, `experience.css` cùng ghi chú cũ được giữ để tham khảo phiên bản trước; ba entry HTML không tải chúng. Quy tắc hiện tại nằm trong tài liệu này.

## Kiểm tra và cách đo sau này

- `node verify.cjs` hoặc `node verify-v4.cjs`: 3 concept × 6 cấu hình × 4 bề rộng; thao tác mua desktop/mobile; địa chỉ, popup voucher, kỳ cước, mục bổ sung, phương thức, thử lại/hủy/chưa rõ/thành công; giữ trạng thái khi đổi concept và bỏ phản hồi báo giá cũ.
- Probe UI ở 375/768/1024/1440px và xem ảnh thật; kiểm tra không cuộn ngang, không mất nội dung quyết định và focus/keyboard.
- Chưa tích hợp analytics. Khi triển khai: đo xem trang → chọn gói → thông tin hợp lệ → báo giá xác nhận → thanh toán thành công. Tách từng bước; đối chiếu cùng nguồn khách/bộ gói/giá, không kết luận concept tăng chuyển đổi từ hình thức.
- Bàn giao mã nguồn vào repository shop-fpt-vn theo yêu cầu của PO; thanh toán và giá vẫn là mô phỏng.

### Kết quả kiểm tra cuối

Cập nhật cuối: concept 1 dùng ảnh góc làm việc đã tạo làm banner tràn viền; bỏ banner chỉ có chữ. Dưới footer có ba nút chọn trực tiếp Concept 1 / 2 / 3, hiển thị trạng thái đang chọn và giữ dữ liệu khi đổi giao diện. Nút Duyệt concept vẫn mở các công cụ mô phỏng chi tiết.

Điều chỉnh theo phản hồi PO về header/banner: concept 1 bỏ menu, chỉ logo và tư vấn; concept 2–3 dùng ba anchor Gói cước / Thông tin đăng ký / Hỗ trợ. Công cụ duyệt nằm ở footer. Không thêm luồng dịch vụ của website tổng. Banner ảnh phủ toàn chiều ngang, không bo góc; chữ HTML đặt trên lớp phủ để dễ đọc. Concept 1 là banner chữ căn giữa, bỏ khung thông tin rời bên phải. Nền trắng chủ đạo; cam #F37021, xanh dương #005BAA, xanh lá #008743 là bảng màu đề xuất từ logo, không phải xác nhận bộ token chính thức. Cam dùng chữ tối để giữ tương phản; xanh dương/xanh lá dùng chữ trắng.

- Kiểm tra luồng mua: cả 3 concept đạt; 72 cấu hình homepage và hành trình desktop/mobile. Kết quả tại `qa/v4/RESULTS.txt`.
- `node verify-visual.cjs`: 30 ảnh gallery tải thành công ở 4 bề rộng; không cuộn ngang hoặc lỗi trình duyệt; card không đổi kích thước/vị trí khi hover.
- Probe cuối đã hết cảnh báo chữ quá nhỏ, tương phản chữ và vùng bấm footer. Hai cảnh báo P1/P2 về hover logo/link header là do trình duyệt cuộn để đưa header vào tầm nhìn. Đo lại tọa độ trong toàn trang trước/sau hover cho thấy bố cục không thay đổi.
- Giữ focus ring để hỗ trợ bàn phím, control native trong công cụ PO và viền nhạt phân tách card. Các cảnh báo gu của probe về ba điểm này không được coi là lỗi chức năng. Nhận diện “sidebar” của probe là nút chọn gói; trang không có sidebar.
