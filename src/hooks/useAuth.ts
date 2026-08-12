import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { AuthFormInput } from '@/schemas/authSchema'

export function useUserQuery() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
    staleTime: Infinity,
  })
}

export function useLoginMutation() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: AuthFormInput) => {
      queryClient.clear()
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: AuthFormInput) => {
      queryClient.clear()
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
