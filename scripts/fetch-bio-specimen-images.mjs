import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/**
 * Fetch images for bio-specimen artworks that are not covered by hirst_work_bio_map.
 * Parallel pool across Wikipedia/Commons/Bing/Google, saves to /public/images/hirst/bio/.
 * Emits `src/data/hirst/hirst_bio_artwork_images.json` mapping bio.id → image path.
 */

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public/images/hirst/bio');
const MAP_OUT = path.join(ROOT, 'src/data/hirst/hirst_bio_artwork_images.json');
const FAIL_LOG = path.join(ROOT, 'scripts/output/hirst-bio-images-failed.json');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const TARGETS = [
  { id: 'wrath-2005', title: 'The Wrath of God', year: 2005 },
  { id: 'death-explained-2007', title: 'Death Explained', year: 2007 },
  { id: 'leviathan-2006', title: 'Leviathan', year: 2006 },
  { id: 'pursuit-oblivion-2004', title: 'The Pursuit of Oblivion', year: 2004 },
  { id: 'cock-and-bull-2012', title: 'Cock and Bull', year: 2012 },
  { id: 'incredible-journey-2008', title: 'The Incredible Journey', year: 2008 },
  { id: 'incomplete-truth-2006', title: 'The Incomplete Truth', year: 2006 },
  { id: 'in-out-love-1991-paintings', title: 'In and Out of Love Butterfly Paintings', year: 1991 },
  { id: 'in-out-love-tate-2012', title: 'In and Out of Love Tate Modern restaging', year: 2012 },
];

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(path.dirname(FAIL_LOG), { recursive: true });

const md5 = (buf) => crypto.createHash('md5').update(buf).digest('hex');

async function wikiByTitle(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&pithumbsize=1200&titles=${ encodeURIComponent(title) }&redirects=1&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const j = await res.json();
  const pages = j?.query?.pages;
  if (!pages) return null;
  for (const p of Object.values(pages)) {
    if (p.missing !== undefined) continue;
    if (p.original?.source) return p.original.source;
    if (p.thumbnail?.source) return p.thumbnail.source;
  }
  return null;
}

async function commonsSearch(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch=${ encodeURIComponent(query) }&prop=imageinfo&iiprop=url|mime&iiurlwidth=1200&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const j = await res.json();
  const pages = j?.query?.pages;
  if (!pages) return null;
  const candidates = Object.values(pages)
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean)
    .filter((ii) => /^image\//i.test(ii.mime || ''));
  for (const ii of candidates) {
    if (ii.thumburl) return ii.thumburl;
    if (ii.url) return ii.url;
  }
  return null;
}

async function bingImage(query) {
  const url = `https://www.bing.com/images/search?q=${ encodeURIComponent(query) }&form=HDRSC2&first=1&safeSearch=off`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const out = [];
  const re = /m="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const decoded = m[1]
      .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
    try {
      const j = JSON.parse(decoded);
      if (j.murl && /^https?:\/\//.test(j.murl) && /\.(jpe?g|png|webp)(\?|$)/i.test(j.murl)) {
        out.push(j.murl);
      }
    } catch {}
  }
  return out;
}

async function googleImage(query) {
  const url = `https://www.google.com/search?q=${ encodeURIComponent(query) }&tbm=isch&safe=off`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const out = [];
  const re = /"(https?:\/\/[^"]+\.(?:jpe?g|png|webp))"/gi;
  let mm;
  const seen = new Set();
  while ((mm = re.exec(html)) !== null) {
    const u = mm[1];
    if (seen.has(u)) continue;
    seen.add(u);
    if (/gstatic\.com/.test(u) && /encrypted-tbn/.test(u)) continue;
    if (/\.google\./.test(u)) continue;
    if (/sprite/i.test(u)) continue;
    out.push(u);
    if (out.length >= 8) break;
  }
  return out;
}

async function downloadAndVerify(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Referer': 'https://www.bing.com/',
      'Accept': 'image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${ res.status }`);
  const ct = res.headers.get('content-type') || '';
  if (!/^image\//i.test(ct) && !/octet-stream/i.test(ct)) {
    throw new Error(`bad content-type: ${ ct }`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error(`too small: ${ buf.length }b`);
  await fs.writeFile(dest, buf);
  return { size: buf.length, hash: md5(buf) };
}

function extOf(url) {
  const m = url.match(/\.(jpe?g|png|webp)(\?|$)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function fetchOne(target) {
  const queryStr = `Damien Hirst "${ target.title }" ${ target.year }`;
  const queryStrLoose = `Damien Hirst ${ target.title }`;

  const candidatePromises = await Promise.allSettled([
    bingImage(queryStr),
    bingImage(queryStrLoose),
    googleImage(queryStr),
    commonsSearch(`Hirst ${ target.title }`).then((u) => u ? [u] : null),
    wikiByTitle(target.title).then((u) => u ? [u] : null),
  ]);

  const allCandidates = [];
  for (const r of candidatePromises) {
    if (r.status === 'fulfilled' && r.value) {
      const arr = Array.isArray(r.value) ? r.value : [r.value];
      for (const u of arr) {
        if (u && !allCandidates.includes(u)) allCandidates.push(u);
      }
    }
  }

  if (allCandidates.length === 0) {
    return { status: 'fail', target, reason: 'no-candidates' };
  }

  for (const url of allCandidates.slice(0, 8)) {
    try {
      const dest = path.join(OUT_DIR, `${ target.id }.${ extOf(url) }`);
      const result = await downloadAndVerify(url, dest);
      return { status: 'ok', target, dest, source: url, ...result };
    } catch {}
  }
  return { status: 'fail', target, reason: 'all-candidates-failed', tried: allCandidates.length };
}

async function fetchExisting(target) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const dest = path.join(OUT_DIR, `${ target.id }.${ ext }`);
    try {
      const stat = await fs.stat(dest);
      if (stat.size > 3000) return { status: 'cached', target, dest };
    } catch {}
  }
  return null;
}

console.log(`Fetching ${ TARGETS.length } bio-specimen artworks (parallel)...`);
const startAt = Date.now();

const results = await Promise.all(TARGETS.map(async (target) => {
  const cached = await fetchExisting(target);
  if (cached) return cached;
  return fetchOne(target);
}));

const imageMap = {};
const failures = [];
for (const r of results) {
  const status = r.status === 'ok' ? 'ok' : r.status === 'cached' ? 'cache' : 'fail';
  const detail = r.status === 'ok' ? `${ (r.size / 1024).toFixed(0) }KB` : (r.reason || '');
  console.log(`  ${ status }  ${ r.target.id.padEnd(36) } ${ r.target.title.slice(0, 50) }  ${ detail }`);
  if (r.status === 'ok' || r.status === 'cached') {
    imageMap[r.target.id] = '/' + path.relative(path.join(ROOT, 'public'), r.dest);
  } else {
    failures.push({ id: r.target.id, title: r.target.title, reason: r.reason, tried: r.tried });
  }
}

await fs.writeFile(
  MAP_OUT,
  JSON.stringify(
    {
      meta: {
        title: 'Bio-specimen artwork image map (auto-generated)',
        purpose: 'bio.id → /images/hirst/bio/* 직접 매핑. workBioMap에 없는 bio artwork 보조.',
        asOfDate: new Date().toISOString().slice(0, 10),
      },
      images: imageMap,
    },
    null,
    2,
  ) + '\n',
);
await fs.writeFile(FAIL_LOG, JSON.stringify(failures, null, 2) + '\n');

const elapsedSec = ((Date.now() - startAt) / 1000).toFixed(1);
console.log(`\n=== DONE in ${ elapsedSec }s ===`);
console.log(`ok+cache: ${ Object.keys(imageMap).length }, fail: ${ failures.length }`);
console.log(`Map:      ${ path.relative(ROOT, MAP_OUT) }`);
if (failures.length) console.log(`Failures: ${ path.relative(ROOT, FAIL_LOG) }`);
