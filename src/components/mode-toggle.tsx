import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark")
        } else if (theme === "dark") {
            setTheme("system")
        } else {
            setTheme("light")
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            title="Toggle theme"
        >
            {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />}
            {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />}
            {theme === "system" && (
                <div className="relative h-[1.2rem] w-[1.2rem]">
                    <Sun className="absolute inset-0 h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute inset-0 h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
            )}
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
