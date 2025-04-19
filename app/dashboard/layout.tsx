import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar />
      <div className="flex-1 overflow-auto md:max-w-7xl md:ml-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

