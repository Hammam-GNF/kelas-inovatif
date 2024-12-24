import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
});
