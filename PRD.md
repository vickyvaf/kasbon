# Hiring Task — Junior Fullstack Developer

## Brief

Bikin **Kasbon** — web app sederhana untuk track utang-piutang pribadi.

User bisa:

- Mencatat siapa yang berutang kepadanya atau kepada siapa ia berutang
- Menandai utang sebagai **lunas** setelah dibayar
- Melihat ringkasan total utang-piutang

Mulai dari project Next.js kosong; jangan fork repository orang lain.

## Stack wajib

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth)
- Lucide React untuk ikon

Library tambahan boleh dipakai bila perlu, tetapi jelaskan alasannya di `README`.

## Deliverables

### 1. Auth

- Signup dan login dengan email + password menggunakan Supabase Auth
- Tombol logout
- Halaman aplikasi hanya dapat diakses pengguna yang sudah login

### 2. Dashboard

#### Summary

Tampilkan tiga card:

- **Total dihutang ke saya**: `Rp X`
- **Total saya hutang**: `Rp Y`
- **Net**: `X - Y`, dengan warna hijau/merah

#### Daftar entry

Tampilkan seluruh entry beserta:

- Nama orang
- Tipe: dihutang / saya hutang
- Jumlah, dengan format `Rp 1.234.000`
- Tanggal relatif, misalnya `3 hari lalu`
- Status: Belum lunas / Lunas
- Aksi: **Tandai lunas**, **Edit**, dan **Hapus**

#### Filter dan input

- Dropdown status: semua / belum / lunas
- Dropdown tipe: semua / dihutang / hutang
- Tombol **+ Catat baru** yang membuka modal atau halaman form

### 3. Form Catat Baru / Edit

- Tipe (radio): **Saya dihutang** / **Saya hutang**
- Nama orang: text, wajib diisi
- Jumlah: number, wajib diisi, dalam Rupiah
- Tanggal: default hari ini
- Catatan: opsional, maksimum 200 karakter
- Validasi dilakukan di client dan server

### 4. API Endpoints

| Method | Path | Fungsi |
|---|---|---|
| `GET` | `/api/debts` | List debt milik user; menerima query `?status=` dan `?type=` |
| `POST` | `/api/debts` | Membuat entry baru |
| `PATCH` | `/api/debts/[id]` | Memperbarui entry, termasuk menandai lunas |
| `DELETE` | `/api/debts/[id]` | Menghapus entry |

Semua endpoint wajib:

- Memerlukan autentikasi
- Menggunakan TypeScript dengan baik; jangan memakai `any` tanpa alasan
- Memvalidasi input
- Memberikan error response dalam Bahasa Indonesia dengan status code yang tepat

### 5. Database

Sertakan SQL migration dalam folder `migrations/` atau `supabase/migrations/`.

Tabel `debts`:

| Kolom | Tipe / aturan |
|---|---|
| `id` | `uuid`, primary key |
| `user_id` | `uuid`, foreign key ke `auth.users` |
| `type` | enum: `owed_to_me` / `i_owe` |
| `counterpart_name` | `text` |
| `amount` | `bigint`; Rupiah utuh, bukan desimal |
| `note` | `text`, nullable |
| `due_date` | `date`, nullable |
| `settled_at` | `timestamptz`, nullable; `null` berarti belum lunas |
| `created_at` | timestamp |
| `updated_at` | timestamp |

#### RLS wajib

- User hanya boleh `SELECT` / `INSERT` / `UPDATE` / `DELETE` row miliknya sendiri.
- Uji kebocoran: menggunakan API key aplikasi tidak boleh memungkinkan pembacaan atau perubahan data pengguna lain melalui Supabase REST API.

### 6. README

README wajib mencakup:

- Setup environment variable, migration, dan cara menjalankan aplikasi secara lokal
- Link demo deployment Vercel
- **Approach**: satu paragraf tentang keputusan teknis yang paling dibanggakan
- **Trade-off**: hal yang akan dipoles jika memiliki satu hari tambahan
- **Time spent**: durasi pengerjaan yang jujur

## Constraints

1. Boleh memakai AI assistant, tetapi setiap baris kode harus dipahami karena pertanyaan interview dapat acak.
2. Jangan hardcode data; seluruh data harus berasal dari Supabase.
3. Jangan melewati RLS.
4. Format Rupiah harus memakai locale `id-ID`: `Rp 1.234.000`, bukan `Rp 1234000` atau `IDR 1,234,000`.
5. Gunakan tanggal relatif, misalnya `3 hari lalu` atau `kemarin`.
6. Gunakan copy UI Bahasa Indonesia yang casual, bukan formal/terjemahan kaku.
7. Gunakan TypeScript strict; minimalkan `any`.
8. Buat commit history yang bermakna, minimal 5 commit; bukan hanya `initial commit`.

## Bonus (opsional)

- Search berdasarkan nama orang
- Sort berdasarkan jumlah atau tanggal
- Group beberapa debt dari orang yang sama, misalnya: `Budi: 3 entry, total Rp X`
- Bar chart perbandingan total dihutang dan hutang
- Tangani empty state, loading state, dan error state
- Desain mobile-first yang benar-benar nyaman di HP

## Submission

1. Repository publik pada akun GitHub sendiri
2. Deployment Vercel free tier dengan link aktif
3. Project Supabase sendiri; free tier boleh, demo harus berjalan tanpa setup ulang oleh reviewer
4. Loom maksimal 3 menit:
   - Demo: 1 menit
   - Satu keputusan teknis yang dibanggakan: 1 menit
   - Satu hal yang masih kurang: 1 menit
5. Kirim semua link ke recruiter

## Rubrik Penilaian

| Kategori | Bobot | Sinyal kuat |
|---|---:|---|
| DB + RLS | 25% | Schema rapi, RLS strict, tidak bocor saat diuji via `curl` |
| Code quality | 20% | TypeScript proper, komponen dipisah logis, hook reusable, penamaan konsisten |
| UI/UX taste | 20% | Spacing rapi, hierarchy jelas, nyaman di mobile, micro-interaction halus |
| Business logic | 20% | Perhitungan net benar, format Rupiah benar, toggle status idempoten |
| Communication | 15% | README jelas, commit bermakna, Loom rapi, trade-off dijelaskan |

## Auto-Reject

- RLS bocor: data pengguna lain dapat dibaca atau diedit melalui Supabase REST API
- Format Rupiah salah atau tidak konsisten
- **Tandai lunas** hanya berubah di client dan kembali saat halaman di-refresh
- `any` digunakan di mana-mana
- Data mock/hardcode dipakai di production
- Deployment tidak berjalan
- Tidak mampu menjelaskan kode secara jelas di Loom/interview