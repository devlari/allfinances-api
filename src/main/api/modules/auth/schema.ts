import { string, z } from 'zod'

export const VALID_CURRENCIES = ['USD', 'EUR', 'BRL'];

export const currencySymbols: { [key: string]: string } = {
    BRL: 'R$',
    USD: '$',
    EUR: '€',
};

export const CredentialsSchema = z.object({
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(1, 'A senha deve ter no mínimo 1 caractere.')
}).strict();

export const InfoUserSchema = z.object({
    name: z
        .string()
        .min(2, "O nome deve ter no mínimo dois caracteres")
        .max(100, "O nome deve ter no máximo 100 caracteres"),
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(1, 'A senha deve ter no mínimo 1 caractere.')
        .refine(value => /[0-9]/.test(value), {
            message: 'A senha deve conter no mínimo um número.',
        })
        .refine(value => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
            message: 'A senha deve conter no mínimo um caractere especial.',
        }),
    multiple_bank: z
        .boolean(),
    type_currency: z
        .string()
        .refine(value => VALID_CURRENCIES.includes(value), {
            message: 'Moeda inválida.',
        }),
});