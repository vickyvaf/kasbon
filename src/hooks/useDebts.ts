import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DebtStatusFilter, DebtTypeFilter } from '@/lib/types'
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useUpdateDebtMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDebtFormInput }) =>
      updateDebt({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}

export function useDeleteDebtMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDebt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
    },
  })
}
