import { signupSchema } from "./validation";
import { supabase } from "@/lib/supabase";

export async function signUpAction(data: { email: string; password: string }) {
  const validationResult = signupSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      serverError: validationResult.error.errors
        .map((err) => err.message)
        .join(", "),
    };
  }

  const { email, password } = validationResult.data;

  try {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { serverError: error.message };
    }

    return { user: data.user };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { serverError: "Terjadi kesalahan saat proses pendaftaran." };
  }
}
