"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import { supportsViewTransitions, prefersReducedMotion } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = async () => {
    if (isTransitioning) return
    
    const newTheme = theme === "light" ? "dark" : "light"
    setIsTransitioning(true)
    
    try {
      // Check if View Transitions API is supported and user doesn't prefer reduced motion
      if (!buttonRef.current || !supportsViewTransitions() || prefersReducedMotion()) {
        setTheme(newTheme)
        return
      }

      // Add transitioning class to prevent conflicts
      document.documentElement.classList.add('transitioning')

      // Start view transition
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme)
        })
      })

      // Wait for transition to be ready
      await transition.ready

      // Get button's position
      const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      
      // Calculate radius needed to cover entire screen
      const right = window.innerWidth - left
      const bottom = window.innerHeight - top
      const maxRadius = Math.hypot(
        Math.max(left, right),
        Math.max(top, bottom)
      )

      // Circular growing animation
      const animation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          pseudoElement: '::view-transition-new(root)',
        }
      )

      // Wait for animation to complete
      await transition.finished
      
    } catch (error) {
      console.warn('Theme transition failed:', error)
      // Fallback to regular theme toggle
      setTheme(newTheme)
    } finally {
      setIsTransitioning(false)
      document.documentElement.classList.remove('transitioning')
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      disabled={isTransitioning}
      className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:scale-105 h-9 w-9 group theme-toggle-enhanced"
      type="button"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4">
        <Sun className={`absolute h-4 w-4 transition-all duration-500 text-primary group-hover:rotate-12 ${
          theme === 'dark' ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
        }`} />
        <Moon className={`absolute h-4 w-4 transition-all duration-500 text-primary dark:group-hover:-rotate-12 ${
          theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        }`} />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
} 