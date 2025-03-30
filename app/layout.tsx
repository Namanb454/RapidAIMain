import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Video Generator",
  description: "Generate amazing videos with AI",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}
) {
  return (
    <html lang="en">
      <body className="scroll-smooth">
          <AuthProvider>
            {children}
          </AuthProvider>
      </body>
    </html>
  )
}