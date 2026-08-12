import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ListFilter, Plus } from 'lucide-react'

interface EmptyStateProps {
  isFiltered: boolean
  onCreateClick: () => void
}

export function EmptyState({ isFiltered, onCreateClick }: EmptyStateProps) {
  return (
    <Card className="text-center py-12 bg-zinc-950 border-zinc-800">
      <CardContent className="space-y-3">
        <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500">
          <ListFilter className="w-6 h-6" />
        </div>
        <div className="font-semibold text-base">Belum Ada Catatan Utang</div>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          {isFiltered
            ? 'Tidak ada catatan yang sesuai dengan filter yang dipilih.'
            : 'Mulai dengan mencatat utang atau piutang baru.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="border-zinc-800 hover:bg-zinc-900"
          onClick={onCreateClick}
        >
          <Plus className="w-4 h-4 mr-1.5 inline" /> Catat Sekarang
        </Button>
      </CardContent>
    </Card>
  )
}
