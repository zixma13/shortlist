// Bundles src/*.js into the single self-contained ../index.html
//   npm run build            minified
//   npm run build:readable   unminified, for debugging
//   npm run build:dev        ../dev.html: unminified, plus the development tools in src/dev.js
import { readFileSync, writeFileSync } from 'node:fs';
import {gzipSync,brotliCompressSync,constants as Z} from 'node:zlib';
import {mkdirSync,copyFileSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const FILES = ['quality.js', 'math.js', 'shaders.js', 'world.js','metrics.js','main.js','audio.js','experience.js']; // concatenation order matters
const dev = process.argv.includes('--dev'), readable = dev || process.argv.includes('--readable');
const out = dev ? 'dev.html' : 'index.html';
// The product already includes the guided tour and measured benchmark; dev stays the readable same runtime.

let js = FILES.map((f) => readFileSync(path.join(here, 'src', f), 'utf8')).join('\n');
const tpl = readFileSync(path.join(here, 'template.html'), 'utf8');
const buildId=createHash('sha256').update(js).update(tpl).digest('hex').slice(0,12);
js="const BUILD_ID='"+buildId+"';\n"+js;
// everything runs inside one async function; startup errors are shown on screen
const wrap = (body) => `(async()=>{${body}\n})().catch(e=>{console.error(e);document.body.className='l e';document.getElementById('s').textContent=(e.cause?'':'Failed to start: ')+e.message});`;

let html;
if (readable) {
  html = tpl.replace('/*SCRIPT*/', () => wrap(js));
} else {
  // shrink the WGSL inside /*wgsl*/ template literals, then minify the JS and the page's CSS
  const minWgsl = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').replace(/ ?([{}()\[\];,:=+\-*\/<>&|!%@]) ?/g, '$1').trim();
  js = js.replace(/\/\*wgsl\*\/`([^`]*)`/g, (_, w) => '`' + minWgsl(w) + '`');
  const code = transformSync(wrap(js), { minify: true, target: 'es2022', legalComments: 'none' }).code.trim();
  const css = (_, s) => '<style>' + transformSync(s, { loader: 'css', minify: true }).code.trim();
  html = tpl.replace(/<style>([^]*?)(?=<\/style>)/, css).replace(/>\s+</g, '><').replace('/*SCRIPT*/', () => code).replace(/<script>\s+/, '<script>').replace(/\s+<\/script>/, '</script>');
}
const license=readFileSync(path.join(here,'..','LICENSE'),'utf8');
html=html.replace('<head>','<head><!--\nTidal Sanctuary. Adapted from Abyssal Garden.\n'+license.replace(/--/g,'- -')+'\n-->');
writeFileSync(path.join(here,'..',out),html);
if(!dev&&!readable){const dist=path.join(here,'..','dist');mkdirSync(dist,{recursive:true});writeFileSync(path.join(dist,'tidal-sanctuary.html'),html);writeFileSync(path.join(dist,'tidal-sanctuary.html.gz'),gzipSync(Buffer.from(html),{level:9}));writeFileSync(path.join(dist,'tidal-sanctuary.html.br'),brotliCompressSync(Buffer.from(html),{params:{[Z.BROTLI_PARAM_QUALITY]:11}}));copyFileSync(path.join(here,'..','LICENSE'),path.join(dist,'LICENSE.txt'));const metrics={buildId,date:'2026-11-17',htmlBytes:Buffer.byteLength(html),gzipBytes:gzipSync(Buffer.from(html),{level:9}).length,brotliBytes:brotliCompressSync(Buffer.from(html),{params:{[Z.BROTLI_PARAM_QUALITY]:11}}).length,runtimeDependencies:0,externalAssets:0};writeFileSync(path.join(dist,'size.json'),JSON.stringify(metrics,null,2)+'\n');console.log(JSON.stringify(metrics));}
const gz = gzipSync(Buffer.from(html), { level: 9 }).length;
console.log(`${out}: ${(Buffer.byteLength(html) / 1024).toFixed(1)} kB${readable ? ' (readable)' : ''}, ${(gz / 1024).toFixed(1)} kB gzipped`);
