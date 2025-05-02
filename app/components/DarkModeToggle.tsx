"use client"

import { MoonIcon, SunIcon } from "lucide-react"

export default function DarkModeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="p-2 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    >
      {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
    </button>
  )
}
