import https from 'https';

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Atlas/1.0' }, timeout: 10000 }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error('parse')); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

const articles = ['GeoCities', 'Napster', 'Myspace', 'Yahoo!', 'Spotify', 'Slashdot', 'Blogger_(service)', 'Newgrounds'];
for (const title of articles) {
  await new Promise(r => setTimeout(r, 1500));
  try {
    const data = await get(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`);
    const items = data.items?.filter(i => i.type === 'image' && i.srcset) ?? [];
    const shots = items.filter(i =>
      i.caption?.html?.toLowerCase().includes('screenshot') ||
      i.title?.toLowerCase().includes('screenshot') ||
      i.title?.toLowerCase().includes('homepage') ||
      i.title?.toLowerCase().includes('interface')
    );
    console.log(`\n=== ${title} ===`);
    const show = shots.length > 0 ? shots : items.slice(0, 3);
    for (const img of show.slice(0, 4)) {
      const best = img.srcset?.[img.srcset.length - 1]?.src ?? img.src;
      console.log(`  [${img.title}]\n    ${best?.slice(0, 120)}`);
    }
  } catch(e) {
    console.log(`  ${title}: error ${e.message}`);
  }
}
