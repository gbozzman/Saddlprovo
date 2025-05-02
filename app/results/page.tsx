"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { RefreshCw, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { mockRaces } from "@/data/mock-races"
import type { Horse } from "@/types/horse"
import Logo from "@/components/logo"
import { RaceSummary } from "@/components/RaceSummary"
import { HorseRankingBar } from "@/app/components/HorseRankingBar"
import { Suspense } from "react"

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [horses, setHorses] = useState<Horse[]>([])
  const [isExiting, setIsExiting] = useState(false)
  const [isRaceSummaryExpanded, setIsRaceSummaryExpanded] = useState(false)

  const searchQuery = searchParams.get("horse") || ""
  const selectedRace = searchParams.get("race") || ""
  const selectedDate = searchParams.get("date") || ""
  const selectedTime = searchParams.get("time") || ""

  useEffect(() => {
    let filteredHorses: Horse[] = []

    if (selectedRace) {
      const raceData = mockRaces.find((race) => race.name.toLowerCase() === selectedRace.toLowerCase())
      if (raceData) {
        filteredHorses = [...raceData.horses]
      }
    } else {
      filteredHorses = mockRaces.flatMap((race) => race.horses)
    }

    if (searchQuery) {
      filteredHorses = filteredHorses.filter((horse) => horse.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    const sortedHorses = filteredHorses.sort((a, b) => b.score - a.score)
    setHorses(sortedHorses)
  }, [searchQuery, selectedRace])

  const handleReset = () => {
    setIsExiting(true)
    setTimeout(() => {
      router.push("/")
    }, 300)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const getRaceClass = (raceName: string) => {
    const raceClasses: { [key: string]: string } = {
      Newcastle: "Class 5",
      Ascot: "Class 1",
      Cheltenham: "Class 2",
      Dundalk: "Class 3",
      Aintree: "Class 1",
    }
    return raceClasses[raceName] || "Unknown"
  }

  const summarizeScores = (horses: Horse[]) => {
    if (horses.length === 0) {
      return {
        summary: "No horses found for this race. Please adjust your search criteria.",
        averageScore: 0,
        lowestScore: 0,
        highestScore: 0,
      }
    }

    const totalHorses = horses.length
    const averageScore = horses.reduce((sum, horse) => sum + horse.score, 0) / totalHorses
    const highestScore = Math.max(...horses.map((horse) => horse.score))
    const lowestScore = Math.min(...horses.map((horse) => horse.score))
    const topContender = horses[0]

    const competitionLevel =
      averageScore > 85 ? "highly competitive" : averageScore > 75 ? "competitive" : "varied in quality"
    const scoreRange = highestScore - lowestScore
    const rangeDescription = scoreRange > 20 ? "wide range" : scoreRange > 10 ? "moderate range" : "narrow range"

    return {
      summary: `This ${competitionLevel} race features ${totalHorses} horses with an average score of ${averageScore.toFixed(1)}. 
The field shows a ${rangeDescription} of abilities, with scores spanning from ${lowestScore} to an impressive ${highestScore}. 
${topContender.name} leads the field with a remarkable score of ${topContender.score}, making it the top pick for this race. 
Spectators can expect ${scoreRange > 15 ? "an unpredictable and exciting" : "a closely matched"} contest, 
with ${averageScore > 80 ? "several strong contenders vying for the top spot" : "a mix of experienced runners and potential underdogs"}.`,
      averageScore,
      lowestScore,
      highestScore,
    }
  }

  const { summary, averageScore, lowestScore, highestScore } = summarizeScores(horses)
  const showRaceSummary = selectedRace !== "" // Only show race summary when a race is selected

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-[#183531] pb-20">
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: isExiting ? 0 : 1 }} transition={{ duration: 0.3 }}>
        <div className="w-full max-w-2xl px-4 py-6 pb-16">
          <Logo />

          <div className="mt-8 space-y-8">
            {/* Race Summary - only shown when a race is selected */}
            {showRaceSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-lg mb-8"
              >
                <RaceSummary
                  track={selectedRace || "All Tracks"}
                  raceClass={getRaceClass(selectedRace)}
                  date={formatDate(selectedDate)}
                  time={selectedTime || "Not specified"}
                  summary={summary}
                  averageScore={averageScore}
                  lowestScore={lowestScore}
                  highestScore={highestScore}
                />
              </motion.div>
            )}

            <HorseRankingBar horses={horses} />
          </div>

          {horses.length === 0 && (
            <div className="text-center text-white py-8">No results found. Try adjusting your search criteria.</div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: horses.length * 0.1 }}
          >
            <button
              onClick={handleReset}
              className="w-full py-3 mt-6 mb-2 bg-[#DDAD69] text-white rounded-xl hover:bg-[#C59C5F] transition-colors text-base font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Back to Search
            </button>
          </motion.div>
        </div>
      </motion.div>
      <div className="w-full max-w-2xl px-4 mt-8 mb-4">
        <p className="text-sm text-gray-400 text-center">
          This information is accurate as of {new Date().toLocaleString()}. Horse withdrawals and lineup changes may
          occur after this time.
        </p>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin h-8 w-8 text-[#DDAD69]" />}>
      <ResultsContent />
    </Suspense>
  )
}
