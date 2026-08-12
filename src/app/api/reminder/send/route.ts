import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { generateReminderEmailHtml } from '@/lib/emailTemplate'

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
      return NextResponse.json({ error: 'Gagal mengambil data utang.' }, { status: 500 })
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

    const htmlContent = generateReminderEmailHtml({
      userEmail: user.email,
      pendingDebts,
      totalOwedToMe,
      totalIOwe,
    })

    const { data, error } = await resend.emails.send({
      from: 'Kasbon <onboarding@resend.dev>',
      to: user.email,
      subject: '📌 Pengingat Catatan Utang-Piutang Kasbon',
      html: htmlContent,
    })

    if (error) {
      if (error.message?.includes('You can only send testing emails')) {
        return NextResponse.json(
          {
            error:
              'Mode Testing Resend: Email hanya dapat dikirim ke vickyadi243@gmail.com (pemilik API Key Resend). Daftarkan domain di resend.com untuk kirim ke email lain.',
          },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 })
  }
}
