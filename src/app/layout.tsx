import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";

// @ts-ignore: TypeScript ko CSS file ke import par error dene se rokne ke liye
import "./globals.css";

import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"],
  style: ['normal', 'italic'],
  variable: '--font-cormorant'
});

export const metadata: Metadata = {
  title: "For Douaa ❤️",
  description: "A journey of our memories and dreams...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} bg-black text-white antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}