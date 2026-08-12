import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Debt, DebtStatusFilter, DebtTypeFilter } from '@/lib/types'
import {
  fetchDebts,
  createDebt,
  updateDebt,
  deleteDebt,
} from '@/services/debtService'
import { CreateDebtFormInput, UpdateDebtFormInput } from '@/schemas/debtSchema'

export function useDebtsQuery(
  status: DebtStatusFilter = 'all',
  type: DebtTypeFilter = 'all'
) {
  return useQuery({
    queryKey: ['debts', status, type],
    queryFn: () => fetchDebts(status, type),
  })
}

export function useCreateDebtMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDebtFormInput) => createDebt(data),
    onMutate: async (newDebtInput) => {
      await queryClient.cancelQueries({ queryKey: ['debts'] })

      const previousQueries = queryClient.getQueriesData<Debt[]>({ queryKey: ['debts'] })

      const optimisticDebt: Debt = {
        id: `temp-${Date.now()}`,
        user_id: 'optimistic-user',
        type: newDebtInput.type,
        counterpart_name: newDebtInput.counterpart_name,
        amount: newDebtInput.amount,
        note: newDebtInput.note || null,
        due_date: newDebtInput.due_date || new Date().toISOString().split('T')[0],
        settled_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      queryClient.setQueriesData<Debt[]>({ queryKey: ['debts'] }, (oldData) => {
        return oldData ? [optimisticDebt, ...oldData] : [optimisticDebt]
      })

      return { previousQueries }
    },
    onSuccess: () => {
      toast.success('Catatan utang baru berhasil disimpan!')
    },
    onError: (err: any, _newDebtInput, context) => {
      toast.error(err?.message || 'Gagal menyimpan catatan utang.')
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useUpdateDebtMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDebtFormInput }) =>
      updateDebt({ id, data }),
    onMutate: async ({ id, data: updateInput }) => {
      await queryClient.cancelQueries({ queryKey: ['debts'] })

      const previousQueries = queryClient.getQueriesData<Debt[]>({ queryKey: ['debts'] })

      queryClient.setQueriesData<Debt[]>({ queryKey: ['debts'] }, (oldData) => {
        if (!oldData) return []
        return oldData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...updateInput,
              counterpart_name:
                updateInput.counterpart_name !== undefined
                  ? updateInput.counterpart_name
                  : item.counterpart_name,
              amount:
                updateInput.amount !== undefined ? updateInput.amount : item.amount,
              updated_at: new Date().toISOString(),
            }
          }
          return item
        })
      })

      return { previousQueries }
    },
    onSuccess: () => {
      toast.success('Catatan utang berhasil diperbarui!')
    },
    onError: (err: any, _variables, context) => {
      toast.error(err?.message || 'Gagal memperbarui catatan utang.')
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useDeleteDebtMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDebt(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['debts'] })

      const previousQueries = queryClient.getQueriesData<Debt[]>({ queryKey: ['debts'] })

      queryClient.setQueriesData<Debt[]>({ queryKey: ['debts'] }, (oldData) => {
        if (!oldData) return []
        return oldData.filter((item) => item.id !== deletedId)
      })

      return { previousQueries }
    },
    onSuccess: () => {
      toast.success('Catatan utang berhasil dihapus!')
    },
    onError: (err: any, _deletedId, context) => {
      toast.error(err?.message || 'Gagal menghapus catatan utang.')
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}
