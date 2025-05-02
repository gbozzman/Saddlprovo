"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "@/components/logo"
import SearchSection from "@/components/search-section"
import WelcomeMessage from "@/components/WelcomeMessage"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRace, setSelectedRace] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isEntering, setIsEntering] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsEntering(false)
  }, [])

  const handleSubmit = () => {
    setIsLoading(true)
    const params = new URLSearchParams({
      horse: searchQuery,
      race: selectedRace,
      date: selectedDate,
      time: selectedTime,
    })

    // Simulate a delay to show the loading animation
    setTimeout(() => {
      router.push(`/results?${params.toString()}`)
    }, 1500)
  }

  return (
    <main className="flex flex-col items-center justify-between w-full min-h-[calc(100vh-4rem)] px-4 py-6 pb-20 overflow-y-auto bg-[#183531]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isEntering ? 0 : 1 }} transition={{ duration: 0.3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Logo />
          <h2 className="text-[#DDAD69] text-base font-medium text-center mt-1 mb-4">Your Personal Racing Assistant</h2>

          <WelcomeMessage />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white text-center mt-4 mb-6"
          >
            <p className="text-lg mb-2">Ready to find your winning horse?</p>
            <p className="text-sm text-[#DDAD69]">Enter a horse name or select a race to get started!</p>
          </motion.div>

          <div className="w-full mb-6">
            <SearchSection
              searchQuery={searchQuery}
              selectedRace={selectedRace}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              setSearchQuery={setSearchQuery}
              setSelectedRace={setSelectedRace}
              setSelectedDate={setSelectedDate}
              setSelectedTime={setSelectedTime}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 bg-[#DDAD69] text-white rounded-xl hover:bg-[#B78E3C] transition-colors transition-all duration-300 ease-in-out text-base font-medium shadow-md flex items-center justify-center mt-6"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Search"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-xl shadow-lg text-center"
            >
              <Loader2 className="w-12 h-12 text-[#DDAD69] animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-800">Searching for your winning horse...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
