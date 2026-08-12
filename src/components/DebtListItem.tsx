import { Debt } from '@/lib/types'
import { formatRupiah, formatRelativeDate } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Undo2, Edit2, Trash2 } from 'lucide-react'

interface DebtListItemProps {
  debt: Debt
  onToggleSettled: (debt: Debt) => void
  onEdit: (debt: Debt) => void
  onDelete: (debt: Debt) => void
}

export function DebtListItem({
  debt,
  onToggleSettled,
  onEdit,
  onDelete,
}: DebtListItemProps) {
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
                : 'bg-primary/10 text-primary border-primary/30'
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
            <Edit2 className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-zinc-900"
            onClick={() => onDelete(debt)}
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
