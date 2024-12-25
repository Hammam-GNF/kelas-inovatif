"use server";

import { validateRegistration } from "./validation";
import { supabase } from "@/lib/supabase";

interface RegistrationData {
  fullname: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegistrationData) {
  try {
    // Validate the input
    const validationResult = await validateRegistration(data);
    if (!validationResult.success) {
      return {
        success: false,
        error:
          validationResult.error?.errors[0]?.message || "Validation failed",
      };
    }

    // Sign up with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullname,
        },
      },
    });

    if (signUpError) {
      console.error("Signup error:", signUpError);
      return {
        success: false,
        error: signUpError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to create user",
      };
    }

    return {
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}
