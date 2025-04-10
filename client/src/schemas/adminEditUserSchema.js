import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const zipCodeRegex = /^\d{5}$/;

const adminEditUserSchema = z.object({
    user_name: z
                  .string({message: "Campo nombre requerido"})
                  .min(3, {message: "El nombre debe tener al menos tres caracteres"})
                  .max(60, {message: "El nombre debe tener máximo 60 caracteres"})
                  .nullable()
                  .optional(),
    last_name: z
                  .string({message: "Campo apellido requerido"})
                  .min(3, {message: "El apellido debe tener al menos tres caracteres"})
                  .max(60, {message: "El apellido debe tener máximo 100 caracteres"})
                  .nullable()
                  .optional(),
    phone_number: z
                  .string()
                  .min(9, {message: "El teléfono debe tener al menos 9 caracteres"})
                  .max(35, {message: "El teléfono debe tener como máximo 35 caracteres"})
                  .nullable()
                  .optional(),
    identity_doc: z
                    .string()
                    .min(9, {message: "El documento de identidad debe tener al menos 9 caracteres"})
                    .max(35, {message: "El documento de identidad tener como máximo 35 caracteres"})
                    .nullable()
                    .optional(),
    nationality: z
                    .string()
                    .min(3, {message: "Este campo debe tener al menos 3 caracteres"})
                    .max(30, {message: "Este campo tener como máximo 35 caracteres"})
                    .nullable()
                    .optional(),
    birth_date: z
                  .string()
                  .regex(dateRegex, {message: "La fecha debe tener el siguiente formato: AAAA/MM/DD"})
                  .nullable()
                  .optional(),
    user_address: z
                    .string()
                    .min(3, { message: "La dirección debe de tener un mínimo de 3 caracteres" })
                    .max(80, { message: "La dirección no puede tener más de 200 caracteres" })
                    .nullable()
                    .optional(),
    zip_code: z
                .string()
                .length(5, { message : "El código postal debe tener exactamente 5 caracteres" })
                .regex(zipCodeRegex, { message: "El código postal debe tener exactamente 5 caracteres" })
                .nullable()
                .optional(),
    user_city: z
                .string()
                .min(3, { message: "La ciudad debe de tener un mínimo de 3 caracteres" })
                .max(80, { message: "La ciudad no puede tener más de 80 caracteres" })
                .nullable()
                .optional(),
    province: z
                .string()
                .min(3, {message: "La provincia debe de tener un mínimo de 3 caracteres" })
                .max(60, { message:"La provincia no puede tener más de 60 caracteres" })
                .nullable()
                .optional(),
    user_country: z
                .string()
                .min(3, { message: "El país debe de tener un mínimo de 3 caracteres" })
                .max(60, { message: "El país no puede tener más de 60 caracteres" })
                .nullable()
                .optional(),
    gender: z
                .string()
                .max(15, { message: "El género no puede tener más de 15 caracteres" })
                .nullable()
                .optional(),
}).partial();

export default adminEditUserSchema;