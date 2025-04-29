"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Home, Video, History, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen)
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Create Video",
      href: "/dashboard/create",
      icon: Video,
    },
    // {
    //   name: "History",
    //   href: "/dashboard/history",
    //   icon: History,
    // },
    // {
    //   name: "Settings",
    //   href: "/dashboard/settings",
    //   icon: Settings,
    // },
  ]

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed md:hidden text-white w-full flex justify-between h-14 items-center border-b border-neutral-800 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <Video className="h-5 w-5" />
          <span>Rapid AI</span>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden  text-white " onClick={toggleMobileMenu}>
          {mobileOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <div className={cn("hidden md:flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-950 text-white fixed", className)}>
        <div className="flex h-14 items-center border-b border-neutral-800 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Video className="h-5 w-5" />
            <span>Rapid AI</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-900 hover:text-white hover:rounded-full",
                  pathname === item.href ? "bg-neutral-800 text-white rounded-full" : "transparent",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-neutral-500 p-4">
          <Button variant="outline" className="w-full justify-start gap-2 text-white bg-neutral-800 rounded-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-transparent backdrop-blur-lg md:hidden text-white">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold">
              <Video className="h-5 w-5" />
              <span>Rapid AI</span>
            </Link>
          </div>
          <nav className="grid gap-4 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent border",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            <Button variant="outline" className="mt-4 w-full justify-start gap-2 text-white border bg-transparent" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      )}
    </>
  )
}

