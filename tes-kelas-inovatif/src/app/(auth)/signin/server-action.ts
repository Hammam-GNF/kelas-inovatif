import { returnValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";
import { signInSchema } from "./validation";

export const signInAction = actionClient
	.schema(signInSchema)
	.action(async ({ parsedInput }) => {
		const { email, password } = parsedInput;

		const isCredentialsValid = email && password;

		if (!isCredentialsValid) {
			return returnValidationErrors(signInSchema, {
				_errors: ["Email dan kata sandi harus diisi"],
			});
		}

		// Here you would typically handle the sign-in logic, e.g., checking against a database

		return {
			message: "Sign-in successful",
			user: { email }, // Return user info as needed
		};
	});
