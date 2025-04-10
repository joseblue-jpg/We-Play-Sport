import { z } from 'zod';

// Define regex patterns
const passwordReGex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/; // Only letters, spaces, and hyphens

const registerSchema = z.object({
    user_name: z.string({message: "Campo nombre requerido"})
        .min(3, {message: "El nombre debe tener al menos tres caracteres"})
        .max(60, {message: "El nombre debe tener máximo 60 caracteres"})
        .regex(nameRegex, {message: "El nombre solo puede contener letras, espacios y guiones"}),
    
    last_name: z.string({message: "Campo apellido requerido"})
        .min(3, {message: "El apellido debe tener al menos tres caracteres"})
        .max(60, {message: "El apellido debe tener máximo 100 caracteres"})
        .regex(nameRegex, {message: "El apellido solo puede contener letras, espacios y guiones"}),
    
    birth_date: z
        .string()
        .regex(dateRegex, {message: "La fecha de nacimiento es obligatoria"}),
    
    email: z.string()
        .min(1, { message: "El email es requerido" })
        .email({ message: "Formato de email incorrecto" })
        .max(100, { message: "El email no puede exceder los 100 caracteres" })
        .regex(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
          { message: "El email debe ser una dirección válida (ej: usuario@dominio.com)" }
        )
        .transform(email => email.trim()),
    
    password: z
        .string()
        .min(6, {message: "La contraseña debe tener al menos 6 caracteres"})
        .regex(passwordReGex, {
            message: "La contraseña debe contener al menos una mayusc, una minusc, un número y un carácter especial"
        }),
    
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPasswordPass"]
})

export default registerSchema;