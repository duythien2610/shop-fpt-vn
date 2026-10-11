/* Deterministic UI-only commerce simulation. No requests, SDKs or persistence. */
(() => {
  const A=window.Storefront,D=window.demoCommerce,{esc,money,icon}=A;
  const flow=document.getElementById('purchase'),voucherDialog=document.getElementById('voucher-dialog');
  const initial=()=>({planId:null,values:{},step:'info',substep:1,addressEditing:false,period:'post',extras:[],method:'vnpay',voucher:null,voucherCode:'',voucherMessage:'',voucherError:false,status:'dirty',quote:null,lastAcceptedMonthly:null,needsPriceConfirm:false,scenario:'normal',errors:{},addressMessage:'',epoch:0,transaction:null,extrasOpen:false});
  const state=initial();
  let timer,chosenVoucher='';
  const plan=()=>window.catalog.find(p=>p.id===state.planId);
  const period=()=>D.periods.find(p=>p.id===state.period)||D.periods[0];
  const signature=()=>JSON.stringify([state.planId,...['province','ward','houseType','building','address','block'].map(k=>String(state.values[k]||'').trim()),state.scenario]);
  const validQuote=()=>state.status==='verified'&&state.quote?.signature===signature();
  const addressText=()=>[state.values.houseType==='apartment'&&state.values.building,state.values.block,state.values.address,state.values.ward,state.values.province].filter(Boolean).join(', ');
  function totals(){
    const monthly=validQuote()?state.quote.monthly:plan()?.price||0,p=period();
    const service=p.id==='post'?0:monthly*p.months;
    const extras=state.extras.map(id=>D.extras.find(x=>x.id===id)).filter(Boolean).reduce((sum,x)=>sum+x.price,0);
    const subtotal=service+p.fee+extras;
    const discount=validQuote()&&state.voucher&&!voucherReason(state.voucher,{subtotal,monthly})?Math.min(subtotal,state.voucher.amount):0;
    return {monthly,service,fee:p.fee,extras,subtotal,discount,total:Math.max(0,subtotal-discount)};
  }
  function voucherReason(v,amounts){
    if(!v)return 'Mã ưu đãi không tồn tại.';
    if(v.expired)return 'Ưu đãi đã hết hạn.';
    if(!validQuote())return 'Cần kiểm tra địa chỉ trước khi chọn ưu đãi.';
    if(v.installation&&period().fee===0)return 'Ưu đãi chỉ áp dụng khi có phí lắp đặt.';
    if(period().months<(v.minMonths||1))return `Cần chọn trả trước từ ${v.minMonths} tháng.`;
    const subtotal=amounts?.subtotal ?? ((period().id==='post'?0:state.quote.monthly*period().months)+period().fee+state.extras.map(id=>D.extras.find(x=>x.id===id)).filter(Boolean).reduce((sum,x)=>sum+x.price,0));
    if(subtotal<(v.minTotal||0))return `Tổng trước giảm cần từ ${money(v.minTotal)}.`;
    return '';
  }
  function revalidateVoucher(){
    if(state.voucher){const reason=voucherReason(state.voucher);if(reason){state.voucher=null;state.voucherMessage='Ưu đãi đã được gỡ: '+reason;state.voucherError=true;}}
  }
  function input(name,label,{type='text',optional=false,placeholder='',autocomplete='',readonly=false,options=null}={}){
    const v=state.values[name]??'',err=state.errors[name]||'',id='buy-'+name;
    const attr=`id="${id}" name="${name}" ${autocomplete?`autocomplete="${autocomplete}"`:''} aria-describedby="${id}-error" ${err?'aria-invalid="true"':''} ${readonly?'disabled':''} ${optional?'':'required'}`;
    const control=options?`<select ${attr}>${options.map(o=>`<option value="${esc(typeof o==='string'?o:o.value)}" ${v===(typeof o==='string'?o:o.value)?'selected':''}>${esc(typeof o==='string'?o:o.label)}</option>`).join('')}</select>`:type==='textarea'?`<textarea ${attr} rows="2" placeholder="${esc(placeholder)}">${esc(v)}</textarea>`:`<input ${attr} type="${type}" ${type==='tel'?'inputmode="tel"':''} value="${esc(v)}" placeholder="${esc(placeholder)}">`;
    return `<div class="field"><label for="${id}">${label}${optional?' <span class="optional">(không bắt buộc)</span>':' <b>*</b>'}</label>${control}<p class="field-error" id="${id}-error">${esc(err)}</p></div>`;
  }
  function addressPanel(){
    const v=state.values,editing=state.addressEditing,wards=D.regions[v.province]?.wards||[];
    return `<section class="purchase-panel"><div class="panel-heading"><div><p class="eyebrow">01 · NƠI LẮP ĐẶT</p><h2>Địa chỉ của bạn</h2></div><button type="button" class="text-button" data-action="edit-address">${editing?'Giữ địa chỉ này':'Đổi địa chỉ lắp đặt'}</button></div><p class="panel-description">Khu vực và loại nhà đã được điền từ link của sales.</p><div class="field-grid">${input('province','Tỉnh / Thành phố',{options:Object.keys(D.regions),readonly:!editing,autocomplete:'address-level1'})}${input('ward','Phường / Xã',{options:wards,readonly:!editing,autocomplete:'address-level2'})}</div><fieldset class="house-types"><legend>Loại địa điểm <b>*</b></legend>${[['house','Nhà riêng / Nhà phố'],['apartment','Căn hộ chung cư']].map(([id,label])=>`<label><input type="radio" name="houseType" value="${id}" ${v.houseType===id?'checked':''} ${editing?'':'disabled'}><span>${label}</span></label>`).join('')}</fieldset>${v.houseType==='apartment'?`${input('building','Chung cư',{options:[{value:'',label:'Chọn chung cư'},...D.buildings],readonly:!editing})}<div class="field-grid">${input('block','Tòa / Tầng',{optional:true,placeholder:'Ví dụ: Tòa A, tầng 12'})}${input('address','Số căn hộ',{placeholder:'Ví dụ: A1205',autocomplete:'address-line1'})}</div>`:input('address','Số nhà, tên đường',{placeholder:'Ví dụ: 123 Đường mẫu',autocomplete:'street-address'})}${input('note','Ghi chú',{type:'textarea',optional:true,placeholder:'Hướng dẫn tìm nhà hoặc yêu cầu về lịch lắp đặt'})}<div id="address-feedback" aria-live="polite">${addressFeedback()}</div><button type="button" class="button outline check-address" data-action="check-address" ${state.status==='checking'?'disabled aria-busy="true"':''}>${state.status==='checking'?'Đang kiểm tra…':'Kiểm tra địa chỉ & giá'}</button></section>`;
  }
  function addressFeedback(){
    if(state.status==='checking')return '<div class="status-message checking"><span class="spinner" aria-hidden="true"></span><span>Đang kiểm tra gói và giá theo địa chỉ…</span></div>';
    if(state.status==='error')return `<div class="status-message error"><strong>Chưa kiểm tra được địa chỉ</strong><p>${esc(state.addressMessage)}</p></div>`;
    if(state.status==='unavailable'||state.status==='none'){
      const alternatives=state.quote?.alternatives||[];
      return `<div class="status-message warning"><strong>${alternatives.length?'Gói đã chọn không áp dụng tại địa chỉ này':'Chưa có gói phù hợp tại địa chỉ này'}</strong><p>${alternatives.length?'Chọn một gói khác bên dưới. Thông tin bạn đã nhập vẫn được giữ.':'Bạn có thể sửa địa chỉ hoặc liên hệ sales để được hỗ trợ.'}</p></div>${alternatives.length?`<div class="replacement-plans">${alternatives.map(p=>`<button type="button" class="replacement-plan" data-replace="${p.id}"><span><strong>${esc(p.name)}</strong><small>${esc(p.down)} · ${esc(p.up)}</small></span><span>${money(p.price)} ${icon('arrow')}</span></button>`).join('')}</div>`:'<button type="button" class="text-button contact-trigger">Liên hệ người hỗ trợ</button>'}`;
    }
    if(validQuote())return `<div class="status-message ${state.needsPriceConfirm?'warning':'success'}"><strong>${state.needsPriceConfirm?'Giá đã thay đổi theo địa chỉ':'Gói có thể đăng ký tại địa chỉ này · mẫu'}</strong>${state.needsPriceConfirm?`<p>Cước tháng: <s>${money(state.lastAcceptedMonthly)}</s> → <strong>${money(state.quote.monthly)}</strong>. Phí và ưu đãi bên cạnh đã được cập nhật.</p><button type="button" class="button outline" data-action="confirm-price">Tôi đồng ý với giá mới</button>`:'<p>Kiểm tra hoàn tất trong bản mẫu. Có thể tiếp tục đăng ký.</p>'}</div>`;
    return '<div class="status-message neutral"><strong>Kiểm tra trước khi thanh toán</strong><p>Gói, giá và ưu đãi sẽ được xác nhận theo địa chỉ bạn nhập.</p></div>';
  }
  function contactPanel(){
    return `<section class="purchase-panel"><p class="eyebrow">02 · NGƯỜI ĐĂNG KÝ</p><h2>Thông tin liên hệ</h2><p class="panel-description">${document.body.dataset.concept==='3'?'Để người hỗ trợ của bạn xác nhận lịch lắp đặt.':'Dùng để xác nhận đăng ký và lịch lắp đặt.'}</p><div class="field-grid">${input('name','Họ và tên',{autocomplete:'name'})}${input('phone','Số điện thoại',{type:'tel',autocomplete:'tel',placeholder:'10 chữ số, bắt đầu bằng 0'})}</div><label class="consent"><input id="buy-consent" type="checkbox" name="consent" ${state.values.consent?'checked':''} aria-describedby="buy-consent-error" ${state.errors.consent?'aria-invalid="true"':''}><span>Tôi đồng ý để FPT liên hệ về đăng ký và xử lý dữ liệu theo <a href="https://fpt.vn/ho-tro/chinh-sach-quy-trinh/5107/5076/286" target="_blank" rel="noopener">chính sách dữ liệu cá nhân</a>.</span></label><p class="field-error" id="buy-consent-error">${esc(state.errors.consent||'')}</p></section>`;
  }
  function summary(){
    const p=plan(),t=totals(),checked=validQuote(),paymentStage=state.step==='payment',eligible=D.vouchers.filter(v=>!voucherReason(v)).length;
    return `<aside class="purchase-summary"><p class="eyebrow">GÓI BẠN ĐÃ CHỌN</p><h2>${esc(p.name)}</h2><p class="summary-description">${esc(p.description)}</p><div class="monthly-price"><strong>${money(t.monthly)}</strong><span>/ tháng${checked?'':' · tham khảo'}</span></div><div class="summary-speeds"><span>↓ ${esc(p.down)}</span><span>↑ ${esc(p.up)}</span></div><ul class="features">${p.features.map(f=>`<li>${icon('check')}${esc(f)}</li>`).join('')}</ul><div class="summary-divider"></div><h3>Thông tin thanh toán</h3><dl class="cost-breakdown"><div><dt>${period().label}</dt><dd>${checked?money(t.service):'Chờ kiểm tra'}</dd></div><div><dt>Thiết bị Wi-Fi 6 · 1 cái</dt><dd>0đ</dd></div><div><dt>Phí lắp đặt</dt><dd>${checked?money(t.fee):'Chờ kiểm tra'}</dd></div>${state.extras.map(id=>D.extras.find(x=>x.id===id)).filter(Boolean).map(x=>`<div><dt>${esc(x.name)}</dt><dd>${checked?money(x.price):'Chờ kiểm tra'}</dd></div>`).join('')}</dl><p class="fee-note">${period().id==='post'?'Phí lắp đặt áp dụng cho đăng ký mới trong dữ liệu mẫu. Cước tháng chưa thu hôm nay.':'Miễn phí lắp đặt theo kỳ trả trước trong dữ liệu mẫu.'}</p>${paymentStage?`<div class="voucher-entry"><div class="voucher-input-wrap"><input id="voucher-code" aria-label="Nhập mã ưu đãi" value="${esc(state.voucherCode)}" placeholder="Nhập mã ưu đãi" autocomplete="off"><button class="text-button" type="button" data-action="open-vouchers" ${checked?'':'disabled'}>Chọn ưu đãi ${icon('ticket')}<span class="voucher-count">${eligible}</span></button></div><button class="button outline" type="button" id="apply-voucher" data-action="apply-code" ${checked&&state.voucherCode.trim()?'':'disabled'}>Áp dụng</button></div><p id="voucher-status" class="voucher-status ${state.voucherError?'error':'success'}" role="status">${esc(state.voucherMessage)}</p>`:''}${state.voucher?`<div class="applied-voucher"><span><strong>${esc(state.voucher.code)}</strong><button type="button" class="text-button" data-action="remove-voucher">Bỏ ưu đãi</button></span><strong>${checked?'-'+money(t.discount):'Chờ kiểm tra'}</strong></div>`:''}<div class="summary-sales">${A.avatar()}<div><small>Bạn đang đăng ký với sự hỗ trợ của</small><strong>${esc(A.offer().sales.name)}</strong><span>${esc(A.offer().sales.id)}</span></div></div><div class="due-today"><span>Cần thanh toán</span><strong id="due-total">${checked?money(t.total):'Chờ kiểm tra'}</strong></div><p class="next-bill">${period().id==='post'?`Cước ${money(t.monthly)}/tháng được thanh toán sau theo kỳ.`:`Kỳ tiếp theo sau ${period().months} tháng · cước ${money(t.monthly)}/tháng.`}</p>${paymentStage?`<button type="button" class="button primary pay-button" data-action="pay" ${checked&&!state.needsPriceConfirm?'':'disabled'}>${checked?'Thanh toán '+money(t.total):'Kiểm tra lại địa chỉ'}</button>`:'<p class="summary-check-note">Tổng tiền chỉ được xác nhận sau khi kiểm tra địa chỉ.</p>'}<p class="demo-note">Giá, phí và ưu đãi minh họa. Không thu tiền thật.</p></aside>`;
  }
  function info(){
    const two=document.body.dataset.concept==='2';
    const customerReview=two&&state.substep===2?`<section class="purchase-panel compact-review"><div class="panel-heading"><h2>Kiểm tra địa chỉ</h2><button type="button" class="text-button" data-action="info-back">Sửa địa chỉ</button></div><p>${esc(addressText())}</p><p class="muted">${esc(plan().name)} · ${validQuote()?money(state.quote.monthly):'Chờ kiểm tra'}/tháng</p></section>`:'';
    return `<form id="purchase-form" novalidate><div class="purchase-form-panels">${two&&state.substep===2?customerReview:addressPanel()}${!two||state.substep===2?contactPanel():''}</div><div class="form-actions">${two&&state.substep===2?'<button class="button outline" type="button" data-action="info-back">Quay lại</button>':''}<button class="button primary" id="purchase-submit" type="submit" ${state.status==='checking'?'disabled':''}>${two&&state.substep===1?'Tiếp tục: thông tin liên hệ':'Tiếp tục: thanh toán'}</button></div><p class="demo-note">Thông tin chỉ nằm trong bộ nhớ của tab đang mở. Không gửi đến FPT.</p></form>`;
  }
  function payment(){
    const t=totals();
    return `<div class="payment-panels"><section class="purchase-panel"><div class="panel-heading"><div><p class="eyebrow">THÔNG TIN ĐĂNG KÝ</p><h2>Kiểm tra trước khi thanh toán</h2></div><button class="text-button" type="button" data-action="edit-info">Sửa thông tin</button></div><dl class="customer-review"><div><dt>Người đăng ký</dt><dd>${esc(state.values.name)}</dd></div><div><dt>Điện thoại</dt><dd>${esc(state.values.phone)}</dd></div><div><dt>Địa chỉ lắp đặt</dt><dd>${esc(addressText())}</dd></div></dl></section><section class="purchase-panel"><p class="eyebrow">01 · KỲ THANH TOÁN</p><h2>Chọn kỳ cước phù hợp</h2><p class="panel-description">Giữ nguyên gói đã chọn. Mỗi kỳ hiển thị rõ khoản cần trả hôm nay.</p><fieldset class="period-options"><legend class="sr-only">Kỳ cước</legend>${D.periods.map(p=>`<label class="period-choice ${state.period===p.id?'selected':''}"><input type="radio" name="period" value="${p.id}" ${state.period===p.id?'checked':''}><span><strong>${p.label}</strong><small>${money((p.id==='post'?0:t.monthly*p.months)+p.fee)}</small><em>${p.id==='post'?'Phí lắp đặt':'Cước trả trước · phí lắp đặt 0đ'}</em></span></label>`).join('')}</fieldset><p class="period-description">${esc(period().description)}</p></section><section class="purchase-panel extras-panel"><button type="button" class="extras-toggle" aria-expanded="${state.extrasOpen?'true':'false'}" aria-controls="extras-content" data-action="toggle-extras"><span><strong>Dịch vụ / thiết bị bổ sung</strong><small>Không bắt buộc · ${state.extras.length?'đã chọn '+state.extras.length+' mục':'chỉ chọn khi bạn cần'}</small></span>${icon('down')}</button><div class="extras-content ${state.extrasOpen?'expanded':''}" id="extras-content" ${state.extrasOpen?'':'inert'}><div>${D.extras.map(x=>`<label class="extra-choice"><input type="checkbox" name="extra" value="${x.id}" ${state.extras.includes(x.id)?'checked':''}><span><strong>${esc(x.name)}</strong><small>${esc(x.description)}</small></span><strong>${money(x.price)}</strong></label>`).join('')}</div></div></section><section class="purchase-panel"><p class="eyebrow">02 · PHƯƠNG THỨC</p><h2>Thanh toán theo cách của bạn</h2><fieldset class="method-options"><legend class="sr-only">Phương thức thanh toán</legend>${D.methods.map(m=>`<label class="method-choice ${state.method===m.id?'selected':''}"><input type="radio" name="method" value="${m.id}" ${state.method===m.id?'checked':''}><span class="method-mark" aria-hidden="true">${m.mark}</span><span><strong>${m.name}</strong><small>${m.description}</small></span>${state.method===m.id?icon('check'):''}</label>`).join('')}</fieldset><p class="demo-note">Các phương thức từ ảnh tham chiếu; khả năng hỗ trợ thực tế cần được xác nhận.</p></section></div>`;
  }
  function steps(){
    const n=state.step==='info'?1:['payment','waiting','failed','pending'].includes(state.step)?2:3;
    return `<ol class="purchase-steps">${['Thông tin đăng ký','Thanh toán','Xác nhận'].map((x,i)=>`<li class="${i+1===n?'active':i+1<n?'done':''}" ${i+1===n?'aria-current="step"':''}><span>${i+1<n?icon('check'):i+1}</span><strong>${x}</strong></li>`).join('')}</ol>`;
  }
  function transactionView(){
    const tx=state.transaction,pending=state.step==='pending',failed=state.step==='failed';
    const title=pending?'Chưa xác định kết quả giao dịch':failed?'Thanh toán chưa thành công':'Đang chờ xác nhận thanh toán';
    return `<section class="transaction-panel"><span class="transaction-icon ${failed?'failed':''}">${failed?'!':pending?'…':'<span class="spinner"></span>'}</span><h2 tabindex="-1">${title}</h2><p role="${failed?'alert':'status'}">${failed?'Thông tin đăng ký và ưu đãi vẫn được giữ. Bạn có thể thử lại hoặc đổi phương thức.':pending?'Vui lòng kiểm tra trạng thái giao dịch trước khi thanh toán lại để tránh trả hai lần.':'Bản mẫu đang mô phỏng việc chuyển sang cổng thanh toán. Không có tiền được thu.'}</p><dl class="customer-review"><div><dt>Gói dịch vụ</dt><dd>${esc(tx.planName)}</dd></div><div><dt>Phương thức</dt><dd>${esc(tx.methodName)}</dd></div><div><dt>Số tiền</dt><dd>${money(tx.total)}</dd></div><div><dt>Mã tham chiếu mẫu</dt><dd>${esc(tx.id)}</dd></div></dl>${failed?'<button class="button primary" data-action="retry-payment">Thử lại / đổi phương thức</button>':pending?'<button class="button outline" data-action="check-transaction">Kiểm tra giao dịch</button>':''}<div class="simulation-controls"><p class="eyebrow">ĐIỀU KHIỂN BẢN MẪU · KHÔNG THU TIỀN</p><div>${['waiting','pending'].includes(state.step)?'<button class="button outline" data-outcome="paid">Giả lập thành công</button><button class="button outline" data-outcome="failed">Giả lập thất bại</button>':''}${state.step==='waiting'?'<button class="button outline" data-outcome="pending">Chưa rõ kết quả</button><button class="text-button" data-outcome="cancel">Hủy và đổi phương thức</button>':''}</div></div></section>`;
  }
  function result(){
    const tx=state.transaction;
    return `<section class="purchase-result"><span class="result-check">${icon('check')}</span><p class="eyebrow">ĐĂNG KÝ GÓI DỊCH VỤ</p><h1 tabindex="-1">Thanh toán thành công</h1><p>Tiếp theo, FPT sẽ liên hệ xác nhận lịch lắp đặt.<br>Dịch vụ chưa được kích hoạt.</p><dl class="customer-review"><div><dt>Mã tham chiếu mẫu</dt><dd>${esc(tx.id)}</dd></div><div><dt>Gói dịch vụ</dt><dd>${esc(tx.planName)}</dd></div><div><dt>Người đăng ký</dt><dd>${esc(state.values.name)}</dd></div><div><dt>Địa chỉ</dt><dd>${esc(addressText())}</dd></div><div><dt>Đã thanh toán · mô phỏng</dt><dd>${money(tx.total)}</dd></div><div><dt>Người hỗ trợ</dt><dd>${esc(A.offer().sales.name)} · ${esc(A.offer().sales.id)}</dd></div></dl><div class="next-actions"><span>01 · Đã nhận đăng ký</span><span>02 · Xác nhận lịch lắp</span><span>03 · Triển khai dịch vụ</span></div><div class="result-actions"><button class="button outline" data-action="back-home">Về trang chọn gói</button><button class="text-button contact-trigger">Thông tin người hỗ trợ</button></div><p class="demo-note">Trạng thái mô phỏng. Không có đơn hàng hoặc giao dịch thật được tạo.</p></section>`;
  }
  function render(){
    if(!state.planId||flow.hidden)return;
    const active=document.activeElement,id=active?.id,activeName=flow.contains(active)?active.name:null,activeValue=active?.value,action=flow.contains(active)?active.dataset?.action:null;
    const selection=active?.tagName==='INPUT'&&['text','tel'].includes(active.type)?[active.selectionStart,active.selectionEnd]:null;
    const mode=document.body.dataset.concept,titles={'1':'Đăng ký gọn. Thông tin rõ.','2':'Thiết lập kết nối của bạn.','3':'Kết nối mới cho nhà bạn.'},freeze=['waiting','pending'].includes(state.step);
    flow.innerHTML=`<button type="button" class="text-button purchase-back" data-action="back-home" ${freeze?'disabled':''}>${icon('back')} Quay lại chọn gói</button>${state.step==='paid'?result():`<div class="purchase-heading"><p class="eyebrow">GÓI VÀ NGƯỜI HỖ TRỢ ĐÃ ĐƯỢC GIỮ SẴN</p><h1>${titles[mode]}</h1><p>${mode==='2'&&state.step==='info'?`Thông tin lắp đặt · bước ${state.substep}/2`:'Kiểm tra thông tin, chọn kỳ cước và hoàn tất đăng ký.'}</p></div>${steps()}${state.step==='info'||state.step==='payment'?`<div class="purchase-layout">${state.step==='info'?info():payment()}${summary()}</div>`:transactionView()}`}`;
    const restore=id&&document.getElementById(id)||activeName&&flow.querySelector(`[name="${CSS.escape(activeName)}"][value="${CSS.escape(String(activeValue))}"]`)||action&&flow.querySelector(`[data-action="${CSS.escape(action)}"]`);
    if(restore){restore.focus({preventScroll:true});if(selection)try{restore.setSelectionRange(...selection);}catch{}}
  }
  function updateSummary(){
    const node=flow.querySelector('.purchase-summary');if(node)node.outerHTML=summary();
    const feedback=flow.querySelector('#address-feedback');if(feedback)feedback.innerHTML=addressFeedback();
  }
  function invalidate(){state.epoch++;state.status='dirty';state.needsPriceConfirm=false;state.addressMessage='';state.quote=null;updateSummary();const check=flow.querySelector('.check-address');if(check){check.disabled=false;check.removeAttribute('aria-busy');check.textContent='Kiểm tra địa chỉ & giá';}const submit=flow.querySelector('#purchase-submit');if(submit)submit.disabled=false;}
  function addressErrors(){
    const v=state.values,errors={};
    if(!D.regions[v.province])errors.province='Chọn tỉnh / thành phố trong danh sách.';
    if(!D.regions[v.province]?.wards.includes(v.ward))errors.ward='Chọn phường / xã thuộc tỉnh / thành phố đã chọn.';
    if(!['house','apartment'].includes(v.houseType))errors.houseType='Chọn loại địa điểm lắp đặt.';
    if(v.houseType==='apartment'&&!D.buildings.includes(v.building))errors.building='Chọn chung cư lắp đặt.';
    if(!String(v.address||'').trim())errors.address=v.houseType==='apartment'?'Nhập số căn hộ để kiểm tra lắp đặt.':'Nhập số nhà và tên đường để kiểm tra lắp đặt.';
    return errors;
  }
  function validate(addressOnly=false){
    const e=addressErrors(),v=state.values;
    if(!addressOnly){if(String(v.name||'').trim().length<2)e.name='Nhập họ tên từ 2 ký tự.';if(!/^0\d{9}$/.test(String(v.phone||'').replace(/\s/g,'')))e.phone='Nhập 10 chữ số, bắt đầu bằng 0.';if(!v.consent)e.consent='Vui lòng đọc và đồng ý chính sách để tiếp tục.';}
    state.errors=e;
    if(Object.keys(e).length){render();flow.querySelector('[aria-invalid="true"]')?.focus();return false;}
    return true;
  }
  async function checkAddress(){
    if(!validate(true))return false;
    if(validQuote())return !state.needsPriceConfirm;
    if(state.status==='checking')return false;
    const token=++state.epoch,sig=signature(),scenario=state.scenario,p=plan();
    state.status='checking';render();
    await new Promise(resolve=>setTimeout(resolve,500));
    if(token!==state.epoch||sig!==signature())return false;
    if(scenario==='error'){state.status='error';state.addressMessage='Kết nối mô phỏng bị gián đoạn. Chọn “Kiểm tra địa chỉ & giá” để thử lại.';render();return false;}
    if(scenario==='unavailable'||scenario==='none'){
      const alternatives=scenario==='none'?[]:A.groups().flatMap(g=>g.plans).filter(x=>x.id!==p.id);
      state.status=alternatives.length?'unavailable':'none';state.quote={signature:sig,alternatives};state.voucher=null;state.voucherMessage='';render();return false;
    }
    const delta=scenario==='same'?0:scenario==='price'?30000:D.regions[state.values.province].delta;
    const baseline=D.regions[A.offer().address?.province]?.delta||0;
    const monthly=scenario==='same'?(state.lastAcceptedMonthly??p.price):p.price+delta;
    if(state.lastAcceptedMonthly===null)state.lastAcceptedMonthly=p.price+baseline;
    state.quote={signature:sig,monthly,alternatives:[]};state.status='verified';state.needsPriceConfirm=monthly!==state.lastAcceptedMonthly;
    revalidateVoucher();render();
    if(state.needsPriceConfirm){flow.querySelector('[data-action="confirm-price"]')?.focus();return false;}
    return true;
  }
  async function submit(){
    const two=document.body.dataset.concept==='2',addressOnly=two&&state.substep===1;
    if(!validate(addressOnly)||!await checkAddress())return;
    if(addressOnly){state.substep=2;render();flow.querySelector('#buy-name')?.focus();return;}
    state.step='payment';render();scrollTo({top:0,behavior:'instant'});flow.querySelector('.purchase-heading h1').tabIndex=-1;flow.querySelector('.purchase-heading h1').focus({preventScroll:true});
  }
  function applyVoucher(code){
    if(!validQuote()){state.voucherMessage='Kiểm tra lại địa chỉ trước khi áp dụng ưu đãi.';state.voucherError=true;render();return;}
    const normalized=String(code).trim().toUpperCase(),v=D.vouchers.find(x=>x.code===normalized||x.aliases?.includes(normalized)),reason=voucherReason(v);
    if(reason){state.voucherMessage=reason;state.voucherError=true;render();return;}
    state.voucher={...v,code:normalized};state.voucherCode=normalized;state.voucherMessage='Áp dụng thành công';state.voucherError=false;render();
  }
  function openVouchers(){
    if(!validQuote())return;
    chosenVoucher=state.voucher?.code||'';
    voucherDialog.innerHTML=`<div class="modal-header"><div><p class="eyebrow">ƯU ĐÃI CHO ĐƠN CỦA BẠN</p><h2>Chọn voucher</h2></div><button class="icon-button" data-close aria-label="Đóng chọn voucher">${icon('close')}</button></div><p class="muted">Chọn một ưu đãi phù hợp với kỳ cước hiện tại.</p><fieldset class="voucher-list"><legend class="sr-only">Danh sách voucher</legend>${D.vouchers.map(v=>{const reason=voucherReason(v);return `<label class="voucher-option ${reason?'ineligible':''}"><input type="radio" name="voucher-choice" value="${v.code}" ${chosenVoucher===v.code||v.aliases?.includes(chosenVoucher)?'checked':''} ${reason?'disabled':''}><span class="voucher-art" aria-hidden="true">${icon('ticket')}</span><span><strong>${v.title}</strong><small>${v.code}</small><p>${esc(v.description)}</p>${reason?`<em>${esc(reason)}</em>`:''}</span></label>`;}).join('')}</fieldset><p class="demo-note">Điều kiện và số tiền giảm là dữ liệu mẫu, chưa phải chính sách FPT.</p><div class="modal-footer"><button type="button" class="button outline" data-close>Hủy</button><button type="button" class="button primary" id="voucher-confirm" ${chosenVoucher&&!voucherReason(state.voucher)?'':'disabled'}>Áp dụng ưu đãi</button></div>`;
    voucherDialog.showModal();
  }
  function pay(){
    if(!validQuote()||state.needsPriceConfirm){state.step='info';state.substep=1;render();return;}
    if(!validate())return;
    if(state.transaction&&['waiting','pending','paid'].includes(state.transaction.status))return;
    const p=plan(),t=totals();
    state.transaction={id:'AM-MAU-'+String(Date.now()).slice(-6),planId:p.id,planName:p.name,method:state.method,methodName:D.methods.find(x=>x.id===state.method).name,total:t.total,status:'waiting'};
    state.step='waiting';render();scrollTo({top:0,behavior:'instant'});flow.querySelector('h2')?.focus();
  }
  function outcome(value){
    if(!state.transaction||!['waiting','pending'].includes(state.step))return;
    clearTimeout(timer);
    if(value==='paid'){state.transaction.status='paid';state.step='paid';render();scrollTo({top:0,behavior:'instant'});flow.querySelector('h1')?.focus();}
    if(value==='failed'){state.transaction.status='failed';state.step='failed';render();flow.querySelector('h2')?.focus();}
    if(value==='pending'){state.transaction.status='pending';state.step='pending';render();flow.querySelector('h2')?.focus();}
    if(value==='cancel'&&state.step==='waiting'){state.transaction.status='canceled';state.step='payment';render();}
  }
  function open(id){
    if(['waiting','pending'].includes(state.step)){flow.hidden=false;document.getElementById('home').hidden=true;render();return;}
    if(!window.catalog.some(p=>p.id===id))return;
    const prior=state.planId;
    if(!prior)state.values={...A.offer().address,address:'',block:'',name:'',phone:'',note:'',consent:false};
    if(state.step==='paid'){const scenario=state.scenario;Object.assign(state,initial(),{scenario});state.values={...A.offer().address,address:'',block:'',name:'',phone:'',note:'',consent:false};}
    state.planId=id;state.step='info';state.substep=1;state.errors={};
    if(prior!==id||!state.quote){state.lastAcceptedMonthly=null;invalidate();if(state.voucher){state.voucherMessage='Ưu đãi sẽ được kiểm tra lại cho gói mới.';state.voucherError=false;}}
    flow.hidden=false;document.getElementById('home').hidden=true;document.body.classList.add('purchasing');render();scrollTo({top:0,behavior:'instant'});flow.querySelector('#buy-address')?.focus({preventScroll:true});
  }
  function reset(){state.epoch++;clearTimeout(timer);const epoch=state.epoch;Object.assign(state,initial(),{epoch});flow.innerHTML='';}
  function close(){if(['waiting','pending'].includes(state.step))return false;state.epoch++;if(state.status==='checking')state.status='dirty';return true;}
  function setScenario(scenario){
    if(['waiting','pending','paid'].includes(state.step)){document.getElementById('scenario-preview').value=state.scenario;return;}
    state.scenario=scenario;if(state.planId){invalidate();if(state.step==='payment'){state.step='info';state.substep=1;}render();}
  }
  async function preview(screen){
    if(['waiting','pending'].includes(state.step)){flow.hidden=false;document.getElementById('home').hidden=true;render();return;}
    const first=A.groups().flatMap(g=>g.plans)[0];if(!first){A.home();return;}
    open(state.planId||first.id);
    if(screen==='payment'){
      Object.assign(state.values,{name:state.values.name||'Khách mẫu',phone:state.values.phone||'0900000000',address:state.values.address||(state.values.houseType==='apartment'?'A1205':'123 Đường mẫu'),consent:true});
      if(await checkAddress()){state.step='payment';render();scrollTo({top:0,behavior:'instant'});}
    }
  }
  flow.addEventListener('submit',e=>{e.preventDefault();if(state.step==='info')submit();});
  flow.addEventListener('input',e=>{
    const el=e.target,name=el.name;
    if(el.id==='voucher-code'){state.voucherCode=el.value;flow.querySelector('#apply-voucher').disabled=!validQuote()||!el.value.trim();return;}
    if(!name||['period','extra','method','houseType'].includes(name))return;
    state.values[name]=el.type==='checkbox'?el.checked:el.value;delete state.errors[name];el.removeAttribute('aria-invalid');const error=flow.querySelector('#buy-'+name+'-error');if(error)error.textContent='';
    if(['province','ward','houseType','building','address','block'].includes(name))invalidate();
  });
  flow.addEventListener('change',e=>{
    const el=e.target,name=el.name;
    if(name==='province'){state.values.province=el.value;state.values.ward=D.regions[el.value]?.wards[0]||'';state.values.building='';invalidate();render();}
    else if(name==='ward'||name==='building'){state.values[name]=el.value;invalidate();render();}
    else if(name==='houseType'){state.values.houseType=el.value;state.values.address='';state.values.block='';state.values.building='';invalidate();render();}
    else if(name==='period'){state.period=el.value;revalidateVoucher();render();}
    else if(name==='extra'){state.extras=el.checked?[...new Set([...state.extras,el.value])]:state.extras.filter(x=>x!==el.value);revalidateVoucher();render();}
    else if(name==='method'){state.method=el.value;render();}
  });
  flow.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.replace){state.planId=button.dataset.replace;state.lastAcceptedMonthly=null;state.scenario='normal';document.getElementById('scenario-preview').value='normal';invalidate();checkAddress();return;}
    if(button.dataset.outcome){outcome(button.dataset.outcome);return;}
    switch(button.dataset.action){
      case 'back-home':A.home();break;
      case 'edit-address':state.addressEditing=!state.addressEditing;render();if(state.addressEditing)flow.querySelector('#buy-province')?.focus();break;
      case 'check-address':checkAddress();break;
      case 'confirm-price':state.lastAcceptedMonthly=state.quote.monthly;state.needsPriceConfirm=false;render();break;
      case 'info-back':state.substep=1;render();flow.querySelector('#buy-address')?.focus();break;
      case 'edit-info':state.step='info';state.substep=1;render();scrollTo({top:0,behavior:'instant'});break;
      case 'toggle-extras':state.extrasOpen=!state.extrasOpen;render();break;
      case 'open-vouchers':openVouchers();break;
      case 'apply-code':applyVoucher(state.voucherCode);break;
      case 'remove-voucher':state.voucher=null;state.voucherCode='';state.voucherMessage='Đã bỏ ưu đãi.';state.voucherError=false;render();break;
      case 'pay':pay();break;
      case 'retry-payment':state.step='payment';render();break;
      case 'check-transaction':button.disabled=true;button.textContent='Đang kiểm tra…';timer=setTimeout(()=>{if(state.step==='pending'){render();const p=flow.querySelector('[role="status"]');p.textContent='Giao dịch vẫn chưa có kết quả. Chưa tạo giao dịch mới; tiếp tục kiểm tra hoặc liên hệ người hỗ trợ.';}},500);break;
    }
  });
  voucherDialog.addEventListener('change',e=>{if(e.target.name==='voucher-choice'){chosenVoucher=e.target.value;document.getElementById('voucher-confirm').disabled=false;}});
  voucherDialog.addEventListener('click',e=>{if(e.target.closest('#voucher-confirm')){applyVoucher(chosenVoucher);voucherDialog.close();flow.querySelector('[data-action="open-vouchers"]')?.focus({preventScroll:true});}});
  window.Purchase={state,open,close,reset,render,preview,setScenario,totals,checkAddress,validQuote};
})();
