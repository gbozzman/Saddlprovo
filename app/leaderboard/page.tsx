"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trophy, Medal, Users, Info, Award, HelpCircle, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"

interface LeaderboardEntry {
  username: string
  points: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  { username: "HorseWhisperer", points: 15000 },
  { username: "LuckyCharm", points: 14500 },
  { username: "GallopGuru", points: 14000 },
  { username: "TurfTitan", points: 13500 },
  { username: "DerbyDreamer", points: 13000 },
  { username: "StableGenius", points: 12500 },
  { username: "RacingRoyalty", points: 12000 },
  { username: "HoofHero", points: 11500 },
  { username: "JockeyJedi", points: 11000 },
  { username: "PonyProphet", points: 10500 },
  { username: "SaddleSage", points: 10000 },
  { username: "TrackStar", points: 9500 },
  { username: "EquineExpert", points: 9000 },
  { username: "BetMaster", points: 8500 },
  { username: "ReinRider", points: 8000 },
  { username: "TrotTrend", points: 7500 },
  { username: "GallopGambler", points: 7000 },
  { username: "NaySayer", points: 6500 },
  { username: "FrontRunner", points: 6000 },
  { username: "PhotoFinish", points: 5500 },
]

// Mock races for Beat the Pro
const mockRaces = [
  { id: "race1", name: "Newcastle", time: "14:30", date: "2025-03-20" },
  { id: "race2", name: "Ascot", time: "15:15", date: "2025-03-21" },
  { id: "race3", name: "Cheltenham", time: "16:00", date: "2025-03-22" },
  { id: "race4", name: "Dundalk", time: "13:45", date: "2025-03-23" },
  { id: "race5", name: "Aintree", time: "17:30", date: "2025-03-24" },
]

export default function LeaderboardPage() {
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userData, setUserData] = useState<{ nickname: string; points: number }>({ nickname: "", points: 0 })
  const [userRank, setUserRank] = useState<number>(0)
  const [showRules, setShowRules] = useState(false)
  const [showBeatProModal, setShowBeatProModal] = useState(false)

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData") || "{}")
    setUserData({ nickname: storedUserData.nickname || "Anonymous", points: storedUserData.points || 14000 })

    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]")
    const combinedLeaderboard = [
      ...storedLeaderboard,
      ...mockLeaderboard,
      { username: storedUserData.nickname || "Anonymous", points: storedUserData.points || 14000 },
    ]
    combinedLeaderboard.sort((a, b) => b.points - a.points)

    // Remove duplicates
    const uniqueLeaderboard = combinedLeaderboard.filter(
      (entry, index, self) => index === self.findIndex((t) => t.username === entry.username),
    )

    setLeaderboard(uniqueLeaderboard)

    const rank = uniqueLeaderboard.findIndex((entry) => entry.username === storedUserData.nickname) + 1
    setUserRank(rank > 0 ? rank : 4) // Default to 4th if not found
  }, [])

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  const handleBeatThePro = () => {
    setShowBeatProModal(true)
  }

  const startBeatProChallenge = () => {
    // Select a random race
    const randomRace = mockRaces[Math.floor(Math.random() * mockRaces.length)]
    router.push(`/predictor?race=${randomRace.name}&date=${randomRace.date}&time=${randomRace.time}&special=beatthepro`)
  }

  return (
    <main className="flex flex-col items-center w-full min-h-screen px-4 py-6 pb-20 overflow-y-auto bg-gradient-to-b from-[#183531] to-[#0D1E1C]">
      <div className="w-full max-w-md">
        <Logo />
        <div className="flex items-center justify-between mt-6 mb-2">
          <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-[#DDAD69] text-center">Monthly Leaderboard</h1>
          <button
            onClick={() => setShowRules(!showRules)}
            className="text-white p-2 hover:text-[#DDAD69] transition-colors"
          >
            <Info size={24} />
          </button>
        </div>

        {/* Rules section */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm border border-[#DDAD69]/30"
            >
              <h2 className="text-lg font-bold text-[#DDAD69] mb-2 flex items-center">
                <HelpCircle size={20} className="mr-2" />
                Competition Rules
              </h2>
              <ul className="text-white/90 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">•</span>
                  <span>SaddlePro leaderboard is just for fun - no real gambling involved</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">•</span>
                  <span>Monthly scores reset on the last day of each month</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">•</span>
                  <span>The player with the highest monthly score wins a prize</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">•</span>
                  <span>Earn points by making accurate predictions in the Predictor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">•</span>
                  <span>Bonus points available in weekly "Beat the Pro" challenges</span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beat the Pro Button - Enhanced with more padding */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBeatThePro}
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white rounded-xl py-4 px-4 font-semibold shadow-lg flex items-center justify-center mb-12 relative overflow-hidden border-2 border-yellow-300 mt-8"
        >
          <div className="absolute inset-0 bg-yellow-300 opacity-20 animate-pulse"></div>
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full"></div>
          <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-white/10 rounded-full"></div>
          <div className="relative z-10 flex items-center">
            <Award className="mr-2" size={24} />
            <span className="text-xl">Beat the Pro Challenge</span>
            <div className="ml-2 bg-yellow-300 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <Zap size={12} className="mr-1" />
              WEEKLY
            </div>
          </div>
        </motion.button>

        {/* User Rank and Points Box */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 border-4 border-[#DDAD69] rounded-xl animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Trophy className="text-[#DDAD69] mr-2" size={24} />
                <h2 className="text-xl font-bold text-[#183531]">Your Ranking</h2>
              </div>
              <span className="text-3xl font-bold text-[#183531]">{getOrdinal(userRank)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#183531] text-sm mb-1">Nickname</p>
                <p className="text-[#183531] font-bold">{userData.nickname}</p>
              </div>
              <div className="text-right">
                <p className="text-[#183531] text-sm mb-1">Monthly Points</p>
                <p className="text-[#183531] font-bold">{userData.points.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trophy Room Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => router.push("/trophy-room")}
          className="w-full bg-[#DDAD69] text-[#183531] py-4 px-6 rounded-xl font-semibold hover:bg-[#B78E3C] transition-colors mt-6 mb-8 flex items-center justify-center border-4 border-[#B78E3C] shadow-lg"
        >
          <Trophy className="mr-2" size={20} />
          View Trophy Room
        </motion.button>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2" size={24} />
            Top Monthly Competitors
          </h2>
          {leaderboard.slice(0, 20).map((entry, index) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0 ${
                entry.username === userData.nickname ? "bg-[#DDAD69]/10 rounded-lg px-2" : ""
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-800 mr-4 w-8 text-right">{index + 1}</span>
                {index < 3 && (
                  <Medal
                    className={`mr-2 ${
                      index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-400" : "text-orange-400"
                    }`}
                    size={20}
                  />
                )}
                <span className="text-gray-600">{entry.username}</span>
              </div>
              <div className="flex items-center">
                <Trophy className="text-[#DDAD69] mr-2" size={16} />
                <span className="text-lg font-bold text-[#DDAD69]">{entry.points.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Beat the Pro Modal */}
      <AnimatePresence>
        {showBeatProModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
            onClick={() => setShowBeatProModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#183531] to-[#0D1E1C] p-6 rounded-xl max-w-md w-full text-center border-2 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-yellow-500 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">Beat the Pro Challenge</h2>
              <p className="text-white text-lg mb-4">Ready to test your skills against our experts?</p>
              <div className="bg-white/10 p-4 rounded-lg mb-6 text-left">
                <h3 className="text-yellow-400 font-semibold mb-2">This Week's Challenge:</h3>
                <ul className="text-white/90 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Predict the top 5 horses in a featured race</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Earn DOUBLE points for correct predictions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Beat our pro's score to earn a special badge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Challenge resets every Monday</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBeatProModal(false)}
                  className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startBeatProChallenge}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-semibold hover:from-yellow-400 hover:to-amber-500 transition-colors"
                >
                  Start Challenge
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
