import { NextResponse } from "next/server";
import { validateRegistration } from "./validation";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const { success, error } = validateRegistration(body);

  if (!success) {
    return NextResponse.json({ error: error.format() }, { status: 400 });
  }

  const { email, password } = body;
  const { data, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    return NextResponse.json({ error: signupError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Registration successful!", user: data.user }, { status: 201 });
}

