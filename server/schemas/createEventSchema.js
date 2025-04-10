import { z } from "zod";
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
export const createEventSchema = z.object({
  event_name: z
    .string({ message: "Nombre requerido" })
    .min(3, { message: "El nombre debe de tener un mínimo de 3 caracteres" })
    .max(200, { message: "El nombre no puede tener más de 200 caracteres" }),
  season: z
    .string({ message: "Temporada requerida" })
    .min(4, { message: "La temporada debe de tener un mínimo de 3 caracteres" })
    .max(9, { message: "La temporada no puede tener más de 200 caracteres" }),
  sport_name: z
    .string({ message: "Deporte requerido" })
    .min(3, { message: "El deporte debe de tener un mínimo de 3 caracteres" })
    .max(50, { message: "El nombre no puede tener más de 200 caracteres" }),
    level_category: z
    .string({ message: "Categoría requerida"})  // Cambiado de .number() a .string() porque ahora es VARCHAR
    .max(15, { message: "La categoría no puede tener más de 15 caracteres." }),
  gender: z
    .string({ message: "Género requerido" })
    .max(15, { message: "El género no puede tener más de 15 caracteres" }),
  max_participants: z.number().nullable({ message: "Error max participants" }),
  event_address: z
    .string({ message: "Dirección requerida" })
    .min(3, { message: "La dirección debe de tener un mínimo de 3 caracteres" })
    .max(80, { message: "La dirección no puede tener más de 80 caracteres" }),
  event_city: z
    .string({ message: "Ciudad requerida" })
    .min(3, { message: "La ciudad debe de tener un mínimo de 3 caracteres" })
    .max(60, { message: "La ciudad no puede tener más de 60 caracteres" }),
  event_country: z
    .string({ message: "País requerido" })
    .min(3, { message: "El País debe de tener un mínimo de 3 caracteres" })
    .max(60, { message: "El país no puede tener más de 60 caracteres" }),
  is_team_event: z.boolean(),
  status: z.union(
    [z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)],
    { message: "El status solo puede ser entre 1 y 5 incluidos" }
  ),
  description: z
    .string({ message: "Descripción requerida" })
    .min(4, {
      message: "La descripcion debe de tener un mínimo de 4 caracteres",
    })
    .max(9000, {
      message: "La descripcion no puede tener más de 9000 caracteres",
    }),
  google_maps_link: z
    .string({ message: "Iframe de GoogleMaps requerido" })
    .min(15, {
      message: "La descripcion debe de tener un mínimo de 15 caracteres",
    })
    .max(500, {
      message: "La descripcion no puede tener más de 300 caracteres",
    }),
  price: z.number().refine(
    (value) => {
      return /^\d+(\.\d{2})?$/.test(value.toFixed(2));
    },
    { message: "Precio con un formato no válido" }
  ),
  date_start: z
    .string()
    .regex(dateRegex, { message: "Formato de fecha incorrecto" }),
  date_end: z
    .string()
    .regex(dateRegex, { message: "Formato de fecha incorrecto" }),
  time_start: z
    .string()
    .regex(timeRegex, { message: "Formato de hora incorrecto" }),
  time_end: z
    .string()
    .regex(timeRegex, { message: "Formato de hora incorrecto" }),
  check_in: z
    .string()
    .regex(timeRegex, { message: "Formato de hora incorrecto" }),
});