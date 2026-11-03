import { chromium } from "/Users/tariksoysal/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import path from "path";
import { execSync } from "child_process";

const OUT_DIR = path.resolve(process.cwd(), "public/etsy-assets");
const PDF_PATH = path.join(OUT_DIR, "DigitarMercato_Jolly_Christmas_Game_Night_Access_Guide.pdf");
const COMBINED_VID = path.join(OUT_DIR, "videos/jolly-christmas-full-etsy-showcase.mp4");

const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Mountains+of+Christmas:wght@700&family=Nunito:wght@600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    body {
      width: 210mm;
      height: 297mm;
      font-family: 'Nunito', sans-serif;
      background: radial-gradient(ellipse 90% 80% at 50% 30%, #185443, #0B2E24 65%, #06201A 100%);
      color: #FFFFFF;
      padding: 16mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .candy {
      position: absolute; top: 0; left: 0; right: 0; height: 6mm;
      background: repeating-linear-gradient(45deg, #D62839, #D62839 15px, #FFFFFF 15px, #FFFFFF 30px, #185443 30px, #185443 45px);
    }
    .candy-bottom {
      position: absolute; bottom: 0; left: 0; right: 0; height: 6mm;
      background: repeating-linear-gradient(45deg, #D62839, #D62839 15px, #FFFFFF 15px, #FFFFFF 30px, #185443 30px, #185443 45px);
    }
    .festive { font-family: 'Mountains of Christmas', cursive; font-weight: 700; }
    .ui { font-family: 'Fredoka', sans-serif; font-weight: 700; }
    .card-white {
      background: #FFFFFF;
      color: #11221B;
      border-radius: 22px;
      padding: 24px 28px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.3);
    }
    .card-red {
      background: linear-gradient(180deg, #E63946, #B81424);
      border: 3px solid #FFFFFF;
      color: #FFFFFF;
      border-radius: 22px;
      padding: 26px 30px;
      text-align: center;
    }
    .step {
      display: flex; gap: 16px; align-items: flex-start;
      padding: 14px 0;
      border-bottom: 2px dashed #E2ECE7;
    }
    .step:last-child { border-bottom: none; }
    .num {
      width: 42px; height: 42px; border-radius: 12px;
      background: #D62839; color: #fff;
      font-weight: 900; font-size: 22px;
      display: grid; place-items: center; flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="candy"></div>

  <div style="text-align:center; margin-top: 4mm;">
    <span style="background:#D62839; border:2px solid #fff; padding:6px 20px; border-radius:999px; font-size:12px; font-weight:900; letter-spacing:0.08em; text-transform:uppercase;">
      🎄 OFFICIAL DIGITARMERCATO ACCESS CARD & QUICK-START GUIDE 🎅
    </span>
    <h1 class="festive" style="font-size: 54px; margin-top: 8px; line-height: 1.05;">
      Jolly Christmas Game Night
    </h1>
    <p style="font-size: 16px; color: #FFE5E8; font-weight: 700; margin-top: 4px;">
      Thank you for your purchase! Follow the 3 simple steps below to unlock your private Game Studio.
    </p>
  </div>

  <div class="card-red">
    <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; color: #FFE5E8;">
      CLICK OR TYPE THIS LINK IN YOUR WEB BROWSER TO ACTIVATE:
    </div>
    <div style="margin: 12px 0;">
      <a href="https://christmasparty.live/redeem" style="display:inline-block; background:#FFFFFF; color:#C1121F; text-decoration:none; font-size:28px; font-weight:900; padding:12px 32px; border-radius:999px;">
        https://christmasparty.live/redeem
      </a>
    </div>
    <p style="font-size: 14px; font-weight: 700;">
      Enter your <b>Etsy Order Number</b> (10-digit receipt number from your Etsy confirmation email or "Purchases & Reviews" page) to unlock instant access!
    </p>
  </div>

  <div class="card-white">
    <h2 class="ui" style="font-size: 22px; color: #0B2E24; margin-bottom: 8px;">
      ⚡ How to Host Your Party in 3 Easy Steps
    </h2>
    <div class="step">
      <div class="num">1</div>
      <div>
        <div class="ui" style="font-size: 17px; color: #0B2E24;">Activate With Your Etsy Order Number</div>
        <p style="font-size: 13.5px; color: #2C3E35; font-weight: 700; margin-top: 2px;">
          Visit <b>christmasparty.live/redeem</b> and enter your Etsy Order # once. You'll also receive a personal <b>Access Key</b> so you can log back in from any laptop, tablet, or Smart TV anytime!
        </p>
      </div>
    </div>
    <div class="step">
      <div class="num" style="background:#185443;">2</div>
      <div>
        <div class="ui" style="font-size: 17px; color: #0B2E24;">Choose a Pack or Generate Custom Questions</div>
        <p style="font-size: 13.5px; color: #2C3E35; font-weight: 700; margin-top: 2px;">
          Inside your studio, pick from <b>12 Ready-to-Play Christmas Game Packs</b> (Trivia, Top Answers, Category Quiz Board, Emoji Movies/Songs, Riddles, Finish the Lyric) OR use the <b>13-Topic Question Generator</b> to create fresh questions in 1 click!
        </p>
      </div>
    </div>
    <div class="step">
      <div class="num">3</div>
      <div>
        <div class="ui" style="font-size: 17px; color: #0B2E24;">Put on the Big Screen & Scan the QR Code!</div>
        <p style="font-size: 13.5px; color: #2C3E35; font-weight: 700; margin-top: 2px;">
          Click <b>Host Live ▶</b> and display the screen on your TV (via HDMI, AirPlay, Chromecast) or share your screen on Zoom. Players simply scan the QR code with their phone camera, pick one of <b>20 Cartoon Holiday Avatars</b>, and play!
        </p>
      </div>
    </div>
  </div>

  <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px;">
    <div style="background:rgba(255,255,255,0.1); border:2px solid rgba(255,255,255,0.25); border-radius:18px; padding:16px 20px;">
      <div class="ui" style="font-size: 16px; color:#FFFFFF;">💡 Pro Tip for TV & Zoom</div>
      <p style="font-size: 12.5px; color:#FFE5E8; margin-top:4px; font-weight:700;">
        Press <b>F11</b> (or fullscreen) on your laptop when hosting on the TV, and turn up your speaker volume for the built-in buzzer & game-show sound effects!
      </p>
    </div>
    <div style="background:rgba(255,255,255,0.1); border:2px solid rgba(255,255,255,0.25); border-radius:18px; padding:16px 20px;">
      <div class="ui" style="font-size: 16px; color:#FFFFFF;">💬 Need Help? We're Here!</div>
      <p style="font-size: 12.5px; color:#FFE5E8; margin-top:4px; font-weight:700;">
        If your Etsy order was placed within the last few minutes and hasn't synced yet, message us on Etsy at <b>DigitarMercato</b> and we'll activate it right away!
      </p>
    </div>
  </div>

  <div style="text-align:center; font-size:12px; color:#FFE5E8; opacity:0.85; margin-bottom: 4mm;">
    © DigitarMercato · Live App: https://christmasparty.live · Interactive Demo: https://christmasparty.live/demo
  </div>

  <div class="candy-bottom"></div>
</body>
</html>`;

async function main() {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  await page.setContent(HTML, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: PDF_PATH, format: "A4", printBackground: true });
  await browser.close();
  console.log("Generated PDF:", PDF_PATH);

  // Also merge the 2 videos into a 14.5-second combined Etsy showcase video!
  const v1 = path.join(OUT_DIR, "videos/01-live-party-gameplay-demo.mp4");
  const v2 = path.join(OUT_DIR, "videos/02-game-studio-and-generator-demo.mp4");
  execSync(
    `ffmpeg -y -i "${v1}" -i "${v2}" -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" -t 14.8 -c:v libx264 -pix_fmt yuv420p -crf 20 "${COMBINED_VID}"`,
    { stdio: "inherit" }
  );
  console.log("Generated Combined Video:", COMBINED_VID);
}

main();
