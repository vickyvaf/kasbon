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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Settings, Mail, Bell } from 'lucide-react'
import { useSendReminderMutation } from '@/hooks/useReminder'
import { toast } from 'sonner'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
}

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Setiap Hari', desc: 'Kirim notifikasi setiap pagi pukul 08.00' },
  { value: 'weekly', label: 'Setiap Minggu', desc: 'Kirim notifikasi setiap hari Senin' },
  { value: 'monthly', label: 'Setiap Bulan', desc: 'Kirim notifikasi tanggal 1 setiap bulan' },
  { value: 'off', label: 'Matikan Pengingat', desc: 'Jangan kirim email pengingat otomatis' },
]

export function SettingsModal({
  isOpen,
  onClose,
  userEmail,
}: SettingsModalProps) {
  const sendReminderMutation = useSendReminderMutation(userEmail)
  const [frequency, setFrequency] = useState('weekly')

  function handleFrequencyChange(val: string) {
    setFrequency(val)
    const selected = FREQUENCY_OPTIONS.find((f) => f.value === val)
    toast.success(`Jadwal pengingat otomatis diperbarui: ${selected?.label}`)
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
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm">
            <div className="font-medium text-zinc-200">Email Terdaftar</div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5">{userEmail || 'User'}</div>
          </div>

          {/* Automatic Reminder Frequency Radio Group */}
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1.5 font-medium text-sm text-zinc-200">
              <Bell className="w-4 h-4 text-primary" />
              <span>Jadwal Pengingat Otomatis</span>
            </div>

            <RadioGroup value={frequency} onValueChange={handleFrequencyChange} className="space-y-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start space-x-3 p-2 rounded-md border cursor-pointer transition-colors ${
                    frequency === opt.value
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-zinc-800/80 hover:bg-zinc-800/40'
                  }`}
                >
                  <RadioGroupItem value={opt.value} id={`freq-${opt.value}`} className="mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-zinc-200">{opt.label}</div>
                    <div className="text-[11px] text-zinc-400">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </RadioGroup>
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
              onClick={() => sendReminderMutation.mutate()}
              disabled={sendReminderMutation.isPending}
              className="w-full mt-2 border-zinc-700 hover:bg-zinc-800 text-xs font-medium"
            >
              {sendReminderMutation.isPending ? 'Mengirim Email...' : 'Kirim Ringkasan ke Email Saya'}
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
