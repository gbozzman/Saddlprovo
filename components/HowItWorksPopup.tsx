"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, HelpCircle } from "lucide-react"

type HowItWorksPopupProps = {
  isOpen: boolean
  onClose: () => void
}

export function HowItWorksPopup({ isOpen, onClose }: HowItWorksPopupProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideHowItWorksPopup", "true")
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-5 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">How to Use SaddlePro</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-600 mb-4">
                Get race insights in 3 simple steps – no odds, no tips, just performance.
              </p>

              <ol className="space-y-4 mb-6">
                <li className="flex">
                  <span className="bg-[#DDAD69] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                    1
                  </span>
                  <div>
                    <p className="text-gray-800 font-medium">Pick a race by date, course, or time.</p>
                  </div>
                </li>

                <li className="flex">
                  <span className="bg-[#DDAD69] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                    2
                  </span>
                  <div>
                    <p className="text-gray-800 font-medium">We'll run the numbers and show you:</p>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-[#DDAD69] mr-2">•</span>
                        <span>Top 5 horses – ranked by performance</span>
                      </li>
                      <li className="flex items-start group relative">
                        <span className="text-[#DDAD69] mr-2">•</span>
                        <span>
                          SHS (SaddlePro Horse Score) – out of 100
                          <HelpCircle size={14} className="inline-block ml-1 text-gray-400" />
                          <span className="absolute left-0 -bottom-1 transform translate-y-full bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-64 z-10">
                            SaddlePro Horse Score — rated 0–100 on 8 key performance factors.
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start group relative">
                        <span className="text-[#DDAD69] mr-2">•</span>
                        <span>
                          SCI (Confidence Index) – how reliable the scores are
                          <HelpCircle size={14} className="inline-block ml-1 text-gray-400" />
                          <span className="absolute left-0 -bottom-1 transform translate-y-full bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-64 z-10">
                            Confidence Index — how reliable this race's scores are overall.
                          </span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="flex">
                  <span className="bg-[#DDAD69] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                    3
                  </span>
                  <div>
                    <p className="text-gray-800 font-medium">No tips. No odds. Just performance data.</p>
                  </div>
                </li>
              </ol>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="dontShowAgain"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-gray-300 text-[#DDAD69] focus:ring-[#DDAD69]"
                />
                <label htmlFor="dontShowAgain" className="ml-2 text-sm text-gray-600">
                  Don't show this again
                </label>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleClose}
                  className="w-full py-2 bg-gradient-to-r from-[#C49A45] to-[#DDAD69] text-white font-medium rounded-lg hover:from-[#B78E3C] hover:to-[#C49A45] transition-all"
                >
                  Got it – Take me to the races
                </button>
                <a href="/faq" className="text-center text-sm text-[#DDAD69] hover:underline">
                  Need help? FAQ
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
