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
  topHorseName?: string
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
  topHorseName = "Top contender",
}: RaceSummaryProps) {
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

  // Format date to dd-mm-yyyy
  const formatDate = (dateString: string) => {
    if (dateString === "Not specified") return dateString

    try {
      // Check if date is already in dd-mm-yyyy format
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) return dateString

      // Parse the date string
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString

      // Format as dd-mm-yyyy
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()

      return `${day}-${month}-${year}`
    } catch (e) {
      return dateString
    }
  }

  // Format time to show AM/PM
  const formatTime = (timeString: string) => {
    if (timeString === "Not specified") return timeString

    try {
      // Check if time is in HH:MM format
      if (!/^\d{1,2}:\d{2}$/.test(timeString)) return timeString

      const [hours, minutes] = timeString.split(":").map(Number)
      const period = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12

      return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
    } catch (e) {
      return timeString
    }
  }

  // Generate a summary if one isn't provided
  const generatedSummary =
    summary ||
    `This ${averageScore > 85 ? "highly competitive" : averageScore > 75 ? "competitive" : "varied"} race features horses with an average score of ${averageScore.toFixed(1)}. 
The field shows a ${highestScore - lowestScore > 20 ? "wide" : highestScore - lowestScore > 10 ? "moderate" : "narrow"} range of abilities, with scores spanning from ${lowestScore} to an impressive ${highestScore}. 
${topHorseName} leads the field with a remarkable score of ${highestScore}, making it the top pick for this race. 
Spectators can expect ${highestScore - lowestScore > 15 ? "an unpredictable and exciting" : "a closely matched"} contest, 
with ${averageScore > 80 ? "several strong contenders vying for the top spot" : "a mix of experienced runners and potential underdogs"}.`

  return (
    <div className="bg-white rounded-xl p-6 border border-[#DDAD69]/30 shadow-md">
      <div className="flex items-center mb-6">
        <Trophy className="w-6 h-6 mr-3 text-[#DDAD69]" />
        <h2 className="text-2xl font-bold text-gray-900">Race Summary</h2>
      </div>

      <div className="space-y-4 mb-6">
        <p className="flex items-center text-gray-700">
          <FlagIcon className="w-5 h-5 mr-3 text-[#DDAD69]" />
          <span className="font-semibold mr-2">Track:</span>
          <span>
            {track} {raceClass !== "Unknown" ? `(${raceClass})` : ""}
          </span>
        </p>
        <p className="flex items-center text-gray-700">
          <CalendarIcon className="w-5 h-5 mr-3 text-[#DDAD69]" />
          <span className="font-semibold mr-2">Date:</span>
          <span>{formatDate(date)}</span>
        </p>
        <p className="flex items-center text-gray-700">
          <ClockIcon className="w-5 h-5 mr-3 text-[#DDAD69]" />
          <span className="font-semibold mr-2">Time:</span>
          <span>{formatTime(time)}</span>
        </p>
      </div>

      {averageScore > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2 relative">
            <p className="text-sm font-semibold text-gray-700 mr-2">
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
            <p className="mt-2 text-sm text-gray-700">
              Horse Range: <span className="text-orange-500 font-semibold">{lowestScore}</span> to{" "}
              <span className="text-green-500 font-semibold">{highestScore}</span>
            </p>
          )}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700 leading-relaxed">{generatedSummary}</p>
      </div>
    </div>
  )
}
