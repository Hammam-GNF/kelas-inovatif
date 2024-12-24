import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { fullName, email, password }: { fullName: string; email: string; password: string } = await request.json();

  if (!email || !password || !fullName) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Optionally, you can store additional user information in your database
    // await supabase.from('users').insert([{ id: data.user.id, full_name: fullName }]);

    return NextResponse.json(
      { message: "Account created successfully!", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during sign up:", error);
    return NextResponse.json(
      { error: (error as Error).message || "An error occurred during sign up" },
      { status: 500 }
    );
  }
}
