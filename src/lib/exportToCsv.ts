import { Debt } from '@/lib/types'

export function exportDebtsToCsv(debts: Debt[]) {
  if (!debts || debts.length === 0) return

  const headers = [
    'Nama Orang',
    'Tipe Utang',
    'Jumlah (Rp)',
    'Status',
    'Tanggal Catat',
    'Jatuh Tempo',
    'Catatan',
  ]

  const rows = debts.map((d) => [
    `"${d.counterpart_name.replace(/"/g, '""')}"`,
    `"${d.type === 'owed_to_me' ? 'Saya dihutang (Piutang)' : 'Saya hutang (Utang)'}"`,
    d.amount,
    `"${d.settled_at ? 'Lunas' : 'Belum Lunas'}"`,
    `"${new Date(d.created_at).toLocaleDateString('id-ID')}"`,
    `"${d.due_date ? d.due_date : '-'}"`,
    `"${(d.note || '').replace(/"/g, '""')}"`,
  ])

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `catatan-kasbon-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
