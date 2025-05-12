"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

interface HorseRankingBarProps {
  horseName: string
  score: number
  label: string
  position: number
  jockey: string
  trainer: string
}

export function HorseRankingBar({ horseName, score, label, position, jockey, trainer }: HorseRankingBarProps) {
  const [expanded, setExpanded] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-yellow-400"
    if (score >= 70) return "bg-orange-500"
    if (score >= 55) return "bg-blue-500"
    return "bg-blue-300"
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getScoreColor(
                score,
              )}`}
            >
              {Math.round(score)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {position}. {horseName}
              </h3>
              <p className="text-xs text-gray-500">
                {jockey} • {trainer}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">{label.split(" ")[0]}</span>
            {expanded ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100">
              <div className="grid grid-cols-1 gap-3 mt-2">
                <div>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Jockey:</strong> {jockey}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Trainer:</strong> {trainer}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Performance Label:</strong> {label}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
