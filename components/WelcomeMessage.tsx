"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function WelcomeMessage() {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // In a real app, you'd fetch this from an API or local storage
    setUserName("Melissa")
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-white text-lg font-medium text-center mb-6"
    >
      Welcome back, {userName}!
    </motion.div>
  )
}
