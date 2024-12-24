import type { Metadata } from "next";

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
    </main>
  );
}
