"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Send, Upload } from "lucide-react"

const problemCategories = [
  "App Functionality",
  "Account Issues",
  "Payment Problems",
  "Data Inaccuracy",
  "Performance Issues",
  "Other",
]

export default function ReportProblemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    screenshot: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({ ...prevData, screenshot: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Submitted problem report:", formData)
    // After successful submission, redirect to a confirmation page or back to settings
    router.push("/settings")
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#183531] pt-12 pb-20">
      {/* Header with back button */}
      <div className="bg-[#183531] p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">Report a Problem</h1>
        <div className="w-10"></div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center px-6 space-y-6 mt-4">
        {/* Problem Category */}
        <div className="w-full">
          <label htmlFor="category" className="text-white text-sm mb-1 block">
            Problem Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full bg-white text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#DDAD69]"
            required
          >
            <option value="">Select a category</option>
            {problemCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Problem Description */}
        <div className="w-full">
          <label htmlFor="description" className="text-white text-sm mb-1 block">
            Describe the Problem
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-white text-gray-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#DDAD69] h-32"
            required
            placeholder="Please provide as much detail as possible..."
          />
        </div>

        {/* Screenshot Upload */}
        <div className="w-full">
          <label htmlFor="screenshot" className="text-white text-sm mb-1 block">
            Attach a Screenshot (optional)
          </label>
          <div className="relative">
            <input
              type="file"
              id="screenshot"
              name="screenshot"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <label
              htmlFor="screenshot"
              className="w-full bg-white text-gray-900 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Upload size={20} className="mr-2" />
              {formData.screenshot ? formData.screenshot.name : "Choose a file"}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#DDAD69] text-white py-3 rounded-xl font-semibold hover:bg-[#B78E3C] transition-colors mt-6 flex items-center justify-center"
        >
          <Send size={20} className="mr-2" />
          Submit Report
        </motion.button>
      </form>
    </main>
  )
}
