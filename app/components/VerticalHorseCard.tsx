"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { LiveRaceRunner } from "@/lib/supabase"

interface VerticalHorseCardProps {
  horse: LiveRaceRunner
  rank: number
}

export function VerticalHorseCard({ horse, rank }: VerticalHorseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-yellow-400"
    if (score >= 70) return "bg-orange-500"
    if (score >= 55) return "bg-blue-500"
    return "bg-blue-300"
  }

  const getRankLabel = (rank: number) => {
    const labels = {
      1: "1st",
      2: "2nd",
      3: "3rd",
      4: "4th",
      5: "5th",
    }
    return labels[rank as keyof typeof labels] || `${rank}th`
  }

  const rankColors = {
    1: "bg-yellow-400",
    2: "bg-gray-300",
    3: "bg-amber-600",
    4: "bg-blue-500",
    5: "bg-green-500",
  }

  const getPerformancePillars = () => {
    // Map the SIE pillars to the horse's scores
    const pillars = [
      { name: "Form Momentum", value: horse.scores?.["Form Momentum"] || 0 },
      { name: "Track Affinity", value: horse.scores?.["Track Affinity"] || 0 },
      { name: "Stamina", value: horse.scores?.["Stamina"] || 0 },
      { name: "Distance Weight", value: horse.scores?.["Distance Weight"] || 0 },
      { name: "Jockey Trainer", value: horse.scores?.["Jockey Trainer"] || 0 },
      { name: "Pace Suitability", value: horse.scores?.["Pace Suitability"] || 0 },
      { name: "Environmental Impact", value: horse.scores?.["Environmental Impact"] || 0 },
      { name: "Risk Factor", value: horse.scores?.["Risk Factor"] || 0 },
    ]

    // If Breeding Profile exists (for bumpers), add it
    if (horse.scores?.["Breeding Profile"]) {
      pillars.push({ name: "Breeding Profile", value: horse.scores["Breeding Profile"] })
    }

    return pillars
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl shadow-md overflow-hidden ${isExpanded ? "border-2 border-[#DDAD69]" : ""}`}
      onClick={toggleExpand}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500">Silks</span>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{horse.horse_name}</h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${
                    rankColors[rank as keyof typeof rankColors] || "bg-gray-500"
                  }`}
                >
                  {getRankLabel(rank)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600">Jockey: {horse.jockey}</p>
            <p className="text-xs text-gray-600">Trainer: {horse.trainer}</p>
          </div>
          <div className="flex flex-col items-center ml-2">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg mb-1 text-white font-bold ${getScoreColor(
                horse.normalized_score,
              )}`}
            >
              <span className="text-xl">{Math.round(horse.normalized_score)}</span>
            </div>
            <span className="text-xs font-medium text-gray-600">SHS</span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Performance Pillars</h3>
            <div className="space-y-2">
              {getPerformancePillars().map((pillar) => (
                <div key={pillar.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">{pillar.name}</span>
                    <span className="text-xs font-medium text-gray-900">{Math.round(pillar.value)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#DDAD69] to-[#C49A45]"
                      style={{ width: `${(pillar.value / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">{horse.label}</span>
              <span className="text-xs font-medium text-gray-700">
                Form: {Array.isArray(horse.form) ? horse.form.join("-") : horse.form}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
