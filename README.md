# Kasbon — Aplikasi Tracker Utang-Piutang Pribadi

Web aplikasi sederhana untuk mencatat dan mengelola utang-piutang pribadi, dibangun menggunakan Next.js 16 App Router, Supabase (PostgreSQL + Auth), Tailwind CSS v4, dan Lucide React.

---

## Preview
<img width="1425" height="777" alt="Screenshot 2026-08-12 at 21 37 02" src="https://github.com/user-attachments/assets/f89d8578-d373-4102-8580-bd8ae9301d84" />
<img width="1425" height="776" alt="Screenshot 2026-08-12 at 21 38 06" src="https://github.com/user-attachments/assets/f4b6fa18-2b8b-4b8a-9054-7ef931159f65" />



## ⚙️ Setup

### 1. Environment Variables (`.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
RESEND_API_KEY=<your-resend-api-key>
```

### 2. Migrasi Database (Supabase SQL Editor)
Jalankan file SQL `supabase/migrations/20260812104500_create_debts_table.sql`:

```sql
CREATE TYPE debt_type AS ENUM ('owed_to_me', 'i_owe');

CREATE TABLE public.debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type debt_type NOT NULL,
    counterpart_name TEXT NOT NULL,
    amount BIGINT NOT NULL CHECK (amount >= 0),
    note TEXT CHECK (char_length(note) <= 200),
    due_date DATE,
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own debts" ON public.debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own debts" ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debts" ON public.debts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debts" ON public.debts FOR DELETE USING (auth.uid() = user_id);
```

### 3. Cara Jalanin Local
```bash
pnpm install
pnpm dev
```
Buka [http://localhost:3000](http://localhost:3000).

---

## 🔗 Demo
- **Netlify Deploy**: [https://kasboncom.netlify.app](https://kasboncom.netlify.app)

---

## 💡 Best Approach & Additional
Penerapan arsitektur **TanStack React Query Optimistic Updates** yang dipadukan dengan modal UI non-blocking (latensi 0ms) dan pemisahan komponen modular yang rapi. Seluruh mutasi data terasa instan, *loading state* ditangani tanpa *layout shift* menggunakan Skeleton UI khusus, dan keamanan data terjamin 100% melalui Supabase Row Level Security (RLS) berbasis `auth.uid() = user_id`.

#### 📬 Email Reminder (Non-MVP)

Fitur pengingat lewat email menggunakan Resend saat ini hanya dikonfigurasi untuk kebutuhan demo:

- Email hanya dapat dikirim ke **alamat email pemilik Resend API Key / deployer** (misalnya `vickyadi243@gmail.com`), karena menggunakan domain default `onboarding@resend.dev` milik Resend.
- Sesuai batasan resmi Resend, tanpa custom domain yang terverifikasi, pengiriman email dibatasi hanya ke owner email untuk keperluan testing.
- Agar siap dan bisa mengirim ke semua user, diperlukan:
  - Menyiapkan **custom domain**,
  - Menambahkan dan memverifikasi DNS records (TXT, MX, DKIM) di Resend,
  - Mengubah `from` address menjadi email dengan domain terverifikasi tersebut (contoh: `no-reply@kasbon.app`).

#### 📤 Export CSV (Non-MVP)

Selain email reminder, ada juga rencana fitur **export data utang-piutang ke file CSV** untuk mempermudah analisis dan backup pribadi:

- Pengguna dapat mengekspor seluruh catatan utang-piutang ke satu file `.csv`.
- Formatnya akan mencakup kolom seperti: tanggal, tipe (`owed_to_me` / `i_owe`), nama pihak terkait, nominal, status pelunasan, dan catatan singkat.
- Secara teknis, implementasi direncanakan sebagai endpoint server-side sederhana (Next.js Route Handler) yang:
  - Mengambil data `debts` milik user yang sedang login,
  - Mengonversi ke CSV,

Scope ini saat ini dianggap **di luar MVP** dan dapat dikerjakan sebagai peningkatan di iterasi berikutnya.

---

## 🛠️ Trade-off
Kalau ada 1 hari lagi, saya akan menambahkan pengingat melalui whatsapp pengingat otomatis berkala saat tanggal jatuh tempo utang mendekat.

---

## ⏱️ Time Spent
~3 Jam (Setup Next.js 16 & Supabase Auth/RLS, API Endpoints, Optimistic Updates, komponen modular, Skeleton & Toast UI, dan dokumentasi video).
