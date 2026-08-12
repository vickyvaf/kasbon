'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authSchema, AuthFormInput } from '@/schemas/authSchema'
import { useLoginMutation, useSignupMutation } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const [uiState, setUiState] = useState({
    isSignUp: false,
    message: '',
    messageType: 'error' as 'error' | 'success',
  })

  const loginMutation = useLoginMutation()
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

  const isLoading = loginMutation.isPending || signupMutation.isPending

  async function onSubmit(data: AuthFormInput) {
    setUiState((prev) => ({ ...prev, message: '' }))

    if (uiState.isSignUp) {
      try {
        await signupMutation.mutateAsync(data)
        setUiState((prev) => ({
          ...prev,
          message: 'Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi atau langsung masuk.',
          messageType: 'success',
          isSignUp: false,
        }))
      } catch (err: unknown) {
        setUiState((prev) => ({
          ...prev,
          message: err instanceof Error ? err.message : 'Gagal mendaftar.',
          messageType: 'error',
        }))
      }
    } else {
      try {
        await loginMutation.mutateAsync(data)
        router.push('/')
        router.refresh()
      } catch (err: unknown) {
        setUiState((prev) => ({
          ...prev,
          message: err instanceof Error ? err.message : 'Email atau password salah.',
          messageType: 'error',
        }))
      }
    }
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
            {uiState.isSignUp
              ? 'Buat akun baru untuk mulai mencatat utang-piutang'
              : 'Masuk ke akun Anda untuk mengelola catatan utang'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {uiState.message && (
              <div
                className={`p-3 text-sm rounded border ${
                  uiState.messageType === 'error'
                    ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-300'
                    : 'border-green-200 bg-green-50 text-green-700 dark:bg-green-950 dark:border-green-900 dark:text-green-300'
                }`}
              >
                {uiState.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? 'Memproses...'
                : uiState.isSignUp
                ? 'Daftar Akun'
                : 'Masuk'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {uiState.isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <button
              type="button"
              onClick={() =>
                setUiState((prev) => ({
                  ...prev,
                  isSignUp: !prev.isSignUp,
                  message: '',
                }))
              }
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              {uiState.isSignUp ? 'Masuk sekarang' : 'Daftar sekarang'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
