import {z} from 'zod'

export const inscriptionEmailsSchema = z.object({
    email: z.string().email({ message: "Email inválido "})
})