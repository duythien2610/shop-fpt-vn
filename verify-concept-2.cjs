const {chromium}=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {mkdirSync,writeFileSync,statSync}=require('node:fs');
const root='file:///C:/BA/ba-tool-kit/project/AM/shop-prototype/';const out='shop-prototype/qa/concept-2-update';const assert=(v,m)=>{if(!v)throw Error(m)};
(async()=>{
 mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const cases={family:[1,3],performance:[3,3],apartment:[2,1],internet:[2,0],combo:[0,2]};
 for(const [offer,counts] of Object.entries(cases)){
  await page.goto(root+'concept-2.html?offer='+offer);
  assert(await page.locator('.hero-cta').textContent()===(counts[0]&&counts[1]?'Xem gói dành cho bạn':counts[0]?'Xem gói Internet':'Xem gói Combo'),'Context CTA');
  for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});await page.evaluate(()=>document.fonts.ready);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+offer+'/'+width);await page.screenshot({path:`${out}/${offer}-${width}.png`,fullPage:true});await page.screenshot({path:`${out}/${offer}-${width}-top.png`});}
 }
 await page.goto(root+'concept-2.html?offer=performance');await page.setViewportSize({width:1440,height:900});
 const ratios=await page.locator('#internet .speed-track').evaluateAll(els=>els.map(e=>+e.getAttribute('aria-valuenow')));assert(JSON.stringify(ratios)==='[30,100,100]','True speed normalization');
 const columns=await page.locator('#internet .card-spec').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().left));assert(Math.max(...columns)-Math.min(...columns)<1,'Speed column alignment');
 await page.locator('#internet .plan-card').first().hover();assert(await page.locator('#internet .speed-fill').first().evaluate(e=>getComputedStyle(e).animationDuration)==='0.3s','300ms reveal');
 await page.emulateMedia({reducedMotion:'reduce'});assert(await page.locator('#internet .speed-fill').first().evaluate(e=>getComputedStyle(e).animationName)==='none','Reduced motion');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:375,height:900});await page.evaluate(()=>scrollTo(0,document.querySelector('.tech-hero').offsetHeight+100));await page.waitForTimeout(150);assert(await page.locator('.mobile-discovery').isVisible(),'Mobile discovery CTA');await page.screenshot({path:out+'/mobile-sticky.png'});
 await page.locator('#internet .plan-card').first().click({position:{x:15,y:15}});assert(await page.locator('.mobile-discovery').isHidden(),'Dismiss after row interaction');
 await page.locator('[data-plan-id="internet-meta"] [data-register]').click();assert(await page.locator('#order-name').textContent()==='Internet Meta','Product retained');assert(await page.locator('.sales-reference strong').textContent()==='AM-DEMO-02','Sales retained');
 for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Checkout overflow');await page.screenshot({path:`${out}/checkout-${width}.png`,fullPage:true});}
 await page.locator('.form-next').click();assert(!!await page.locator('#name-error').textContent(),'Validation');
 for(const [id,val]of Object.entries({'full-name':'Khách mẫu',phone:'0900000000',province:'Hồ Chí Minh',ward:'Phường mẫu',address:'123 Đường mẫu'}))await page.locator('#'+id).fill(val);await page.locator('#consent').check();await page.locator('.form-next').click();await page.locator('#fail-demo').click();assert(await page.locator('#payment-error').isVisible(),'Payment error');await page.locator('#complete-demo').click();assert(await page.locator('#complete-demo').getAttribute('aria-busy')==='true','Processing');await page.locator('#success').waitFor({state:'visible'});
 const empty=await browser.newPage();await empty.addInitScript(()=>window.storefrontConfig={sales:{id:'TEST',name:'Sales mẫu'},sections:{internet:{visible:true,planIds:[]},combo:{visible:true,planIds:[]}}});await empty.goto(root+'concept-2.html');assert(await empty.locator('.empty-offer').isVisible(),'Empty');assert(await empty.locator('.hero-cta').isHidden(),'No dead hero CTA');
 assert(statSync('shop-prototype/assets/hero-fiber.webp').size<200000,'WebP budget');assert(!errors.length,errors.join(';'));writeFileSync(out+'/checks.json',JSON.stringify({status:'PASS',offers:5,widths:[375,768,1024,1440],ratios,webpBytes:statSync('shop-prototype/assets/hero-fiber.webp').size,errors},null,2));await browser.close();console.log('PASS: 20 home screens, 4 checkout screens, true speed ratio, aligned columns, motion, sticky CTA, sales/product, errors/processing, empty, WebP.');
})().catch(e=>{console.error(e);process.exit(1)});
