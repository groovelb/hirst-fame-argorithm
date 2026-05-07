import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_PATH = './src/data/hirst/hirst_works.json';
const OUT_DIR = './public/images/hirst';
const FAIL_LOG = './scripts/output/hirst-images-failed.json';
const HASH_BAN_PATH = './scripts/output/hirst-banned-hashes.json';
const UA_BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir('./scripts/output', { recursive: true });

/** 이미 알려진 placeholder/잘못된 결과 hash — 받자마자 폐기 */
let bannedHashes = new Set([
  'f70141e6232eee98a288f598ac13bf36', // Wikipedia "Damien Hirst" portrait page lead 47788b
]);
try {
  const saved = JSON.parse(await fs.readFile(HASH_BAN_PATH, 'utf-8'));
  saved.forEach((h) => bannedHashes.add(h));
} catch {}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const md5 = (buf) => crypto.createHash('md5').update(buf).digest('hex');

/** Wikipedia API: 정확 제목 → page main image */
async function wikiByTitle(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original&pithumbsize=1200&titles=${encodeURIComponent(title)}&redirects=1&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA_BROWSER } });
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

/** Wikimedia Commons: 파일 namespace 검색 */
async function commonsSearch(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=5&gsrsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url|mime&iiurlwidth=1200&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA_BROWSER } });
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

/** Bing 이미지 검색 — m="<json>" 속성에서 murl 추출 */
async function bingImage(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2&first=1&safeSearch=off`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA_BROWSER,
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const candidates = [];
  const re = /m="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const decoded = m[1]
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'");
    try {
      const j = JSON.parse(decoded);
      if (j.murl && /^https?:\/\//.test(j.murl) && /\.(jpe?g|png|webp)(\?|$)/i.test(j.murl)) {
        candidates.push(j.murl);
      }
    } catch {}
  }
  return candidates;
}

/** Google 이미지 검색 — imgurl GET 파라미터 추출 */
async function googleImage(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&safe=off`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA_BROWSER,
      'Accept': 'text/html',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const candidates = [];
  /** Google은 "https://...jpg" 형태로 결과 이미지 URL을 인라인 — JSON 데이터에서 추출 */
  const re = /"(https?:\/\/[^"]+\.(?:jpe?g|png|webp))"/gi;
  let m;
  const seen = new Set();
  while ((m = re.exec(html)) !== null) {
    const u = m[1];
    if (seen.has(u)) continue;
    seen.add(u);
    if (/gstatic\.com/.test(u) && /encrypted-tbn/.test(u)) continue;
    if (/\.google\./.test(u)) continue;
    if (/sprite/i.test(u)) continue;
    candidates.push(u);
    if (candidates.length >= 8) break;
  }
  return candidates;
}

/** 다운로드 + hash 검증 */
async function downloadAndVerify(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA_BROWSER,
      'Referer': 'https://www.bing.com/',
      'Accept': 'image/*,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!/^image\//i.test(ct) && !/octet-stream/i.test(ct)) {
    throw new Error(`bad content-type: ${ct}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error(`too small: ${buf.length}b`);
  const hash = md5(buf);
  if (bannedHashes.has(hash)) throw new Error(`banned hash ${hash.slice(0, 8)}`);
  await fs.writeFile(dest, buf);
  return { size: buf.length, hash };
}

/** 단일 작품 처리 — 다중 후보 시도 */
async function fetchOne(work, idx, total) {
  const filename = path.basename(work.image);
  const dest = path.join(OUT_DIR, filename);

  try {
    const stat = await fs.stat(dest);
    if (stat.size > 3000) {
      const buf = await fs.readFile(dest);
      const h = md5(buf);
      if (!bannedHashes.has(h)) {
        return { status: 'cached', work };
      }
      await fs.unlink(dest);
    }
  } catch {}

  const titleClean = work.title.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  const queryStr = `Damien Hirst "${titleClean}" ${work.year}`;
  const queryStrLoose = `Damien Hirst ${titleClean}`;

  const candidatePromises = await Promise.allSettled([
    bingImage(queryStr),
    bingImage(queryStrLoose),
    googleImage(queryStr),
    commonsSearch(`Hirst ${titleClean}`).then((u) => u ? [u] : null),
    wikiByTitle(work.title).then((u) => u ? [u] : null),
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
    return { status: 'fail', work, reason: 'no-candidates' };
  }

  for (const url of allCandidates.slice(0, 8)) {
    try {
      const result = await downloadAndVerify(url, dest);
      return { status: 'ok', work, source: url, ...result };
    } catch (e) {
      // try next
    }
  }
  return { status: 'fail', work, reason: 'all-candidates-failed', tried: allCandidates.length };
}

/** 동시성 제한 워커 */
async function runPool(items, worker, concurrency = 4) {
  const results = [];
  let cursor = 0;
  const total = items.length;
  async function next() {
    while (cursor < total) {
      const i = cursor++;
      const r = await worker(items[i], i, total);
      results[i] = r;
      const status = r.status === 'ok' ? '✓' : r.status === 'cached' ? '=' : '✗';
      const detail = r.status === 'ok' ? `${(r.size / 1024).toFixed(0)}KB` : (r.reason || '');
      console.log(`[${i + 1}/${total}] ${status} ${r.work.id} ${r.work.title.slice(0, 60)} — ${detail}`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => next()));
  return results;
}

console.log(`Fetching ${data.works.length} works (concurrency=4)...`);
const startAt = Date.now();
const results = await runPool(data.works, fetchOne, 4);

/** 작가 초상 */
const portraitDest = path.join(OUT_DIR, 'hirst-portrait.jpg');
let portraitResult;
try {
  const stat = await fs.stat(portraitDest);
  if (stat.size > 3000) {
    const h = md5(await fs.readFile(portraitDest));
    if (!bannedHashes.has(h)) portraitResult = { status: 'cached' };
    else await fs.unlink(portraitDest);
  }
} catch {}
if (!portraitResult) {
  const candidates = [
    ...(await bingImage('Damien Hirst portrait artist photo') || []),
    ...(await googleImage('Damien Hirst portrait photo artist') || []),
  ];
  for (const u of candidates.slice(0, 5)) {
    try {
      const r = await downloadAndVerify(u, portraitDest);
      portraitResult = { status: 'ok', source: u, ...r };
      break;
    } catch {}
  }
  if (!portraitResult) portraitResult = { status: 'fail' };
}
console.log(`portrait: ${portraitResult.status}`);

const stats = { ok: 0, cached: 0, fail: 0 };
const failures = [];
for (const r of results) {
  stats[r.status]++;
  if (r.status === 'fail') failures.push({ id: r.work.id, title: r.work.title, reason: r.reason, tried: r.tried });
}

await fs.writeFile(FAIL_LOG, JSON.stringify(failures, null, 2));
const elapsedSec = ((Date.now() - startAt) / 1000).toFixed(1);
console.log(`\n=== DONE in ${elapsedSec}s ===`);
console.log(JSON.stringify(stats, null, 2));
console.log(`Portrait: ${portraitResult.status}`);
console.log(`Failures logged: ${FAIL_LOG} (${failures.length} entries)`);
