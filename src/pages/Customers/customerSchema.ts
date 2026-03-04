import { z } from 'zod'

export const customerSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state: z
        .string()
        .max(2, "Use a sigla do estado (ex: SP")
        .optional()
        .or(z.literal("")),
})

export type CustomerFormData = z.infer<typeof customerSchema>