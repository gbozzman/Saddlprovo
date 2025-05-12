"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Logo from "@/components/logo"
import { SearchSection } from "@/components/search-section"
import WelcomeMessage from "@/components/WelcomeMessage"
import { BottomNavBar } from "@/components/BottomNavBar"
import { HowItWorksPopup } from "@/components/HowItWorksPopup"
import { fetchCourses, fetchRaceDates, fetchRaceTimes } from "@/services/raceService"
import type { LiveCourse } from "@/lib/supabase"
import { Info, AlertCircle, Database } from "lucide-react"

export default function SearchPage() {
  const router = useRouter()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [courses, setCourses] = useState<LiveCourse[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [times, setTimes] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    // Check if popup should be shown
    const hidePopup = localStorage.getItem("hideHowItWorksPopup")
    if (!hidePopup) {
      setIsPopupOpen(true)
    }

    // Check if we're using mock data
    const isMissingCredentials = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    setUsingMockData(isMissingCredentials)

    // Load courses
    const loadCourses = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const coursesData = await fetchCourses()
        setCourses(coursesData)
      } catch (err: any) {
        console.error("Failed to load courses:", err)
        setError(err?.message || "Failed to load courses. Please check your Supabase connection.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  useEffect(() => {
    // Load dates when course changes
    const loadDates = async () => {
      if (selectedCourse) {
        try {
          setIsLoading(true)
          setError(null)
          setDates([])
          setTimes([])
          setSelectedDate("")
          setSelectedTime("")

          const datesData = await fetchRaceDates(selectedCourse)
          setDates(datesData)
        } catch (err: any) {
          console.error("Failed to load dates:", err)
          setError(err?.message || "Failed to load race dates. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadDates()
  }, [selectedCourse])

  useEffect(() => {
    // Load times when date changes
    const loadTimes = async () => {
      if (selectedCourse && selectedDate) {
        try {
          setIsLoading(true)
          setError(null)
          setTimes([])
          setSelectedTime("")

          const timesData = await fetchRaceTimes(selectedCourse, selectedDate)
          setTimes(timesData)
        } catch (err: any) {
          console.error("Failed to load times:", err)
          setError(err?.message || "Failed to load race times. Please try again later.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadTimes()
  }, [selectedCourse, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCourse && selectedDate && selectedTime) {
      router.push(`/results?course=${selectedCourse}&date=${selectedDate}&time=${selectedTime}`)
    }
  }

  const handleReset = () => {
    setSelectedCourse("")
    setSelectedDate("")
    setSelectedTime("")
    setDates([])
    setTimes([])
    setError(null)
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-[#183531] pb-20">
      <div className="w-full max-w-2xl px-4 py-6">
        <Logo />
        <WelcomeMessage />

        <div className="text-center mt-2 mb-6">
          <p className="text-[#DDAD69] text-sm">Ready to find your winning horse?</p>
          <p className="text-gray-300 text-xs mt-1">
            Select a race to get started
            <button
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center ml-2 text-[#DDAD69] hover:underline"
            >
              <Info size={14} className="mr-1" />
              How it works
            </button>
          </p>
        </div>

        {usingMockData && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 p-4 rounded-md mb-6 flex items-start">
            <Database className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Using sample data</p>
              <p className="text-sm mt-1 text-amber-300/80">
                The app is currently using mock data for demonstration purposes.
              </p>
              <p className="text-xs mt-2 text-amber-300/60">
                To use real data, set up your Supabase environment variables:
                <code className="block mt-1 p-1 bg-black/20 rounded text-amber-200">
                  NEXT_PUBLIC_SUPABASE_URL
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-md mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading data</p>
              <p className="text-sm mt-1 text-red-300/80">{error}</p>
            </div>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SearchSection
            courses={courses.map((c) => ({ id: c.course_id, name: c.name }))}
            dates={dates}
            times={times}
            selectedCourse={selectedCourse}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onCourseChange={setSelectedCourse}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isLoading={isLoading}
          />
        </motion.div>
      </div>

      <BottomNavBar />
      <HowItWorksPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </main>
  )
}
