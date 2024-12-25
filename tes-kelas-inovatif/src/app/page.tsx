import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home - Gonjil St",
  description: "Aplikasi untuk belajar Next.js",
  authors: [{ name: "Hammam Gonjil", url: "http://localhost:3000" }],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Home - Gonjil St",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <div className="flex items-center justify-center">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
