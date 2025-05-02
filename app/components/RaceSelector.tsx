"use client"

export default function RaceSelector({ selectedRace, setSelectedRace }) {
  const races = ["Race 1", "Race 2", "Race 3", "Race 4", "Race 5"]

  return (
    <select
      value={selectedRace}
      onChange={(e) => setSelectedRace(e.target.value)}
      className="w-full h-12 px-4 rounded-xl bg-white text-gray-900 text-base border-2 border-[#DDAD69] focus:outline-none focus:ring-2 focus:ring-[#DDAD69] focus:border-transparent shadow-md transition-all duration-300 ease-in-out appearance-none"
    >
      <option value="">Select a racecourse...</option>
      {races.map((race) => (
        <option key={race} value={race}>
          {race}
        </option>
      ))}
    </select>
  )
}
