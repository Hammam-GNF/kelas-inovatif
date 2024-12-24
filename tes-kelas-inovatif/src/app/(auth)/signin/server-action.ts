import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { signInSchema } from "./validation";
import { supabase } from "@/lib/supabase";

export const signInAction = actionClient
	.schema(signInSchema)
	.action(async ({ parsedInput }) => {
		const { email, password } = parsedInput;

		const isCredentialsValid = Boolean(email && password);

		if (!isCredentialsValid) {
			return returnValidationErrors(signInSchema, {
				_errors: ["Email dan kata sandi harus diisi"],
			});
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error || !data.user) {
			return returnValidationErrors(signInSchema, {
				_errors: [error?.message || "Gagal melakukan sign in"],
			});
		}

		return {
			message: "Sign-in successful",
			user: { email: data.user.email }, // Return user info as needed
		};
	});
