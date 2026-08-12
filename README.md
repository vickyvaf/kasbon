# Kasbon — Aplikasi Tracker Utang-Piutang Pribadi

Web aplikasi sederhana untuk mencatat dan mengelola utang-piutang pribadi, dibangun menggunakan Next.js 16 App Router, Supabase (PostgreSQL + Auth + RLS), TanStack React Query v5, Tailwind CSS v4, dan Lucide React.

---

## 🚀 Fitur Utama & Bonus Implemented

### Deliverables Utama
1. **Auth**: Signup & login pakai email + password (Supabase Auth), logout button, dan halaman terproteksi server middleware.
2. **Dashboard**: 3 Summary Card ("Total dihutang ke saya", "Total saya hutang", "Net" saldo warna hijau/merah).
3. **Pencatatan & Filter**: Filter dropdown status (Semua / Belum Lunas / Lunas) + tipe (Semua / Dihutang / Hutang).
4. **Form Modal**: Modal Tambah Baru / Edit dengan validasi Zod + React Hook Form, radio tipe, format rupiah otomatis saat mengetik, dan tanggal default hari ini.
5. **Aksi & Presistensi**: Status Lunas / Batal Lunas dan Hapus entry tersimpan persisten ke database Supabase dengan latensi 0ms (Optimistic Updates).

### Bonus Implemented (Signal Niat & Taste)
- ✅ **Search**: Pencarian cepat nama orang & catatan dengan `useDebounce` (300ms).
- ✅ **Group View**: Pengelompokan catatan utang per nama orang (mis. "Budi: 3 entry, total Rp X").
- ✅ **Bar Chart Ratio**: Visualisasi bar chart perbandingan total dihutang vs hutang (`AnalyticsChart`).
- ✅ **UX States**: Handling lengkap untuk *Empty State*, *Loading Skeleton UI* (zero layout shift), dan *Error State*.
- ✅ **Mobile-First Design**: Tampilan UI responsif enak di HP dengan toast notification responsif (`sonner`).
- ✅ **Modal Hapus UI**: Dialog konfirmasi hapus khusus (`DeleteConfirmModal`) tanpa `confirm()` browser native.

---

## ⚙️ Setup Local

### 1. Environment Variables (`.env.local` / `.env`)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 2. Migrasi Database (Supabase SQL Editor / CLI)
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

### 3. Jalankan Aplikasi
```bash
pnpm install
pnpm dev
```
Buka [http://localhost:3000](http://localhost:3000).

---

## 🔗 Demo
- **Vercel Deploy**: [https://task-kasbon.vercel.app](https://task-kasbon.vercel.app)

---

## 💡 Approach (Keputusan Teknis yang Dibanggakan)
Penerapan arsitektur **TanStack React Query Optimistic Updates** yang dipadukan dengan modal UI non-blocking (latensi 0ms) dan pemisahan komponen modular yang sangat rapi. Seluruh mutasi data terasa instan, *loading state* ditangani tanpa *layout shift* menggunakan Skeleton UI khusus, dan keamanan data terjamin 100% melalui Supabase Row Level Security (RLS) berbasis `auth.uid() = user_id`.

---

## 🛠️ Trade-off (Kalau Ada 1 Hari Lagi, Apa yang Dipoles?)
Jika memiliki 1 hari tambahan, saya akan menambahkan fitur ekspor laporan berkas ke CSV/PDF serta sistem pengingat email otomatis via Cron Job 1 hari sebelum tanggal jatuh tempo utang mendekat.

---

## ⏱️ Time Spent
**Durasi Pengerjaan**: ~4 Jam (Setup Next.js 16 & Supabase Auth/RLS, pembuatan API Endpoints bertipe ketat, arsitektur React Query optimistic updates, refactoring komponen modular, implementasi fitur bonus bar chart/group/search, Skeleton & Toast UI, dan dokumentasi).
