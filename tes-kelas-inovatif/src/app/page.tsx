import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Accordion 1</AccordionTrigger>
          <AccordionContent>Accordion 1 content</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Link
        href="/signin"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
      >
        Sign In
      </Link>
    </main>
  );
}
