import { Debt } from '@/lib/types'
import { formatRupiah } from '@/lib/formatters'

interface EmailTemplateOptions {
  userEmail: string
  pendingDebts: Debt[]
  totalOwedToMe: number
  totalIOwe: number
}

export function generateReminderEmailHtml({
  userEmail,
  pendingDebts,
  totalOwedToMe,
  totalIOwe,
}: EmailTemplateOptions): string {
  const debtItemsHtml = pendingDebts
    .map((d) => {
      const isOwed = d.type === 'owed_to_me'
      const typeLabel = isOwed ? 'Piutang (Dihutangkan)' : 'Utang (Saya Hutang)'
      const color = isOwed ? '#10b981' : '#f43f5e'
      const dueDateStr = d.due_date ? ` • Jatuh Tempo: ${d.due_date}` : ''
      return `
        <li style="margin-bottom: 10px; padding: 12px; border-radius: 8px; background-color: #18181b; border: 1px solid #27272a; color: #f4f4f5;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 15px; color: #f4f4f5;">${d.counterpart_name}</strong>
            <span style="color: ${color}; font-weight: 700; font-size: 15px;">${formatRupiah(d.amount)}</span>
          </div>
          <div style="font-size: 12px; color: #a1a1aa; margin-top: 6px;">
            Tipe: ${typeLabel} ${dueDateStr}
            ${d.note ? `<br/><span style="font-style: italic; color: #d4d4d8;">Catatan: ${d.note}</span>` : ''}
          </div>
        </li>
      `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="background-color: #000000; margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 560px; margin: 0 auto; padding: 28px; background-color: #09090b; color: #f4f4f5; border-radius: 16px; border: 1px solid #27272a;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <h2 style="color: #FC580F; margin: 0; font-size: 22px; font-weight: 800;">Kasbon</h2>
          </div>

          <p style="color: #a1a1aa; font-size: 14px; margin-top: 0; line-height: 1.5;">
            Halo <strong>${userEmail}</strong>,<br/>
            Berikut adalah ringkasan seluruh catatan utang dan piutang Anda yang belum lunas:
          </p>
          
          <table style="width: 100%; border-collapse: separate; border-spacing: 8px; margin: 20px 0;">
            <tr>
              <td style="width: 50%; padding: 14px; background: #18181b; border-radius: 10px; border: 1px solid #27272a;">
                <div style="font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: 600;">Total Piutang</div>
                <div style="font-size: 18px; font-weight: 700; color: #10b981; margin-top: 4px;">${formatRupiah(totalOwedToMe)}</div>
              </td>
              <td style="width: 50%; padding: 14px; background: #18181b; border-radius: 10px; border: 1px solid #27272a;">
                <div style="font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: 600;">Total Utang</div>
                <div style="font-size: 18px; font-weight: 700; color: #f43f5e; margin-top: 4px;">${formatRupiah(totalIOwe)}</div>
              </td>
            </tr>
          </table>

          <h3 style="font-size: 14px; color: #e4e4e7; margin-top: 24px; margin-bottom: 12px; font-weight: 600;">
            Daftar Belum Lunas (${pendingDebts.length} Catatan):
          </h3>
          
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${debtItemsHtml}
          </ul>

          <div style="margin-top: 32px; padding-top: 18px; border-top: 1px solid #27272a; text-align: center; font-size: 12px; color: #71717a;">
            Email pengingat dikirim otomatis dari sistem Kasbon.<br/>
            &copy; ${new Date().getFullYear()} Kasbon Tracker.
          </div>
        </div>
      </body>
    </html>
  `
}
