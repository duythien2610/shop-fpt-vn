const {chromium}=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const {join}=require('node:path');
const assert=require('node:assert/strict');
const root='file:///'+__dirname.replace(/\\/g,'/')+'/',out=join(__dirname,'qa','tobe');
mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();page.setDefaultTimeout(8000);
 const errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
 const state=()=>page.evaluate(()=>structuredClone(Purchase.state));
 const step=x=>page.waitForFunction(s=>Purchase.state.step===s,x);
 const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:join(out,name+'.png'),fullPage:true});};
 const overflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
 async function contact(){
  assert.equal((await state()).step,'contact');assert.equal(await page.locator('#buy-address').count(),0);
  await page.locator('#buy-name').fill('Khách Kiểm Thử');await page.locator('#buy-phone').fill('0900000000');
  assert.equal((await state()).lead,null);await page.locator('#buy-consent').check();
  assert((await state()).lead);await shot('contact-'+await page.evaluate(()=>document.body.dataset.concept+'-'+innerWidth));await page.locator('#purchase-submit').click();await step('address');
 }
 async function address(){
  assert.equal(await page.locator('#buy-province').count(),0);
  await page.locator('#buy-address').fill('123 Đường mẫu');await page.locator('#buy-address').blur();
  await page.waitForFunction(()=>Purchase.validQuote());assert.equal((await state()).needsPriceConfirm,false);
 }
 async function payment(file,offer='performance'){
  await page.goto(root+file+'?offer='+offer);await page.locator('[data-register]').first().click();await contact();await address();await page.locator('#purchase-submit').click();await step('payment');
 }
 for(const [i,file] of ['index.html','concept-2.html','concept-3.html'].entries()){
  for(const width of [375,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const offer of ['family','performance','apartment','internet','combo','empty','public']){
    await page.goto(root+file+'?offer='+offer);await overflow();
    const expected={family:4,performance:6,apartment:3,internet:2,combo:2,empty:0,public:4}[offer];assert.equal(await page.locator('.plan-card').count(),expected);
   }
   await page.goto(root+file+'?offer=performance');await page.locator('[data-register]').first().click();
   await page.locator('#purchase-submit').click();assert(await page.locator('#buy-name-error').textContent());
   await contact();await shot(`c${i+1}-address-empty-${width}`);await address();await overflow();
   await shot(`c${i+1}-address-${width}`);await page.locator('#purchase-submit').click();await step('payment');
   assert.equal(await page.locator('.purchase-steps li').count(),5);assert.equal(await page.locator('.period-choice').count(),4);
   assert.equal(await page.locator('.voucher-disclosure').getAttribute('open'),null);assert.equal(await page.locator('.extras-toggle').getAttribute('aria-expanded'),'false');
   assert.equal(await page.locator('#due-total').textContent(),'300.000đ');
   await shot(`c${i+1}-payment-${width}`);await overflow();
   await page.locator('.voucher-disclosure summary').click();await page.locator('[data-action="open-vouchers"]').click();await page.locator('[value="UUDAI50"]').check();await page.locator('#voucher-confirm').click();
   assert.equal(await page.locator('#due-total').textContent(),'250.000đ');
   await page.locator('[name="period"][value="3"]').check();assert.equal((await state()).voucher,null);assert.equal(await page.locator('#due-total').textContent(),'750.000đ');
   for(const id of ['6','12','post'])await page.locator(`[name="period"][value="${id}"]`).check();
   await page.locator('[data-action="toggle-extras"]').click();await page.locator('[name="extra"][value="mesh"]').check();assert.equal(await page.locator('#due-total').textContent(),'650.000đ');await page.locator('[name="extra"][value="mesh"]').uncheck();
   for(const method of ['momo','bank','zalopay','international','atm','vnpay'])await page.locator(`[name="method"][value="${method}"]`).check();
   await page.locator('[data-action="pay"]').click();await step('waiting');const order=(await state()).order.id;
   await page.locator('[data-outcome="failed"]').click();await step('failed');await shot(`c${i+1}-failed-${width}`);await overflow();
   assert.equal(await page.locator('[data-action="pay-later"]').count(),1);await page.locator('[data-action="change-method"]').click();await page.locator('[name="method"][value="momo"]').check();
   await page.locator('[data-action="pay"]').click();assert.equal((await state()).order.id,order);
   await page.locator('[data-outcome="cancel"]').click();await step('failed');await page.locator('[data-action="retry-payment"]').click();await step('payment');
   await page.locator('[data-action="pay"]').click();await page.locator('[data-outcome="pending"]').click();await step('pending');
   const tx=(await state()).transaction.id;await page.evaluate(()=>Purchase.open('combo-giga'));assert.equal((await state()).transaction.id,tx);assert.equal((await state()).step,'pending');
   assert.equal(await page.locator('[data-action="pay"]').count(),0);assert.equal(await page.locator('[data-action="pay-later"]').count(),0);
   await page.locator('[data-action="check-transaction"]').click();await page.waitForFunction(()=>document.querySelector('.transaction-panel [role="status"]')?.textContent.includes('vẫn chưa'));
   await shot(`c${i+1}-pending-${width}`);await page.locator('[data-outcome="paid"]').click();await step('paid');assert.equal((await state()).order.status,'paid');await shot(`c${i+1}-success-${width}`);await overflow();
  }
  // Region price is correct before contact and never changes for unchanged link region.
  await payment(file,'internet');assert.equal((await state()).quote.monthly,270000);assert.equal((await state()).needsPriceConfirm,false);
  await page.locator('[data-action="edit-info"]').click();await page.locator('[data-action="edit-address"]').click();await page.locator('#buy-province').selectOption('Đà Nẵng');
  await page.locator('[data-action="check-address"]').click();await page.waitForFunction(()=>Purchase.state.needsPriceConfirm);
  assert.equal((await state()).quote.monthly,300000);assert.equal(await page.locator('.price-actions button').count(),3);
  assert(await page.locator('#purchase-submit').isDisabled());assert.equal((await state()).step,'address');await shot(`c${i+1}-price-change`);
  const lead=(await state()).lead.id;await page.locator('[data-action="choose-plan"]').click();await page.locator('[data-register]').last().click();assert.equal((await state()).values.phone,'0900000000');assert.equal((await state()).lead.id,lead);
  await page.locator('[data-action="check-address"]').click();await page.waitForFunction(()=>Purchase.validQuote());assert.equal((await state()).needsPriceConfirm,false);
  await page.locator('#purchase-submit').click();await step('payment');
  // Unavailable package requires explicit replacement from sales catalog.
  await page.evaluate(()=>Purchase.setScenario('unavailable'));await page.locator('[data-action="check-address"]').click();await page.locator('[data-replace]').first().waitFor();
  const previous=(await state()).planId;assert.equal((await state()).planId,previous);await page.locator('[data-replace]').first().click();await page.waitForFunction(()=>Purchase.validQuote());assert.notEqual((await state()).planId,previous);assert.equal((await state()).lead.id,lead);
  // Failed payment can submit an unpaid order without claiming payment success.
  await payment(file);await page.locator('[data-action="pay"]').click();const unpaid=(await state()).order.id;await page.locator('[data-outcome="failed"]').click();await page.locator('[data-action="pay-later"]').click();await step('submitted');assert.equal((await state()).order.id,unpaid);assert.equal((await state()).order.status,'submitted_unpaid');assert((await page.locator('.purchase-result h1').textContent()).includes('thanh toán sau'));await shot(`c${i+1}-pay-later`);
  // Public links select region before any personal information, then display final price.
  await page.goto(root+file+'?offer=public');assert((await page.locator('.card-price strong').first().textContent()).startsWith('Từ '));await page.locator('[data-register]').first().click();assert(await page.locator('#region-dialog').isVisible());assert.equal(await page.locator('#buy-phone').count(),0);
  await page.locator('#region-province').selectOption('Hà Nội');await page.locator('#region-ward').selectOption({index:1});await shot(`c${i+1}-public-region`);await page.locator('#region-form button[type="submit"]').click();await contact();await address();assert.equal((await state()).needsPriceConfirm,false);await page.locator('#purchase-submit').click();await step('payment');
  // Apartment prefill asks only for unit/building detail.
  await page.goto(root+file+'?offer=apartment');await page.locator('[data-register]').first().click();await contact();assert((await page.locator('.building-context').textContent()).includes('Chung cư mẫu A'));await page.locator('#buy-address').fill('A1205');await page.locator('#buy-address').blur();await page.waitForFunction(()=>Purchase.validQuote());await page.locator('#purchase-submit').click();await step('payment');
  results.push(`PASS concept ${i+1}: 28 homepage layouts; contact/lead, automatic quote, payment/recovery/pending/success at 375/768/1024/1440; regional prices, replacement, unpaid submission, public link, apartment.`);console.log(results.at(-1));
 }
 // Preserve customer and quote while switching concept, lock offer switches when pending.
 await payment('index.html');await page.locator('#review-launch').click();await page.locator('#review-dialog [data-concept-choice="2"]').click();await page.keyboard.press('Escape');assert.equal((await state()).values.phone,'0900000000');await page.locator('[data-action="pay"]').click();await page.locator('[data-outcome="pending"]').click();await page.locator('#review-launch').click();await page.locator('#offer-preview').selectOption('public');assert.equal((await state()).step,'pending');await page.keyboard.press('Escape');
 assert.deepEqual(errors,[]);results.push('PASS cross-concept preservation and pending lock; no uncaught browser errors.');writeFileSync(join(out,'RESULTS.txt'),results.join('\n'));await browser.close();console.log('ALL PASS');
})().catch(e=>{console.error(e);process.exit(1)});
