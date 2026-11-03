#!/usr/bin/env python3
"""
1. Upload 4 targeted niche Christmas Party Game listings to DigitarMercato (Shop ID: 58103810)
   using our 16 sanitized high-res images (re-ordered so each listing has a unique niche #1 cover),
   2 delivery PDFs, and 14.7s showcase video.
2. Generate 5 vertical 1000x1500 Pinterest Pins (for all 5 Christmas Game listings including #4609341824)
   and create the ready-to-import Pinterest Bulk Upload CSV with live Etsy CDN Media URLs.
"""

import csv
import json
import os
import time
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import requests

PROJECT_DIR = Path("/Users/tariksoysal/.gemini/antigravity/scratch/jolly-game-night")
ASSETS_DIR = PROJECT_DIR / "public" / "etsy-assets"
IMAGES_DIR = ASSETS_DIR / "images"
PINS_LOCAL_DIR = ASSETS_DIR / "pinterest"
PINS_LOCAL_DIR.mkdir(parents=True, exist_ok=True)

DESKTOP_PIN_DIR = Path("/Users/tariksoysal/Desktop/DigitarMercato_Pinterest")
DESKTOP_PINS_SUB = DESKTOP_PIN_DIR / "pins"
DESKTOP_PINS_SUB.mkdir(parents=True, exist_ok=True)

PDF_AC = ASSETS_DIR / "DigitarMercato_Jolly_Christmas_Game_Night_Access_Guide.pdf"
PDF_HB = ASSETS_DIR / "DigitarMercato_Jolly_Christmas_Complete_Host_Handbook.pdf"
VIDEO_PATH = ASSETS_DIR / "videos" / "jolly-christmas-full-etsy-showcase.mp4"

TOKENS_PATH = Path("/Users/tariksoysal/.gemini/antigravity/scratch/etsy-digitarmercato/tokens.json")
KEYSTRING = "nk561ml29wn72ei4a2aghmkn"
SHARED_SECRET = "qij7tkrw6a"
SHOP_ID = "58103810"
SECTION_ID = 61281933  # Party Games & Trivia


def get_headers():
    with open(TOKENS_PATH) as f:
        tok = json.load(f)

    if time.time() > tok.get("expires_at", 0) - 120:
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

    return {
        "x-api-key": f"{KEYSTRING}:{SHARED_SECRET}",
        "Authorization": f"Bearer {tok['access_token']}",
    }


BASE_DESCRIPTION_BODY = """━━━━━━━━━━━━━━━━━━━━━
🎮 TRY THE FREE INTERACTIVE DEMO BEFORE YOU BUY:
━━━━━━━━━━━━━━━━━━━━━
👉 https://christmasparty.live/demo
Copy & paste the link above into your browser to test the Split-Screen TV + Phone Buzzer Simulator, try all 20 cartoon holiday avatars, flip Top Answers survey tiles, and preview the built-in Question Generator right now!

━━━━━━━━━━━━━━━━━━━━━
🌟 EVERYTHING UNLOCKED WITH YOUR ORDER:
━━━━━━━━━━━━━━━━━━━━━
✔ ZERO App Downloads or Player Logins — Guests simply point their phone camera at the QR code on your TV or shared Zoom screen, pick one of 20 cute cartoon holiday avatars, type their nickname, and pop up live on the big screen!
✔ All 4 Complete TV Game Show Formats Included:
  1. 🎄 Live Multiple-Choice Trivia (Speed-bonus quiz on phones)
  2. 🔔 Holiday Top Answers Showdown (Flip-tile survey board + giant red strikes!)
  3. 🎁 Holiday Category Quiz Board (5x5 category grid + phone buzzers + Final Wager)
  4. 🎅 Emoji, Riddle & Song Buzzer (Fastest-finger phone buzz-in locks out everyone else!)
✔ 12 Ready-to-Play Christmas Game Packs — Classic Trivia, Christmas Movies, Festive Carols, Kids' North Pole Quiz, Big Holiday Quiz Board, Survey Says Christmas, Family Holiday Poll, Emoji Movies, Emoji Songs, Cozy Riddles, Finish the Lyric & Who Am I!
✔ Built-In 13-Topic Christmas Question Generator — Generate fresh Christmas questions (Funny Facts, Movies, Music, True/False, Would You Rather, Most Likely To, Kids, Office Party & more) in 1 click!
✔ 20 Custom Cartoon Holiday Avatars — Santa, Mama Claus, Ruby Reindeer, Chilly Snowman, Gingerbread, Grumpy Goblin, Captain Tinsel, Penguin, Polar Bear, Elves & more!
✔ 100% Customizable Game Studio — Edit any question, adjust timers, or write your own family & coworker inside jokes!

━━━━━━━━━━━━━━━━━━━━━
⚡ HOW IT WORKS IN 3 EASY STEPS:
━━━━━━━━━━━━━━━━━━━━━
1. Purchase this listing on Etsy and download your Instant Access Guide PDF + 5-Page Visual Host Handbook.
2. Visit https://christmasparty.live/redeem and enter your Etsy Order Number once to unlock your private Christmas Game Studio immediately.
3. Choose any of the 12 game packs (or generate custom questions), display the host screen on your TV or Zoom, and let everyone scan the QR code to play!"""


NICHE_LISTINGS = [
    {
        "slug": "office-zoom-christmas-party-game",
        "sku": "DM-JOLLY-XMAS-OFFICE-ZOOM",
        "lead_image": "13-perfect-for-every-gathering.png",
        "title": "Office Christmas Party Game, Virtual Zoom Holiday Trivia & Team Building Icebreaker, Live TV Phone Buzzer Quiz for Work Groups",
        "pin_title": "Interactive Office Christmas Party Game | Live TV & Zoom Phone Buzzer Trivia",
        "pin_subtitle": "No App Downloads • Scan QR to Join • 2 to 50+ Players on TV or Zoom",
        "board": "Holiday & Christmas Printables",
        "tags": [
            "office christmas",
            "work holiday party",
            "zoom christmas game",
            "team building game",
            "virtual party game",
            "coworker trivia",
            "holiday icebreaker",
            "staff party game",
            "corporate christmas",
            "phone buzzer trivia",
            "interactive quiz",
            "christmas trivia",
            "live tv party game",
        ],
        "intro": """🥂 THE ULTIMATE INTERACTIVE OFFICE & VIRTUAL ZOOM CHRISTMAS PARTY GAME! 🎄

Planning an in-person office holiday party or a remote Zoom / Microsoft Teams celebration? Skip the awkward silence and boring slideshows! With Jolly Game Night, your TV or shared Zoom screen becomes a live game show stage, and every coworker's smartphone becomes their controller & buzzer!""",
    },
    {
        "slug": "holiday-top-answers-survey-game",
        "sku": "DM-JOLLY-XMAS-TOP-ANSWERS",
        "lead_image": "08-family-poll-mode-showcase.png",
        "title": "Holiday Top Answers Survey Game, Interactive Christmas Team Showdown on TV & Phones, Live Buzzer Poll Game for Family Friends",
        "pin_title": "Holiday Top Answers Survey Showdown | Interactive TV & Phone Party Game",
        "pin_subtitle": "Flip Survey Tiles on TV • Live Smartphone Buzzers • Giant Red Strikes",
        "board": "Holiday & Christmas Printables",
        "tags": [
            "holiday survey game",
            "top answers game",
            "christmas team game",
            "family game night",
            "phone buzzer game",
            "tv survey quiz",
            "christmas poll game",
            "group holiday game",
            "adult christmas game",
            "interactive tv game",
            "party game bundle",
            "holiday trivia",
            "christmas showdown",
        ],
        "intro": """🔔 "SURVEY SAYS…" LIVE INTERACTIVE HOLIDAY TOP ANSWERS SHOWDOWN ON YOUR TV! 🎄

Bring the excitement of a live survey game show straight to your living room TV! Two holiday teams face off using their smartphones as live buzzers while the host flips hidden survey answers on the big screen, banks the points, and triggers giant animated red ✕ strikes!""",
    },
    {
        "slug": "christmas-emoji-song-lyric-buzzer",
        "sku": "DM-JOLLY-XMAS-EMOJI-LYRIC",
        "lead_image": "10-emoji-song-buzzer-showcase.png",
        "title": "Christmas Emoji Movie & Song Buzzer Game, Finish the Holiday Lyric Live TV Party Quiz, Interactive Smartphone Buzzer Game Night",
        "pin_title": "Christmas Emoji & Finish the Lyric Buzzer Game | Live TV & Phone Party Quiz",
        "pin_subtitle": "Phones Become Live Buzzers • Emoji Movies & Songs • Riddles & Trivia",
        "board": "Holiday & Christmas Printables",
        "tags": [
            "emoji christmas game",
            "finish the lyric",
            "christmas song quiz",
            "holiday movie trivia",
            "phone buzzer game",
            "christmas music game",
            "guess the carol",
            "christmas riddles",
            "interactive tv game",
            "family christmas",
            "party buzzer quiz",
            "qr code party game",
            "holiday game night",
        ],
        "intro": """🎅 TURN EVERY GUEST'S PHONE INTO A LIVE CHRISTMAS GAME SHOW BUZZER! 🔔

Who can decode the Christmas movie from emojis first? Who knows the next line to 'All I Want for Christmas Is You'? Display the clue on your TV and watch everyone race to smash the giant red BUZZ! button on their phone — millisecond-accurate lockout shows whose finger was fastest!""",
    },
    {
        "slug": "kids-classroom-christmas-quiz-game",
        "sku": "DM-JOLLY-XMAS-KIDS-CLASS",
        "lead_image": "06-20-cartoon-holiday-avatars.png",
        "title": "Kids Classroom Christmas Quiz Game, Interactive Smartboard & TV Holiday Trivia with 20 Cartoon Avatars, Family Friendly Party Game",
        "pin_title": "Interactive Kids & Classroom Christmas Quiz | 20 Cartoon Holiday Avatars",
        "pin_subtitle": "Play on Smartboard or TV • Kids & All-Ages Packs • Instant QR Join",
        "board": "Kids Activities, Routines & Games",
        "tags": [
            "kids christmas game",
            "classroom christmas",
            "smartboard game",
            "school holiday party",
            "youth group game",
            "family trivia game",
            "north pole quiz",
            "christmas avatars",
            "interactive quiz",
            "teacher christmas",
            "no print party game",
            "kids trivia night",
            "holiday classroom",
        ],
        "intro": """🦌 THE MOST EXCITING INTERACTIVE CHRISTMAS GAME FOR FAMILIES, KIDS & CLASSROOMS! 🎄

When players scan the QR code on your TV or classroom Smartboard, they get to pick from 20 adorable Cartoon Holiday Avatars (Jolly Santa, Ruby the Reindeer, Chilly the Snowman, Gingy Cookie, Pingo Penguin & more) and watch their character pop up live on the big screen!""",
    },
]


def render_festive_pin(cover_path: Path, title_display: str, subtitle_display: str, price_str: str, out_path: Path):
    W, H = 1000, 1500
    try:
        f_badge_bold = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 23)
        f_badge_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 17)
        f_etsy_logo = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 38)
        f_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 30)
        f_title_sm = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 24)
        f_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
        f_header = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
    except Exception:
        f_badge_bold = f_badge_sub = f_etsy_logo = f_title = f_title_sm = f_sub = f_header = ImageFont.load_default()

    # Deep Christmas Pine Green background (#0B2E24)
    canvas = Image.new("RGB", (W, H), (11, 46, 36))
    draw = ImageDraw.Draw(canvas)

    # Top & Bottom Candy Stripe Accents
    stripe_w = 25
    colors = [(214, 40, 57), (255, 255, 255), (24, 84, 67)]
    for idx, x in enumerate(range(0, W, stripe_w)):
        c = colors[idx % 3]
        draw.rectangle([x, 0, x + stripe_w, 14], fill=c)
        draw.rectangle([x, H - 14, x + stripe_w, H], fill=c)

    # 1. Header Pill
    h_txt = "🎄 DIGITARMERCATO • LIVE TV & PHONE CHRISTMAS GAME 🎅"
    h_bb = draw.textbbox((0, 0), h_txt, font=f_header)
    hw = h_bb[2] - h_bb[0]
    hx = (W - hw) // 2
    draw.rounded_rectangle([hx - 24, 34, hx + hw + 24, 74], radius=20, fill=(214, 40, 57))
    draw.text((hx, 44), h_txt, fill=(255, 255, 255), font=f_header)

    # 2. Hero Product Image (900 x 750, 2400x2000 6:5 aspect ratio preserved!)
    tw, th = 900, 750
    cover = Image.open(cover_path).convert("RGB").resize((tw, th), Image.Resampling.LANCZOS)

    ix, iy = (W - tw) // 2, 100
    draw.rounded_rectangle([ix - 6, iy - 6, ix + tw + 6, iy + th + 6], radius=28, fill=(255, 255, 255))
    canvas.paste(cover, (ix, iy))

    # 3. White Card Below Image for Crisp Text
    draw.rounded_rectangle([50, 885, 950, 1195], radius=28, fill=(255, 255, 255))

    t_font = f_title
    t_bb = draw.textbbox((0, 0), title_display, font=t_font)
    if (t_bb[2] - t_bb[0]) > 850:
        t_font = f_title_sm
        t_bb = draw.textbbox((0, 0), title_display, font=t_font)
    draw.text(((W - (t_bb[2] - t_bb[0])) // 2, 920), title_display, fill=(11, 46, 36), font=t_font)

    s_bb = draw.textbbox((0, 0), subtitle_display, font=f_sub)
    draw.text(((W - (s_bb[2] - s_bb[0])) // 2, 975), subtitle_display, fill=(184, 20, 36), font=f_sub)

    demo_txt = "🎮 TRY FREE DEMO: christmasparty.live/demo"
    d_bb = draw.textbbox((0, 0), demo_txt, font=f_header)
    dw = d_bb[2] - d_bb[0]
    dx = (W - dw) // 2
    draw.rounded_rectangle([dx - 24, 1025, dx + dw + 24, 1068], radius=12, fill=(14, 59, 46))
    draw.text((dx, 1036), demo_txt, fill=(255, 255, 255), font=f_header)

    pr_txt = f"INSTANT DIGITAL ACCESS • {price_str} • NO APP NEEDED"
    p_bb = draw.textbbox((0, 0), pr_txt, font=f_header)
    pw = p_bb[2] - p_bb[0]
    px = (W - pw) // 2
    draw.rounded_rectangle([px - 22, 1095, px + pw + 22, 1142], radius=12, fill=(255, 229, 232))
    draw.text((px, 1109), pr_txt, fill=(184, 20, 36), font=f_header)

    # 4. Official 'AVAILABLE ON ETSY' Orange Pill Badge
    bw, bh = 580, 114
    bx, by = (W - bw) // 2, 1255
    draw.rounded_rectangle([bx - 4, by - 4, bx + bw + 4, by + bh + 4], radius=58, fill=(255, 255, 255))
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=57, fill=(241, 100, 30))

    draw.text((bx + 46, by + 32), "Etsy", fill=(255, 255, 255), font=f_etsy_logo)
    draw.line([(bx + 158, by + 22), (bx + 158, by + bh - 22)], fill=(255, 190, 160), width=2)
    draw.text((bx + 186, by + 28), "AVAILABLE ON ETSY", fill=(255, 255, 255), font=f_badge_bold)
    draw.text((bx + 186, by + 64), "Click to Shop • DigitarMercato ➔", fill=(255, 235, 225), font=f_badge_sub)

    canvas.save(out_path, quality=95)


def upload_single_niche_listing(headers, item, all_images):
    price = 12.99
    full_desc = item["intro"] + "\n\n" + BASE_DESCRIPTION_BODY
    payload = {
        "quantity": 999,
        "title": item["title"][:140],
        "description": full_desc,
        "price": price,
        "who_made": "i_did",
        "when_made": "2020_2026",
        "taxonomy_id": 1790,
        "type": "download",
        "state": "draft",
        "tags": item["tags"][:13],
        "materials": ["Interactive Web App", "Live TV Trivia", "Phone Buzzer Game", "PDF Access Guide", "QR Code Party Game"],
        "shop_section_id": SECTION_ID,
        "should_auto_renew": True,
    }

    r = requests.post(f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings", headers=headers, json=payload, timeout=30)
    if r.status_code not in (200, 201):
        raise RuntimeError(f"Failed to create listing {item['slug']}: {r.status_code} {r.text}")

    lid = r.json()["listing_id"]
    print(f"\n✅ Created Niche Listing #{lid}: {item['title'][:65]}...")

    # Inventory SKU & Price
    inv_payload = {
        "products": [
            {
                "sku": item["sku"],
                "property_values": [],
                "offerings": [{"price": price, "quantity": 999, "is_enabled": True, "readiness_state_id": None}],
            }
        ]
    }
    requests.put(f"https://api.etsy.com/v3/application/listings/{lid}/inventory", headers=headers, json=inv_payload, timeout=20)

    # Order images so lead_image is Rank #1, followed by all remaining images!
    lead_path = IMAGES_DIR / item["lead_image"]
    ordered_imgs = [lead_path] + [p for p in all_images if p.name != item["lead_image"]]

    url_img = f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings/{lid}/images"
    first_cdn_url = ""
    for rank, img_path in enumerate(ordered_imgs, start=1):
        with open(img_path, "rb") as fp:
            res = requests.post(
                url_img,
                headers=headers,
                files={"image": (img_path.name, fp, "image/png")},
                data={"rank": rank, "alt_text": f"{item['title'][:90]} - Slide {rank}"},
                timeout=60,
            )
            if res.status_code in (200, 201) and rank == 1:
                first_cdn_url = res.json().get("url_fullxfull", "")
        time.sleep(0.15)
    print(f"  🖼️ Uploaded all {len(ordered_imgs)} images (Lead cover: {item['lead_image']})")

    # Upload both PDFs
    url_file = f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings/{lid}/files"
    for rank, pdf_p in enumerate([PDF_AC, PDF_HB], start=1):
        with open(pdf_p, "rb") as fp:
            requests.post(
                url_file,
                headers=headers,
                files={"file": (pdf_p.name, fp, "application/pdf")},
                data={"name": pdf_p.name, "rank": rank},
                timeout=60,
            )
    print("  📦 Uploaded both Digital Delivery PDFs (Quick-Start + 5-Page Handbook)")

    # Upload Showcase Video
    url_vid = f"https://api.etsy.com/v3/application/shops/{SHOP_ID}/listings/{lid}/videos"
    with open(VIDEO_PATH, "rb") as fp:
        requests.post(
            url_vid,
            headers=headers,
            files={"video": (VIDEO_PATH.name, fp, "video/mp4")},
            data={"name": item["pin_title"][:45]},
            timeout=120,
        )
    print("  🎬 Uploaded 14.7s Showcase Video")

    return lid, first_cdn_url


def main():
    headers = get_headers()
    all_images = sorted(list(IMAGES_DIR.glob("*.png")))

    # Get CDN URL for Listing #1 (4609341824)
    r_l1 = requests.get("https://api.etsy.com/v3/application/listings/4609341824/images", headers=headers)
    l1_cdn = ""
    if r_l1.status_code == 200 and r_l1.json().get("results"):
        l1_cdn = r_l1.json()["results"][0].get("url_fullxfull", "")

    all_5_products = [
        {
            "listing_id": 4609341824,
            "slug": "main-christmas-party-game-bundle",
            "lead_image": "01-hero-main-thumbnail.png",
            "title": "Interactive Christmas Party Game Bundle, Live TV & Phone Buzzer Trivia, Holiday Top Answers Quiz Board, Office Family Christmas Games",
            "pin_title": "Interactive Christmas Party Game Bundle | Live TV & Phone Buzzer Trivia",
            "pin_subtitle": "12 Ready-to-Play Packs • 13-Topic Question Generator • 20 Cartoon Avatars",
            "board": "Holiday & Christmas Printables",
            "tags": ["christmas party game", "holiday trivia night", "interactive tv game", "phone buzzer trivia", "family game night"],
            "cdn_url": l1_cdn,
        }
    ]

    for item in NICHE_LISTINGS:
        lid, cdn_url = upload_single_niche_listing(headers, item, all_images)
        all_5_products.append(
            {
                "listing_id": lid,
                "slug": item["slug"],
                "lead_image": item["lead_image"],
                "title": item["title"],
                "pin_title": item["pin_title"],
                "pin_subtitle": item["pin_subtitle"],
                "board": item["board"],
                "tags": item["tags"],
                "cdn_url": cdn_url,
            }
        )

    # Generate 5 Vertical 1000x1500 Pinterest Pins & CSVs
    print("\n📌 Generating 5 Vertical Full HD (1000x1500) Pinterest Pins & Bulk Upload CSV...")
    csv_rows = []
    for prod in all_5_products:
        pin_filename = f"pin_jolly_{prod['slug']}.jpg"
        local_pin_path = PINS_LOCAL_DIR / pin_filename
        desktop_pin_path = DESKTOP_PINS_SUB / pin_filename

        short_display = prod["pin_title"].split("|")[0].strip()
        render_festive_pin(
            IMAGES_DIR / prod["lead_image"],
            short_display,
            prod["pin_subtitle"],
            "$12.99",
            local_pin_path,
        )
        render_festive_pin(
            IMAGES_DIR / prod["lead_image"],
            short_display,
            prod["pin_subtitle"],
            "$12.99",
            desktop_pin_path,
        )

        etsy_url = f"https://www.etsy.com/listing/{prod['listing_id']}"
        hashtags = " ".join([f"#{t.replace(' ', '')}" for t in prod["tags"][:5]])
        pin_desc = (
            f"{prod['title']}. Turn your TV or Zoom screen into a live Christmas game show where everyone plays from their phone! "
            f"Try the free interactive demo at https://christmasparty.live/demo or shop on Etsy from DigitarMercato! {hashtags}"
        )[:500]

        csv_rows.append(
            {
                "Title": prod["pin_title"][:100],
                "Media URL": prod["cdn_url"],
                "Pinterest board": prod["board"],
                "Thumbnail": "",
                "Description": pin_desc,
                "Link": etsy_url,
                "Publish date": "",
                "Keywords": ", ".join(prod["tags"][:8]),
            }
        )
        print(f"  🎨 Rendered Pin: {pin_filename} -> {etsy_url}")

    # Save dedicated Christmas Games Pinterest Bulk CSV
    xmas_csv_path = DESKTOP_PIN_DIR / "pinterest_christmas_games_bulk_upload.csv"
    with open(xmas_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"],
        )
        writer.writeheader()
        writer.writerows(csv_rows)

    print(f"\n✅ Saved Pinterest Bulk Upload CSV (with live Media URLs!): {xmas_csv_path}")
    print("\n=======================================================")
    print("🎉 ALL 5 ETSY LISTINGS & PINTEREST PACK READY!")
    for p in all_5_products:
        print(f"  • #{p['listing_id']} -> https://www.etsy.com/your/shops/me/listing-editor/edit/{p['listing_id']} ({p['slug']})")
    print("=======================================================")


if __name__ == "__main__":
    main()
