import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DebtListSkeleton() {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardContent className="p-0 divide-y divide-zinc-800/60">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Left Column Info Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-36" />
              </div>
            </div>

            {/* Right Column Action Skeleton */}
            <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
              <Skeleton className="h-6 w-24" />
              <div className="flex items-center space-x-1">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
