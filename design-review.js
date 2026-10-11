(() => {
  const screen=document.getElementById('screen-choice'),size=document.getElementById('size-choice'),gallery=document.getElementById('gallery');
  const names=['Tối giản · chọn nhanh','Hiện đại · hiệu năng','Đời sống · có người hỗ trợ'];
  function render(){gallery.classList.toggle('mobile',size.value==='375');gallery.innerHTML=names.map((name,i)=>{const src=`assets/review/c${i+1}-${screen.value}-${size.value}.webp`;return `<article class="screenshot-card"><div><strong>Concept ${i+1}</strong><span>${name}</span></div><a href="${src}" target="_blank" rel="noopener" aria-label="Xem ảnh ${screen.selectedOptions[0].textContent}, concept ${i+1}"><img src="${src}" alt="${screen.selectedOptions[0].textContent} · concept ${i+1}" loading="lazy"></a></article>`;}).join('');}
  screen.addEventListener('change',render);size.addEventListener('change',render);render();
})();
