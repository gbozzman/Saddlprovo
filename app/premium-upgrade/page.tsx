"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, ChevronRight, Search, BarChart2, Users, Star, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"

export default function PremiumUpgradePage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<"gold" | "platinum">("platinum")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual")

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
    },
    {
      name: "Platinum",
      monthlyPrice: "£14.99",
      annualPrice: "£152.90",
      description: "Unlimited access",
      searches: "Unlimited searches",
    },
  ]

  useEffect(() => {
    setBillingCycle("annual")
  }, [])

  return (
    <main className="flex flex-col min-h-screen bg-[#183531] text-white px-4 pt-16 pb-6">
      {/* Header Section */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => router.back()}
        className="absolute top-10 left-4 p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={24} />
      </motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 px-4">
        <h1 className="text-3xl font-bold mb-3 text-white">Upgrade Your Plan</h1>
        <p className="text-lg text-white/80">Get more from SaddlePro with our premium plans!</p>
      </motion.div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center mb-8 bg-[#DDAD69]/20 p-4 rounded-xl relative">
        <span className={`mr-4 text-lg ${billingCycle === "annual" ? "text-white font-bold" : "text-white/60"}`}>
          Annual
        </span>
        <Switch
          checked={billingCycle === "monthly"}
          onCheckedChange={(checked) => setBillingCycle(checked ? "monthly" : "annual")}
          className="scale-125"
        />
        <span className={`ml-4 text-lg ${billingCycle === "monthly" ? "text-white font-bold" : "text-white/60"}`}>
          Monthly
        </span>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-[#DDAD69] text-white px-2 py-1 rounded text-sm"
        >
          Save more with Annual billing!
        </motion.div>
      </div>

      <div className="text-center mb-6">
        <p className="text-white text-sm">
          Annual Plan: <span className="text-[#DDAD69] font-bold">Save up to 15%</span>
        </p>
      </div>

      {/* Subscription Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 mb-8"
      >
        {plans.map((plan) => (
          <motion.button
            key={plan.name}
            onClick={() => setSelectedPlan(plan.name.toLowerCase() as any)}
            className={`w-full relative overflow-hidden ${
              selectedPlan === plan.name.toLowerCase()
                ? "bg-[#DDAD69]/20 border-[#DDAD69]"
                : "bg-white/5 border-white/20"
            } border-2 rounded-2xl p-6 transition-all duration-300 hover:bg-[#DDAD69]/30`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold mb-1">{plan.name} Plan</h3>
                  {billingCycle === "annual" && plan.name === "Platinum" && (
                    <span className="ml-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Best Value
                    </span>
                  )}
                </div>
                <p className="text-[#DDAD69] font-semibold">
                  {billingCycle === "annual" ? `${plan.annualPrice}/Year` : `${plan.monthlyPrice}/Month`}
                </p>
                {billingCycle === "annual" && <p className="text-green-400 text-sm">Save 15%</p>}
                <p className="text-white text-sm mt-2">{plan.searches}</p>
              </div>
              <ChevronRight
                className={`w-6 h-6 ${selectedPlan === plan.name.toLowerCase() ? "text-[#DDAD69]" : "text-white/40"}`}
              />
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <div className="w-full h-px bg-[#DDAD69]/20 my-8" />
        <h3 className="text-lg font-semibold mb-4 text-[#DDAD69]">Premium Features</h3>
        <ul className="space-y-4">
          {features.map(({ icon: Icon, text }, index) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className="bg-[#DDAD69]/20 p-2 rounded-full">
                <Icon className="w-5 h-5 text-[#DDAD69]" />
              </div>
              <span className="text-white/90 flex-1">{text}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Confirm Plan Selection Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-[#DDAD69] text-[#183531] py-3 rounded-xl font-semibold hover:bg-[#B78E3C] transition-colors mt-6"
        onClick={() => {
          // Here you would handle the plan upgrade
          console.log(`Upgrading to ${selectedPlan} plan with ${billingCycle} billing`)
          // After processing, you could redirect to a confirmation page or back to the profile
          router.push("/profile")
        }}
      >
        Confirm {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
      </motion.button>

      {/* Disclaimer */}
      <div className="mt-auto">
        <p className="text-center text-white/60 text-xs mt-4">
          By upgrading, you agree to our{" "}
          <Link href="/terms" className="text-[#DDAD69] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#DDAD69] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  )
}
