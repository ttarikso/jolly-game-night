#!/usr/bin/env python3
"""
Upload Jolly Christmas Game Night (Interactive Live TV & Phone Party Game Bundle)
to DigitarMercato Etsy Shop (Shop ID: 58103810).
"""

import json
import os
import time
from pathlib import Path
import requests

PROJECT_DIR = Path("/Users/tariksoysal/.gemini/antigravity/scratch/jolly-game-night")
ASSETS_DIR = PROJECT_DIR / "public" / "etsy-assets"
IMAGES_DIR = ASSETS_DIR / "images"
PDF_PATH = ASSETS_DIR / "DigitarMercato_Jolly_Christmas_Game_Night_Access_Guide.pdf"
VIDEO_PATH = ASSETS_DIR / "videos" / "jolly-christmas-full-etsy-showcase.mp4"

TOKENS_PATH = Path("/Users/tariksoysal/.gemini/antigravity/scratch/etsy-digitarmercato/tokens.json")
KEYSTRING = "nk561ml29wn72ei4a2aghmkn"
SHARED_SECRET = "qij7tkrw6a"
SHOP_ID = "58103810"


def get_headers():
    with open(TOKENS_PATH) as f:
        tok = json.load(f)

    if time.time() > tok.get("expires_at", 0) - 120:
        print("🔄 Refreshing DigitarMercato access token...")
        rf = requests.post(
            "https://api.etsy.com/v3/public/oauth/token",
            data={
                "grant_type": "refresh_token",
                "client_id": KEYSTRING,
                "refresh_token": tok["refresh_token"],
            },
        )
        if rf.status_code == 200:
            new_tok = rf.json()
            tok.update(new_tok)
            tok["expires_at"] = time.time() + new_tok["expires_in"]
            with open(TOKENS_PATH, "w") as fw:
                json.dump(tok, fw, indent=2)
            print("  ✅ Token refreshed successfully.")
        else:
            print("  ❌ Token refresh failed:", rf.text)

    return {
        "x-api-key": f"{KEYSTRING}:{SHARED_SECRET}",
        "Authorization": f"Bearer {tok['access_token']}",
    }


def get_or_create_section(headers, title="Party Games & Trivia"):
    r = requests.get(f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/sections", headers=headers, timeout=20)
    if r.status_code == 200:
        for sec in r.json().get("results", []):
            if sec.get("title", "").strip().lower() == title.lower():
                return sec["shop_section_id"]
    # Create section if not found
    rc = requests.post(
        f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/sections",
        headers=headers,
        data={"title": title},
        timeout=20,
    )
    if rc.status_code in (200, 201):
        return rc.json().get("shop_section_id")
    return None


TITLE = "Interactive Christmas Party Game Bundle, Live TV & Phone Buzzer Trivia, Holiday Top Answers Quiz Board Quiz, Office Family Christmas Games"

TAGS = [
    "christmas party game",
    "Holiday Top Answers",
    "christmas Quiz Board",
    "interactive tv game",
    "phone buzzer trivia",
    "office christmas",
    "christmas quiz game",
    "holiday trivia night",
    "zoom christmas game",
    "family game night",
    "kids christmas quiz",
    "christmas icebreaker",
    "phone trivia game",
]

DESCRIPTION = """🎄 TURN YOUR TV INTO A LIVE CHRISTMAS GAME SHOW — EVERYONE PLAYS FROM THEIR PHONE! 🎅

Looking for an unforgettable Christmas party game where nobody has to print sheets of paper, pass around pens, or keep score by hand? With Jolly Game Night, your TV (or laptop / Zoom screen) becomes the live game show stage, and every guest's smartphone becomes their live controller & buzzer!

━━━━━━━━━━━━━━━━━━━━━
🎮 TRY THE FREE INTERACTIVE DEMO BEFORE YOU BUY:
━━━━━━━━━━━━━━━━━━━━━
👉 https://christmasparty.live/demo
Copy & paste the link above into your browser to test the Split-Screen TV + Phone Buzzer Simulator, try all 20 cartoon holiday avatars, flip Top Answers survey tiles, and preview the built-in Question Generator right now!

━━━━━━━━━━━━━━━━━━━━━
🌟 WHY HOSTS LOVE JOLLY GAME NIGHT:
━━━━━━━━━━━━━━━━━━━━━
✔ ZERO App Downloads or Player Logins — Guests simply point their phone camera at the QR code on your TV, pick one of 20 cute cartoon holiday avatars, type their nickname, and pop up live on the big screen!
✔ 4 Complete TV Game Show Modes Included:
  1. 🎄 Live Multiple-Choice Trivia (SPEED-BONUS speed-bonus quiz on phones)
  2. 🔔 Holiday Top Answers ("Top Answers" flip-tile survey board + giant red strikes!)
  3. 🎁 Christmas Category Quiz Board (5x5 category grid + phone buzzers + Final Wager)
  4. 🎅 Emoji, Riddle & Song Buzzer (Fastest-finger phone buzz-in locks out everyone else!)
✔ 12 Ready-to-Play Christmas Game Packs — Classic Trivia, Christmas Movies, Festive Carols, Kids' North Pole Quiz, Big Holiday Quiz Board Board, Survey Says Christmas, Top Answers, Emoji Movies, Emoji Songs, Cozy Riddles, Finish the Lyric & Who Am I!
✔ Built-In 13-Topic Christmas Question Generator — Want funny holiday facts, "Would You Rather", "Most Likely To", or office party icebreakers? Generate fresh Christmas questions in 1 click!
✔ 20 Custom Cartoon Holiday Avatars — Santa, Mrs. Claus, Ruby Reindeer, Chilly Snowman, Gingerbread, Grumpy Goblin Goblin, Nutcracker, Penguin, Polar Bear, Elves & more!
✔ 100% Customizable Game Studio — Edit any question, adjust timers, or write your own family & coworker inside jokes!

━━━━━━━━━━━━━━━━━━━━━
⚡ HOW IT WORKS IN 3 EASY STEPS:
━━━━━━━━━━━━━━━━━━━━━
1. Purchase this listing on Etsy and download your Instant Access Guide PDF.
2. Visit https://christmasparty.live/redeem and enter your Etsy Order Number once to unlock your private Christmas Game Studio.
3. Choose any of the 12 game packs (or generate custom questions), display the host screen on your TV or Zoom, and let everyone scan the QR code to play!

━━━━━━━━━━━━━━━━━━━━━
📺 COMPATIBILITY & GROUP SIZE:
━━━━━━━━━━━━━━━━━━━━━
• Group Size: 2 to 50+ Players (Play Individual Free-For-All or Team Mode!)
• Big Screen Display: Works on any laptop/computer connected to a TV via HDMI, AirPlay, or Chromecast, Smart TV browsers, or shared over Zoom / Microsoft Teams / Google Meet.
• Player Controllers: Works on any iPhone, iPad, or Android smartphone web browser.
• One-Time Purchase: Lifetime access to your studio with unlimited games, rooms & replays — no subscription or per-player fees!

Questions or need help? Message us anytime on Etsy at DigitarMercato — we're always happy to help!"""


def main():
    headers = get_headers()
    section_id = get_or_create_section(headers, "Party Games & Trivia")
    print(f"📂 Using Shop Section ID: {section_id}")

    price = 12.99
    print(f"🚀 Creating Jolly Christmas Game Night Draft Listing on DigitarMercato (${price})...")

    payload = {
        "quantity": 999,
        "title": TITLE[:140],
        "description": DESCRIPTION,
        "price": price,
        "who_made": "i_did",
        "when_made": "2020_2026",
        "taxonomy_id": 1790,  # Toys & Games > Games & Puzzles > Party Games
        "type": "download",
        "state": "draft",
        "tags": TAGS[:13],
        "materials": ["Interactive Web App", "Live TV Trivia", "Phone Buzzer Game", "PDF Access Guide", "QR Code Party Game"],
        "should_auto_renew": True,
    }
    if section_id:
        payload["shop_section_id"] = section_id

    url_create = f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings"
    r = requests.post(url_create, headers=headers, json=payload, timeout=30)
    if r.status_code not in (200, 201):
        print(f"❌ Failed to create listing: {r.status_code} - {r.text}")
        return

    lid = r.json()["listing_id"]
    print(f"✅ Listing Created Successfully! Listing ID: {lid}")
    print(f"🔗 URL: https://www.etsy.com/listing/{lid}")

    # Update inventory price & SKU
    inv_payload = {
        "products": [
            {
                "sku": "DM-JOLLY-XMAS-GAME-NIGHT",
                "property_values": [],
                "offerings": [
                    {
                        "price": price,
                        "quantity": 999,
                        "is_enabled": True,
                        "readiness_state_id": None,
                    }
                ],
            }
        ]
    }
    requests.put(
        f"https://api.etsy.com/v3/application/listings/{lid}/inventory",
        headers=headers,
        json=inv_payload,
        timeout=20,
    )

    # Upload Images (Etsy allows up to 20 images via API; let's upload our top 16 images!)
    image_files = sorted(list(IMAGES_DIR.glob("*.png")))
    print(f"\n🖼️ Uploading {len(image_files)} High-Res Listing Images to Etsy...")
    url_img = f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings/{lid}/images"
    uploaded_imgs = 0

    for rank, img_path in enumerate(image_files, start=1):
        alt_text = f"Interactive Christmas Party Game Night Live TV & Phone Buzzer Trivia - Slide {rank}"
        with open(img_path, "rb") as fp:
            res = requests.post(
                url_img,
                headers=headers,
                files={"image": (img_path.name, fp, "image/png")},
                data={"rank": rank, "alt_text": alt_text},
                timeout=60,
            )
            if res.status_code in (200, 201):
                img_id = res.json().get("listing_image_id")
                uploaded_imgs += 1
                print(f"  ✅ [{rank}/{len(image_files)}] Uploaded {img_path.name} -> Image ID: {img_id}")
            else:
                print(f"  ⚠️ [{rank}/{len(image_files)}] {img_path.name}: {res.status_code} - {res.text}")
        time.sleep(0.25)

    # Upload Digital Delivery PDF
    print("\n📦 Uploading Digital Delivery Access Card PDF...")
    url_file = f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings/{lid}/files"
    with open(PDF_PATH, "rb") as fp:
        res = requests.post(
            url_file,
            headers=headers,
            files={"file": (PDF_PATH.name, fp, "application/pdf")},
            data={"name": PDF_PATH.name, "rank": 1},
            timeout=60,
        )
        if res.status_code in (200, 201):
            fid = res.json().get("listing_file_id")
            print(f"  ✅ Uploaded Delivery PDF {PDF_PATH.name} -> File ID: {fid}")
        else:
            print(f"  ❌ Failed PDF upload: {res.status_code} - {res.text}")

    # Upload Showcase Video
    print("\n🎬 Uploading Showcase Video to Etsy...")
    url_vid = f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings/{lid}/videos"
    with open(VIDEO_PATH, "rb") as fp:
        res = requests.post(
            url_vid,
            headers=headers,
            files={"video": (VIDEO_PATH.name, fp, "video/mp4")},
            data={"name": "Jolly Christmas Game Night Live Demo"},
            timeout=120,
        )
        if res.status_code in (200, 201):
            vid_id = res.json().get("video_id")
            print(f"  ✅ Uploaded Showcase Video -> Video ID: {vid_id}")
        else:
            print(f"  ⚠️ Video upload response: {res.status_code} - {res.text}")

    print("\n=======================================================")
    print("🎉 JOLLY CHRISTMAS GAME NIGHT UPLOADED TO DIGITARMERCATO!")
    print(f"Listing ID: {lid}")
    print(f"Edit / Preview URL: https://www.etsy.com/your/shops/me/listing-editor/edit/{lid}")
    print(f"Public URL: https://www.etsy.com/listing/{lid}")
    print(f"Images Uploaded: {uploaded_imgs}")
    print("=======================================================")


if __name__ == "__main__":
    main()
