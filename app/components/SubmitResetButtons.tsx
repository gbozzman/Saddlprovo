"use client"

export default function SubmitResetButtons({ onSubmit, onReset }) {
  return (
    <div className="flex justify-between space-x-4 w-full mt-6">
      <button
        onClick={onSubmit}
        className="w-1/2 h-12 bg-[#DDAD69] text-white rounded-xl hover:bg-[#B78E3C] transition-colors transition-all duration-300 ease-in-out text-base font-medium shadow-md"
      >
        Search
      </button>
      <button
        onClick={onReset}
        className="w-1/2 h-12 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 transition-colors transition-all duration-300 ease-in-out text-base font-medium shadow-md"
      >
        Reset
      </button>
    </div>
  )
}
