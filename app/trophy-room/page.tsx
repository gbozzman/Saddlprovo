"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import {
  ArrowLeft,
  Trophy,
  Info,
  Star,
  Award,
  Crown,
  Search,
  BookOpen,
  Zap,
  BarChart,
  Lock,
  ChevronDown,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"
import confetti from "canvas-confetti"

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  category: string
  progress?: number
  maxProgress?: number
  rarity: "common" | "uncommon" | "rare" | "legendary"
  dateEarned?: string
}

const badges: Badge[] = [
  // Core Prediction Badges
  {
    id: "rookie-racer",
    name: "Rookie Racer",
    description: "First-time prediction made.",
    icon: <Trophy size={32} />,
    earned: false,
    category: "Core Prediction",
    rarity: "common",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "lucky-pick",
    name: "Lucky Pick",
    description: "Got at least one horse in the correct position.",
    icon: <Star size={32} />,
    earned: false,
    category: "Core Prediction",
    rarity: "common",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "hot-streak",
    name: "Hot Streak",
    description: "Correctly predicted at least 3 races in a row.",
    icon: <Zap size={32} />,
    earned: false,
    category: "Core Prediction",
    rarity: "uncommon",
    progress: 1,
    maxProgress: 3,
  },
  {
    id: "precision-punter",
    name: "Precision Punter",
    description: "Predicted the exact 1st, 2nd, and 3rd places.",
    icon: <Award size={32} />,
    earned: false,
    category: "Core Prediction",
    rarity: "rare",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "perfect-predictor",
    name: "Perfect Predictor",
    description: "Got all 5 positions correct in a race.",
    icon: <Crown size={32} />,
    earned: false,
    category: "Core Prediction",
    rarity: "legendary",
    progress: 0,
    maxProgress: 1,
  },

  // Strategy & Skill-Based Badges
  {
    id: "underdog-whisperer",
    name: "Underdog Whisperer",
    description: "Correctly predicted a low-ranked horse to finish in the Top 3.",
    icon: <Trophy size={32} />,
    earned: false,
    category: "Strategy & Skill",
    rarity: "uncommon",
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "comeback-king",
    name: "Comeback King",
    description: "Climbed 10+ spots on the leaderboard in a single week.",
    icon: <Crown size={32} />,
    earned: false,
    category: "Strategy & Skill",
    rarity: "rare",
    progress: 4,
    maxProgress: 10,
  },
  {
    id: "ultimate-strategist",
    name: "Ultimate Strategist",
    description: "Maintained a Top 10 leaderboard position for 3 weeks straight.",
    icon: <Award size={32} />,
    earned: false,
    category: "Strategy & Skill",
    rarity: "legendary",
    progress: 1,
    maxProgress: 3,
  },

  // Learning & Knowledge Badges
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Scored a perfect 10/10 on the Racing Knowledge Quiz.",
    icon: <BookOpen size={32} />,
    earned: false,
    category: "Learning & Knowledge",
    rarity: "rare",
    progress: 8,
    maxProgress: 10,
  },
  {
    id: "racing-scholar",
    name: "Racing Scholar",
    description: "Read all articles in the Learning Hub.",
    icon: <BookOpen size={32} />,
    earned: false,
    category: "Learning & Knowledge",
    rarity: "uncommon",
    progress: 3,
    maxProgress: 6,
  },

  // Search Mastery Badges
  {
    id: "curious-explorer",
    name: "Curious Explorer",
    description: "Completed 10 searches.",
    icon: <Search size={32} />,
    earned: false,
    category: "Search Mastery",
    rarity: "common",
    progress: 7,
    maxProgress: 10,
  },
  {
    id: "dedicated-researcher",
    name: "Dedicated Researcher",
    description: "Completed 75 searches.",
    icon: <Search size={32} />,
    earned: false,
    category: "Search Mastery",
    rarity: "uncommon",
    progress: 45,
    maxProgress: 75,
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Completed 200 searches.",
    icon: <BarChart size={32} />,
    earned: false,
    category: "Search Mastery",
    rarity: "rare",
    progress: 85,
    maxProgress: 200,
  },
  {
    id: "racing-expert",
    name: "Racing Expert",
    description: "Completed 500 searches.",
    icon: <Award size={32} />,
    earned: false,
    category: "Search Mastery",
    rarity: "legendary",
    progress: 120,
    maxProgress: 500,
  },
  {
    id: "master-of-information",
    name: "Master of Information",
    description: "Completed 1000 searches.",
    icon: <Crown size={32} />,
    earned: false,
    category: "Search Mastery",
    rarity: "legendary",
    progress: 120,
    maxProgress: 1000,
  },
]

const rarityColors = {
  common: {
    bg: "from-blue-400 to-blue-600",
    border: "border-blue-300",
    text: "text-blue-100",
    shadow: "shadow-blue-500/50",
  },
  uncommon: {
    bg: "from-green-400 to-green-600",
    border: "border-green-300",
    text: "text-green-100",
    shadow: "shadow-green-500/50",
  },
  rare: {
    bg: "from-purple-400 to-purple-600",
    border: "border-purple-300",
    text: "text-purple-100",
    shadow: "shadow-purple-500/50",
  },
  legendary: {
    bg: "from-yellow-400 to-orange-500",
    border: "border-yellow-300",
    text: "text-yellow-100",
    shadow: "shadow-orange-500/50",
  },
}

export default function TrophyRoomPage() {
  const router = useRouter()
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
  const [currentCategory, setCurrentCategory] = useState<string>("Core Prediction")
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [showBadgeDetails, setShowBadgeDetails] = useState(false)
  const [showCategoryInfo, setShowCategoryInfo] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    // Properly set earned badges with correct progress values
    const updatedBadges = badges.map((badge) => {
      const isEarned = Math.random() > 0.6
      return {
        ...badge,
        earned: isEarned,
        // If earned, set progress to maxProgress, otherwise keep the existing progress
        progress: isEarned && badge.maxProgress ? badge.maxProgress : badge.progress,
        dateEarned: isEarned
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      }
    })
    setEarnedBadges(updatedBadges)

    // Animate the header
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    })
  }, [controls])

  const categories = Array.from(new Set(badges.map((badge) => badge.category)))

  const earnedCount = earnedBadges.filter((badge) => badge.earned).length
  const totalCount = badges.length
  const progressPercentage = (earnedCount / totalCount) * 100

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge)
    setShowBadgeDetails(true)

    if (badge.earned) {
      // Trigger confetti for earned badges
      if (confettiRef.current) {
        const rect = confettiRef.current.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x, y: y - 0.1 },
        })
      }
    }
  }

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case "Core Prediction":
        return "Badges earned through making predictions and achieving accurate results in horse races."
      case "Strategy & Skill":
        return "Badges that recognize your strategic thinking and skill in analyzing racing data."
      case "Learning & Knowledge":
        return "Badges awarded for expanding your knowledge about horse racing through quizzes and learning materials."
      case "Search Mastery":
        return "Badges that track your journey from novice to expert in using the search functionality."
      default:
        return "Collection of achievements in this category."
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "Common"
      case "uncommon":
        return "Uncommon"
      case "rare":
        return "Rare"
      case "legendary":
        return "Legendary"
      default:
        return "Unknown"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not yet earned"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <main className="flex flex-col items-center w-full min-h-screen pb-20 overflow-x-hidden bg-gradient-to-b from-[#183531] to-[#0D1E1C]">
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50"></div>

      {/* Header Section */}
      <motion.div
        className="w-full relative overflow-hidden bg-[#183531]"
        initial={{ y: -50, opacity: 0 }}
        animate={controls}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#DDAD69]/20 to-[#B78E3C]/20 z-0"></div>

        {/* Decorative elements */}
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-[#DDAD69]/10 blur-2xl"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#DDAD69]/10 blur-2xl"></div>

        <div className="relative z-10 px-4 py-8">
          <Logo />

          <div className="flex items-center justify-between mt-6">
            <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
              <ArrowLeft size={24} />
            </button>

            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] rounded-full flex items-center justify-center mb-2 shadow-lg shadow-[#DDAD69]/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trophy size={40} className="text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-[#DDAD69] text-center">Trophy Room</h1>
            </motion.div>

            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#DDAD69"
                  strokeWidth="2"
                  strokeDasharray={`${progressPercentage}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-[#DDAD69]">
                  {earnedCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 px-4">
            <div className="flex justify-between text-white/80 text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#DDAD69] to-[#B78E3C]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              ></motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Selection */}
      <div className="w-full px-4 mt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-[#DDAD69]">Categories</h2>
          <button
            onClick={() => setShowCategoryInfo(!showCategoryInfo)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Info size={18} />
          </button>
        </div>

        {/* Category info panel */}
        <AnimatePresence>
          {showCategoryInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20"
            >
              <h3 className="text-[#DDAD69] font-semibold mb-2">{currentCategory}</h3>
              <p className="text-white/80 text-sm">{getCategoryDescription(currentCategory)}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setCurrentCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                currentCategory === category
                  ? "bg-[#DDAD69] text-[#183531]"
                  : "bg-[#DDAD69]/20 text-[#DDAD69] hover:bg-[#DDAD69]/30"
              } transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="w-full px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {earnedBadges
            .filter((badge) => badge.category === currentCategory)
            .map((badge, index) => {
              const rarityStyle = rarityColors[badge.rarity as keyof typeof rarityColors]
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleBadgeClick(badge)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer ${
                    badge.earned
                      ? `bg-gradient-to-br ${rarityStyle.bg} ${rarityStyle.border} shadow-lg ${rarityStyle.shadow}`
                      : "bg-gray-700 border border-gray-600"
                  }`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-4 flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                        badge.earned ? "bg-white/20" : "bg-gray-800"
                      }`}
                    >
                      <div className={badge.earned ? "text-white" : "text-gray-500"}>{badge.icon}</div>
                    </div>
                    <h3 className={`text-sm font-bold mb-1 ${badge.earned ? "text-white" : "text-gray-400"}`}>
                      {badge.name}
                    </h3>

                    {/* Progress bar for badges with progress */}
                    {badge.progress !== undefined && badge.maxProgress !== undefined && (
                      <div className="w-full mt-2">
                        <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${badge.earned ? "bg-white/70" : "bg-gray-500"}`}
                            style={{ width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className={`text-[10px] ${badge.earned ? "text-white/70" : "text-gray-500"}`}>
                            {badge.progress}/{badge.maxProgress}
                          </span>
                          <span className={`text-[10px] ${badge.earned ? "text-white/70" : "text-gray-500"}`}>
                            {getRarityLabel(badge.rarity)}
                          </span>
                        </div>
                      </div>
                    )}

                    {!badge.earned && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                        <Lock size={24} className="text-white/70" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
        </div>
      </div>

      {/* Badge Details Modal */}
      <AnimatePresence>
        {showBadgeDetails && selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowBadgeDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#183531] p-6 rounded-xl max-w-md w-full border-2 border-[#DDAD69] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedBadge.earned ? (
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                  <Star size={20} className="text-white" />
                </div>
              ) : null}

              <div className="flex items-center mb-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                    selectedBadge.earned
                      ? `bg-gradient-to-br ${rarityColors[selectedBadge.rarity as keyof typeof rarityColors].bg}`
                      : "bg-gray-700"
                  }`}
                >
                  <div className="text-white">{selectedBadge.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#DDAD69]">{selectedBadge.name}</h3>
                  <div className="flex items-center">
                    <span className={`text-sm ${selectedBadge.earned ? "text-green-400" : "text-gray-400"}`}>
                      {selectedBadge.earned ? "Earned" : "Locked"}
                    </span>
                    <span className="mx-2 text-white/30">•</span>
                    <span className="text-sm text-white/70">{getRarityLabel(selectedBadge.rarity)}</span>
                  </div>
                </div>
              </div>

              <p className="text-white/80 mb-4">{selectedBadge.description}</p>

              {selectedBadge.progress !== undefined && selectedBadge.maxProgress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>Progress</span>
                    <span>
                      {selectedBadge.progress}/{selectedBadge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        selectedBadge.earned ? "bg-gradient-to-r from-[#DDAD69] to-[#B78E3C]" : "bg-gray-600"
                      }`}
                      style={{ width: `${Math.min(100, (selectedBadge.progress / selectedBadge.maxProgress) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="bg-white/10 p-3 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Date Earned:</span>
                  <span className="text-white">{formatDate(selectedBadge.dateEarned)}</span>
                </div>
              </div>

              {!selectedBadge.earned && (
                <div className="bg-[#DDAD69]/10 border border-[#DDAD69]/30 p-3 rounded-lg mb-4">
                  <h4 className="text-[#DDAD69] font-semibold text-sm mb-1">How to earn this badge:</h4>
                  <p className="text-white/80 text-sm">{selectedBadge.description}</p>
                </div>
              )}

              <button
                onClick={() => setShowBadgeDetails(false)}
                className="w-full py-3 bg-[#DDAD69] text-[#183531] rounded-lg font-semibold hover:bg-[#B78E3C] transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rarity Guide */}
      <div className="w-full px-4 mt-8">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[#DDAD69]">Rarity Guide</h3>
            <ChevronDown className="text-white/70" size={18} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-white/80">Common - Easy to earn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-white/80">Uncommon - Requires some effort</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm text-white/80">Rare - Challenging to earn</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm text-white/80">Legendary - Extremely difficult to earn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="w-full px-4 mt-6 mb-20">
        <div className="bg-[#DDAD69]/10 rounded-lg p-4 border border-[#DDAD69]/30">
          <h3 className="text-lg font-semibold text-[#DDAD69] mb-2 flex items-center">
            <Info size={18} className="mr-2" />
            Tips to Earn More Badges
          </h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-start">
              <span className="text-[#DDAD69] mr-2">•</span>
              <span>Make daily predictions to increase your chances of earning prediction badges</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#DDAD69] mr-2">•</span>
              <span>Complete the Racing Knowledge Quiz to earn the Quiz Master badge</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#DDAD69] mr-2">•</span>
              <span>Use the search feature regularly to progress through the Search Mastery badges</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#DDAD69] mr-2">•</span>
              <span>Participate in Beat the Pro challenges for exclusive badges</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
