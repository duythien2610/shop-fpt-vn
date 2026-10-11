/* Encoding only: keep original generated PNGs, create optimized WebP copies. */
const sharp=require('C:/Users/33dod/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {join}=require('node:path');
(async()=>{for(const name of ['hero-tech','hero-family','card-work','card-family','card-performance','card-entertainment']){
  const src=join(__dirname,'assets',name+'-v4.png');
  await sharp(src).webp({quality:84}).toFile(join(__dirname,'assets',name+'-v4.webp'));
  console.log('Encoded '+name);
}})().catch(e=>{console.error(e);process.exit(1)});
