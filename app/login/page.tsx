"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import { FaApple } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setShowContent(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    router.push("/premium") // Redirect to premium page after login
  }

  if (!showContent) {
    return null // Return null instead of the splash screen
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#183531] px-6 py-12 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute inset-0 opacity-5">
        <Image src="/horse-silhouette.png" alt="Horse Silhouette" layout="fill" objectFit="cover" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-15%20at%2018.21.08-PVNqphs6dbCNv6JOsEM0SpYficsB8n.png"
            alt="SaddlePro Logo"
            width={200}
            height={80}
            className="w-48"
          />
          <h1 className="text-2xl font-bold text-white">Welcome to SaddlePro</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Email or Phone"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md text-black"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md pr-12 text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-[#DDAD69]" />
              ) : (
                <Eye className="h-5 w-5 text-[#DDAD69]" />
              )}
            </button>
          </div>

          <div className="text-center">
            <Link href="/forgot-password" className="text-[#DDAD69] hover:underline text-sm">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] text-white rounded-full font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </motion.button>
        </form>

        <div className="flex items-center justify-center space-x-4">
          <div className="flex-grow h-px bg-white/20"></div>
          <span className="text-white text-sm">Or login using</span>
          <div className="flex-grow h-px bg-white/20"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              /* Handle Google login */
            }}
            className="w-full py-3 px-4 border border-white rounded-full text-white hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => {
              /* Handle Apple login */
            }}
            className="w-full py-3 px-4 border border-white rounded-full text-white hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
          >
            <FaApple className="w-5 h-5" />
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-white text-sm">
            Don't have an account?{" "}
            <Link href="/create-account" className="text-[#DDAD69] hover:underline font-medium">
              Get started now for free!
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
