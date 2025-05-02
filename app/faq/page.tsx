"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

const faqSections = [
  {
    title: "General Questions",
    questions: [
      {
        q: "What is SaddlePro?",
        a: "SaddlePro is your personal horse racing assistant, offering detailed analytics, expert insights, and tailored recommendations to maximize your success at the races.",
      },
      {
        q: "How do I create an account?",
        a: 'Tap "Create Account" on the login screen, enter your details, and follow the instructions. You can also sign up using Google or Apple for a faster experience.',
      },
      {
        q: "What devices can I use SaddlePro on?",
        a: "SaddlePro is optimized for smartphones and tablets but can also be accessed on desktop web browsers.",
      },
    ],
  },
  {
    title: "Search-Related Questions",
    questions: [
      {
        q: "What is a search?",
        a: "A search is counted each time you:\n• Look up detailed analytics for a specific horse.\n• Access a breakdown of a race's participants.\n• View expert recommendations for top-performing horses.",
      },
      {
        q: "Do repeated searches count?",
        a: "No. If you access the same horse or race data within 24 hours, it won't count as an additional search.",
      },
      {
        q: "How can I see how many searches I've used?",
        a: 'Your search counter is visible under your profile or subscription page (e.g., "Searches used: 3/10").',
      },
      {
        q: "What happens when I run out of searches?",
        a: "You'll receive a notification and can either wait for your searches to reset or upgrade your plan for unlimited access.",
      },
    ],
  },
  {
    title: "Subscription Questions",
    questions: [
      {
        q: "What are the subscription plans?",
        a: "SaddlePro offers three options:\n• Day Pass (£3.99): 10 searches for 24 hours.\n• Gold Plan (£9.99/month or £101.90/year): 50 searches/month.\n• Platinum Plan (£14.99/month or £152.90/year): 150 searches/month.",
      },
      {
        q: "What happens if I cancel my subscription?",
        a: "You'll retain access to premium features until the end of your billing cycle. ",
      },
      {
        q: "How do I change my subscription plan?",
        a: 'Go to "Profile" > "Manage Subscription" to upgrade or downgrade your plan.',
      },
    ],
  },
  {
    title: "Technical Questions",
    questions: [
      {
        q: "I forgot my password. What should I do?",
        a: 'Tap "Forgot Password" on the login screen and follow the steps to reset your password.',
      },
      {
        q: "Can I use SaddlePro on multiple devices?",
        a: "Yes, but your searches and account details are synced across devices.",
      },
      {
        q: "Why can't I access certain features?",
        a: "Some features are only available with premium subscriptions. Check your plan and consider upgrading for full access.",
      },
    ],
  },
  {
    title: "Payment Questions",
    questions: [
      {
        q: "How do I manage my payment details?",
        a: 'Go to "Profile" > "Manage Subscription" to update your payment method.',
      },
      {
        q: "Is there a free trial?",
        a: "SaddlePro offers a free trial for annual plans. Check the subscription page for details.",
      },
      {
        q: "Can I get a refund?",
        a: "Refunds are not provided for partially used subscriptions. For more information, check our Terms and Conditions.",
      },
    ],
  },
  {
    title: "Data & Privacy",
    questions: [
      {
        q: "What data does SaddlePro collect?",
        a: "We collect minimal data necessary to enhance your experience. Refer to our Privacy Policy for details.",
      },
      {
        q: "Is my data safe?",
        a: "Absolutely. We use industry-standard encryption to protect your information.",
      },
    ],
  },
  {
    title: "Need More Help?",
    questions: [
      {
        q: "How can I contact support?",
        a: "For further assistance, email us at support@saddlepro.co",
      },
    ],
  },
]

export default function FAQPage() {
  const router = useRouter()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
    setExpandedQuestion(null)
  }

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#183531] text-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#183531] z-10 p-4 flex items-center justify-between border-b border-[#DDAD69]/20">
        <button
          onClick={() => router.push("/settings")}
          className="text-white p-2 hover:text-[#DDAD69] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">FAQ</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* FAQ Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {faqSections.map((section) => (
          <motion.div key={section.title} layout>
            <motion.button
              onClick={() => toggleSection(section.title)}
              className="flex justify-between items-center w-full text-left py-2 border-b border-[#DDAD69]/20"
              layout
            >
              <h2 className="text-xl font-bold text-[#DDAD69]">{section.title}</h2>
              {expandedSection === section.title ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.button>
            <motion.div
              initial={false}
              animate={{ height: expandedSection === section.title ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {section.questions.map((item) => (
                <motion.div key={item.q} className="mt-4" layout>
                  <motion.button
                    onClick={() => toggleQuestion(item.q)}
                    className="flex justify-between items-center w-full text-left py-2"
                    layout
                  >
                    <h3 className="text-lg font-semibold">{item.q}</h3>
                    {expandedQuestion === item.q ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </motion.button>
                  <motion.div
                    initial={false}
                    animate={{ height: expandedQuestion === item.q ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/80 mt-2 whitespace-pre-line">{item.a}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-[#183531] border-t border-[#DDAD69]/20 p-4 text-center">
        <p className="text-sm text-white/60">
          Can't find what you're looking for?{" "}
          <Link href="/ai-chatbot" className="text-[#DDAD69] hover:underline">
            Chat with our AI Support
          </Link>
        </p>
      </footer>
    </main>
  )
}
