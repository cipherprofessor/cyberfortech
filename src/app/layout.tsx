//src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "@/components/common/Navbar/Navbar";
import { Footer } from "@/components/common/Footer/Footer";
import { Providers } from "./providers";
import "./globals.css"; // Make sure to create this file for global styles
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
// import { Toaster } from "sonner";

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
        <head>
        <Script
          src={`https://cdn.tiny.cloud/1/${process.env.NEXT_PUBLIC_TINYMCE_API_KEY}/tinymce/6/tinymce.min.js`}
          strategy="beforeInteractive"
          referrerPolicy="origin"
        />
      </head>
      
        <body 
          // className={`${inter.className} antialiased`}
          suppressHydrationWarning
        >
          <Providers>
            <Navbar />
            <main className="mt-16 light text-foreground bg-background">{children}
            <Toaster />
            <SpeedInsights/>
            <Analytics />
            <Toaster />
            </main>
            {/* <Footer /> */}
          </Providers>
          <NextSSRPlugin
          
          //  * The `extractRouterConfig` will extract **only** the route configs
          //  * from the router to prevent additional information from being
          //  * leaked to the client. The data passed to the client is the same
          //  * as if you were to fetch `/api/uploadthing` directly.
           
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
        </body>
      </html>
    </ClerkProvider>
  );
}