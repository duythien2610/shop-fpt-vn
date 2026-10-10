const {chromium}=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {mkdirSync,writeFileSync}=require('node:fs');
const root='file:///C:/BA/ba-tool-kit/project/AM/shop-prototype/';
const files=['index.html','concept-2.html','concept-3.html'];
const expected={family:[1,3],performance:[3,3],apartment:[2,1],internet:[2,0],combo:[0,2]};
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
(async()=>{
  mkdirSync('shop-prototype/qa/revision-3',{recursive:true});
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(let n=0;n<files.length;n++){
    for(const [offer,counts] of Object.entries(expected)){
      await page.goto(root+files[n]+'?offer='+offer);
      for(let i=0;i<2;i++){const id=['internet','combo'][i];assert(await page.locator('#'+id+' .plan-card').count()===counts[i],`${files[n]} ${offer} ${id} count`);assert(await page.locator('#'+id).count()===(counts[i]?1:0),'Hide empty group');}
      assert(await page.locator('.brand span').count()===0,'No shop suffix');
      assert(await page.locator('.prototype-tools a').first().getAttribute('href').then(x=>x.includes('offer='+offer)),'Preserve offer between concepts');
    }
    await page.goto(root+files[n]+'?offer=performance');
    for(const width of [375,768,1024,1440]){
      await page.setViewportSize({width,height:1000});
      await page.evaluate(()=>document.fonts.ready);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${files[n]} horizontal overflow at ${width}`);
      if(width===375||width===1440){await page.screenshot({path:`shop-prototype/qa/revision-3/concept-${n+1}-${width}.png`,fullPage:true});await page.screenshot({path:`shop-prototype/qa/revision-3/concept-${n+1}-${width}-top.png`});}
    }
    await page.locator('[data-plan-id="internet-meta"] [data-details]').click();
    assert(await page.locator('#details-body h2').textContent()==='Internet Meta','Detail product identity');
    await page.locator('#details-register').click();
    assert(await page.locator('#order-name').textContent()==='Internet Meta','Checkout keeps product');
    assert(await page.locator('.sales-reference strong').textContent()==='AM-DEMO-02','Checkout keeps sales');
    await page.locator('.form-next').click();assert(!!await page.locator('#name-error').textContent(),'Required validation');
    for(const [id,value]of Object.entries({'full-name':'Khách hàng mẫu',phone:'0900000000',province:'Hồ Chí Minh',ward:'Phường mẫu',address:'123 Đường mẫu'}))await page.locator('#'+id).fill(value);
    await page.locator('#consent').check();await page.locator('.form-next').click();
    if(n===0||n===2){await page.locator('#success').waitFor({state:'visible'});}else{
      await page.locator('#edit-info').click();assert(await page.locator('#full-name').inputValue()==='Khách hàng mẫu','Keep input when editing');
      await page.locator('.form-next').click();await page.locator('#fail-demo').click();assert(await page.locator('#payment-error').isVisible(),'Failure state');
      await page.locator('#complete-demo').click();await page.locator('#success').waitFor({state:'visible'});assert(await page.locator('#success').isVisible(),'Demo completion');
    }
    assert((await page.locator('#result-summary').textContent()).includes('Internet Meta'),'Result product');
    await page.locator('#restart').click();assert(await page.locator('.plan-card').count()===6,'Return to same offer');
    await page.locator('[data-plan-id="combo-sky"] [data-register]').click();assert(await page.locator('#order-name').textContent()==='Combo Sky – V.VIP','Direct Combo checkout');
    await page.setViewportSize({width:375,height:812});await page.screenshot({path:`shop-prototype/qa/revision-3/concept-${n+1}-checkout-mobile.png`,fullPage:true});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile checkout overflow');
    console.log(`Concept ${n+1}: 5 AM configurations, responsive, details, checkout, sales and product retention PASS`);
  }
  const edge=await browser.newPage();
  await edge.addInitScript(()=>window.storefrontConfig={sales:{id:'TEST',name:'Tên người tư vấn mẫu rất dài'},audience:'family',sections:{internet:{visible:true,planIds:['internet-meta','internet-meta','combo-sky','internet-giga','internet-sky','invalid']},combo:{visible:false,planIds:['combo-sky']}}});
  await edge.goto(root+'concept-3.html');assert(await edge.locator('.plan-card').count()===3,'Unique category-matched cap');assert(await edge.locator('#combo').count()===0,'Disabled with retained IDs');
  const empty=await browser.newPage();await empty.addInitScript(()=>window.storefrontConfig={sales:{id:'TEST',name:'Sales mẫu'},sections:{internet:{visible:true,planIds:[]},combo:{visible:false,planIds:[]}}});await empty.goto(root+'index.html');assert(await empty.locator('.empty-offer').isVisible(),'Empty offer');await empty.locator('#empty-contact').click();assert(await empty.locator('#contact-modal').isVisible(),'Empty support');
  assert(errors.length===0,errors.join('; '));
  writeFileSync('shop-prototype/qa/revision-3/checks.json',JSON.stringify({status:'PASS',concepts:3,offersPerConcept:5,widths:[375,768,1024,1440],errors},null,2));
  await browser.close();console.log('PASS: all checks and empty/hidden/category/duplicate limits.');
})().catch(e=>{console.error(e);process.exit(1)});
