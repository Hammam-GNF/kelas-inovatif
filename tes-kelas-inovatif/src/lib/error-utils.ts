export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function handleAuthError(error: any): string {
  if (error instanceof AuthError) {
    return error.message;
  }

  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
}
