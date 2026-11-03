import { chromium } from "/Users/tariksoysal/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import path from "path";

const OUT_DIR = path.resolve(process.cwd(), "public/etsy-assets");
const PDF_PATH = path.join(OUT_DIR, "DigitarMercato_Jolly_Christmas_Complete_Host_Handbook.pdf");

const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Mountains+of+Christmas:wght@700&family=Nunito:wght@600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    body {
      font-family: 'Nunito', sans-serif;
      color: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 1240px;
      height: 1754px;
      background: radial-gradient(ellipse 90% 80% at 50% 30%, #185443, #0B2E24 65%, #06201A 100%);
      padding: 64px 72px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .page:last-child { page-break-after: auto; }
    .candy-top {
      position: absolute; top: 0; left: 0; right: 0; height: 5.5mm;
      background: repeating-linear-gradient(45deg, #D62839, #D62839 14px, #FFFFFF 14px, #FFFFFF 28px, #185443 28px, #185443 42px);
    }
    .candy-bottom {
      position: absolute; bottom: 0; left: 0; right: 0; height: 5.5mm;
      background: repeating-linear-gradient(45deg, #D62839, #D62839 14px, #FFFFFF 14px, #FFFFFF 28px, #185443 28px, #185443 42px);
    }
    .festive { font-family: 'Mountains of Christmas', cursive; font-weight: 700; }
    .ui { font-family: 'Fredoka', sans-serif; font-weight: 700; }
    .badge {
      display: inline-block;
      background: #D62839;
      border: 2px solid #FFFFFF;
      color: #FFFFFF;
      padding: 5px 18px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 900;
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }
    .badge-white {
      display: inline-block;
      background: #FFFFFF;
      color: #C1121F;
      padding: 5px 18px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 900;
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }
    .card-white {
      background: #FFFFFF;
      color: #11221B;
      border-radius: 20px;
      padding: 20px 24px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.28);
    }
    .card-red {
      background: linear-gradient(180deg, #E63946, #B81424);
      border: 3px solid #FFFFFF;
      color: #FFFFFF;
      border-radius: 20px;
      padding: 22px 26px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.3);
    }
    .card-green {
      background: #0E3B2E;
      border: 2.5px solid rgba(255,255,255,0.35);
      color: #FFFFFF;
      border-radius: 20px;
      padding: 18px 22px;
    }
    .num-circle {
      width: 44px; height: 44px;
      border-radius: 14px;
      background: #D62839;
      color: #FFFFFF;
      font-family: 'Fredoka', sans-serif;
      font-size: 24px;
      font-weight: 700;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      font-weight: 800;
      color: #FFE5E8;
      border-top: 1.5px solid rgba(255,255,255,0.2);
      padding-top: 8px;
      margin-bottom: 2mm;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: WELCOME & HOW TO UNLOCK ==================== -->
  <div class="page">
    <div class="candy-top"></div>

    <div style="text-align:center; margin-top:2mm;">
      <span class="badge">🎄 PAGE 1 OF 5 · SUPER EASY START GUIDE 🎅</span>
      <h1 class="festive" style="font-size: 52px; margin-top: 6px; line-height: 1.02;">
        Welcome to Jolly Game Night!
      </h1>
      <p style="font-size: 15px; color: #FFE5E8; font-weight: 700; margin-top: 4px;">
        Follow this super simple picture guide — you'll be hosting your Christmas party in 2 minutes!
      </p>
    </div>

    <!-- Big Clickable Activation Box -->
    <div class="card-red" style="text-align:center;">
      <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase;">
        👇 STEP 1: CLICK THIS BUTTON (OR TYPE IT IN YOUR INTERNET BROWSER) 👇
      </div>
      <div style="margin: 12px 0;">
        <a href="https://christmasparty.live/redeem" style="display:inline-block; background:#FFFFFF; color:#C1121F; text-decoration:none; font-size:28px; font-weight:900; padding:12px 34px; border-radius:999px; box-shadow: 0 8px 20px rgba(0,0,0,0.25);">
          https://christmasparty.live/redeem
        </a>
      </div>
      <div style="font-size: 14px; font-weight: 800; color: #FFF5F6;">
        💡 Want to practice first? Click <a href="https://christmasparty.live/demo" style="color:#fff; text-decoration:underline;">christmasparty.live/demo</a> to play our practice simulator!
      </div>
    </div>

    <!-- Visual Explanation: Where is my Etsy Order Number? -->
    <div class="card-white">
      <h2 class="ui" style="font-size: 21px; color: #0B2E24; margin-bottom: 10px;">
        🔍 "Where Do I Find My Etsy Order Number?" (Easy Picture Guide)
      </h2>
      <p style="font-size: 14px; color: #2C3E35; font-weight: 700; margin-bottom: 14px;">
        When you open <b>christmasparty.live/redeem</b>, it will ask for your <b>Etsy Order Number</b>. It is a <b>10-digit number</b> (like <b style="color:#D62839;">3456789012</b>). Here are 2 easy places to find it:
      </p>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        <div style="background:#FFF5F6; border:2.5px solid #D62839; border-radius:16px; padding:14px;">
          <div class="ui" style="font-size:16px; color:#D62839;">📧 Place #1: Your Etsy Email</div>
          <p style="font-size:13px; color:#11221B; font-weight:700; margin-top:4px;">
            Check your email for <b>"Your Etsy Purchase from DigitarMercato"</b>. Right at the top it says:
          </p>
          <div style="background:#fff; border:2px dashed #D62839; border-radius:10px; padding:8px 12px; margin-top:8px; font-size:13px; font-weight:900; color:#0B2E24;">
            Receipt # <span style="background:#FFE5E8; color:#D62839; padding:2px 6px; border-radius:6px;">3456789012</span> 👈 Copy this!
          </div>
        </div>

        <div style="background:#E6F4EE; border:2.5px solid #185443; border-radius:16px; padding:14px;">
          <div class="ui" style="font-size:16px; color:#185443;">🛍️ Place #2: Etsy "Purchases" Page</div>
          <p style="font-size:13px; color:#11221B; font-weight:700; margin-top:4px;">
            On Etsy.com, click your profile picture ➔ <b>Purchases and reviews</b>. Look right next to your order:
          </p>
          <div style="background:#fff; border:2px dashed #185443; border-radius:10px; padding:8px 12px; margin-top:8px; font-size:13px; font-weight:900; color:#0B2E24;">
            Order #<span style="background:#E6F4EE; color:#185443; padding:2px 6px; border-radius:6px;">3456789012</span> 👈 Copy this!
          </div>
        </div>
      </div>
    </div>

    <!-- Secret Access Key Tip -->
    <div class="card-green" style="display:flex; align-items:center; gap:16px;">
      <div style="font-size:42px;">🔑</div>
      <div>
        <div class="ui" style="font-size:18px; color:#FFFFFF;">What Happens After I Enter My Order Number?</div>
        <p style="font-size:13.5px; color:#FFE5E8; font-weight:700; margin-top:3px;">
          Your private <b>Christmas Game Studio</b> opens immediately! It also gives you a personal <b>Access Key</b> (like <code>XMAS-ABCD-1234</code>) so you can log in from any other laptop or TV anytime!
        </p>
      </div>
    </div>

    <div class="footer">
      <span>🎄 Jolly Christmas Game Night · DigitarMercato</span>
      <span>Page 1 of 5 · Getting Started</span>
    </div>
    <div class="candy-bottom"></div>
  </div>

  <!-- ==================== PAGE 2: HOW TO PICK OR CREATE A GAME ==================== -->
  <div class="page">
    <div class="candy-top"></div>

    <div style="text-align:center; margin-top:2mm;">
      <span class="badge-white">🎮 PAGE 2 OF 5 · INSIDE YOUR GAME STUDIO</span>
      <h1 class="festive" style="font-size: 50px; margin-top: 6px; line-height: 1.02;">
        How to Pick or Create a Game in 3 Clicks!
      </h1>
      <p style="font-size: 15px; color: #FFE5E8; font-weight: 700; margin-top: 4px;">
        You don't need to write a single question if you don't want to — everything is ready for you!
      </p>
    </div>

    <!-- 3 Easy Steps Inside Dashboard -->
    <div class="card-white" style="display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; gap:16px; align-items:flex-start; border-bottom:2px dashed #E2ECE7; padding-bottom:14px;">
        <div class="num-circle">1</div>
        <div>
          <div class="ui" style="font-size:19px; color:#D62839;">Choose a Ready-to-Play Pack OR Pick a Game Style!</div>
          <p style="font-size:13.5px; color:#2C3E35; font-weight:700; margin-top:4px; line-height:1.45;">
            Inside your Dashboard, you'll see a big red box asking: <b>"What kind of Christmas game do you want to host?"</b><br/>
            • Simply click the type of game you want (like <b>🎄 Classic Trivia</b>, <b>😂 Funny Christmas Facts</b>, <b>🎬 Christmas Movies</b>, <b>🔔 Top Answers</b>, or <b>🍿 Emoji Movies</b>).<br/>
            • Pick how many questions you want (5, 10, 15, or 20) and click <b>"Create & Open Game ▶"</b>!
          </p>
        </div>
      </div>

      <div style="display:flex; gap:16px; align-items:flex-start; border-bottom:2px dashed #E2ECE7; padding-bottom:14px;">
        <div class="num-circle" style="background:#185443;">2</div>
        <div>
          <div class="ui" style="font-size:19px; color:#185443;">Use the Magic "Christmas Question Generator" (Optional!)</div>
          <p style="font-size:13.5px; color:#2C3E35; font-weight:700; margin-top:4px; line-height:1.45;">
            When you open a game to edit, you'll see the <b>🎄 Instant Christmas Question Generator</b> at the top.<br/>
            • Want to add 10 hilarious <b>"Would You Rather"</b> or <b>"Most Likely To"</b> questions? Just click that button and click <b>"+ Add Questions"</b>!<br/>
            • Want to write a funny question about Uncle Bob or your boss? Just click any question box and type whatever you want — it saves automatically!
          </p>
        </div>
      </div>

      <div style="display:flex; gap:16px; align-items:flex-start;">
        <div class="num-circle">3</div>
        <div>
          <div class="ui" style="font-size:19px; color:#D62839;">Click the Red "Host Live ▶" Button!</div>
          <p style="font-size:13.5px; color:#2C3E35; font-weight:700; margin-top:4px; line-height:1.45;">
            When you're ready to play, click <b>"Host Live ▶"</b>. Your screen will transform into the <b>Big Screen TV Lobby</b> with snowfall, festive music chimes, a <b>4-digit Room PIN</b>, and a <b>QR Code</b>!
          </p>
        </div>
      </div>
    </div>

    <!-- All 12 Ready-Made Packs Cheat Sheet -->
    <div class="card-red">
      <div class="ui" style="font-size:19px; text-align:center; margin-bottom:10px;">
        🎁 All 12 Ready-to-Play Packs Waiting in Your Dashboard:
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; font-size:12.5px; font-weight:800;">
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🎄 1. Jolly Holiday Trivia</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🎬 2. Christmas Movie Buffs</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🎶 3. Festive Tunes & Carols</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🧒 4. Kids' North Pole Quiz</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🎁 5. Big Holiday Quiz Board</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🔔 6. Survey Says: Christmas!</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">👨‍👩‍👧‍👦 7. Family Holiday Top Answers</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🍿 8. Emoji Xmas Movies</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🎵 9. Emoji Holiday Songs</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🕯️ 10. Cozy Xmas Riddles</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🎤 11. Finish the Lyric!</div>
        <div style="background:rgba(255,255,255,0.18); padding:8px 10px; border-radius:10px;">🎅 12. Who Am I? North Pole</div>
      </div>
    </div>

    <div class="footer">
      <span>🎄 Jolly Christmas Game Night · DigitarMercato</span>
      <span>Page 2 of 5 · Creating & Picking Games</span>
    </div>
    <div class="candy-bottom"></div>
  </div>

  <!-- ==================== PAGE 3: HOW PLAYERS JOIN ON THEIR PHONES ==================== -->
  <div class="page">
    <div class="candy-top"></div>

    <div style="text-align:center; margin-top:2mm;">
      <span class="badge">📱 PAGE 3 OF 5 · HOW GUESTS JOIN THE PARTY</span>
      <h1 class="festive" style="font-size: 50px; margin-top: 6px; line-height: 1.02;">
        How Players Join From Their Phones!
      </h1>
      <p style="font-size: 15px; color: #FFE5E8; font-weight: 700; margin-top: 4px;">
        No apps to download! No accounts to create! Even kids & grandparents join in 10 seconds.
      </p>
    </div>

    <!-- 3 Comic Panels -->
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px;">
      <div class="card-white" style="text-align:center; padding:18px;">
        <div style="background:#D62839; color:#fff; display:inline-block; padding:4px 14px; border-radius:999px; font-size:12px; font-weight:900;">STEP 1</div>
        <div style="font-size:52px; margin:10px 0;">📷 ➔ 📺</div>
        <h3 class="ui" style="font-size:18px; color:#0B2E24;">Scan the QR Code</h3>
        <p style="font-size:13px; color:#2C3E35; font-weight:700; margin-top:6px; line-height:1.4;">
          Players open the regular <b>Camera App</b> on their iPhone or Android phone, point it at the QR code on your TV, and tap the link that pops up!
        </p>
      </div>

      <div class="card-red" style="text-align:center; padding:18px;">
        <div style="background:#FFFFFF; color:#D62839; display:inline-block; padding:4px 14px; border-radius:999px; font-size:12px; font-weight:900;">STEP 2</div>
        <div style="font-size:52px; margin:10px 0;">🎅🦌⛄🍪</div>
        <h3 class="ui" style="font-size:18px; color:#FFFFFF;">Pick a Cartoon Avatar</h3>
        <p style="font-size:13px; color:#FFF5F6; font-weight:700; margin-top:6px; line-height:1.4;">
          Players tap their favorite character from <b>20 Cartoon Holiday Avatars</b> (or tap 🎲 Random) and type their funny nickname!
        </p>
      </div>

      <div class="card-white" style="text-align:center; padding:18px;">
        <div style="background:#185443; color:#fff; display:inline-block; padding:4px 14px; border-radius:999px; font-size:12px; font-weight:900;">STEP 3</div>
        <div style="font-size:52px; margin:10px 0;">🎉📺🔔</div>
        <h3 class="ui" style="font-size:18px; color:#0B2E24;">You're on the Big Screen!</h3>
        <p style="font-size:13px; color:#2C3E35; font-weight:700; margin-top:6px; line-height:1.4;">
          As soon as they tap <b>"Join the Lobby ▶"</b>, their cartoon character pops up live on the TV screen!
        </p>
      </div>
    </div>

    <!-- Individual vs Team Mode Explanation -->
    <div class="card-white">
      <h2 class="ui" style="font-size:20px; color:#0B2E24; margin-bottom:8px;">
        🤝 Playing Solo vs. Playing in Holiday Teams!
      </h2>
      <p style="font-size:13.5px; color:#2C3E35; font-weight:700; margin-bottom:12px;">
        While everyone is joining the TV Lobby, the Host can choose between two fun ways to keep score:
      </p>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
        <div style="background:#FFF5F6; border:2px solid #D62839; border-radius:14px; padding:12px 14px;">
          <div class="ui" style="font-size:16px; color:#D62839;">👤 Every Elf for Themselves (Solo)</div>
          <p style="font-size:12.5px; color:#11221B; font-weight:700; margin-top:4px;">
            Every player competes for their own score! Great for groups of 2 to 25 players.
          </p>
        </div>
        <div style="background:#E6F4EE; border:2px solid #185443; border-radius:14px; padding:12px 14px;">
          <div class="ui" style="font-size:16px; color:#185443;">👨‍👩‍👧‍👦 Holiday Teams Mode (2, 3, or 4 Teams)</div>
          <p style="font-size:12.5px; color:#11221B; font-weight:700; margin-top:4px;">
            Turn on <b>Teams</b> in the Lobby (Mistletoe, Tinsel, Gingerbread, Holly)! Players tap which team they are on from their phone.
          </p>
        </div>
      </div>
    </div>

    <!-- Backup Join Method -->
    <div class="card-green">
      <div class="ui" style="font-size:17px;">💡 What if someone's camera can't scan QR codes?</div>
      <p style="font-size:13px; color:#FFE5E8; font-weight:700; margin-top:4px;">
        No problem at all! They can just type <b>christmasparty.live/join</b> into their phone browser and enter the <b>4-digit Room PIN</b> shown on the TV!
      </p>
    </div>

    <div class="footer">
      <span>🎄 Jolly Christmas Game Night · DigitarMercato</span>
      <span>Page 3 of 5 · How Players Join</span>
    </div>
    <div class="candy-bottom"></div>
  </div>

  <!-- ==================== PAGE 4: HOW TO PLAY ALL 4 GAME MODES ==================== -->
  <div class="page">
    <div class="candy-top"></div>

    <div style="text-align:center; margin-top:2mm;">
      <span class="badge-white">🏆 PAGE 4 OF 5 · GAME SHOW RULES CHEAT SHEET</span>
      <h1 class="festive" style="font-size: 48px; margin-top: 6px; line-height: 1.02;">
        How the 4 Game Modes Work!
      </h1>
      <p style="font-size: 14.5px; color: #FFE5E8; font-weight: 700; margin-top: 4px;">
        Here is what happens on the TV and on Players' Phones in each mode:
      </p>
    </div>

    <div style="display:flex; flex-direction:column; gap:13px;">
      <!-- Mode 1 -->
      <div class="card-white" style="padding:16px 20px; display:flex; gap:16px; align-items:center;">
        <div style="width:60px; height:60px; border-radius:16px; background:#D62839; color:#fff; font-size:34px; display:grid; place-items:center; flex-shrink:0;">🎄</div>
        <div>
          <div class="ui" style="font-size:18px; color:#D62839;">Mode 1: Live Multiple-Choice Quiz (SPEED-BONUS)</div>
          <p style="font-size:13px; color:#11221B; font-weight:700; margin-top:3px; line-height:1.4;">
            • <b>Players:</b> Look at the question on the TV, then tap one of the 4 colored buttons (🎄 🎁 ⭐ 🔔) on your phone before the timer runs out! Answering faster gives extra points!<br/>
            • <b>Host:</b> Just click <b>"Next Question ▶"</b> and <b>"Leaderboard ▶"</b> — points are calculated automatically!
          </p>
        </div>
      </div>

      <!-- Mode 2 -->
      <div class="card-red" style="padding:16px 20px; display:flex; gap:16px; align-items:center;">
        <div style="width:60px; height:60px; border-radius:16px; background:#FFFFFF; color:#D62839; font-size:34px; display:grid; place-items:center; flex-shrink:0;">🔔</div>
        <div>
          <div class="ui" style="font-size:18px; color:#FFFFFF;">Mode 2: Holiday Top Answers ("Top Answers")</div>
          <p style="font-size:13px; color:#FFF5F6; font-weight:700; margin-top:3px; line-height:1.4;">
            • <b>Players:</b> Tap the big red <b>BUZZ!</b> button on your phone to answer first, then guess what the most popular survey answers are!<br/>
            • <b>Host:</b> When a player guesses right, click that number tile (1, 2, 3...) on the TV to flip it open and add points to the Bank! If they guess wrong, click <b>"✕ Strike"</b>. At the end of the round, click <b>"Bank to Team"</b> to award the points!
          </p>
        </div>
      </div>

      <!-- Mode 3 -->
      <div class="card-white" style="padding:16px 20px; display:flex; gap:16px; align-items:center;">
        <div style="width:60px; height:60px; border-radius:16px; background:#185443; color:#fff; font-size:34px; display:grid; place-items:center; flex-shrink:0;">🎁</div>
        <div>
          <div class="ui" style="font-size:18px; color:#185443;">Mode 3: Christmas Category Quiz Board</div>
          <p style="font-size:13px; color:#11221B; font-weight:700; margin-top:3px; line-height:1.4;">
            • <b>Host:</b> Click any point box on the TV grid (e.g., <i>"Xmas Movies for 200"</i>) to open the clue.<br/>
            • <b>Players:</b> Hit the giant red <b>BUZZ!</b> button on your phone! The TV shows whose finger was fastest and locks everyone else out. Say your answer out loud!<br/>
            • <b>Host:</b> Click <b>"✓ Correct"</b> (adds points automatically!) or <b>"✕ Wrong"</b> (lets the next person in line try!).
          </p>
        </div>
      </div>

      <!-- Mode 4 -->
      <div class="card-red" style="padding:16px 20px; display:flex; gap:16px; align-items:center;">
        <div style="width:60px; height:60px; border-radius:16px; background:#FFFFFF; color:#185443; font-size:34px; display:grid; place-items:center; flex-shrink:0;">🎅</div>
        <div>
          <div class="ui" style="font-size:18px; color:#FFFFFF;">Mode 4: Emoji Puzzles, Riddles & Song Buzzer</div>
          <p style="font-size:13px; color:#FFF5F6; font-weight:700; margin-top:3px; line-height:1.4;">
            • <b>Players:</b> Look at the Emoji Movie/Song puzzle, riddle, or lyric on the TV. As soon as you know it, smash <b>BUZZ!</b> on your phone and shout the answer!<br/>
            • <b>Host:</b> Click <b>"✓ Correct (+100)"</b> to give them the points, or <b>"Reveal Answer"</b> to show the solution on TV!
          </p>
        </div>
      </div>
    </div>

    <div class="footer">
      <span>🎄 Jolly Christmas Game Night · DigitarMercato</span>
      <span>Page 4 of 5 · Game Rules Cheat Sheet</span>
    </div>
    <div class="candy-bottom"></div>
  </div>

  <!-- ==================== PAGE 5: TV & ZOOM SETUP + HELP ==================== -->
  <div class="page">
    <div class="candy-top"></div>

    <div style="text-align:center; margin-top:2mm;">
      <span class="badge">📺 PAGE 5 OF 5 · TV SETUP & QUICK HELP</span>
      <h1 class="festive" style="font-size: 50px; margin-top: 6px; line-height: 1.02;">
        How to Put the Game on Your TV or Zoom!
      </h1>
      <p style="font-size: 14.5px; color: #FFE5E8; font-weight: 700; margin-top: 4px;">
        Pick whichever option is easiest for your house, classroom, or office:
      </p>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
      <div class="card-white" style="padding:18px;">
        <div style="font-size:36px;">💻 🔌 📺</div>
        <h3 class="ui" style="font-size:18px; color:#0B2E24; margin-top:4px;">Option 1: Laptop + HDMI Cable</h3>
        <p style="font-size:13px; color:#2C3E35; font-weight:700; margin-top:4px; line-height:1.4;">
          Plug an HDMI cable from your laptop into your TV. Open <b>christmasparty.live</b> on your laptop and press <b>F11</b> for full-screen!
        </p>
      </div>

      <div class="card-red" style="padding:18px;">
        <div style="font-size:36px;">📡 🍎 📺</div>
        <h3 class="ui" style="font-size:18px; color:#FFFFFF; margin-top:4px;">Option 2: Wireless AirPlay / Cast</h3>
        <p style="font-size:13px; color:#FFF5F6; font-weight:700; margin-top:4px; line-height:1.4;">
          On a Mac or iPad, click <b>Screen Mirroring</b> to beam your screen to your Apple TV or Smart TV. On Windows/Chrome, click <b>Cast...</b>!
        </p>
      </div>

      <div class="card-red" style="padding:18px;">
        <div style="font-size:36px;">🌐 📺 🎮</div>
        <h3 class="ui" style="font-size:18px; color:#FFFFFF; margin-top:4px;">Option 3: Smart TV Web Browser</h3>
        <p style="font-size:13px; color:#FFF5F6; font-weight:700; margin-top:4px; line-height:1.4;">
          Open the built-in internet browser on your Samsung, LG, Sony, or Fire TV and type <b>christmasparty.live</b> directly!
        </p>
      </div>

      <div class="card-white" style="padding:18px;">
        <div style="font-size:36px;">🎥 🌍 💬</div>
        <h3 class="ui" style="font-size:18px; color:#0B2E24; margin-top:4px;">Option 4: Zoom / Microsoft Teams</h3>
        <p style="font-size:13px; color:#2C3E35; font-weight:700; margin-top:4px; line-height:1.4;">
          Hosting a virtual party? Click <b>Share Screen</b> in Zoom/Teams (check the <b>"Share computer sound"</b> box) and share your browser window!
        </p>
      </div>
    </div>

    <!-- Troubleshooting FAQ Box -->
    <div class="card-white">
      <h2 class="ui" style="font-size:19px; color:#D62839; margin-bottom:8px;">
        🛠️ Quick Answers to Common Questions
      </h2>
      <div style="font-size:13px; color:#11221B; font-weight:700; line-height:1.5; display:flex; flex-direction:column; gap:8px;">
        <div>
          <b>❓ "What if a player accidentally closes their phone browser?"</b><br/>
          👉 Just have them scan the QR code again! The game remembers their name, cartoon avatar, and score automatically!
        </div>
        <div>
          <b>❓ "Can I manually add or subtract bonus points for a player or team?"</b><br/>
          👉 Yes! On the right side of the TV Host screen, you'll see the <b>Scores</b> box with <b>+</b> and <b>−</b> buttons next to every player/team.
        </div>
        <div>
          <b>❓ "Need help with your Etsy Order Number?"</b><br/>
          👉 Message us anytime on Etsy at <b>DigitarMercato</b> and we'll help you out right away! Merry Christmas! 🎄🎅
        </div>
      </div>
    </div>

    <div class="footer">
      <span>🎄 Jolly Christmas Game Night · DigitarMercato</span>
      <span>Page 5 of 5 · TV Setup & Help</span>
    </div>
    <div class="candy-bottom"></div>
  </div>

</body>
</html>`;

async function main() {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1.5 });
  await page.setContent(HTML, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const pages = await page.locator(".page").all();
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: path.join(OUT_DIR, `_hb_page_${i + 1}.png`), type: "png" });
  }
  await browser.close();
  console.log("Rendered 5 handbook pages to PNG!");
}

main();
