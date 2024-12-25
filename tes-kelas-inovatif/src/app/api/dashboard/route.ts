import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/auth";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-auth-token")?.value;

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", token);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = createServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
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
