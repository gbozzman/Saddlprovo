"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import { FaApple } from "react-icons/fa"

export default function CreateAccountPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [showNicknamePopup, setShowNicknamePopup] = useState(false)
  const [socialAuthType, setSocialAuthType] = useState<"google" | "apple" | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.nickname.trim() === "") {
      alert("Please enter a nickname")
      return
    }

    // Save user data to localStorage
    const userData = {
      name: formData.fullName,
      nickname: formData.nickname,
      email: formData.emailOrPhone,
      memberSince: new Date().getFullYear(),
      points: 0,
      plan: "free",
      searchesUsed: 0,
      totalSearches: 25,
    }
    localStorage.setItem("userData", JSON.stringify(userData))

    // Handle account creation logic here
    router.push("/premium")
  }

  const handleSocialAuth = (type: "google" | "apple") => {
    setSocialAuthType(type)
    setShowNicknamePopup(true)
  }

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.nickname.trim() === "") {
      alert("Please enter a nickname")
      return
    }

    // Save user data to localStorage
    const userData = {
      name: formData.fullName || "User",
      nickname: formData.nickname,
      email: formData.emailOrPhone || `${formData.nickname}@example.com`,
      memberSince: new Date().getFullYear(),
      points: 0,
      plan: "free",
      searchesUsed: 0,
      totalSearches: 25,
    }
    localStorage.setItem("userData", JSON.stringify(userData))

    // Handle account creation logic here
    router.push("/premium")
  }

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return "Weak"
    if (password.length < 12) return "Medium"
    return "Strong"
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#183531] px-6 py-12 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/placeholder.svg?height=1000&width=1000"
          alt="Horse Silhouette"
          width={1000}
          height={1000}
          layout="fill"
          objectFit="cover"
        />
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
          <h2 className="text-xl font-semibold text-[#DDAD69]">Create Your Account</h2>
        </div>

        {/* Create Account Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md text-gray-900"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Nickname (displayed on leaderboard)"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md text-gray-900"
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Email or Phone"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md text-gray-900"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md pr-12 text-gray-900"
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

          {formData.password && (
            <div className="text-sm text-white">
              Password strength:{" "}
              <span
                className={`font-semibold ${
                  getPasswordStrength(formData.password) === "Weak"
                    ? "text-red-500"
                    : getPasswordStrength(formData.password) === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
              >
                {getPasswordStrength(formData.password)}
              </span>
            </div>
          )}

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md text-gray-900"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="mr-2 text-gray-900"
            />
            <label htmlFor="agreeTerms" className="text-white text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-[#DDAD69] hover:underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#DDAD69] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] text-white rounded-full font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>
        </form>

        <div className="flex items-center justify-center space-x-4">
          <div className="flex-grow h-px bg-white/20"></div>
          <span className="text-white text-sm">Sign up quickly using:</span>
          <div className="flex-grow h-px bg-white/20"></div>
        </div>

        {/* Social Sign-Up Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialAuth("google")}
            className="w-full py-3 px-4 border border-white rounded-full text-white hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Sign up with Google</span>
          </button>

          <button
            onClick={() => handleSocialAuth("apple")}
            className="w-full py-3 px-4 border border-white rounded-full text-white hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
          >
            <FaApple className="w-5 h-5" />
            <span>Sign up with Apple</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-white text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[#DDAD69] hover:underline font-medium">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* Nickname Popup for Social Auth */}
      <AnimatePresence>
        {showNicknamePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#183531] p-6 rounded-xl max-w-md w-full border-2 border-[#DDAD69]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-[#DDAD69] mb-4">Almost there! Choose your nickname</h2>
              <p className="text-white mb-4">This will be displayed on the leaderboard and in your profile.</p>
              <form onSubmit={handleNicknameSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your nickname"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] shadow-md text-gray-900"
                  required
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNicknamePopup(false)}
                    className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] text-white rounded-xl font-semibold hover:from-[#C59C5F] hover:to-[#A67E2C] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
