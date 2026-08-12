'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.')
      setLoading(false)
      return
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message || 'Gagal mendaftar. Silakan coba lagi.')
      } else {
        setSuccessMsg('Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi atau langsung masuk.')
        setIsSignUp(false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg('Email atau password salah.')
      } else {
        router.push('/')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
              <Wallet className="w-6 h-6 text-slate-900 dark:text-slate-100" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Kasbon</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Buat akun baru untuk mulai mencatat utang-piutang'
              : 'Masuk ke akun Anda untuk mengelola catatan utang'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm rounded border border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 text-sm rounded border border-green-200 bg-green-50 text-green-700 dark:bg-green-950 dark:border-green-900 dark:text-green-300">
                {successMsg}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? 'Memproses...'
                : isSignUp
                ? 'Daftar Akun'
                : 'Masuk'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setErrorMsg('')
                setSuccessMsg('')
              }}
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              {isSignUp ? 'Masuk sekarang' : 'Daftar sekarang'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
