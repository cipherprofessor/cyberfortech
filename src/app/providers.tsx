//src/app/providers.tsx
'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'

export function ThemeProviders({children}: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </ThemeProvider>
  )
}