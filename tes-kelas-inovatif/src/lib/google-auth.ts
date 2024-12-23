import { supabase } from "./supabase";

export async function signInWithGoogle(token: string) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token,
  });

  if (error) throw error;
  return data;
}
