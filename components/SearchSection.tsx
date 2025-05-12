"use client"

import type React from "react"

import { useState } from "react"
import { Search, Calendar, Clock, RefreshCw, Info } from "lucide-react"

interface SearchSectionProps {
  courses: { id: string; name: string }[]
  dates: string[]
  times: string[]
  selectedCourse: string
  selectedDate: string
  selectedTime: string
  onCourseChange: (course: string) => void
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
  const [courseInputValue, setCourseInputValue] = useState("")
  const [dateInputValue, setDateInputValue] = useState("")
  const [timeInputValue, setTimeInputValue] = useState("")
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  // Update input values when selections change
  useState(() => {
    if (selectedCourse) {
      const course = courses.find((c) => c.id === selectedCourse)
      if (course) setCourseInputValue(course.name)
    }
    if (selectedDate) setDateInputValue(selectedDate)
    if (selectedTime) setTimeInputValue(selectedTime)
  })

  const handleCourseSelect = (courseId: string, courseName: string) => {
    onCourseChange(courseId)
    setCourseInputValue(courseName)
    setShowCourseDropdown(false)
  }

  const handleDateSelect = (date: string) => {
    onDateChange(date)
    setDateInputValue(date)
    setShowDateDropdown(false)
  }

  const handleTimeSelect = (time: string) => {
    onTimeChange(time)
    setTimeInputValue(time)
    setShowTimeDropdown(false)
  }

  const handleReset = () => {
    setCourseInputValue("")
    setDateInputValue("")
    setTimeInputValue("")
    onReset()
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    } catch (e) {
      return dateString
    }
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":").map(Number)
      const period = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
    } catch (e) {
      return timeString
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-[#f2eadb] rounded-2xl p-6 shadow-lg">
      <div className="space-y-4">
        {/* Course Selection */}
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
            Select a Racecourse
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="course"
              className="block w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-[#DDAD69] focus:border-[#DDAD69] text-black font-medium"
              placeholder="Select a racecourse"
              value={courseInputValue}
              onChange={(e) => setCourseInputValue(e.target.value)}
              onClick={() => setShowCourseDropdown(true)}
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
              <button
                type="button"
                className="h-5 w-5 text-gray-500"
                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {showCourseDropdown && (
            <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
              <ul className="py-1">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <li
                      key={course.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => handleCourseSelect(course.id, course.name)}
                    >
                      {course.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No courses available</li>
                )}
              </ul>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">Select from available racecourses</p>
        </div>

        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="date"
              className="block w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-[#DDAD69] focus:border-[#DDAD69] text-black font-medium"
              placeholder="Select a date"
              value={dateInputValue ? formatDate(dateInputValue) : ""}
              onClick={() => setShowDateDropdown(true)}
              readOnly
              disabled={!selectedCourse}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
              <button
                type="button"
                className="h-5 w-5 text-gray-500"
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                disabled={!selectedCourse}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {showDateDropdown && selectedCourse && (
            <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
              <ul className="py-1">
                {dates.length > 0 ? (
                  dates.map((date) => (
                    <li
                      key={date}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => handleDateSelect(date)}
                    >
                      {formatDate(date)}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No race dates available for this course</li>
                )}
              </ul>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {selectedCourse ? "Select a race date" : "Select a course first"}
          </p>
        </div>

        {/* Time Selection */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="time"
              className="block w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-[#DDAD69] focus:border-[#DDAD69] text-black font-medium"
              placeholder="Select a time"
              value={timeInputValue ? formatTime(timeInputValue) : ""}
              onClick={() => setShowTimeDropdown(true)}
              readOnly
              disabled={!selectedDate}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
              <button
                type="button"
                className="h-5 w-5 text-gray-500"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                disabled={!selectedDate}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {showTimeDropdown && selectedDate && (
            <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
              <ul className="py-1">
                {times.length > 0 ? (
                  times.map((time) => (
                    <li
                      key={time}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {formatTime(time)}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No race times available for selected date</li>
                )}
              </ul>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">{selectedDate ? "Select a race time" : "Select a date first"}</p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-[#C49A45] to-[#FFC72D] text-black font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            disabled={!selectedCourse || !selectedDate || !selectedTime || isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Search className="w-5 h-5 mr-2" />
            )}
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* 7-day race data disclaimer */}
        <div className="flex items-start mt-4 pt-3 border-t border-gray-300">
          <Info className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="text-xs text-gray-600">
            <span className="font-semibold">Note:</span> SaddlePro only shows up to 7 days of race data.
          </p>
        </div>
      </div>
    </form>
  )
}
