(() => {
  const mode = document.body.dataset.concept;
  const shown = [...document.querySelectorAll('.plan-card')].map(card => plans.find(p => p.id === card.dataset.planId));
  const numeric = value => parseFloat(value) * (/Gbps/i.test(value) ? 1000 : 1);
  if (!shown.length) return;
  if (mode === '1') {
    document.querySelectorAll('.offer-group').forEach(group => {
      const items = [...group.querySelectorAll('.plan-card')].map(card => plans.find(p => p.id === card.dataset.planId));
      if (items.length < 2) return;
      const low = Math.min(...items.map(p => p.price));
      const fast = items.reduce((best, p) => numeric(p.down) > numeric(best.down) ? p : best);
      const line = document.createElement('div'); line.className = 'comparison-summary';
      line.innerHTML = `<span>Cước thấp nhất nhóm<strong>${money(low)}đ/tháng</strong></span><span>Tải xuống cao nhất nhóm<strong>${html(fast.down)}</strong></span>`;
      group.querySelector('.group-heading').after(line);
    });
  } else if (mode === '2') {
    const best = shown.reduce((a, b) => numeric(b.up) > numeric(a.up) ? b : a);
    const tile = document.createElement('div'); tile.className = 'performance-highlight';
    tile.innerHTML = `<small>Tải lên cao nhất trong bộ gói</small><strong>↑ ${html(best.up)}</strong><span>${html(best.name)}</span>`;
    document.querySelector('.tech-art').append(tile);
  } else {
    const caption = document.createElement('div'); caption.className = 'home-caption';
    caption.innerHTML = `<strong>${html(offer.sales.name)} · người tư vấn của bạn</strong><small>${html(window.audienceCopy[offer.audience] || window.audienceCopy.family)}</small>`;
    document.querySelector('.hero-visual').append(caption);
  }
})();
