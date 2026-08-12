import { Debt } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DebtListItem } from '@/components/DebtListItem'
import { formatRupiah } from '@/lib/formatters'

interface GroupData {
  name: string
  totalOwedToMe: number
  totalIOwe: number
  items: Debt[]
}

interface DebtListGroupedProps {
  groupedDebts: Record<string, GroupData>
  onToggleSettled: (debt: Debt) => void
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
}

export function DebtListGrouped({
  groupedDebts,
  onToggleSettled,
  onEdit,
  onDelete,
}: DebtListGroupedProps) {
  return (
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
                onToggleSettled={onToggleSettled}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
