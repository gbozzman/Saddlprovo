"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Award } from "lucide-react"
import type { LiveRaceRunner } from "@/lib/supabase"

interface HorseRankingBarProps {
  horses?: LiveRaceRunner[]
}

export function HorseRankingBar({ horses = [] }: HorseRankingBarProps) {
  const [expandedHorse, setExpandedHorse] = useState<string | null>(null)

  const toggleExpand = (horseName: string) => {
    setExpandedHorse(expandedHorse === horseName ? null : horseName)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-yellow-400"
    if (score >= 70) return "bg-orange-500"
    if (score >= 55) return "bg-blue-500"
    return "bg-blue-300"
  }

  const getPerformancePillars = (horse: LiveRaceRunner) => {
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

  // Generate AI summary based on horse stats
  const generateHorseSummary = (horse: LiveRaceRunner) => {
    const score = horse.normalized_score
    const pillars = getPerformancePillars(horse)

    // Find strongest and weakest attributes
    const sortedPillars = [...pillars].sort((a, b) => b.value - a.value)
    const strongest = sortedPillars[0]
    const weakest = sortedPillars[sortedPillars.length - 1]

    let summary = ""

    if (score >= 85) {
      summary = `${horse.horse_name} is an exceptional contender with outstanding ${strongest.name.toLowerCase()} (${Math.round(strongest.value)}). While ${weakest.name.toLowerCase()} (${Math.round(weakest.value)}) could be improved, this horse's overall performance metrics indicate a top-tier competitor with excellent winning potential.`
    } else if (score >= 70) {
      summary = `A strong competitor with impressive ${strongest.name.toLowerCase()} (${Math.round(strongest.value)}), ${horse.horse_name} shows great promise. The relatively lower ${weakest.name.toLowerCase()} (${Math.round(weakest.value)}) is worth noting, but overall performance suggests this horse should be considered a serious challenger.`
    } else if (score >= 55) {
      summary = `${horse.horse_name} demonstrates competitive potential with notable ${strongest.name.toLowerCase()} (${Math.round(strongest.value)}). However, limitations in ${weakest.name.toLowerCase()} (${Math.round(weakest.value)}) may impact overall performance. This horse could surprise under the right conditions.`
    } else {
      summary = `While showing potential in ${strongest.name.toLowerCase()} (${Math.round(strongest.value)}), ${horse.horse_name} faces challenges with ${weakest.name.toLowerCase()} (${Math.round(weakest.value)}). This developing competitor may improve with experience but currently represents a higher-risk option.`
    }

    return summary
  }

  // If horses is undefined or empty, show a message
  if (!horses || horses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <Award className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Horses Available</h3>
          <p className="text-gray-500">
            There are no horses to display for this race. Please try selecting a different race.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {horses.map((horse, index) => (
        <motion.div
          key={horse.id || `horse-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl overflow-hidden shadow-md"
        >
          <div
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpand(horse.horse_name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getScoreColor(
                    horse.normalized_score,
                  )}`}
                >
                  {Math.round(horse.normalized_score)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{horse.horse_name}</h3>
                  <p className="text-xs text-gray-500">
                    {horse.jockey || "Unknown"} • {horse.trainer || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg">{(horse.label || "").split(" ")[0]}</span>
                {expandedHorse === horse.horse_name ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expandedHorse === horse.horse_name && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 border-t border-gray-100">
                  {/* AI-generated horse summary */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-700 leading-relaxed">
                    {generateHorseSummary(horse)}
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {getPerformancePillars(horse).map((pillar) => (
                      <div key={pillar.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{pillar.name}</span>
                          <span className="text-sm font-medium text-gray-900">{Math.round(pillar.value)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#DDAD69] to-[#C49A45]"
                            style={{ width: `${(pillar.value / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-700">SaddlePro Horse Score™ (SHS)</p>
                        <p className="text-xs text-gray-500">Based on 8 performance pillars</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-white font-bold ${getScoreColor(
                          horse.normalized_score,
                        )}`}
                      >
                        {Math.round(horse.normalized_score)}/100
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
