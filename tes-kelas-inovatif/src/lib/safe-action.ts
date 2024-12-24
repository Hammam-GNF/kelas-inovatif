import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (error: Error) => {
    return {
      serverError: error.message || "Terjadi kesalahan pada server",
    };
  },
});
