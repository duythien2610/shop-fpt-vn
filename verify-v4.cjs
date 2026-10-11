const {chromium}=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const {join}=require('node:path');
const assert=require('node:assert/strict');
const root='file:///'+__dirname.replace(/\\/g,'/')+'/';
const out=join(__dirname,'qa','v4');mkdirSync(out,{recursive:true});
const results=[];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();page.setDefaultTimeout(8000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>{document.activeElement?.blur();scrollTo({top:0,behavior:'instant'});});await page.screenshot({path:join(out,name+'.png'),fullPage:true});};
 const state=async()=>page.evaluate(()=>structuredClone(Purchase.state));
 const waitStep=async step=>page.waitForFunction(x=>Purchase.state.step===x,step);
 const overflow=async label=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' overflow');
 async function goPayment(index){
  await page.locator('[data-register]').first().click();
  await page.locator('#buy-address').fill('123 Đường mẫu');
  if(index===1){await page.locator('#purchase-submit').click();await page.locator('#buy-name').waitFor();}
  await page.locator('#buy-name').fill('Khách Kiểm Thử');await page.locator('#buy-phone').fill('0900000000');await page.locator('#buy-consent').check();
  await page.locator('#purchase-submit').click();await waitStep('payment');
 }
 for(const [index,file] of ['index.html','concept-2.html','concept-3.html'].entries()){
  if(process.env.AM_TEST_CONCEPT&&Number(process.env.AM_TEST_CONCEPT)!==index+1)continue;
  for(const offer of ['family','performance','apartment','internet','combo','empty'])for(const width of [375,768,1024,1440]){
   await page.setViewportSize({width,height:900});await page.goto(root+file+'?offer='+offer);await page.evaluate(()=>document.fonts.ready);
   await overflow(file+offer+width);
   const expected={family:4,performance:6,apartment:3,internet:2,combo:2,empty:0}[offer];assert.equal(await page.locator('.plan-card').count(),expected);
   assert.equal(await page.locator('.offer-group:has(.plan-card)').count(),offer==='empty'?0:['internet','combo'].includes(offer)?1:2);
   await page.evaluate(()=>document.querySelectorAll('#home img').forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.querySelectorAll('#home img')].every(i=>i.complete&&i.naturalWidth));
   if(offer==='performance'&&(width===375||width===1440))await shot('c'+(index+1)+'-home-'+width);
  }
  for(const width of [375,1440]){
   await page.setViewportSize({width,height:900});await page.goto(root+file+'?offer=performance');
   await page.locator('[data-details]').first().click();assert(await page.locator('#details-dialog').isVisible());await shot('c'+(index+1)+'-details-'+width);await page.keyboard.press('Escape');
   await page.locator('[data-register]').first().click();assert.equal(await page.locator('#buy-province').inputValue(),'Hồ Chí Minh');assert(await page.locator('#buy-province').isDisabled());
   await page.locator('#purchase-submit').click();assert((await page.locator('#buy-address-error').textContent()).length);
   await page.locator('#buy-address').fill('123 Đường mẫu');
   if(index===1){await page.locator('#purchase-submit').click();await page.locator('#buy-name').waitFor();}
   await page.locator('#buy-name').fill('Khách Kiểm Thử');await page.locator('#buy-phone').fill('123');await page.locator('#purchase-submit').click();assert((await page.locator('#buy-phone-error').textContent()).includes('10 chữ số'));
   await page.locator('#buy-phone').fill('0900000000');await page.locator('#buy-consent').check();await shot('c'+(index+1)+'-checkout-'+width);await overflow('Checkout');
   await page.locator('#purchase-submit').click();await waitStep('payment');assert.equal(await page.locator('#due-total').textContent(),'300.000đ');
   await page.locator('[data-action="open-vouchers"]').click();await shot('c'+(index+1)+'-voucher-'+width);assert(await page.locator('[name="voucher-choice"][value="HETHAN"]').isDisabled());
   await page.locator('[name="voucher-choice"][value="UUDAI50"]').check();await page.locator('#voucher-confirm').click();assert.equal(await page.locator('#due-total').textContent(),'250.000đ');assert.equal(await page.locator('#voucher-status').textContent(),'Áp dụng thành công');
   await shot('c'+(index+1)+'-payment-'+width);await overflow('Payment');
   await page.locator('[name="period"][value="3"]').check();assert(!(await state()).voucher);assert((await page.locator('#voucher-status').textContent()).includes('gỡ'));assert.equal(await page.locator('#due-total').textContent(),'750.000đ');
   await page.locator('#voucher-code').fill(' uudai100 ');await page.locator('#apply-voucher').click();assert.equal(await page.locator('#due-total').textContent(),'650.000đ');
   await page.locator('[data-action="toggle-extras"]').click();await page.locator('[name="extra"][value="mesh"]').check();assert.equal(await page.locator('#due-total').textContent(),'1.000.000đ');
   for(const method of ['momo','bank','zalopay','international','atm','vnpay'])await page.locator('[name="method"][value="'+method+'"]').check();
   await page.locator('[data-action="pay"]').click();await waitStep('waiting');await page.locator('[data-outcome="failed"]').click();await shot('c'+(index+1)+'-failed-'+width);await page.locator('[data-action="retry-payment"]').click();assert.equal((await state()).values.name,'Khách Kiểm Thử');assert.equal(await page.locator('#due-total').textContent(),'1.000.000đ');
   await page.locator('[data-action="pay"]').click();await page.locator('[data-outcome="cancel"]').click();await waitStep('payment');assert.equal((await state()).voucher.code,'UUDAI100');
   await page.locator('[data-action="pay"]').click();await page.locator('[data-outcome="pending"]').click();await shot('c'+(index+1)+'-pending-'+width);assert.equal(await page.locator('[data-action="pay"]').count(),0);assert.equal(await page.locator('[data-outcome="cancel"]').count(),0);await page.locator('[data-action="check-transaction"]').click();await page.waitForFunction(()=>document.querySelector('[role="status"]')?.textContent.includes('vẫn chưa'));
   await page.locator('[data-outcome="paid"]').click();await waitStep('paid');await shot('c'+(index+1)+'-success-'+width);assert((await page.locator('.purchase-result').textContent()).includes('AM-DEMO-02'));await overflow('Result');
   await page.goto(root+file+'?offer=apartment');await page.locator('[data-register]').first().click();assert.equal(await page.locator('#buy-building').inputValue(),'Chung cư mẫu A');assert.equal(await page.locator('[name="houseType"]:checked').inputValue(),'apartment');await page.locator('#buy-address').fill('A1205');await page.locator('[data-action="check-address"]').click();await page.waitForFunction(()=>Purchase.validQuote());await shot('c'+(index+1)+'-apartment-'+width);
  }
  await page.setViewportSize({width:1440,height:900});await page.goto(root+file+'?offer=performance');await goPayment(index);
  await page.locator('[data-action="edit-info"]').click();await page.locator('[data-action="edit-address"]').click();await page.locator('#buy-province').selectOption('Đà Nẵng');assert.equal(await page.locator('#due-total').textContent(),'Chờ kiểm tra');await page.locator('[data-action="check-address"]').click();await page.waitForFunction(()=>Purchase.state.needsPriceConfirm);assert.equal((await state()).quote.monthly,270000);await shot('c'+(index+1)+'-repriced-1440');await page.locator('[data-action="confirm-price"]').click();await page.locator('#purchase-submit').click();if(index===1)await page.locator('#purchase-submit').click();await waitStep('payment');assert.equal((await state()).lastAcceptedMonthly,270000);
  for(const scenario of ['same','price','unavailable','none','error']){
   await page.locator('#review-launch').click();await page.locator('#scenario-preview').selectOption(scenario);await page.keyboard.press('Escape');await page.locator('[data-action="check-address"]').click();await page.waitForFunction(()=>Purchase.state.status!=='checking');await overflow('Scenario '+scenario);
   const s=await state();if(scenario==='price')assert(s.needsPriceConfirm);if(scenario==='unavailable')assert.equal(s.status,'unavailable');if(scenario==='none')assert.equal(s.status,'none');if(scenario==='error')assert.equal(s.status,'error');
   await shot('c'+(index+1)+'-'+scenario+'-1440');
  }
  await page.locator('#review-launch').click();await page.locator('#scenario-preview').selectOption('unavailable');await page.keyboard.press('Escape');await page.locator('[data-action="check-address"]').click();await page.locator('[data-replace]').first().waitFor();const saved=(await state()).values.name;await page.locator('[data-replace]').first().click();await page.waitForFunction(()=>Purchase.validQuote());assert.equal((await state()).values.name,saved);
  results.push('PASS concept '+(index+1)+': 24 homepage configurations, desktop/mobile complete purchase, voucher, periods, extras, six methods, apartment and address scenarios');console.log(results.at(-1));
 }
 // Cross-concept switch keeps one in-memory order and customer; pending cannot be erased.
 await page.goto(root+'index.html?offer=performance');await goPayment(0);await page.locator('#voucher-code').fill('CA2456650KTTOL');await page.locator('#apply-voucher').click();assert.equal(await page.locator('#due-total').textContent(),'250.000đ');
 await page.locator('#review-launch').click();await page.locator('#review-dialog [data-concept-choice="2"]').click();await page.keyboard.press('Escape');assert.equal((await state()).values.name,'Khách Kiểm Thử');assert.equal(await page.locator('#due-total').textContent(),'250.000đ');assert.equal(await page.locator('body').getAttribute('data-concept'),'2');
 await page.locator('[data-action="pay"]').click();await page.locator('[data-outcome="pending"]').click();await page.locator('#review-launch').click();await page.locator('#offer-preview').selectOption('family');assert.equal((await state()).step,'pending');await page.locator('#review-dialog [data-concept-choice="3"]').click();await page.keyboard.press('Escape');assert.equal((await state()).step,'pending');await page.locator('[data-outcome="paid"]').click();
 // An outdated address response cannot unlock payment after input changes.
 await page.goto(root+'index.html?offer=performance');await page.locator('[data-register]').first().click();await page.locator('#buy-address').fill('123 Đường mẫu');await page.locator('[data-action="check-address"]').click();await page.locator('#buy-address').fill('456 Đường mẫu');await page.waitForTimeout(600);assert.equal((await state()).status,'dirty');assert(await page.locator('[data-action="check-address"]').isEnabled());
 // Every configured product is capped, deduplicated and category checked.
 await page.goto(root+'index.html');await page.evaluate(()=>{const o=Storefront.offer();o.sections.internet.planIds=['internet-giga','internet-giga','invalid','combo-giga','internet-sky','internet-meta'];Storefront.renderHome();});assert.equal(await page.locator('#internet .plan-card').count(),3);
 assert.deepEqual(errors,[],'No uncaught browser errors');
 results.push('PASS cross-concept state retention, pending transaction lock, stale quote rejection, invalid catalog IDs');
 writeFileSync(join(out,'RESULTS.txt'),results.join('\n')+'\nNo uncaught browser errors.\n','utf8');
 await browser.close();console.log('ALL PASS');
})().catch(e=>{console.error(e);process.exit(1)});
