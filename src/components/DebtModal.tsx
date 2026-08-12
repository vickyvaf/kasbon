'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Debt } from '@/lib/types'
import { createDebtSchema, CreateDebtFormInput } from '@/schemas/debtSchema'
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
  onSave: (data: CreateDebtFormInput, id?: string) => void
  initialData?: Debt | null
}

export function DebtModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: DebtModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateDebtFormInput>({
    resolver: zodResolver(createDebtSchema),
    defaultValues: {
      type: 'owed_to_me',
      counterpart_name: '',
      amount: undefined,
      due_date: new Date().toISOString().split('T')[0],
      note: '',
    },
  })

  const selectedType = watch('type')
  const rawAmount = watch('amount')
  const noteValue = watch('note') || ''

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        counterpart_name: initialData.counterpart_name,
        amount: initialData.amount,
        due_date: initialData.due_date || new Date().toISOString().split('T')[0],
        note: initialData.note || '',
      })
    } else {
      reset({
        type: 'owed_to_me',
        counterpart_name: '',
        amount: undefined,
        due_date: new Date().toISOString().split('T')[0],
        note: '',
      })
    }
  }, [initialData, isOpen, reset])

  function onSubmit(data: CreateDebtFormInput) {
    onSave(data, initialData?.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? 'Edit Catatan Utang' : 'Catat Utang Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipe Utang</Label>
            <RadioGroup
              value={selectedType}
              onValueChange={(val) =>
                setValue('type', val as 'owed_to_me' | 'i_owe')
              }
              className="flex space-x-4 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owed_to_me" id="r-owed" className="border-zinc-700 text-[#FC580F]" />
                <Label htmlFor="r-owed" className="cursor-pointer text-sm">
                  Saya dihutang (Piutang)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="i_owe" id="r-owe" className="border-zinc-700 text-[#FC580F]" />
                <Label htmlFor="r-owe" className="cursor-pointer text-sm">
                  Saya hutang (Utang)
                </Label>
              </div>
            </RadioGroup>
            {errors.type && (
              <p className="text-xs text-red-400">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="counterpart">Nama Orang *</Label>
            <Input
              id="counterpart"
              placeholder="Contoh: Budi"
              className="bg-zinc-900 border-zinc-800 focus-visible:ring-[#FC580F]"
              {...register('counterpart_name')}
            />
            {errors.counterpart_name && (
              <p className="text-xs text-red-400">
                {errors.counterpart_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (Rp) *</Label>
            <Input
              id="amount"
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 50.000"
              value={rawAmount && !isNaN(rawAmount) ? rawAmount.toLocaleString('id-ID') : ''}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '')
                const parsed = digitsOnly ? parseInt(digitsOnly, 10) : undefined
                setValue('amount', parsed as any, { shouldValidate: true })
              }}
              className="bg-zinc-900 border-zinc-800 focus-visible:ring-[#FC580F]"
            />
            {errors.amount && (
              <p className="text-xs text-red-400">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Tanggal</Label>
            <Input
              id="dueDate"
              type="date"
              className="bg-zinc-900 border-zinc-800 focus-visible:ring-[#FC580F]"
              {...register('due_date')}
            />
            {errors.due_date && (
              <p className="text-xs text-red-400">{errors.due_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="note">Catatan (Opsional)</Label>
              <span className="text-xs text-zinc-500">
                {noteValue.length}/200
              </span>
            </div>
            <Input
              id="note"
              placeholder="Catatan singkat..."
              maxLength={200}
              className="bg-zinc-900 border-zinc-800 focus-visible:ring-[#FC580F]"
              {...register('note')}
            />
            {errors.note && (
              <p className="text-xs text-red-400">{errors.note.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-800 hover:bg-zinc-900"
            >
              Batal
            </Button>
            <Button type="submit" className="bg-[#FC580F] hover:bg-[#e04c0b] text-white">
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
