import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.scss";
import { CounterStoreProvider } from '@/provider/counter-store-provider'
import HeaderWrapper from "@/components/HeaderWrapper";


const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognize",
  description: "Your client tracking solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interTight.variable}`}>
        <HeaderWrapper/>
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </body>
    </html>
  );
}
