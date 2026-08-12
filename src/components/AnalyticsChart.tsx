import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRupiah } from '@/lib/formatters'
import { PieChart } from 'lucide-react'

interface AnalyticsChartProps {
  totalOwedToMe: number
  totalIOwe: number
  isLoading?: boolean
}

export function AnalyticsChart({
  totalOwedToMe,
  totalIOwe,
  isLoading = false,
}: AnalyticsChartProps) {
  const grandTotal = totalOwedToMe + totalIOwe
  const owedToMePercent = grandTotal > 0 ? Math.round((totalOwedToMe / grandTotal) * 100) : 50
  const iOwePercent = grandTotal > 0 ? 100 - owedToMePercent : 50

  if (isLoading) {
    return (
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-primary" />
          <span>Analisis Rasio Utang vs Piutang</span>
        </CardTitle>
        <span className="text-xs text-zinc-500 font-mono">
          Total Aktif: {formatRupiah(grandTotal)}
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Dual Color Visual Progress Bar */}
        <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${owedToMePercent}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Piutang: ${owedToMePercent}%`}
          />
          <div
            style={{ width: `${iOwePercent}%` }}
            className="bg-rose-500 transition-all duration-500"
            title={`Utang: ${iOwePercent}%`}
          />
        </div>

        {/* Breakdown Metrics */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-zinc-400">Piutang (Saya dihutang):</span>
            <span className="font-semibold text-emerald-400">
              {formatRupiah(totalOwedToMe)} ({owedToMePercent}%)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="text-zinc-400">Utang (Saya hutang):</span>
            <span className="font-semibold text-rose-400">
              {formatRupiah(totalIOwe)} ({iOwePercent}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
