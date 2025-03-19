//src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Navbar from "@/components/common/Navbar/Navbar";
import { Footer } from "@/components/common/Footer/Footer";
import { ThemeProviders } from "./providers";
import "./globals.css"; // Make sure to create this file for global styles
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "./api/uploadthing/core";

import Script from "next/script";

import { MohsinToaster } from "@/components/ui/mohsin-toast";
import { ReduxStoreProviders } from "@/store/provider";
import StatusIndicator from "@/components/ui/StatusIndicator/StatusIndicator";
import { BackgroundBeams } from "@/components/ui/AcUI/BackgroundBeams/background-beams";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CyberFort - Learn Cybersecurity and Technology",
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
        className="dark"
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
        
        
         
         
            <ReduxStoreProviders>
            <StatusIndicator />
            <Navbar />
            <main className="mt-16 light text-foreground bg-background">{children}
            <SpeedInsights/>
            <Analytics />
            <MohsinToaster 
          position="bottom-right" 
          defaultStyle="glass" 
          defaultSize="md"
          showIcons={true}
          showProgress={true}
        />
            </main>
            {/* <Footer /> */}
            </ReduxStoreProviders>
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