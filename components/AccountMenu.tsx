"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, User, Settings, HelpCircle, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface AccountMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function AccountMenu({ isOpen, onClose }: AccountMenuProps) {
  const router = useRouter()

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
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 overflow-hidden border-2 border-[#DDAD69]"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Account</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-black" />
                </button>
              </div>

              <div className="space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <item.icon size={24} className="text-[#DDAD69]" />
                    <span className="text-black text-lg">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
