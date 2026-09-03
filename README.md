# ปฏิทินกำหนดการเข้ามหาวิทยาลัย

เว็บปฏิทินสำหรับดูกำหนดการและลิงก์เอกสารที่เกี่ยวข้องกับการเข้ามหาวิทยาลัย
ทุกคนที่เข้ามาใช้สามารถเพิ่ม/ลบกำหนดการได้เลยโดยไม่ต้องล็อกอิน

Stack: **Next.js 14 + Supabase (database only) + Vercel**

---

## 1) ตั้งค่า Supabase (ฟรี)

1. ไปที่ https://supabase.com สร้างบัญชีและสร้างโปรเจกต์ใหม่
2. เข้า **SQL Editor** ในแดชบอร์ด → New query → คัดลอกเนื้อหาทั้งหมดจากไฟล์
   `supabase/schema.sql` ในโปรเจกต์นี้ไปวาง แล้วกด Run
   - จะได้ตาราง `events` พร้อมสิทธิ์แบบเปิด (ใครก็อ่าน/เพิ่ม/ลบได้ ตามที่ต้องการ)
3. ไปที่ **Project Settings > API** คัดลอกค่า 2 ตัว:
   - `Project URL`
   - `anon public` key

## 2) รันโปรเจกต์บนเครื่องตัวเอง (ถ้าต้องการทดสอบก่อน)

```bash
npm install
cp .env.local.example .env.local
# แก้ .env.local ใส่ค่า Project URL และ anon key ที่ได้จาก Supabase
npm run dev
```

เปิด http://localhost:3000

## 3) อัพขึ้น GitHub

โปรเจกต์นี้ยังไม่ได้เชื่อมกับ GitHub ให้ (ผมไม่มีสิทธิ์เข้าบัญชี GitHub ของคุณโดยตรง)
ทำตามนี้จากเครื่องของคุณ:

1. สร้าง repository ใหม่ที่ https://github.com/new (ไม่ต้องติ๊ก "Add README" เพราะโปรเจกต์นี้มีไฟล์อยู่แล้ว)
2. ในโฟลเดอร์โปรเจกต์นี้ รันคำสั่ง:

```bash
git init
git add .
git commit -m "Initial commit: uni calendar"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(`.env.local` จะไม่ถูกอัพขึ้น GitHub เพราะอยู่ใน `.gitignore` แล้ว — ปลอดภัย)

## 4) Deploy ขึ้น Vercel (ฟรี)

1. ไปที่ https://vercel.com สมัคร/ล็อกอินด้วยบัญชี GitHub
2. กด **Add New > Project** เลือก repo ที่เพิ่ง push ไป
3. ในหน้า **Environment Variables** ใส่:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL จาก Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key จาก Supabase
4. กด Deploy รอสักครู่ จะได้ลิงก์เว็บที่ใช้งานได้จริงทันที (เช่น `your-project.vercel.app`)

ทุกครั้งที่ push โค้ดใหม่ขึ้น GitHub, Vercel จะ deploy เวอร์ชันใหม่ให้อัตโนมัติ

## โครงสร้างโปรเจกต์

```
app/
  layout.js       — โครง HTML หลัก, โหลดฟอนต์ไทย
  page.js         — หน้าเว็บหลัก ต่อกับ Supabase
  globals.css     — ธีมสี/ฟอนต์ทั้งเว็บ
components/
  Calendar.js     — ปฏิทินรายเดือน
  DayPanel.js     — รายการกำหนดการ + ฟอร์มเพิ่ม/ลบ ของวันที่เลือก
lib/
  supabaseClient.js — ตัวเชื่อมต่อ Supabase
supabase/
  schema.sql      — คำสั่งสร้างตารางและสิทธิ์การเข้าถึง
```

## ปรับแต่งต่อได้

- อยากจำกัดสิทธิ์ในอนาคต (เช่น ต้องใส่รหัสก่อนเพิ่ม/ลบ) → แก้ policy ใน `supabase/schema.sql`
- อยากได้โดเมนของตัวเอง → ซื้อโดเมนแล้วผูกกับ Vercel ได้ในหน้า Project Settings > Domains
