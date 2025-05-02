"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ArrowLeft, Star } from "lucide-react"
import type { Horse } from "@/types/horse"
import { format } from "date-fns"

const silkPatterns = ["stripes", "stars", "solid", "checkered", "diamonds", "polkadots", "triangles", "zigzag"]

const themeColors = [
  "#DDAD69", // Gold
  "#FFFFFF", // White
  "#183531", // Dark Green
  "#FF0000", // Red
  "#0000FF", // Blue
  "#FFA500", // Orange
  "#FFFF00", // Yellow
  "#FFC0CB", // Pink
  "#800080", // Purple
  "#A52A2A", // Brown
]

function SilkPlaceholder({
  pattern,
  primaryColor,
  secondaryColor,
}: { pattern: string; primaryColor: string; secondaryColor: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: primaryColor }}
    >
      {pattern === "stripes" && (
        <div className="w-full h-full">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-1/3"
              style={{ backgroundColor: i % 2 === 0 ? secondaryColor : "transparent" }}
            ></div>
          ))}
        </div>
      )}
      {pattern === "stars" && (
        <div className="text-sm" style={{ color: secondaryColor }}>
          ★
        </div>
      )}
      {pattern === "solid" && <div className="w-full h-full" style={{ backgroundColor: secondaryColor }}></div>}
      {pattern === "checkered" && (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{ backgroundColor: i % 2 === 0 ? secondaryColor : "transparent" }}></div>
          ))}
        </div>
      )}
      {pattern === "diamonds" && (
        <div className="w-full h-full relative">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: secondaryColor, clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          ></div>
        </div>
      )}
      {pattern === "polkadots" && (
        <div className="w-full h-full relative">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: secondaryColor,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            ></div>
          ))}
        </div>
      )}
      {pattern === "triangles" && (
        <div className="w-full h-full relative">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: secondaryColor, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          ></div>
        </div>
      )}
      {pattern === "zigzag" && (
        <div className="w-full h-full relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: secondaryColor,
              clipPath: "polygon(0 0, 100% 0, 100% 20%, 0 40%, 0 60%, 100% 80%, 100% 100%, 0 100%)",
            }}
          ></div>
        </div>
      )}
    </div>
  )
}

interface VerticalHorseCardProps {
  horse: Horse
  rank: number
}

const PerformanceBar = ({ value, label, description }: { value: number; label: string; description?: string }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}/100</span>
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

const generatePersonalizedInsight = (horse: Horse) => {
  if (!horse || !horse.performance) {
    return "No performance data available for this horse."
  }

  const personalities = ["spirited", "calm", "energetic", "focused", "adaptable"]
  const personality = personalities[Math.floor(Math.random() * personalities.length)]

  const strengths = Object.entries(horse.performance)
    .filter(([_, value]) => value >= 75)
    .map(([key, _]) => {
      switch (key) {
        case "winRate":
          return '<span class="text-[#DDAD69] font-semibold">impressive win rate</span>'
        case "jockeyPerformance":
          return '<span class="text-[#DDAD69] font-semibold">strong jockey synergy</span>'
        case "trainerForm":
          return '<span class="text-[#DDAD69] font-semibold">excellent training</span>'
        case "groundDurability":
          return '<span class="text-[#DDAD69] font-semibold">track adaptability</span>'
        case "injuryHistory":
          return '<span class="text-[#DDAD69] font-semibold">robust health</span>'
        case "ageAndWeight":
          return '<span class="text-[#DDAD69] font-semibold">peak condition</span>'
        default:
          return key
      }
    })

  const formAnalysis = analyzeForm(horse.form)
  const recentPerformance = horse.recentPerformances?.[0]

  let insight = `${horse.name} is a ${personality} competitor `

  if (strengths.length > 0) {
    insight += `known for ${strengths.slice(0, 2).join(" and ")}. `
  } else {
    insight += `with balanced performance across all areas. `
  }

  insight += `With ${horse.jockey} as jockey and ${horse.trainer}'s training, ${horse.name} is a strong contender. `
  insight += formAnalysis

  // Add contextual examples and actionable commentary
  if (recentPerformance) {
    insight += ` In its most recent race on ${format(new Date(recentPerformance.date), "MMM d, yyyy")}, ${horse.name} finished ${recentPerformance.position}${getOrdinalSuffix(recentPerformance.position)} in ${recentPerformance.trackCondition} conditions. `
  }

  insight += `${horse.name}'s recent performances have been noted, and they contribute to the overall assessment. `

  if (horse.performance.groundDurability > 80) {
    insight += `With high ground durability, ${horse.name} is well-suited for various track conditions. `
  } else if (horse.performance.groundDurability < 60) {
    insight += `${horse.name} may struggle on challenging track conditions. `
  }

  if (horse.performance.jockeyPerformance > 85) {
    insight += `The strong synergy between ${horse.name} and ${horse.jockey} could be a decisive factor in this race. `
  }

  return insight
}

const analyzeForm = (form: string) => {
  const results = form.split("-")
  const recentResults = results.slice(0, 3)
  const goodResults = recentResults.filter((result) => Number.parseInt(result) <= 3).length

  if (goodResults === 3) {
    return `The horse's recent form of ${recentResults.join("-")} shows exceptional consistency and top-tier performance.`
  } else if (goodResults === 2) {
    return `With a recent form of ${recentResults.join("-")}, the horse demonstrates strong potential with room for improvement.`
  } else if (goodResults === 1) {
    return `The recent form of ${recentResults.join("-")} indicates some challenges, but also shows the horse's ability to compete at a high level.`
  } else {
    return `Despite a challenging recent form of ${recentResults.join("-")}, the horse's overall record suggests potential for a comeback.`
  }
}

const getOrdinalSuffix = (n: number) => {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

interface Horse {
  id: string
  name: string
  score: number
  jockey: string
  trainer: string
  performance: {
    winRate: number
    jockeyPerformance: number
    trainerForm: number
    groundDurability: number
    injuryHistory: number
    ageAndWeight: number
  }
  form: string
  recentPerformances?: {
    date: string
    position: number
    trackCondition: string
  }[]
}

export function VerticalHorseCard({ horse, rank }: VerticalHorseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const horseSilk = useMemo(() => {
    const patternIndex = Math.floor(Math.random() * silkPatterns.length)
    const primaryColorIndex = Math.floor(Math.random() * themeColors.length)
    let secondaryColorIndex
    do {
      secondaryColorIndex = Math.floor(Math.random() * themeColors.length)
    } while (secondaryColorIndex === primaryColorIndex)

    return {
      pattern: silkPatterns[patternIndex],
      primaryColor: themeColors[primaryColorIndex],
      secondaryColor: themeColors[secondaryColorIndex],
    }
  }, [])

  useEffect(() => {
    // Check if the horse is in favorites when the component mounts
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setIsFavorite(favorites.some((fav: Horse) => fav.id === horse.id))
  }, [horse.id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav: Horse) => fav.id !== horse.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    } else {
      favorites.push(horse)
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
    setIsFavorite(!isFavorite)
  }

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

  const personalizedInsight = generatePersonalizedInsight(horse)

  if (!horse) {
    return <div className="text-white">No horse data available.</div>
  }

  return (
    <div className="w-full perspective-1000 mb-8">
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 70, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className={`w-full bg-white rounded-3xl p-6 ${!isFlipped ? "relative" : "absolute"} backface-hidden`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: isFlipped ? "absolute" : "relative",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: "rotateY(0deg)",
            zIndex: isFlipped ? 0 : 1,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "2px solid #DDAD69",
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <SilkPlaceholder
                  pattern={horseSilk.pattern}
                  primaryColor={horseSilk.primaryColor}
                  secondaryColor={horseSilk.secondaryColor}
                />
                <h2 className="text-2xl font-bold text-gray-900">{horse.name}</h2>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full text-white ${
                    rankColors[rank as keyof typeof rankColors] || "bg-gray-500"
                  }`}
                >
                  {getRankLabel(rank)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Jockey: {horse.jockey}</p>
              <p className="text-sm text-gray-600">Trainer: {horse.trainer}</p>
              <p className="text-sm text-gray-600">Form: {horse.form}</p>
            </div>
            <div className="flex flex-col items-center ml-2">
              <div className="w-16 h-16 rounded-full bg-[#DDAD69] flex items-center justify-center shadow-lg mb-1 relative">
                <span className="text-2xl font-bold text-white">{horse.score}</span>
                <button
                  onClick={toggleFavorite}
                  className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md"
                >
                  <Star
                    size={16}
                    className={`${
                      isFavorite ? "text-yellow-400 fill-current" : "text-gray-400"
                    } transition-colors duration-200`}
                  />
                </button>
              </div>
              <span className="text-xs font-medium text-gray-600">Score</span>
            </div>
          </div>
          <div className="mb-6">
            {horse.performance && (
              <>
                <PerformanceBar value={horse.performance.winRate} label="Win Rate" />
                <PerformanceBar value={horse.performance.jockeyPerformance} label="Jockey Performance" />
                <PerformanceBar value={horse.performance.trainerForm} label="Trainer Form" />
                <PerformanceBar value={horse.performance.groundDurability} label="Ground Durability" />
                <PerformanceBar value={horse.performance.injuryHistory} label="Injury History" />
                <PerformanceBar value={horse.performance.ageAndWeight} label="Age & Weight" />
              </>
            )}
          </div>

          <p className="text-sm text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: personalizedInsight }} />

          <motion.button
            onClick={() => setIsFlipped(true)}
            className="w-full py-3 text-base font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2 justify-center border rounded-full hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            More Analytics
            <RefreshCw size={18} />
          </motion.button>
        </div>

        {/* Back of card */}
        <div
          className={`w-full bg-white rounded-3xl p-6 ${isFlipped ? "relative" : "absolute"} backface-hidden`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            position: isFlipped ? "relative" : "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: "rotateY(180deg)",
            zIndex: isFlipped ? 1 : 0,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "2px solid #DDAD69",
          }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h2>

              <PerformanceBar
                value={horse.performance.winRate}
                label="Win Rate"
                description={`${horse.performance.winRate}% win rate in recent races`}
              />

              <PerformanceBar
                value={horse.performance.jockeyPerformance}
                label="Jockey Performance"
                description={`${horse.jockey}'s recent performance and synergy with ${horse.name}`}
              />

              <PerformanceBar
                value={horse.performance.trainerForm}
                label="Trainer Form"
                description={`${horse.trainer}'s success rate and training strategies`}
              />

              <PerformanceBar
                value={horse.performance.groundDurability}
                label="Ground Durability"
                description={`${horse.name}'s adaptability to various track conditions`}
              />

              <PerformanceBar
                value={horse.performance.injuryHistory}
                label="Injury History"
                description={`Assessment of past injuries and recovery status`}
              />

              <PerformanceBar
                value={horse.performance.ageAndWeight}
                label="Age & Weight"
                description={`Optimal condition considering ${horse.name}'s age and weight`}
              />
            </div>

            <motion.button
              onClick={() => {
                setIsFlipped(false)
                // Add a small delay before allowing the card to be flipped again
                setTimeout(() => {
                  setIsFlipped(false)
                }, 300)
              }}
              className="w-full py-3 text-base font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2 justify-center border rounded-full hover:shadow-md transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Overview
              <ArrowLeft size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
