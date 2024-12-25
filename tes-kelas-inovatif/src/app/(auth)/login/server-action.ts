import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = createServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  const response = NextResponse.json({ user: data.user });
  response.cookies.set("sb-auth-token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
