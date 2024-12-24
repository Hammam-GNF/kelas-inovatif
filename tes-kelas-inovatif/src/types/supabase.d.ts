export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: "admin" | "user";
          avatar_url: string | null;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: "admin" | "user";
          avatar_url?: string | null;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: "admin" | "user";
          avatar_url?: string | null;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      user_role: "admin" | "user";
    };
  };
};
