"use client"

import { useState, useMemo, useCallback } from "react"
import { ChevronDown, ChevronUp, ChevronRight, GamepadIcon } from "lucide-react"
import type { Horse } from "@/types/horse"
import { useRouter } from "next/navigation"
import VerticalHorseCard from "@/components/vertical-horse-card"

interface HorseRankingBarProps {
  horses: Horse[]
}

const silkPatterns = ["stripes", "stars", "solid", "checkered", "diamonds", "polkadots", "triangles", "zigzag"]
const themeColors = [
  "#DDAD69",
  "#FFFFFF",
  "#183531",
  "#FF0000",
  "#0000FF",
  "#FFA500",
  "#FFFF00",
  "#FFC0CB",
  "#800080",
  "#A52A2A",
]

function SilkPlaceholder({
  pattern,
  primaryColor,
  secondaryColor,
}: {
  pattern: string
  primaryColor: string
  secondaryColor: string
}) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
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
        <div className="w-full h-full flex items-center justify-center" style={{ color: secondaryColor }}>
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
              className="absolute w-2 h-2 rounded-full"
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

// Separate modal component to avoid rendering issues
function PredictModal({ onGoPredict, onMaybeLater }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#DDAD69] rounded-full flex items-center justify-center mx-auto mb-4">
            <GamepadIcon size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Do You Know Your Horses?</h3>
          <p className="text-gray-600 mb-6">
            Test your horse racing knowledge by predicting race outcomes. Earn points for correct predictions and climb
            the leaderboard to prove your expertise!
          </p>
          <div className="space-y-3">
            <button
              onClick={onGoPredict}
              className="w-full py-3 bg-[#DDAD69] text-white rounded-md hover:bg-[#C59C5F] transition-colors font-semibold"
            >
              Go Predict
            </button>
            <button
              onClick={onMaybeLater}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HorseRankingBar({ horses }: HorseRankingBarProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null)
  const [showPredictModal, setShowPredictModal] = useState(false)
  const router = useRouter()

  const horseSilks = useMemo(() => {
    return horses.map((horse) => {
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
    })
  }, [horses])

  const handlePredict = useCallback(() => {
    // Check if user has seen the predict modal before
    const hasSeenPredictModal = localStorage.getItem("hasSeenPredictModal") === "true"

    if (!hasSeenPredictModal) {
      setShowPredictModal(true)
    } else {
      navigateToPredictor()
    }
  }, [])

  const navigateToPredictor = useCallback(() => {
    // Get the current URL search params
    const currentParams = new URLSearchParams(window.location.search)

    // Build the query string with all current parameters
    const queryString = currentParams.toString()

    // Navigate to predictor with the same parameters
    router.push(`/predictor?${queryString}`)
  }, [router])

  const handleGoPredict = useCallback(() => {
    localStorage.setItem("hasSeenPredictModal", "true")
    setShowPredictModal(false)
    navigateToPredictor()
  }, [navigateToPredictor])

  const handleMaybeLater = useCallback(() => {
    localStorage.setItem("hasSeenPredictModal", "true")
    setShowPredictModal(false)
  }, [])

  const handleHorseClick = useCallback(
    (horse: Horse) => {
      setSelectedHorse(selectedHorse?.id === horse.id ? null : horse)
    },
    [selectedHorse],
  )

  return (
    <div className="bg-white rounded-xl p-6 mb-8 border-2 border-[#DDAD69] shadow-lg w-full max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Horse Rankings</h2>
      <p className="text-sm text-gray-600 mb-4">Tap on a horse to view detailed insights</p>
      <div className="space-y-3 w-full">
        {horses.slice(0, expanded ? horses.length : 3).map((horse, index) => (
          <div key={horse.id} className="bg-gray-100 p-3 rounded-lg w-full">
            <div
              className="flex items-center justify-between w-full cursor-pointer"
              onClick={() => handleHorseClick(horse)}
            >
              <div className="flex items-center min-w-0 max-w-[70%]">
                <SilkPlaceholder
                  pattern={horseSilks[index].pattern}
                  primaryColor={horseSilks[index].primaryColor}
                  secondaryColor={horseSilks[index].secondaryColor}
                />
                <span className="font-semibold text-gray-700 ml-3 hover:text-[#DDAD69] transition-colors truncate">
                  {index + 1}. {horse.name}
                </span>
              </div>
              <div className="flex items-center ml-2">
                <div
                  className="bg-[#DDAD69] rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 mr-2 flex-shrink-0"
                  title="Horse score"
                >
                  <span className="text-white font-bold text-lg">{horse.score}</span>
                </div>
                <ChevronRight
                  size={20}
                  className={`text-gray-400 transition-transform flex-shrink-0 ${
                    selectedHorse?.id === horse.id ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>
            {selectedHorse?.id === horse.id && (
              <div className="mt-4">
                <VerticalHorseCard horse={horse} rank={index + 1} />
              </div>
            )}
          </div>
        ))}
      </div>
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
      <div className="mt-6">
        <button
          onClick={handlePredict}
          className="w-full py-3 bg-[#183531] text-white rounded-md hover:bg-[#122724] transition-colors font-semibold hover:bg-opacity-90 active:bg-opacity-100 flex items-center justify-center"
        >
          <GamepadIcon className="mr-2" size={20} />
          Predict
        </button>
      </div>

      {/* Predict Modal */}
      {showPredictModal && <PredictModal onGoPredict={handleGoPredict} onMaybeLater={handleMaybeLater} />}
    </div>
  )
}
