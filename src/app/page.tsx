'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Debt, DebtStatusFilter, DebtTypeFilter, CreateDebtInput } from '@/lib/types'
import { formatRupiah, formatRelativeDate } from '@/lib/formatters'
import { DebtModal } from '@/components/DebtModal'
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
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userEmail, setUserEmail] = useState<string>('')
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // Filters & Controls
  const [statusFilter, setStatusFilter] = useState<DebtStatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<DebtTypeFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [groupByPerson, setGroupByPerson] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)

  // Fetch debts from API or Supabase
  const fetchDebts = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const queryParams = new URLSearchParams()
      if (statusFilter !== 'all') queryParams.set('status', statusFilter)
      if (typeFilter !== 'all') queryParams.set('type', typeFilter)

      const res = await fetch(`/api/debts?${queryParams.toString()}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Gagal memuat catatan utang.')
      }

      setDebts(json.data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter])

  // Check auth user session
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserEmail(user.email || '')
      fetchDebts()
    }
    checkAuth()
  }, [supabase, router, fetchDebts])

  // Handle Logout
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Handle Save (Create / Update)
  async function handleSaveDebt(data: CreateDebtInput, id?: string) {
    if (id) {
      // Update existing
      const res = await fetch(`/api/debts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal mengedit data.')
    } else {
      // Create new
      const res = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal menambahkan data.')
    }
    fetchDebts()
  }

  // Handle Toggle Settled
  async function handleToggleSettled(debt: Debt) {
    const newSettledAt = debt.settled_at ? null : new Date().toISOString()
    try {
      const res = await fetch(`/api/debts/${debt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settled_at: newSettledAt }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal mengubah status lunas.')
      fetchDebts()
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message)
    }
  }

  // Handle Delete
  async function handleDeleteDebt(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return
    try {
      const res = await fetch(`/api/debts/${id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal menghapus catatan.')
      fetchDebts()
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message)
    }
  }

  // Calculations for Summary Cards
  const totalOwedToMe = debts
    .filter((d) => d.type === 'owed_to_me' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const totalIOwe = debts
    .filter((d) => d.type === 'i_owe' && !d.settled_at)
    .reduce((sum, d) => sum + d.amount, 0)

  const netBalance = totalOwedToMe - totalIOwe

  // Filtered by Search Query
  const filteredDebts = debts.filter((debt) =>
    debt.counterpart_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (debt.note && debt.note.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Grouped debts logic (Bonus)
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navbar */}
      <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-slate-900 text-white rounded-lg dark:bg-slate-100 dark:text-slate-900">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Kasbon</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Diutangkan ke Saya
              </CardTitle>
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {formatRupiah(totalOwedToMe)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Belum dilunasi oleh orang lain</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Saya Hutang
              </CardTitle>
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">
                {formatRupiah(totalIOwe)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Belum saya bayarkan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Balance
              </CardTitle>
              <Wallet className="w-4 h-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {formatRupiah(netBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Selisih piutang dan utang</p>
            </CardContent>
          </Card>
        </div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm">
          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="w-4 h-4 absolute left-2.5 top-3 text-muted-foreground" />
              <Input
                placeholder="Cari nama / catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as DebtStatusFilter)}
            >
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Belum Lunas</SelectItem>
                <SelectItem value="settled">Lunas</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(val) => setTypeFilter(val as DebtTypeFilter)}
            >
              <SelectTrigger className="w-[145px] h-9 text-sm">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="owed_to_me">Di-hutang ke Saya</SelectItem>
                <SelectItem value="i_owe">Saya Hutang</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setGroupByPerson(!groupByPerson)}
              className="h-9 px-2.5 text-xs flex items-center gap-1"
              title="Kelompokkan per orang"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{groupByPerson ? 'Biasa' : 'Kelompokkan'}</span>
            </Button>
          </div>

          {/* Add Button */}
          <Button
            onClick={() => {
              setEditingDebt(null)
              setIsModalOpen(true)
            }}
            className="h-9 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Baru</span>
          </Button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 text-sm rounded border border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Entry List or Grouped View */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Memuat data catatan...
          </div>
        ) : filteredDebts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ListFilter className="w-6 h-6" />
              </div>
              <div className="font-semibold text-base">Belum Ada Catatan Utang</div>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Tidak ada catatan yang sesuai dengan filter yang dipilih.'
                  : 'Mulai dengan mencatat utang atau piutang baru.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingDebt(null)
                  setIsModalOpen(true)
                }}
              >
                + Catat Sekarang
              </Button>
            </CardContent>
          </Card>
        ) : groupByPerson ? (
          /* Grouped View */
          <div className="space-y-4">
            {Object.values(groupedDebts).map((group, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {group.items.length} catatan
                    </p>
                  </div>
                  <div className="text-right text-xs space-y-0.5">
                    {group.totalOwedToMe > 0 && (
                      <div className="text-emerald-600 font-medium">
                        Dihutang: {formatRupiah(group.totalOwedToMe)}
                      </div>
                    )}
                    {group.totalIOwe > 0 && (
                      <div className="text-rose-600 font-medium">
                        Hutang: {formatRupiah(group.totalIOwe)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {group.items.map((debt) => (
                    <DebtListItem
                      key={debt.id}
                      debt={debt}
                      onToggleSettled={handleToggleSettled}
                      onEdit={(d) => {
                        setEditingDebt(d)
                        setIsModalOpen(true)
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
          <Card>
            <CardContent className="p-0 divide-y">
              {filteredDebts.map((debt) => (
                <DebtListItem
                  key={debt.id}
                  debt={debt}
                  onToggleSettled={handleToggleSettled}
                  onEdit={(d) => {
                    setEditingDebt(d)
                    setIsModalOpen(true)
                  }}
                  onDelete={handleDeleteDebt}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Add / Edit Modal */}
      <DebtModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
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
    <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isSettled ? 'bg-slate-50/60 dark:bg-slate-900/40 opacity-75' : ''}`}>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-base">{debt.counterpart_name}</span>
          <Badge variant={isOwedToMe ? 'secondary' : 'outline'} className="text-xs font-normal">
            {isOwedToMe ? 'Saya dihutang' : 'Saya hutang'}
          </Badge>
          <Badge
            variant={isSettled ? 'outline' : 'default'}
            className={`text-xs ${
              isSettled
                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
            }`}
          >
            {isSettled ? 'Lunas' : 'Belum Lunas'}
          </Badge>
        </div>

        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span>{formatRelativeDate(debt.created_at)}</span>
          {debt.due_date && <span>• Jatuh tempo: {debt.due_date}</span>}
          {debt.note && <span className="italic">• {debt.note}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
        <div className={`text-base font-bold ${isOwedToMe ? 'text-emerald-600' : 'text-rose-600'}`}>
          {formatRupiah(debt.amount)}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant={isSettled ? 'outline' : 'default'}
            onClick={() => onToggleSettled(debt)}
            className="h-8 px-2.5 text-xs flex items-center gap-1"
          >
            {isSettled ? (
              <>
                <Undo2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Batal Lunas</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tandai Lunas</span>
              </>
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(debt)}
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950"
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
