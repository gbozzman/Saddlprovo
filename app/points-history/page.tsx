"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Trophy, Clock, AlertCircle, Award, Calendar, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"

interface PredictionEntry {
  id: number
  date: string
  track: string
  estimatedPoints: number
  horses: string[]
  raceTime: string
  raceDate: string
  isBeatThePro: boolean
  actualPoints?: number
}

export default function PointsHistoryPage() {
  const router = useRouter()
  const [predictions, setPredictions] = useState<PredictionEntry[]>([])
  const [monthlyPoints, setMonthlyPoints] = useState(0)
  const [lifetimePoints, setLifetimePoints] = useState(0)

  useEffect(() => {
    // Load prediction history
    const history = JSON.parse(localStorage.getItem("predictionHistory") || "[]")

    // Add some random actual points for demonstration
    const historyWithPoints = history.map((entry: PredictionEntry) => {
      // If entry is older than 1 day, give it actual points
      const predictionDate = new Date(entry.date)
      const now = new Date()
      const dayDiff = Math.floor((now.getTime() - predictionDate.getTime()) / (1000 * 3600 * 24))

      if (dayDiff >= 1) {
        const randomFactor = Math.random() * 0.5 + 0.5 // Between 0.5 and 1
        const actualPoints = Math.floor(entry.estimatedPoints * randomFactor)
        return { ...entry, actualPoints }
      }

      return entry
    })

    setPredictions(historyWithPoints.reverse()) // Show newest first

    // Calculate monthly, lifetime points
    const now = new Date()
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000)

    let monthly = 0
    let lifetime = 0

    historyWithPoints.forEach((entry: PredictionEntry) => {
      if (entry.actualPoints) {
        const entryDate = new Date(entry.date)

        lifetime += entry.actualPoints

        if (entryDate >= oneMonthAgo) {
          monthly += entry.actualPoints
        }
      }
    })

    setMonthlyPoints(monthly)

    // Get existing total points
    const userPoints = Number(localStorage.getItem("userPoints") || "0")
    setLifetimePoints(userPoints > lifetime ? userPoints : lifetime)
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate days left in the month
  const getDaysLeftInMonth = () => {
    const now = new Date()
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return lastDay.getDate() - now.getDate()
  }

  return (
    <main className="flex flex-col items-center w-full min-h-screen px-4 py-6 pb-20 overflow-y-auto bg-gradient-to-b from-[#183531] to-[#0D1E1C]">
      <div className="w-full max-w-lg">
        <Logo />
        <div className="flex items-center justify-between mt-6 mb-8">
          <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-[#DDAD69] text-center">Points History</h1>
          <div className="w-8"></div>
        </div>

        {/* Score Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Monthly Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#DDAD69] to-[#B78E3C] rounded-xl p-6 shadow-lg text-white relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full"></div>

            <div className="flex items-start justify-between z-10 relative">
              <div>
                <h2 className="font-bold text-2xl flex items-center mb-1">
                  <Trophy className="mr-2" size={24} />
                  Monthly Score
                </h2>
                <p className="text-white/80 text-sm mb-2">Resets in {getDaysLeftInMonth()} days</p>
                <p className="text-5xl font-bold">{monthlyPoints}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2">
                <Trophy className="text-white" size={24} />
              </div>
            </div>
            <p className="text-white/90 text-sm mt-2 bg-black/20 p-2 rounded inline-block">
              This score appears on the monthly leaderboard!
            </p>
          </motion.div>

          {/* Lifetime Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 rounded-xl p-4 shadow-lg border border-[#DDAD69]/30"
          >
            <h2 className="font-bold text-xl flex items-center mb-1 text-white">
              <Award className="mr-2 text-[#DDAD69]" size={20} />
              Lifetime Score
            </h2>
            <p className="text-3xl font-bold text-[#DDAD69]">{lifetimePoints}</p>
          </motion.div>
        </div>

        {/* Leaderboard Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => router.push("/leaderboard")}
          className="w-full bg-[#DDAD69] text-[#183531] py-4 px-6 rounded-xl font-semibold hover:bg-[#B78E3C] transition-colors mb-8 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center">
            <Trophy className="mr-2" size={24} />
            <span className="text-xl">View Leaderboard</span>
          </div>
          <ChevronRight size={24} />
        </motion.button>

        {/* Information Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-[#DDAD69]/20 to-[#B78E3C]/20 p-4 rounded-xl shadow-lg mb-8 border border-[#DDAD69]/30"
        >
          <div className="flex items-start">
            <AlertCircle className="text-[#DDAD69] mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-white mb-1">How Points Work</h3>
              <ul className="text-white/80 text-sm space-y-1 list-disc pl-4">
                <li>Points are awarded after races are completed</li>
                <li>Monthly scores reset at the end of each month</li>
                <li>The player with the highest monthly score wins a prize</li>
                <li>Beat the Pro challenges offer bonus point opportunities</li>
                <li>Achievement badges can unlock special point multipliers</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Prediction History */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Calendar className="mr-2 text-[#DDAD69]" size={24} />
            Recent Predictions
          </h2>

          {predictions.length === 0 ? (
            <p className="text-gray-600 text-center py-6">
              You haven't made any predictions yet. Visit the Predictor page to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`border-b border-gray-200 last:border-b-0 pb-4 ${
                    prediction.isBeatThePro ? "bg-yellow-50 p-3 rounded-lg -mx-2" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-800">{prediction.track}</h3>
                        {prediction.isBeatThePro && (
                          <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                            Beat the Pro
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {prediction.raceDate} at {prediction.raceTime}
                      </p>
                    </div>
                    <div className="text-right">
                      {prediction.actualPoints !== undefined ? (
                        <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-semibold">
                          +{prediction.actualPoints} pts
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock size={14} className="mr-1" />
                          <span>Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
