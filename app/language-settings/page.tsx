"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Globe } from "lucide-react"

export default function LanguageSettingsPage() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "es", name: "Español" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
  ]

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "English"
    setSelectedLanguage(savedLanguage)
  }, [])

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    localStorage.setItem("language", language)
  }

  const handleSave = () => {
    router.back()
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#183531]">
      {/* Header */}
      <div className="bg-[#183531] p-4 flex items-center justify-between sticky top-0 z-10 shadow-md border-b border-[#DDAD69]/20">
        <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">Language</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="bg-[#DDAD69]/10 rounded-xl p-4 mb-6 flex items-center">
          <Globe className="text-[#DDAD69] mr-3" size={24} />
          <p className="text-white">Select your preferred language</p>
        </div>

        <div className="space-y-2">
          {languages.map((language) => (
            <motion.button
              key={language.code}
              onClick={() => handleLanguageChange(language.name)}
              className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white">{language.name}</span>
              {selectedLanguage === language.name && (
                <div className="w-6 h-6 bg-[#DDAD69] rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={handleSave}
          className="w-full py-3 bg-[#DDAD69] text-white rounded-lg mt-8 font-semibold hover:bg-[#B78E3C] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save
        </motion.button>
      </div>
    </main>
  )
}
