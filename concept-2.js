// Display-only speed comparison. Catalog and checkout remain shared.
function speedMbps(value){
  const match=String(value).trim().match(/^(\d+(?:[.,]\d+)?)\s*(Gbps|Mbps)$/i);
  return match?Number(match[1].replace(',','.'))*(match[2].toLowerCase()==='gbps'?1000:1):null;
}
const shownGroups=[...document.querySelectorAll('.offer-group')];
const heroLink=document.querySelector('.hero-cta');
heroLink.textContent=shownGroups.length===2?'Xem gói dành cho bạn':shownGroups.length===1?`Xem gói ${shownGroups[0].querySelector('h2').textContent}`:'Xem gói dành cho bạn';
heroLink.href=shownGroups.length===1?'#'+shownGroups[0].id:'#plans';
for(const group of shownGroups){
  const cards=[...group.querySelectorAll('.plan-card')];
  const speeds=cards.map(c=>speedMbps(plans.find(p=>p.id===c.dataset.planId).down));
  const max=Math.max(...speeds.filter(v=>v!==null));
  cards.forEach((card,i)=>{
    const actions=card.querySelector('.card-actions');actions.prepend(card.querySelector('.card-price'));
    card.querySelector('.card-overview').append(card.querySelector('[data-details]'));
    card.setAttribute('tabindex','0');card.setAttribute('aria-label',card.querySelector('h3').textContent);
    const spec=card.querySelector('.card-spec'),down=spec.firstElementChild;
    down.prepend(down.querySelector('strong'));
    if(speeds[i]!==null&&max>0){
      const ratio=speeds[i]/max,bar=document.createElement('div');bar.className='speed-comparison';
      bar.innerHTML=`<div class="speed-track" role="meter" aria-label="Tải xuống so với gói nhanh nhất trong nhóm" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${ratio*100}" aria-valuetext="${Math.round(ratio*100)}% tốc độ cao nhất nhóm"><span class="speed-fill" style="width:${ratio*100}%"></span></div><small>${Math.round(ratio*100)}% tốc độ cao nhất nhóm</small>`;
      down.after(bar);
    }
  });
}
// Fixed mobile CTA only while discovery is still needed; any deliberate row interaction dismisses it.
const mobileBar=document.createElement('div');mobileBar.className='mobile-discovery';mobileBar.hidden=true;
mobileBar.innerHTML='<a class="button primary" href="#plans">Xem gói <span aria-hidden="true">↓</span></a>';document.body.append(mobileBar);
let rowTouched=false;
function syncDiscovery(){mobileBar.hidden=rowTouched||$('home').hidden||!shownGroups.length||!matchMedia('(max-width:767px)').matches||document.querySelector('.tech-hero').getBoundingClientRect().bottom>64||document.querySelector('.sales-line').getBoundingClientRect().top<innerHeight;}
document.querySelectorAll('.plan-card').forEach(card=>{card.addEventListener('pointerdown',()=>{rowTouched=true;syncDiscovery();});card.addEventListener('focusin',()=>{rowTouched=true;syncDiscovery();});});
addEventListener('scroll',syncDiscovery,{passive:true});addEventListener('resize',syncDiscovery);new MutationObserver(syncDiscovery).observe($('home'),{attributes:true,attributeFilter:['hidden']});syncDiscovery();
// Make processing visible without sending any network request or changing shared order logic.
const complete=$('complete-demo');let completing=false,replay=false;
complete.addEventListener('click',e=>{
  if(replay)return;
  e.stopImmediatePropagation();e.preventDefault();if(completing)return;
  completing=true;complete.setAttribute('aria-busy','true');complete.setAttribute('aria-disabled','true');
  setTimeout(()=>{replay=true;complete.click();replay=false;completing=false;complete.removeAttribute('aria-busy');complete.removeAttribute('aria-disabled');$('result-title').setAttribute('tabindex','-1');$('result-title').focus();},500);
},true);
