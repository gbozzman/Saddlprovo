"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone } from "lucide-react"

const faqs = [
  {
    question: "How do I upgrade to a premium account?",
    answer:
      "To upgrade to a premium account, go to your profile page and click on the 'Go Premium' button. Follow the prompts to complete your subscription.",
  },
  {
    question: "Can I get a refund for my subscription?",
    answer:
      "We offer refunds within 14 days of purchase if you're not satisfied with our premium features. Please contact our support team for assistance.",
  },
  {
    question: "How accurate are the horse racing predictions?",
    answer:
      "Our predictions are based on comprehensive data analysis and machine learning algorithms. While we strive for high accuracy, horse racing outcomes can be unpredictable, and our predictions should be used as a guide, not a guarantee.",
  },
  {
    question: "How often is the app updated with new races?",
    answer:
      "We update our app with new races daily. Premium users get access to race information and predictions as soon as they become available.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, we take data security very seriously. We use industry-standard encryption and secure servers to protect your personal information. For more details, please refer to our Privacy Policy.",
  },
]

export default function HelpAndSupportPage() {
  const router = useRouter()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <main className="flex flex-col min-h-screen bg-[#183531] text-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#183531] z-10 p-4 flex items-center justify-between border-b border-[#DDAD69]/20">
        <button onClick={() => router.back()} className="text-white p-2 hover:text-[#DDAD69] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">Help & Support</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {/* FAQs */}
        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-[#DDAD69]/20 pb-4">
                <button
                  className="flex justify-between items-center w-full text-left"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  {expandedFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedFaq === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-gray-300"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-[#DDAD69]" />
              <a href="mailto:support@saddlepro.com" className="hover:underline">
                support@saddlepro.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-[#DDAD69]" />
              <a href="tel:+18001234567" className="hover:underline">
                +1 (800) 123-4567
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#183531] border-t border-[#DDAD69]/20 p-4">
        <p className="text-center text-sm text-gray-400">
          Can't find what you're looking for? Our support team is here to help!
        </p>
      </footer>
    </main>
  )
}
