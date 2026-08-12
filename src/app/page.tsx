'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Debt, DebtStatusFilter, DebtTypeFilter } from '@/lib/types'
import { CreateDebtFormInput } from '@/schemas/debtSchema'
import { formatRupiah, formatRelativeDate } from '@/lib/formatters'
import { DebtModal } from '@/components/DebtModal'
import { Logo } from '@/components/Logo'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useQueryClient } from '@tanstack/react-query'
import {
  useDebtsQuery,
  useCreateDebtMutation,
  useUpdateDebtMutation,
  useDeleteDebtMutation,
} from '@/hooks/useDebts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  LogOut,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Undo2,
  Trash2,
  Edit2,
  Search,
  Users,
  ListFilter,
  AlertCircle,
} from 'lucide-react'

const STATUS_LABELS: Record<DebtStatusFilter, string> = {
  all: 'Semua Status',
  pending: 'Belum Lunas',
  settled: 'Lunas',
}

const TYPE_LABELS: Record<DebtTypeFilter, string> = {
  all: 'Semua Tipe',
  owed_to_me: 'Di-hutang ke Saya',
  i_owe: 'Saya Hutang',
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  // User state
  const [userEmail, setUserEmail] = useState<string>('')

  // Consolidated Filters & Search Object State
  const [filters, setFilters] = useState({
    status: 'all' as DebtStatusFilter,
    type: 'all' as DebtTypeFilter,
    search: '',
    groupByPerson: false,
  })

  // Modal State using custom useDisclosure hook
  const modalDisclosure = useDisclosure(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  // React Query Custom Hooks
  const { data: debts = [], isLoading, isError, error } = useDebtsQuery(filters.status, filters.type)
  const createMutation = useCreateDebtMutation()
  const updateMutation = useUpdateDebtMutation()
  const deleteMutation = useDeleteDebtMutation()

  // Auth user session check
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email || '')
    }
    checkAuth()
  }, [supabase, router])

  const queryClient = useQueryClient()

  // Handle Logout
  async function handleLogout() {
    queryClient.clear()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Handle Save (Create / Update)
  function handleSaveDebt(formData: CreateDebtFormInput, id?: string) {
    if (id) {
      updateMutation.mutate({ id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
    modalDisclosure.onClose()
    setEditingDebt(null)
  }

  // Handle Toggle Settled
  function handleToggleSettled(debt: Debt) {
    const newSettledAt = debt.settled_at ? null : new Date().toISOString()
    updateMutation.mutate({
      id: debt.id,
      data: { settled_at: newSettledAt },
    })
  }

  // Handle Delete
  function handleDeleteDebt(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return
    deleteMutation.mutate(id)
  }

  // Summary Calculations
  const totalOwedToMe = debts
    .filter((d) => d.type === 'owed_to_me' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const totalIOwe = debts
    .filter((d) => d.type === 'i_owe' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const netBalance = totalOwedToMe - totalIOwe

  // Search Filtering
  const filteredDebts = debts.filter(
    (debt) =>
      debt.counterpart_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (debt.note && debt.note.toLowerCase().includes(filters.search.toLowerCase()))
  )

  // Grouped Debts Logic
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

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo size={32} />
            <span className="font-bold text-xl tracking-tight text-white">Kasbon</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs sm:text-sm text-zinc-400 hidden sm:inline">
              {userEmail}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-zinc-800 hover:bg-zinc-900 flex items-center gap-1.5">
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Diutangkan ke Saya
              </CardTitle>
              <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                {formatRupiah(totalOwedToMe)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Belum dilunasi oleh orang lain</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total Saya Hutang
              </CardTitle>
              <ArrowUpRight className="w-4 h-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-500">
                {formatRupiah(totalIOwe)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Belum saya bayarkan</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Net Balance
              </CardTitle>
              <Wallet className="w-4 h-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  netBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {formatRupiah(netBalance)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Selisih piutang dan utang</p>
            </CardContent>
          </Card>
        </div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-950 p-4 rounded-lg border border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="w-4 h-4 absolute left-2.5 top-3 text-zinc-500" />
              <Input
                placeholder="Cari nama / catatan..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-8 h-9 text-sm bg-zinc-900 border-zinc-800 focus-visible:ring-[#FC580F]"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(val) =>
                setFilters((prev) => ({ ...prev, status: val as DebtStatusFilter }))
              }
            >
              <SelectTrigger className="w-[140px] h-9 text-sm bg-zinc-900 border-zinc-800">
                <SelectValue>{STATUS_LABELS[filters.status]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Belum Lunas</SelectItem>
                <SelectItem value="settled">Lunas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type}
              onValueChange={(val) =>
                setFilters((prev) => ({ ...prev, type: val as DebtTypeFilter }))
              }
            >
              <SelectTrigger className="w-[160px] h-9 text-sm bg-zinc-900 border-zinc-800">
                <SelectValue>{TYPE_LABELS[filters.type]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="owed_to_me">Di-hutang ke Saya</SelectItem>
                <SelectItem value="i_owe">Saya Hutang</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({ ...prev, groupByPerson: !prev.groupByPerson }))
              }
              className="h-9 px-2.5 text-xs flex items-center gap-1 border-zinc-800 hover:bg-zinc-900"
              title="Kelompokkan per orang"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{filters.groupByPerson ? 'Biasa' : 'Kelompokkan'}</span>
            </Button>
          </div>

          <Button
            onClick={() => {
              setEditingDebt(null)
              modalDisclosure.onOpen()
            }}
            className="h-9 flex items-center gap-1.5 shrink-0 bg-[#FC580F] hover:bg-[#e04c0b] text-white font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Baru</span>
          </Button>
        </div>

        {/* Error Notification */}
        {isError && (
          <div className="p-4 text-sm rounded border border-red-900/50 bg-red-950/40 text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data.'}</span>
          </div>
        )}

        {/* List Content */}
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
                onClick={() => {
                  setEditingDebt(null)
                  modalDisclosure.onOpen()
                }}
              >
                <Plus className="w-4 h-4 mr-1.5 inline" /> Catat Sekarang
              </Button>
            </CardContent>
          </Card>
        ) : filters.groupByPerson ? (
          /* Grouped View */
          <div className="space-y-4">
            {Object.values(groupedDebts).map((group, idx) => (
              <Card key={idx} className="bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-2 border-b border-zinc-800/80 bg-zinc-900/40 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
                    <p className="text-xs text-zinc-400">
                      {group.items.length} catatan
                    </p>
                  </div>
                  <div className="text-right text-xs space-y-0.5">
                    {group.totalOwedToMe > 0 && (
                      <div className="text-emerald-500 font-medium">
                        Dihutang: {formatRupiah(group.totalOwedToMe)}
                      </div>
                    )}
                    {group.totalIOwe > 0 && (
                      <div className="text-rose-500 font-medium">
                        Hutang: {formatRupiah(group.totalIOwe)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-zinc-800/60">
                  {group.items.map((debt) => (
                    <DebtListItem
                      key={debt.id}
                      debt={debt}
                      onToggleSettled={handleToggleSettled}
                      onEdit={(d) => {
                        setEditingDebt(d)
                        modalDisclosure.onOpen()
                      }}
                      onDelete={handleDeleteDebt}
                    />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Standard List View */
          <Card className="bg-zinc-950 border-zinc-800">
            <CardContent className="p-0 divide-y divide-zinc-800/60">
              {filteredDebts.map((debt) => (
                <DebtListItem
                  key={debt.id}
                  debt={debt}
                  onToggleSettled={handleToggleSettled}
                  onEdit={(d) => {
                    setEditingDebt(d)
                    modalDisclosure.onOpen()
                  }}
                  onDelete={handleDeleteDebt}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modal Form */}
      <DebtModal
        isOpen={modalDisclosure.isOpen}
        onClose={() => {
          modalDisclosure.onClose()
          setEditingDebt(null)
        }}
        onSave={handleSaveDebt}
        initialData={editingDebt}
      />
    </div>
  )
}

function DebtListItem({
  debt,
  onToggleSettled,
  onEdit,
  onDelete,
}: {
  debt: Debt
  onToggleSettled: (debt: Debt) => void
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
}) {
  const isSettled = !!debt.settled_at
  const isOwedToMe = debt.type === 'owed_to_me'

  return (
    <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isSettled ? 'bg-zinc-900/30 opacity-70' : ''}`}>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-base text-zinc-100">{debt.counterpart_name}</span>
          <Badge variant="outline" className="text-xs font-normal border-zinc-800 bg-zinc-900 text-zinc-300">
            {isOwedToMe ? 'Saya dihutang' : 'Saya hutang'}
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs ${
              isSettled
                ? 'bg-zinc-800/60 text-zinc-400 border-zinc-700'
                : 'bg-[#FC580F]/10 text-[#FC580F] border-[#FC580F]/30'
            }`}
          >
            {isSettled ? 'Lunas' : 'Belum Lunas'}
          </Badge>
        </div>

        <div className="flex items-center space-x-3 text-xs text-zinc-400">
          <span>{formatRelativeDate(debt.created_at)}</span>
          {debt.due_date && <span>• Jatuh tempo: {debt.due_date}</span>}
          {debt.note && <span className="italic">• {debt.note}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
        <div className={`text-base font-bold ${isOwedToMe ? 'text-emerald-500' : 'text-rose-500'}`}>
          {formatRupiah(debt.amount)}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleSettled(debt)}
            className="h-8 px-2.5 text-xs flex items-center gap-1 border-zinc-800 hover:bg-zinc-900"
          >
            {isSettled ? (
              <>
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Batal Lunas</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FC580F]" />
                <span>Tandai Lunas</span>
              </>
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-900"
            onClick={() => onEdit(debt)}
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50"
            onClick={() => onDelete(debt.id)}
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
