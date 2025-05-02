"use client"

import { SearchIcon } from "lucide-react"

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search by horse name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-12 px-4 rounded-xl bg-white text-gray-900 text-base border-2 border-[#DDAD69] focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-transparent shadow-md transition-all duration-300 ease-in-out placeholder:text-gray-400"
      />
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  )
}
