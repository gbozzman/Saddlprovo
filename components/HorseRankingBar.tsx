"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Horse } from "@/types/horse"

interface HorseRankingBarProps {
  horses: Horse[]
  onMoreAnalytics: () => void
  onHorseClick: (horseId: string) => void
}

const silkPatterns = ["stripes", "stars", "solid", "checkered", "diamonds"]
const themeColors = ["#DDAD69", "#FFFFFF", "#183531"]

function SilkPlaceholder({ pattern, color }: { pattern: string; color: string }) {
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
      {pattern === "stripes" && (
        <div className="w-full h-full rounded-full overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1/3 bg-white opacity-50" style={{ transform: `rotate(${45 * i}deg)` }}></div>
          ))}
        </div>
      )}
      {pattern === "stars" && <div className="text-white text-lg">★</div>}
      {pattern === "checkered" && (
        <div className="w-full h-full rounded-full overflow-hidden grid grid-cols-3 grid-rows-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={i % 2 === 0 ? "bg-white opacity-50" : ""}></div>
          ))}
        </div>
      )}
      {pattern === "diamonds" && (
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <div
            className="absolute inset-0 bg-white opacity-50"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
        </div>
      )}
    </div>
  )
}

export function HorseRankingBar({ horses, onMoreAnalytics, onHorseClick }: HorseRankingBarProps) {
  const [expanded, setExpanded] = useState(false)
  const displayHorses = expanded ? horses : horses.slice(0, 3)

  const horseSilks = useMemo(() => {
    return horses.map((horse) => ({
      pattern: silkPatterns[Math.floor(Math.random() * silkPatterns.length)],
      color: themeColors[Math.floor(Math.random() * themeColors.length)],
    }))
  }, [horses])

  return (
    <div className="bg-white rounded-xl p-6 mb-8 border-2 border-[#DDAD69] shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Horse Rankings</h2>
      <AnimatePresence>
        <motion.div className="space-y-3">
          {displayHorses.map((horse, index) => (
            <motion.div
              key={horse.id}
              initial={expanded ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors w-full"
            >
              <div className="flex items-center flex-grow cursor-pointer" onClick={() => onHorseClick(horse.id)}>
                <SilkPlaceholder pattern={horseSilks[index].pattern} color={horseSilks[index].color} />
                <span className="font-semibold text-gray-700 ml-3 hover:text-[#DDAD69] transition-colors">
                  {index + 1}. {horse.name}
                </span>
              </div>
              <div
                className="bg-[#DDAD69] rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                title="Click for more details"
              >
                <span className="text-white font-bold text-lg">{horse.score}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {horses.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-[#DDAD69] hover:text-[#C59C5F] transition-colors flex items-center justify-center w-full"
        >
          {expanded ? (
            <>
              <ChevronUp size={20} className="mr-1" />
              <span>Collapse Rankings</span>
            </>
          ) : (
            <>
              <ChevronDown size={20} className="mr-1" />
              <span>Expand Rankings</span>
            </>
          )}
        </button>
      )}
      <button
        onClick={onMoreAnalytics}
        className="w-full mt-6 py-3 bg-[#DDAD69] text-white rounded-md hover:bg-[#C59C5F] transition-colors font-semibold hover:bg-opacity-90 active:bg-opacity-100"
      >
        View Detailed Insights
      </button>
    </div>
  )
}
