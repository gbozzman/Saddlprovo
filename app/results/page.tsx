"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { fetchRaceDetails, fetchRaceRunners } from "@/services/raceService"
import type { LiveRace, LiveRaceRunner } from "@/lib/supabase"
import { HorseRankingBar } from "@/app/components/HorseRankingBar"
import { DraggableHorseList } from "@/components/DraggableHorseList"
import { RaceSummary } from "@/components/RaceSummary"
import { BottomNavBar } from "@/components/BottomNavBar"
import { ChevronLeft, AlertCircle, Filter, SortDesc, SortAsc, Award, Layers, Trophy } from "lucide-react"
import Logo from "@/components/logo"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const courseId = searchParams.get("course") || ""
  const date = searchParams.get("date") || ""
  const time = searchParams.get("time") || ""

  const [race, setRace] = useState<LiveRace | null>(null)
  const [runners, setRunners] = useState<LiveRaceRunner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHorse, setSelectedHorse] = useState<LiveRaceRunner | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterLabel, setFilterLabel] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"ranking" | "prediction">("ranking")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  // Mock user ID - in a real app, this would come from authentication
  const userId = "user123"

  useEffect(() => {
    const loadRaceData = async () => {
      if (!courseId || !date || !time) {
        setError("Missing race parameters")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch race details
        const raceData = await fetchRaceDetails(courseId, date, time)
        if (!raceData) {
          throw new Error("Race not found")
        }
        setRace(raceData)

        // Fetch runners for this race
        console.log("Fetching runners for race ID:", raceData.race_id)
        const runnersData = await fetchRaceRunners(raceData.race_id)

        if (!runnersData || runnersData.length === 0) {
          console.warn("No runners found for this race, using mock data")
          // If no runners found, we'll use mock data (handled in fetchRaceRunners)
        }

        setRunners(runnersData)

        // Select the top horse by default
        if (runnersData.length > 0) {
          setSelectedHorse(runnersData[0])
        }
      } catch (err: any) {
        console.error("Failed to load race data:", err)
        setError(err?.message || "Failed to load race data")
      } finally {
        setIsLoading(false)
      }
    }

    loadRaceData()
  }, [courseId, date, time])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilterDropdown) {
        setShowFilterDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showFilterDropdown])

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  const handleFilterChange = (label: string | null) => {
    setFilterLabel(label)
    setShowFilterDropdown(false)
  }

  const handleSubmitPrediction = async (predictedHorses: LiveRaceRunner[]) => {
    if (!race) return

    try {
      // In a real app, you would save the prediction to your database
      console.log(
        "Prediction submitted:",
        predictedHorses.map((h) => h.horse_name),
      )

      // Show success message or redirect
    } catch (err) {
      console.error("Failed to save prediction:", err)
    }
  }

  const filteredRunners = filterLabel ? runners.filter((runner) => runner.label === filterLabel) : runners

  const sortedRunners = [...filteredRunners].sort((a, b) => {
    return sortOrder === "desc" ? b.normalized_score - a.normalized_score : a.normalized_score - b.normalized_score
  })

  const getFilterOptions = () => {
    const labels = new Set(runners.map((runner) => runner.label))
    return Array.from(labels)
  }

  // Calculate average, lowest, and highest scores
  const averageScore =
    runners.length > 0 ? runners.reduce((sum, runner) => sum + runner.normalized_score, 0) / runners.length : 0

  const lowestScore = runners.length > 0 ? Math.min(...runners.map((runner) => runner.normalized_score)) : 0

  const highestScore = runners.length > 0 ? Math.max(...runners.map((runner) => runner.normalized_score)) : 0

  // Get the top horse name
  const topHorseName =
    runners.length > 0 ? runners.sort((a, b) => b.normalized_score - a.normalized_score)[0].horse_name : "Top contender"

  return (
    <main className="flex flex-col min-h-screen bg-[#183531] pb-20">
      <div className="w-full max-w-2xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="text-white hover:text-[#DDAD69] transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-grow flex justify-center">
            <Logo />
          </div>
          <div className="w-6"></div> {/* Empty div for balance */}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-md mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading race data</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#DDAD69] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading race data...</p>
          </div>
        ) : (
          <>
            {/* Race Summary */}
            {race && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <RaceSummary
                  track={race.course || "Unknown"}
                  raceClass={race.race_class || "Unknown"}
                  date={date || "Not specified"}
                  time={time || "Not specified"}
                  summary=""
                  averageScore={averageScore}
                  lowestScore={lowestScore}
                  highestScore={highestScore}
                  topHorseName={topHorseName}
                />
              </motion.div>
            )}

            {/* View mode toggle */}
            <div className="flex mb-4 bg-[#1d403c] rounded-lg p-1">
              <button
                onClick={() => setViewMode("ranking")}
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                  viewMode === "ranking" ? "bg-[#DDAD69] text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                <Layers size={16} />
                SaddlePro Ranking
              </button>
              <button
                onClick={() => setViewMode("prediction")}
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors ${
                  viewMode === "prediction" ? "bg-[#DDAD69] text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                <Trophy size={16} />
                Your Prediction
              </button>
            </div>

            {/* Controls - only show in ranking mode */}
            {viewMode === "ranking" && runners.length > 0 && (
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={handleSortToggle}
                    className="flex items-center bg-[#1d403c] text-white px-3 py-2 rounded-md text-sm hover:bg-[#2a5751] transition-colors"
                  >
                    {sortOrder === "desc" ? (
                      <>
                        <SortDesc size={16} className="mr-1" /> Highest First
                      </>
                    ) : (
                      <>
                        <SortAsc size={16} className="mr-1" /> Lowest First
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center bg-[#1d403c] text-white px-3 py-2 rounded-md text-sm hover:bg-[#2a5751] transition-colors"
                  >
                    <Filter size={16} className="mr-1" />
                    {filterLabel ? filterLabel.split(" ")[0] : "All Horses"}
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 w-48 overflow-hidden">
                      <button
                        onClick={() => handleFilterChange(null)}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          !filterLabel ? "bg-[#DDAD69] text-white" : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        All Horses
                      </button>
                      {getFilterOptions().map((label) => (
                        <button
                          key={label}
                          onClick={() => handleFilterChange(label)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            filterLabel === label ? "bg-[#DDAD69] text-white" : "text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Horse list */}
            {runners.length > 0 ? (
              <div className="space-y-4">
                {viewMode === "ranking" ? (
                  <HorseRankingBar horses={sortedRunners} />
                ) : (
                  <DraggableHorseList horses={sortedRunners} onSubmitPrediction={handleSubmitPrediction} />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <Award className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Horses Available</h3>
                  <p className="text-gray-500">
                    There are no horses to display for this race. Please try selecting a different race.
                  </p>
                  <button
                    onClick={() => router.push("/search")}
                    className="mt-6 px-4 py-2 bg-[#DDAD69] text-white rounded-md hover:bg-[#C59C5F] transition-colors"
                  >
                    Back to Search
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNavBar />
    </main>
  )
}
