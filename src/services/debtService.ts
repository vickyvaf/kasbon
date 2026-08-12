import { Debt, DebtStatusFilter, DebtTypeFilter } from '@/lib/types'
import { CreateDebtFormInput, UpdateDebtFormInput } from '@/schemas/debtSchema'

export async function fetchDebts(
  status: DebtStatusFilter = 'all',
  type: DebtTypeFilter = 'all'
): Promise<Debt[]> {
  const queryParams = new URLSearchParams()
  if (status !== 'all') queryParams.set('status', status)
  if (type !== 'all') queryParams.set('type', type)

  const res = await fetch(`/api/debts?${queryParams.toString()}`)
  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Gagal mengambil data catatan utang.')
  }

  return json.data || []
}

export async function createDebt(data: CreateDebtFormInput): Promise<Debt> {
  const res = await fetch('/api/debts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error || 'Gagal menambahkan catatan utang.')
  }

  return json.data
}

export async function updateDebt({
  id,
  data,
}: {
  id: string
  data: UpdateDebtFormInput
}): Promise<Debt> {
  const res = await fetch(`/api/debts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error || 'Gagal memperbarui catatan utang.')
  }

  return json.data
}

export async function deleteDebt(id: string): Promise<void> {
  const res = await fetch(`/api/debts/${id}`, {
    method: 'DELETE',
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error || 'Gagal menghapus catatan utang.')
  }
}
