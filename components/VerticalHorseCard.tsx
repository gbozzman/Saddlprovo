"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ArrowLeft, Star, Award, Target, TrendingUp, Cloud, Activity, Scale } from "lucide-react"
import type { Horse } from "@/types/horse"
import { format } from "date-fns"
import Image from "next/image"

interface VerticalHorseCardProps {
  horse: Horse
  rank: number
}

const PerformanceBar = ({
  value,
  label,
  description,
  icon,
}: { value: number; label: string; description?: string; icon?: React.ReactNode }) => (
  <div className="mb-5">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center">
        {icon}
        <span className="text-sm font-semibold text-gray-900 ml-2">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">{value}/100</span>
    </div>
    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5 }}
        className="performance-bar absolute top-0 left-0 h-full rounded-full"
      />
    </div>
    {description && <p className="text-xs text-gray-700 mt-1">{description}</p>}
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

export function VerticalHorseCard({ horse, rank }: VerticalHorseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Performance metric icons
  const metricIcons = {
    winRate: <Target className="w-4 h-4 text-gray-700" />,
    jockeyPerformance: <Award className="w-4 h-4 text-gray-700" />,
    trainerForm: <TrendingUp className="w-4 h-4 text-gray-700" />,
    groundDurability: <Cloud className="w-4 h-4 text-gray-700" />,
    injuryHistory: <Activity className="w-4 h-4 text-gray-700" />,
    ageAndWeight: <Scale className="w-4 h-4 text-gray-700" />,
  }

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
    return <div className="text-gray-900">No horse data available.</div>
  }

  // Get jersey image based on horse ID
  const jerseyNumber = (Number.parseInt(horse.id.replace(/\D/g, "")) % 6) + 1
  const jerseyImage =
    jerseyNumber <= 3 ? `/images/jerseys/jocko${jerseyNumber}.png` : `/images/jerseys/jock${jerseyNumber - 3}.png`

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
          className={`w-full premium-card p-6 ${!isFlipped ? "relative" : "absolute"} backface-hidden`}
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
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  <Image
                    src={jerseyImage || "/placeholder.svg"}
                    alt={`${horse.name}'s jersey`}
                    width={40}
                    height={40}
                    className="object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.parentElement!.style.backgroundColor = "#0000FF"
                      target.parentElement!.innerHTML = `<span class="text-white font-bold">${horse.id.charAt(0)}</span>`
                    }}
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 premium-heading">{horse.name}</h2>
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full text-white ${
                    rankColors[rank as keyof typeof rankColors] || "bg-gray-500"
                  }`}
                >
                  {getRankLabel(rank)}
                </span>
              </div>
              <p className="text-sm text-gray-800 premium-subheading">Jockey: {horse.jockey}</p>
              <p className="text-sm text-gray-800 premium-subheading">Trainer: {horse.trainer}</p>
              <p className="text-sm text-gray-800 premium-subheading">Form: {horse.form}</p>
            </div>
            <div className="flex flex-col items-center ml-2">
              <div className="w-16 h-16 gold-badge-3d rounded-full flex items-center justify-center shadow-lg mb-1 relative">
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
              <span className="text-xs font-medium text-gray-800">Score</span>
            </div>
          </div>
          <div className="mb-6">
            {horse.performance && (
              <>
                <PerformanceBar value={horse.performance.winRate} label="Win Rate" icon={metricIcons.winRate} />
                <PerformanceBar
                  value={horse.performance.jockeyPerformance}
                  label="Jockey Performance"
                  icon={metricIcons.jockeyPerformance}
                />
                <PerformanceBar
                  value={horse.performance.trainerForm}
                  label="Trainer Form"
                  icon={metricIcons.trainerForm}
                />
                <PerformanceBar
                  value={horse.performance.groundDurability}
                  label="Ground Durability"
                  icon={metricIcons.groundDurability}
                />
                <PerformanceBar
                  value={horse.performance.injuryHistory}
                  label="Injury History"
                  icon={metricIcons.injuryHistory}
                />
                <PerformanceBar
                  value={horse.performance.ageAndWeight}
                  label="Age & Weight"
                  icon={metricIcons.ageAndWeight}
                />
              </>
            )}
          </div>

          <p
            className="text-sm text-gray-800 mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: personalizedInsight }}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFlipped(true)}
            className="w-full py-3 text-base font-medium text-gray-800 hover:text-gray-900 flex items-center gap-2 justify-center border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 premium-subheading"
          >
            More Analytics
            <RefreshCw size={18} />
          </motion.button>
        </div>

        {/* Back of card */}
        <div
          className={`w-full premium-card p-6 ${isFlipped ? "relative" : "absolute"} backface-hidden`}
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
          }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 premium-heading">Performance Analysis</h2>

              <PerformanceBar
                value={horse.performance.winRate}
                label="Win Rate"
                description={`${horse.performance.winRate}% win rate in recent races`}
                icon={metricIcons.winRate}
              />

              <PerformanceBar
                value={horse.performance.jockeyPerformance}
                label="Jockey Performance"
                description={`${horse.jockey}'s recent performance and synergy with ${horse.name}`}
                icon={metricIcons.jockeyPerformance}
              />

              <PerformanceBar
                value={horse.performance.trainerForm}
                label="Trainer Form"
                description={`${horse.trainer}'s success rate and training strategies`}
                icon={metricIcons.trainerForm}
              />

              <PerformanceBar
                value={horse.performance.groundDurability}
                label="Ground Durability"
                description={`${horse.name}'s adaptability to various track conditions`}
                icon={metricIcons.groundDurability}
              />

              <PerformanceBar
                value={horse.performance.injuryHistory}
                label="Injury History"
                description={`Assessment of past injuries and recovery status`}
                icon={metricIcons.injuryHistory}
              />

              <PerformanceBar
                value={horse.performance.ageAndWeight}
                label="Age & Weight"
                description={`Optimal condition considering ${horse.name}'s age and weight`}
                icon={metricIcons.ageAndWeight}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsFlipped(false)
                // Add a small delay before allowing the card to be flipped again
                setTimeout(() => {
                  setIsFlipped(false)
                }, 300)
              }}
              className="w-full py-3 text-base font-medium text-gray-800 hover:text-gray-900 flex items-center gap-2 justify-center border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 hover:bg-gray-50 active:bg-gray-100 mt-6 premium-subheading"
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
