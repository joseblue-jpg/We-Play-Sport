import { z } from 'zod';

// Define regex patterns
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/; // Solo letras, espacios y guiones

export const registerSchema = z.object({
    user_name: z.string()
        .min(3, { message: "El nombre debe tener al menos tres caracteres" })
        .max(60, { message: "El nombre debe tener máximo 60 caracteres" })
        .regex(nameRegex, { message: "El nombre solo puede contener letras, espacios y guiones" }),
    
    last_name: z.string()
        .min(3, { message: "El apellido debe tener al menos tres caracteres" })
        .max(60, { message: "El apellido debe tener máximo 60 caracteres" })
        .regex(nameRegex, { message: "El apellido solo puede contener letras, espacios y guiones" }),
    
    birth_date: z.string()
        .regex(dateRegex, { message: "La fecha de nacimiento es obligatoria" })
        .refine((date) => {
            const today = new Date().toISOString().split("T")[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
            return date <= today;
        }, { message: "La fecha de nacimiento no puede ser mayor a la fecha actual" }),
    
    email: z.string().email({ message: "Email no válido" }),
    
    password: z.string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .regex(passwordRegex, { message: "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial" }),
    
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
});
