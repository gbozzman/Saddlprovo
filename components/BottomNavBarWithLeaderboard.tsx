"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search, Book, Trophy, Award } from "lucide-react"
import { motion } from "framer-motion"
import { AccountMenu } from "./AccountMenu"

export function BottomNavBarWithLeaderboard() {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(pathname)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  useEffect(() => {
    setActiveTab(pathname)
  }, [pathname])

  const handleNavigation = (path: string) => {
    if (path === "account") {
      setIsAccountMenuOpen(true)
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
          onClick={() => handleNavigation("/leaderboard")}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-all duration-300 ease-in-out ${
            activeTab === "/leaderboard" ? "text-[#DDAD69]" : "text-white hover:text-[#DDAD69]/70"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          <Trophy size={20} />
          <span className="text-[10px] mt-1">Leaderboard</span>
          {activeTab === "/leaderboard" && (
            <motion.div className="absolute bottom-1 w-1 h-1 bg-[#DDAD69] rounded-full" layoutId="activeTab" />
          )}
        </motion.button>

        {/* Trophy Room */}
        <motion.button
          onClick={() => handleNavigation("/trophy-room")}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-all duration-300 ease-in-out ${
            activeTab === "/trophy-room" ? "text-[#DDAD69]" : "text-white hover:text-[#DDAD69]/70"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          <Award size={20} />
          <span className="text-[10px] mt-1">Trophy Room</span>
          {activeTab === "/trophy-room" && (
            <motion.div className="absolute bottom-1 w-1 h-1 bg-[#DDAD69] rounded-full" layoutId="activeTab" />
          )}
        </motion.button>

        {/* Learning Hub */}
        <motion.button
          onClick={() => handleNavigation("/learning-hub")}
          className={`flex flex-col items-center justify-center h-full focus:outline-none transition-all duration-300 ease-in-out ${
            activeTab === "/learning-hub" ? "text-[#DDAD69]" : "text-white hover:text-[#DDAD69]/70"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: isTransitioning ? 0.5 : 1 }}
        >
          <Book size={20} />
          <span className="text-[10px] mt-1">Learning</span>
          {activeTab === "/learning-hub" && (
            <motion.div className="absolute bottom-1 w-1 h-1 bg-[#DDAD69] rounded-full" layoutId="activeTab" />
          )}
        </motion.button>
      </motion.nav>

      <AccountMenu isOpen={isAccountMenuOpen} onClose={() => setIsAccountMenuOpen(false)} />
    </>
  )
}
