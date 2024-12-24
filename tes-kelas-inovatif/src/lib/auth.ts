import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !user) return null;

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          return {
            id: user.id,
            email: user.email || "",
            name: profile?.full_name || "",
            image: profile?.avatar_url || null,
            role: profile?.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          const { data: existingUser } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", profile?.email)
            .single();

          if (!existingUser) {
            await supabase.from("profiles").insert([
              {
                id: profile?.sub,
                email: profile?.email,
                full_name: profile?.name,
                avatar_url: profile?.image,
                role: "user",
              },
            ]);
          }
        } catch (error) {
          console.error("Error handling Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
};
