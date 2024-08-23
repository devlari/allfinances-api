import { z } from 'zod'

export const BankSchema = z.object({
    id: z
        .number()
        .min(1, 'O id deve ter no mínimo 1 caractere.')
        .max(6, 'O id deve ter no máximo 6 caracteres'),
    userId: z
        .number()
        .min(1, 'O id do usuário deve ter no mínimo 1 caractere.')
        .max(6, 'O id do usuário deve ter no máximo 6 caracteres'),
    name: z
        .string()
        .trim()
        .min(1, 'O nome deve ter no mínimo 1 caractere.')
        .max(50, "O nome deve ter no máximo 50 caracteres."),
}).strict();

export const PostBankSchema = BankSchema.partial({
    id: true
})