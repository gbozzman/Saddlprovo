"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, RefreshCw, Loader2 } from "lucide-react"

type Course = {
  id: string
  name: string
}

type SearchSectionProps = {
  courses: Course[]
  dates: string[]
  times: string[]
  selectedCourse: string
  selectedDate: string
  selectedTime: string
  onCourseChange: (courseId: string) => void
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  onSubmit: (e: React.FormEvent) => void
  onReset: () => void
  isLoading: boolean
}

export function SearchSection({
  courses,
  dates,
  times,
  selectedCourse,
  selectedDate,
  selectedTime,
  onCourseChange,
  onDateChange,
  onTimeChange,
  onSubmit,
  onReset,
  isLoading,
}: SearchSectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <motion.div
      className="bg-[#f2eadb] rounded-2xl p-6 shadow-lg w-full max-w-md mx-auto"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          {/* Course Selection */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Select a Racecourse
            </label>
            <div className="relative">
              <select
                id="course"
                value={selectedCourse}
                onChange={(e) => onCourseChange(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-[#DDAD69] appearance-none"
                required
                disabled={isLoading || courses.length === 0}
              >
                <option value="">Select a racecourse...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-3 text-gray-500">
                <Search size={18} />
              </span>
              <span className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {courses.length === 0 && !isLoading ? "No courses available" : "Select from available racecourses"}
            </p>
          </div>

          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <select
                id="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-[#DDAD69] appearance-none"
                disabled={!selectedCourse || dates.length === 0 || isLoading}
                required
              >
                <option value="">Select a date...</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-3 text-gray-500">
                <Calendar size={18} />
              </span>
              <span className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedCourse && dates.length === 0 && !isLoading
                ? "No race dates available for this course"
                : "Only showing dates with available races"}
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <div className="relative">
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className="pl-10 pr-4 py-3 w-full bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-[#DDAD69] appearance-none"
                disabled={!selectedDate || times.length === 0 || isLoading}
                required
              >
                <option value="">Select a time...</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className="absolute left-3 top-3 text-gray-500">
                <Clock size={18} />
              </span>
              <span className="absolute right-3 top-3 text-gray-500 pointer-events-none">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedDate && times.length === 0 && !isLoading
                ? "No race times available for this date"
                : "Race times for selected date"}
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={!selectedCourse || !selectedDate || !selectedTime || isLoading}
            className="flex-1 bg-gradient-to-r from-[#C49A45] to-[#DDAD69] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Search
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </form>
    </motion.div>
  )
}
