/* Create shareable encoded copies of verified browser screenshots. */
const sharp=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {join}=require('node:path');const {mkdirSync}=require('node:fs');
const out=join(__dirname,'assets','review');mkdirSync(out,{recursive:true});
(async()=>{for(const concept of [1,2,3])for(const view of ['home','checkout','payment','voucher','success'])for(const width of [375,1440]){
 const name=`c${concept}-${view}-${width}`;
 await sharp(join(__dirname,'qa','v4',name+'.png')).webp({quality:87}).toFile(join(out,name+'.webp'));
}console.log('Prepared 30 review screenshots');})().catch(e=>{console.error(e);process.exit(1)});
