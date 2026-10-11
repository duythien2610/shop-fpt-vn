/* All prices, eligibility and promotions here are illustrative, not FPT rules. */
const imagery = {'internet-giga':'work','internet-sky':'family','internet-meta':'performance','combo-giga':'family','combo-sky':'entertainment','combo-meta':'performance'};
window.catalog.forEach(p => p.image = `card-${imagery[p.id]}-v4.webp`);
Object.entries(window.offerSamples).forEach(([key,o]) => {
  o.address = {province:key==='internet'?'Hà Nội':'Hồ Chí Minh',ward:key==='internet'?'Phường mẫu Hà Nội':key==='apartment'?'Phường Tân Thuận':'Phường Bình Trị Đông',houseType:key==='apartment'?'apartment':'house',building:key==='apartment'?'Chung cư mẫu A':''};
  o.banners = {'1':'minimal','2':'hero-tech-v4.webp','3':'hero-family-v4.webp'};
});
window.offerSamples.empty = {label:'Chưa cấu hình gói',sales:{id:'AM-DEMO-01',name:'Minh Anh'},audience:'family',banner:'family',address:{...window.offerSamples.family.address},sections:{internet:{visible:true,planIds:[]},combo:{visible:false,planIds:[]}}};
window.demoCommerce = {
  regions:{'Hồ Chí Minh':{wards:['Phường Bình Trị Đông','Phường Tân Thuận'],delta:0},'Hà Nội':{wards:['Phường mẫu Hà Nội','Phường mẫu phía Tây'],delta:-10000},'Đà Nẵng':{wards:['Phường mẫu Đà Nẵng','Phường mẫu ven biển'],delta:20000}},
  buildings:['Chung cư mẫu A','Chung cư mẫu B'],
  periods:[{id:'post',label:'Trả sau',months:1,fee:300000,description:'Trả phí lắp đặt hôm nay. Cước dịch vụ thanh toán hàng tháng.'},{id:'3',label:'Trả trước 3 tháng',months:3,fee:0,description:'Thanh toán 3 tháng cước. Miễn phí lắp đặt trong dữ liệu mẫu.'},{id:'6',label:'Trả trước 6 tháng',months:6,fee:0,description:'Thanh toán 6 tháng cước. Miễn phí lắp đặt trong dữ liệu mẫu.'},{id:'12',label:'Trả trước 12 tháng',months:12,fee:0,description:'Thanh toán 12 tháng cước. Miễn phí lắp đặt trong dữ liệu mẫu.'}],
  extras:[{id:'box',name:'Thiết bị giải trí bổ sung',price:650000,description:'Khoản mua một lần · dữ liệu mẫu'},{id:'mesh',name:'Thiết bị mở rộng Wi-Fi',price:350000,description:'Khoản mua một lần · dữ liệu mẫu'}],
  vouchers:[{code:'UUDAI50',aliases:['CA2456650KTTOL'],amount:50000,title:'Giảm 50.000đ phí lắp đặt',description:'Áp dụng khi trả sau và có phí lắp đặt.',minMonths:1,installation:true},{code:'UUDAI100',amount:100000,title:'Giảm 100.000đ khi trả trước',description:'Trả trước từ 3 tháng, tổng trước giảm từ 600.000đ.',minMonths:3,minTotal:600000},{code:'UUDAI150',amount:150000,title:'Giảm 150.000đ khi trả trước dài kỳ',description:'Trả trước từ 6 tháng.',minMonths:6},{code:'HETHAN',amount:200000,title:'Ưu đãi đã hết hạn',description:'Không thể áp dụng trong bản mẫu.',expired:true}],
  methods:[{id:'vnpay',name:'VNPAY',description:'Thanh toán bằng mã QR',mark:'QR'},{id:'momo',name:'Ví MoMo',description:'Chuyển sang ứng dụng ví',mark:'M'},{id:'bank',name:'Chuyển khoản nhanh',description:'Thanh toán qua ngân hàng',mark:'NH'},{id:'zalopay',name:'Ví ZaloPay',description:'Chuyển sang ứng dụng ví',mark:'Z'},{id:'international',name:'Thẻ quốc tế',description:'Qua cổng thanh toán bảo mật',mark:'QT'},{id:'atm',name:'Thẻ ATM nội địa',description:'Qua cổng thanh toán ngân hàng',mark:'ATM'}]
};
