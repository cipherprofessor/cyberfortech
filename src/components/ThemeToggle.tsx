// src/components/ThemeToggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@heroui/react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button 
      variant="ghost" 
      size="md" 
      onPress={toggleTheme}
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}