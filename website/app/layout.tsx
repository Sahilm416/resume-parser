import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import {Toaster} from "sonner"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Parser",
  description: "parse resume like neve before",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " flex flex-col items-center overflow-hidden"}>
        <Navbar/>
        <div className="max-w-[1300px] w-full border-x">
         {children} 
        </div>
        <Toaster/>
      </body>
    </html>
  );
}
