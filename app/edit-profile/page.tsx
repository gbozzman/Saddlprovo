"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Eye, EyeOff } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    name: "Melissa Peters",
    email: "melpeters@gmail.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your backend
    console.log("Updated user data:", userData)
    // After successful update, redirect to profile page
    router.push("/profile")
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#183531] pt-12 pb-20">
      {/* Header with back button */}
      <div className="bg-[#183531] p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">Edit Profile</h1>
        <div className="w-10"></div>
      </div>

      {/* Profile Content */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center px-6 space-y-6 mt-4">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-24 h-24 bg-[#DDAD69]/20 rounded-full border-2 border-[#DDAD69] flex items-center justify-center overflow-hidden">
            <span className="text-[#DDAD69] text-4xl font-bold">{userData.name.charAt(0)}</span>
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-[#DDAD69] p-2 rounded-full text-white hover:bg-[#B78E3C] transition-colors"
          >
            <Camera size={20} />
          </button>
        </div>

        {/* Name Input */}
        <div className="w-full">
          <label htmlFor="name" className="text-white text-sm mb-1 block">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="w-full bg-white text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#DDAD69]"
          />
        </div>

        {/* Email Input (readonly) */}
        <div className="w-full">
          <label htmlFor="email" className="text-white text-sm mb-1 block">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            readOnly
            className="w-full bg-gray-200 text-gray-600 rounded-xl p-3 focus:outline-none"
          />
        </div>

        {/* Current Password Input */}
        <div className="w-full relative">
          <label htmlFor="currentPassword" className="text-white text-sm mb-1 block">
            Current Password
          </label>
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            value={userData.currentPassword}
            onChange={handleInputChange}
            className="w-full bg-white text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#DDAD69] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* New Password Input */}
        <div className="w-full relative">
          <label htmlFor="newPassword" className="text-white text-sm mb-1 block">
            New Password
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={userData.newPassword}
            onChange={handleInputChange}
            className="w-full bg-white text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#DDAD69] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm New Password Input */}
        <div className="w-full relative">
          <label htmlFor="confirmPassword" className="text-white text-sm mb-1 block">
            Confirm New Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleInputChange}
            className="w-full bg-white text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#DDAD69] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Save Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#DDAD69] text-white py-3 rounded-xl font-semibold hover:bg-[#B78E3C] transition-colors mt-6"
        >
          Save Changes
        </motion.button>
      </form>
    </main>
  )
}
