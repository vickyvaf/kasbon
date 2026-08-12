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
    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-zinc-950 p-4 rounded-lg border border-zinc-800">
      {/* Search + Select Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 flex-1">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-full sm:min-w-44">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-zinc-500" />
          <Input
            placeholder="Cari nama / catatan..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 text-sm bg-zinc-900 border-zinc-800 focus-visible:ring-primary w-full"
          />
        </div>

        {/* Filters Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(val) => onStatusChange(val as DebtStatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-36 h-9 text-xs sm:text-sm bg-zinc-900 border-zinc-800">
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
            <SelectTrigger className="w-full sm:w-36 h-9 text-xs sm:text-sm bg-zinc-900 border-zinc-800">
              <SelectValue>{TYPE_LABELS[type]}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="owed_to_me">Di-hutang ke Saya</SelectItem>
              <SelectItem value="i_owe">Saya Hutang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grouping Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGroupByPerson}
          className="h-9 px-3 text-xs flex items-center justify-center gap-1.5 border-zinc-800 hover:bg-zinc-900 w-full sm:w-auto"
          title="Kelompokkan per orang"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{groupByPerson ? 'Biasa' : 'Kelompokkan'}</span>
        </Button>
      </div>

      {/* Action Buttons: Export & Create */}
      <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-800/60">
        {onExportClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExportClick}
            className="h-9 px-3 text-xs flex items-center justify-center gap-1.5 border-zinc-800 hover:bg-zinc-900 text-zinc-300 flex-1 lg:flex-initial"
            title="Ekspor ke CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </Button>
        )}

        <Button
          onClick={onCreateClick}
          className="h-9 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex-1 lg:flex-initial"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Baru</span>
        </Button>
      </div>
    </div>
  )
}
