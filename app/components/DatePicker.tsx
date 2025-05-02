"use client"

export default function DatePicker({ selectedDate, setSelectedDate }) {
  return (
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="w-full h-12 px-4 rounded-xl bg-white text-gray-900 text-base border-2 border-[#DDAD69] focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-transparent shadow-md transition-all duration-300 ease-in-out appearance-none"
    />
  )
}
