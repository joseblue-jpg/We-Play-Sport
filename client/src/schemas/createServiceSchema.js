import { z } from "zod";

export const createServiceSchema = z
  .object({
    service_name: z
      .string( {message: "Campo nombre requerido"} )
      .min(3, { message: "El nombre debe tener al menos tres caracteres" })
      .max(60, { message: "El nombre debe tener máximo 60 caracteres" }),
  });
