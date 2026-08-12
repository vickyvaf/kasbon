export type DebtType = 'owed_to_me' | 'i_owe'

export interface Debt {
  id: string
  user_id: string
  type: DebtType
  counterpart_name: string
  amount: number
  note: string | null
  due_date: string | null
  settled_at: string | null
  created_at: string
  updated_at: string
}

export type DebtStatusFilter = 'all' | 'pending' | 'settled'
export type DebtTypeFilter = 'all' | 'owed_to_me' | 'i_owe'

export interface CreateDebtInput {
  type: DebtType
  counterpart_name: string
  amount: number
  note?: string | null
  due_date?: string | null
}

export interface UpdateDebtInput {
  type?: DebtType
  counterpart_name?: string
  amount?: number
  note?: string | null
  due_date?: string | null
  settled_at?: string | null
}
