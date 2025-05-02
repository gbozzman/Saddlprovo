"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Logo from "@/components/logo"
import type { Horse } from "@/types/horse"
import VerticalHorseCard from "@/components/vertical-horse-card"
import { Heart, Search, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<Horse[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedFavourites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavourites(storedFavourites)
  }, [])

  return (
    <main className="flex flex-col items-center w-full min-h-[calc(100vh-4rem)] px-4 py-6 pb-20 overflow-y-auto bg-[#183531]">
      <div className="w-full max-w-2xl">
        <Logo />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mt-6 mb-4"
        >
          <div className="bg-[#DDAD69]/20 p-2 rounded-full mr-3">
            <Heart className="text-[#DDAD69]" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">Your Favourites</h1>
        </motion.div>

        {favourites.length > 0 ? (
          <div className="space-y-6">
            {favourites.map((horse, index) => (
              <VerticalHorseCard key={horse.id} horse={horse} rank={index + 1} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 rounded-xl p-6 text-center border border-[#DDAD69]/30"
          >
            <div className="bg-[#DDAD69]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-[#DDAD69]" size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No favourites yet</h2>
            <p className="text-white/80 mb-6">
              Add horses to your favourites by tapping the star icon on any horse card in the search results.
            </p>
            <div className="flex flex-col space-y-2">
              <p className="text-white/60 text-sm">How to add favourites:</p>
              <ol className="text-white/80 text-sm text-left space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">1.</span>
                  <span>Go to the Search page and find a horse</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">2.</span>
                  <span>Tap on a horse card to view details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#DDAD69] mr-2">3.</span>
                  <span>Tap the star icon to add to favourites</span>
                </li>
              </ol>
            </div>
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/search")}
                className="bg-[#DDAD69] text-white py-4 px-8 rounded-xl flex items-center justify-center mx-auto"
              >
                <Search size={18} className="mr-3" />
                <span className="mr-3">Search Horses</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}
