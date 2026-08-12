import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateDebtSchema } from '@/schemas/debtSchema'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir. Silakan login kembali.' },
        { status: 401 }
      )
    }

    const rawBody = await request.json()
    const parseResult = updateDebtSchema.safeParse(rawBody)

    if (!parseResult.success) {
      const firstErrorMessage = parseResult.error.issues[0]?.message || 'Input data tidak valid.'
      return NextResponse.json(
        { error: firstErrorMessage },
        { status: 400 }
      )
    }

    const body = parseResult.data

    const updatePayload = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v !== undefined)
    )

    const { data, error } = await supabase
      .from('debts')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Catatan tidak ditemukan atau gagal diperbarui.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui data.' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir. Silakan login kembali.' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Gagal menghapus catatan utang.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Catatan utang berhasil dihapus.' })
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    )
  }
}
