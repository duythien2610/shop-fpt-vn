// UI-only prototype. No requests, payment SDKs or customer persistence.
document.querySelectorAll('.brand span').forEach(el=>el.remove());
document.querySelectorAll('.brand').forEach(el=>el.setAttribute('aria-label','FPT Telecom — trang chủ'));
const plans = window.catalog;
const money=n=>n.toLocaleString('vi-VN');
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const offerKey=Object.hasOwn(window.offerSamples,params.get('offer'))?params.get('offer'):'family';
const offer=window.storefrontConfig || window.offerSamples[offerKey];
let selected=0,region='';
const concept=document.body.dataset.concept || '1';
const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(p){
  const i=plans.indexOf(p),featured=offer.recommended===p.id;
  return `<article class="plan-card ${featured?'featured':''}" data-plan-id="${p.id}"><div class="card-overview"><div class="plan-top"><h3>${html(p.name)}</h3>${featured?'<span class="plan-tag">Gợi ý cho bạn</span>':''}</div><p class="plan-description">${html(p.description)}</p></div><div class="card-price"><div class="plan-price"><strong>${money(p.price)}<small>đ</small></strong><span>/ tháng</span></div></div><div class="card-spec speed-row"><div><small>Tải xuống</small><strong>${html(p.down)}</strong></div><div><small>Tải lên</small><strong>${html(p.up)}</strong></div></div><ul class="card-benefits features">${p.features.map(x=>`<li>${html(x)}</li>`).join('')}</ul><div class="card-actions"><button class="button ${featured?'primary':'outline'}" data-register="${i}">Chọn gói này <span aria-hidden="true">→</span></button><button class="detail-button" data-details="${i}">Chi tiết gói</button></div></article>`;
}
function renderPlans(){
  const groups=[['internet','Internet','Kết nối cho học tập, làm việc và giải trí.'],['combo','Combo','Internet kết hợp truyền hình FPT Play.']].map(([key,title,description])=>{
    const config=offer.sections?.[key];
    if(!config?.visible)return null;
    const selectedPlans=[...new Set(config.planIds)].map(id=>plans.find(p=>p.id===id&&p.category===key)).filter(Boolean).slice(0,3);
    return selectedPlans.length?{key,title,description,plans:selectedPlans}:null;
  }).filter(Boolean);
  $('plan-grid').className='plan-groups';
  $('plan-grid').innerHTML=groups.map(g=>`<section class="offer-group" id="${g.key}" aria-labelledby="heading-${g.key}"><div class="group-heading"><h2 id="heading-${g.key}">${g.title}</h2><p>${g.description}</p><p class="group-price-note" role="status">Giá tham khảo / tháng · xác nhận theo địa chỉ lắp đặt.</p></div><div class="plan-grid count-${g.plans.length}">${g.plans.map(card).join('')}</div></section>`).join('') || '<div class="empty-offer"><h2>Bộ gói đang được cập nhật</h2><p>Liên hệ người tư vấn để được hỗ trợ chọn gói.</p><button class="button outline" id="empty-contact">Liên hệ tư vấn</button></div>';
  $('plan-grid').classList.toggle('one-group',groups.length===1);
  $('plan-grid').classList.toggle('uneven-groups',groups.length===2&&Math.abs(groups[0].plans.length-groups[1].plans.length)>1);
  document.querySelector('.offer-jumps').innerHTML=groups.map(g=>`<a href="#${g.key}">${g.title}<span aria-hidden="true">↓</span></a>`).join('');
  document.querySelector('.plans-bottom')?.remove();
  document.querySelectorAll('.hero-cta').forEach(a=>{a.textContent=groups.length===1?`Chọn gói ${groups[0].title}`:'Chọn gói phù hợp';a.hidden=!groups.length;});
  $('empty-contact')?.addEventListener('click',()=>$('contact-modal').showModal());
  document.querySelectorAll('[data-register]').forEach(b=>b.addEventListener('click',()=>startCheckout(+b.dataset.register)));
  document.querySelectorAll('[data-details]').forEach(b=>b.addEventListener('click',()=>showDetails(+b.dataset.details)));
}
const filenames=['index.html','concept-2.html','concept-3.html'];
const reviewTools=document.querySelector('.prototype-tools');
reviewTools.innerHTML=`<span>BẢN MẪU</span><nav aria-label="So sánh concept">${filenames.map((file,i)=>`<a href="${file}?offer=${offerKey}" ${String(i+1)===concept?'aria-current="page"':''}>Concept ${i+1}</a>`).join('')}</nav><label for="offer-preview">Link AM mẫu</label><select id="offer-preview">${Object.entries(window.offerSamples).map(([key,value])=>`<option value="${key}" ${key===offerKey?'selected':''}>${value.label}</option>`).join('')}</select>`;
$('offer-preview').addEventListener('change',e=>{const url=new URL(location.href);url.searchParams.set('offer',e.target.value);url.hash='';location.href=url.href;});
const audience=window.audienceCopy[offer.audience] || window.audienceCopy.family;
document.querySelectorAll('[data-audience-copy]').forEach(el=>el.textContent=audience);
document.querySelectorAll('[data-sales-name]').forEach(el=>el.textContent=offer.sales.name);
document.querySelectorAll('[data-sales-initial]').forEach(el=>el.textContent=offer.sales.name.charAt(0));
document.querySelectorAll('.sales-reference strong').forEach(el=>el.textContent=offer.sales.id);
const contact=$('contact-modal');
contact.querySelector('h2').textContent=offer.sales.name;
contact.querySelector('p.muted').textContent='Hỗ trợ chọn gói & đăng ký';
contact.querySelector('.contact-message').textContent='Trao đổi qua Zalo hoặc điện thoại để được tư vấn về gói và địa chỉ lắp đặt.';
contact.querySelector('.demo-note').textContent='Bản mẫu: thông tin sales minh họa, chưa kết nối Zalo hoặc điện thoại.';
contact.querySelector('.contact-message').insertAdjacentHTML('afterend','<div class="contact-channels"><button class="button outline" data-contact-channel="Zalo">Nhắn Zalo</button><button class="button outline" data-contact-channel="Điện thoại">Gọi tư vấn</button></div><p class="small muted" id="contact-status" role="status"></p>');
document.querySelectorAll('[data-contact-channel]').forEach(b=>b.addEventListener('click',()=>{$('contact-status').textContent=`${b.dataset.contactChannel}: bản mẫu chưa có thông tin liên hệ thật.`;}));
function showDetails(i){selected=i;const p=plans[i];$('details-body').innerHTML=`<h2>${p.name}</h2><p class="muted">${p.description}</p><div class="plan-price"><strong>${money(p.price)}</strong><span>đ / tháng · giá tham khảo từ</span></div><div class="speed-row"><div><small>Download</small><strong>${p.down}</strong></div><div><small>Upload</small><strong>${p.up}</strong></div></div><ul class="features">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul><div class="notice"><strong>Kiểm tra theo địa chỉ lắp đặt</strong><p>Giá, thiết bị, ưu đãi, phí ban đầu và chu kỳ thanh toán cần được xác nhận trước khi đặt dịch vụ.</p></div>`;$('details-modal').showModal();}
$('details-register').addEventListener('click',()=>{$('details-modal').close();startCheckout(selected);});
const faqs=[['Giá đã gồm phí lắp đặt chưa?','Giá hiển thị là giá tham khảo theo tháng. Phí ban đầu và giá áp dụng sẽ được xác nhận theo địa chỉ trước khi thanh toán.'],['Tôi có phải chọn lại gói khi đăng ký?','Không. Gói vừa chọn được giữ sẵn trong thông tin đăng ký. Bạn có thể quay lại đổi gói nếu muốn.'],['Ai sẽ hỗ trợ tôi khi cần?',`Bạn có thể liên hệ ${offer.sales.name} để được hỗ trợ chọn gói và kiểm tra thông tin lắp đặt.`]];
$('faq-list').innerHTML=faqs.map(([q,a],i)=>`<div class="faq-item"><h3><button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}">${q}<span aria-hidden="true">+</span></button></h3><div class="faq-answer" id="faq-answer-${i}" inert><div><p>${a}</p></div></div></div>`).join('');
// The heading wrapper keeps accessible hierarchy; expansion CSS targets the item.
document.querySelectorAll('.faq-question').forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));b.querySelector('span').textContent=open?'+':'−';const panel=$(b.getAttribute('aria-controls'));panel.inert=open;panel.style.gridTemplateRows=open?'0fr':'1fr';}));
document.querySelectorAll('dialog .close-button').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
document.querySelectorAll('.contact-trigger').forEach(b=>b.addEventListener('click',()=>$('contact-modal').showModal()));
$('region-trigger').addEventListener('click',()=>$('region-modal').showModal());
document.querySelectorAll('.region-options button').forEach(b=>b.addEventListener('click',()=>{region=b.textContent;$('region-label').textContent=region;document.querySelectorAll('.group-price-note').forEach(p=>p.textContent=`${region}: giữ giá tham khảo / tháng · chưa xác thực giá theo địa chỉ.`);$('region-modal').close();}));
function updateStep(step){document.querySelectorAll('.steps li').forEach(li=>{li.classList.toggle('active',+li.dataset.step===step);li.setAttribute('aria-current',+li.dataset.step===step?'step':'false');});}
function startCheckout(i){selected=i;const p=plans[i];$('home').hidden=true;$('checkout').hidden=false;$('registration-form').hidden=false;$('confirmation').hidden=true;$('success').hidden=true;$('payment-error').hidden=true;updateStep(1);$('order-name').textContent=p.name;$('order-description').textContent=p.description;$('order-price').textContent=money(p.price);$('order-total').textContent=money(p.price)+'đ';$('order-features').innerHTML=p.features.map(f=>`<li>${f}</li>`).join('');if(region&&region!=='Khu vực khác')$('province').value=region;window.scrollTo({top:0,behavior:'instant'});$('full-name').focus({preventScroll:true});}
function home(){ $('home').hidden=false;$('checkout').hidden=true;window.scrollTo({top:0,behavior:'instant'});}
$('back-home').addEventListener('click',home);$('restart').addEventListener('click',home);
document.querySelectorAll('.brand').forEach(a=>a.addEventListener('click',home));
document.querySelectorAll('.header nav a').forEach(a=>a.addEventListener('click',()=>{if($('home').hidden){$('home').hidden=false;$('checkout').hidden=true;}}));
let customer={};
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function dl(rows){return rows.map(([key,value])=>`<div><dt>${key}</dt><dd>${escapeHTML(value)}</dd></div>`).join('');}
$('registration-form').addEventListener('submit',e=>{e.preventDefault();let invalid=null;const rules=[['full-name','name-error','Vui lòng nhập họ tên.',v=>v.trim().length>1],['phone','phone-error','Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số.',v=>/^0\d{9}$/.test(v.replace(/\s/g,''))],['province','province-error','Vui lòng nhập tỉnh / thành phố.',v=>v.trim()],['ward','ward-error','Vui lòng nhập phường / xã.',v=>v.trim()],['address','address-error','Vui lòng nhập số nhà và tên đường.',v=>v.trim()]];rules.forEach(([id,error,message,valid])=>{const ok=valid($(id).value);$(error).textContent=ok?'':message;$(id).setAttribute('aria-invalid',String(!ok));$(id).setAttribute('aria-describedby',error);if(!ok&&!invalid)invalid=$(id);});$('consent-error').textContent=$('consent').checked?'':'Bạn cần đồng ý chính sách để tiếp tục.';if(!$('consent').checked&&!invalid)invalid=$('consent');if(invalid){invalid.focus();return;}customer={name:$('full-name').value.trim(),phone:$('phone').value.trim(),address:[$('address').value,$('ward').value,$('province').value].map(x=>x.trim()).join(', ')};$('customer-summary').innerHTML=dl([['Họ tên',customer.name],['Số điện thoại',customer.phone],['Địa chỉ',customer.address]]);$('registration-form').hidden=true;$('confirmation').hidden=false;updateStep(2);window.scrollTo({top:0,behavior:'instant'});});
$('edit-info').addEventListener('click',()=>{$('confirmation').hidden=true;$('registration-form').hidden=false;updateStep(1);$('full-name').focus();});
$('fail-demo').addEventListener('click',()=>{$('payment-error').hidden=false;$('payment-error').scrollIntoView({block:'nearest',behavior:'smooth'});});
$('complete-demo').addEventListener('click',()=>{const later=document.querySelector('input[name="payment"]:checked').value==='later';$('result-title').textContent=later?'Yêu cầu tư vấn mẫu đã ghi nhận':'Thanh toán mô phỏng thành công';$('result-summary').innerHTML=dl([['Mã mẫu','DEMO-0001'],['Gói dịch vụ',plans[selected].name],['Khách hàng',customer.name],['Trạng thái',later?'Chờ tư vấn — mô phỏng':'Hoàn tất — mô phỏng']]);$('confirmation').hidden=true;$('success').hidden=false;updateStep(3);window.scrollTo({top:0,behavior:'instant'});});
document.addEventListener('scroll',()=>{document.documentElement.classList.add('is-scrolling');clearTimeout(window.scrollbarTimer);window.scrollbarTimer=setTimeout(()=>document.documentElement.classList.remove('is-scrolling'),500);},{passive:true});
renderPlans();
