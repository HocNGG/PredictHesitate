
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

import { Brain, BarChart3, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function Navigation() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    { href: "/predict", label: "Predict", icon: Brain },
    { href: "/analysis", label: "Data Analysis", icon: BarChart3 },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Home className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Real Estate AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
