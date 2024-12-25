import { NextResponse } from "next/server";
import { validateLogin } from "./validation";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const { success, error } = validateLogin(body);

  if (!success) {
    return NextResponse.json({ error: error.format() }, { status: 400 });
  }

  const { email, password } = body;
  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return NextResponse.json({ error: loginError.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "Login successful!", user: data.user },
    { status: 200 }
  );
}
