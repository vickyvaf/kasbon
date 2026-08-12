import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

async function sendReminderApi() {
  const res = await fetch('/api/reminder/send', { method: 'POST' })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Gagal mengirim email pengingat.')
  }
  return data
}

export function useSendReminderMutation(userEmail?: string) {
  return useMutation({
    mutationFn: sendReminderApi,
    onSuccess: (data) => {
      toast.success(
        data.message || `Email pengingat berhasil dikirim ke ${userEmail || 'email Anda'}`
      )
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Terjadi kesalahan saat mengirim email.')
    },
  })
}
