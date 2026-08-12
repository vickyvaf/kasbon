import { z } from 'zod'

export const debtTypeEnum = z.enum(['owed_to_me', 'i_owe'])

export const createDebtSchema = z.object({
  type: debtTypeEnum,
  counterpart_name: z
    .string()
    .trim()
    .min(1, 'Nama orang wajib diisi.')
    .max(100, 'Nama orang maksimum 100 karakter.'),
  amount: z
    .number({ message: 'Jumlah harus berupa angka.' })
    .positive('Jumlah harus lebih besar dari 0.')
    .transform((val) => Math.round(val)),
  due_date: z.string().optional().nullable(),
  note: z
    .string()
    .trim()
    .max(200, 'Catatan maksimum 200 karakter.')
    .transform((val) => (val ? val.trim() : null))
    .optional()
    .nullable(),
})

export const updateDebtSchema = createDebtSchema.partial().extend({
  settled_at: z.string().optional().nullable(),
})

export type CreateDebtFormInput = z.input<typeof createDebtSchema>
export type UpdateDebtFormInput = z.input<typeof updateDebtSchema>
