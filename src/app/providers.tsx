'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes' // Recommended for theme support

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </ThemeProvider>
  )
}