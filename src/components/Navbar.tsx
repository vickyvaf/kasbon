'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useUserQuery } from '@/hooks/useAuth'
import { useDisclosure } from '@/hooks/useDisclosure'
import { SettingsModal } from '@/components/SettingsModal'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { data: user } = useUserQuery()
  const settingsModal = useDisclosure()

  async function handleLogout() {
    queryClient.clear()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
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
              onClick={() => settingsModal.onOpen()}
              className="border-zinc-800 hover:bg-zinc-900 flex items-center gap-1.5 text-xs text-zinc-300"
              title="Pengaturan Akun & Notifikasi"
            >
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Pengaturan</span>
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

      <SettingsModal
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.onClose}
        userEmail={user?.email}
      />
    </>
  )
}
