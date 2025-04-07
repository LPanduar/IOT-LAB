import { object, string } from "zod";

export const loginSchema = object({
  email: string({ required_error: "El correo electrónico es obligatorio" })
      .min(1, "El correo electrónico es obligatorio")
      .email("Correo electrónico inválido"),
  password: string({ required_error: "La contraseña es obligatoria" })
      .min(1, "La contraseña es obligatoria")
      .min(6, "La contraseña debe tener más de 6 caracteres")
      .max(32, "La contraseña debe tener menos de 32 caracteres"),
});

export const registerSchema = object({
  email: string({ required_error: "El correo electrónico es obligatorio" })
      .min(1, "El correo electrónico es obligatorio")
      .email("Correo electrónico inválido"),
  password: string({ required_error: "La contraseña es obligatoria" })
      .min(1, "La contraseña es obligatoria")
      .min(6, "La contraseña debe tener más de 6 caracteres")
      .max(32, "La contraseña debe tener menos de 32 caracteres"),
  name: string({ required_error: "El nombre es obligatorio" })
      .min(1, "El nombre es obligatorio")
      .max(32, "El nombre debe tener menos de 32 caracteres"),
});