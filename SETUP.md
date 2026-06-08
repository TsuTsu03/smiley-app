# Smiley — Setup & Go-Live Guide

Gabay para gawing 100% functional at ready-to-transfer sa clients. Sundin ang
mga hakbang ayon sa pagkakasunod. Ang ✅ = code na tapos na (ako gumawa). Ang
🟦 **YOUR PART** = kailangan mong gawin (account, keys, config).

---

## 0. Install & run locally
```bash
npm install
cp .env.example .env.local   # tapos punan (tingnan sa baba)
npm run dev
```

---

## 1. Supabase (database + auth) — REQUIRED

🟦 **YOUR PART**
1. Gumawa ng project sa https://supabase.com (libre ang start).
2. **SQL Editor → New query**, i-paste at patakbuhin **in order**:
   - `supabase/schema.sql`  ← tables
   - `supabase/02_security_and_features.sql`  ← ✅ security + billing/audit columns
   - `supabase/seed.sql`  ← (optional) sample data para may makita agad
3. **Project Settings → API**, kopyahin sa `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (lihim! server-only)
4. **Authentication → Providers → Email**: i-enable. Para sa go-live i-on ang
   **"Confirm email"** (email verification). Para sa password reset, naka-built
   in na ito sa Supabase — i-configure lang ang email templates.

✅ **Ang ginawa ko:** clinic-scoped Row Level Security. Dati, kayang basahin ng
isang clinic ang data ng ibang clinic (data leak). Ngayon naka-isolate na bawat
clinic. **Patunayan mo:** gumawa ng 2 clinics via `/register`, mag-login sa
isa, at tiyaking wala kang makitang data ng pangalawa.

---

## 2. PayMongo (paid subscriptions) — para sa Pilipinas

> ⚠️ **Hindi gumagana ang Stripe sa PH** (di kasama ang Pilipinas sa supported
> countries). Gumagamit tayo ng **PayMongo** — local gateway na may **GCash,
> Maya, GrabPay, at cards**. Settles in PHP.

🟦 **YOUR PART**
1. Account sa https://paymongo.com (kailangan ng business details — para ito sa
   legit na PH business). **Developers → API Keys:**
   - Secret key → `PAYMONGO_SECRET_KEY`
2. Itakda ang buwanang presyo sa **centavos** (₱1,499 = `149900`) sa `.env.local`:
   - `PAYMONGO_PRICE_STARTER`, `PAYMONGO_PRICE_GROWTH`, `PAYMONGO_PRICE_MULTICLINIC`
3. **Webhook** (para ma-activate ang subscription pagkabayad):
   - Gawin via API o dashboard, naka-turo sa
     `https://YOURDOMAIN/api/paymongo/webhook`
   - Events: `checkout_session.payment.paid`, `payment.paid`, `payment.failed`
   - Kopyahin ang webhook secret (`whsk_...`) → `PAYMONGO_WEBHOOK_SECRET`
   - **Local test:** gamitin ang ngrok/Cloudflare Tunnel para ma-expose ang
     `localhost:3000`, tapos doon i-turo ang webhook URL.

✅ **Ang ginawa ko (API ready):**
- `/api/paymongo/checkout` — hosted checkout (card/GCash/Maya/GrabPay)
- `/api/paymongo/webhook` — signature-verified, ina-activate ang clinic
- `/api/paymongo/cancel` — cancel (PayMongo walang hosted portal)
- billing columns sa `clinics` (`plan`, `subscription_status`, `current_period_end`…)

ℹ️ **Paalala sa model:** ang PayMongo checkout ay **isang bayad** kada cycle.
Ang ginawa ko = checkout para sa unang buwan + naka-set ang `current_period_end`
+1 month. Para sa **tunay na auto-renew** (saved card, monthly auto-charge),
kailangan ng dagdag na recurring logic — sabihin mo kung gusto mong idagdag.

⚠️ **Kulang pa (UI):** walang "Subscribe / Manage billing" button sa admin
dashboard. Ang signup ngayon = 14-day trial na walang card. Kaya kong idagdag —
sabihin mo lang.

---

## 3. Email reminders (Brevo — free, walang domain)

🟦 **YOUR PART**
1. Account sa https://www.brevo.com (libre, 300 email/araw).
2. **SMTP & API → API Keys** → gumawa → `BREVO_API_KEY`.
3. **Senders & IP → Senders** → idagdag ang sender email mo (hal. gmail mo) →
   i-confirm ang link na ipapadala sa email na 'yon. **Hindi kailangan ng
   domain** para makapagsimula. Itakda: `BREVO_SENDER_EMAIL=you@gmail.com`,
   `BREVO_SENDER_NAME=Smiley`.

⚠️ **Deliverability:** kung gmail/yahoo ang sender, baka mapunta sa spam ng
ilang recipients (DMARC). Para mas reliable + matanggal ang "Brevo" branding,
mag-verify ng sariling domain balang araw. Pero ok na ito para mag-umpisa.

✅ **Ang ginawa ko:** email sender (`src/lib/email.ts`, Brevo), branded
reminder template, at cron job na nagpapadala para sa appointments **bukas**
(minarkahan para hindi ma-doble). **Per clinic:** ang pangalan ng clinic ang
lalabas na sender, at ang reply ay dumidiretso sa email ng clinic.

---

## 4. Reminder scheduler (cron)

🟦 **YOUR PART**
1. `CRON_SECRET` = mahabang random string sa `.env.local`.
2. **Sa Vercel:** automatic na (tingnan ang `vercel.json` — tumatakbo araw-araw
   9AM). Idagdag lang ang `CRON_SECRET` sa Vercel env vars; awtomatikong
   ipinapadala ito ng Vercel bilang Bearer token.
3. **Local test:**
   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/reminders
   ```

---

## 5. AI assistant (Groq — free)

🟦 **YOUR PART**
1. **Libreng** API key sa https://console.groq.com (walang credit card) →
   `GROQ_API_KEY`.
2. (Optional) `GROQ_MODEL` kung gusto mong palitan ang default
   (`llama-3.3-70b-versatile`). Para sa mas mabilis: `llama-3.1-8b-instant`.
3. Tandaan: may **rate limits** ang free tier (ilang requests/min) — sapat na
   para sa clinic chatbot, pero hindi unlimited.

✅ **Ang ginawa ko:**
- `/api/ai/chat` — totoong AI assistant na naka-ground sa **live clinic data**
  (dentists, schedules, sariling appointments ng pasyente). Sumasagot sa
  Tagalog/English. **May fallback:** kapag walang key, babalik sa lumang
  rule-based replies — hindi masisira.
- `/api/ai/no-show` — no-show risk scoring per upcoming appointment
  (transparent na heuristic base sa history ng pasyente).
⚠️ **Kulang pa (UI):** hindi pa naipapakita ang no-show risk sa admin
dashboard, at ang "charting scribe" / "ask-your-data" ay marketing pa lang.

---

## 5b. Rate limiting (Upstash Redis — free)

🟦 **YOUR PART**
1. Libreng Redis sa https://console.upstash.com → **Create Database** (Global) →
   **REST API** → kopyahin ang URL at TOKEN:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

✅ **Ang ginawa ko:** rate limiting (`src/lib/rateLimit.ts`) sa mga sensitibong
endpoints — **login** (10/min), **patient login** (10/min), **signup** (5/10min),
**AI chat** (20/min, pinoprotektahan ang Groq quota), **booking** (15/min).
Lahat per-IP, nagbabalik ng **429** kapag lumampas.

⚠️ **Importante:** kung wala ang Upstash env, may **in-memory fallback** (ok sa
dev) pero **hindi shared across Vercel serverless instances** — kaya **itakda ang
Upstash sa production** para totoong epektibo ang proteksyon. Huwag gumamit ng
traditional Redis sa Vercel serverless.

## 6. Deploy (Vercel)

🟦 **YOUR PART**
1. Push sa GitHub → import sa https://vercel.com.
2. **Settings → Environment Variables:** ilagay LAHAT ng nasa `.env.local`
   (palitan ang `NEXT_PUBLIC_APP_URL` ng totoong domain).
3. Custom domain + SSL (automatic sa Vercel).
4. I-update ang Stripe webhook URL sa production domain (Step 2.3).

---

## 7. Bago i-transfer sa client — checklist

| Item | Status |
|---|---|
| Clinic-scoped RLS (data isolation) | ✅ code (run mo ang SQL) |
| Walang double-booking | ✅ |
| Audit logs (clinic create, booking) | ✅ |
| Exportable patient records (CSV) | ✅ API (kulang button) |
| Email reminders + cron | ✅ code (kailangan Brevo — free) |
| PayMongo subscriptions (GCash/Maya/card) | ✅ API (kulang Subscribe button) |
| AI chatbot (real, grounded) | ✅ (kailangan Groq key — free) |
| No-show predictor | ✅ API (kulang dashboard widget) |
| Email verification / password reset | 🟦 i-on sa Supabase |
| Production deploy + domain | 🟦 Vercel |

### Mga gusto ko pang i-wire (sabihin mo kung alin):
1. **Subscribe / Manage-billing buttons** sa admin dashboard (PayMongo).
2. **No-show risk widget** sa AdminOverview (gamit ang bagong endpoint).
3. **Export button** sa patient records page.
4. **AdminReminders** + **PatientChatbot** — alisin ang natitirang MOCK data,
   palitan ng totoong Supabase/notifications.
5. **Dentist availability UI** + respetuhin ang `dentist_schedules` sa booking.
6. **Patient self-registration / invite** flow.

> Tip: huwag i-commit ang `.env.local`. Naka-`.gitignore` na dapat ito.
