import { readdirSync, readFileSync, existsSync, lstatSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
export function walk(dir){if(!existsSync(dir))return [];return readdirSync(dir).flatMap(name=>{const p=resolve(dir,name);if(lstatSync(p).isSymbolicLink())throw Error(`Symlink not allowed: ${p}`);return lstatSync(p).isDirectory()?walk(p):[p];});}
const hash=b=>createHash('sha256').update(b).digest('hex');
// Exact optimized derivative approved by the user; other PNGs remain forbidden.
const manuHash='4f3ff6214f2cbcbac376f2aad058d56acdf08e67c098d062b4579aeb9dd94b57';
// Owner supplied this close-up and requested an Adobe crop for the chat on 2026-10-18.
const manuChatHash='cef5544f34700590c002a03e7f0df4b4e6679aa032cfff2449124a424429d23a';
// Official organization files, unmodified; owner confirmed permission for use.
export const logoAssets=new Map([
 ['app/src/assets/uf-logo.png','fa356cccac6b7e3ff84190dbdcc2dfa6243a590e6b5e41a6b5f596e4b198a0d1'],
 ['app/src/assets/uf-ifas-logo.png','419c4c90bc643a8c740f75717fb7e622c05e35d2fb445f3d8a70ee8a0ac7773a'],
 ['app/src/assets/vit-ap-logo.png','ee8f6b2bb7421d7f58e1695036def25401583d18ee38f4cd358aea30746c3fc4'],
 ['app/src/assets/smartinternz-logo.png','d4d27846cc834597820a9655d5b0b5c88a0226fde582c153aac2690d3dfccaa7'],
]);
// Exact generated concept derivatives requested for LOCAL design review.
// This allowlist is integrity validation, not authorization to publish the site.
export const conceptArtAssets=new Map([
 ['app/src/assets/ifas-blueberry-concept.jpg','efcfc2c656d16d492ce0557745f88e944d05f901cbb77a8d2d5c6966f68450de'],
 ['app/src/assets/vit-campus-concept.jpg','2470d5ebdd25221967499ea77dd24cec82eacf17aea8d0a7ab9542b4d4edbac2'],
 ['app/src/assets/transgis-project-concept.webp','e1038b3ab1a1143923abfa23d89a9bd38181b7310f8cdf3b9c4351fe9a40a8a5'],
 ['app/src/assets/reddit-project-concept.webp','7b7b986b879cf1c056267cd37ec7a3c9a16f4feb1f4d940522bb210a89a00287'],
 ['app/src/assets/zara-project-concept.webp','31ffb2cd30781221461b9f96c0a642e71bd5729f186b8e122baa7a1259e11a7a'],
 ['app/src/assets/fedguard-project-concept.webp','3ecd685abd3bf2204607c799d5b189780c8ece56cdc37c74d9c78ef84fe8c358'],
 ['app/src/assets/yelp-project-concept.webp','a34cb472d1bbad29aa3b394569d713eb7bb0c6610321b1a409f15aaf15fbf6d7'],
 ['app/src/assets/covid-project-concept.webp','a29f87858e8d8fb639cc3de18c35133d663cdeb2ced137a2ea890ce8075a08b8'],
 ['app/src/assets/snack-project-concept.webp','8fac826401f156d886e3f2154cf776a7257447d25c15b84d6bc3002af92de8eb'],
]);
export function auditSource(base=root){
 const problems=[];
 for(const p of walk(resolve(base,'public')))if(relative(resolve(base,'public'),p).replaceAll('\\','/')!=='assets/README.md')problems.push(`Unapproved public file: ${relative(base,p)}`);
 for(const p of walk(resolve(base,'app'))){
  const rel=relative(base,p).replaceAll('\\','/');
  const approvedManu=(rel==='app/src/assets/manu-approved.png'&&hash(readFileSync(p))===manuHash)||(rel==='app/src/assets/manu-chat-portrait.png'&&hash(readFileSync(p))===manuChatHash);
  const approvedLogo=logoAssets.has(rel)&&hash(readFileSync(p))===logoAssets.get(rel);
  const approvedConcept=conceptArtAssets.has(rel)&&hash(readFileSync(p))===conceptArtAssets.get(rel);
  if(!['.ts','.tsx','.css','.html'].includes(extname(p))&&rel!=='app/src/assets/portrait.jpg'&&!approvedManu&&!approvedLogo&&!approvedConcept)problems.push(`Unapproved application file: ${rel}`);
  if(['.ts','.tsx','.css','.html'].includes(extname(p))&&/private-documents|design-inputs|career-sources|\.pdf\b|import\.meta\.glob/.test(readFileSync(p,'utf8')))problems.push(`Private source reference: ${rel}`);
 }
 return problems;
}
export function auditBundle(base=root){
 const problems=[];const dist=resolve(base,'dist');if(!existsSync(resolve(dist,'index.html')))return ['Missing production build'];
 const approved=resolve(base,'app/src/assets/portrait.jpg');const portraitHash=existsSync(approved)?hash(readFileSync(approved)):'';
 const privateFiles=[...walk(resolve(base,'private-documents/career-sources')),...walk(resolve(base,'design-inputs'))].filter(p=>!p.endsWith('portrait-original.jpg'));
 const hashes=new Set(privateFiles.map(p=>hash(readFileSync(p))));
 const draftPath=resolve(base,'private-documents/phase1-preview.json');
 const drafts=existsSync(draftPath)?JSON.parse(readFileSync(draftPath,'utf8')):{experiences:[],projects:[]};
 // Only these project identities and the VIT organization are now approved. Old draft
 // summaries, held identities, exact metric strings and private-source markers remain forbidden.
 const approvedIds=new Set(['transgis','fedguard','campus-events','cell-counter']);
 const forbidden=['__review/manu.jpg','private-documents','design-inputs','career-sources',
  ...drafts.experiences.flatMap(x=>[...(x.id==='campus-events'||x.kind==='lab'||x.organization==='SmartInternz'?[]:[x.organization]),x.summary]),
  ...drafts.projects.flatMap(x=>[...(approvedIds.has(x.id)?[]:[x.name]),x.heading]),
  'DepGraph','Road Damage Detection',
  'credential ID','exam score','verification code',
 ];
 for(const p of walk(dist)){
  const data=readFileSync(p);const ext=extname(p);const rel=relative(dist,p);
  if(!['.html','.js','.css','.jpg','.png','.webp'].includes(ext)&&!['github-activity.json','.nojekyll'].includes(rel))problems.push(`Unexpected release file: ${rel}`);
  if(['.png','.webp'].includes(ext)&&![manuHash,manuChatHash,...logoAssets.values(),...conceptArtAssets.values()].includes(hash(data)))problems.push(`Unapproved release image: ${rel}`);
  if(hashes.has(hash(data)))problems.push(`Private source fingerprint found: ${rel}`);
  if(ext==='.jpg'&&hash(data)!==portraitHash&&![...conceptArtAssets.values()].includes(hash(data)))problems.push(`Unapproved release image: ${rel}`);
  if(['.html','.js','.css'].includes(ext)){const text=data.toString();for(const needle of forbidden)if(text.includes(needle))problems.push(`Draft/private marker in ${rel}: ${needle}`);
   // Generic claim patterns avoid publishing actual withheld evaluation values in audit code.
   if(/(?:accuracy|R²|mean absolute error|MAE)\s*[:=]\s*\d+(?:\.\d+)?\s*%?|\b\d+(?:\.\d+)?\s+(?:reference masks|cells per sample|tools assessed)\b/i.test(text))problems.push(`Unapproved numerical evaluation in ${rel}`);
   const unapprovedEmails=(text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)||[]).filter(email=>email!=='vishnusaipadyala07@gmail.com');
   if(unapprovedEmails.length||/AKIA[0-9A-Z]{16}|-----BEGIN .*PRIVATE KEY-----/.test(text))problems.push(`Contact or secret marker in ${rel}`);
  }
 }
 return problems;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const mode=process.argv[2];const problems=mode==='source'?auditSource():mode==='bundle'?auditBundle():['Expected source or bundle'];
 if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}else console.log(`Privacy ${mode} audit: PASS`);
}
