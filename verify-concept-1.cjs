const {chromium}=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const root='file:///C:/BA/ba-tool-kit/project/AM/shop-prototype/';
const out='shop-prototype/qa/concept-1-update';
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
(async()=>{
 mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const offer of ['family','performance','apartment','internet','combo']){
  await page.goto(root+'index.html?offer='+offer);
  for(const width of [375,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.evaluate(()=>document.fonts.ready);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+offer+'/'+width);
   assert(await page.locator('.group-price-note').count()===await page.locator('.offer-group').count(),'One note per group');
   if(width===1440){assert(await page.locator('.hero').evaluate(e=>e.getBoundingClientRect().height)<=220,'Short hero');assert(await page.locator('.plan-card').first().evaluate(e=>e.getBoundingClientRect().top)<900,'First fold');}
   await page.screenshot({path:`${out}/${offer}-${width}.png`,fullPage:true});
  }
 }
 await page.goto(root+'index.html?offer=performance');await page.setViewportSize({width:375,height:900});
 await page.locator('#internet .carousel-dots button').last().click();await page.waitForTimeout(700);
 assert(await page.locator('#internet .plan-grid').evaluate(e=>e.scrollLeft>100),'Carousel moves');
 await page.locator('[data-plan-id="internet-meta"] [data-details]').click();assert(await page.locator('#details-modal').evaluate(e=>Math.abs(e.getBoundingClientRect().bottom-innerHeight)<2),'Bottom sheet');await page.screenshot({path:out+'/detail-mobile.png'});await page.locator('#details-modal .close-button').click();
 await page.locator('#region-trigger').click();await page.locator('.region-options button').first().click();assert((await page.locator('.group-price-note').first().textContent()).includes('chưa xác thực'),'Regional price status');
 await page.locator('[data-plan-id="internet-meta"] [data-register]').click();
 assert(await page.locator('#order-name').textContent()==='Internet Meta','Product retention');assert(await page.locator('.sales-reference strong').textContent()==='AM-DEMO-02','Sales retention');
 await page.locator('.form-next').click();assert(!!await page.locator('#name-error').textContent(),'Validation');
 for(const [id,val]of Object.entries({'full-name':'Khách mẫu',phone:'0900000000',province:'Hồ Chí Minh',ward:'Phường mẫu',address:'123 Đường mẫu'}))await page.locator('#'+id).fill(val);
 await page.locator('#consent').check();assert((await page.locator('#customer-summary').textContent()).includes('Khách mẫu'),'Live review');
 await page.locator('#fail-demo').click();assert(await page.locator('#payment-error').isVisible(),'Error state');
 for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Checkout overflow');await page.screenshot({path:`${out}/checkout-${width}.png`,fullPage:true});await page.screenshot({path:`${out}/checkout-${width}-top.png`});}
 await page.locator('.form-next').click();assert(await page.locator('.form-next').getAttribute('aria-busy')==='true','Processing');await page.locator('#success').waitFor({state:'visible'});await page.screenshot({path:out+'/success.png'});
 await page.locator('#restart').click();assert(await page.locator('.plan-card').count()===6,'Same offer');
 const empty=await browser.newPage();await empty.addInitScript(()=>window.storefrontConfig={sales:{name:'Sales mẫu',id:'TEST'},sections:{internet:{visible:true,planIds:[]},combo:{visible:false,planIds:[]}}});await empty.goto(root+'index.html');assert(await empty.locator('.empty-offer').isVisible(),'Empty state');await empty.screenshot({path:out+'/empty.png'});
 assert(!errors.length,errors.join(';'));writeFileSync(out+'/checks.json',JSON.stringify({status:'PASS',offers:5,widths:[375,768,1024,1440],errors},null,2));await browser.close();console.log('PASS: 20 homepage views, 4 checkout views, carousel, bottom sheet, region, validation, review, processing, success, empty.');
})().catch(e=>{console.error(e);process.exit(1)});
