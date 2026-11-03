const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext();
  const h = await ctx.newPage();
  await h.goto('http://localhost:3000/redeem');
  await h.click('text=I already have an access key');
  const fs=require('fs'); const db=JSON.parse(fs.readFileSync('/home/claude/gamenight/.data/db.json'));
  await h.fill('input', db.licenses[0].key); await h.click('button:has-text("Continue")'); await h.waitForURL('**/dashboard');
  const g = db.games.find(g=>g.format==='board');
  await h.goto('http://localhost:3000/host/'+g.id); await h.click('text=Open the lobby');
  const pin=(await h.locator('[data-testid=pin]').innerText()).trim();
  const p = await ctx.newPage(); p.on('console', m=>console.log('P:', m.text()));
  await p.goto('http://localhost:3000/j/'+pin); await p.fill('input','Ayla'); await p.click('button:has-text("Join the game")');
  await new Promise(r=>setTimeout(r,5000));
  console.log((await p.locator('body').innerText()).slice(0,300));
  await b.close();
})();
