import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { AuthFormInput } from '@/schemas/authSchema'

function formatAuthError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('invalid login credentials')) {
    return 'Email atau password salah.'
  }
  if (lower.includes('user already registered')) {
    return 'Email ini sudah terdaftar. Silakan langsung masuk.'
  }
  return message || 'Terjadi kesalahan saat otentikasi.'
}

export function useLoginMutation() {
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ email, password }: AuthFormInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        throw new Error(formatAuthError(error.message))
      }
      return data
    },
  })
}

export function useSignupMutation() {
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ email, password }: AuthFormInput) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        throw new Error(formatAuthError(error.message))
      }
      return data
    },
  })
}
