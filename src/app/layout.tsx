import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "@/components/common/Navbar/Navbar";
import { Footer } from "@/components/common/Footer/Footer";
import { Providers } from "./providers";
import "./globals.css"; // Make sure to create this file for global styles
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CyberForTech - Learn Cybersecurity and Technology",
  description: "Expert-led cybersecurity and technology courses for all skill levels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html 
        lang="en" 
        suppressHydrationWarning
        className="light"
      >
        <body 
          // className={`${inter.className} antialiased`}
          suppressHydrationWarning
        >
          <Providers>
            <Navbar />
            <main className="mt-16">{children}
            <SpeedInsights/>
            <Analytics />
            </main>
            {/* <Footer /> */}
          </Providers>
          
        </body>
      </html>
    </ClerkProvider>
  );
}