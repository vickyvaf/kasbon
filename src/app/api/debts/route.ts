import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateDebtInput } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir. Silakan login kembali.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const type = searchParams.get('type') || 'all'

    let query = supabase
      .from('debts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status === 'pending') {
      query = query.is('settled_at', null)
    } else if (status === 'settled') {
      query = query.not('settled_at', 'is', null)
    }

    if (type === 'owed_to_me' || type === 'i_owe') {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Gagal mengambil data catatan utang.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sesi Anda telah berakhir. Silakan login kembali.' },
        { status: 401 }
      )
    }

    const body: CreateDebtInput = await request.json()

    if (!body.type || !['owed_to_me', 'i_owe'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Tipe utang harus dipilih (di-hutang / hutang).' },
        { status: 400 }
      )
    }

    if (!body.counterpart_name || body.counterpart_name.trim() === '') {
      return NextResponse.json(
        { error: 'Nama orang wajib diisi.' },
        { status: 400 }
      )
    }

    if (typeof body.amount !== 'number' || body.amount <= 0 || isNaN(body.amount)) {
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

    const { data, error } = await supabase
      .from('debts')
      .insert({
        user_id: user.id,
        type: body.type,
        counterpart_name: body.counterpart_name.trim(),
        amount: Math.round(body.amount),
        note: body.note ? body.note.trim() : null,
        due_date: body.due_date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Gagal membuat catatan utang baru.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses data.' },
      { status: 400 }
    )
  }
}
