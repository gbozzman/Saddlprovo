"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, Search, BarChart2, Users, Star, Clock, Info, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
//import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function UpgradePopup({ isOpen, onClose, onUpgrade, currentPlan }) {
  const upgradeOptions = () => {
    const options = [
      <UpgradeOption
        key="gold"
        title="Gold Plan"
        description="Unlock extended access to our advanced features."
        price="£9.99/month"
        onClick={() => onUpgrade("gold")}
        icon={<Star className="text-yellow-400" size={24} />}
      />,
      <UpgradeOption
        key="platinum"
        title="Platinum Plan"
        description="Experience the ultimate racing analysis with unlimited access."
        price="£14.99/month"
        onClick={() => onUpgrade("platinum")}
        icon={<BarChart2 className="text-blue-400" size={24} />}
      />,
      <UpgradeOption
        key="extra-searches"
        title="Extra Searches"
        description="10 additional searches"
        price="£1.99"
        onClick={() => onUpgrade("extra-searches")}
        icon={<Search className="text-blue-400" size={24} />}
      />,
    ]
    return options
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-8 rounded-xl text-gray-800 text-center shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">Upgrade Your Plan</h2>
            <p className="mb-6">Currently on {currentPlan} plan.</p>
            <div className="grid grid-cols-1 gap-4">{upgradeOptions()}</div>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function UpgradeOption({ title, description, price, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded flex items-center space-x-2"
    >
      {icon}
      <div>
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm">{description}</p>
        <p className="text-sm font-bold">£{price}</p>
      </div>
    </button>
  )
}

export default function PremiumPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<"gold" | "platinum" | "daypass">("platinum")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual")
  const [showDayPassConfirmation, setShowDayPassConfirmation] = useState(false)
  const [isUpgradePopupOpen, setIsUpgradePopupOpen] = useState(false)

  const features = [
    { icon: Search, text: "Unlimited race insights for every horse" },
    { icon: BarChart2, text: "Course-specific performance analytics" },
    { icon: Users, text: "Advanced trainer and jockey ratings" },
    { icon: Star, text: "Early access to top 5 picks and expert tips" },
    { icon: Clock, text: "Performance trends and history at a glance" },
  ]

  const plans = [
    {
      name: "Gold",
      monthlyPrice: "£9.99",
      annualPrice: "£101.90",
      description: "Extended access",
      searches: "50 searches/month",
      icon: Star,
    },
    {
      name: "Platinum",
      monthlyPrice: "£14.99",
      annualPrice: "£152.90",
      description: "Extended access",
      searches: "150 searches/month",
      icon: BarChart2,
    },
  ]

  useEffect(() => {
    setBillingCycle("annual")
  }, [])

  const handleDayPassSelection = () => {
    setSelectedPlan("daypass")
    setShowDayPassConfirmation(true)
    setTimeout(() => {
      updateUserPlan("daypass")
      router.push("/search")
    }, 1500)
  }

  const handlePlanSelection = (plan: "gold" | "platinum") => {
    setSelectedPlan(plan)
    updateUserPlan(plan)
    router.push("/search")
  }

  const handleUpgrade = (plan) => {
    updateUserPlan(plan)
    setIsUpgradePopupOpen(false)
    router.push("/search")
  }

  const updateUserPlan = (plan: string) => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    userData.plan = plan
    if (plan === "daypass") {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 1)
      userData.dayPass = { expiresAt: expiryDate.toISOString() }
    }
    localStorage.setItem("userData", JSON.stringify(userData))
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-[#183531] via-[#122724] to-[#0D1E1C] text-white px-4 pt-16 pb-6 relative overflow-hidden">
      {/* Add decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#DDAD69] filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#DDAD69] filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#B78E3C] filter blur-3xl opacity-30"></div>
      </div>
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-3 bg-white/10 text-white hover:bg-white/20 transition-colors rounded-full backdrop-blur-sm z-10"
      >
        <X size={24} />
      </button>
      <div className="w-full max-w-md mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-3 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-[#DDAD69]">
              Choose Your Plan
            </h1>
            <p className="text-lg text-white/80 max-w-md mx-auto">
              Unlock the full power of SaddlePro and maximize your racing success!
            </p>
          </motion.div>

          {/* Day Pass Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full mt-8 relative z-10"
          >
            <div className="bg-gradient-to-r from-[#DDAD69]/30 to-[#B78E3C]/30 p-6 rounded-xl mb-4 shadow-lg backdrop-blur-sm border border-[#DDAD69]/30">
              <p className="text-[#DDAD69] font-semibold mb-2 text-lg flex items-center">
                <Clock className="mr-2" size={20} />A day at the races?
              </p>
              <motion.div
                onClick={handleDayPassSelection}
                className={`w-full relative overflow-hidden ${
                  selectedPlan === "daypass"
                    ? "bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] text-[#183531]"
                    : "bg-white/10 text-white"
                } border-2 border-[#DDAD69] rounded-2xl p-6 transition-all duration-300 hover:bg-[#DDAD69] hover:text-[#183531] group cursor-pointer`}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(221, 173, 105, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold mb-1">Day Pass</h3>
                    <p className="font-semibold text-lg">£3.99</p>
                    <p className="text-sm mt-2">10 searches, full access for 24 hours</p>
                    <p className="text-sm font-medium mt-1 text-[#DDAD69] group-hover:text-[#183531]">
                      Perfect for casual race days!
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Subscription Plan Instruction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 relative z-10"
          >
            <p className="text-lg text-white font-semibold px-6 py-3 bg-white/5 rounded-full inline-block backdrop-blur-sm border border-white/10">
              Or choose a subscription plan for unlimited access:
            </p>
          </motion.div>

          {/* Billing Cycle Toggle */}
          <div className="toggle-container flex justify-center items-center space-x-4 mb-12 bg-gradient-to-r from-[#DDAD69]/20 to-[#B78E3C]/20 p-6 rounded-xl relative backdrop-blur-sm border border-[#DDAD69]/30">
            <button
              className={`toggle-option ${billingCycle === "annual" ? "active" : ""}`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual
            </button>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={billingCycle === "monthly"}
                onChange={() => setBillingCycle(billingCycle === "annual" ? "monthly" : "annual")}
              />
              <span className="slider"></span>
            </label>
            <button
              className={`toggle-option ${billingCycle === "monthly" ? "active" : ""}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: billingCycle === "monthly" ? 1 : 0, y: billingCycle === "monthly" ? 0 : 10 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#DDAD69] to-[#B78E3C] text-[#183531] px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            >
              Save more with Annual!
            </motion.div>
          </div>

          <div className="text-center mb-8 bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 relative z-10">
            <p className="text-white text-lg mb-2">
              Annual Plan: <span className="text-[#DDAD69] font-bold">£8.49/month</span> (billed £101.90/year)
            </p>
            <p className="text-white text-lg">
              Monthly Plan: <span className="text-white/80">£9.99/month</span>
            </p>
            {billingCycle === "annual" && (
              <p className="text-green-400 text-sm mt-2 font-semibold flex items-center justify-center">
                <span className="bg-green-400/20 px-3 py-1 rounded-full">Save £18.98 compared to monthly plans!</span>
              </p>
            )}
          </div>

          {/* Subscription Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 mb-12 relative z-10"
          >
            {plans.map((plan, index) => {
              const PlanIcon = plan.icon
              const isBestValue = billingCycle === "annual" && plan.name === "Platinum"

              return (
                <motion.div
                  key={plan.name}
                  className={`w-full relative overflow-hidden ${
                    selectedPlan === plan.name.toLowerCase()
                      ? "bg-gradient-to-r from-[#DDAD69]/20 to-[#B78E3C]/20 border-[#DDAD69]"
                      : "bg-white/5 border-white/20"
                  } border-2 rounded-2xl p-6 transition-all duration-300 hover:bg-[#DDAD69]/30 group backdrop-blur-sm`}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {isBestValue && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl transform rotate-0 shadow-lg">
                      BEST VALUE
                    </div>
                  )}
                  <div
                    onClick={() => handlePlanSelection(plan.name.toLowerCase() as "gold" | "platinum")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="text-left flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-[#DDAD69]/20 to-[#B78E3C]/20 p-3 rounded-full group-hover:bg-[#DDAD69]/40 transition-colors">
                        <PlanIcon className="w-6 h-6 text-[#DDAD69]" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-xl font-bold mb-1">{plan.name} Plan</h3>
                        </div>
                        <p className="text-[#DDAD69] font-semibold text-lg">
                          {billingCycle === "annual" ? `${plan.annualPrice}/Year` : `${plan.monthlyPrice}/Month`}
                        </p>
                        {billingCycle === "annual" && <p className="text-green-400 text-sm">Save 15%</p>}
                        <div className="flex items-center mt-2">
                          <p className="text-white text-sm">{plan.searches}</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 ml-1 text-[#DDAD69]" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#183531] border border-[#DDAD69] text-white p-3 rounded-lg shadow-xl">
                                <p className="text-sm">A search is defined as:</p>
                                <ul className="list-disc pl-4 mt-1 text-xs">
                                  <li>Analyzing a single horse</li>
                                  <li>Viewing results for a specific race</li>
                                  <li>Comparing multiple horses in one session</li>
                                </ul>
                                <p className="text-xs mt-1">Each of these actions counts as one search.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                      <ChevronRight
                        className={`w-6 h-6 ${selectedPlan === plan.name.toLowerCase() ? "text-[#DDAD69]" : "text-white/40"}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Search Definition Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 bg-white/10 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#DDAD69]">What Counts as a Search?</h3>
            <p className="text-white mb-4">
              To help you make the most of your plan, here's what counts as a single search:
            </p>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-start">
                <Search className="w-5 h-5 mr-2 text-[#DDAD69] flex-shrink-0 mt-1" />
                <span>Analyzing an individual horse's performance and statistics</span>
              </li>
              <li className="flex items-start">
                <BarChart2 className="w-5 h-5 mr-2 text-[#DDAD69] flex-shrink-0 mt-1" />
                <span>Viewing results and predictions for a specific race</span>
              </li>
              <li className="flex items-start">
                <Users className="w-5 h-5 mr-2 text-[#DDAD69] flex-shrink-0 mt-1" />
                <span>Comparing multiple horses in a single analysis session</span>
              </li>
            </ul>
            <p className="text-white/80 text-sm mt-4">
              Each of these actions counts as one search against your plan's quota. Our goal is to provide you with
              valuable insights while ensuring fair usage of our advanced analytics.
            </p>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 relative z-10"
          >
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DDAD69]/50 to-transparent my-8" />
            <h3 className="text-lg font-semibold mb-6 text-[#DDAD69] flex items-center">
              <Star className="mr-2" size={20} />
              Premium Features
            </h3>
            <ul className="space-y-6">
              {features.map(({ icon: Icon, text }, index) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-gradient-to-br from-[#DDAD69]/20 to-[#B78E3C]/20 p-3 rounded-full">
                    <Icon className="w-5 h-5 text-[#DDAD69]" />
                  </div>
                  <span className="text-white/90 flex-1 text-lg">{text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <footer className="mt-auto w-full px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <p className="text-center text-white/60 text-sm mt-4">
            By subscribing, you agree to our{" "}
            <Link href="/terms" className="text-[#DDAD69] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#DDAD69] hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-6 mb-4">
            <div className="w-10 h-1 rounded-full bg-gradient-to-r from-[#DDAD69]/20 to-[#B78E3C]/20" />
          </div>
        </div>
      </footer>

      {/* Day Pass Confirmation Modal */}
      <AnimatePresence>
        {showDayPassConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#183531] to-[#0D1E1C] p-8 rounded-xl text-white text-center shadow-2xl border-2 border-[#DDAD69]"
            >
              <div className="w-16 h-16 bg-[#DDAD69] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-[#183531]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Day Pass Activated!</h2>
              <p className="mb-2">Start searching for today's winning horses.</p>
              <p>Redirecting to search screen...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <UpgradePopup
        isOpen={isUpgradePopupOpen}
        onClose={() => setIsUpgradePopupOpen(false)}
        onUpgrade={handleUpgrade}
        currentPlan={selectedPlan}
      />
      <style jsx>{`
        .toggle-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          background: linear-gradient(to right, rgba(221, 173, 105, 0.2), rgba(183, 142, 60, 0.2));
          padding: 10px;
          border-radius: 20px;
        }

        .toggle-option {
          font-size: 16px;
          font-weight: bold;
          padding: 4px 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.3s ease;
        }

        .toggle-option.active {
          color: #DDAD69;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 30px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.2);
          transition: 0.4s;
          border-radius: 30px;
          border: 2px solid #DDAD69;
          box-shadow: 0 0 10px rgba(221, 173, 105, 0.3);
        }

        .slider:before {
          position: absolute;
          content: '';
          height: 22px;
          width: 22px;
          left: 4px;
          bottom: 2px;
          background: linear-gradient(to bottom right, #DDAD69, #B78E3C);
          transition: 0.4s;
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }

        input:checked + .slider {
          background: linear-gradient(to right, #DDAD69, #B78E3C);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
          background: white;
        }
      `}</style>
    </main>
  )
}
