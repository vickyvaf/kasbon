'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useUserQuery } from '@/hooks/useAuth'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { data: user } = useUserQuery()

  async function handleLogout() {
    queryClient.clear()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo size={32} />
          <span className="font-bold text-xl tracking-tight text-white">Kasbon</span>
        </div>

        <div className="flex items-center space-x-4">
          {user?.email && (
            <span className="text-xs sm:text-sm text-zinc-400 hidden sm:inline">
              {user.email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-zinc-800 hover:bg-zinc-900 flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
