// Sample AM links. In production these records come from the sales configuration.
// Product names and descriptions are catalog fields, not free-form sales copy.
window.catalog = [
  {id:'internet-giga',category:'internet',name:'Internet Giga',description:'Phù hợp học tập và làm việc tại nhà.',price:250000,down:'300 Mbps',up:'300 Mbps',features:['Modem Wi-Fi 6','Internet cáp quang']},
  {id:'internet-sky',category:'internet',name:'Internet Sky',description:'Thêm băng thông cho nhiều thiết bị cùng lúc.',price:280000,down:'1 Gbps',up:'300 Mbps',features:['Modem Wi-Fi 6','Internet cáp quang']},
  {id:'internet-meta',category:'internet',name:'Internet Meta',description:'Tải lên nhanh cho livestream và chia sẻ tệp.',price:350000,down:'1 Gbps',up:'1 Gbps',features:['Modem Wi-Fi 6','Tốc độ hai chiều']},
  {id:'combo-giga',category:'combo',name:'Combo Giga – V.VIP',description:'Internet và giải trí cho cả nhà.',price:220000,down:'300 Mbps',up:'300 Mbps',features:['Modem Wi-Fi 6','FPT Play V.VIP']},
  {id:'combo-sky',category:'combo',name:'Combo Sky – V.VIP',description:'Cùng làm việc, xem phim và chơi game.',price:239000,down:'1 Gbps',up:'300 Mbps',features:['Modem Wi-Fi 6','FPT Play V.VIP']},
  {id:'combo-meta',category:'combo',name:'Combo Meta – V.VIP',description:'Kết nối hai chiều và giải trí trong một gói.',price:339000,down:'1 Gbps',up:'1 Gbps',features:['Modem Wi-Fi 6','FPT Play V.VIP']}
];
window.offerSamples = {
  family:{label:'Gia đình · 1 Internet + 3 Combo',sales:{id:'AM-DEMO-01',name:'Minh Anh'},audience:'family',recommended:'combo-sky',sections:{internet:{visible:true,planIds:['internet-giga']},combo:{visible:true,planIds:['combo-giga','combo-sky','combo-meta']}}},
  performance:{label:'Hiệu năng · 3 Internet + 3 Combo',sales:{id:'AM-DEMO-02',name:'Hoàng Nam'},audience:'performance',recommended:'internet-meta',sections:{internet:{visible:true,planIds:['internet-giga','internet-sky','internet-meta']},combo:{visible:true,planIds:['combo-giga','combo-sky','combo-meta']}}},
  apartment:{label:'Căn hộ · 2 Internet + 1 Combo',sales:{id:'AM-DEMO-01',name:'Minh Anh'},audience:'apartment',recommended:'internet-sky',sections:{internet:{visible:true,planIds:['internet-giga','internet-sky']},combo:{visible:true,planIds:['combo-sky']}}},
  internet:{label:'Chỉ Internet · 2 gói',sales:{id:'AM-DEMO-02',name:'Hoàng Nam'},audience:'work',recommended:'internet-meta',sections:{internet:{visible:true,planIds:['internet-sky','internet-meta']},combo:{visible:false,planIds:[]}}},
  combo:{label:'Chỉ Combo · 2 gói',sales:{id:'AM-DEMO-01',name:'Minh Anh'},audience:'family',recommended:'combo-sky',sections:{internet:{visible:false,planIds:[]},combo:{visible:true,planIds:['combo-giga','combo-sky']}}}
};
// Personalization is restricted to approved templates and selected catalog IDs.
window.audienceCopy = {
  performance:'Cho nhu cầu gaming, livestream và làm việc.',
  family:'Internet cho học tập, làm việc và những giờ giải trí của cả nhà.',
  apartment:'Những lựa chọn gọn gàng cho nhịp sống trong căn hộ của bạn.',
  work:'Kết nối cho những ngày làm việc và sáng tạo tại nhà.'
};
