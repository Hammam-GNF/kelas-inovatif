"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/providers/AuthProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionProvider>
        <html lang="en">
          <body className={inter.className}>
            <div className="flex items-center justify-center min-h-screen">
              <Toaster position="top-center" />
              {children}
            </div>
          </body>
        </html>
      </SessionProvider>
    </AuthProvider>
  );
}
