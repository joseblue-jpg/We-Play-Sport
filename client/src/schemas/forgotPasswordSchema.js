import {z} from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string({ message: "Email requerido" }).email({ message: "Formato de email incorrecto"})

})