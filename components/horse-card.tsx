"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ArrowLeft } from "lucide-react"
import type { LiveRaceRunner } from "@/lib/supabase"

interface HorseCardProps {
  horse: LiveRaceRunner
  onRemove: () => void
  onNext: () => void
  onPrevious: () => void
  index: number
  total: number
  rank: number
  selectedRace: string
  selectedDate: string
  selectedTime: string
}

const PerformanceBar = ({ value, label, description }: { value: number; label: string; description?: string }) => (
  <div className="mb-2">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      <span className="text-sm font-bold text-gray-900">{Math.round(value)}</span>
    </div>
    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
      <div
        className="absolute top-0 left-0 h-full rounded-full"
        style={{
          width: `${value}%`,
          background: "linear-gradient(to right, #ff4444, #ffa500, #4caf50)",
        }}
      />
    </div>
    {description && <p className="text-xs text-gray-600">{description}</p>}
  </div>
)

export default function HorseCard({
  horse,
  onRemove,
  onNext,
  onPrevious,
  index,
  total,
  rank,
  selectedRace,
  selectedDate,
  selectedTime,
}: HorseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState(0)
  const [lastTapTime, setLastTapTime] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDoubleTap = (e: React.TouchEvent) => {
    e.preventDefault()
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTapTime

    if (tapLength < 300 && tapLength > 0) {
      setIsFlipped(!isFlipped)
    }
    setLastTapTime(currentTime)
  }

  const calculateHorizontalFanTransform = (idx: number) => {
    const baseOffset = 20
    const rotation = idx * 2 // Reduced rotation for horizontal stack
    const xOffset = -idx * baseOffset // Negative for right-to-left stack

    return {
      x: xOffset,
      y: 0, // No vertical offset for horizontal stack
      rotate: rotation,
      scale: 1 - idx * 0.03, // Reduced scale difference
      zIndex: total - idx,
    }
  }

  const fanTransform = calculateHorizontalFanTransform(index)

  const rankColors = {
    1: "bg-yellow-400",
    2: "bg-gray-300",
    3: "bg-amber-600",
    4: "bg-blue-500",
    5: "bg-green-500",
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

  // Get the SIE pillars
  const getPerformancePillars = () => {
    // Map the SIE pillars to the horse's scores
    return [
      {
        name: "Form Momentum",
        value: horse.scores?.["Form Momentum"] || 0,
        description: "Recent race performance and form trajectory",
      },
      {
        name: "Track Affinity",
        value: horse.scores?.["Track Affinity"] || 0,
        description: "Success at this course and going",
      },
      { name: "Stamina", value: horse.scores?.["Stamina"] || 0, description: "Endurance and staying power" },
      {
        name: "Distance Weight",
        value: horse.scores?.["Distance Weight"] || 0,
        description: "Suitability for race distance and weight carried",
      },
      { name: "Jockey Trainer", value: horse.scores?.["Jockey Trainer"] || 0, description: "Quality of connections" },
      {
        name: "Pace Suitability",
        value: horse.scores?.["Pace Suitability"] || 0,
        description: "Running style for this race",
      },
      {
        name: "Environmental Impact",
        value: horse.scores?.["Environmental Impact"] || 0,
        description: "Adaptability to conditions",
      },
      { name: "Risk Factor", value: horse.scores?.["Risk Factor"] || 0, description: "Consistency and reliability" },
    ]
  }

  const pillars = getPerformancePillars()

  return (
    <motion.div
      ref={cardRef}
      key={horse.id}
      initial={false}
      animate={{
        opacity: 1,
        ...(isFlipped
          ? {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
            }
          : {
              x: fanTransform.x,
              y: fanTransform.y,
              rotate: fanTransform.rotate,
              scale: fanTransform.scale,
            }),
        zIndex: isFlipped ? total + 1 : fanTransform.zIndex,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        position: "absolute",
        width: "90%",
        maxWidth: "400px",
        height: "100%",
        transformOrigin: "right center", // Changed to right for horizontal stack
        right: "5%", // Position from right side
      }}
      className="touch-none"
      drag={!isFlipped ? "x" : false}
      dragConstraints={{ left: -50, right: 50 }}
      dragElastic={0.7}
      onTouchStart={handleDoubleTap}
      onDragEnd={(e, { offset }) => {
        if (!isFlipped) {
          if (offset.x > 50) {
            setDirection(-1)
            onPrevious()
          } else if (offset.x < -50) {
            setDirection(1)
            onNext()
          }
        }
      }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1200px",
        }}
      >
        {/* Front of card */}
        <motion.div
          className="absolute w-full h-full bg-white rounded-3xl p-4 transform-gpu backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "2px solid #DDAD69",
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-500">Silks</span>
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">{horse.horse_name}</h2>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${rankColors[rank as keyof typeof rankColors] || "bg-gray-500"}`}
                  >
                    {getRankLabel(rank)}
                  </span>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-800 mb-1">
                {selectedRace} -{" "}
                {selectedDate
                  ? new Date(selectedDate)
                      .toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
                      .replace(/\//g, "-")
                  : ""}{" "}
                {selectedTime}
              </p>
              <p className="text-xs text-gray-600">Jockey: {horse.jockey}</p>
              <p className="text-xs text-gray-600">Trainer: {horse.trainer}</p>
            </div>
            <div className="flex flex-col items-center ml-2">
              <div className="w-14 h-14 rounded-full bg-[#DDAD69] flex items-center justify-center shadow-lg mb-1">
                <span className="text-xl font-bold text-white">{Math.round(horse.normalized_score)}</span>
              </div>
              <span className="text-xs font-medium text-gray-600">SHS</span>
            </div>
          </div>
          <div className="mb-4">
            {pillars.slice(0, 6).map((pillar) => (
              <PerformanceBar key={pillar.name} value={pillar.value} label={pillar.name} />
            ))}
          </div>

          <button
            onClick={() => setIsFlipped(true)}
            className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2 justify-center border rounded-full hover:shadow-md transition-all duration-200"
          >
            More Analytics
            <RefreshCw size={14} />
          </button>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute w-full h-full bg-white rounded-3xl p-4 transform-gpu backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "2px solid #DDAD69",
          }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-gray-900">Performance Analysis</h2>
                <div className="w-12 h-12 rounded-full bg-[#DDAD69] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{Math.round(horse.normalized_score)}</span>
                </div>
              </div>

              {pillars.map((pillar) => (
                <PerformanceBar
                  key={pillar.name}
                  value={pillar.value}
                  label={pillar.name}
                  description={pillar.description}
                />
              ))}

              <div className="mt-3 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-700 font-medium">{horse.label}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Form: {Array.isArray(horse.form) ? horse.form.join("-") : horse.form}
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => setIsFlipped(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
