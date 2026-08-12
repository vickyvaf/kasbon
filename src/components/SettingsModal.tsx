'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Settings, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
}

export function SettingsModal({
  isOpen,
  onClose,
  userEmail,
}: SettingsModalProps) {
  const [isSending, setIsSending] = useState(false)

  async function handleSendReminderNow() {
    setIsSending(true)
    try {
      const res = await fetch('/api/reminder/send', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Gagal mengirim email pengingat.')
      } else {
        toast.success(data.message || `Email pengingat berhasil dikirim ke ${userEmail}`)
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengirim email.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Pengaturan Akun & Notifikasi</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Kelola preferensi email pengingat dan akun Kasbon Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Email Destination Info */}
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-sm">
            <div className="space-y-0.5">
              <div className="font-medium text-zinc-200">Email Terdaftar</div>
              <div className="text-xs text-zinc-400 font-mono">{userEmail || 'User'}</div>
            </div>
            <div className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-300 font-mono">
              Resend SDK
            </div>
          </div>

          {/* Trigger Send Email Test / Now */}
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
            <div className="space-y-0.5">
              <div className="font-medium text-sm text-zinc-200 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary" />
                <span>Kirim Email Pengingat Sekarang</span>
              </div>
              <div className="text-xs text-zinc-400">
                Kirim ringkasan seluruh utang belum lunas ke email Anda
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendReminderNow}
              disabled={isSending}
              className="w-full mt-2 border-zinc-700 hover:bg-zinc-800 text-xs font-medium"
            >
              {isSending ? 'Mengirim Email...' : 'Kirim Ringkasan ke Email Saya'}
            </Button>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-800 hover:bg-zinc-900 w-full"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
