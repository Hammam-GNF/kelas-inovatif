interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface SupabaseAuthResponse {
  data: {
    user: SupabaseUser | null;
  };
  error: Error | null;
}
