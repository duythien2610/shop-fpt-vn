/* Prototype journey: no payment SDK, network request, or customer persistence. */
(() => {
  const kind = document.body.dataset.concept;
  const flow = document.createElement('main');
  flow.id = 'purchase'; flow.hidden = true; flow.className = 'container purchase';
  document.querySelector('#checkout').after(flow);
  let plan, stage = 1, busy = false, timer, route = 'review';
  const values = {};
  const field = (id, label, autocomplete, type = 'text') => `<div class="field"><label for="buy-${id}">${label} <b>*</b></label><input id="buy-${id}" name="${id}" autocomplete="${autocomplete}" type="${type}" ${type === 'tel' ? 'inputmode="tel"' : ''} aria-describedby="buy-${id}-error"><p class="field-error" id="buy-${id}-error"></p></div>`;
  const scenario = document.createElement('label'); scenario.className = 'scenario-control';
  scenario.innerHTML = 'Checkout mẫu <select aria-label="Kịch bản checkout mẫu"><option value="review">Cần xác nhận địa chỉ</option><option value="ready">Đủ điều kiện — giả lập</option></select>';
  document.querySelector('.prototype-tools').append(scenario);
  scenario.querySelector('select').addEventListener('change', e => { route = e.target.value; if (!flow.hidden) { save(); stage = 1; render(); } });
  function save() { flow.querySelectorAll('input').forEach(el => { values[el.name] = el.type === 'checkbox' ? el.checked : el.value; }); }
  function summary() {
    return `<aside class="purchase-summary"><p class="eyebrow">LỰA CHỌN CỦA BẠN</p><h2>${html(plan.name)}</h2><p>${html(plan.description)}</p><p class="purchase-monthly"><strong>${money(plan.price)}</strong> đ/tháng</p><p class="purchase-speeds">↓ ${html(plan.down)} <span>↑ ${html(plan.up)}</span></p><ul class="features">${plan.features.map(f => `<li>${html(f)}</li>`).join('')}</ul><dl class="purchase-costs"><div><dt>Kỳ cước</dt><dd>${route === 'ready' ? '1 tháng (mẫu)' : 'Chờ xác nhận'}</dd></div><div><dt>Phí ban đầu</dt><dd>${route === 'ready' ? '0đ (mẫu)' : 'Chờ xác nhận'}</dd></div><div class="due-now"><dt>${route === 'ready' ? 'Trả hôm nay · mẫu' : 'Thanh toán hôm nay'}</dt><dd>${route === 'ready' ? money(plan.price) + 'đ' : 'Chưa thu tiền'}</dd></div></dl><p class="purchase-disclaimer">${route === 'ready' ? 'Giá và phí giả lập để xem giao diện, không phải báo giá FPT. Không có giao dịch thật.' : 'Cước và phí chính thức sẽ được xác nhận theo địa chỉ trước khi thanh toán.'}</p>${kind === '3' ? `<div class="purchase-advisor"><span class="sales-avatar">${html(offer.sales.name.charAt(0))}</span><p><strong>${html(offer.sales.name)}</strong><br>Sẽ hỗ trợ bạn đăng ký</p></div>` : ''}<p class="purchase-ref">Người giới thiệu: ${html(offer.sales.id)}</p></aside>`;
  }
  function render() {
    clearTimeout(timer); busy = false;
    const title = kind === '1' ? 'Hoàn tất trong một trang.' : kind === '2' ? 'Thiết lập kết nối của bạn.' : 'Sắp kết nối cho nhà bạn.';
    flow.innerHTML = `<button type="button" class="text-button purchase-back">← Quay lại chọn gói</button><div class="purchase-heading"><p class="eyebrow">${kind === '3' ? 'CÓ NGƯỜI HỖ TRỢ TRONG TỪNG BƯỚC' : 'ĐĂNG KÝ GÓI ĐÃ CHỌN'}</p><h1>${title}</h1><p>${kind === '2' ? '01 Thông tin lắp đặt → 02 Kiểm tra & hoàn tất' : 'Thông tin rõ ràng. Gói và người giới thiệu đã được giữ sẵn.'}</p></div><div class="purchase-layout"><form id="purchase-form" novalidate><section class="purchase-panel" id="purchase-info"><h2><span class="section-number">01</span> Địa chỉ lắp đặt</h2><p class="muted">Để xác nhận dịch vụ có thể cung cấp tại nhà bạn.</p><div class="field-grid">${field('province', 'Tỉnh / Thành phố', 'address-level1')}${field('ward', 'Phường / Xã', 'address-level2')}</div>${field('address', 'Số nhà, tên đường', 'street-address')}<h2><span class="section-number">02</span> Người đăng ký</h2><div class="field-grid">${field('name', 'Họ và tên', 'name')}${field('phone', 'Số điện thoại', 'tel', 'tel')}</div><label class="consent"><input name="consent" id="buy-consent" type="checkbox" aria-describedby="buy-consent-error"><span>Tôi đồng ý để FPT liên hệ và xử lý dữ liệu theo <a href="https://fpt.vn/ho-tro/chinh-sach-quy-trinh/5107/5076/286" target="_blank" rel="noopener">chính sách dữ liệu cá nhân</a>.</span></label><p class="field-error" id="buy-consent-error"></p></section><section class="purchase-panel" id="purchase-review"><h2><span class="section-number">03</span> ${route === 'ready' ? 'Kiểm tra & thanh toán' : 'Kiểm tra & gửi đăng ký'}</h2><div id="purchase-customer"></div>${route === 'ready' ? '<p class="payment-context">Địa chỉ đủ điều kiện — kịch bản giả lập.</p><fieldset class="purchase-methods"><legend>Phương thức thanh toán mẫu</legend><label><input type="radio" name="method" value="bank" checked><span>Ngân hàng / QR<small>Minh họa chuyển sang ứng dụng ngân hàng</small></span></label><label><input type="radio" name="method" value="card"><span>Thẻ thanh toán<small>Minh họa chuyển sang cổng thanh toán</small></span></label></fieldset><p class="muted">Kỳ thanh toán tiếp theo: sau 1 tháng, cước mẫu ' + money(plan.price) + 'đ. Điều kiện thật cần hệ thống xác nhận.</p>' : '<div class="purchase-notice"><strong>Kiểm tra địa chỉ trước khi thu tiền</strong><p>Người tư vấn sẽ xác nhận khả năng lắp đặt, cước và phí ban đầu với bạn.</p></div>'}<button class="text-button" type="button" id="purchase-edit">Sửa thông tin</button></section><div class="purchase-submit"><button class="button primary" type="submit" id="purchase-submit"></button><p>Thông tin chỉ dùng trong phiên xem bản mẫu.</p></div></form>${summary()}</div>`;
    for (const [key, value] of Object.entries(values)) { const el = flow.querySelector(`[name="${key}"]`); if (el && el.type !== 'radio') { if (el.type === 'checkbox') el.checked = value; else el.value = value; } }
    if (region && region !== 'Khu vực khác' && !values.province) flow.querySelector('[name="province"]').value = region;
    flow.querySelector('.purchase-back').onclick = close;
    flow.querySelector('#purchase-edit').onclick = () => { save(); stage = 1; sync(); flow.querySelector('input').focus(); };
    flow.querySelector('form').addEventListener('input', e => { const error = flow.querySelector(`#buy-${e.target.name}-error`); if (error) { error.textContent = ''; e.target.removeAttribute('aria-invalid'); } save(); preview(); });
    flow.querySelector('form').onsubmit = e => { e.preventDefault(); if (busy || !validate()) return; save(); if (kind === '2' && stage === 1) { stage = 2; sync(); flow.querySelector('#purchase-review h2').tabIndex = -1; flow.querySelector('#purchase-review h2').focus(); } else if (route === 'ready') payment(); else result('request'); };
    sync();
  }
  function preview() {
    const el = flow.querySelector('#purchase-customer');
    el.innerHTML = `<dl class="description-list">${dl([['Người đăng ký', values.name || 'Chưa nhập'], ['Điện thoại', values.phone || 'Chưa nhập'], ['Địa chỉ', [values.address, values.ward, values.province].filter(Boolean).join(', ') || 'Chưa nhập']])}</dl>`;
  }
  function sync() {
    flow.querySelector('#purchase-info').hidden = kind === '2' && stage === 2;
    flow.querySelector('#purchase-review').hidden = kind === '2' && stage === 1;
    flow.querySelector('#purchase-edit').hidden = kind !== '2';
    flow.querySelector('#purchase-submit').textContent = kind === '2' && stage === 1 ? 'Kiểm tra thông tin →' : route === 'ready' ? `Thanh toán mẫu ${money(plan.price)}đ` : 'Gửi yêu cầu đăng ký';
    preview();
  }
  function validate() {
    let first;
    const rules = { province: ['Bạn nhập tỉnh / thành phố nhé.', v => v.trim()], ward: ['Bạn nhập phường / xã nhé.', v => v.trim()], address: ['Bạn nhập số nhà và tên đường nhé.', v => v.trim()], name: ['Bạn nhập họ tên từ 2 ký tự nhé.', v => v.trim().length > 1], phone: ['Nhập 10 chữ số, bắt đầu bằng 0.', v => /^0\d{9}$/.test(v.replace(/\s/g, ''))], consent: ['Vui lòng đọc và đồng ý chính sách để tiếp tục.', v => v] };
    for (const [name, [message, check]] of Object.entries(rules)) { const input = flow.querySelector(`[name="${name}"]`); const ok = !!check(input.type === 'checkbox' ? input.checked : input.value); flow.querySelector(`#buy-${name}-error`).textContent = ok ? '' : message; input.setAttribute('aria-invalid', String(!ok)); if (!ok && !first) first = input; }
    if (first) { stage = 1; sync(); first.focus(); return false; } return true;
  }
  function payment() {
    const method = flow.querySelector('[name="method"]:checked').value;
    busy = true;
    const panel = flow.querySelector('#purchase-review'); panel.hidden = false;
    panel.innerHTML = `<h2 tabindex="-1">Chờ xác nhận thanh toán</h2><p role="status">${method === 'bank' ? 'Ngân hàng / QR' : 'Thẻ thanh toán'} · ${money(plan.price)}đ · mô phỏng</p><div class="payment-wait"><span class="payment-pulse" aria-hidden="true"></span><strong>Đang chờ phản hồi</strong><p>Chỉ hoàn tất khi nhận được xác nhận giao dịch.</p></div><div class="simulation-controls"><p>Điều khiển bản mẫu — không thu tiền</p><button type="button" class="button primary" data-outcome="paid">Giả lập thành công</button><button type="button" class="button outline" data-outcome="failed">Giả lập thất bại</button><button type="button" class="text-button" data-outcome="pending">Chưa rõ kết quả</button><button type="button" class="text-button" data-outcome="cancel">Hủy / đổi phương thức</button></div>`;
    flow.querySelector('#purchase-info').hidden = true; flow.querySelector('.purchase-submit').hidden = true;
    panel.querySelector('h2').focus();
    panel.querySelectorAll('[data-outcome]').forEach(button => button.onclick = () => {
      const outcome = button.dataset.outcome;
      if (outcome === 'cancel') { stage = 2; render(); return; }
      if (outcome === 'paid') { panel.querySelectorAll('button').forEach(b => b.disabled = true); button.textContent = 'Đang xác nhận…'; timer = setTimeout(() => result('paid'), 450); return; }
      if (outcome === 'pending') { panel.querySelector('[role="status"]').textContent = 'Chưa xác định kết quả. Kiểm tra giao dịch trước khi thanh toán lại.'; panel.querySelector('[data-outcome="cancel"]').hidden = true; return; }
      busy = false; panel.innerHTML = '<h2 tabindex="-1">Thanh toán chưa thành công</h2><p role="alert">Thông tin đăng ký vẫn được giữ. Bạn có thể thử lại hoặc đổi phương thức.</p><button type="button" class="button primary" id="purchase-retry">Quay lại thanh toán</button>'; panel.querySelector('h2').focus(); panel.querySelector('button').onclick = () => { stage = 2; render(); };
    });
  }
  function result(status) {
    busy = false;
    flow.innerHTML = `<section class="purchase-result"><span class="result-mark" aria-hidden="true">✓</span><p class="eyebrow">KẾT QUẢ BẢN MẪU</p><h1 tabindex="-1">${status === 'paid' ? 'Đã thanh toán — mô phỏng' : 'Đã nhận yêu cầu đăng ký'}</h1><p>${status === 'paid' ? 'Bước tiếp theo: xác nhận lịch lắp đặt. Dịch vụ chưa được kích hoạt.' : html(offer.sales.name) + ' sẽ hỗ trợ kiểm tra địa chỉ và xác nhận chi phí trước khi thanh toán.'}</p><dl class="description-list">${dl([['Mã tham chiếu', 'DEMO-0001'], ['Gói', plan.name], ['Người đăng ký', values.name], ['Người giới thiệu', offer.sales.id], ['Thanh toán', status === 'paid' ? money(plan.price) + 'đ (mô phỏng)' : 'Chưa thu tiền']])}</dl><p class="purchase-disclaimer">Không có đơn hàng hoặc giao dịch thật được tạo.</p><button class="button outline purchase-back">Trở về trang chọn gói</button></section>`;
    flow.querySelector('.purchase-back').onclick = close; flow.querySelector('h1').focus();
  }
  function close() { clearTimeout(timer); busy = false; flow.hidden = true; document.body.classList.remove('purchasing'); home(); }
  function open(index) { clearTimeout(timer); plan = plans[index]; stage = 1; $('home').hidden = true; $('checkout').hidden = true; flow.hidden = false; document.body.classList.add('purchasing'); render(); scrollTo({top: 0, behavior: 'instant'}); flow.querySelector('input').focus({preventScroll: true}); }
  document.addEventListener('click', e => {
    const buy = e.target.closest('[data-register]');
    if (buy) { e.preventDefault(); e.stopImmediatePropagation(); open(+buy.dataset.register); }
    else if (e.target.closest('#details-register')) { e.preventDefault(); e.stopImmediatePropagation(); $('details-modal').close(); open(selected); }
    else if (!flow.hidden && e.target.closest('.brand, .header nav a')) close();
  }, true);
})();
