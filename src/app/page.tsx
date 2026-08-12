'use client'

import { useState } from 'react'
import { Debt, DebtStatusFilter, DebtTypeFilter } from '@/lib/types'
import { CreateDebtFormInput } from '@/schemas/debtSchema'
import { DebtModal } from '@/components/DebtModal'
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal'
import { Navbar } from '@/components/Navbar'
import { SummaryCards } from '@/components/SummaryCards'
import { FilterBar } from '@/components/FilterBar'
import { DebtListItem } from '@/components/DebtListItem'
import { DebtListGrouped } from '@/components/DebtListGrouped'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useDebounce } from '@/hooks/useDebounce'
import {
  useDebtsQuery,
  useCreateDebtMutation,
  useUpdateDebtMutation,
  useDeleteDebtMutation,
} from '@/hooks/useDebts'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ListFilter, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    status: 'all' as DebtStatusFilter,
    type: 'all' as DebtTypeFilter,
    search: '',
    groupByPerson: false,
  })

  const modalDisclosure = useDisclosure<Debt>()
  const deleteModalDisclosure = useDisclosure<Debt>()

  const { data: debts = [], isLoading, isError, error } = useDebtsQuery(filters.status, filters.type)
  const createMutation = useCreateDebtMutation()
  const updateMutation = useUpdateDebtMutation()
  const deleteMutation = useDeleteDebtMutation()

  function handleSaveDebt(formData: CreateDebtFormInput, id?: string) {
    if (id) {
      updateMutation.mutate({ id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
    modalDisclosure.onClose()
  }

  function handleToggleSettled(debt: Debt) {
    const newSettledAt = debt.settled_at ? null : new Date().toISOString()
    updateMutation.mutate({
      id: debt.id,
      data: { settled_at: newSettledAt },
    })
  }

  function handleConfirmDelete() {
    if (deleteModalDisclosure.data) {
      deleteMutation.mutate(deleteModalDisclosure.data.id)
    }
  }

  const totalOwedToMe = debts
    .filter((d) => d.type === 'owed_to_me' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const totalIOwe = debts
    .filter((d) => d.type === 'i_owe' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const netBalance = totalOwedToMe - totalIOwe
  const debouncedSearch = useDebounce(filters.search, 300)

  const filteredDebts = debts.filter(
    (debt) =>
      debt.counterpart_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (debt.note && debt.note.toLowerCase().includes(debouncedSearch.toLowerCase()))
  )

  const groupedDebts = filteredDebts.reduce((acc, debt) => {
    const key = debt.counterpart_name.trim().toLowerCase()
    if (!acc[key]) {
      acc[key] = { name: debt.counterpart_name, totalOwedToMe: 0, totalIOwe: 0, items: [] }
    }
    acc[key].items.push(debt)
    if (!debt.settled_at) {
      if (debt.type === 'owed_to_me') acc[key].totalOwedToMe += debt.amount
      else acc[key].totalIOwe += debt.amount
    }
    return acc
  }, {} as Record<string, { name: string; totalOwedToMe: number; totalIOwe: number; items: Debt[] }>)

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <SummaryCards
          totalOwedToMe={totalOwedToMe}
          totalIOwe={totalIOwe}
          netBalance={netBalance}
        />

        <FilterBar
          search={filters.search}
          onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          status={filters.status}
          onStatusChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
          type={filters.type}
          onTypeChange={(val) => setFilters((prev) => ({ ...prev, type: val }))}
          groupByPerson={filters.groupByPerson}
          onToggleGroupByPerson={() => setFilters((prev) => ({ ...prev, groupByPerson: !prev.groupByPerson }))}
          onCreateClick={() => modalDisclosure.onOpen()}
        />

        {isError && (
          <div className="p-4 text-sm rounded border border-red-900/50 bg-red-950/40 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data.'}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            Memuat data catatan utang...
          </div>
        ) : filteredDebts.length === 0 ? (
          <Card className="text-center py-12 bg-zinc-950 border-zinc-800">
            <CardContent className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500">
                <ListFilter className="w-6 h-6" />
              </div>
              <div className="font-semibold text-base">Belum Ada Catatan Utang</div>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                {filters.search || filters.status !== 'all' || filters.type !== 'all'
                  ? 'Tidak ada catatan yang sesuai dengan filter yang dipilih.'
                  : 'Mulai dengan mencatat utang atau piutang baru.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-800 hover:bg-zinc-900"
                onClick={() => modalDisclosure.onOpen()}
              >
                <Plus className="w-4 h-4 mr-1.5 inline" /> Catat Sekarang
              </Button>
            </CardContent>
          </Card>
        ) : filters.groupByPerson ? (
          <DebtListGrouped
            groupedDebts={groupedDebts}
            onToggleSettled={handleToggleSettled}
            onEdit={(d) => modalDisclosure.onOpen(d)}
            onDelete={(d) => deleteModalDisclosure.onOpen(d)}
          />
        ) : (
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="p-0 divide-y divide-zinc-800/60">
              {filteredDebts.map((debt) => (
                <DebtListItem
                  key={debt.id}
                  debt={debt}
                  onToggleSettled={handleToggleSettled}
                  onEdit={(d) => modalDisclosure.onOpen(d)}
                  onDelete={(d) => deleteModalDisclosure.onOpen(d)}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </main>

      <DebtModal
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
        onSave={handleSaveDebt}
        initialData={modalDisclosure.data}
      />

      <DeleteConfirmModal
        isOpen={deleteModalDisclosure.isOpen}
        onClose={deleteModalDisclosure.onClose}
        onConfirm={handleConfirmDelete}
        counterpartName={deleteModalDisclosure.data?.counterpart_name}
      />
    </div>
  )
}
