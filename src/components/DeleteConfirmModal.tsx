'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  counterpartName?: string
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  counterpartName,
}: DeleteConfirmModalProps) {
  function handleConfirm() {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-foreground">
        <DialogHeader className="space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-950/50 border border-rose-900/50 flex items-center justify-center text-rose-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Hapus Catatan Utang?
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400 text-sm">
            Apakah Anda yakin ingin menghapus catatan utang{' '}
            {counterpartName ? <strong className="text-zinc-200">{counterpartName}</strong> : 'ini'}? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-800 hover:bg-zinc-900"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white font-medium"
          >
            Hapus Catatan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
