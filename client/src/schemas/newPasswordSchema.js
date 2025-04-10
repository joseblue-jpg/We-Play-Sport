import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .regex(passwordRegex, {
        message:
          "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
      }),

    repNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.repNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repNewPassword"],
  });
