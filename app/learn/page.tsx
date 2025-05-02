"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search } from "lucide-react"
import { useRouter } from "next/navigation"

const learningTopics = [
  {
    title: "What's Momentum Surge?",
    content: "This shows how well a horse ran lately. A 1st place = 30 points! Check the last 5 races in the score.",
    color: "#28A745",
    emoji: "🔋",
  },
  {
    title: "Why Track Precision Matters?",
    content:
      "Track precision measures how well a horse performs on specific track types. It's crucial for predicting race outcomes.",
    color: "#007BFF",
    emoji: "🎯",
  },
  {
    title: "What's Horse Vitality?",
    content:
      "Horse vitality represents the overall health and fitness of a horse. It's a key factor in determining race performance.",
    color: "#DC3545",
    emoji: "❤️",
  },
  {
    title: "Distance & Load Basics",
    content:
      "This factor considers how well a horse performs at different race distances and with varying weights. It's essential for race strategy.",
    color: "#FD7E14",
    emoji: "⚖️",
  },
  {
    title: "Team Dynamics Explained",
    content:
      "Team dynamics cover the relationship between the horse, jockey, and trainer. A strong team can significantly boost performance.",
    color: "#6F42C1",
    emoji: "🤝",
  },
]

export default function LearningHub() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredTopics = learningTopics.filter((topic) => topic.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#2E3B2E] text-white p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search topics"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-2 rounded-full bg-white text-black"
          />
          <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">Learning Hub</h1>
      <p className="text-sm text-center mb-6">Info Fast, Choices Smart</p>

      {filteredTopics.map((topic) => (
        <motion.div key={topic.title} className="mb-4 bg-[#F5F5F5] rounded-lg overflow-hidden" initial={false}>
          <button
            className="w-full text-left p-4 flex items-center"
            onClick={() => setExpandedTopic(expandedTopic === topic.title ? null : topic.title)}
            style={{ color: topic.color }}
          >
            <span className="mr-2" role="img" aria-label={`${topic.title} icon`}>
              {topic.emoji}
            </span>
            <span className="font-bold text-base">{topic.title}</span>
          </button>
          <AnimatePresence>
            {expandedTopic === topic.title && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <p className="text-sm text-black">{topic.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
