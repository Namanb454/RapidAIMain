import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import Link from "next/link"
import { Video } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar />
      <div className="overflow-auto md:w-[80%] md:ml-auto">
        {/* <div className="flex h-14 items-center border-b border-neutral-800 px-4 text-white">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Video className="h-5 w-5" />
            <span>Rapid AI</span>
          </Link>
        </div> */}
        <main className="p-6 md:mt-0 mt-10">{children}</main>
      </div>
    </div>
  )
}

