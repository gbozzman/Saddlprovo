"use client"

import { motion } from "framer-motion"
import type { LiveRaceRunner } from "@/lib/supabase"

interface HorseScoreCardProps {
  horse: LiveRaceRunner
}

export function HorseScoreCard({ horse }: HorseScoreCardProps) {
  const pillars = [
    { name: "Form Momentum", score: horse.scores?.["Form Momentum"] || horse.form_momentum_score || 0 },
    { name: "Track Affinity", score: horse.scores?.["Track Affinity"] || horse.track_affinity_score || 0 },
    { name: "Stamina", score: horse.scores?.["Stamina"] || horse.stamina_score || 0 },
    { name: "Distance Weight", score: horse.scores?.["Distance Weight"] || horse.distance_weight_score || 0 },
    { name: "Jockey Trainer", score: horse.scores?.["Jockey Trainer"] || horse.jockey_trainer_score || 0 },
    { name: "Pace Suitability", score: horse.scores?.["Pace Suitability"] || horse.pace_suitability_score || 0 },
    {
      name: "Environmental Impact",
      score: horse.scores?.["Environmental Impact"] || horse.environmental_impact_score || 0,
    },
    { name: "Risk Factor", score: horse.scores?.["Risk Factor"] || horse.risk_factor_score || 0 },
  ]

  // Add Breeding Profile if it exists (for bumpers)
  if (horse.scores?.["Breeding Profile"] || horse.breeding_profile_score) {
    pillars.push({
      name: "Breeding Profile",
      score: horse.scores?.["Breeding Profile"] || horse.breeding_profile_score || 0,
    })
  }

  const totalScore = horse.normalized_score || 0
  const form = horse.form || "---"

  // Function to get color gradient based on score
  const getScoreColor = (score: number) => {
    if (score < 30) return "from-red-600 to-red-500"
    if (score < 50) return "from-red-500 to-orange-500"
    if (score < 70) return "from-orange-500 to-yellow-500"
    if (score < 85) return "from-yellow-500 to-green-500"
    return "from-green-500 to-green-600"
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-md">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <div className="flex items-center mb-1">
          <h3 className="text-xl font-bold text-gray-900">{horse.horse_name}</h3>
          <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">Form: {form}</span>
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Jockey:</span> {horse.jockey || horse.jockey_name || "Unknown"} •
          <span className="font-medium text-gray-700 ml-2">Trainer:</span>{" "}
          {horse.trainer || horse.trainer_name || "Unknown"}
        </div>
      </div>

      <div className="space-y-3">
        {pillars.map((pillar, index) => (
          <motion.div
            className="score-row"
            key={pillar.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-700">{pillar.name}</div>
              <div className="text-sm font-semibold text-gray-900">{Math.round(pillar.score)}</div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(pillar.score)}`}
                initial={{ width: 0 }}
                animate={{ width: `${pillar.score}%` }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-gray-700">SaddlePro Horse Score™ (SHS)</div>
            <div className="text-xs text-gray-500">Based on {pillars.length} performance pillars</div>
          </div>
          <div className="relative">
            {/* 3D style score circle */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-gray-200 to-gray-300 shadow-lg flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-gray-100 to-white flex items-center justify-center shadow-inner">
                <span className="text-xl font-bold">{Math.round(totalScore)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
