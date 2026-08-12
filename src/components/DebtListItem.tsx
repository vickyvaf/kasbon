import { Debt } from '@/lib/types'
import { formatRupiah, formatRelativeDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Undo2, Edit2, Trash2, AlertCircle } from 'lucide-react'

interface DebtListItemProps {
  debt: Debt
  onToggleSettled: (debt: Debt) => void
  onEdit: (debt: Debt) => void
  onDelete: (debt: Debt) => void
}

function getDueDateBadge(dueDate?: string | null, isSettled?: boolean) {
  if (isSettled || !dueDate) return null

  const today = new Date().toISOString().split('T')[0]
  if (dueDate < today) {
    return (
      <Badge variant="outline" className="text-[11px] font-normal bg-rose-950/60 text-rose-400 border-rose-800/80 flex items-center gap-1 shrink-0">
        <AlertCircle className="w-3 h-3" />
        <span>Terlewat Jatuh Tempo</span>
      </Badge>
    )
  }
  if (dueDate === today) {
    return (
      <Badge variant="outline" className="text-[11px] font-normal bg-amber-950/60 text-amber-400 border-amber-800/80 flex items-center gap-1 shrink-0">
        <AlertCircle className="w-3 h-3" />
        <span>Jatuh Tempo Hari Ini</span>
      </Badge>
    )
  }

  return null
}

export function DebtListItem({
  debt,
  onToggleSettled,
  onEdit,
  onDelete,
}: DebtListItemProps) {
  const isSettled = !!debt.settled_at
  const isOwedToMe = debt.type === 'owed_to_me'
  const dueDateBadge = getDueDateBadge(debt.due_date, isSettled)

  return (
    <div className={`p-4 transition-colors ${isSettled ? 'bg-zinc-900/20 opacity-75' : 'hover:bg-zinc-900/40'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Column / Top Section */}
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Top Row: Name + Amount on Mobile */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-base text-zinc-100 truncate">
                {debt.counterpart_name}
              </span>
              <Badge variant="outline" className="text-[11px] font-normal border-zinc-800 bg-zinc-900 text-zinc-300 shrink-0">
                {isOwedToMe ? 'Saya dihutang' : 'Saya hutang'}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[11px] shrink-0 ${
                  isSettled
                    ? 'bg-zinc-800/60 text-zinc-400 border-zinc-700'
                    : 'bg-primary/10 text-primary border-primary/30'
                }`}
              >
                {isSettled ? 'Lunas' : 'Belum Lunas'}
              </Badge>
            </div>

            {/* Amount on Mobile (Right Side) */}
            <div className={`text-base font-bold sm:hidden shrink-0 ${isOwedToMe ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formatRupiah(debt.amount)}
            </div>
          </div>

          {/* Subtext: Badges + Relative Date + Note */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
            {dueDateBadge}
            <span>{formatRelativeDate(debt.created_at)}</span>
            {debt.due_date && <span>• Jatuh tempo: {debt.due_date}</span>}
            {debt.note && <span className="italic truncate max-w-full sm:max-w-md">• {debt.note}</span>}
          </div>
        </div>

        {/* Right Column / Bottom Action Section */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/50">
          {/* Amount on Desktop */}
          <div className={`text-base font-bold hidden sm:block ${isOwedToMe ? 'text-emerald-500' : 'text-rose-500'}`}>
            {formatRupiah(debt.amount)}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleSettled(debt)}
              className="h-8 px-2.5 text-xs flex items-center gap-1.5 border-zinc-800 hover:bg-zinc-900 text-zinc-200"
            >
              {isSettled ? (
                <>
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Batal Lunas</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
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
              className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-zinc-900"
              onClick={() => onDelete(debt)}
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
