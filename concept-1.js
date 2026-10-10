// Presentation only: catalog, sales identity and validation stay in app.js.
const groupLinks=[...document.querySelectorAll('.offer-jumps a')];
function markGroup(){
  const threshold=document.querySelector('.group-toolbar').getBoundingClientRect().bottom+32;
  let current=groupLinks[0];
  for(const link of groupLinks){if(document.querySelector(link.hash).getBoundingClientRect().top<=threshold)current=link;}
  groupLinks.forEach(link=>{if(link===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
addEventListener('scroll',markGroup,{passive:true});markGroup();
for(const group of document.querySelectorAll('.offer-group')){
  const grid=group.querySelector('.plan-grid'),cards=[...grid.children];
  if(cards.length<2)continue;
  const dots=document.createElement('nav');dots.className='carousel-dots';dots.setAttribute('aria-label',`Vị trí gói ${group.id}`);
  dots.innerHTML=cards.map((c,i)=>`<button aria-label="Xem ${html(c.querySelector('h3').textContent)}" aria-current="${i===0}" type="button"></button>`).join('');
  grid.after(dots);const buttons=[...dots.children];
  buttons.forEach((button,i)=>button.addEventListener('click',()=>grid.scrollTo({left:cards[i].offsetLeft-cards[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})));
  grid.addEventListener('scroll',()=>{const i=Math.round(grid.scrollLeft/(cards[0].getBoundingClientRect().width+12));buttons.forEach((b,j)=>b.setAttribute('aria-current',String(i===j)));},{passive:true});
}
const registration=$('registration-form'),review=$('confirmation'),submit=registration.querySelector('.form-next');
review.className='inline-review';review.hidden=false;review.querySelector('h2').textContent='Kiểm tra lại';
registration.insertBefore(review,submit);submit.textContent='Gửi đăng ký mẫu';
$('edit-info').type='button';$('complete-demo').type='button';$('fail-demo').type='button';
function refreshReview(){
  $('customer-summary').innerHTML=dl([['Họ tên',$('full-name').value.trim()||'Chưa nhập'],['Điện thoại',$('phone').value.trim()||'Chưa nhập'],['Địa chỉ',[$('address').value,$('ward').value,$('province').value].filter(Boolean).join(', ')||'Chưa nhập']]);
}
registration.addEventListener('input',e=>{
  refreshReview();const errors={'full-name':'name-error',phone:'phone-error',province:'province-error',ward:'ward-error',address:'address-error',consent:'consent-error'};
  if(errors[e.target.id]){$(errors[e.target.id]).textContent='';e.target.removeAttribute('aria-invalid');}
});refreshReview();
const checkoutObserver=new MutationObserver(()=>{if(!$('checkout').hidden&&!registration.hidden){review.hidden=false;refreshReview();}});
checkoutObserver.observe($('checkout'),{attributes:true,attributeFilter:['hidden']});
// Shared validation runs first; valid data goes straight from this form to the mock result.
registration.addEventListener('submit',()=>{
  if(registration.hidden){registration.hidden=false;review.hidden=false;submit.setAttribute('aria-busy','true');submit.setAttribute('aria-disabled','true');
    setTimeout(()=>{$('complete-demo').click();registration.hidden=true;submit.removeAttribute('aria-busy');submit.removeAttribute('aria-disabled');$('result-title').setAttribute('tabindex','-1');$('result-title').focus();},650);
  }
});
registration.addEventListener('submit',e=>{if(submit.getAttribute('aria-busy')==='true'){e.preventDefault();e.stopImmediatePropagation();}},true);
