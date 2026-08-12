import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'
import { formatRupiah } from '@/lib/formatters'

interface SummaryCardsProps {
  totalOwedToMe: number
  totalIOwe: number
  netBalance: number
  isLoading?: boolean
}

export function SummaryCards({
  totalOwedToMe,
  totalIOwe,
  netBalance,
  isLoading = false,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Total Diutangkan ke Saya
          </CardTitle>
          <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-1.5 py-0.5">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-emerald-500">
                {formatRupiah(totalOwedToMe)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Piutang belum lunas</p>
            </>
          )}
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
          {isLoading ? (
            <div className="space-y-1.5 py-0.5">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-rose-500">
                {formatRupiah(totalIOwe)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Utang belum lunas</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Saldo Bersih
          </CardTitle>
          <Wallet className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-1.5 py-0.5">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          ) : (
            <>
              <div
                className={`text-2xl font-bold ${
                  netBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {formatRupiah(netBalance)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {netBalance >= 0 ? 'Surplus (Piutang > Utang)' : 'Defisit (Utang > Piutang)'}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
