import { chromium } from "/Users/tariksoysal/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUT_DIR = path.resolve(process.cwd(), "public/etsy-assets");
const IMG_DIR = path.join(OUT_DIR, "images");
const VID_DIR = path.join(OUT_DIR, "videos");
const FRAMES_DIR = path.join(OUT_DIR, "_frames");

fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(VID_DIR, { recursive: true });
fs.mkdirSync(FRAMES_DIR, { recursive: true });

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Mountains+of+Christmas:wght@700&family=Nunito:wght@600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 2400px;
    height: 2000px;
    font-family: 'Nunito', sans-serif;
    background: radial-gradient(ellipse 90% 80% at 50% 35%, #185443, #0B2E24 60%, #06201A 100%);
    color: #FFFFFF;
    overflow: hidden;
    position: relative;
  }
  .snow {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.45;
    background-image:
      radial-gradient(4px 4px at 10% 15%, #fff 50%, transparent 51%),
      radial-gradient(3px 3px at 25% 65%, #fff 50%, transparent 51%),
      radial-gradient(5px 5px at 42% 25%, rgba(255,255,255,.85) 50%, transparent 51%),
      radial-gradient(3px 3px at 65% 12%, #fff 50%, transparent 51%),
      radial-gradient(4px 4px at 82% 58%, #fff 50%, transparent 51%),
      radial-gradient(3px 3px at 92% 22%, #fff 50%, transparent 51%),
      radial-gradient(5px 5px at 15% 85%, rgba(255,255,255,.8) 50%, transparent 51%),
      radial-gradient(4px 4px at 55% 88%, #fff 50%, transparent 51%);
    background-size: 600px 600px;
  }
  .frame-border {
    position: absolute; inset: 36px;
    border: 4px solid rgba(255,255,255,0.22);
    border-radius: 48px;
    pointer-events: none;
  }
  .candy-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 22px;
    background: repeating-linear-gradient(45deg, #D62839, #D62839 30px, #FFFFFF 30px, #FFFFFF 60px, #185443 60px, #185443 90px);
  }
  .candy-bar-bottom {
    position: absolute; bottom: 0; left: 0; right: 0; height: 22px;
    background: repeating-linear-gradient(45deg, #D62839, #D62839 30px, #FFFFFF 30px, #FFFFFF 60px, #185443 60px, #185443 90px);
  }
  .wrap {
    position: relative; z-index: 2;
    width: 100%; height: 100%;
    padding: 85px 100px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .badge-red {
    display: inline-flex; align-items: center; gap: 14px;
    background: linear-gradient(180deg, #E63946, #C1121F);
    color: #fff;
    padding: 16px 38px;
    border-radius: 999px;
    font-weight: 900;
    font-size: 28px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 3px solid rgba(255,255,255,0.5);
    box-shadow: 0 12px 30px rgba(193,18,31,0.45);
  }
  .badge-white {
    display: inline-flex; align-items: center; gap: 14px;
    background: #FFFFFF;
    color: #C1121F;
    padding: 14px 34px;
    border-radius: 999px;
    font-weight: 900;
    font-size: 26px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  }
  .title-festive {
    font-family: 'Mountains of Christmas', cursive;
    font-weight: 700;
    line-height: 1.02;
    text-shadow: 0 8px 24px rgba(0,0,0,0.45);
  }
  .title-ui {
    font-family: 'Fredoka', sans-serif;
    font-weight: 700;
    line-height: 1.1;
  }
  .card-white {
    background: #FFFFFF;
    color: #11221B;
    border-radius: 36px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.35);
    border: 4px solid rgba(255,255,255,0.9);
  }
  .card-glass {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    border: 3px solid rgba(255,255,255,0.25);
    border-radius: 36px;
    color: #FFFFFF;
  }
  .card-red {
    background: linear-gradient(180deg, #E63946, #B81424);
    border: 4px solid #FFFFFF;
    border-radius: 36px;
    color: #FFFFFF;
    box-shadow: 0 20px 50px rgba(184,20,36,0.5);
  }
  .tv-mockup {
    background: #06201A;
    border: 14px solid #1E2925;
    outline: 6px solid rgba(255,255,255,0.35);
    border-radius: 38px;
    box-shadow: 0 35px 80px rgba(0,0,0,0.6);
    overflow: hidden;
  }
  .phone-mockup {
    background: #0B2E24;
    border: 12px solid #111815;
    outline: 5px solid rgba(255,255,255,0.4);
    border-radius: 54px;
    box-shadow: 0 30px 70px rgba(0,0,0,0.65);
    overflow: hidden;
  }
  .footer-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(0,0,0,0.35);
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 999px;
    padding: 20px 44px;
    font-size: 26px;
    font-weight: 800;
  }
`;

const SLIDES = [
  // 1. HERO MAIN THUMBNAIL
  {
    name: "01-hero-main-thumbnail.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">🎄 BESTSELLER INTERACTIVE CHRISTMAS PARTY GAME BUNDLE 🎅</span>
          <h1 class="title-festive" style="font-size: 132px; margin-top: 18px;">
            Jolly Christmas Game Night
          </h1>
          <p style="font-size: 40px; font-weight: 800; color: #FFE5E8; margin-top: 8px;">
            Host on Your TV or Laptop · Everyone Plays From Their Phone · Zero App Downloads!
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1.35fr 0.65fr; gap: 48px; align-items: center; margin: 20px 0;">
          <!-- Big Screen TV -->
          <div class="tv-mockup" style="padding: 36px; background: radial-gradient(circle at 50% 30%, #185443, #06201A);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
              <span style="background:#D62839; padding:10px 26px; border-radius:999px; font-weight:900; font-size:24px;">📺 BIG SCREEN TV VIEW</span>
              <span style="background:rgba(255,255,255,0.15); padding:10px 26px; border-radius:999px; font-weight:900; font-size:24px;">ROOM PIN: 1225</span>
            </div>
            <div class="card-white" style="padding: 40px; text-align:center; margin-bottom: 28px;">
              <div style="font-size:24px; font-weight:900; color:#D62839; text-transform:uppercase;">Christmas Movie Trivia · Question 4 of 15</div>
              <div class="title-ui" style="font-size: 52px; color:#0B2E24; margin-top:12px;">
                In "Home Alone", where are the McCallisters flying to for Christmas?
              </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="background:#D62839; padding:26px 32px; border-radius:24px; font-size:34px; font-weight:900; display:flex; align-items:center; gap:18px;">🎄 London</div>
              <div style="background:#185443; border: 5px solid #fff; padding:26px 32px; border-radius:24px; font-size:34px; font-weight:900; display:flex; align-items:center; justify-content:space-between;">
                <span>🎁 Paris</span>
                <span style="background:#fff; color:#185443; font-size:22px; padding:6px 18px; border-radius:999px;">✓ CORRECT</span>
              </div>
              <div style="background:#C81E32; padding:26px 32px; border-radius:24px; font-size:34px; font-weight:900; display:flex; align-items:center; gap:18px; opacity:0.65;">⭐ New York</div>
              <div style="background:#0E3B2E; padding:26px 32px; border-radius:24px; font-size:34px; font-weight:900; display:flex; align-items:center; gap:18px; opacity:0.65;">🔔 Chicago</div>
            </div>
          </div>

          <!-- Phone Controller -->
          <div class="phone-mockup" style="padding: 34px; text-align:center; background: linear-gradient(180deg, #185443, #06201A);">
            <div style="background:#D62839; display:inline-block; padding:8px 24px; border-radius:999px; font-size:22px; font-weight:900; margin-bottom:18px;">
              📱 PLAYER'S PHONE
            </div>
            <div style="background:rgba(255,255,255,0.12); border-radius:28px; padding:22px; margin-bottom:22px; border:2px solid rgba(255,255,255,0.25);">
              <div style="font-size:64px;">🎅🦌🧝☃️🍪</div>
              <div style="font-size:26px; font-weight:900; margin-top:8px;">20 Cartoon Avatars</div>
              <div style="font-size:20px; opacity:0.85;">Scan QR & Pick Your Character!</div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:22px;">
              <div style="background:#D62839; padding:30px 16px; border-radius:24px; font-size:28px; font-weight:900;">🎄<br/>London</div>
              <div style="background:#22694F; border:4px solid #fff; padding:30px 16px; border-radius:24px; font-size:28px; font-weight:900;">🎁<br/>Paris</div>
              <div style="background:#C81E32; padding:30px 16px; border-radius:24px; font-size:28px; font-weight:900;">⭐<br/>New York</div>
              <div style="background:#185443; padding:30px 16px; border-radius:24px; font-size:28px; font-weight:900;">🔔<br/>Chicago</div>
            </div>
            <div style="background:#E63946; border:5px solid #fff; border-radius:999px; padding:22px; font-size:32px; font-weight:900; box-shadow:0 10px 0 #7A0C18;">
              🔔 LIVE BUZZER INCLUDED
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
          <div class="card-red" style="padding: 24px 28px; text-align:center;">
            <div style="font-size:44px; font-weight:900;">12 PACKS</div>
            <div style="font-size:24px; font-weight:700;">Ready-to-Play Games</div>
          </div>
          <div class="card-white" style="padding: 24px 28px; text-align:center;">
            <div style="font-size:44px; font-weight:900; color:#D62839;">4 MODES</div>
            <div style="font-size:24px; font-weight:800; color:#0B2E24;">Trivia · Top Answers · Quiz Board · Buzz</div>
          </div>
          <div class="card-red" style="padding: 24px 28px; text-align:center;">
            <div style="font-size:44px; font-weight:900;">13 TOPICS</div>
            <div style="font-size:24px; font-weight:700;">1-Click Question Generator</div>
          </div>
          <div class="card-white" style="padding: 24px 28px; text-align:center;">
            <div style="font-size:44px; font-weight:900; color:#185443;">NO APP</div>
            <div style="font-size:24px; font-weight:800; color:#0B2E24;">Instant QR Code Join</div>
          </div>
        </div>
      </div>
    `,
  },

  // 2. HOW IT WORKS IN 3 EASY STEPS
  {
    name: "02-how-it-works-3-steps.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">⚡ ZERO TECH SKILLS NEEDED · READY IN 60 SECONDS</span>
          <h1 class="title-festive" style="font-size: 120px; margin-top: 20px;">
            How It Works in 3 Easy Steps
          </h1>
          <p style="font-size: 38px; color: #FFE5E8; font-weight: 700;">
            No PowerPoint headaches. No printing papers. Everything runs live in your browser!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin: 30px 0;">
          <div class="card-white" style="padding: 48px 40px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="width:96px; height:96px; border-radius:28px; background:#D62839; color:#fff; font-size:52px; font-weight:900; display:grid; place-items:center; margin-bottom:30px;">1</div>
              <h2 class="title-ui" style="font-size: 48px; color:#0B2E24;">Activate Your Studio</h2>
              <p style="font-size: 30px; color:#2C3E35; margin-top: 18px; line-height:1.45; font-weight:700;">
                Enter your Etsy Order Number once at <b>christmasparty.live</b> to unlock your private Christmas Game Studio.
              </p>
            </div>
            <div style="margin-top:34px; background:#0E3B2E; color:#fff; padding:24px; border-radius:24px; font-size:26px; font-weight:800; text-align:center;">
              🔑 Instant Digital Access · No Subscription
            </div>
          </div>

          <div class="card-red" style="padding: 48px 40px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="width:96px; height:96px; border-radius:28px; background:#FFFFFF; color:#D62839; font-size:52px; font-weight:900; display:grid; place-items:center; margin-bottom:30px;">2</div>
              <h2 class="title-ui" style="font-size: 48px; color:#FFFFFF;">Pick or Generate Games</h2>
              <p style="font-size: 30px; color:#FFF5F6; margin-top: 18px; line-height:1.45; font-weight:700;">
                Choose from <b>12 ready-made holiday packs</b> OR use the built-in <b>Christmas Question Generator</b> to create custom questions in 1 click!
              </p>
            </div>
            <div style="margin-top:34px; background:#FFFFFF; color:#C1121F; padding:24px; border-radius:24px; font-size:26px; font-weight:900; text-align:center;">
              ✨ 100% Editable Questions & Timers
            </div>
          </div>

          <div class="card-white" style="padding: 48px 40px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="width:96px; height:96px; border-radius:28px; background:#185443; color:#fff; font-size:52px; font-weight:900; display:grid; place-items:center; margin-bottom:30px;">3</div>
              <h2 class="title-ui" style="font-size: 48px; color:#0B2E24;">Scan QR & Play Live!</h2>
              <p style="font-size: 30px; color:#2C3E35; margin-top: 18px; line-height:1.45; font-weight:700;">
                Show the host screen on your TV or Zoom. Players scan the QR code with their phone camera, pick a cartoon avatar & play!
              </p>
            </div>
            <div style="margin-top:34px; background:#D62839; color:#fff; padding:24px; border-radius:24px; font-size:26px; font-weight:800; text-align:center;">
              📱 Zero Logins · Zero App Downloads
            </div>
          </div>
        </div>

        <div class="footer-bar">
          <span>🎄 Works on Any Smart TV, Laptop, HDMI, AirPlay, Chromecast & Zoom</span>
          <span style="color:#FFE5E8;">Up to 50+ Players at Once!</span>
        </div>
      </div>
    `,
  },

  // 3. 4 INTERACTIVE GAME MODES
  {
    name: "03-4-interactive-game-modes.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">🎮 4 COMPLETE TV GAME SHOW FORMATS IN 1 BUNDLE</span>
          <h1 class="title-festive" style="font-size: 118px; margin-top: 16px;">
            Four Ways to Play Live!
          </h1>
          <p style="font-size: 36px; color: #FFE5E8; font-weight: 700;">
            Every format uses players' smartphones as live controllers & buzzers!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 36px; margin: 24px 0;">
          <div class="card-white" style="padding: 40px; display:flex; gap:30px; align-items:flex-start;">
            <div style="width:110px; height:110px; border-radius:30px; background:#D62839; color:#fff; font-size:58px; display:grid; place-items:center; flex-shrink:0;">🎄</div>
            <div>
              <span style="background:#FFE5E8; color:#C1121F; font-weight:900; padding:6px 18px; border-radius:999px; font-size:22px;">MODE 1 · SPEED-BONUS</span>
              <h2 class="title-ui" style="font-size:46px; color:#0B2E24; margin-top:10px;">Live Multiple-Choice Trivia</h2>
              <p style="font-size:28px; color:#2C3E35; margin-top:10px; font-weight:700; line-height:1.4;">
                Questions appear on the TV with a ticking timer. Everyone taps 🎄 🎁 ⭐ 🔔 on their phone — faster answers earn more points!
              </p>
            </div>
          </div>

          <div class="card-red" style="padding: 40px; display:flex; gap:30px; align-items:flex-start;">
            <div style="width:110px; height:110px; border-radius:30px; background:#FFFFFF; color:#D62839; font-size:58px; display:grid; place-items:center; flex-shrink:0;">🔔</div>
            <div>
              <span style="background:#FFFFFF; color:#C1121F; font-weight:900; padding:6px 18px; border-radius:999px; font-size:22px;">MODE 2 · SURVEY SHOWDOWN</span>
              <h2 class="title-ui" style="font-size:46px; color:#FFFFFF; margin-top:10px;">Holiday Top Answers ("Top Answers")</h2>
              <p style="font-size:28px; color:#FFF5F6; margin-top:10px; font-weight:700; line-height:1.4;">
                "We asked 100 elves…" Flip hidden survey answers on the board, rack up the point bank, and trigger giant red ✕ strikes!
              </p>
            </div>
          </div>

          <div class="card-red" style="padding: 40px; display:flex; gap:30px; align-items:flex-start;">
            <div style="width:110px; height:110px; border-radius:30px; background:#FFFFFF; color:#185443; font-size:58px; display:grid; place-items:center; flex-shrink:0;">🎁</div>
            <div>
              <span style="background:#FFFFFF; color:#185443; font-weight:900; padding:6px 18px; border-radius:999px; font-size:22px;">MODE 3 · CATEGORY GRID</span>
              <h2 class="title-ui" style="font-size:46px; color:#FFFFFF; margin-top:10px;">Christmas Category Quiz Board</h2>
              <p style="font-size:28px; color:#FFF5F6; margin-top:10px; font-weight:700; line-height:1.4;">
                5 categories × 5 point values (100 to 500 pts) plus a Final Wager round! Players buzz in on their phones to steal the points.
              </p>
            </div>
          </div>

          <div class="card-white" style="padding: 40px; display:flex; gap:30px; align-items:flex-start;">
            <div style="width:110px; height:110px; border-radius:30px; background:#185443; color:#fff; font-size:58px; display:grid; place-items:center; flex-shrink:0;">🎅</div>
            <div>
              <span style="background:#E6F4EE; color:#185443; font-weight:900; padding:6px 18px; border-radius:999px; font-size:22px;">MODE 4 · FASTEST FINGER</span>
              <h2 class="title-ui" style="font-size:46px; color:#0B2E24; margin-top:10px;">Emoji, Riddle & Song Buzzer</h2>
              <p style="font-size:28px; color:#2C3E35; margin-top:10px; font-weight:700; line-height:1.4;">
                Phones transform into giant red BUZZ! buttons. First player to buzz locks out everyone else and shouts the answer out loud!
              </p>
            </div>
          </div>
        </div>

        <div class="footer-bar">
          <span>✨ Play Individual Free-For-All OR Team Mode (Mistletoe vs. Tinsel, Holly vs. Ivy!)</span>
          <span>🔊 Built-In Game Show Sound Effects!</span>
        </div>
      </div>
    `,
  },

  // 4. 12 READY TO PLAY PACKS
  {
    name: "04-12-ready-to-play-packs.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">🎁 PRE-LOADED & READY TO HOST IMMEDIATELY</span>
          <h1 class="title-festive" style="font-size: 116px; margin-top: 16px;">
            12 Ready-to-Play Christmas Game Packs
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            Open any pack in 1 click — play as-is or customize every single question!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 26px; margin: 20px 0;">
          ${[
            ["🎄", "Jolly Holiday Trivia", "Live Quiz · 10 Qs", "red"],
            ["🎬", "Christmas Movie Buffs", "Live Quiz · 10 Qs", "white"],
            ["🎶", "Festive Tunes & Carols", "Live Quiz · 10 Qs", "red"],
            ["🧒", "Kids' North Pole Quiz", "Family Friendly · 10 Qs", "white"],
            ["🎁", "The Big Holiday Board", "5x5 Category Grid", "white"],
            ["🔔", "Survey Says: Christmas!", "Top Answers · 6 Rounds", "red"],
            ["👨‍👩‍👧‍👦", "Family Holiday Top Answers", "Traditions & Arguments", "white"],
            ["🍿", "Emoji Xmas Movies", "Buzzer Picture Clues", "red"],
            ["🎵", "Emoji Holiday Songs", "Guess the Tune · Buzzer", "red"],
            ["🕯️", "Cozy Christmas Riddles", "Rhyming Brainteasers", "white"],
            ["🎤", "Finish the Xmas Lyric!", "Sing the Next Line!", "red"],
            ["🎅", "Who Am I? North Pole", "3-Clue Character Guess", "white"],
          ]
            .map(
              ([emo, title, sub, style]) => `
            <div class="${style === "red" ? "card-red" : "card-white"}" style="padding: 30px 26px; text-align:center;">
              <div style="font-size: 62px;">${emo}</div>
              <div class="title-ui" style="font-size: 32px; margin-top: 12px;">${title}</div>
              <div style="font-size: 22px; font-weight: 800; opacity: 0.85; margin-top: 8px;">${sub}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="footer-bar">
          <span>🎅 Every Pack is Pre-Written, Fact-Checked & Party-Tested</span>
          <span>➕ Plus Unlimited Custom Games!</span>
        </div>
      </div>
    `,
  },

  // 5. QUESTION GENERATOR (13 TOPICS)
  {
    name: "05-question-generator-13-topics.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">✨ EXCLUSIVE HOST STUDIO FEATURE</span>
          <h1 class="title-festive" style="font-size: 112px; margin-top: 16px;">
            1-Click Christmas Question Generator
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            Never run out of questions! Pick a vibe and generate fresh holiday questions in seconds.
          </p>
        </div>

        <div class="card-white" style="padding: 44px; margin: 16px 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px;">
            <div>
              <div style="font-size:24px; font-weight:900; color:#D62839; text-transform:uppercase;">13 Festive Generator Categories</div>
              <div class="title-ui" style="font-size:44px; color:#0B2E24;">What kind of Christmas game do you want to host?</div>
            </div>
            <div style="background:#D62839; color:#fff; padding:18px 36px; border-radius:999px; font-size:28px; font-weight:900;">
              ✨ + Generate 10 Questions
            </div>
          </div>

          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
            ${[
              ["🎄", "Ultimate Xmas Mix", "Classic trivia & traditions"],
              ["😂", "Funny & Weird Facts", "Hilarious holiday trivia"],
              ["🎬", "Christmas Movies", "Home Alone, Elf, Green Goblin"],
              ["🎶", "Holiday Hits & Carols", "Mariah, Wham!, classics"],
              ["🤥", "True or False?", "50/50 Christmas myths"],
              ["🤔", "Would You Rather?", "Festive party dilemmas"],
              ["👉", "Most Likely To…", "Group icebreaker votes"],
              ["🧸", "Kids & Family Friendly", "Easy North Pole fun"],
              ["🥳", "Office & Adult Party", "Ugly sweaters & laughs"],
              ["🍿", "Emoji Movie Puzzles", "Decode the film from emojis"],
              ["🎵", "Emoji Song Puzzles", "Guess the carol from emojis"],
              ["🕯️", "Christmas Riddles", "Clever rhyming clues"],
            ]
              .map(
                ([e, t, d], idx) => `
              <div style="background:${idx % 2 === 0 ? "#0E3B2E" : "#D62839"}; color:#fff; padding:22px 24px; border-radius:24px; display:flex; align-items:center; gap:18px;">
                <span style="font-size:46px;">${e}</span>
                <div>
                  <div style="font-size:26px; font-weight:900; line-height:1.15;">${t}</div>
                  <div style="font-size:19px; opacity:0.88; margin-top:4px;">${d}</div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="footer-bar">
          <span>🔄 Replace All Questions or Append to Your Existing Game</span>
          <span>⚡ Works Across All 4 Game Formats!</span>
        </div>
      </div>
    `,
  },

  // 6. 20 CARTOON AVATARS
  {
    name: "06-20-cartoon-holiday-avatars.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">🎭 PLAYERS PICK THEIR CHARACTER ON THEIR PHONE</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 16px;">
            20 Custom Cartoon Holiday Avatars!
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            When guests scan the QR code, they choose a festive cartoon character that pops up live on the TV!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap: 22px; margin: 16px 0;">
          ${[
            ["🎅", "Jolly Santa", "Big Boss of the North", "#D62839"],
            ["🤶", "Mrs. Claus", "Cookie Queen", "#185443"],
            ["🦌", "Ruby Reindeer", "Red-Nosed Leader", "#D62839"],
            ["🧝‍♂️", "Barnaby Elf", "Chief Toy Maker", "#185443"],
            ["🧝‍♀️", "Tinsel Elf", "Wrap Star", "#D62839"],
            ["⛄", "Chilly Snowman", "Coolest Guy Around", "#185443"],
            ["🍪", "Gingy", "Catch Me If You Can", "#D62839"],
            ["😈", "Grumpy Goblin", "Stealing Your Points", "#185443"],
            ["💂", "Nutcracker", "Royal Guard", "#D62839"],
            ["🐧", "Pip Penguin", "South Pole Crasher", "#185443"],
            ["🐻‍❄️", "Barnaby Bear", "Cozy Scarf Club", "#D62839"],
            ["👼", "Little Angel", "Tree Topper Star", "#185443"],
            ["🎄", "Sir Pines", "Lit Up & Ready", "#D62839"],
            ["🦌", "Dasher", "Fastest on the Roof", "#185443"],
            ["❄️", "Jack Frost", "Nipping at Your Nose", "#D62839"],
            ["🍫", "Mugsy Cocoa", "Marshmallow Mood", "#185443"],
            ["🔔", "Jingle Belle", "Ring-a-Ding-Ding", "#D62839"],
            ["🍬", "Peppermint", "Sweet & Twisted", "#185443"],
            ["⭐", "Starla", "Shining Bright", "#D62839"],
            ["🎁", "Mystery Box", "Full of Surprises", "#185443"],
          ]
            .map(
              ([emo, name, sub, bg]) => `
            <div style="background:${bg}; border: 4px solid #fff; border-radius: 28px; padding: 20px; text-align:center; box-shadow: 0 12px 28px rgba(0,0,0,0.3);">
              <div style="width:90px; height:90px; margin:0 auto; border-radius:999px; background:rgba(255,255,255,0.2); border:3px solid #fff; display:grid; place-items:center; font-size:52px;">${emo}</div>
              <div class="title-ui" style="font-size: 28px; margin-top: 10px;">${name}</div>
              <div style="font-size: 18px; opacity: 0.9; font-weight:700;">${sub}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="footer-bar">
          <span>📺 Avatars Show Up in the TV Lobby, Buzzer Popups, Scoreboard & Winner Podium!</span>
          <span>🎲 Includes Random Character Button</span>
        </div>
      </div>
    `,
  },

  // 7. LIVE TRIVIA MODE SHOWCASE
  {
    name: "07-live-trivia-mode-showcase.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">🎄 GAME MODE #1 · LIVE MULTIPLE-CHOICE QUIZ</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 14px;">
            Interactive Phone Trivia & Speed Bonus
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            Just like a live TV studio show — everyone races the clock on their phone!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: 1.25fr 0.75fr; gap: 44px; align-items:center;">
          <div class="tv-mockup" style="padding: 40px; background: radial-gradient(circle at 50% 25%, #185443, #06201A);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <span style="font-size:26px; font-weight:900; color:#FFE5E8;">Question 7 of 10</span>
              <span style="background:#D62839; border:4px solid #fff; width:84px; height:84px; border-radius:999px; display:grid; place-items:center; font-size:40px; font-weight:900;">14</span>
              <span style="font-size:26px; font-weight:900; color:#FFE5E8;">12 / 12 Answered</span>
            </div>
            <div class="card-white" style="padding: 44px; text-align:center; margin-bottom:28px;">
              <div class="title-ui" style="font-size: 50px; color:#0B2E24;">
                Which song holds the record for the best-selling Christmas single of all time?
              </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="background:#D62839; border:5px solid #fff; padding:26px; border-radius:24px; font-size:32px; font-weight:900;">🎄 White Christmas</div>
              <div style="background:#185443; padding:26px; border-radius:24px; font-size:32px; font-weight:900; opacity:0.5;">🎁 Last Christmas</div>
              <div style="background:#C81E32; padding:26px; border-radius:24px; font-size:32px; font-weight:900; opacity:0.5;">⭐ Jingle Bell Rock</div>
              <div style="background:#0E3B2E; padding:26px; border-radius:24px; font-size:32px; font-weight:900; opacity:0.5;">🔔 Silent Night</div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:28px;">
            <div class="card-white" style="padding: 36px;">
              <h3 class="title-ui" style="font-size: 40px; color:#D62839;">⚡ Speed-Bonus Scoring</h3>
              <p style="font-size: 28px; color:#11221B; margin-top:10px; font-weight:700; line-height:1.4;">
                Up to <b>1,000 points</b> per question! Answering faster gives extra bonus points to keep the leaderboard exciting.
              </p>
            </div>
            <div class="card-red" style="padding: 36px;">
              <h3 class="title-ui" style="font-size: 40px;">📊 Live Answer Bar Counts</h3>
              <p style="font-size: 28px; margin-top:10px; font-weight:700; line-height:1.4;">
                When time runs out, the TV reveals how many players picked each option plus a fun holiday fact!
              </p>
            </div>
            <div class="card-white" style="padding: 36px;">
              <h3 class="title-ui" style="font-size: 40px; color:#185443;">🏆 Animated Leaderboard</h3>
              <p style="font-size: 28px; color:#11221B; margin-top:10px; font-weight:700; line-height:1.4;">
                After every question, see who climbed to #1 with their cartoon avatar and score gain!
              </p>
            </div>
          </div>
        </div>

        <div class="footer-bar">
          <span>🎄 Includes Classic Trivia, Movies, Music, True/False & Kids Packs</span>
          <span>⏱ Adjustable Countdown Timer</span>
        </div>
      </div>
    `,
  },

  // 8. Top Answers MODE SHOWCASE
  {
    name: "08-family-poll-mode-showcase.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">🔔 GAME MODE #2 · Holiday Top Answers ("TOP ANSWERS")</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 14px;">
            "Survey Says…" Christmas Edition!
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            Flip the top survey answers on the big screen, build the bank & watch out for 3 strikes!
          </p>
        </div>

        <div class="tv-mockup" style="padding: 44px; background: radial-gradient(circle at 50% 25%, #185443, #06201A); margin: 16px 0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
            <span style="font-size:28px; font-weight:900; color:#FFE5E8;">Round 3 of 6 · Face-Off Buzzer Active</span>
            <span style="background:#D62839; border:3px solid #fff; padding:12px 34px; border-radius:20px; font-size:36px; font-weight:900;">BANK: 84 PTS</span>
          </div>

          <div class="card-white" style="padding: 34px; text-align:center; margin-bottom:28px;">
            <div class="title-ui" style="font-size: 48px; color:#0B2E24;">
              "Name something people do on Christmas morning"
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 22px;">
            <div style="background:#D62839; border:4px solid #fff; border-radius:24px; padding:24px 32px; display:flex; justify-content:space-between; align-items:center; font-size:32px; font-weight:900;">
              <span>1. OPEN PRESENTS / STOCKINGS</span>
              <span style="background:#fff; color:#D62839; padding:8px 22px; border-radius:16px;">45</span>
            </div>
            <div style="background:#D62839; border:4px solid #fff; border-radius:24px; padding:24px 32px; display:flex; justify-content:space-between; align-items:center; font-size:32px; font-weight:900;">
              <span>2. EAT CINNAMON ROLLS</span>
              <span style="background:#fff; color:#D62839; padding:8px 22px; border-radius:16px;">24</span>
            </div>
            <div style="background:#D62839; border:4px solid #fff; border-radius:24px; padding:24px 32px; display:flex; justify-content:space-between; align-items:center; font-size:32px; font-weight:900;">
              <span>3. STAY IN PAJAMAS ALL DAY</span>
              <span style="background:#fff; color:#D62839; padding:8px 22px; border-radius:16px;">15</span>
            </div>
            <div style="background:#0E3B2E; border:4px solid rgba(255,255,255,0.45); border-radius:24px; padding:24px 32px; text-align:center; font-size:36px; font-weight:900;">
              4
            </div>
            <div style="background:#0E3B2E; border:4px solid rgba(255,255,255,0.45); border-radius:24px; padding:24px 32px; text-align:center; font-size:36px; font-weight:900;">
              5
            </div>
            <div style="background:#0E3B2E; border:4px solid rgba(255,255,255,0.45); border-radius:24px; padding:24px 32px; text-align:center; font-size:36px; font-weight:900;">
              6
            </div>
          </div>

          <div style="display:flex; justify-content:center; gap:20px; margin-top:28px;">
            <span style="background:#D62839; border:3px solid #fff; width:74px; height:74px; border-radius:20px; display:grid; place-items:center; font-size:42px; font-weight:900;">✕</span>
            <span style="background:#D62839; border:3px solid #fff; width:74px; height:74px; border-radius:20px; display:grid; place-items:center; font-size:42px; font-weight:900;">✕</span>
            <span style="background:rgba(255,255,255,0.12); width:74px; height:74px; border-radius:20px; display:grid; place-items:center; font-size:42px; font-weight:900; opacity:0.4;">✕</span>
          </div>
        </div>

        <div class="footer-bar">
          <span>🔔 Includes 2 Full Top Answers Packs + Unlimited Generator Rounds</span>
          <span>💥 Giant Animated Strike X's & Sound Effects!</span>
        </div>
      </div>
    `,
  },

  // 9. Category Quiz Board SHOWCASE
  {
    name: "09-Quiz Board-board-showcase.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">🎁 GAME MODE #3 · Christmas Category Quiz Board</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 14px;">
            Big Screen Category Grid & Buzzers
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            5 Festive Categories × 5 Point Values (100 to 500) + Final Wager Question!
          </p>
        </div>

        <div class="tv-mockup" style="padding: 40px; background: radial-gradient(circle at 50% 25%, #185443, #06201A); margin: 14px 0;">
          <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap: 18px;">
            ${["XMAS MOVIES", "CAROLS & HITS", "AROUND THE WORLD", "SANTA'S WORKSHOP", "HOLIDAY FEAST"]
              .map(
                (cat) => `
              <div style="background:#D62839; border:3px solid #fff; border-radius:20px; padding:22px 14px; text-align:center; font-size:26px; font-weight:900;">
                ${cat}
              </div>
            `
              )
              .join("")}
            ${[100, 200, 300, 400, 500]
              .map((pts, rIdx) =>
                [0, 1, 2, 3, 4]
                  .map((cIdx) => {
                    const used = (rIdx === 0 && cIdx === 1) || (rIdx === 1 && cIdx === 3);
                    const highlight = rIdx === 2 && cIdx === 2;
                    return `
                  <div style="background:${used ? "rgba(0,0,0,0.25)" : highlight ? "#D62839" : "#0E3B2E"}; border:3px solid ${
                      used ? "rgba(255,255,255,0.1)" : "#FFFFFF"
                    }; border-radius:20px; padding:24px 0; text-align:center; font-size:44px; font-weight:900; color:${
                      used ? "rgba(255,255,255,0.2)" : "#FFFFFF"
                    };">
                    ${used ? "✓" : pts}
                  </div>
                `;
                  })
                  .join("")
              )
              .join("")}
          </div>
        </div>

        <div class="footer-bar">
          <span>📱 Players Buzz In From Their Phones When a Tile Opens</span>
          <span>⭐ Includes Final Wager Round!</span>
        </div>
      </div>
    `,
  },

  // 10. EMOJI & SONG BUZZER SHOWCASE
  {
    name: "10-emoji-song-buzzer-showcase.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">🎅 GAME MODE #4 · FASTEST-FINGER PHONE BUZZER</span>
          <h1 class="title-festive" style="font-size: 112px; margin-top: 14px;">
            Emoji Puzzles, Riddles & Finish the Lyric!
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            Phones turn into real game-show buzzers — first to tap locks everyone else out!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: 1.25fr 0.75fr; gap: 44px; align-items:center;">
          <div class="tv-mockup" style="padding: 44px; text-align:center; background: radial-gradient(circle at 50% 30%, #185443, #06201A);">
            <span style="background:#D62839; padding:10px 28px; border-radius:999px; font-size:24px; font-weight:900;">
              EMOJI CHRISTMAS MOVIE · CLUE 5 OF 12
            </span>
            <div class="card-white" style="padding: 50px 30px; margin: 28px 0;">
              <div style="font-size: 105px; letter-spacing: 12px;">🏠 😱 👦🏼 🎄 🦹‍♂️</div>
              <div style="font-size: 30px; color:#D62839; font-weight:900; margin-top:18px; text-transform:uppercase;">
                Hint: 1990 Family Comedy Classic
              </div>
            </div>
            <div style="background:#D62839; border:5px solid #fff; border-radius:30px; padding:24px 40px; display:inline-flex; align-items:center; gap:24px;">
              <span style="font-size:64px;">🦌</span>
              <div style="text-align:left;">
                <div style="font-size:22px; text-transform:uppercase; font-weight:900; opacity:0.9;">🔔 Buzzed In First!</div>
                <div class="title-ui" style="font-size:48px;">Jingle Jess (Ruby Reindeer)</div>
              </div>
            </div>
          </div>

          <div class="phone-mockup" style="padding: 40px; text-align:center; background: linear-gradient(180deg, #185443, #06201A);">
            <div style="font-size:26px; font-weight:900; margin-bottom:20px;">📱 PLAYER'S PHONE</div>
            <div style="width:340px; height:340px; margin: 20px auto; border-radius:999px; background:linear-gradient(180deg, #E63946, #B81424); border:14px solid #FFFFFF; box-shadow: 0 22px 0 #6E0B14, 0 35px 60px rgba(0,0,0,0.6); display:grid; place-items:center;">
              <span class="title-ui" style="font-size: 86px; letter-spacing:2px;">BUZZ!</span>
            </div>
            <div style="font-size:28px; font-weight:800; color:#FFE5E8; margin-top:28px;">
              Millisecond-Accurate Lockout!
            </div>
            <div style="font-size:22px; opacity:0.85; margin-top:8px;">
              Vibrates & plays buzzer sound on tap
            </div>
          </div>
        </div>

        <div class="footer-bar">
          <span>🍿 Includes Emoji Movies, Emoji Songs, Cozy Riddles, Finish the Lyric & Who Am I!</span>
          <span>⚡ Zero Lag Realtime Sync</span>
        </div>
      </div>
    `,
  },

  // 11. QR CODE INSTANT JOIN
  {
    name: "11-qr-code-instant-join.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">📱 SO EASY EVEN GRANDMA CAN JOIN IN 5 SECONDS</span>
          <h1 class="title-festive" style="font-size: 116px; margin-top: 14px;">
            Scan the QR Code · No Login Required!
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            No app downloads. No creating accounts. No passwords. Just point your phone camera & play!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 38px; align-items:stretch; margin: 24px 0;">
          <div class="card-white" style="padding: 44px; text-align:center; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span style="background:#D62839; color:#fff; padding:8px 24px; border-radius:999px; font-size:22px; font-weight:900;">STEP 1</span>
              <h2 class="title-ui" style="font-size:42px; color:#0B2E24; margin-top:16px;">Point Phone Camera at TV</h2>
              <p style="font-size:26px; color:#2C3E35; margin-top:12px; font-weight:700;">
                The TV lobby displays a big, scannable QR code and a 4-digit Room PIN.
              </p>
            </div>
            <div style="margin-top:28px; background:#0E3B2E; color:#fff; border-radius:28px; padding:32px;">
              <div style="font-size:80px;">📷 ➔ 📺</div>
              <div style="font-size:28px; font-weight:900; margin-top:10px;">PIN: 1225</div>
            </div>
          </div>

          <div class="card-red" style="padding: 44px; text-align:center; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span style="background:#FFFFFF; color:#D62839; padding:8px 24px; border-radius:999px; font-size:22px; font-weight:900;">STEP 2</span>
              <h2 class="title-ui" style="font-size:42px; color:#FFFFFF; margin-top:16px;">Pick Avatar & Nickname</h2>
              <p style="font-size:26px; color:#FFF5F6; margin-top:12px; font-weight:700;">
                Guests choose from 20 cartoon holiday characters and type their funny party nickname!
              </p>
            </div>
            <div style="margin-top:28px; background:#FFFFFF; color:#0B2E24; border-radius:28px; padding:32px;">
              <div style="font-size:72px;">🎅 🦌 ⛄ 🍪</div>
              <div style="font-size:28px; font-weight:900; margin-top:10px; color:#D62839;">"Jingle Jess"</div>
            </div>
          </div>

          <div class="card-white" style="padding: 44px; text-align:center; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span style="background:#185443; color:#fff; padding:8px 24px; border-radius:999px; font-size:22px; font-weight:900;">STEP 3</span>
              <h2 class="title-ui" style="font-size:42px; color:#0B2E24; margin-top:16px;">Pop Up on the Big Screen!</h2>
              <p style="font-size:26px; color:#2C3E35; margin-top:12px; font-weight:700;">
                Everyone's avatar appears live on the TV lobby with a festive chime. Hit Start Game!
              </p>
            </div>
            <div style="margin-top:28px; background:#D62839; color:#fff; border-radius:28px; padding:32px;">
              <div style="font-size:80px;">🎉 🏆 🔔</div>
              <div style="font-size:28px; font-weight:900; margin-top:10px;">You're In the Lobby!</div>
            </div>
          </div>
        </div>

        <div class="footer-bar">
          <span>📱 Works on All iPhones, iPads & Android Phones</span>
          <span>🔒 Private Room PIN for Your Party Only</span>
        </div>
      </div>
    `,
  },

  // 12. CUSTOMIZABLE GAME EDITOR
  {
    name: "12-customizable-game-editor.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">✏️ MAKE IT PERSONAL FOR YOUR FAMILY OR OFFICE</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 14px;">
            100% Customizable Game Studio
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            Play our 12 packs straight out of the box OR add your own family & office inside jokes!
          </p>
        </div>

        <div class="card-white" style="padding: 48px; margin: 16px 0;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 36px;">
            <div style="background:#0E3B2E; color:#fff; padding:36px; border-radius:28px;">
              <span style="background:#D62839; padding:8px 22px; border-radius:999px; font-size:22px; font-weight:900;">CUSTOM FAMILY QUESTION EXAMPLE</span>
              <div class="title-ui" style="font-size:38px; margin-top:18px;">
                "Who burnt the Christmas rolls in 2023 and blamed the dog?"
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:24px; font-size:26px; font-weight:800;">
                <div style="background:#D62839; padding:16px; border-radius:16px;">🎄 Uncle Bob</div>
                <div style="background:#22694F; border:3px solid #fff; padding:16px; border-radius:16px;">🎁 Aunt Sarah ✓</div>
                <div style="background:rgba(255,255,255,0.15); padding:16px; border-radius:16px;">⭐ Grandma</div>
                <div style="background:rgba(255,255,255,0.15); padding:16px; border-radius:16px;">🔔 Cousin Leo</div>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; justify-content:space-between; gap:20px;">
              <div style="background:#FFF5F6; border:3px solid #D62839; padding:28px; border-radius:24px;">
                <h3 class="title-ui" style="font-size:34px; color:#D62839;">✏️ Edit Anything in Seconds</h3>
                <p style="font-size:25px; color:#11221B; font-weight:700; margin-top:6px;">
                  Change question text, answer options, points, countdown timers, and host notes with auto-save.
                </p>
              </div>
              <div style="background:#E6F4EE; border:3px solid #185443; padding:28px; border-radius:24px;">
                <h3 class="title-ui" style="font-size:34px; color:#185443;">🎨 2 Festive Stage Themes</h3>
                <p style="font-size:25px; color:#11221B; font-weight:700; margin-top:6px;">
                  Switch between <b>Christmas Pine Green</b> and <b>Santa Cranberry Red</b> animated snowfall backgrounds!
                </p>
              </div>
              <div style="background:#FFF5F6; border:3px solid #D62839; padding:28px; border-radius:24px;">
                <h3 class="title-ui" style="font-size:34px; color:#D62839;">♾️ Unlimited Games & Replays</h3>
                <p style="font-size:25px; color:#11221B; font-weight:700; margin-top:6px;">
                  Create as many custom games as you want — host for family night, then host again for your office party!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bar">
          <span>☁️ Saved Automatically to Your Private Studio</span>
          <span>🔑 Access From Any Computer or Tablet</span>
        </div>
      </div>
    `,
  },

  // 13. PERFECT FOR EVERY GATHERING
  {
    name: "13-perfect-for-every-gathering.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">🎉 DESIGNED FOR GROUPS OF 2 TO 50+ PLAYERS</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 14px;">
            Perfect For Every Holiday Gathering!
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            Whether you're in the living room, classroom, office, or on Zoom!
          </p>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 34px; margin: 20px 0;">
          <div class="card-white" style="padding: 42px;">
            <div style="font-size:64px;">👨‍👩‍👧‍👦 🎄</div>
            <h2 class="title-ui" style="font-size:44px; color:#0B2E24; margin-top:10px;">Family Christmas Night</h2>
            <p style="font-size:28px; color:#2C3E35; margin-top:10px; font-weight:700; line-height:1.4;">
              Kids, parents, and grandparents play together! Use Team Mode to pit cousins against aunts & uncles.
            </p>
          </div>

          <div class="card-red" style="padding: 42px;">
            <div style="font-size:64px;">🥂 🏢</div>
            <h2 class="title-ui" style="font-size:44px; color:#FFFFFF; margin-top:10px;">Office Holiday Parties</h2>
            <p style="font-size:28px; color:#FFF5F6; margin-top:10px; font-weight:700; line-height:1.4;">
              Break the ice in minutes! Generate hilarious "Most Likely To" and "Office Party" questions in 1 click.
            </p>
          </div>

          <div class="card-red" style="padding: 42px;">
            <div style="font-size:64px;">🏫 🧒</div>
            <h2 class="title-ui" style="font-size:44px; color:#FFFFFF; margin-top:10px;">Classroom & Youth Groups</h2>
            <p style="font-size:28px; color:#FFF5F6; margin-top:10px; font-weight:700; line-height:1.4;">
              Includes a dedicated Kids' North Pole Quiz & G-rated generator topics that students love!
            </p>
          </div>

          <div class="card-white" style="padding: 42px;">
            <div style="font-size:64px;">💻 🌍</div>
            <h2 class="title-ui" style="font-size:44px; color:#0B2E24; margin-top:10px;">Zoom, Teams & Remote Parties</h2>
            <p style="font-size:28px; color:#2C3E35; margin-top:10px; font-weight:700; line-height:1.4;">
              Just share your browser tab on Zoom or Microsoft Teams — remote players join from their phones anywhere in the world!
            </p>
          </div>
        </div>

        <div class="footer-bar">
          <span>🏆 Automatic Scoring & Winner Podium at the End of Every Game</span>
          <span>🎅 Instant Crowd Pleaser!</span>
        </div>
      </div>
    `,
  },

  // 14. TRY LIVE DEMO BEFORE YOU BUY
  {
    name: "14-try-live-demo-before-you-buy.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">🎮 TEST IT RIGHT NOW IN YOUR BROWSER!</span>
          <h1 class="title-festive" style="font-size: 118px; margin-top: 16px;">
            Try the Live Interactive Demo!
          </h1>
          <p style="font-size: 36px; color: #FFE5E8; font-weight: 700;">
            Want to see how smooth it feels before buying? Test our Split-Screen Simulator free!
          </p>
        </div>

        <div class="card-red" style="padding: 56px; text-align:center; margin: 20px 0;">
          <div style="font-size:32px; font-weight:900; letter-spacing:0.08em; text-transform:uppercase; color:#FFE5E8;">
            OPEN ON YOUR PHONE OR COMPUTER:
          </div>
          <div style="background:#FFFFFF; color:#C1121F; padding:32px 60px; border-radius:999px; font-size:74px; font-weight:900; display:inline-block; margin: 28px 0; box-shadow: 0 20px 50px rgba(0,0,0,0.35);">
            christmasparty.live/demo
          </div>
          <p style="font-size:34px; font-weight:800; max-width:1600px; margin: 0 auto; line-height:1.4;">
            ✔ Play Sample Questions Across All 4 Game Modes<br/>
            ✔ Test the Live Phone Buzzer & Flip Top Answers Tiles<br/>
            ✔ Try All 20 Cartoon Avatars & Preview the 13-Topic Question Generator!
          </p>
        </div>

        <div class="footer-bar">
          <span>🎄 See Exactly What You & Your Guests Will Experience</span>
          <span>⚡ Works Instantly — No Sign-Up Needed</span>
        </div>
      </div>
    `,
  },

  // 15. WHAT YOU RECEIVE INSTANTLY
  {
    name: "15-what-you-receive-instantly.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-red">📦 INSTANT DIGITAL DOWNLOAD · NO WAITING</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 14px;">
            Everything Included With Your Order
          </h1>
          <p style="font-size: 34px; color: #FFE5E8; font-weight: 700;">
            One simple purchase unlocks the complete Christmas Party Game Studio!
          </p>
        </div>

        <div class="card-white" style="padding: 48px; margin: 16px 0;">
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 28px;">
            ${[
              ["✅ All 4 Live TV Game Show Modes", "Multiple-Choice Trivia, Top Answers, Category Quiz Board & Phone Buzzer"],
              ["✅ 12 Ready-to-Play Christmas Packs", "Movies, Carols, Classic Trivia, Top Answers, Kids, Riddles, Emoji Games & more"],
              ["✅ 13-Topic Question Generator", "Generate unlimited fresh Christmas questions in 1 click"],
              ["✅ 20 Cartoon Holiday Avatars", "Custom illustrated characters players choose when scanning the QR code"],
              ["✅ Full Custom Game Editor", "Edit any question, add inside jokes, or build new games from scratch"],
              ["✅ Unlimited Parties & Replays", "Host as many times as you want with up to 50+ players per room"],
              ["✅ Built-In Sound Effects & Music Cues", "Buzzer sounds, countdown ticks, strike horns & celebration chimes"],
              ["✅ Instant Etsy Order Activation", "Use your Etsy Order # immediately at christmasparty.live/redeem"],
            ]
              .map(
                ([title, desc]) => `
              <div style="background:#0E3B2E; color:#fff; padding:26px 30px; border-radius:24px;">
                <div class="title-ui" style="font-size:32px; color:#FFFFFF;">${title}</div>
                <div style="font-size:22px; color:#FFE5E8; margin-top:6px; font-weight:700;">${desc}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="footer-bar">
          <span>🎅 One-Time Purchase · No Monthly Fees · No Per-Player Fees</span>
          <span>⚡ Start Hosting in 60 Seconds!</span>
        </div>
      </div>
    `,
  },

  // 16. FAQ & COMPATIBILITY
  {
    name: "16-faq-and-compatibility.png",
    html: `
      <div class="wrap">
        <div style="text-align:center;">
          <span class="badge-white">❓ FREQUENTLY ASKED QUESTIONS</span>
          <h1 class="title-festive" style="font-size: 114px; margin-top: 14px;">
            Good to Know Before You Host
          </h1>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 28px; margin: 16px 0;">
          ${[
            [
              "Do players need to download an app or sign up?",
              "No! Players simply point their phone camera at the QR code on your TV screen (or go to christmasparty.live/join), pick a cartoon avatar, type their name, and they're in!",
              "white",
            ],
            [
              "How do I display the game on my TV?",
              "Open the host screen on any laptop/computer connected to your TV via HDMI, AirPlay, or Chromecast — or open it directly in your Smart TV's web browser!",
              "red",
            ],
            [
              "Can we play over Zoom or Microsoft Teams?",
              "Yes! Just share your browser window with audio on Zoom, Teams, or Google Meet. Remote players join on their phones from anywhere in the world.",
              "red",
            ],
            [
              "How many people can play at once?",
              "From 2 players up to 50+ players! You can play every-elf-for-themselves (Individual Mode) or split into 2 to 4 Holiday Teams.",
              "white",
            ],
            [
              "Can I edit the questions or write my own?",
              "100% yes! Every single question, option, timer, and point value is editable, plus you can generate new questions in 1 click.",
              "white",
            ],
            [
              "How fast do I get access after buying on Etsy?",
              "Immediately! Download the Quick-Start PDF from your Etsy receipt and enter your Etsy Order Number at christmasparty.live/redeem.",
              "red",
            ],
          ]
            .map(
              ([q, a, style]) => `
            <div class="${style === "red" ? "card-red" : "card-white"}" style="padding: 34px;">
              <h3 class="title-ui" style="font-size: 34px; color:${style === "red" ? "#FFFFFF" : "#D62839"};">${q}</h3>
              <p style="font-size: 25px; margin-top: 12px; font-weight: 700; line-height: 1.4; color:${
                style === "red" ? "#FFF5F6" : "#11221B"
              };">${a}</p>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="footer-bar">
          <span>🎄 Need Help? Message Us Anytime on Etsy!</span>
          <span>🌐 Live Demo: christmasparty.live/demo</span>
        </div>
      </div>
    `,
  },
];

async function renderImages(browser) {
  const page = await browser.newPage({ viewport: { width: 2400, height: 2000 }, deviceScaleFactor: 1 });
  for (const slide of SLIDES) {
    const fullHtml = `<!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"/><style>${BASE_CSS}</style></head>
        <body>
          <div class="candy-bar"></div>
          <div class="snow"></div>
          <div class="frame-border"></div>
          ${slide.html}
          <div class="candy-bar-bottom"></div>
        </body>
      </html>`;
    await page.setContent(fullHtml, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const outPath = path.join(IMG_DIR, slide.name);
    await page.screenshot({ path: outPath, type: "png" });
    console.log("Rendered image:", slide.name);
  }
  await page.close();
}

async function renderVideo(browser, videoName, scenes) {
  const frameFolder = path.join(FRAMES_DIR, videoName);
  fs.rmSync(frameFolder, { recursive: true, force: true });
  fs.mkdirSync(frameFolder, { recursive: true });

  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
  let frameIndex = 0;

  for (const scene of scenes) {
    const totalFrames = scene.frames;
    for (let f = 0; f < totalFrames; f++) {
      const progress = f / totalFrames;
      const html = scene.render(progress, f);
      await page.setContent(html, { waitUntil: "domcontentloaded" });
      if (f === 0) await page.evaluate(() => document.fonts.ready);
      const frameFile = path.join(frameFolder, `frame_${String(frameIndex).padStart(4, "0")}.png`);
      await page.screenshot({ path: frameFile, type: "png" });
      frameIndex++;
    }
  }
  await page.close();

  const outMp4 = path.join(VID_DIR, videoName);
  execSync(
    `ffmpeg -y -framerate 20 -i "${frameFolder}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 20 "${outMp4}"`,
    { stdio: "inherit" }
  );
  console.log("Rendered video:", outMp4);
}

const VIDEO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Mountains+of+Christmas:wght@700&family=Nunito:wght@700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1600px; height: 1200px;
    font-family: 'Nunito', sans-serif;
    background: radial-gradient(ellipse 90% 80% at 50% 35%, #185443, #0B2E24 60%, #06201A 100%);
    color: #fff; overflow: hidden; position: relative;
  }
  .candy {
    position: absolute; top:0; left:0; right:0; height: 16px;
    background: repeating-linear-gradient(45deg, #D62839, #D62839 24px, #FFFFFF 24px, #FFFFFF 48px, #185443 48px, #185443 72px);
  }
  .wrap { width:100%; height:100%; padding: 54px 70px; display:flex; flex-direction:column; justify-content:space-between; }
  .festive { font-family: 'Mountains of Christmas', cursive; font-weight: 700; }
  .ui { font-family: 'Fredoka', sans-serif; font-weight: 700; }
`;

async function main() {
  const browser = await chromium.launch({ channel: "chrome" });
  console.log("Rendering 16 Etsy listing images...");
  await renderImages(browser);

  console.log("Rendering Video 1: Live Party Gameplay Demo...");
  await renderVideo(browser, "01-live-party-gameplay-demo.mp4", [
    // Scene 1: QR Lobby & Cartoon Avatars Popping In (50 frames = 2.5s)
    {
      frames: 50,
      render: (p) => {
        const players = [
          ["🎅", "Jingle Jess", "Santa"],
          ["🦌", "Dasher Dan", "Ruby Reindeer"],
          ["🤶", "Aunt Sarah", "Mrs. Claus"],
          ["🍪", "Cousin Leo", "Gingy"],
          ["⛄", "Uncle Bob", "Chilly Snowman"],
          ["😈", "Grumpy Goblin Sam", "Goblin"],
          ["🐧", "Holly", "Penguin"],
          ["🧝‍♀️", "Mia", "Tinsel Elf"],
        ];
        const visibleCount = Math.min(players.length, Math.floor(p * 10) + 1);
        return `<!DOCTYPE html><html><head><style>${VIDEO_CSS}</style></head><body>
          <div class="candy"></div>
          <div class="wrap">
            <div style="text-align:center;">
              <span style="background:#D62839; border:3px solid #fff; padding:10px 28px; border-radius:999px; font-size:22px; font-weight:900;">
                STEP 1 · SCAN QR CODE ON TV · PICK YOUR CARTOON AVATAR!
              </span>
              <h1 class="festive" style="font-size:82px; margin-top:10px;">Everyone Joins From Their Phone!</h1>
            </div>
            <div style="display:grid; grid-template-columns: 0.9fr 1.1fr; gap:36px; align-items:center;">
              <div style="background:#fff; color:#0B2E24; border-radius:32px; padding:36px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.4);">
                <div style="font-size:22px; font-weight:900; color:#D62839;">SCAN WITH PHONE CAMERA</div>
                <div style="width:240px; height:240px; margin:16px auto; background:#0B2E24; color:#fff; border-radius:24px; display:grid; place-items:center; font-size:84px;">📱🏁</div>
                <div style="font-size:22px; font-weight:800;">ROOM PIN</div>
                <div class="ui" style="font-size:74px; color:#D62839; line-height:1;">1225</div>
              </div>
              <div style="background:rgba(0,0,0,0.35); border:3px solid rgba(255,255,255,0.25); border-radius:32px; padding:32px;">
                <div style="font-size:26px; font-weight:900; margin-bottom:18px;">🎄 Players in Lobby (${visibleCount})</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                  ${players
                    .slice(0, visibleCount)
                    .map(
                      ([emo, n, role]) => `
                    <div style="background:#D62839; border:3px solid #fff; border-radius:20px; padding:14px 20px; display:flex; align-items:center; gap:14px;">
                      <span style="font-size:42px;">${emo}</span>
                      <div>
                        <div style="font-size:22px; font-weight:900;">${n}</div>
                        <div style="font-size:15px; opacity:0.9;">${role}</div>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
            <div style="text-align:center; font-size:26px; font-weight:800; color:#FFE5E8;">
              Zero App Downloads · Zero Logins · 20 Holiday Cartoon Characters!
            </div>
          </div>
        </body></html>`;
      },
    },
    // Scene 2: Live Trivia Countdown & Answer Reveal (55 frames = 2.75s)
    {
      frames: 55,
      render: (p) => {
        const revealed = p > 0.55;
        const timer = Math.max(1, 15 - Math.floor(p * 20));
        return `<!DOCTYPE html><html><head><style>${VIDEO_CSS}</style></head><body>
          <div class="candy"></div>
          <div class="wrap">
            <div style="text-align:center;">
              <span style="background:#FFFFFF; color:#D62839; padding:10px 28px; border-radius:999px; font-size:22px; font-weight:900;">
                MODE 1 · LIVE MULTIPLE-CHOICE TRIVIA ON PHONES
              </span>
              <h1 class="festive" style="font-size:78px; margin-top:8px;">
                ${revealed ? "🎉 Answer Revealed + Speed Bonus!" : `⏱ Race the Clock! (${timer}s)`}
              </h1>
            </div>
            <div style="background:#fff; color:#0B2E24; border-radius:30px; padding:36px; text-align:center;">
              <div class="ui" style="font-size:46px;">
                In "Home Alone", where are the McCallisters flying to for Christmas?
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:22px;">
              <div style="background:#D62839; padding:28px; border-radius:24px; font-size:34px; font-weight:900; opacity:${revealed ? "0.35" : "1"};">🎄 London</div>
              <div style="background:#185443; border:${revealed ? "6px solid #fff" : "none"}; transform:scale(${revealed ? "1.03" : "1"}); padding:28px; border-radius:24px; font-size:34px; font-weight:900; display:flex; justify-content:space-between; align-items:center;">
                <span>🎁 Paris</span>
                ${revealed ? '<span style="background:#fff; color:#185443; padding:6px 20px; border-radius:999px; font-size:24px;">✓ CORRECT (+940 PTS)</span>' : ""}
              </div>
              <div style="background:#C81E32; padding:28px; border-radius:24px; font-size:34px; font-weight:900; opacity:${revealed ? "0.35" : "1"};">⭐ New York</div>
              <div style="background:#0E3B2E; padding:28px; border-radius:24px; font-size:34px; font-weight:900; opacity:${revealed ? "0.35" : "1"};">🔔 Rome</div>
            </div>
            <div style="text-align:center; font-size:26px; font-weight:800; color:#FFE5E8;">
              Everyone taps their answer on their phone — automatic scoring!
            </div>
          </div>
        </body></html>`;
      },
    },
    // Scene 3: Top Answers Flipping Tiles + Buzzer (55 frames = 2.75s)
    {
      frames: 55,
      render: (p) => {
        const openCount = Math.min(4, Math.floor(p * 5) + 1);
        const answers = [
          ["1. OPEN PRESENTS / STOCKINGS", 45],
          ["2. EAT CINNAMON ROLLS", 24],
          ["3. STAY IN MATCHING PAJAMAS", 15],
          ["4. DRINK HOT COCOA", 10],
        ];
        return `<!DOCTYPE html><html><head><style>${VIDEO_CSS}</style></head><body>
          <div class="candy"></div>
          <div class="wrap">
            <div style="text-align:center;">
              <span style="background:#D62839; border:3px solid #fff; padding:10px 28px; border-radius:999px; font-size:22px; font-weight:900;">
                MODE 2 & 3 · Holiday Top Answers & Category Quiz Board
              </span>
              <h1 class="festive" style="font-size:78px; margin-top:8px;">"Survey Says…" Flip the Top Answers!</h1>
            </div>
            <div style="background:#fff; color:#0B2E24; border-radius:26px; padding:26px; text-align:center;">
              <div class="ui" style="font-size:40px;">"Name something people do on Christmas morning"</div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px;">
              ${answers
                .map(([txt, pts], idx) =>
                  idx < openCount
                    ? `<div style="background:#D62839; border:4px solid #fff; border-radius:22px; padding:24px 28px; display:flex; justify-content:space-between; font-size:28px; font-weight:900;">
                        <span>${txt}</span>
                        <span style="background:#fff; color:#D62839; padding:4px 18px; border-radius:12px;">${pts}</span>
                      </div>`
                    : `<div style="background:#0E3B2E; border:3px solid rgba(255,255,255,0.4); border-radius:22px; padding:24px 28px; text-align:center; font-size:32px; font-weight:900;">
                        #${idx + 1}
                      </div>`
                )
                .join("")}
            </div>
            <div style="text-align:center; font-size:26px; font-weight:800; color:#FFE5E8;">
              🔔 Plus Fastest-Finger Phone Buzzer & Animated Red Strike X's!
            </div>
          </div>
        </body></html>`;
      },
    },
    // Scene 4: Winner Podium & Try Demo CTA (45 frames = 2.25s)
    {
      frames: 45,
      render: () => {
        return `<!DOCTYPE html><html><head><style>${VIDEO_CSS}</style></head><body>
          <div class="candy"></div>
          <div class="wrap" style="text-align:center;">
            <div>
              <span style="background:#FFFFFF; color:#D62839; padding:10px 28px; border-radius:999px; font-size:22px; font-weight:900;">
                🏆 INSTANT DIGITAL ACCESS ON ETSY
              </span>
              <h1 class="festive" style="font-size:90px; margin-top:10px;">And the Christmas Champion Is…</h1>
            </div>
            <div style="display:flex; justify-content:center; align-items:flex-end; gap:36px; margin: 10px 0;">
              <div style="background:#185443; border:4px solid #fff; border-radius:28px 28px 0 0; width:260px; height:240px; padding:24px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <div style="font-size:56px;">🥈 🦌</div>
                <div class="ui" style="font-size:32px; margin-top:8px;">Dasher Dan</div>
                <div style="font-size:26px; font-weight:900;">2,450 pts</div>
              </div>
              <div style="background:#D62839; border:5px solid #fff; border-radius:28px 28px 0 0; width:300px; height:320px; padding:24px; display:flex; flex-direction:column; justify-content:center; align-items:center; box-shadow:0 20px 50px rgba(0,0,0,0.5);">
                <div style="font-size:68px;">🏆 🎅</div>
                <div class="ui" style="font-size:40px; margin-top:8px;">Jingle Jess</div>
                <div style="font-size:32px; font-weight:900;">3,120 pts</div>
              </div>
              <div style="background:#185443; border:4px solid #fff; border-radius:28px 28px 0 0; width:260px; height:200px; padding:24px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                <div style="font-size:52px;">🥉 🤶</div>
                <div class="ui" style="font-size:30px; margin-top:8px;">Aunt Sarah</div>
                <div style="font-size:24px; font-weight:900;">1,980 pts</div>
              </div>
            </div>
            <div style="background:#FFFFFF; color:#C1121F; padding:22px 48px; border-radius:999px; font-size:34px; font-weight:900; display:inline-block; margin:0 auto;">
              🎮 Try Free Live Demo: christmasparty.live/demo
            </div>
          </div>
        </body></html>`;
      },
    },
  ]);

  console.log("Rendering Video 2: Host Studio & Question Generator Demo...");
  await renderVideo(browser, "02-game-studio-and-generator-demo.mp4", [
    // Scene 1: Interactive Christmas Game Studio (50 frames)
    {
      frames: 50,
      render: (p) => {
        const activeIdx = Math.floor(p * 6) % 6;
        const modes = [
          ["🎄", "Classic Xmas Trivia", "Live Quiz"],
          ["😂", "Funny & Weird Xmas", "Hilarious Facts"],
          ["🎬", "Christmas Movies", "Home Alone, Elf"],
          ["🔔", "Holiday Top Answers Showdown", "Survey Showdown"],
          ["🎁", "Holiday Quiz Board", "5x5 Category Grid"],
          ["🍿", "Emoji Movie Buzzer", "Fastest Finger"],
        ];
        return `<!DOCTYPE html><html><head><style>${VIDEO_CSS}</style></head><body>
          <div class="candy"></div>
          <div class="wrap">
            <div style="text-align:center;">
              <span style="background:#D62839; border:3px solid #fff; padding:10px 28px; border-radius:999px; font-size:22px; font-weight:900;">
                INSIDE YOUR PRIVATE CHRISTMAS GAME STUDIO
              </span>
              <h1 class="festive" style="font-size:80px; margin-top:10px;">12 Ready-to-Play Packs + Custom Builder</h1>
            </div>
            <div style="background:#fff; color:#0B2E24; border-radius:32px; padding:36px;">
              <div class="ui" style="font-size:36px; margin-bottom:20px; color:#D62839;">
                Step 1: What kind of Christmas game do you want to build?
              </div>
              <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:18px;">
                ${modes
                  .map(
                    ([e, t, s], idx) => `
                  <div style="background:${idx === activeIdx ? "#D62839" : "#0E3B2E"}; color:#fff; border:4px solid ${
                      idx === activeIdx ? "#11221B" : "transparent"
                    }; transform:scale(${idx === activeIdx ? "1.04" : "1"}); border-radius:22px; padding:24px; text-align:center;">
                    <div style="font-size:52px;">${e}</div>
                    <div class="ui" style="font-size:28px; margin-top:8px;">${t}</div>
                    <div style="font-size:18px; opacity:0.85;">${s}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            <div style="text-align:center; font-size:26px; font-weight:800; color:#FFE5E8;">
              Activate with Your Etsy Order # · No Software to Install!
            </div>
          </div>
        </body></html>`;
      },
    },
    // Scene 2: 1-Click Question Generator (55 frames)
    {
      frames: 55,
      render: (p) => {
        const count = Math.min(3, Math.floor(p * 4) + 1);
        const qs = [
          "1. Which reindeer has a shiny glowing red nose? (✓ Ruby Reindeer)",
          "2. What grumpy green character stole Christmas from Whoville? (✓ The Green Goblin)",
          "3. In 'Elf', what is the first rule of The Code of Elves? (✓ Treat every day like Christmas!)",
        ];
        return `<!DOCTYPE html><html><head><style>${VIDEO_CSS}</style></head><body>
          <div class="candy"></div>
          <div class="wrap">
            <div style="text-align:center;">
              <span style="background:#FFFFFF; color:#D62839; padding:10px 28px; border-radius:999px; font-size:22px; font-weight:900;">
                ✨ 13-TOPIC CHRISTMAS QUESTION GENERATOR
              </span>
              <h1 class="festive" style="font-size:80px; margin-top:10px;">Generate Fresh Questions in 1 Click!</h1>
            </div>
            <div style="background:#fff; color:#0B2E24; border-radius:32px; padding:36px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:22px;">
                <span class="ui" style="font-size:34px; color:#0B2E24;">Selected Vibe: 🎬 Christmas Movies & Quotes</span>
                <span style="background:#D62839; color:#fff; padding:14px 30px; border-radius:999px; font-size:24px; font-weight:900;">
                  ✨ Generating Questions…
                </span>
              </div>
              <div style="display:flex; flex-direction:column; gap:16px;">
                ${qs
                  .slice(0, count)
                  .map(
                    (q) => `
                  <div style="background:#0E3B2E; color:#fff; padding:22px 28px; border-radius:20px; font-size:26px; font-weight:800;">
                    ${q}
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            <div style="text-align:center; font-size:26px; font-weight:800; color:#FFE5E8;">
              Edit Any Question, Add Inside Jokes, Then Click "Host Live ▶"!
            </div>
          </div>
        </body></html>`;
      },
    },
  ]);

  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  await browser.close();
  console.log("All Etsy assets generated successfully!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
