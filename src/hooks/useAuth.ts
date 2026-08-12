import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { AuthFormInput } from '@/schemas/authSchema'

export function useLoginMutation() {
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ email, password }: AuthFormInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        throw new Error(error.message)
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
        throw new Error(error.message)
      }
      return data
    },
  })
}
