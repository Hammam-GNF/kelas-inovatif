import { actionClient } from "@/lib/safe-action";
import { signInSchema } from "@/app/api/auth/[...nextauth]/validation";
import { supabase } from "@/lib/supabase";

export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parsedInput.email,
        password: parsedInput.password,
      });

      if (error) throw error;

      return { success: true, user: data.user };
    } catch (error: any) {
      return {
        success: false,
        serverError: error.message || "Terjadi kesalahan saat login",
      };
    }
  });
