"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Combobox } from "@headlessui/react"
import { mockRaces } from "@/data/mock-races"
import { motion } from "framer-motion"

interface SearchSectionProps {
  searchQuery: string
  selectedRace: string
  selectedDate: string
  selectedTime: string
  setSearchQuery: (value: string) => void
  setSelectedRace: (value: string) => void
  setSelectedDate: (value: string) => void
  setSelectedTime: (value: string) => void
}

export default function SearchSection({
  searchQuery,
  selectedRace,
  selectedDate,
  selectedTime,
  setSearchQuery,
  setSelectedRace,
  setSelectedDate,
  setSelectedTime,
}: SearchSectionProps) {
  const [raceQuery, setRaceQuery] = useState(selectedRace)

  useEffect(() => {
    setRaceQuery(selectedRace)
  }, [selectedRace])

  const filteredRaces =
    raceQuery === ""
      ? mockRaces
      : mockRaces.filter((race) => race.name && race.name.toLowerCase().includes((raceQuery || "").toLowerCase()))

  const allHorses = mockRaces.flatMap((race) => race.horses)
  const filteredHorses =
    searchQuery === ""
      ? []
      : allHorses.filter((horse) => horse.name && horse.name.toLowerCase().includes((searchQuery || "").toLowerCase()))

  const handleRaceSelection = (raceName: string) => {
    setSelectedRace(raceName)
    setRaceQuery(raceName)
  }

  return (
    <motion.div
      className="flex flex-col space-y-3 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Combobox
        value={searchQuery}
        onChange={(value) => setSearchQuery(value)}
        onSelect={(value) => setSearchQuery(value)}
      >
        <div className="relative z-30">
          <Combobox.Input
            className="w-full h-12 px-4 rounded-xl bg-white text-gray-900 text-base border-2 border-[#DDAD69] focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-transparent shadow-md transition-all duration-300 ease-in-out placeholder-gray-500"
            placeholder="Search by horse name"
            onChange={(event) => setSearchQuery(event.target.value || "")}
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Combobox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto custom-scrollbar focus:outline-none sm:text-sm">
            {filteredHorses.map((horse) => (
              <Combobox.Option
                key={horse.id}
                value={horse.name}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active ? "text-white bg-[#DDAD69]" : "text-gray-900"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{horse.name}</span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-[#DDAD69]"
                        }`}
                      >
                        <Search className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>

      <Combobox value={selectedRace} onChange={handleRaceSelection}>
        <div className="relative z-20">
          <Combobox.Input
            className="w-full h-12 px-4 rounded-xl bg-white text-gray-900 text-base border-2 border-[#DDAD69] focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-transparent shadow-md transition-all duration-300 ease-in-out placeholder-gray-500"
            placeholder="Select a racecourse..."
            value={raceQuery}
            onChange={(event) => setRaceQuery(event.target.value)}
            displayValue={(raceName: string) => raceName || "Select a racecourse..."}
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Combobox.Options className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto custom-scrollbar focus:outline-none sm:text-sm">
            <Combobox.Option value="" className="cursor-default select-none relative py-2 pl-10 pr-4 text-gray-900">
              All Courses
            </Combobox.Option>
            {filteredRaces.map((race) => (
              <Combobox.Option
                key={race.id}
                value={race.name}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active ? "text-white bg-[#DDAD69]" : "text-gray-900"
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{race.name}</span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-[#DDAD69]"
                        }`}
                      >
                        <Search className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>

      <div className="flex space-x-3 w-full">
        <div className="w-1/2">
          <label htmlFor="date-input" className="block text-white text-sm mb-1">
            Date
          </label>
          <input
            id="date-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white text-gray-900 text-base border-2 border-[#DDAD69] focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-transparent shadow-md transition-all duration-300 ease-in-out appearance-none placeholder-gray-500"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="time-input" className="block text-white text-sm mb-1">
            Time
          </label>
          <input
            id="time-input"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white text-gray-900 text-base border-2 border-[#DDAD69] focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-transparent shadow-md transition-all duration-300 ease-in-out appearance-none placeholder-gray-500"
          />
        </div>
      </div>
    </motion.div>
  )
}
