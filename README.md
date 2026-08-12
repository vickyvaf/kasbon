# Kasbon — Aplikasi Tracker Utang-Piutang Pribadi

Web aplikasi sederhana untuk mencatat dan mengelola utang-piutang pribadi, dibangun menggunakan Next.js 16 App Router, Supabase (PostgreSQL + Auth), Tailwind CSS v4, dan Lucide React.

---

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
- **Vercel Deploy**: [https://kasboncom.netlify.app](https://kasboncom.netlify.app)

---

## 💡 Approach
Penerapan arsitektur **TanStack React Query Optimistic Updates** yang dipadukan dengan modal UI non-blocking (latensi 0ms) dan pemisahan komponen modular yang rapi. Seluruh mutasi data terasa instan, *loading state* ditangani tanpa *layout shift* menggunakan Skeleton UI khusus, dan keamanan data terjamin 100% melalui Supabase Row Level Security (RLS) berbasis `auth.uid() = user_id`.

---

## 🛠️ Trade-off
Kalau ada 1 hari lagi, saya akan menambahkan pengingat melalui whatsapp pengingat otomatis berkala (via Resend & Cron Job) saat tanggal jatuh tempo utang mendekat.

---

## ⏱️ Time Spent
~3 Jam (Setup Next.js 16 & Supabase Auth/RLS, API Endpoints, Optimistic Updates, komponen modular, Skeleton & Toast UI, dan dokumentasi video).
