"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, ChevronDown, ChevronUp, Mail } from "lucide-react"
import Link from "next/link"

const sections = [
  { id: "collect", title: "Information We Collect" },
  { id: "use", title: "How We Use Your Information" },
  { id: "share", title: "Sharing of Information" },
  { id: "retention", title: "Data Retention" },
  { id: "security", title: "Security Measures" },
  { id: "rights", title: "User Rights" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Information" },
]

export default function PrivacyPolicy() {
  const router = useRouter()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const handleSubmitDataRequest = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    alert(`Data request submitted for ${email}. We'll process your request shortly.`)
    setShowEmailForm(false)
    setEmail("")
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
        <h1 className="text-2xl font-bold text-[#DDAD69] flex items-center">
          <Lock className="mr-2" size={24} />
          Privacy Policy
        </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Jump to Section */}
      <nav className="bg-[#183531] border-b border-[#DDAD69]/20 p-4">
        <h2 className="text-lg font-semibold mb-2 text-[#DDAD69]">Jump to Section:</h2>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-sm bg-[#DDAD69]/20 hover:bg-[#DDAD69]/30 px-3 py-1 rounded-full transition-colors"
            >
              {section.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Scrollable Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        <p className="text-lg">
          Your privacy matters to us. This Privacy Policy explains how SaddlePro collects, uses, and protects your
          information. By using our app, you agree to the terms of this Privacy Policy.
        </p>

        {sections.map((section) => (
          <section key={section.id} id={section.id} className="border-b border-[#DDAD69]/20 pb-4">
            <h2
              className="text-xl font-bold text-[#DDAD69] mb-2 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              {section.title}
              {expandedSection === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </h2>
            {expandedSection === section.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {section.id === "collect" && (
                  <p>We collect personal data like your name, email, and payment details, as well as app usage data.</p>
                )}
                {section.id === "use" && (
                  <ul className="list-disc pl-5">
                    <li>To personalize app analytics</li>
                    <li>To process payments securely</li>
                    <li>To improve app performance and user experience</li>
                  </ul>
                )}
                {section.id === "share" && (
                  <p>
                    We never sell your data. We only share it with trusted service providers and when required by law.
                  </p>
                )}
                {section.id === "retention" && (
                  <p>We retain your data for as long as your account is active or as needed to provide you services.</p>
                )}
                {section.id === "security" && (
                  <p>We use industry-standard encryption and secure servers to protect your data.</p>
                )}
                {section.id === "rights" && (
                  <p>
                    You have the right to access, update, or delete your personal data. Contact our support team for
                    assistance.
                  </p>
                )}
                {section.id === "changes" && (
                  <p>This Privacy Policy may be updated periodically. We encourage you to review it regularly.</p>
                )}
                {section.id === "contact" && (
                  <p>For privacy-related queries, please contact us at privacy@saddlepro.com</p>
                )}
              </motion.div>
            )}
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-[#183531] border-t border-[#DDAD69]/20 p-4 space-y-4">
        <p className="text-center text-sm">Last updated on 20 January 2025</p>
        <div className="flex justify-center space-x-4 text-sm">
          <Link href="/terms" className="text-[#DDAD69] hover:underline">
            Terms and Conditions
          </Link>
          <Link href="/support" className="text-[#DDAD69] hover:underline">
            Support
          </Link>
        </div>
        <div className="text-center">
          <button onClick={() => setShowEmailForm(true)} className="text-[#DDAD69] hover:underline text-sm">
            Request your data
          </button>
        </div>
      </footer>

      {/* Email Form Modal */}
      {showEmailForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEmailForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#183531] p-6 rounded-xl max-w-md w-full border border-[#DDAD69]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[#DDAD69] mb-4 flex items-center">
              <Mail className="mr-2" size={20} />
              Request Your Data
            </h2>
            <p className="text-white/80 mb-4">
              Enter your email address below and we'll send you a copy of all the data we have associated with your
              account.
            </p>
            <form onSubmit={handleSubmitDataRequest}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white/80 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-white/10 border border-[#DDAD69]/30 rounded text-white"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 py-2 bg-white/10 text-white rounded border border-white/20"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-[#DDAD69] text-[#183531] rounded font-semibold">
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </main>
  )
}
