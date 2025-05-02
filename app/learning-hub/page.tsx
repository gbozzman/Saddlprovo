"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search, ChevronDown, ChevronUp, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Book, Award, HelpCircle, Clock, Calendar, User, MapPin, Flag, Compass } from "lucide-react"

const learningTopics = [
  {
    title: "Track Mastery",
    content: "Uncover the secrets of racecourses and how they influence outcomes.",
    color: "#28A745",
    emoji: "🏟️",
    icon: MapPin,
    terms: [
      {
        term: "Going",
        definition: "The track's condition (e.g., firm, soft). Some horses excel in specific conditions.",
        examples: [
          "Firm: Hard, fast ground with little give",
          "Good: Ideal racing surface with slight give",
          "Soft: Deep ground that's more testing",
          "Heavy: Very deep, wet ground that's extremely testing",
        ],
        impact:
          "Horses with different action and build prefer different going. For example, heavier horses often struggle on soft ground.",
      },
      {
        term: "Draw",
        definition: "Starting position. A good draw can give a horse a significant advantage.",
        examples: ["Low draw: Positions 1-5", "Middle draw: Positions 6-10", "High draw: Positions 11+"],
        impact:
          "On some tracks, certain draws have statistical advantages. For example, at Chester, a low draw is crucial on the tight turns.",
      },
      {
        term: "Surface",
        definition: "Turf, dirt, or synthetic. Each surface requires different skills from horses.",
        examples: [
          "Turf: Natural grass surface",
          "All-Weather: Synthetic surfaces like Polytrack or Tapeta",
          "Dirt: Mainly used in American racing",
        ],
        impact:
          "Some horses are specialists on particular surfaces. A turf specialist may struggle on all-weather and vice versa.",
      },
      {
        term: "Track Configuration",
        definition: "The layout of the track including turns, straights, and undulations.",
        examples: [
          "Galloping tracks: Long straights, gentle turns (e.g., Newbury)",
          "Sharp tracks: Tight turns, shorter straights (e.g., Chester)",
        ],
        impact: "Different horses suit different tracks. Galloping horses prefer tracks with long straights.",
      },
      {
        term: "Track Bias",
        definition: "When certain parts of the track favor horses running there.",
        examples: [
          "Rail bias: When the inside rail is faster",
          "Stand-side bias: When the far side of the track is faster",
        ],
        impact: "Understanding track bias can help predict which horses might be advantaged by their position.",
      },
    ],
  },
  {
    title: "Horse Analytics",
    content: "Dive deep into horse performance metrics and what they mean for race outcomes.",
    color: "#007BFF",
    emoji: "📊",
    icon: Compass,
    terms: [
      {
        term: "Form",
        definition: "Recent race results. A strong form indicates a horse in good condition.",
        examples: [
          "1-2-3-1-2: Very consistent, always finishing in top positions",
          "0-P-U-F-0: Poor form, failing to complete or place",
        ],
        impact: "Form is one of the most reliable indicators of a horse's current ability and fitness.",
      },
      {
        term: "Speed Figures",
        definition: "Numerical representation of a horse's speed in past races.",
        examples: ["Rating of 120+: Elite performance", "Rating of 100-119: Very good", "Rating of 80-99: Average"],
        impact: "Speed figures allow for objective comparison between horses that haven't raced against each other.",
      },
      {
        term: "Class",
        definition: "Level of competition a horse typically races in.",
        examples: [
          "Group/Grade 1: Highest class races",
          "Listed races: Just below Group level",
          "Handicaps: Horses carry different weights based on ability",
        ],
        impact: "A horse dropping in class often has a significant advantage over the competition.",
      },
      {
        term: "Weight Carried",
        definition: "The weight the horse must carry during the race, including jockey and equipment.",
        examples: ["Top weight: Carrying the most weight in a handicap", "Bottom weight: Carrying the least weight"],
        impact: "Generally, every extra pound carried slows a horse by about one length per mile.",
      },
      {
        term: "Distance Aptitude",
        definition: "The optimal race distance for a particular horse.",
        examples: [
          "Sprinter: Excels at 5-7 furlongs",
          "Miler: Best at around 8 furlongs",
          "Stayer: Thrives at 12+ furlongs",
        ],
        impact: "Horses racing at their optimal distance have a significant advantage.",
      },
      {
        term: "Pedigree",
        definition: "A horse's breeding and genetic background.",
        examples: ["Sire: The father", "Dam: The mother", "Damsire: Maternal grandfather"],
        impact: "Pedigree can indicate aptitude for certain conditions, distances, or surfaces.",
      },
      {
        term: "Top Speed",
        definition:
          "The highest speed a horse has achieved in a race, typically measured in miles per hour or furlongs per second.",
        examples: [
          "40+ mph: Exceptional speed for flat racing",
          "35-40 mph: Very good speed",
          "30-35 mph: Average speed for thoroughbreds",
        ],
        impact:
          "Top speed is a crucial factor in sprint races but must be balanced with stamina for longer distances. Horses with higher top speeds often excel in straight courses with good ground.",
      },
    ],
  },
  {
    title: "Jockey Insights",
    content: "Learn about the crucial role jockeys play and how to evaluate their performance.",
    color: "#FD7E14",
    emoji: "🏇",
    icon: User,
    terms: [
      {
        term: "Win Percentage",
        definition: "The rate at which a jockey wins races.",
        examples: ["20%+: Elite jockey", "15-20%: Very good", "10-15%: Solid", "Below 10%: Below average"],
        impact: "A high win percentage indicates consistent ability to get the best from horses.",
      },
      {
        term: "Riding Style",
        definition: "Different jockeys have different approaches to racing.",
        examples: [
          "Front-runner: Likes to lead from the start",
          "Hold-up: Prefers to come from behind",
          "Versatile: Can adapt to different scenarios",
        ],
        impact: "A jockey's style needs to match the horse's running style for optimal performance.",
      },
      {
        term: "Track Record",
        definition: "A jockey's history of performance at specific tracks.",
        examples: [
          "Track specialist: Particularly successful at certain venues",
          "Course knowledge: Understanding the nuances of a track",
        ],
        impact: "Some jockeys excel at particular tracks due to their knowledge of its quirks.",
      },
      {
        term: "Trainer-Jockey Combination",
        definition: "The success rate when a particular jockey rides for a specific trainer.",
        examples: ["Strike rate: The percentage of wins for the combination", "ROI: Return on investment for bettors"],
        impact: "Strong trainer-jockey partnerships often outperform their individual statistics.",
      },
      {
        term: "Claiming Allowance",
        definition: "Weight allowance for apprentice jockeys.",
        examples: [
          "7lb claimer: Novice apprentice",
          "5lb claimer: More experienced",
          "3lb claimer: Nearly fully qualified",
        ],
        impact: "The weight advantage can be significant, especially if the apprentice is talented.",
      },
    ],
  },
  {
    title: "Race Types & Conditions",
    content: "Understanding different race categories and their specific requirements.",
    color: "#6F42C1",
    emoji: "🏆",
    icon: Flag,
    terms: [
      {
        term: "Maiden Races",
        definition: "Races for horses that have never won before.",
        examples: ["Maiden Special Weight: Higher quality maidens", "Maiden Claiming: Lower level maidens"],
        impact: "First-time winners often improve significantly in their next race.",
      },
      {
        term: "Handicap Races",
        definition: "Races where horses carry different weights based on their ability.",
        examples: ["Class 1 Handicap: Highest level handicaps", "Class 6 Handicap: Lowest level"],
        impact: "The handicapper aims to give every horse an equal chance by assigning appropriate weights.",
      },
      {
        term: "Conditions Races",
        definition: "Races with specific entry requirements but not handicaps.",
        examples: ["Weight-for-age: Weights based on age", "Set weights: Fixed weights with penalties/allowances"],
        impact: "These races often highlight quality rather than creating a level playing field.",
      },
      {
        term: "Group/Graded Races",
        definition: "The highest class of races in horse racing.",
        examples: ["Group/Grade 1: The elite level", "Group/Grade 2: Second tier", "Group/Grade 3: Third tier"],
        impact: "These races attract the best horses and offer the highest prestige and prize money.",
      },
      {
        term: "Listed Races",
        definition: "Just below Group/Graded level but still prestigious.",
        examples: ["Black Type: Valuable for breeding purposes"],
        impact: "Winning a Listed race significantly increases a horse's value, especially for breeding.",
      },
    ],
  },
  {
    title: "Seasonal Factors",
    content: "How time of year and seasonal conditions affect race outcomes.",
    color: "#20C997",
    emoji: "🌦️",
    icon: Calendar,
    terms: [
      {
        term: "Seasonal Form",
        definition: "How horses perform at different times of the racing season.",
        examples: ["Early season: Some horses perform better fresh", "Late season: Others improve with racing"],
        impact: "Understanding a horse's seasonal pattern can provide valuable insights.",
      },
      {
        term: "Weather Impact",
        definition: "How weather conditions affect racing performance.",
        examples: [
          "Rain affecting going: Turning good ground to soft",
          "Heat: Can affect stamina",
          "Wind: Headwinds can slow finishing times",
        ],
        impact: "Weather changes can dramatically alter the suitability of a race for certain horses.",
      },
      {
        term: "Seasonal Targets",
        definition: "Major races that trainers aim their horses at during the season.",
        examples: [
          "Spring Festivals: Cheltenham, Aintree",
          "Summer Festivals: Royal Ascot, Goodwood",
          "Autumn: Arc weekend, Champions Day",
        ],
        impact: "Horses may be trained specifically to peak for certain seasonal targets.",
      },
      {
        term: "Track Seasonality",
        definition: "How tracks change throughout the racing season.",
        examples: ["Summer firm ground", "Winter heavy ground", "Seasonal maintenance periods"],
        impact: "Track characteristics can change dramatically with the seasons.",
      },
      {
        term: "Seasonal Debut",
        definition: "A horse's first run of the season after a break.",
        examples: [
          "Fresh: Some horses perform best when fresh",
          "Needing the run: Others improve for their first outing",
        ],
        impact: "Some trainers have horses ready to win first time out, while others use the first run as preparation.",
      },
    ],
  },
  {
    title: "Training Methods",
    content: "Insights into different training approaches and their impact on performance.",
    color: "#DC3545",
    emoji: "⏱️",
    icon: Clock,
    terms: [
      {
        term: "Training Patterns",
        definition: "How trainers prepare horses for races.",
        examples: [
          "Interval training: High-intensity work with recovery periods",
          "Long, slow distance work: Building stamina",
          "Sprint training: Developing speed",
        ],
        impact: "Different training methods prepare horses for different race types.",
      },
      {
        term: "Trainer Form",
        definition: "The recent success rate of a trainer's stable.",
        examples: [
          "Hot streak: Winning with many runners",
          "Cold spell: Few recent winners",
          "Stable switch: Horse moving to a new trainer",
        ],
        impact: "Trainer form can indicate the general health and fitness of all horses in the yard.",
      },
      {
        term: "First-Time Headgear",
        definition: "When equipment like blinkers or visors are used for the first time.",
        examples: [
          "Blinkers: Restrict peripheral vision",
          "Cheekpieces: Less restrictive than blinkers",
          "Visors: Modified blinkers with partial vision",
        ],
        impact: "First-time headgear can produce dramatic improvement in some horses.",
      },
      {
        term: "Layoff Returns",
        definition: "How horses perform when returning from a break.",
        examples: [
          "Fresh: Some trainers excel with horses returning from breaks",
          "Race-fit: Others need a run to reach peak fitness",
        ],
        impact: "Some trainers are known for having horses ready to win after layoffs.",
      },
      {
        term: "Training Facilities",
        definition: "The quality and type of facilities a trainer has access to.",
        examples: ["All-weather gallops", "Uphill training tracks", "Swimming pools"],
        impact: "Superior training facilities can give horses an edge in preparation.",
      },
    ],
  },
]

export default function LearningHub() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTopics = learningTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.terms.some(
        (term) =>
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#183531] to-[#0D1E1C] text-white p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.back()} aria-label="Go back" className="text-white">
          <ArrowLeft size={24} />
        </button>
        <div className="relative flex-1 mx-4">
          <input
            type="text"
            placeholder="Search topics"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DDAD69]"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
        </div>
        <Book size={24} className="text-[#DDAD69]" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-2 text-[#DDAD69]">Learning Hub</h1>
      <p className="text-sm text-center mb-8 text-white/70">Master the Track, Beat the Odds!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTopics.map((topic) => (
          <motion.div
            key={topic.title}
            className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className="w-full text-left p-4 flex items-center justify-between"
              onClick={() => setExpandedTopic(expandedTopic === topic.title ? null : topic.title)}
              style={{ color: topic.color }}
            >
              <div className="flex items-center">
                <span
                  className="mr-3 text-2xl bg-white/10 p-2 rounded-full"
                  role="img"
                  aria-label={`${topic.title} icon`}
                >
                  <topic.icon className="text-[#DDAD69]" size={24} />
                </span>
                <div>
                  <h2 className="font-bold text-lg text-white">{topic.title}</h2>
                  <p className="text-sm text-white/70">{topic.content}</p>
                </div>
              </div>
              {expandedTopic === topic.title ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                  {topic.terms.map((term) => (
                    <div key={term.term} className="mb-4 last:mb-0 bg-white/5 rounded-lg p-3">
                      <button
                        onClick={() => setExpandedTerm(expandedTerm === term.term ? null : term.term)}
                        className="w-full flex justify-between items-center"
                      >
                        <h3 className="font-semibold text-[#DDAD69] text-lg">{term.term}</h3>
                        {expandedTerm === term.term ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <p className="text-sm text-white/80 mt-1">{term.definition}</p>

                      <AnimatePresence>
                        {expandedTerm === term.term && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3"
                          >
                            {term.examples && term.examples.length > 0 && (
                              <div className="mt-2">
                                <h4 className="text-white/90 font-medium text-sm">Examples:</h4>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                  {term.examples.map((example, idx) => (
                                    <li key={idx} className="text-white/70 text-sm">
                                      {example}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {term.impact && (
                              <div className="mt-3 bg-[#DDAD69]/10 p-2 rounded border-l-2 border-[#DDAD69]">
                                <h4 className="text-white/90 font-medium text-sm">Impact on Racing:</h4>
                                <p className="text-white/80 text-sm mt-1">{term.impact}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add Quiz Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowQuiz(true)}
        className="mt-8 w-full bg-[#DDAD69] text-[#183531] py-3 rounded-xl font-semibold hover:bg-[#B78E3C] transition-colors"
      >
        Test Your Knowledge
      </motion.button>

      {/* Quiz Modal */}
      {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}
    </div>
  )
}

function QuizModal({ onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [earnedBadge, setEarnedBadge] = useState(false)

  const questions = [
    {
      question: "What does 'Going' refer to in horse racing?",
      options: [
        "The speed of the race",
        "The track's condition",
        "The horse's starting position",
        "The jockey's strategy",
      ],
      correctAnswer: 1,
      explanation: "The 'going' describes the condition of the track surface, which can range from firm to heavy.",
    },
    {
      question: "What is a 'good draw' in horse racing?",
      options: [
        "A horse with a high win percentage",
        "A favorable starting position",
        "A horse known for its speed",
        "A race with a large prize fund",
      ],
      correctAnswer: 1,
      explanation:
        "The 'draw' refers to a horse's starting position in the stalls. A good draw can give a significant advantage.",
    },
    {
      question: "What are speed figures in horse racing?",
      options: [
        "A horse's weight",
        "A numerical representation of a horse's speed",
        "The jockey's riding style",
        "The number of races a horse has won",
      ],
      correctAnswer: 1,
      explanation:
        "Speed figures provide a numerical rating of a horse's performance, allowing for comparison between horses.",
    },
    {
      question: "What does a horse's 'form' indicate?",
      options: ["Its age", "Its recent race results", "Its breeding", "Its physical appearance"],
      correctAnswer: 1,
      explanation:
        "Form refers to a horse's recent race results, typically shown as a sequence of numbers and letters.",
    },
    {
      question: "What is a jockey's 'riding style'?",
      options: ["Their attire", "Their approach to racing", "Their weight", "Their nationality"],
      correctAnswer: 1,
      explanation:
        "Riding style refers to how a jockey typically races, such as front-running or holding up for a late challenge.",
    },
    {
      question: "What is a 'handicap' in horse racing?",
      options: [
        "A type of bet",
        "A race where horses carry different weights based on ability",
        "A horse's weight allowance",
        "A disadvantage in a race",
      ],
      correctAnswer: 1,
      explanation:
        "In handicap races, horses carry different weights based on their ability to give each an equal chance.",
    },
    {
      question: "What is an 'exacta' bet?",
      options: [
        "A bet on the winner",
        "A bet on the exact order of finish for the top two horses",
        "A bet on the top three horses in any order",
        "A bet on a horse to either win or place",
      ],
      correctAnswer: 1,
      explanation: "An exacta requires selecting the first and second place finishers in the exact order.",
    },
    {
      question: "What does 'surface' refer to in horse racing?",
      options: [
        "The track's condition",
        "The type of track (turf, dirt, synthetic)",
        "The horse's coat",
        "The jockey's saddle",
      ],
      correctAnswer: 1,
      explanation:
        "Surface refers to the material the track is made of - typically turf (grass), dirt, or synthetic materials.",
    },
    {
      question: "What is a jockey's 'win percentage'?",
      options: [
        "The rate at which a jockey wins races",
        "The amount of money a jockey has won",
        "The number of races a jockey has ridden",
        "The percentage of the prize money they receive",
      ],
      correctAnswer: 0,
      explanation: "Win percentage is calculated by dividing the number of wins by the total number of rides.",
    },
    {
      question: "What is 'trainer form' in horse racing?",
      options: [
        "The trainer's physical fitness",
        "The recent success rate of a trainer's stable",
        "The trainer's experience level",
        "The trainer's strategy for a specific race",
      ],
      correctAnswer: 1,
      explanation: "Trainer form indicates how well a trainer's horses have been performing recently.",
    },
  ]

  const handleAnswer = (selectedOption: number) => {
    setSelectedAnswer(selectedOption)
    setShowCorrectAnswer(true)

    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    // Wait 2 seconds before moving to next question
    setTimeout(() => {
      setShowCorrectAnswer(false)
      setSelectedAnswer(null)

      const nextQuestion = currentQuestion + 1
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion)
      } else {
        // Check if perfect score for badge
        if (score + (selectedOption === questions[currentQuestion].correctAnswer ? 1 : 0) === questions.length) {
          setEarnedBadge(true)
        }
        setShowScore(true)
      }
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#183531] p-6 rounded-xl w-full max-w-md border-2 border-[#DDAD69] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-[#DDAD69] transition-colors">
          <X size={24} />
        </button>

        {showScore ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#DDAD69] mb-4">Quiz Complete!</h2>
            <div className="w-32 h-32 mx-auto bg-[#DDAD69]/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-[#DDAD69]">
                {score}/{questions.length}
              </span>
            </div>
            <p className="text-white text-lg mb-6">
              {score === questions.length
                ? "Perfect score! You're a racing expert!"
                : score >= questions.length * 0.8
                  ? "Great job! You know your racing!"
                  : score >= questions.length * 0.6
                    ? "Good effort! Keep learning!"
                    : "Keep studying to improve your knowledge!"}
            </p>

            {earnedBadge && (
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 rounded-lg mb-6 animate-pulse">
                <div className="flex items-center justify-center mb-2">
                  <Award className="text-white mr-2" size={24} />
                  <h3 className="text-white font-bold">Badge Earned: Quiz Master!</h3>
                </div>
                <p className="text-white/90 text-sm">You've earned a badge for achieving a perfect score!</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setCurrentQuestion(0)
                  setScore(0)
                  setShowScore(false)
                  setSelectedAnswer(null)
                  setShowCorrectAnswer(false)
                }}
                className="flex-1 py-3 px-4 bg-[#DDAD69] text-white rounded-xl hover:bg-[#B78E3C] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#DDAD69]">Racing Quiz</h2>
              <span className="text-white/70 text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full mb-4">
              <div
                className="h-full bg-[#DDAD69] rounded-full transition-all duration-300"
                style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">{questions[currentQuestion].question}</h3>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showCorrectAnswer && handleAnswer(index)}
                    disabled={showCorrectAnswer}
                    className={`w-full py-3 px-4 rounded-lg text-left transition-colors ${
                      showCorrectAnswer
                        ? index === questions[currentQuestion].correctAnswer
                          ? "bg-green-500 text-white"
                          : selectedAnswer === index
                            ? "bg-red-500 text-white"
                            : "bg-white/10 text-white/60"
                        : selectedAnswer === index
                          ? "bg-[#DDAD69] text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>

              {showCorrectAnswer && (
                <div className="mt-4 bg-white/10 p-3 rounded-lg border-l-2 border-[#DDAD69]">
                  <p className="text-white text-sm">
                    <span className="font-semibold text-[#DDAD69]">Explanation: </span>
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HelpCircle className="text-[#DDAD69] mr-2" size={20} />
                <span className="text-white/70 text-sm">Select the best answer</span>
              </div>
              <div className="text-white/70 text-sm">
                Score: {score}/{currentQuestion}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
