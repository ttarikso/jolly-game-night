# Jolly Game Night: kurulum (Türkçe)

Canlı parti oyunu sitesi. Sunucu ekranı büyük ekranda açılır, oyuncular telefondan PIN ile katılır.
Etsy alıcısı sipariş numarası + e-postası ile lisansını açar, sınırsız soru ekleyip kendi oyununu kurar.

## 1) Supabase (veritabanı + canlı bağlantı) – ücretsiz
1. https://supabase.com → New project (bölge: Frankfurt).
2. Sol menü **SQL Editor** → `supabase/schema.sql` dosyasının içeriğini yapıştır → Run.
3. **Project Settings → API**: `Project URL`, `anon public` ve `service_role` anahtarlarını not al.
   (Realtime varsayılan olarak açık, ek ayar gerekmez.)

## 2) GitHub
Bu klasörü yeni bir **private** repoya yükle (ör. `jolly-game-night`).

## 3) Vercel
1. https://vercel.com → Add New → Project → GitHub reposunu seç.
2. **Environment Variables** (hepsi `.env.example` içinde):
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (gizli!)
   - `ADMIN_SECRET` = uzun rastgele bir şifre (admin paneli için)
   - `NEXT_PUBLIC_SITE_URL` = https://senin-domainin.com
3. Deploy. Sonra **Settings → Domains** → domainini ekle, DNS kayıtlarını Vercel'in gösterdiği gibi gir.

## 4) Günlük kullanım
- **Yeni Etsy siparişleri:** `domain.com/admin` → admin şifresi → sipariş numaralarını yapıştır
  (veya Etsy → Shop Manager → Settings → Options → Download Data → Orders CSV dosyasını olduğu gibi yapıştır).
  Sadece eklenen siparişler aktivasyon yapabilir. Bir siparişi iptal/iade edersen **Revoke**.
- **Alıcı:** Etsy'den indirdiği PDF'teki linke gider → `/redeem` → sipariş no + e-posta → oyunları.
  Aynı sipariş no + e-posta ile her cihazdan tekrar girebilir.
- **Oyuncular:** `domain.com/join` + PIN veya ekrandaki QR.

## Sınırlar / notlar
- Supabase ücretsiz katman: 200 eşzamanlı bağlantı, ayda 2 milyon realtime mesaj. Kabaca 30 kişilik
  bir oyun saatte ~20–40 bin mesaj kullanır. Satışlar artınca Pro plan ($25/ay) gerekir.
- Supabase ücretsiz projeler 7 gün hiç kullanılmazsa duraklar; Aralık'ta sorun olmaz, ama
  satışa açmadan önce Pro'ya geçmek ya da haftalık bir ping kurmak iyi olur.
- Yerelde (Supabase anahtarları olmadan) site `.data/db.json` dosyasını kullanır ve canlı bağlantı
  aynı tarayıcının sekmeleri arasında çalışır; test için `1000000001` sipariş numarası hazırdır.

## Geliştirme
```
npm install
npm run dev        # http://localhost:3000
node scripts/e2e.js  # uçtan uca test (önce `npm run build && npm start`)
```
