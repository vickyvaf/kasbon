import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'

dayjs.extend(relativeTime)
dayjs.locale('id')

export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount)
  return `Rp ${formatted}`
}

export function formatRelativeDate(dateString: string): string {
  if (!dateString) return ''
  return dayjs(dateString).fromNow()
}

export { dayjs }
