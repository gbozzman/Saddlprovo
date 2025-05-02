"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  HelpCircle,
  FileText,
  Trash2,
  Flag,
  LogOut,
  Globe,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [pushNotifications, setPushNotifications] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [language, setLanguage] = useState("English")

  useEffect(() => {
    // Load user preferences from localStorage
    const savedPushNotifications = localStorage.getItem("pushNotifications") === "true"
    const savedEmailNotifications = localStorage.getItem("emailNotifications") === "true"
    const savedLanguage = localStorage.getItem("language") || "English"

    setPushNotifications(savedPushNotifications)
    setEmailNotifications(savedEmailNotifications)
    setLanguage(savedLanguage)
  }, [])

  const handlePushNotificationToggle = () => {
    setPushNotifications(!pushNotifications)
    localStorage.setItem("pushNotifications", (!pushNotifications).toString())
  }

  const handleEmailNotificationToggle = () => {
    setEmailNotifications(!emailNotifications)
    localStorage.setItem("emailNotifications", (!emailNotifications).toString())
  }

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Edit profile", href: "/edit-profile" },
        { icon: Bell, label: "Notification preferences", href: "/notification-preferences" },
        { icon: Lock, label: "Privacy", href: "/privacy" },
      ],
    },
    {
      title: "Preferences",
      items: [{ icon: Globe, label: "Language", href: "/language-settings", value: language }],
    },
    {
      title: "Support & About",
      items: [
        { icon: HelpCircle, label: "FAQ", href: "/faq" },
        { icon: FileText, label: "Terms and Policies", href: "/terms" },
      ],
    },
    {
      title: "Data Management",
      items: [
        { icon: Trash2, label: "Clear Search History", href: "/clear-history" },
        { icon: Trash2, label: "Delete Account", href: "/delete-account" },
      ],
    },
    {
      title: "Actions",
      items: [
        { icon: Flag, label: "Report a problem", href: "/report-problem" },
        {
          icon: LogOut,
          label: "Log out",
          href: "/login",
          onClick: () => {
            // Here you would typically clear any auth tokens/state
            localStorage.clear()
          },
          className: "text-red-500",
        },
      ],
    },
  ]

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#183531]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-[#183531] z-10 px-4 py-4 flex items-center border-b border-[#DDAD69]/20 shadow-sm"
      >
        <button onClick={() => router.back()} className="p-2 text-white hover:text-[#DDAD69] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold ml-4 text-[#DDAD69]">Settings</h1>
      </motion.div>

      {/* Settings Content */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-[#DDAD69]/10 rounded-xl overflow-hidden shadow-md"
          >
            <h2 className="text-lg font-semibold px-4 py-3 bg-[#DDAD69]/20 text-[#DDAD69]">{section.title}</h2>
            <div className="divide-y divide-[#DDAD69]/10">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={item.onClick}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-[#DDAD69]/20 transition-colors ${item.className || ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} className="text-[#DDAD69]" />
                    <span className="font-medium text-white">{item.label}</span>
                  </div>
                  {item.value ? (
                    <span className="text-[#DDAD69]">{item.value}</span>
                  ) : (
                    <ChevronRight size={20} className="text-[#DDAD69]" />
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
