"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsAndConditions() {
  const router = useRouter()
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current
        const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 5 // Add a 5px buffer
        setHasScrolledToBottom(isAtBottom)
      }
    }

    const currentRef = contentRef.current
    currentRef?.addEventListener("scroll", handleScroll)

    return () => {
      currentRef?.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleAgree = () => {
    if (isAgreed) {
      // Handle agreement logic here
      router.push("/") // Redirect to home page or onboarding flow
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#183531] text-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#183531] z-10 p-4 flex items-center justify-between border-b border-[#DDAD69]/20 mt-12">
        <button
          onClick={() => router.push("/settings")}
          className="text-white p-2 hover:text-[#DDAD69] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#DDAD69]">Terms and Conditions</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Scrollable Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-8 pb-20 space-y-6">
        <p className="text-lg">
          Welcome to SaddlePro! Please read these Terms and Conditions carefully before using our services.
        </p>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using SaddlePro, you agree to comply with and be bound by these Terms and
            Conditions, as well as any policies or guidelines incorporated herein by reference.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">2. Service Description</h2>
          <p>SaddlePro is a horse racing analysis platform that offers:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Insights and analytics for horse racing events.</li>
            <li>Course-specific performance metrics.</li>
            <li>Expert predictions and rankings.</li>
            <li>Access to historical performance data.</li>
          </ul>
          <p className="mt-2">Our services are intended for informational and entertainment purposes only.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">3. User Responsibilities</h2>
          <p>As a user of SaddlePro, you agree to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide accurate and complete registration information.</li>
            <li>Keep your account credentials confidential and secure.</li>
            <li>Refrain from sharing your account or using the app for illegal activities.</li>
            <li>Use SaddlePro in compliance with applicable laws and regulations.</li>
          </ul>
          <p className="mt-2">
            You agree not to manipulate or misuse the data or features of the app for fraudulent purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">4. Payment and Subscriptions</h2>
          <ul className="list-disc pl-6">
            <li>
              Subscription Plans: SaddlePro offers Day Passes, Monthly Plans, and Annual Plans. Full details and prices
              are available in the app.
            </li>
            <li>
              Billing: Subscriptions are billed in advance and automatically renew unless cancelled before the renewal
              date.
            </li>
            <li>
              Free Trials: Free trial periods may be offered. At the end of the trial, the subscription will
              automatically convert to a paid plan unless cancelled.
            </li>
            <li>Refund Policy: Payments are non-refundable, except as required by law.</li>
            <li>Cancellation: You can cancel your subscription at any time through your account settings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">5. Intellectual Property</h2>
          <p>
            All content, design, data, and features within SaddlePro are owned by SaddlePro and protected by copyright,
            trademark, and other intellectual property laws. You are granted a limited, non-exclusive licence to use the
            app for personal, non-commercial purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">6. Data Privacy</h2>
          <p>
            Your privacy is important to us. SaddlePro collects, processes, and stores data as outlined in our Privacy
            Policy. By using SaddlePro, you consent to the collection and use of your information as described in the
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">7. Limitations of Liability</h2>
          <ul className="list-disc pl-6">
            <li>
              SaddlePro provides data and analytics for informational purposes only. We do not guarantee specific
              outcomes or results.
            </li>
            <li>
              SaddlePro is not liable for financial losses, betting outcomes, or decisions made based on our insights.
            </li>
            <li>The app and its services are provided "as is" without any warranties, express or implied.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">8. Termination of Use</h2>
          <p>
            SaddlePro reserves the right to suspend or terminate your account without notice if you violate these Terms
            or engage in unauthorised or unlawful activities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">9. Changes to Terms</h2>
          <p>
            SaddlePro reserves the right to modify or update these Terms at any time. It is your responsibility to
            review the Terms periodically. Continued use of the app after changes are made constitutes your acceptance
            of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#DDAD69] mb-2">10. Contact Information</h2>
          <p>If you have any questions, concerns, or feedback about these Terms, please contact us at:</p>
          <p className="mt-2">Email: support@saddlepro.co</p>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#183531] border-t border-[#DDAD69]/20 p-4 space-y-4">
        <div className="flex items-center justify-center mb-4">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={isAgreed}
            onChange={() => setIsAgreed(!isAgreed)}
            className="mr-2 h-5 w-5 accent-[#DDAD69]"
            disabled={!hasScrolledToBottom}
          />
          <label htmlFor="agreeTerms" className={`${hasScrolledToBottom ? "text-white" : "text-gray-500"}`}>
            I have read and agree to these Terms and Conditions
          </label>
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={() => router.back()}
            className="px-6 py-2 border border-[#DDAD69] rounded-full text-[#DDAD69] hover:bg-[#DDAD69] hover:text-[#183531] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleAgree}
            disabled={!hasScrolledToBottom || !isAgreed}
            className={`px-6 py-2 bg-[#DDAD69] rounded-full text-[#183531] font-bold ${
              hasScrolledToBottom && isAgreed ? "hover:bg-[#B78E3C]" : "opacity-50 cursor-not-allowed"
            } transition-colors`}
            whileHover={hasScrolledToBottom && isAgreed ? { scale: 1.05 } : {}}
            whileTap={hasScrolledToBottom && isAgreed ? { scale: 0.95 } : {}}
          >
            I Agree
          </motion.button>
        </div>
        <p className="text-center text-xs text-gray-400">
          Last updated on 21 January 2025 |{" "}
          <Link href="/support" className="text-[#DDAD69] hover:underline">
            Customer Support
          </Link>
        </p>
      </footer>
    </main>
  )
}
