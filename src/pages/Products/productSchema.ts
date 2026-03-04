import { z } from 'zod'

export const productSchema = z.object({
    name: z
        .string()
        .min(2, "Nome deve ter ao menos 2 caracteres")
        .max(100, "Nome muito grande"),
    category: z
        .string()
        .min(1, "Selecione uma categoria"),
    price: z
        .coerce.number()
        // coerce.number() converte string para number automaticamente
        // necessário porque inputs HTML sempre retornam strings
        .positive("Preço deve ser um valor positivo")
        .max(99999, "Preço muito alto"),
    stock: z
        .coerce.number()
        .int("Estoque deve ser um número inteiro")
        .min(0, "Estoque não pode ser negativo"),
})

export type ProductFormData = z.infer<typeof productSchema>
// z.infer extrai o tipo TypeScript do schema Zod automaticamente
// Não precisamos escrever a interface manualmente!