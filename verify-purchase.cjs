const {chromium}=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {mkdirSync}=require('node:fs');
const {join}=require('node:path');
const root='file:///'+__dirname.replace(/\\/g,'/')+'/';
const out=join(__dirname,'qa','purchase-update');mkdirSync(out,{recursive:true});
const assert=(v,m)=>{if(!v)throw Error(m)};
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const [index,file] of ['index.html','concept-2.html','concept-3.html'].entries()){
 for(const offer of ['family','performance','apartment','internet','combo'])for(const width of [375,768,1024,1440]){
  await page.setViewportSize({width,height:900});await page.goto(root+file+'?offer='+offer);await page.evaluate(()=>document.fonts.ready);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Home overflow '+file+offer+width);
  if(offer==='performance'&&(width===375||width===1440))await page.screenshot({path:join(out,`c${index+1}-home-${width}.png`),fullPage:true});
 }
 for(const width of [375,1440]){
  await page.setViewportSize({width,height:900});await page.goto(root+file+'?offer=performance');
  const name=await page.locator('.plan-card h3').first().textContent();await page.locator('[data-register]').first().click();
  assert(await page.locator('#purchase').isVisible(),'Purchase opens');assert((await page.locator('.purchase-summary').textContent()).includes(name),'Selected plan retained');
  await page.locator('#purchase-submit').click();assert(await page.locator('#buy-phone-error').textContent(),'Required fields');
  for(const [field,value]of Object.entries({province:'Hồ Chí Minh',ward:'Phường mẫu',address:'123 Đường mẫu',name:'Khách Kiểm Thử',phone:'0900000000'}))await page.locator('#buy-'+field).fill(value);
  await page.locator('#buy-consent').check();await page.screenshot({path:join(out,`c${index+1}-checkout-${width}.png`),fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Checkout overflow');
  await page.locator('#purchase-submit').click();if(index===1)await page.locator('#purchase-submit').click();
  await page.locator('.purchase-result').waitFor();assert((await page.locator('.purchase-result').textContent()).includes('Chưa thu tiền'),'Unverified request never paid');
  await page.locator('.purchase-back').click();await page.locator('[data-register]').first().click();
  await page.locator('[aria-label="Kịch bản checkout mẫu"]').selectOption('ready');
  await page.locator('#purchase-submit').click();if(index===1)await page.locator('#purchase-submit').click();
  await page.locator('[data-outcome="failed"]').click();await page.locator('#purchase-retry').click();
  assert(await page.locator('#buy-name').inputValue()==='Khách Kiểm Thử','Retry preserves input');
  await page.locator('#purchase-submit').click();await page.locator('[data-outcome="pending"]').click();
  assert((await page.locator('#purchase-review [role="status"]').textContent()).includes('Chưa xác định'),'Pending state');
  await page.screenshot({path:join(out,`c${index+1}-payment-${width}.png`),fullPage:true});
  await page.locator('[data-outcome="paid"]').click();await page.locator('.purchase-result').waitFor();
  assert((await page.locator('.purchase-result').textContent()).includes('AM-DEMO-02'),'Sales retained');
 }
 console.log('PASS concept '+(index+1)+': 20 home widths, request, validation, payment failure/retry/pending/success at mobile + desktop');
}
assert(!errors.length,errors.join('\n'));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
