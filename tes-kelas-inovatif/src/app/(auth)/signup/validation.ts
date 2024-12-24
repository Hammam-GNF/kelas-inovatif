import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string()
    .min(8, "Kata sandi harus memiliki minimal 8 karakter")
    .regex(/^[0-9]*$/, "Kata sandi harus terdiri dari angka semua"),
});
