# Kasbon — Aplikasi Tracker Utang-Piutang Pribadi

Web aplikasi sederhana untuk mencatat dan mengelola utang-piutang pribadi, dibangun dengan Next.js 16 App Router, Supabase (PostgreSQL + Auth), Tailwind CSS v4, dan shadcn/ui.

---

## 🚀 Fitur Utama

1. **Autentikasi Pengguna**: Signup dan Login berbasis Supabase Auth dengan email & password. Proteksi halaman otomatis via Middleware.
2. **Ringkasan Keuangan (Summary Cards)**:
   - Total Diutangkan ke Saya (Piutang)
   - Total Saya Hutang (Utang)
   - Net Balance (Warna hijau untuk positif, merah untuk negatif)
3. **Pencatatan & Filter**:
   - Filter berdasarkan status (Semua / Belum Lunas / Lunas)
   - Filter berdasarkan tipe (Semua / Di-hutang ke Saya / Saya Hutang)
   - Pencarian berdasarkan nama orang & catatan
   - Pengelompokan (Group view) berdasarkan nama orang
4. **Manajemen Entry (CRUD)**:
   - Form modal untuk mencatat utang baru dan edit entry
   - Toggle status **Tandai Lunas** / **Batal Lunas** secara persisten ke database Supabase
   - Hapus entry utang
5. **Format & Lokalisasi**:
   - Format mata uang Rupiah berbasis `id-ID`: `Rp 1.234.000`
   - Format tanggal relatif: `Hari ini`, `Kemarin`, `3 hari lalu`
   - Tampilan UI kasual Bahasa Indonesia

---

## 🛠️ Tech Stack & Library Tambahan

- **Framework**: Next.js 16 (App Router + TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Default neutral theme, tanpa custom gradient)
- **Backend & Database**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Icons**: Lucide React (`lucide-react`)
- **Helper Utilities**: `@supabase/ssr`, `@supabase/supabase-js`, `clsx`, `tailwind-merge`, `class-variance-authority`

*Alasan memakai shadcn/ui & helper utilities*: Menyediakan komponen UI standar (Card, Button, Dialog, Select, Input, Badge) yang accessible, konsisten, dan mudah dipoles tanpa menulis CSS boilerplate dari nol.

---

## ⚙️ Setup Lokal & Migrasi Database

### 1. Prasyarat
- Node.js 18+ dan npm
- Akun Supabase & project aktif

### 2. Environment Variables
Buat file `.env.local` atau `.env` di root project dengan variabel berikut:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Migrasi Database Supabase
Jalankan skrip SQL yang ada pada file `supabase/migrations/01_init_debts.sql` di **Supabase SQL Editor**:

```sql
-- Membuat enum debt_type
CREATE TYPE debt_type AS ENUM ('owed_to_me', 'i_owe');

-- Membuat tabel debts
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

-- Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Policy RLS (Hanya user pemilik yang bisa SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Users can view their own debts" ON public.debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own debts" ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debts" ON public.debts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debts" ON public.debts FOR DELETE USING (auth.uid() = user_id);
```

### 4. Menjalankan Aplikasi
```bash
# Install dependencies
npm install

# Jalankan server verifikasi / dev
npm run dev

# Jalankan build produksi
npm run build
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔒 Keamanan & Verifikasi RLS

Row Level Security (RLS) diaktifkan secara ketat di tabel `debts`. Setiap query yang dilakukan pengguna (baik melalui Supabase Client SDK maupun REST API via `curl`) diverifikasi oleh Postgres engine `auth.uid() = user_id`. Pengguna tidak dapat membaca, menambah, mengubah, atau menghapus catatan utang milik pengguna lain.

---

## 🎯 Technical Insights

### Approach (Keputusan Teknis yang Dibanggakan)
Penerapan arsitektur API Routes Next.js 16 bertipe ketat (*strict TypeScript*) yang terhubung langsung dengan Supabase SSR Client & Row Level Security (RLS). Seluruh aksi mutasi seperti menandai lunas, mengedit data, dan menghapus entry divalidasi secara komprehensif di server dan di-render secara reaktif tanpa re-fetch penuh yang berat, menjaga performa dan integritas data secara mutlak.

### Trade-off (Hal yang Dipoles jika Memiliki Waktu Tambahan)
Jika memiliki 1 hari tambahan, saya akan menambahkan grafik analisis tren utang-piutang dari waktu ke waktu (visualisai Chart.js/Recharts), fitur ekspor laporan ke PDF/Excel, serta integrasi pengingat otomatis via email/WhatsApp saat tanggal jatuh tempo mendekat.

### Time Spent
**Durasi Pengerjaan**: ~3.5 Jam (Inisialisasi project, setup Supabase Auth & RLS, pembuatan API endpoints bertipe ketat, integrasi UI shadcn/ui, pengujian fitur, dan penulisan dokumentasi).

---

## 🔗 Links

- **Demo Deployment**: [Kasbon on Vercel](https://task-kasbon.vercel.app) *(Isi link deployment Vercel Anda setelah deploy)*
