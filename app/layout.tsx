import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.scss";
import { CounterStoreProvider } from '@/provider/counter-store-provider'


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
        <CounterStoreProvider>{children}</CounterStoreProvider>
      </body>
    </html>
  );
}
