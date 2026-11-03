// End-to-end: redeem -> template -> host lobby -> 3 phones -> play MC, Board, Top
const { chromium } = require('playwright');
const BASE = 'http://localhost:3000';
const shot = (p, n) => p.screenshot({ path: `/home/claude/gamenight/qa/${n}.png` });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const host = await ctx.newPage();
  host.on('pageerror', e => console.log('HOST ERR', e.message));
  await host.goto(BASE + '/redeem');
  await host.fill('input[inputmode=numeric]', '1000000001');
  await host.fill('input[type=email]', 'test@example.com');
  await host.click('button:has-text("Continue")');
  await host.waitForURL('**/dashboard**');
  await sleep(800);
  await shot(host, '01_dashboard');

  async function playTemplate(title) {
    await host.goto(BASE + '/dashboard');
    await host.click(`button:has-text("${title}")`);
    await host.waitForURL('**/edit/**');
    await sleep(800);
    const id = host.url().split('/edit/')[1];
    return id;
  }
  async function phones(pin, names, teamIdx) {
    const ps = [];
    for (let i = 0; i < names.length; i++) {
      const p = await ctx.newPage();
      await p.setViewportSize({ width: 390, height: 780 });
      p.on('pageerror', e => console.log('PHONE ERR', e.message));
      await p.goto(`${BASE}/j/${pin}`);
      await p.fill('input', names[i]);
      await p.click('button:has-text("Join the game")');
      if (teamIdx) {
        await p.waitForSelector('text=Pick your team', { timeout: 15000 }).catch(async (e) => { await shot(p, 'ERR_phone'); console.log(await p.locator('body').innerText()); throw e; });
        await p.locator('button').nth(teamIdx[i]).click();
      }
      ps.push(p);
    }
    return ps;
  }

  // ---------------- MC
  let id = await playTemplate('Christmas Around the World');
  await shot(host, '02_editor_mc');
  await host.goto(`${BASE}/host/${id}`);
  await host.click('text=Open the lobby');
  const pin = (await host.locator('[data-testid=pin]').innerText()).trim();
  console.log('MC pin', pin);
  let ps = await phones(pin, ['Ayla', 'Mert', 'Jess']);
  await sleep(1500);
  await shot(host, '03_lobby');
  await shot(ps[0], '04_phone_lobby');
  await host.click('[data-testid=start]');
  await sleep(1200);
  await shot(ps[0], '05_phone_mc_q');
  await ps[0].click('[data-testid=opt-0]');   // Spain correct
  await sleep(400);
  await ps[1].click('[data-testid=opt-1]');
  await sleep(300);
  await shot(host, '06_host_mc_q');
  await ps[2].click('[data-testid=opt-0]');
  await sleep(1500);
  await shot(host, '07_host_mc_reveal');
  await shot(ps[0], '08_phone_mc_right');
  await shot(ps[1], '09_phone_mc_wrong');
  await host.click('[data-testid=next]');
  await sleep(500);
  await shot(host, '10_host_leaderboard');
  await host.click('text=Finish game');
  await sleep(1200);
  await shot(host, '11_podium');
  await shot(ps[0], '12_phone_end');
  for (const p of ps) await p.close();

  // ---------------- Board (teams)
  id = await playTemplate('Christmas Quiz Board');
  await host.goto(`${BASE}/host/${id}`);
  await host.click('text=Open the lobby');
  const pin2 = (await host.locator('[data-testid=pin]').innerText()).trim();
  ps = await phones(pin2, ['Ayla', 'Mert'], [0, 1]);
  await sleep(1500);
  await shot(host, '13_board_lobby');
  await host.click('[data-testid=start]');
  await sleep(600);
  await shot(host, '14_board');
  await host.click('[data-testid=tile-1-2]');
  await sleep(1200);
  await shot(ps[1], '15_phone_buzz');
  await ps[1].click('[data-testid=buzz]');
  await sleep(300);
  await ps[0].click('[data-testid=buzz]').catch(() => {});
  await sleep(1200);
  await shot(host, '16_board_buzzed');
  await shot(ps[1], '17_phone_first');
  await host.click('[data-testid=right]');
  await sleep(800);
  await shot(host, '18_board_answer');
  await host.click('[data-testid=back]');
  await sleep(500);
  await shot(host, '19_board_used');
  for (const p of ps) await p.close();

  // ---------------- Top answers
  id = await playTemplate('Holiday Top Answers');
  await host.goto(`${BASE}/host/${id}`);
  await host.click('text=Open the lobby');
  const pin3 = (await host.locator('[data-testid=pin]').innerText()).trim();
  ps = await phones(pin3, ['Ayla', 'Mert'], [0, 1]);
  await sleep(1500);
  await host.click('[data-testid=start]');
  await sleep(800);
  await ps[0].click('[data-testid=buzz]');
  await sleep(800);
  await host.click('[data-testid=ans-0]');
  await host.click('[data-testid=ans-2]');
  await host.click('[data-testid=strike]');
  await sleep(250);
  await shot(host, '20_top_strike');
  await sleep(1300);
  await host.click('[data-testid=bank-0]');
  await sleep(600);
  await shot(host, '21_top_banked');
  console.log('Team Holly score:', await host.locator('[data-testid="score-Team Holly"]').innerText());

  // ---------------- mobile landing
  const m = await ctx.newPage();
  await m.setViewportSize({ width: 390, height: 844 });
  await m.goto(BASE + '/');
  await shot(m, '22_landing_mobile');
  await host.goto(BASE + '/');
  await shot(host, '23_landing');
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
