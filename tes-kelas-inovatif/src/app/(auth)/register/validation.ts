import { z } from "zod";

const registrationSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const validateRegistration = async (data: {
  fullname: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: z.ZodError }> => {
  try {
    await registrationSchema.parseAsync(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error as z.ZodError };
  }
};
