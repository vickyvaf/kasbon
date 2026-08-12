'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema, AuthFormInput } from '@/schemas/authSchema'
import { useSignupMutation } from '@/hooks/useAuth'
import { useDisclosure } from '@/hooks/useDisclosure'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/Logo'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const showPassword = useDisclosure(false)
  const signupMutation = useSignupMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInput>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: AuthFormInput) {
    await signupMutation.mutateAsync(data)
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 text-foreground">
      <Card className="w-full max-w-md shadow-sm border-zinc-800 bg-zinc-950">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <Logo size={48} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Daftar Akun Kasbon</CardTitle>
          <CardDescription>
            Buat akun baru untuk mulai mencatat utang-piutang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {signupMutation.error && (
              <div className="p-3 text-sm rounded border border-red-900/50 bg-red-950/40 text-red-400">
                {signupMutation.error.message}
              </div>
            )}

            {signupMutation.isSuccess && (
              <div className="p-3 text-sm rounded border border-emerald-900/50 bg-emerald-950/40 text-emerald-400">
                Pendaftaran berhasil! Mengalihkan ke halaman masuk...
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword.isOpen ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="bg-zinc-900 border-zinc-800 pr-10 focus-visible:ring-primary"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={showPassword.onToggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword.isOpen ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword.isOpen ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? 'Memproses...' : 'Daftar Akun'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-zinc-800 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Masuk sekarang
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
