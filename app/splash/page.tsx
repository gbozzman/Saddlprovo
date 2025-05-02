"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login")
    }, 3000) // Redirect to login page after 3 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#183531]">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-15%20at%2018.21.08-PVNqphs6dbCNv6JOsEM0SpYficsB8n.png"
          alt="SaddlePro Logo"
          width={300}
          height={120}
          className="mb-8"
        />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }}>
        <div className="w-16 h-16 border-t-4 border-[#DDAD69] border-solid rounded-full animate-spin"></div>
      </motion.div>
    </div>
  )
}
