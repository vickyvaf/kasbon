import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { UpdateDebtInput } from '@/lib/types'

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

    const body: UpdateDebtInput = await request.json()

    // Validate if present
    if (body.type && !['owed_to_me', 'i_owe'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Tipe utang tidak valid.' },
        { status: 400 }
      )
    }

    if (body.counterpart_name !== undefined && body.counterpart_name.trim() === '') {
      return NextResponse.json(
        { error: 'Nama orang tidak boleh kosong.' },
        { status: 400 }
      )
    }

    if (body.amount !== undefined && (typeof body.amount !== 'number' || body.amount <= 0 || isNaN(body.amount))) {
      return NextResponse.json(
        { error: 'Jumlah harus berupa angka lebih besar dari 0.' },
        { status: 400 }
      )
    }

    if (body.note && body.note.length > 200) {
      return NextResponse.json(
        { error: 'Catatan maksimum 200 karakter.' },
        { status: 400 }
      )
    }

    const updatePayload: Record<string, unknown> = {}
    if (body.type) updatePayload.type = body.type
    if (body.counterpart_name !== undefined) updatePayload.counterpart_name = body.counterpart_name.trim()
    if (body.amount !== undefined) updatePayload.amount = Math.round(body.amount)
    if (body.note !== undefined) updatePayload.note = body.note ? body.note.trim() : null
    if (body.due_date !== undefined) updatePayload.due_date = body.due_date
    if (body.settled_at !== undefined) updatePayload.settled_at = body.settled_at

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
