import type { Metadata } from "next";

const defaultMetadata: Metadata = {
  title: {
    default: "Gonjil St",
    template: "%s | Gonjil St",
  },
  description: "Aplikasi untuk belajar Next.js",
  authors: [{ name: "Hammam Gonjil", url: "http://localhost:3000" }],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Gonjil St",
    description: "Aplikasi untuk belajar Next.js",
    url: "http://localhost:3000",
    siteName: "Gonjil St",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
};

export default defaultMetadata; 