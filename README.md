# 🐻 เฮงเฮงปังจัง — Reward Platform

ระบบ QR-based gamified marketing สำหรับร้านอาหารที่ซื้อซอสหมีปรุง

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router)             |
| Styling    | TailwindCSS + Kanit font            |
| Animation  | Framer Motion                       |
| Backend    | Next.js API Routes                  |
| Database   | MySQL                               |
| Storage    | AWS S3 / Cloudflare R2              |
| Auth       | Phone OTP (JWT cookie)              |

---

## Project Structure

```
app/
  auth/login/          ← OTP login page
  r/[merchant_id]/     ← Customer QR scan landing
  spin/[merchant_id]/  ← Spin wheel page
  merchant/
    dashboard/         ← Merchant overview + stats
    upload/            ← Receipt upload (drag & drop)
    qrcodes/           ← QR code download
    history/           ← Spin history
  admin/
    dashboard/         ← Admin overview + chart
    merchants/         ← Manage & approve merchants
    receipts/          ← Approve receipts → add quota
    rewards/           ← Configure reward probabilities
  api/
    login/             ← OTP send/verify/set-name
    logout/            ← Clear cookie
    spin/              ← Spin wheel + anti-cheat
    upload-receipt/    ← Upload + approve flow
    quota/             ← Merchant quota stats
    merchants/         ← Admin merchant management
    rewards/           ← Reward CRUD
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourname/meeprung-reward
cd meeprung-reward
npm install
```

### 2. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

### 3. Environment Variables

```bash
cp .env.local.example .env.local
# แก้ไขค่าใน .env.local
```

| Key | Description |
|-----|-------------|
| `DB_HOST` | MySQL host |
| `DB_NAME` | Database name (`meeprung_reward`) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Random secret string |
| `SMSMKT_API_KEY` | SMSMKT API key (OTP SMS) |
| `STORAGE_ENDPOINT` | R2/S3 endpoint URL |
| `STORAGE_ACCESS_KEY` | Storage access key |
| `STORAGE_SECRET_KEY` | Storage secret key |
| `STORAGE_BUCKET` | Bucket name |
| `STORAGE_PUBLIC_URL` | Public CDN URL |
| `NEXT_PUBLIC_APP_URL` | Your domain URL |

### 4. Run Development

```bash
npm run dev
```

### 5. Deploy to Vercel

```bash
vercel --prod
# Set all env vars in Vercel dashboard
```

---

## User Flows

### Customer Flow
1. เข้าร้านอาหาร
2. สแกน QR Code → `/r/{merchant_id}`
3. ลงทะเบียน/Login ด้วยเบอร์โทร + OTP
4. หมุนวงล้อ → `/spin/{merchant_id}`
5. รับรางวัล + Ticket ลุ้นโชคใหญ่

### Merchant Flow
1. Login → `/auth/login`
2. อัพโหลดใบเสร็จ → `/merchant/upload`
3. Admin อนุมัติ → ระบบเพิ่ม Quota อัตโนมัติ
4. Download QR Code → `/merchant/qrcodes`

### Admin Flow
1. Login → `/auth/login` (role: admin)
2. Dashboard → `/admin/dashboard`
3. อนุมัติใบเสร็จ → `/admin/receipts`
4. จัดการร้านค้า → `/admin/merchants`
5. ตั้งค่ารางวัล → `/admin/rewards`

---

## Quota Formula

```
1 ถุงซอสหมีปรุง = 30 spins
5 ถุง = 150 spins

quota = quantity × 30
```

---

## Anti-Cheat Rules

- 1 spin ต่อ user ต่อ merchant ต่อวัน
- ตรวจสอบ quota ก่อน spin ทุกครั้ง
- Server-side reward generation (ไม่ใช่ client)
- JWT HttpOnly cookie (ป้องกัน XSS)

---

## Default Rewards

| รางวัล | ประเภท | ความน่าจะเป็น |
|--------|--------|--------------|
| ส่วนลด ฿10 | discount | 40% |
| ส่วนลด ฿20 | discount | 20% |
| ส่วนลด ฿50 | discount | 10% |
| ทานฟรีมื้อนี้ | free_meal | 5% |
| 50 คะแนน | points | 15% |
| ลุ้นโชคใหญ่ | raffle | 10% |

---

## License

MIT — เฮงเฮงปังจัง © 2025
