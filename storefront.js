/* One UI runtime for all three concepts. No API calls or customer storage. */
(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => Number(value).toLocaleString('vi-VN')+'đ';
  const files = ['index.html','concept-2.html','concept-3.html'];
  const titles = ['Tối giản · chọn nhanh','Hiện đại · hiệu năng','Đời sống · có người hỗ trợ'];
  const q = new URLSearchParams(location.search);
  if(['1','2','3'].includes(q.get('concept')))document.body.dataset.concept=q.get('concept');
  let key = Object.hasOwn(window.offerSamples,q.get('offer'))?q.get('offer'):'family';
  const root = document.getElementById('app');
  const icon = (name) => {
    const paths = {arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',check:'<path d="m5 12 4 4L19 6"/>',wifi:'<path d="M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0m-9 4a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r=".5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',down:'<path d="m6 9 6 6 6-6"/>',back:'<path d="M19 12H5m5-5-5 5 5 5"/>',ticket:'<path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Z"/><path d="M15 5v3m0 3v2m0 3v3"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>'};
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.arrow}</svg>`;
  };
  const offer = () => window.storefrontConfig || window.offerSamples[key];
  const groups = () => ['internet','combo'].map(category=>({category,title:category==='internet'?'Internet':'Combo Internet + Truyền hình',plans:offer().sections?.[category]?.visible?[...new Set(offer().sections[category].planIds||[])].map(id=>window.catalog.find(p=>p.id===id&&p.category===category)).filter(Boolean).slice(0,3):[]})).filter(g=>g.plans.length);
  const avatar = () => `<span class="sales-avatar" aria-hidden="true">${esc(offer().sales.name.charAt(0))}</span>`;
  let detailsPlan;
  function card(plan,index){
    const featured=offer().recommended===plan.id,mode=document.body.dataset.concept;
    const image=mode==='1'?'':`<div class="plan-photo"><img src="assets/${esc(plan.image)}" alt="" loading="lazy" width="640" height="420"><span>${plan.category==='internet'?'Internet':'Internet + FPT Play'}</span></div>`;
    return `<article class="plan-card ${featured?'featured':''}" data-plan-id="${esc(plan.id)}">${image}<div class="card-overview"><div class="plan-top"><span class="plan-number">0${index+1}</span><h3>${esc(plan.name)}</h3>${featured?'<span class="plan-tag">Sales gợi ý</span>':''}</div><p class="plan-description">${esc(plan.description)}</p></div><div class="card-price"><strong>${money(plan.price)}</strong><span>/ tháng</span></div><div class="card-spec"><div><small>Tải xuống</small><strong>${esc(plan.down)}</strong></div><div><small>Tải lên</small><strong>${esc(plan.up)}</strong></div></div><ul class="features">${plan.features.map(f=>`<li>${icon('check')}${esc(f)}</li>`).join('')}</ul><div class="card-actions"><button class="button ${featured?'primary':'outline'}" data-register="${esc(plan.id)}">Chọn gói này ${icon('arrow')}</button><button class="text-button" data-details="${esc(plan.id)}">Chi tiết gói</button></div></article>`;
  }
  function hero(){
    const mode=document.body.dataset.concept,items=groups().flatMap(g=>g.plans),count=items.length;
    const titlesHero={'1':'Chọn gói vừa nhu cầu.<br><span>Rõ giá, dễ quyết định.</span>','2':'Kết nối nhanh.<br><span>Cho mọi ý tưởng.</span>','3':'Một kết nối.<br><span>Cả nhà gần nhau hơn.</span>'};
    const requested=offer().banners?.[mode],source=mode==='1'?'card-work-v4.webp':['hero-tech-v4.webp','hero-family-v4.webp'].includes(requested)?requested:mode==='2'?'hero-tech-v4.webp':'hero-family-v4.webp';
    const cta=count?`<a href="#plans" class="button primary hero-cta">${mode==='1'?'So sánh các gói':'Xem gói phù hợp'} ${icon('arrow')}</a>`:'';
    const context=`${count} gói được sales chọn · ${esc(offer().address?.province||'Khu vực theo link')}`;
    let visual=`<div class="hero-visual"><img src="assets/${source}" alt="${mode==='1'?'Ảnh minh họa góc làm việc tại nhà':mode==='2'?'Ảnh minh họa các sợi quang phát sáng trên nền than':'Ảnh minh họa gia đình cùng thư giãn trong căn hộ'}" width="1536" height="1024" fetchpriority="high">${mode==='2'?'<span class="visual-caption">KẾT NỐI CHO NHỮNG Ý TƯỞNG LỚN</span>':`<div class="hero-advisor">${avatar()}<span><strong>${esc(offer().sales.name)}</strong><small>Người hỗ trợ đăng ký của bạn</small></span><button class="icon-button contact-trigger" aria-label="Thông tin người hỗ trợ">${icon('arrow')}</button></div>`}</div>`;
    return `<section class="hero-section"><div class="container hero"><div class="hero-copy"><p class="eyebrow">FPT TELECOM · GÓI DỊCH VỤ CHO BẠN</p><h1>${titlesHero[mode]}</h1><p class="hero-description">${esc(window.audienceCopy[offer().audience]||window.audienceCopy.family)}</p>${cta}<p class="banner-context">${context}</p></div>${visual}</div></section>`;
  }
  function renderHome(){
    const list=groups(),mode=document.body.dataset.concept;
    const menu=document.querySelector('.header nav');
    menu.innerHTML=mode==='1'?'':`<a href="#plans">Gói cước</a><a href="#registration-info">Thông tin đăng ký</a><a href="#sales-support">Hỗ trợ</a>`;
    menu.hidden=mode==='1';
    document.querySelectorAll('.footer-concepts button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.conceptChoice===mode)));
    document.querySelector('.header .contact-trigger').innerHTML=`Tư vấn cùng sales ${icon('arrow')}`;
    document.getElementById('home').innerHTML=hero()+`<section id="plans" class="plans-section"><div class="container"><div class="section-heading"><div><p class="eyebrow">BỘ GÓI TRÊN LINK CỦA BẠN</p><h2>${mode==='1'?'So sánh rõ. Chọn dễ.':mode==='2'?'Hiệu năng bạn cần.':'Chọn cho nhịp sống nhà bạn.'}</h2></div><span class="location-label">${icon('pin')}${esc(offer().address?.province||'Khu vực theo link')}<small>Đổi tại bước đăng ký</small></span></div><nav class="offer-jumps" aria-label="Đi đến nhóm gói">${list.map(g=>`<a href="#${g.category}">${g.category==='internet'?'Internet':'Combo'} ${icon('down')}</a>`).join('')}</nav><div id="plan-grid" class="plan-groups">${list.map(g=>`<section class="offer-group" id="${g.category}" aria-labelledby="heading-${g.category}"><div class="group-heading"><h2 id="heading-${g.category}">${g.title}</h2><p>${g.category==='internet'?'Kết nối cho học tập, làm việc và sáng tạo.':'Internet cùng nội dung giải trí FPT Play.'}</p><span>${g.plans.length} gói lựa chọn</span></div><div class="plan-grid count-${g.plans.length}">${g.plans.map(card).join('')}</div></section>`).join('')||`<div class="empty-state"><span class="state-icon">${icon('wifi')}</span><h2>Bộ gói đang được cập nhật</h2><p>Link này chưa có gói để đăng ký. Liên hệ sales để nhận bộ gói phù hợp.</p><button class="button outline contact-trigger">Liên hệ người hỗ trợ</button></div>`}</div><p class="price-note">Giá gói minh họa theo tháng. Phí, ưu đãi và tổng thanh toán được kiểm tra tại bước đăng ký.</p><section class="sales-strip" id="sales-support">${avatar()}<div><strong>${esc(offer().sales.name)}</strong><p>Người hỗ trợ chọn gói và đăng ký của bạn</p></div><button class="button outline contact-trigger">${mode==='3'?'Trao đổi với sales':'Cần tư vấn?'}</button></section></div></section><section id="registration-info" class="faq-section container"><div><p class="eyebrow">TRƯỚC KHI ĐĂNG KÝ</p><h2>Thông tin bạn cần.</h2><p>Ba câu trả lời để bắt đầu dễ hơn.</p></div><div class="faq-list">${[['Giá trên card đã gồm phí lắp đặt chưa?','Giá trên card là cước tháng minh họa. Phí lắp đặt, kỳ cước và ưu đãi được thể hiện riêng trước khi thanh toán.'],['Tôi có thể đổi địa chỉ lắp đặt không?','Có. Chọn “Đổi địa chỉ lắp đặt” ở checkout. Gói, giá và ưu đãi sẽ được kiểm tra lại trước khi thanh toán.'],['Ai sẽ hỗ trợ tôi sau khi đăng ký?',`${offer().sales.name} là người hỗ trợ trên link này. Thanh toán thành công được tiếp nối bằng bước xác nhận lịch lắp đặt.`]].map(([title,body],i)=>`<div class="faq-item"><h3><button aria-expanded="false" aria-controls="faq-${i}" class="faq-question">${esc(title)}${icon('down')}</button></h3><div class="faq-answer" id="faq-${i}" inert><div><p>${esc(body)}</p></div></div></div>`).join('')}</div></section>`;
    document.querySelectorAll('#home img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;img.parentElement.classList.add('image-missing');}));
    renderTools();
  }
  function renderTools(){
    const panel=document.getElementById('review-dialog');
    panel.innerHTML=`<div class="modal-header"><div><p class="eyebrow">CÔNG CỤ DÀNH CHO PO</p><h2>Duyệt các concept</h2></div><button class="icon-button" data-close aria-label="Đóng công cụ duyệt">${icon('close')}</button></div><p class="muted">Đổi concept giữ nguyên dữ liệu đang nhập trong tab này.</p><div class="concept-switch">${titles.map((name,i)=>`<a class="concept-choice" href="${files[i]}?offer=${key}" data-concept-choice="${i+1}" ${document.body.dataset.concept===String(i+1)?'aria-current="page"':''}><span>0${i+1}</span><strong>${name}</strong>${icon('arrow')}</a>`).join('')}</div><div class="field"><label for="offer-preview">Link AM mẫu</label><select id="offer-preview">${Object.entries(window.offerSamples).map(([id,o])=>`<option value="${id}" ${id===key?'selected':''}>${esc(o.label)}</option>`).join('')}</select></div><div class="field"><label for="scenario-preview">Kết quả kiểm tra địa chỉ mẫu</label><select id="scenario-preview"><option value="normal">Theo địa chỉ · đủ điều kiện</option><option value="same">Đổi địa chỉ · giữ giá</option><option value="price">Giá tăng 30.000đ/tháng</option><option value="unavailable">Gói đã chọn không áp dụng</option><option value="none">Không có gói phù hợp</option><option value="error">Lỗi kiểm tra · thử lại</option></select></div><div class="review-screens"><button class="button outline" data-preview="home">Homepage</button><button class="button outline" data-preview="checkout">Checkout</button><button class="button outline" data-preview="payment">Payment mẫu</button></div><p class="demo-note">Giá, địa danh mẫu, điều kiện voucher, phí và phương thức chỉ phục vụ duyệt UX. Không gửi thông tin hoặc thu tiền.</p><a class="text-link" href="design-review.html">Xem bảng so sánh & hướng dẫn duyệt →</a>`;
    if(window.Purchase)panel.querySelector('#scenario-preview').value=window.Purchase.state.scenario;
  }
  function details(id){
    detailsPlan=window.catalog.find(p=>p.id===id);if(!detailsPlan)return;
    const p=detailsPlan,d=document.getElementById('details-dialog');
    d.innerHTML=`<div class="modal-header"><p class="eyebrow">CHI TIẾT GÓI</p><button class="icon-button" data-close aria-label="Đóng chi tiết gói">${icon('close')}</button></div><h2>${esc(p.name)}</h2><p class="muted">${esc(p.description)}</p><div class="details-price"><strong>${money(p.price)}</strong><span>/ tháng · minh họa</span></div><div class="card-spec"><div><small>Tải xuống</small><strong>${esc(p.down)}</strong></div><div><small>Tải lên</small><strong>${esc(p.up)}</strong></div></div><ul class="features">${p.features.map(f=>`<li>${icon('check')}${esc(f)}</li>`).join('')}</ul><div class="notice"><strong>Giá và ưu đãi theo địa chỉ</strong><p>Thông tin khu vực được điền sẵn từ link. Bạn có thể thay đổi và kiểm tra lại trước khi thanh toán.</p></div><div class="modal-footer"><button class="button primary" data-register="${p.id}">Chọn gói này</button></div>`;d.showModal();
  }
  function contact(){
    const s=offer().sales,d=document.getElementById('contact-dialog');let channels='';
    const phone=String(s.phone||'').replace(/[\s().-]/g,'');if(/^\+?\d{9,15}$/.test(phone))channels+=`<a class="button outline" href="tel:${phone}">Gọi tư vấn</a>`;
    try{const u=new URL(s.zaloUrl);if(u.protocol==='https:'&&u.hostname==='zalo.me')channels+=`<a class="button outline" href="${esc(u.href)}" target="_blank" rel="noopener">Nhắn Zalo</a>`;}catch{}
    d.innerHTML=`<div class="modal-header"><h2>Người hỗ trợ của bạn</h2><button class="icon-button" data-close aria-label="Đóng thông tin sales">${icon('close')}</button></div><div class="contact-person">${avatar()}<div><strong>${esc(s.name)}</strong><p class="muted">${esc(s.id)}</p></div></div><p>Hỗ trợ chọn gói, đăng ký và xác nhận thông tin lắp đặt.</p><div class="contact-channels">${channels||'<p class="muted">Link mẫu chưa cấu hình số điện thoại hoặc Zalo.</p>'}</div><p class="demo-note">Thông tin sales minh họa. Không tự gửi tin nhắn hay thực hiện cuộc gọi.</p>`;d.showModal();
  }
  function home(){if(window.Purchase?.close()===false)return;document.getElementById('home').hidden=false;document.getElementById('purchase').hidden=true;document.body.classList.remove('purchasing');scrollTo({top:0,behavior:'instant'});}
  function setConcept(value){
    document.body.dataset.concept=value;document.title=`FPT Telecom · ${titles[Number(value)-1]}`;
    const url=new URL(location.protocol==='file:'?location.href:files[Number(value)-1],location.href);url.searchParams.set('offer',key);if(location.protocol==='file:')url.searchParams.set('concept',value);else url.searchParams.delete('concept');history.replaceState(null,'',url);renderHome();window.Purchase?.render();
  }
  root.innerHTML=`<a class="skip-link" href="#home">Đến nội dung chính</a><header class="header"><div class="container header-inner"><a class="brand" href="#home" aria-label="FPT Telecom — trang chủ"><img src="assets/fpt-logo.svg" alt="FPT Telecom" width="106" height="42"></a><nav aria-label="Điều hướng"><a href="#plans">Chọn gói dịch vụ</a></nav><button class="button outline contact-trigger">Liên hệ tư vấn ${icon('arrow')}</button></div></header><main id="home" tabindex="-1"></main><main id="purchase" class="container purchase" hidden></main><footer class="footer"><div class="container"><img src="assets/fpt-logo.svg" alt="FPT Telecom" width="100" height="40"><p>Kết nối cho những điều quan trọng.</p><a href="https://fpt.vn/ho-tro/chinh-sach-quy-trinh/5107/5076/286" target="_blank" rel="noopener">Chính sách dữ liệu cá nhân</a></div><div class="container footer-note">Prototype AM · Giá và ưu đãi minh họa · Không có giao dịch thật</div></footer><button class="review-launch" id="review-launch">${icon('user')}<span>Duyệt concept</span></button><dialog id="review-dialog" class="review-dialog" aria-label="Duyệt các concept"></dialog><dialog id="details-dialog" aria-label="Chi tiết gói dịch vụ"></dialog><dialog id="contact-dialog" aria-label="Thông tin người hỗ trợ"></dialog><dialog id="voucher-dialog" aria-label="Chọn ưu đãi"></dialog>`;
  root.addEventListener('click',e=>{
    const b=e.target.closest('button,a');if(!b)return;
    if(b.matches('[data-close]'))b.closest('dialog').close();
    else if(b.matches('.contact-trigger'))contact();
    else if(b.matches('[data-register]')){document.getElementById('details-dialog').close();window.Purchase.open(b.dataset.register);}
    else if(b.matches('[data-details]'))details(b.dataset.details);
    else if(b.matches('.brand')){e.preventDefault();home();}
    else if(b.matches('.header nav a')&&document.getElementById('home').hidden)home();
    else if(b.matches('.faq-question')){const expanded=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!expanded));const panel=document.getElementById(b.getAttribute('aria-controls'));panel.inert=expanded;panel.classList.toggle('expanded',!expanded);}
    else if(b.id==='review-launch')document.getElementById('review-dialog').showModal();
    else if(b.dataset.conceptChoice){e.preventDefault();setConcept(b.dataset.conceptChoice);}
    else if(b.dataset.preview){document.getElementById('review-dialog').close();if(b.dataset.preview==='home')home();else window.Purchase.preview(b.dataset.preview);}
  });
  root.addEventListener('change',e=>{
    if(e.target.id==='offer-preview'){if(['waiting','pending'].includes(window.Purchase?.state.step)){e.target.value=key;return;}key=e.target.value;window.Purchase?.reset();setConcept(document.body.dataset.concept);home();}
    if(e.target.id==='scenario-preview')window.Purchase.setScenario(e.target.value);
  });
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}));
  document.querySelector('.footer-note').append(document.getElementById('review-launch'));
  document.querySelector('.footer').insertAdjacentHTML('beforeend',`<nav class="container footer-concepts" aria-label="Chọn concept"><span>Chọn giao diện</span>${['1','2','3'].map(value=>`<button class="button outline" data-concept-choice="${value}" aria-pressed="false">Concept ${value}</button>`).join('')}</nav>`);
  window.Storefront={esc,money,icon,offer,groups,avatar,home,setConcept,renderHome,renderTools,files,titles};
  renderHome();
})();
