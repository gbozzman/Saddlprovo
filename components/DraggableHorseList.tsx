"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { Trophy, LockIcon, RotateCcw, Info, X, Star, Award } from "lucide-react"
import type { LiveRaceRunner } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface DraggableHorseListProps {
  horses: LiveRaceRunner[]
  onSubmitPrediction: (predictedOrder: LiveRaceRunner[]) => void
}

export function DraggableHorseList({ horses, onSubmitPrediction }: DraggableHorseListProps) {
  const router = useRouter()
  const [originalHorses, setOriginalHorses] = useState<LiveRaceRunner[]>([])
  const [predictedHorses, setPredictedHorses] = useState<LiveRaceRunner[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showInfoPopup, setShowInfoPopup] = useState(true)
  const [showBeatProPopup, setShowBeatProPopup] = useState(false)
  const [showLeaderboardButton, setShowLeaderboardButton] = useState(false)

  useEffect(() => {
    // Store the original horses when component mounts or horses prop changes
    setOriginalHorses([...horses])
    setPredictedHorses([...horses])

    // Check if user has seen the prediction info before
    const hasSeenInfo = localStorage.getItem("hasSeenPredictionInfo") === "true"
    setShowInfoPopup(!hasSeenInfo)
  }, [horses])

  // Submit prediction
  const handleSubmitPrediction = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSubmitPrediction(predictedHorses)
      setIsSubmitting(false)
      setShowSuccess(true)
      setShowLeaderboardButton(true)
    }, 1000)
  }

  // Reset to original order
  const resetOrder = () => {
    setPredictedHorses([...originalHorses])
  }

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-yellow-400"
    if (score >= 70) return "bg-orange-500"
    if (score >= 55) return "bg-blue-500"
    return "bg-blue-300"
  }

  // Close info popup and remember user's choice
  const handleCloseInfoPopup = () => {
    localStorage.setItem("hasSeenPredictionInfo", "true")
    setShowInfoPopup(false)
  }

  // Navigate to leaderboard
  const goToLeaderboard = () => {
    router.push("/leaderboard")
  }

  return (
    <div className="space-y-4">
      {/* Beat the Pro popup */}
      <AnimatePresence>
        {showBeatProPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBeatProPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Trophy className="w-6 h-6 text-[#DDAD69] mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Beat the Pro Challenge</h3>
                </div>
                <button onClick={() => setShowBeatProPopup(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="text-amber-500 mr-2" size={20} />
                    <h4 className="font-bold text-amber-800">This Week's Challenge</h4>
                  </div>
                  <p className="text-amber-800 mb-2">
                    Predict the top 5 finishers in the Cheltenham Gold Cup and earn double points!
                  </p>
                  <p className="text-sm text-amber-700">Challenge ends in: 2 days, 14 hours</p>
                </div>

                <p className="mb-3 text-gray-700">
                  Think you know better than our AI? Put your racing knowledge to the test!
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-gray-800 mb-2">How to earn points:</h4>
                  <ul className="list-disc pl-5 mb-3 text-sm text-gray-700">
                    <li className="mb-1">
                      <span className="font-semibold">5 points</span> for each horse in the exact position
                    </li>
                    <li className="mb-1">
                      <span className="font-semibold">3 points</span> for horses within 1 position
                    </li>
                    <li className="mb-1">
                      <span className="font-semibold">1 point</span> for horses within 2 positions
                    </li>
                    <li className="mb-1">
                      <span className="font-semibold">BONUS:</span> Beat our expert and earn a special badge!
                    </li>
                  </ul>
                </div>

                <div className="flex items-center bg-gray-100 p-3 rounded-lg mb-4">
                  <Award className="text-[#DDAD69] mr-3" size={24} />
                  <div>
                    <p className="font-medium text-gray-800">Current Leader: HorseWhisperer</p>
                    <p className="text-sm text-gray-600">Score: 23 points</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBeatProPopup(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowBeatProPopup(false)
                    setPredictedHorses([...horses])
                  }}
                  className="flex-1 py-2 px-4 bg-[#DDAD69] text-white rounded-lg hover:bg-[#C59C5F] transition-colors font-medium"
                >
                  Start Challenge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prediction info popup */}
      <AnimatePresence>
        {showInfoPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#1d403c] text-white p-5 rounded-xl shadow-lg mb-4 relative"
          >
            <button onClick={handleCloseInfoPopup} className="absolute top-3 right-3 text-gray-300 hover:text-white">
              <X size={18} />
            </button>
            <div className="flex items-start mb-3">
              <Info className="w-6 h-6 mr-2 text-[#DDAD69] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Prediction Mode</h3>
                <p className="text-gray-200 mb-2">
                  Drag and reorder the horses based on how you think they'll perform in the race!
                </p>
                <p className="text-gray-200 mb-3">
                  Earn points for correct predictions and climb the leaderboard to prove your expertise.
                </p>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dontShowAgain"
                    className="mr-2"
                    onChange={(e) => {
                      if (e.target.checked) {
                        localStorage.setItem("hasSeenPredictionInfo", "true")
                      }
                    }}
                  />
                  <label htmlFor="dontShowAgain" className="text-sm text-gray-300">
                    Don't show this again
                  </label>
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseInfoPopup}
              className="w-full py-2 bg-[#DDAD69] text-white rounded-lg hover:bg-[#C59C5F] transition-colors font-medium"
            >
              Got it!
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4">
        <p className="font-medium">Drag to Predict</p>
        <p className="text-sm">Drag and reorder horses based on your prediction. Lock it in when done.</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={resetOrder}
          className="flex items-center gap-1 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          onClick={handleSubmitPrediction}
          disabled={isSubmitting}
          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              Saving...
            </>
          ) : (
            <>
              <LockIcon size={16} />
              Lock it in
            </>
          )}
        </button>
      </div>

      {/* Success message with leaderboard button */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-4"
          >
            <p className="font-medium">Your prediction has been locked in!</p>
            <p className="text-sm mb-3">Check back after the race to see how you did.</p>

            {showLeaderboardButton && (
              <button
                onClick={goToLeaderboard}
                className="w-full mt-2 py-2 bg-[#DDAD69] text-white rounded-lg hover:bg-[#C59C5F] transition-colors flex items-center justify-center"
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Leaderboard
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable horse list */}
      <Reorder.Group values={predictedHorses} onReorder={setPredictedHorses} className="space-y-2">
        {predictedHorses.map((horse, index) => (
          <Reorder.Item key={horse.id || `horse-${index}`} value={horse}>
            <motion.div
              className="bg-white rounded-lg p-3 shadow-md cursor-move"
              whileDrag={{ scale: 1.03 }}
              initial={false}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${getScoreColor(
                      horse.normalized_score,
                    )}`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{horse.horse_name}</h3>
                    <p className="text-xs text-gray-500">
                      {horse.jockey || "Unknown"} • {horse.trainer || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getScoreColor(
                      horse.normalized_score,
                    )}`}
                  >
                    {Math.round(horse.normalized_score)}
                  </div>
                </div>
              </div>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Beat the Pro button */}
      <div className="mt-6">
        <button
          onClick={() => setShowBeatProPopup(true)}
          className="w-full py-3 bg-[#DDAD69] text-white rounded-xl hover:bg-[#C59C5F] transition-colors font-semibold flex items-center justify-center"
        >
          <Trophy className="mr-2" size={20} />
          Beat the Pro
        </button>
      </div>
    </div>
  )
}
