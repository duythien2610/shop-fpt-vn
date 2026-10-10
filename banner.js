/* One contextual banner, no invented promotion or additional offers. */
(() => {
  const groups = [...document.querySelectorAll('.offer-group')];
  const hero = document.querySelector('#home .hero');
  if (!hero) return;
  hero.setAttribute('aria-label', 'Banner chọn gói dịch vụ');
  const count = document.querySelectorAll('.plan-card').length;
  const label = document.createElement('p');
  label.className = 'banner-context';
  label.textContent = count ? `${count} gói được chọn · ${groups.map(g => g.querySelector('h2').textContent).join(' & ')}` : 'Chưa có gói được cấu hình';
  hero.querySelector('.hero-copy').prepend(label);
  // FAQ is secondary: accessible next to the decision, not another header destination.
  const faqLink = document.createElement('a');
  faqLink.className = 'faq-shortcut';
  faqLink.href = '#faq';
  faqLink.textContent = 'Câu hỏi thường gặp ↓';
  document.querySelector('#plan-grid').after(faqLink);
  // No fake contact buttons when the sales link has no contact configuration.
  if (document.body.dataset.concept !== '3') {
    const channels = document.querySelector('.contact-channels');
    channels.replaceChildren();
    const sales = offer.sales || {};
    const phone = String(sales.phone || '').replace(/[\s().-]/g, '');
    const add = (name, href) => { const a = document.createElement('a'); a.className = 'button outline'; a.textContent = name; a.href = href; channels.append(a); };
    if (/^\+?\d{9,15}$/.test(phone)) add('Gọi tư vấn', `tel:${phone}`);
    try { const url = new URL(sales.zaloUrl); if (url.protocol === 'https:' && url.hostname === 'zalo.me') add('Nhắn Zalo', url.href); } catch {}
    if (!channels.children.length) document.querySelector('#contact-status').textContent = 'Link này chưa cấu hình kênh liên hệ trực tiếp.';
  }
})();
