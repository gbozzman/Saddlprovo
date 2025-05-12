import type React from "react"
import "./globals.css"
import { BottomNavBar } from "@/components/BottomNavBar"
import { ProfileIcon } from "@/components/ProfileIcon"

export const metadata = {
  title: "SaddlePro - Horse Racing Analysis",
  description: "Professional horse racing analysis and predictions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Cormorant:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-100">
        <div className="w-full min-h-screen bg-secondary relative">
          <ProfileIcon />
          <div className="min-h-screen pb-16">{children}</div>
          <BottomNavBar />
        </div>
      </body>
    </html>
  )
}
