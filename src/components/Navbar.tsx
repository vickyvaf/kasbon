'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useUserQuery } from '@/hooks/useAuth'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { LogOut, Mail } from 'lucide-react'
import { toast } from 'sonner'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { data: user } = useUserQuery()
  const [isSending, setIsSending] = useState(false)

  async function handleLogout() {
    queryClient.clear()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function handleSendReminder() {
    setIsSending(true)
    try {
      const res = await fetch('/api/reminder/send', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Gagal mengirim email pengingat.')
      } else {
        toast.success(data.message || `Email pengingat berhasil dikirim ke ${user?.email}`)
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengirim email.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo size={32} />
          <span className="font-bold text-xl tracking-tight text-white">Kasbon</span>
        </div>

        <div className="flex items-center space-x-3">
          {user?.email && (
            <span className="text-xs sm:text-sm text-zinc-400 hidden sm:inline">
              {user.email}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSendReminder}
            disabled={isSending}
            className="border-zinc-800 hover:bg-zinc-900 flex items-center gap-1.5 text-xs text-zinc-300"
            title="Kirim pengingat catatan ke email Anda"
          >
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span className="hidden md:inline">
              {isSending ? 'Mengirim...' : 'Kirim Pengingat'}
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-zinc-800 hover:bg-zinc-900 flex items-center gap-1.5 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
