import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raj Antala | AI Engineer, Data Science & Generative AI",
  description: "Personal portfolio of Raj Antala — AI Engineer specializing in Deep Learning, Generative AI, LLM systems, and Machine Learning engineering.",
  keywords: ["Raj Antala", "AI Engineer", "Data Scientist", "Generative AI", "Machine Learning", "PyTorch", "Python", "RAG"],
  authors: [{ name: "Raj Antala" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
