"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, LogOut, Settings, HelpCircle, BookOpen, Bell } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

export function ProfileIcon() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userInitial, setUserInitial] = useState("A")
  const [nickname, setNickname] = useState("Anonymous")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    if (userData.nickname) {
      setNickname(userData.nickname)
      setUserInitial(userData.nickname.charAt(0).toUpperCase())
    }
  }, [])

  // Hide on login, splash, create account screens
  if (pathname === "/" || pathname === "/login" || pathname === "/create-account" || pathname === "/premium") {
    return null
  }

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      path: "/profile",
    },
    {
      icon: BookOpen,
      label: "Learning Hub",
      path: "/learning-hub",
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: HelpCircle,
      label: "Help",
      path: "/help",
    },
    {
      icon: LogOut,
      label: "Log Out",
      path: "/login",
      className: "text-red-500",
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 right-4 z-50 rounded-full backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors overflow-hidden"
        style={{ width: "40px", height: "40px" }}
      >
        <div className="w-full h-full relative">
          <Image src="/images/profile.png" alt="Profile" width={40} height={40} className="object-cover rounded-full" />
        </div>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-[#183531] z-50 shadow-xl"
            >
              <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-[#DDAD69]">
                    <Image
                      src="/images/profile.png"
                      alt="Profile"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-[#DDAD69]">{nickname}</h2>
                </div>

                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-4 p-3 hover:bg-white/10 rounded-xl transition-colors ${item.className || "text-white"}`}
                    >
                      <item.icon size={20} className="text-[#DDAD69]" />
                      <span className="text-lg">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
