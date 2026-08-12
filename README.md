# Kasbon — Aplikasi Tracker Utang-Piutang Pribadi

Web aplikasi modern untuk mencatat dan mengelola utang-piutang pribadi, dibangun dengan Next.js 16 App Router, Supabase (PostgreSQL + Auth + RLS), TanStack React Query v5, Tailwind CSS v4, dan shadcn/ui.

---

## 🚀 Fitur Utama & Pengalaman Pengguna (UX)

1. **Autentikasi Halaman Terpisah**:
   - Halaman khusus `/login` dan `/signup` dengan toggle visibilitas password (ikon Eye / EyeOff).
   - Proteksi route server-side via Supabase SSR Middleware (`proxy.ts`).
   - Isolasi cache React Query (`queryClient.clear()`) untuk mencegah kebocoran data antar akun pengguna.

2. **Optimistic UI Updates (0ms Latency Response)**:
   - Pencatatan utang baru, pengubahan status lunas/batal lunas, dan penghapusan entry langsung memperbarui UI secara instant menggunakan TanStack React Query (`onMutate`, `onError`, `onSettled`) dengan fitur rollback otomatis jika terjadi kegagalan server.

3. **Skeleton Loading UI (Zero Layout Shift)**:
   - Tampilan loading kartu ringkasan (`SummaryCards`) dan daftar utang (`DebtListSkeleton`) menyesuaikan posisi dan dimensi komponen asli untuk mencegah pergeseran tata letak (*layout shift*) saat memuat data.

4. **Debounced Search & Filtering**:
   - Custom reusable hook `useDebounce` (300ms) untuk input pencarian nama/catatan guna menghindari kalkulasi dan *re-render* yang tidak perlu di setiap ketikan.
   - Filter status (Semua / Belum Lunas / Lunas) dan tipe (Semua / Di-hutang ke Saya / Saya Hutang).
   - Mode pengelompokan (Group View) berdasarkan nama orang.

5. **Toast Notifikasi Responsif**:
   - Notifikasi `sonner` real-time untuk seluruh aksi (Simpan, Edit, Hapus, Login, Signup).
   - Posisi toast menyesuaikan perangkat: **Kanan Bawah** di desktop (≥768px) dan **Tengah Atas** di tablet/handphone (<768px).

6. **Modal Konfirmasi Hapus UI**:
   - Dialog konfirmasi khusus (`DeleteConfirmModal`) menggantikan `confirm()` bawaan browser, lengkap dengan ikon peringatan dan nama orang yang bersangkutan.

7. **Format & Lokalisasi**:
   - Format nominal otomatis saat mengetik input Rupiah (`Rp 50.000`).
   - Format tanggal relatif Bahasa Indonesia: `Hari ini`, `Kemarin`, `3 hari lalu`.
   - Palette warna konsisten berbasis variabel *design token* shadcn/ui (`primary`, `ring`, `border`).

---

## 📁 Struktur Komponen Modular

Proyek ini menerapkan arsitektur *clean code* dengan memisahkan tampilan ke dalam komponen-komponen terisolasi di folder `src/components/`:

- `Navbar.tsx`: Header navigasi sticky dengan logo Kasbon, email pengguna (`useUserQuery`), dan tombol keluar.
- `SummaryCards.tsx`: 3 kartu ringkasan keuangan (Piutang, Utang, Saldo Bersih) lengkap dengan state loading skeleton.
- `FilterBar.tsx`: Baris kontrol pencarian, filter select, toggle grouping, dan tombol "Catat Baru".
- `DebtListItem.tsx`: Komponen baris catatan utang beserta lencana status dan tombol aksi.
- `DebtListGrouped.tsx`: Tampilan daftar utang yang terkelompok per nama orang.
- `DebtListSkeleton.tsx` & `ui/skeleton.tsx`: Komponen skeleton animasi loading.
- `EmptyState.tsx`: Komponen tampilan kosong saat data belum ada atau filter tidak cocok.
- `DebtModal.tsx`: Modal dialog form untuk mencatat baru atau mengedit catatan utang.
- `DeleteConfirmModal.tsx`: Modal dialog konfirmasi penghapusan catatan utang.
- `AppToaster.tsx`: Provider toast notifications responsif.

---

## 🛠️ Tech Stack & Library Utama

- **Framework**: Next.js 16 (App Router + TypeScript + Turbopack)
- **State & Data Fetching**: TanStack React Query v5
- **Styling**: Tailwind CSS v4 + shadcn/ui design tokens
- **Backend & Database**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Form & Validasi**: React Hook Form + Zod (`@hookform/resolvers`, `zod`)
- **Notifikasi**: Sonner (`sonner`)
- **Icons**: Lucide React (`lucide-react`)
- **Custom Hooks**: `useDebounce`, `useDisclosure`, `useUserQuery`, `useDebtsQuery`, `useCreateDebtMutation`, `useUpdateDebtMutation`, `useDeleteDebtMutation`

---

## ⚙️ Setup Lokal & Migrasi Database

### 1. Prasyarat
- Node.js 18+ dan pnpm (atau npm)
- Akun Supabase & project aktif

### 2. Environment Variables
Buat file `.env.local` atau `.env` di root project dengan variabel berikut:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. Migrasi Database Supabase
Jalankan skrip SQL yang ada pada file `supabase/migrations/20260812104500_create_debts_table.sql` di **Supabase SQL Editor**:

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
pnpm install

# Jalankan server dev
pnpm dev

# Jalankan build produksi
pnpm build
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔒 Keamanan & Verifikasi RLS

Row Level Security (RLS) diaktifkan secara ketat di tabel `debts`. Setiap query yang dilakukan pengguna diverifikasi oleh Postgres engine `auth.uid() = user_id`. Pengguna tidak dapat membaca, menambah, mengubah, atau menghapus catatan utang milik pengguna lain.

---

## 🎯 Technical Insights

### Approach (Keputusan Teknis yang Dibanggakan)
Penerapan arsitektur React Query Optimistic Updates yang dipadukan dengan modal UI non-blocking (0ms latensi) dan penataan komponen modular. Pengalaman pengguna terasa sangat cepat, tanpa *layout shift* berkat skeleton UI, serta terlindungi oleh Supabase Auth & RLS.

### Trade-off (Hal yang Dipoles jika Memiliki Waktu Tambahan)
Jika memiliki 1 hari tambahan, saya akan menambahkan grafik analisis tren utang-piutang dari waktu ke waktu (visualisasi Chart.js/Recharts), fitur ekspor laporan ke PDF/Excel, serta integrasi pengingat otomatis via email/WhatsApp saat tanggal jatuh tempo mendekat.

### Time Spent
**Durasi Pengerjaan**: ~4 Jam (Inisialisasi project, setup Supabase Auth & RLS, pembuatan API endpoints, arsitektur React Query optimistic updates, refactoring komponen modular, integrasi Skeleton & Toast UI, pengujian fitur, dan dokumentasi).

---

## 🔗 Links

- **Demo Deployment**: [Kasbon on Vercel](https://task-kasbon.vercel.app)
