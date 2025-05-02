"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon, ClockIcon, FlagIcon, InfoIcon, XIcon, Trophy } from "lucide-react"

interface RaceSummaryProps {
  track: string
  raceClass: string
  date: string
  time: string
  summary: string
  averageScore: number
  lowestScore: number
  highestScore: number
}

export function RaceSummary({
  track,
  raceClass,
  date,
  time,
  summary,
  averageScore,
  lowestScore,
  highestScore,
}: RaceSummaryProps) {
  const [isExpanded] = useState(true)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setTooltipVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible)
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-8 border-2 border-[#DDAD69] shadow-lg">
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-[#DDAD69]" />
          <h2 className="text-2xl font-bold text-gray-900">Race Summary</h2>
        </div>
      </div>
      {/* Always show content, no condition */}
      <div className="space-y-4 mb-6">
        <p className="flex items-center text-gray-700">
          <FlagIcon className="w-6 h-6 mr-3 text-[#DDAD69]" />
          <span className="font-semibold mr-2">Track:</span>
          <span>
            {track} {raceClass !== "Unknown" ? `(${raceClass})` : ""}
          </span>
        </p>
        <p className="flex items-center text-gray-700">
          <CalendarIcon className="w-6 h-6 mr-3 text-[#DDAD69]" />
          <span className="font-semibold mr-2">Date:</span>
          <span>{date}</span>
        </p>
        <p className="flex items-center text-gray-700">
          <ClockIcon className="w-6 h-6 mr-3 text-[#DDAD69]" />
          <span className="font-semibold mr-2">Time:</span>
          <span>{time}</span>
        </p>
      </div>
      {averageScore > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2 relative">
            <p className="text-sm font-semibold text-gray-600 mr-2">
              SaddlePro Confidence Score (SCS): {(averageScore / 10).toFixed(1)}/10
            </p>
            <button
              ref={buttonRef}
              onClick={toggleTooltip}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DDAD69] rounded-full p-1"
              aria-label="SCS Information"
            >
              <InfoIcon size={16} />
            </button>
            {tooltipVisible && (
              <div
                ref={tooltipRef}
                className="absolute left-0 top-full mt-2 bg-white p-4 rounded-md shadow-md text-sm text-gray-700 border border-gray-200 max-w-xs z-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">SaddlePro Confidence Score (SCS)</h3>
                  <button
                    onClick={() => setTooltipVisible(false)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Close tooltip"
                  >
                    <XIcon size={16} />
                  </button>
                </div>
                <p className="mb-2">
                  The SCS combines Race Strength (quality of the field) and Race Confidence (predictability of outcome)
                  to help assess betting potential.
                </p>
                <p>A higher score means a stronger, more reliable race with better betting opportunities.</p>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[#DDAD69] h-2.5 rounded-full" style={{ width: `${(averageScore / 100) * 100}%` }}></div>
          </div>
          {lowestScore > 0 && highestScore > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Horse Range: <span className="text-orange-500 font-semibold">{lowestScore}</span> to{" "}
              <span className="text-green-500 font-semibold">{highestScore}</span>
            </p>
          )}
        </div>
      )}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700 leading-relaxed">{summary}</p>
      </div>
    </div>
  )
}
