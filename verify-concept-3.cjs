const {chromium}=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const root='file:///C:/BA/ba-tool-kit/project/AM/shop-prototype/',out='shop-prototype/qa/concept-3-update';
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
(async()=>{
 mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const offer of ['family','performance','apartment','internet','combo']){
  await page.goto(root+'concept-3.html?offer='+offer);
  for(const width of [375,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>document.fonts.ready);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+offer+'/'+width);
   assert(await page.locator('.hero-advisor').evaluate(e=>e.getBoundingClientRect().bottom<innerHeight),'Sales above fold');
   assert(await page.locator('#audience-image').evaluate(e=>e.complete&&e.naturalWidth>0),'Lifestyle asset loaded');
   if(width===375)assert(await page.locator('.hero-visual').evaluate(e=>e.getBoundingClientRect().height<=180),'Mobile image budget');
   const cols=await page.locator('#plan-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length);
   assert(cols===(width>=768&&['performance','apartment'].includes(offer)?2:1),'Tray count rule '+offer+'/'+width);
   assert(await page.locator('[data-sales-channels] a').count()===0,'No invented contacts');
   await page.screenshot({path:`${out}/${offer}-${width}.png`,fullPage:true});await page.screenshot({path:`${out}/${offer}-${width}-top.png`});
  }
 }
 await page.goto(root+'concept-3.html?offer=performance');await page.setViewportSize({width:375,height:900});
 await page.locator('#plan-grid').scrollIntoViewIfNeeded();await page.waitForTimeout(150);assert(await page.locator('.mobile-advisor').isHidden(),'Hide advisor in packages');
 await page.evaluate(()=>scrollTo({top:document.querySelector('#sales-support').offsetTop,behavior:'instant'}));await page.waitForTimeout(150);assert(await page.locator('.mobile-advisor').isVisible(),'Advisor outside packages');await page.screenshot({path:out+'/mobile-advisor.png'});
 await page.locator('[data-plan-id="internet-meta"] [data-register]').click();assert(await page.locator('.mobile-advisor').isHidden(),'Hide during checkout');
 assert((await page.locator('.order-advisor').textContent()).includes('Hoàng Nam'),'Order advisor identity');assert(await page.locator('.sales-reference strong').textContent()==='AM-DEMO-02','Sales code retained');
 assert(await page.locator('#registration-form #confirmation').count()===1,'One-page review');
 for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Checkout overflow');await page.screenshot({path:`${out}/checkout-${width}.png`,fullPage:true});}
 await page.locator('.form-next').click();assert((await page.locator('#phone-error').textContent()).includes('bắt đầu bằng 0'),'Actionable validation');
 for(const [id,value]of Object.entries({'full-name':'Khách mẫu',phone:'0900000000',province:'Hồ Chí Minh',ward:'Phường mẫu',address:'123 Đường mẫu'}))await page.locator('#'+id).fill(value);
 await page.locator('#consent').check();await page.locator('.form-next').click();assert(await page.locator('.form-next').getAttribute('aria-busy')==='true','Processing');await page.locator('#success').waitFor({state:'visible'});
 const configured=await browser.newPage();await configured.addInitScript(()=>window.storefrontConfig={sales:{id:'TEST',name:'Sales mẫu',phone:'0900000000',zaloUrl:'https://zalo.me/0900000000',avatarUrl:'assets/missing-avatar.jpg'},audience:'unknown',sections:{internet:{visible:true,planIds:['internet-giga']}}});await configured.goto(root+'concept-3.html');await configured.waitForTimeout(150);assert(await configured.locator('[data-sales-channels] a').count()===2,'Configured channels only');assert(await configured.locator('.neutral-scene').isVisible(),'Neutral audience fallback');assert(await configured.locator('.hero-advisor .sales-avatar').textContent()==='S','Avatar error fallback');
 const empty=await browser.newPage();await empty.addInitScript(()=>window.storefrontConfig={sales:{id:'TEST',name:'Sales mẫu'},sections:{internet:{visible:true,planIds:[]},combo:{visible:true,planIds:[]}}});await empty.goto(root+'concept-3.html');assert(await empty.locator('.empty-offer').isVisible(),'Empty');assert(await empty.locator('.hero-cta').isHidden(),'Empty CTA hidden');
 assert(!errors.length,errors.join(';'));writeFileSync(out+'/checks.json',JSON.stringify({status:'PASS',offers:5,widths:[375,768,1024,1440],errors},null,2));await browser.close();console.log('PASS: 20 home screens, 4 checkout screens, sales above fold, audience photos, adaptive trays, conditional channels, fallback, sticky advisor, one-page checkout, errors/processing, empty.');
})().catch(e=>{console.error(e);process.exit(1)});
