import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const zipCodeRegex = /^\d{5}$/;

const editUserSchema = z.object({
  user_name: z
    .string({ message: "Campo nombre requerido" })
    .min(3, { message: "El nombre debe tener al menos tres caracteres" })
    .max(60, { message: "El nombre debe tener máximo 60 caracteres" }),
  last_name: z
    .string({ message: "Campo apellido requerido" })
    .min(3, { message: "El apellido debe tener al menos tres caracteres" })
    .max(100, { message: "El apellido debe tener máximo 100 caracteres" }),
  phone_number: z
    .string()
    .max(35, {
      message: "El teléfono debe tener máximo 60 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  birth_date: z
    .string()
    .regex(dateRegex, { message: "La fecha debe tener el formato AAAA-MM-DD" }),
  identity_doc: z
    .string()
    .max(15, {
      message: "El documento debe tener máximo 15 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  nationality: z
    .string()
    .max(30, {
      message: "La nacionalidad debe tener máximo 30 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  user_address: z
    .string()
    .max(80, {
      message: "La dirección debe tener máximo 80 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  zip_code: z
    .string()
    .length(5, {
      message: "El código postal debe tener exactamente 5 caracteres",
    })
    .regex(zipCodeRegex, {
      message: "El código postal debe tener exactamente 5 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  user_city: z
    .string()
    .max(80, {
      message: "La ciudad debe tener máximo 80 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  province: z
    .string()
    .max(60, {
      message: "La provincia debe tener máximo 60 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  user_country: z
    .string()
    .max(60, {
      message: "El país debe tener máximo 60 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  gender: z
    .string()
    .max(15, {
      message: "El género debe tener máximo 15 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  user_photo: z
    .string()
    .max(150, {
      message: "El teléfono debe tener máximo 60 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
  file: z
    .string()
    .max(150, {
      message: "El teléfono debe tener máximo 60 caracteres",
    })
    .nullable() // Permite null
    .or(z.literal("")), // También permite strings vacíos
});

export default editUserSchema;
