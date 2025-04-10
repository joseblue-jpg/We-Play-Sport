import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "Formato de email incorrecto" })
    .max(100, { message: "El email no puede exceder los 100 caracteres" })
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
      { message: "El email debe ser una dirección válida (ej: usuario@dominio.com)" }
    )
    .transform(email => email.trim()),
});