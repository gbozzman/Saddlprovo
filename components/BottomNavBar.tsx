"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search, Trophy, Heart, Award, Calendar, ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AccountMenu } from "./AccountMenu"

export function BottomNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(pathname)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isLeaderboardMenuOpen, setIsLeaderboardMenuOpen] = useState(false)

  useEffect(() => {
    setActiveTab(pathname)
  }, [pathname])

  const handleNavigation = (path: string) => {
    if (path === "account") {
      setIsAccountMenuOpen(true)
      return
    }

    if (path === "leaderboard") {
      setIsLeaderboardMenuOpen(true)
      return
    }

    if (path !== pathname) {
      setIsTransitioning(true)
      setTimeout(() => {
        router.push(path)
        setIsTransitioning(false)
      }, 300)
    }
  }

  // Hide navigation bar on login, splash, create account, and premium pages
  if (pathname === "/" || pathname === "/login" || pathname === "/create-account" || pathname === "/premium") {
    return null
  }

  return (
    <>
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-[#1C1C1C] h-16 flex justify-around items-center px-4 rounded-t-[30px] overflow-hidden z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Favourites */}
        <motion.button
          onClick={() => handleNavigation("/favourites")}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-all duration-300 ease-in-out ${
            activeTab === "/favourites" ? "text-[#DDAD69]" : "text-white hover:text-[#DDAD69]/70"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          <Heart size={20} />
          <span className="text-[10px] mt-1">Favourites</span>
          {activeTab === "/favourites" && (
            <motion.div className="absolute bottom-1 w-1 h-1 bg-[#DDAD69] rounded-full" layoutId="activeTab" />
          )}
        </motion.button>

        {/* Search */}
        <motion.button
          onClick={() => handleNavigation("/search")}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-all duration-300 ease-in-out ${
            activeTab === "/search" ? "text-[#DDAD69]" : "text-white hover:text-[#DDAD69]/70"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          <Search size={20} />
          <span className="text-[10px] mt-1">Search</span>
          {activeTab === "/search" && (
            <motion.div className="absolute bottom-1 w-1 h-1 bg-[#DDAD69] rounded-full" layoutId="activeTab" />
          )}
        </motion.button>

        {/* Leaderboard */}
        <motion.button
          onClick={() => handleNavigation("leaderboard")}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-all duration-300 ease-in-out ${
            activeTab === "leaderboard" ? "text-[#DDAD69]" : "text-white hover:text-[#DDAD69]/70"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          <Trophy size={20} />
          <span className="text-[10px] mt-1">Leaderboard</span>
          {activeTab === "leaderboard" && (
            <motion.div className="absolute bottom-1 w-1 h-1 bg-[#DDAD69] rounded-full" layoutId="activeTab" />
          )}
        </motion.button>
      </motion.nav>

      <AccountMenu isOpen={isAccountMenuOpen} onClose={() => setIsAccountMenuOpen(false)} />

      <AnimatePresence>
        {isLeaderboardMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsLeaderboardMenuOpen(false)}
            />

            {/* Leaderboard Menu */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 overflow-hidden border-2 border-[#DDAD69]"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-black flex items-center">
                    <Trophy className="mr-2 text-[#DDAD69]" size={24} />
                    Leaderboard
                  </h2>
                  <button
                    onClick={() => setIsLeaderboardMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} className="text-black" />
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      router.push("/leaderboard")
                      setIsLeaderboardMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-between space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left border border-gray-200"
                  >
                    <div className="flex items-center">
                      <Trophy size={24} className="text-[#DDAD69] mr-3" />
                      <div>
                        <span className="text-black text-lg font-medium">Monthly Leaderboard</span>
                        <p className="text-gray-500 text-sm">See who's winning this month</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      router.push("/points-history")
                      setIsLeaderboardMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-between space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left border border-gray-200"
                  >
                    <div className="flex items-center">
                      <Calendar size={24} className="text-[#DDAD69] mr-3" />
                      <div>
                        <span className="text-black text-lg font-medium">Points History</span>
                        <p className="text-gray-500 text-sm">Track your prediction scores</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      router.push("/predictor?special=beatthepro")
                      setIsLeaderboardMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-between space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left border border-gray-200"
                  >
                    <div className="flex items-center">
                      <Award size={24} className="text-[#DDAD69] mr-3" />
                      <div>
                        <span className="text-black text-lg font-medium">Beat the Pro</span>
                        <p className="text-gray-500 text-sm">Special weekly challenge</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      router.push("/trophy-room")
                      setIsLeaderboardMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-between space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left border border-gray-200"
                  >
                    <div className="flex items-center">
                      <Award size={24} className="text-[#DDAD69] mr-3" />
                      <div>
                        <span className="text-black text-lg font-medium">Trophy Room</span>
                        <p className="text-gray-500 text-sm">View your earned badges</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
