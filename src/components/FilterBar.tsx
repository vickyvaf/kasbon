import { DebtStatusFilter, DebtTypeFilter } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Users, Plus, Download } from 'lucide-react'

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

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  status: DebtStatusFilter
  onStatusChange: (status: DebtStatusFilter) => void
  type: DebtTypeFilter
  onTypeChange: (type: DebtTypeFilter) => void
  groupByPerson: boolean
  onToggleGroupByPerson: () => void
  onCreateClick: () => void
  onExportClick?: () => void
}

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
  groupByPerson,
  onToggleGroupByPerson,
  onCreateClick,
  onExportClick,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-950 p-4 rounded-lg border border-zinc-800">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-40">
          <Search className="w-4 h-4 absolute left-2.5 top-3 text-zinc-500" />
          <Input
            placeholder="Cari nama / catatan..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 text-sm bg-zinc-900 border-zinc-800 focus-visible:ring-primary"
          />
        </div>

        <Select
          value={status}
          onValueChange={(val) => onStatusChange(val as DebtStatusFilter)}
        >
          <SelectTrigger className="w-36 h-9 text-sm bg-zinc-900 border-zinc-800">
            <SelectValue>{STATUS_LABELS[status]}</SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Belum Lunas</SelectItem>
            <SelectItem value="settled">Lunas</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={type}
          onValueChange={(val) => onTypeChange(val as DebtTypeFilter)}
        >
          <SelectTrigger className="w-40 h-9 text-sm bg-zinc-900 border-zinc-800">
            <SelectValue>{TYPE_LABELS[type]}</SelectValue>
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
          onClick={onToggleGroupByPerson}
          className="h-9 px-2.5 text-xs flex items-center gap-1 border-zinc-800 hover:bg-zinc-900"
          title="Kelompokkan per orang"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{groupByPerson ? 'Biasa' : 'Kelompokkan'}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {onExportClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportClick}
            className="h-9 px-3 text-xs flex items-center gap-1.5 border-zinc-800 hover:bg-zinc-900 text-zinc-300"
            title="Ekspor ke CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </Button>
        )}

        <Button
          onClick={onCreateClick}
          className="h-9 flex items-center gap-1.5 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Baru</span>
        </Button>
      </div>
    </div>
  )
}
