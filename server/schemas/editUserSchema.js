import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const zipCodeRegex = /^\d{5}$/;

const editUserSchema = z.object({
  user_name: z
    .string({ message: "Nombre requerido" })
    .min(3, { message: "El nombre debe tener al menos tres caracteres" })
    .max(60, { message: "El nombre debe tener máximo 60 caracteres" }),
  last_name: z
    .string({ message: "Apellido requerido" })
    .min(3, { message: "El apellido debe tener al menos tres caracteres" })
    .max(100, { message: "El apellido debe tener máximo 100 caracteres" }),
  phone_number: z
    .string()
    .max(35, {
      message: "El teléfono debe tener máximo 60 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  birth_date: z
    .string()
    .regex(dateRegex, { message: "La fecha debe tener el formato AAAA-MM-DD" }),
  identity_doc: z
    .string()
    .max(15, {
      message: "El documento no puede tener más de 15 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  nationality: z
    .string()
    .max(30, {
      message: "La nacionalidad no puede tener más de 30 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  user_address: z
    .string()
    .max(80, {
      message: "La dirección no puede tener más de 80 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  zip_code: z
    .string()
    .length(5, {
      message: "El código postal debe tener exactamente 5 caracteres",
    })
    .regex(zipCodeRegex, {
      message: "El código postal debe tener exactamente 5 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  user_city: z
    .string()
    .max(80, {
      message: "La ciudad no puede tener más de 80 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  province: z
    .string()
    .max(60, {
      message: "La provincia no puede tener más de 60 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  user_country: z
    .string()
    .max(60, {
      message: "El país no puede tener más de 60 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  gender: z
    .string()
    .max(15, {
      message: "El género no puede tener más de 15 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  user_photo: z
    .string()
    .max(150, {
      message: "El teléfono no puede tener más de 60 caracteres",
    })
    .nullable()
    .or(z.literal("")),
  file: z
    .string()
    .max(150, {
      message: "El teléfono no puede tener más de 60 caracteres",
    })
    .nullable()
    .or(z.literal("")),
});

export default editUserSchema;
