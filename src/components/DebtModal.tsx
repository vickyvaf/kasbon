'use client'

import { useState, useEffect } from 'react'
import { Debt, CreateDebtInput } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface DebtModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CreateDebtInput, id?: string) => Promise<void>
  initialData?: Debt | null
}

export function DebtModal({ isOpen, onClose, onSave, initialData }: DebtModalProps) {
  const [type, setType] = useState<'owed_to_me' | 'i_owe'>('owed_to_me')
  const [counterpartName, setCounterpartName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (initialData) {
      setType(initialData.type)
      setCounterpartName(initialData.counterpart_name)
      setAmount(initialData.amount.toString())
      setDueDate(initialData.due_date || new Date().toISOString().split('T')[0])
      setNote(initialData.note || '')
    } else {
      setType('owed_to_me')
      setCounterpartName('')
      setAmount('')
      setDueDate(new Date().toISOString().split('T')[0])
      setNote('')
    }
    setErrorMsg('')
  }, [initialData, isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!counterpartName.trim()) {
      setErrorMsg('Nama orang wajib diisi.')
      return
    }

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Jumlah harus berupa angka lebih besar dari 0.')
      return
    }

    if (note.length > 200) {
      setErrorMsg('Catatan maksimum 200 karakter.')
      return
    }

    setLoading(true)
    try {
      await onSave(
        {
          type,
          counterpart_name: counterpartName,
          amount: numAmount,
          due_date: dueDate || null,
          note: note || null,
        },
        initialData?.id
      )
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal menyimpan data.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Catatan Utang' : 'Catat Utang Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {errorMsg && (
            <div className="p-3 text-sm rounded border border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label>Tipe Utang</Label>
            <RadioGroup
              value={type}
              onValueChange={(val) => setType(val as 'owed_to_me' | 'i_owe')}
              className="flex space-x-4 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owed_to_me" id="r-owed" />
                <Label htmlFor="r-owed" className="cursor-pointer">
                  Saya dihutang (Piutang)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="i_owe" id="r-owe" />
                <Label htmlFor="r-owe" className="cursor-pointer">
                  Saya hutang (Utang)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="counterpart">Nama Orang *</Label>
            <Input
              id="counterpart"
              placeholder="Contoh: Budi"
              value={counterpartName}
              onChange={(e) => setCounterpartName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (Rp) *</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              placeholder="Contoh: 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Tanggal</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="note">Catatan (Opsional)</Label>
              <span className="text-xs text-muted-foreground">
                {note.length}/200
              </span>
            </div>
            <Input
              id="note"
              placeholder="Catatan singkat..."
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
