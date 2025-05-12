"use client"

import { useState } from "react"
import Image from "next/image"

interface JerseyIconProps {
  horseId: string
  size?: "sm" | "md" | "lg"
  className?: string
}

// Define jersey images with the correct paths
const jerseys = [
  "/images/jerseys/jocko123.png",
  "/images/jerseys/jocko.png",
  "/images/jerseys/jocko1.png",
  "/images/jerseys/jocko1234.png",
  "/images/jerseys/jock12.png",
  "/images/jerseys/jock.png",
]

export function JerseyIcon({ horseId, size = "md", className = "" }: JerseyIconProps) {
  const [imageError, setImageError] = useState(false)

  // Use the horse ID to deterministically select a jersey
  const jerseyIndex = Number.parseInt(horseId.replace(/\D/g, "").slice(0, 5) || "0", 10) % jerseys.length
  const jerseyPath = jerseys[jerseyIndex]

  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  // Generate a color based on the horse ID for the fallback
  const generateColor = (id: string) => {
    const colors = ["#0000FF", "#FF0000", "#FFFF00", "#00FF00", "#FF00FF", "#00FFFF"]
    const colorIndex = Number.parseInt(id.replace(/\D/g, "").slice(0, 3) || "0", 10) % colors.length
    return colors[colorIndex]
  }

  const bgColor = generateColor(horseId)

  // If there's an error loading the image, show a colored circle with the first letter of the horse ID
  if (imageError) {
    return (
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center ${className}`}
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-white font-bold">{horseId.charAt(0).toUpperCase()}</span>
      </div>
    )
  }

  return (
    <div className={`relative ${sizeMap[size]} overflow-hidden rounded-full ${className}`}>
      <Image
        src={jerseyPath || "/placeholder.svg"}
        alt="Jockey silks"
        fill
        className="object-cover"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  )
}
