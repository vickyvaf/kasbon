import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { formatRupiah } from '@/lib/formatters'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized: Harap masuk terlebih dahulu.' }, { status: 401 })
    }

    const { data: debts, error: debtsError } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', user.id)
      .is('settled_at', null)
      .order('created_at', { ascending: false })

    if (debtsError) {
      return NextResponse.json({ error: debtsError.message }, { status: 500 })
    }

    const pendingDebts = debts || []
    if (pendingDebts.length === 0) {
      return NextResponse.json({ message: 'Tidak ada utang atau piutang belum lunas yang perlu diingatkan.' })
    }

    const totalOwedToMe = pendingDebts
      .filter((d) => d.type === 'owed_to_me')
      .reduce((sum, d) => sum + Number(d.amount), 0)

    const totalIOwe = pendingDebts
      .filter((d) => d.type === 'i_owe')
      .reduce((sum, d) => sum + Number(d.amount), 0)

    const debtItemsHtml = pendingDebts
      .map((d) => {
        const isOwed = d.type === 'owed_to_me'
        const typeLabel = isOwed ? 'Piutang (Dihutangkan)' : 'Utang (Saya Hutang)'
        const color = isOwed ? '#10b981' : '#f43f5e'
        const dueDateStr = d.due_date ? ` • Jatuh Tempo: ${d.due_date}` : ''
        return `
          <li style="margin-bottom: 10px; padding: 10px; border-radius: 6px; background-color: #18181b; border: 1px solid #27272a; color: #f4f4f5;">
            <strong style="font-size: 16px;">${d.counterpart_name}</strong>
            <span style="color: ${color}; font-weight: bold; margin-left: 10px;">${formatRupiah(d.amount)}</span>
            <div style="font-size: 12px; color: #a1a1aa; margin-top: 4px;">
              Tipe: ${typeLabel} ${dueDateStr}
              ${d.note ? `<br/><em>Catatan: ${d.note}</em>` : ''}
            </div>
          </li>
        `
      })
      .join('')

    const { data, error } = await resend.emails.send({
      from: 'Kasbon <onboarding@resend.dev>',
      to: user.email,
      subject: '📌 Pengingat Catatan Utang-Piutang Kasbon',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #f4f4f5; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #FC580F; margin-top: 0;">Catatan Utang-Piutang Anda</h2>
          <p style="color: #a1a1aa; font-size: 14px;">Halo <strong>${user.email}</strong>, berikut ringkasan catatan yang belum lunas di akun Kasbon Anda:</p>
          
          <div style="display: flex; gap: 12px; margin: 16px 0;">
            <div style="flex: 1; padding: 12px; background: #18181b; border-radius: 8px;">
              <div style="font-size: 12px; color: #a1a1aa;">Total Piutang</div>
              <div style="font-size: 18px; font-weight: bold; color: #10b981;">${formatRupiah(totalOwedToMe)}</div>
            </div>
            <div style="flex: 1; padding: 12px; background: #18181b; border-radius: 8px;">
              <div style="font-size: 12px; color: #a1a1aa;">Total Utang</div>
              <div style="font-size: 18px; font-weight: bold; color: #f43f5e;">${formatRupiah(totalIOwe)}</div>
            </div>
          </div>

          <h3 style="font-size: 14px; color: #d4d4d8; margin-top: 20px;">Daftar Belum Lunas (${pendingDebts.length} Catatan):</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${debtItemsHtml}
          </ul>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #27272a; text-align: center; font-size: 12px; color: #71717a;">
            Email pengingat dikirim otomatis dari sistem Kasbon.
          </div>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 })
  }
}
