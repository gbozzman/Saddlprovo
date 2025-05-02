"use client"
import { motion } from "framer-motion"

interface TrophyRosetteProps {
  rank: number
  size?: "sm" | "md" | "lg"
}

const colors = {
  1: { ribbon: "bg-yellow-400", text: "text-yellow-800" },
  2: { ribbon: "bg-gray-300", text: "text-gray-800" },
  3: { ribbon: "bg-amber-600", text: "text-amber-100" },
  default: { ribbon: "bg-blue-500", text: "text-white" },
}

export function TrophyRosette({ rank, size = "md" }: TrophyRosetteProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-20 h-20 text-base",
  }

  const color = colors[rank as keyof typeof colors] || colors.default

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${color.ribbon} rounded-full flex items-center justify-center`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="absolute inset-0 rounded-full border-4 border-white"></div>
      <div className={`font-bold ${color.text}`}>{rank}</div>
      <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-white"></div>
      <div className={`absolute -bottom-6 left-0 w-1/2 h-8 ${color.ribbon} transform -skew-x-30`}></div>
      <div className={`absolute -bottom-6 right-0 w-1/2 h-8 ${color.ribbon} transform skew-x-30`}></div>
    </motion.div>
  )
}
