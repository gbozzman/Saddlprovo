"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import {
  GamepadIcon,
  ArrowRight,
  Trophy,
  GripVertical,
  Twitter,
  Facebook,
  ExternalLink,
  Award,
  Zap,
  Sparkles,
  Clock,
  Info,
} from "lucide-react"
import Logo from "@/components/logo"
import { useRouter, useSearchParams } from "next/navigation"
import { mockRaces } from "@/data/mock-races"
import confetti from "canvas-confetti"

interface Horse {
  id: string
  name: string
  score: number
}

interface RaceSummary {
  track: string
  raceClass: string
  date: string
  time: string
}

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

export default function PredictorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [horses, setHorses] = useState<Horse[]>([])
  const [prediction, setPrediction] = useState<string | null>(null)
  const [userPoints, setUserPoints] = useState<number>(0)
  const [raceSummary, setRaceSummary] = useState<RaceSummary>({
    track: "Not specified",
    raceClass: "",
    date: "Not specified",
    time: "Not specified",
  })
  const [showSocialShare, setShowSocialShare] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [predictionSubmitted, setPredictionSubmitted] = useState(false)
  const [predictionStreak, setPredictionStreak] = useState(0)
  const [showBadgeEarned, setShowBadgeEarned] = useState(false)
  const [earnedBadge, setEarnedBadge] = useState({ name: "", icon: null })
  const [estimatedPoints, setEstimatedPoints] = useState(0)
  const [horseSilks, setHorseSilks] = useState<
    Array<{ pattern: string; primaryColor: string; secondaryColor: string }>
  >([])
  const [showScoringInfo, setShowScoringInfo] = useState(false)

  const getRaceClass = useCallback((raceName: string) => {
    const raceClasses: { [key: string]: string } = {
      Newcastle: "Class 5",
      Ascot: "Class 1",
      Cheltenham: "Class 2",
      Dundalk: "Class 3",
      Aintree: "Class 1",
    }
    return raceClasses[raceName] || ""
  }, [])

  const selectedRace = useMemo(() => searchParams.get("race") || "", [searchParams])
  const searchQuery = useMemo(() => searchParams.get("horse") || "", [searchParams])
  const selectedDate = useMemo(() => searchParams.get("date") || "Not specified", [searchParams])
  const selectedTime = useMemo(() => searchParams.get("time") || "Not specified", [searchParams])
  const isBeatThePro = useMemo(() => searchParams.get("special") === "beatthepro", [searchParams])

  const fetchRaceData = useCallback(() => {
    setIsLoading(true)
    let filteredHorses: Horse[] = []
    let raceClass = ""

    if (selectedRace) {
      const raceData = mockRaces.find((race) => race.name.toLowerCase() === selectedRace.toLowerCase())
      if (raceData) {
        filteredHorses = raceData.horses.map((horse) => ({
          id: horse.id,
          name: horse.name,
          score: horse.score,
        }))
        raceClass = getRaceClass(selectedRace)
      }
    } else {
      filteredHorses = mockRaces.flatMap((race) =>
        race.horses.map((horse) => ({
          id: horse.id,
          name: horse.name,
          score: horse.score,
        })),
      )
    }

    if (searchQuery) {
      filteredHorses = filteredHorses.filter((horse) => horse.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Sort horses by score in descending order
    filteredHorses.sort((a, b) => b.score - a.score)

    setHorses(filteredHorses)

    // Generate silks for each horse
    const silks = filteredHorses.map(() => {
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
    setHorseSilks(silks)

    setRaceSummary({
      track: selectedRace || "All Tracks",
      raceClass: raceClass,
      date: selectedDate,
      time: selectedTime,
    })
    setIsLoading(false)
  }, [selectedRace, searchQuery, selectedDate, selectedTime, getRaceClass])

  useEffect(() => {
    fetchRaceData()
  }, [fetchRaceData])

  useEffect(() => {
    const storedPoints = localStorage.getItem("userPoints")
    if (storedPoints) {
      setUserPoints(Number.parseInt(storedPoints))
    }

    const storedStreak = localStorage.getItem("predictionStreak")
    if (storedStreak) {
      setPredictionStreak(Number.parseInt(storedStreak))
    }
  }, [])

  const triggerConfetti = () => {
    setShowConfetti(true)

    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number): number {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        }),
      )
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        }),
      )
    }, 250)
  }

  const calculateEstimatedPoints = (predictedOrder: Horse[]): number => {
    // Updated point values: 10, 8, 5, 3, 1
    const pointsPerPosition = [10, 8, 5, 3, 1]
    return predictedOrder.slice(0, 5).reduce((points, horse, index) => {
      const correctPosition = horses.findIndex((h) => h.id === horse.id)
      if (correctPosition === index) {
        return points + pointsPerPosition[index]
      }
      return points
    }, 0)
  }

  const handlePredict = useCallback(() => {
    const estimatedPoints = calculateEstimatedPoints(horses)
    setEstimatedPoints(estimatedPoints)

    // Update prediction streak
    const newStreak = predictionStreak + 1
    setPredictionStreak(newStreak)
    localStorage.setItem("predictionStreak", newStreak.toString())

    setPrediction(
      isBeatThePro
        ? `Your Beat the Pro prediction has been submitted! You could earn up to ${estimatedPoints} points if your prediction is correct. Points will be awarded after the race is finished.`
        : `Your prediction has been submitted! You could earn up to ${estimatedPoints} points if your prediction is correct. Points will be awarded after the race is finished.`,
    )
    setShowSocialShare(true)
    setPredictionSubmitted(true)

    // Trigger confetti effect
    triggerConfetti()

    // Check if user earned a badge
    if (newStreak === 3) {
      setEarnedBadge({
        name: "Hot Streak",
        icon: <Zap className="text-yellow-400" size={24} />,
      })
      setShowBadgeEarned(true)
    }

    // Add prediction to history
    const history = JSON.parse(localStorage.getItem("predictionHistory") || "[]")
    history.push({
      id: Date.now(),
      date: new Date().toISOString(),
      track: raceSummary.track,
      estimatedPoints: estimatedPoints,
      horses: horses.slice(0, 5).map((h) => h.name),
      raceTime: raceSummary.time,
      raceDate: raceSummary.date,
      isBeatThePro: isBeatThePro,
    })
    localStorage.setItem("predictionHistory", JSON.stringify(history))
  }, [horses, predictionStreak, isBeatThePro, raceSummary])

  const updateLeaderboard = (points: number) => {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]")
    const username = localStorage.getItem("username") || "Anonymous"
    const userIndex = leaderboard.findIndex((entry: any) => entry.username === username)

    if (userIndex !== -1) {
      leaderboard[userIndex].points = points
    } else {
      leaderboard.push({ username, points })
    }

    leaderboard.sort((a: any, b: any) => b.points - a.points)
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
  }

  const handleShare = (platform: string) => {
    const predictedWinner = horses.length > 0 ? horses[0].name : "Unknown"
    const message = `I just predicted ${predictedWinner} to win the ${raceSummary.track} race using SaddlePro! Check it out and make your own predictions!`
    const url = "https://saddlepro.com" // Replace with your actual URL

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
          "_blank",
        )
        break
      case "tiktok":
        // TikTok doesn't have a direct share URL, but you can open the app or website
        window.open("https://www.tiktok.com", "_blank")
        break
    }
  }

  const transition = { type: "spring", stiffness: 300, damping: 25 }

  return (
    <main className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] px-4 py-6 pb-20 overflow-y-auto bg-gradient-to-b from-[#183531] to-[#0D1E1C]">
      <div className="w-full max-w-md">
        <Logo />
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-[#DDAD69] text-center mt-6 mb-2">
            {isBeatThePro ? "Beat the Pro Challenge" : "Race Predictor"}
          </h1>
          <p className="text-center text-white mb-4">Drag to reorder horses and lock in your prediction!</p>

          {/* Prediction Streak Badge */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="bg-gradient-to-r from-[#DDAD69]/30 to-[#B78E3C]/30 px-4 py-2 rounded-full flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
            >
              <div className="flex items-center">
                <Zap className="text-yellow-400 mr-1" size={18} />
                <span className="text-white font-medium">Prediction Streak: </span>
                <span className="text-yellow-400 font-bold ml-1">{predictionStreak}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Trophy className="text-[#DDAD69] mr-2" size={24} />
            Race Summary
          </h2>
          <div className="space-y-2 mb-4 text-gray-800">
            <p>
              <span className="font-semibold">Track:</span> {raceSummary.track}{" "}
              {raceSummary.raceClass && `(${raceSummary.raceClass})`}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {raceSummary.date}
            </p>
            <p>
              <span className="font-semibold">Time:</span> {raceSummary.time}
            </p>
            {isBeatThePro && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mt-2 rounded">
                <p className="text-sm text-yellow-700">
                  <span className="font-bold">Beat the Pro Challenge:</span> Earn DOUBLE points for correct predictions
                  in this special race!
                </p>
              </div>
            )}
          </div>

          {/* Scoring Info */}
          <div className="mb-4 relative">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <GamepadIcon className="text-[#DDAD69] mr-2" size={20} />
                Drag to reorder horses:
              </h2>
              <button
                onClick={() => setShowScoringInfo(!showScoringInfo)}
                className="text-[#DDAD69] hover:text-[#B78E3C] transition-colors"
              >
                <Info size={18} />
              </button>
            </div>

            <AnimatePresence>
              {showScoringInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-3 rounded-lg mt-2 border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">Scoring Breakdown:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex justify-between">
                      <span>1st place correct:</span>
                      <span className="font-semibold text-[#DDAD69]">10 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>2nd place correct:</span>
                      <span className="font-semibold text-[#DDAD69]">8 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>3rd place correct:</span>
                      <span className="font-semibold text-[#DDAD69]">5 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>4th place correct:</span>
                      <span className="font-semibold text-[#DDAD69]">3 points</span>
                    </li>
                    <li className="flex justify-between">
                      <span>5th place correct:</span>
                      <span className="font-semibold text-[#DDAD69]">1 point</span>
                    </li>
                    {isBeatThePro && (
                      <li className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                        <span>Beat the Pro bonus:</span>
                        <span className="font-semibold text-yellow-500">2x multiplier</span>
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : horses.length > 0 ? (
            <Reorder.Group axis="y" values={horses} onReorder={setHorses} className="space-y-2">
              {horses.map((horse, index) => (
                <Reorder.Item
                  key={horse.id}
                  value={horse}
                  className="bg-gray-100 p-3 rounded-lg cursor-move hover:bg-gray-200 transition-colors"
                  whileDrag={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GripVertical className="mr-2 text-gray-400" size={20} />
                      <SilkPlaceholder
                        pattern={horseSilks[index]?.pattern || "solid"}
                        primaryColor={horseSilks[index]?.primaryColor || "#DDAD69"}
                        secondaryColor={horseSilks[index]?.secondaryColor || "#FFFFFF"}
                      />
                      <span className="font-semibold text-gray-700 ml-2">
                        {index + 1}. {horse.name}
                      </span>
                    </div>
                    <div className="bg-[#DDAD69] rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{horse.score}</span>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            <p className="text-gray-600">
              No horses found for this race. Please go back and search for a race or horse.
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePredict}
            disabled={horses.length === 0 || isLoading || predictionSubmitted}
            className={`w-full mt-6 py-3 px-4 ${
              horses.length > 0 && !isLoading && !predictionSubmitted
                ? "bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] hover:from-[#C59C5F] hover:to-[#A67E2C]"
                : "bg-gray-400 cursor-not-allowed"
            } text-white rounded-xl transition-colors flex items-center justify-center shadow-lg`}
          >
            <GamepadIcon className="mr-2" size={20} />
            {predictionSubmitted ? "Prediction Locked!" : "Lock in Prediction"}
            {!predictionSubmitted && <ArrowRight className="ml-2" size={20} />}
          </motion.button>
        </div>

        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-[#DDAD69]/20 to-[#B78E3C]/20 p-6 rounded-xl shadow-lg mb-6 border border-[#DDAD69]/30"
          >
            <h2 className="text-xl font-bold text-[#DDAD69] mb-2 flex items-center">
              <Sparkles className="mr-2" size={20} />
              Prediction Status:
            </h2>
            <p className="text-white text-lg mb-3">{prediction}</p>
            <div className="flex items-center bg-white/10 p-3 rounded-lg">
              <Clock className="text-[#DDAD69] mr-2" size={18} />
              <p className="text-white/80 text-sm">Points will be awarded after the race results are confirmed.</p>
            </div>
          </motion.div>
        )}

        {showSocialShare && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ExternalLink size={20} className="mr-2 text-[#DDAD69]" />
              Share your prediction:
            </h2>
            <div className="flex justify-around">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare("twitter")}
                className="bg-[#1DA1F2] text-white p-3 rounded-full hover:bg-[#1a8cd8] transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare("facebook")}
                className="bg-[#4267B2] text-white p-3 rounded-full hover:bg-[#365899] transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook size={24} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare("tiktok")}
                className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Share on TikTok"
              >
                <ExternalLink size={24} />
              </motion.button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-[#183531] to-[#0D1E1C] rounded-xl p-6 shadow-lg flex justify-between items-center border border-[#DDAD69]/30"
        >
          <div>
            <h2 className="text-lg font-semibold text-white">Your Points</h2>
            <p className="text-3xl font-bold text-[#DDAD69]">{userPoints}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/points-history")}
            className="py-3 px-4 bg-[#DDAD69] text-white rounded-xl hover:bg-[#C59C5F] transition-colors flex items-center shadow-lg"
          >
            <Trophy className="mr-2" size={20} />
            View Points History
          </motion.button>
        </motion.div>
      </div>

      {/* Badge Earned Modal */}
      <AnimatePresence>
        {showBadgeEarned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowBadgeEarned(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={transition}
              className="bg-gradient-to-r from-[#183531] to-[#0D1E1C] p-8 rounded-xl max-w-xs w-full text-center border-4 border-[#DDAD69]"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto mb-4 bg-[#DDAD69] w-20 h-20 rounded-full flex items-center justify-center"
              >
                {earnedBadge.icon || <Award size={40} className="text-white" />}
              </motion.div>
              <h2 className="text-2xl font-bold text-[#DDAD69] mb-2">Badge Earned!</h2>
              <p className="text-white text-lg mb-4">{earnedBadge.name}</p>
              <p className="text-white/70 text-sm mb-6">Keep up the good work to earn more badges!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBadgeEarned(false)}
                className="bg-[#DDAD69] text-white py-2 px-6 rounded-full"
              >
                Awesome!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
