import { Home } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Price Predict</h3>
              <p className="text-sm text-muted-foreground">Real Estate Intelligence</p>
            </div>
          </div>
          
          {/* University Info */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              University AI Project Demo
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Ho Chi Minh City, Vietnam
            </p>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground/70">
            © {new Date().getFullYear()} AI Price Predict. Built with Machine Learning.
          </p>
        </div>
      </div>
    </footer>
  )
}
