import { z } from "zod";

export const signInSchema = z.object({
  email: z.string()
    .email("Format email tidak valid")
    .nonempty("Email harus diisi"),
  password: z.string()
    .min(8, "Kata sandi minimal 8 karakter")
    .nonempty("Kata sandi harus diisi"),
});

export type SignIn = z.infer<typeof signInSchema>;
