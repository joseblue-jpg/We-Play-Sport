import { z } from "zod";

export const servicesSchema = z.object({
  service_name: z
    .string({ message: "Nombre requerido" })
    .min(3, { message: "El nombre debe de tener un mínimo de 3 caracteres" })
    .max(60, { message: "El nombre no puede tener más de 60 caracteres" }),
});
